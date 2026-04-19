export const COLOR_PALETTE = {
  primary: {
    50: '#f0f9ff',   
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  
    600: '#0284c7',  
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',  
  },
  secondary: {
    50: '#f8fafc',   
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',  
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',  
  },
  success: {
    light: '#dcfce7',  
    dark: '#166534',   
    text: '#15803d',
    border: '#86efac',
  },
  warning: {
    light: '#fef3c7',  
    dark: '#92400e',   
    text: '#d97706',
    border: '#fcd34d',
  },
  error: {
    light: '#fee2e2',  
    dark: '#7f1d1d',   
    text: '#dc2626',
    border: '#fca5a5',
  },
  info: {
    light: '#dbeafe',  
    dark: '#0c4a6e',   
    text: '#0284c7',
    border: '#7dd3fc',
  },
  glass: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    bgDeep: 'rgba(255, 255, 255, 0.1)',
    borderDeep: 'rgba(255, 255, 255, 0.2)',
  },
};

export const SPACING = {
  xs: '0.25rem',   
  sm: '0.5rem',    
  md: '1rem',      
  lg: '1.5rem',    
  xl: '2rem',      
  '2xl': '2.5rem', 
  '3xl': '3rem',   
  '4xl': '4rem',   
};

export const TRANSITIONS = {
  duration: {
    fast: '75ms',
    base: '150ms',
    slow: '200ms',
    slower: '300ms',
    slowest: '500ms',
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
