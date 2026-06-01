/** Color tokens via CSS variables (see globals.css) — work in light & dark mode */
export const appColors = {
  sage: 'var(--sage)',
  sageLight: 'var(--sage-light)',
  sageMuted: 'var(--sage-muted)',
  cream: 'var(--cream)',
  paper: 'var(--paper)',
  ink: 'var(--ink)',
  inkMuted: 'var(--ink-muted)',
  border: 'var(--border)',
  blush: 'var(--blush)',
  mist: 'var(--mist)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  success: 'var(--success)',
};

export const categoryColors = {
  Food: { bg: '#faf3eb', color: '#9a7b5c' },
  Grocery: { bg: '#eaf4f1', color: '#5a7d72' },
  Fuel: { bg: '#eef0f4', color: '#6b7280' },
  Shopping: { bg: '#f5eef8', color: '#8b7a94' },
  EMI: { bg: '#f0f4fa', color: '#6b7d94' },
  Bills: { bg: '#faf0ee', color: '#9a7a72' },
  Entertainment: { bg: '#f8f0f5', color: '#947a8b' },
  Travel: { bg: '#eef6fa', color: '#5a8494' },
  Medical: { bg: '#f0faf0', color: '#5a8a6a' },
  Other: { bg: '#f4f4f5', color: '#7a7a82' },
};

export const inputStyles = {
  borderRadius: '12px',
  borderColor: 'var(--border)',
  bg: 'var(--paper)',
  color: 'var(--ink)',
  _focus: {
    borderColor: 'var(--sage)',
    boxShadow: '0 0 0 1px var(--sage)',
  },
};
