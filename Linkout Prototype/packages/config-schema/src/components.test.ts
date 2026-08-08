import { describe, it, expect } from 'vitest';
import {
  compileComponentOverrides,
  compileComponentCss,
  sanitizeComponentCss,
  COMPONENT_ROLES,
} from './components.js';

describe('compileComponentOverrides', () => {
  it('returns empty string for undefined / empty overrides', () => {
    expect(compileComponentOverrides(undefined)).toBe('');
    expect(compileComponentOverrides(null)).toBe('');
    expect(compileComponentOverrides({})).toBe('');
    expect(compileComponentOverrides({ payButton: {} })).toBe('');
  });

  it('emits a scoped block with the mapped CSS variable', () => {
    const css = compileComponentOverrides({ payButton: { bg: '#FF2E88' } });
    expect(css).toContain('.checkout-scope {');
    expect(css).toContain('--ov-paybtn-bg: #FF2E88;');
  });

  it('honours a custom scope', () => {
    const css = compileComponentOverrides({ payButton: { bg: '#000000' } }, '.preview');
    expect(css.startsWith('.preview {')).toBe(true);
  });

  it('skips empty-string values so the token fallback wins', () => {
    const css = compileComponentOverrides({ payButton: { bg: '', text: '#fff' } });
    expect(css).not.toContain('--ov-paybtn-bg');
    expect(css).toContain('--ov-paybtn-text: #fff;');
  });

  it('ignores unknown roles and unknown props', () => {
    const css = compileComponentOverrides({
      bogusRole: { bg: '#fff' },
      payButton: { bogusProp: '#fff', bg: '#111111' },
    });
    expect(css).not.toContain('#fff');
    expect(css).toContain('--ov-paybtn-bg: #111111;');
  });

  it('emits multiple roles and props in catalog order', () => {
    const css = compileComponentOverrides({
      cardSurface: { borderColor: '#222222' },
      payButton: { bg: '#111111' },
    });
    // payButton is earlier in the catalog than cardSurface
    expect(css.indexOf('--ov-paybtn-bg')).toBeLessThan(css.indexOf('--ov-card-border-color'));
  });

  it('every catalog cssVar is unique', () => {
    const vars = COMPONENT_ROLES.flatMap((r) => r.props.map((p) => p.cssVar));
    expect(new Set(vars).size).toBe(vars.length);
  });

  it('every role has a selector', () => {
    for (const role of COMPONENT_ROLES) {
      expect(role.selector).toBeTruthy();
    }
  });
});

describe('sanitizeComponentCss', () => {
  it('strips braces so declarations cannot break out of their block', () => {
    expect(sanitizeComponentCss('color: red; } .config-tree { display: none;'))
      .toBe('color: red;  .config-tree  display: none;');
  });

  it('strips angle brackets to block </style> injection', () => {
    expect(sanitizeComponentCss('color: red; </style><script>alert(1)')).not.toContain('<');
  });

  it('strips @import', () => {
    expect(sanitizeComponentCss('@import url(evil.css); color: red;')).toBe('color: red;');
  });
});

describe('compileComponentCss', () => {
  it('returns empty string for empty / missing input', () => {
    expect(compileComponentCss(undefined)).toBe('');
    expect(compileComponentCss({})).toBe('');
    expect(compileComponentCss({ payButton: '   ' })).toBe('');
  });

  it('wraps declarations in scope + role selector', () => {
    const css = compileComponentCss({ payButton: 'transform: skew(-4deg);' });
    expect(css).toContain('.checkout-scope .co-paybtn {');
    expect(css).toContain('transform: skew(-4deg);');
  });

  it('honours a custom scope', () => {
    const css = compileComponentCss({ payButton: 'color: red;' }, '.preview');
    expect(css.startsWith('.preview .co-paybtn {')).toBe(true);
  });

  it('ignores unknown roles', () => {
    expect(compileComponentCss({ bogus: 'color: red;' })).toBe('');
  });
});
