import type { TokenSet, ValidationIssue } from './types.js';

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrast(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  if (!c1 || !c2) return 1;
  const l1 = relativeLuminance(...c1);
  const l2 = relativeLuminance(...c2);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

function isRedFamily(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const [r, g, b] = rgb;
  return r > 150 && r > g * 1.5 && r > b * 1.5;
}

export function validate(tokens: TokenSet): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const bg = tokens['--bg-input-default'] ?? '#FFFFFF';

  // WCAG AA: body text ≥ 4.5:1
  const textTokens: Array<keyof TokenSet> = [
    '--text-body-default', '--text-body-soft', '--text-body-subtle', '--text-error-default',
  ];
  for (const key of textTokens) {
    const val = tokens[key];
    if (val && val.startsWith('#') && contrast(val, bg) < 4.5) {
      issues.push({
        token: key, rule: 'contrast',
        message: `${key} contrast ratio ${contrast(val, bg).toFixed(2)} is below 4.5:1 (WCAG AA)`,
        severity: 'error', autoFixable: true,
      });
    }
  }

  // Error/destructive must be red-family
  const errorTokens: Array<keyof TokenSet> = ['--text-error-default', '--bg-action-destructive'];
  for (const key of errorTokens) {
    const val = tokens[key];
    if (val && val.startsWith('#') && !isRedFamily(val)) {
      issues.push({
        token: key, rule: 'error-red',
        message: `${key} must be a red-family color`,
        severity: 'error', autoFixable: false,
      });
    }
  }

  // Focus border must differ from default input border
  if (tokens['--border-input-focused'] === tokens['--border-input-default']) {
    issues.push({
      token: '--border-input-focused', rule: 'focus-distinct',
      message: 'Focus border must differ visibly from the default input border',
      severity: 'error', autoFixable: false,
    });
  }

  // Destructive must differ from primary
  if (tokens['--bg-action-destructive'] === tokens['--bg-action-primary']) {
    issues.push({
      token: '--bg-action-destructive', rule: 'destructive-distinct',
      message: 'Destructive action must be visually distinct from primary action',
      severity: 'error', autoFixable: false,
    });
  }

  // Loader accent must have sufficient contrast on loader card (≥ 3:1 — large UI component)
  const loadingCard = tokens['--bg-loading-card'];
  const loaderAccent = tokens['--loader-accent'];
  if (loadingCard && loaderAccent &&
      loadingCard.startsWith('#') && loaderAccent.startsWith('#') &&
      contrast(loaderAccent, loadingCard) < 3) {
    issues.push({
      token: '--loader-accent', rule: 'contrast',
      message: `--loader-accent contrast ratio ${contrast(loaderAccent, loadingCard).toFixed(2)} on --bg-loading-card is below 3:1`,
      severity: 'error', autoFixable: true,
    });
  }

  // Status error must be red-family
  const statusError = tokens['--status-error'];
  if (statusError && statusError.startsWith('#') && !isRedFamily(statusError)) {
    issues.push({
      token: '--status-error', rule: 'error-red',
      message: '--status-error must be a red-family color',
      severity: 'error', autoFixable: false,
    });
  }

  return issues;
}
