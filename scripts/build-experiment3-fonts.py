#!/usr/bin/env python3
"""Repack the /experiment-3 display faces from assets-experiment-3 into WOFF2.

The four candidate logo faces ship as TTFs downloaded from FontStruct/dafont,
and two things are wrong with using them directly:

  * Kemasyuran Jawa's format-4 cmap references glyph id 84 in an 84-glyph font.
    Chrome's font sanitiser rejects the whole file for it ("cmap: Range glyph
    reference too high (84 > 83)"), the @font-face load fails, and the masthead
    silently falls back to a system serif — a failure that looks like a design
    choice rather than a bug. Running the subsetter rebuilds the cmap from the
    parsed mapping, which drops the bad range.

  * They are 117 KB of TTF between them for four faces that only ever set one
    wordmark. Subset to printable ASCII and repacked as WOFF2 they come to
    about 22 KB.

Usage:  python3 scripts/build-experiment3-fonts.py
Needs:  pip3 install fonttools brotli
"""

import pathlib
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-experiment-3"
DEST = ROOT / "src/app/fonts/experiment3"

FACES = {
    "Upakarti": SRC / "upakarti/upakarti.ttf",
    "UpakartiSerong": SRC / "upakarti/Upakarti Serong.ttf",
    "KemasyuranJawa": SRC / "kemasyuran-jawa/kemasyuran_jawa.ttf",
    "Jawadwipa": SRC / "jawadwipa-adisastra/Jawadwipa.ttf",
}


def build(name: str, path: pathlib.Path) -> None:
    font = TTFont(path)

    covered = set()
    for table in font["cmap"].tables:
        covered |= set(table.cmap.keys())
    # Printable ASCII only: these faces set a wordmark, not running text.
    keep = sorted(cp for cp in covered if 0x20 <= cp <= 0x7E)

    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]  # keep the family/licence names intact
    options.notdef_outline = True
    options.recalc_bounds = True

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=keep)
    subsetter.subset(font)

    font.flavor = "woff2"
    out = DEST / f"{name}.woff2"
    font.save(out)
    print(f"{name:<16} {path.stat().st_size / 1024:6.1f} KB -> {out.stat().st_size / 1024:5.1f} KB")


def main() -> int:
    DEST.mkdir(parents=True, exist_ok=True)
    missing = [str(p) for p in FACES.values() if not p.exists()]
    if missing:
        print("missing source fonts:\n  " + "\n  ".join(missing), file=sys.stderr)
        return 1
    for name, path in FACES.items():
        build(name, path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
