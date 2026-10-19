"""Turn one of Ilham's photographs into a ballpoint drawing in the site's ink.

Used for the footer landscape (decisions 2026-10-19): a pen drawing made
from a real photo of a place he went, so it stays evidence rather than an
invented scene. One ink (#0120B1), transparent paper, deterministic (seeded).

  python3 scripts/ink-drawing.py <photo.jpg> <out.webp> [--width 2400] [--seed 7]
      [--crop-top 0.35] [--fade 0.3]

Needs numpy, pillow, opencv-python-headless.

How it draws:
  1. tone: darkness from the photo with local contrast (CLAHE), so dark
     hillsides get more strokes;
  2. direction: strokes follow the land's contours (perpendicular to the
     image gradient, from a smoothed structure tensor); where the photo has
     no clear direction they lie almost flat, like a quick landscape sketch;
  3. layers: one pass of contour strokes everywhere there is tone, a cross-
     hatch only in the shadows, a third in the darkest parts, and the
     ridgelines and silhouettes from edge detection;
  4. the top of the drawing thins out into the paper, so text can sit above.
"""
import argparse
import math
import random

import cv2
import numpy as np
from PIL import Image, ImageDraw

INK = (0x01, 0x20, 0xB1)
PLATE = (0xFF, 0x6C, 0x2F)  # the second plate (decisions 2026-10-19)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('photo')
    ap.add_argument('out')
    ap.add_argument('--width', type=int, default=2400)
    ap.add_argument('--seed', type=int, default=7)
    ap.add_argument('--plates', action='store_true', help='two-colour: orange plate for the light, cobalt for the shadows')
    ap.add_argument('--crop-top', type=float, default=0.0, help='fraction of the photo to drop from the top')
    ap.add_argument('--fade', type=float, default=0.05, help='fraction of height that thins into paper')
    a = ap.parse_args()
    rnd = random.Random(a.seed)
    np.random.seed(a.seed)

    src = cv2.imread(a.photo)
    src = src[int(src.shape[0] * a.crop_top):]
    WW = 1200  # working resolution for the fields
    h0, w0 = src.shape[:2]
    WH = round(h0 * WW / w0)
    img = cv2.resize(src, (WW, WH), interpolation=cv2.INTER_AREA)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.createCLAHE(clipLimit=1.3, tileGridSize=(6, 6)).apply(gray)
    g = cv2.GaussianBlur(gray, (0, 0), 1.6).astype(np.float32) / 255.0

    # Tone: 0 = paper, 1 = darkest.
    t = 1.0 - g
    lo, hi = np.percentile(t, 3), np.percentile(t, 99.2)
    t = np.clip((t - lo) / (hi - lo), 0, 1) ** 1.9

    # Direction field.
    gb = cv2.GaussianBlur(g, (0, 0), 2.5)
    gx = cv2.Sobel(gb, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(gb, cv2.CV_32F, 0, 1, ksize=3)
    jxx = cv2.GaussianBlur(gx * gx, (0, 0), 12)
    jxy = cv2.GaussianBlur(gx * gy, (0, 0), 12)
    jyy = cv2.GaussianBlur(gy * gy, (0, 0), 12)
    theta = 0.5 * np.arctan2(2 * jxy, jxx - jyy) + math.pi / 2  # along the contour
    tr = jxx + jyy + 1e-9
    det = np.sqrt((jxx - jyy) ** 2 + 4 * jxy ** 2)
    coh = np.clip(det / tr, 0, 1) ** 0.8
    # Blend with a near-flat default where direction is weak (doubled angles
    # so opposite directions don't cancel).
    base = -0.06
    cx = coh * np.cos(2 * theta) + (1 - coh) * math.cos(2 * base)
    cy = coh * np.sin(2 * theta) + (1 - coh) * math.sin(2 * base)
    ang = 0.5 * np.arctan2(cy, cx)
    ux, uy = np.cos(ang), np.sin(ang)

    # Thin out towards the top so the drawing comes up out of the paper.
    ys = np.linspace(0, 1, WH)[:, None]
    f = np.clip(ys / max(a.fade, 1e-3), 0, 1)
    fade = f * f * (3 - 2 * f)

    S = a.width / WW * 2  # canvas scale (2x supersampling)
    CW, CH = round(WW * S), round(WH * S)
    keys = ('a1', 'a2', 'a3', 'b', 'c', 'e', 'o1', 'o2')
    layers = {k: Image.new('L', (CW, CH), 0) for k in keys}
    alpha = {'a1': 0.9, 'a2': 0.7, 'a3': 0.5, 'b': 0.65, 'c': 0.7, 'e': 0.85, 'o1': 0.85, 'o2': 0.6}
    draws = {k: ImageDraw.Draw(v) for k, v in layers.items()}
    lw = max(1, round(S * 0.5))

    def sample(arr, x, y):
        xi, yi = int(x), int(y)
        if xi < 0 or yi < 0 or xi >= WW or yi >= WH:
            return None
        return arr[yi, xi]

    def trace(x, y, turn, length, thr):
        pts = [(x, y)]
        for direction in (1, -1):
            px, py = x, y
            seg = []
            for _ in range(int(length / 2)):
                vx, vy = sample(ux, px, py), sample(uy, px, py)
                if vx is None:
                    break
                c, s_ = math.cos(turn), math.sin(turn)
                dx, dy = vx * c - vy * s_, vx * s_ + vy * c
                px, py = px + direction * dx, py + direction * dy
                tt = sample(t, px, py)
                if tt is None or tt < thr:
                    break
                seg.append((px, py))
            pts = (seg[::-1] + pts) if direction == -1 else (pts + seg)
        return pts

    def layer(n, thr, turn, lmin, lmax, keys, jitter=0.0):
        weights = ((np.clip(t - thr, 0, None) ** 1.3) * fade).ravel()
        if weights.sum() == 0:
            return
        idx = np.random.choice(weights.size, size=n, p=weights / weights.sum())
        for k in idx:
            y, x = divmod(int(k), WW)
            x += rnd.random()
            y += rnd.random()
            tt = t[int(y), int(x)]
            length = lmin + (lmax - lmin) * rnd.random() * (0.6 + 0.4 * tt)
            pts = trace(x, y, turn + rnd.uniform(-jitter, jitter), length, thr)
            if len(pts) < 3:
                continue
            draws[rnd.choice(keys)].line([(px * S, py * S) for px, py in pts], fill=255, width=lw)

    if a.plates:
        # Plate 2 carries the light: long, calm strokes over the sunlit land
        # and sky; the cobalt plate keeps only the shadows and the lines.
        layer(22000, 0.03, 0.0, 12, 44, ['o1', 'o2'], jitter=0.04)
        layer(14000, 0.32, 0.0, 10, 36, ['a1', 'a2', 'a3'], jitter=0.04)
    else:
        layer(26000, 0.14, 0.0, 10, 40, ['a1', 'a2', 'a3'], jitter=0.04)
    layer(9000, 0.45, 0.95, 5, 16, ['b'], jitter=0.08)
    layer(4000, 0.7, -0.75, 4, 12, ['c'], jitter=0.1)

    # Ridgelines and silhouettes.
    edges = cv2.Canny((cv2.GaussianBlur(g, (0, 0), 1.8) * 255).astype(np.uint8), 35, 95)
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    for c in contours:
        if len(c) < 30:
            continue
        pts = c[:, 0, :].astype(np.float32)
        y_mid = float(pts[:, 1].mean())
        if rnd.random() > float(fade[min(WH - 1, int(y_mid)), 0]):
            continue
        pts = cv2.approxPolyDP(pts.reshape(-1, 1, 2), 0.6, False)[:, 0, :]
        draws['e'].line([(float(px) * S, float(py) * S) for px, py in pts], fill=255, width=lw)

    out_h = round(WH * a.width / WW)

    def coverage(names):
        c = np.ones((CH, CW), np.float32)
        for k in names:
            c *= 1 - (np.asarray(layers[k], np.float32) / 255.0) * alpha[k]
        img = Image.fromarray(((1 - c) * 255).astype(np.uint8)).resize((a.width, out_h), Image.LANCZOS)
        return np.asarray(img, np.float32) / 255.0

    blue = coverage(['a1', 'a2', 'a3', 'b', 'c', 'e'])
    if a.plates:
        orange = coverage(['o1', 'o2'])
        # Out of register by a hair, the way two plates land on a real press.
        orange = np.roll(orange, (max(1, a.width // 1200), max(2, a.width // 800)), axis=(0, 1))
        # Overprint like ink on white: each ink filters the light (multiply),
        # then express the result as one colour plus alpha over the paper.
        trans = np.ones((out_h, a.width, 3), np.float32)
        for cov, col in ((orange, PLATE), (blue, INK)):
            col = np.array(col, np.float32) / 255.0
            trans *= 1 - cov[..., None] * (1 - col)
        alpha_out = np.clip(1 - trans.min(axis=2), 0, 1)
        safe = np.maximum(alpha_out, 1e-4)[..., None]
        rgb = np.clip(1 - (1 - trans) / safe, 0, 1)
        arr = np.dstack([(rgb * 255).astype(np.uint8), (alpha_out * 255).astype(np.uint8)])
        rgba = Image.fromarray(arr)
    else:
        rgba = Image.new('RGBA', (a.width, out_h), INK + (0,))
        rgba.putalpha(Image.fromarray((blue * 255).astype(np.uint8)))
    rgba.save(a.out, 'WEBP', quality=88, method=6)
    print('wrote', a.out, rgba.size)


if __name__ == '__main__':
    main()
