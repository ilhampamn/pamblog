import type { TokenSet } from './types.js';

/** Compute relative luminance (0–1) from a hex color string. */
function hexLuminance(hex: string): number {
  const m = hex.trim().match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return 1; // assume light if unparseable
  const [r, g, b] = m.slice(1).map(x => {
    const c = parseInt(x, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function toCss(tokens: TokenSet, selector = ':root'): string {
  // Skip empty-string tokens (effect tokens disabled for this theme) so that
  // var(--effect-token, fallback) in component CSS correctly uses the fallback.
  const lines = Object.entries(tokens)
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  // Derived variable: 1 when card background is dark (luminance < 0.15), else 0.
  // Checkout components use this to auto-invert dark logos on dark backgrounds.
  const bgCard = (tokens as unknown as Record<string, string>)['--bg-card-default'] ?? '';
  const isDark = hexLuminance(bgCard) < 0.15;
  const derived = `  --co-bg-is-dark: ${isDark ? '1' : '0'};`;

  return `${selector} {\n${lines}\n${derived}\n}\n`;
}

export function fromCss(css: string): Partial<TokenSet> {
  const result: Partial<TokenSet> = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    (result as Record<string, string>)[m[1]] = m[2].trim();
  }
  return result;
}
