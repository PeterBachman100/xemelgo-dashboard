export const TOKENS = {
  neutral: {
    main: '#64748b',
    bg: 'transparent',
    text: '#475569',
    border: 'none',
    fontWeight: 500,
    severity: 'info', // For Snackbars
  },
  success: {
    main: '#2e7d32',
    bg: '#f0fdf4',
    text: '#166534',
    border: '1px solid #2e7d3233',
    fontWeight: 600,
    severity: 'success',
  },
  error: {
    main: '#d32f2f',
    bg: '#fef2f2',
    text: '#991b1b',
    border: '1px solid #d32f2f33',
    fontWeight: 800,
    severity: 'error',
  },
  archive: {
    main: '#94a3b8',
    bg: '#f8fafc',
    text: '#475569',
    border: '1px solid #94a3b833',
    fontWeight: 500,
    severity: 'info',
  },
};

export const STATUS_MAP = {
  active: TOKENS.neutral,
  missing: TOKENS.error,
  complete: TOKENS.success,
  consumed: TOKENS.archive,
};

export const ACTION_MAP = {
  move: TOKENS.neutral,
  scan: TOKENS.neutral,
  receive: TOKENS.neutral,
  consume: TOKENS.success,
  complete: TOKENS.success,
  missing: TOKENS.error,
};

export const LAYOUT = {
  headerHeight: 64,
  pagePadding: { xs: 2, md: 4 },
};