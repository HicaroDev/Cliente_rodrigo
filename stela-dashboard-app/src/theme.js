// 🎨 UI/UX PRO MAX — Premium Design System for Stela Dashboard

export const DRAWER_WIDTH = 260;

// Vibrant Gradients & Brand Colors
export const PRIMARY = { main: '#49a3f1', dark: '#1A73E8', gradient: 'linear-gradient(195deg, #49a3f1, #1A73E8)' };
export const INFO    = { main: '#1A73E8', dark: '#0D47A1', gradient: 'linear-gradient(195deg, #42a5f5, #1A73E8)' };
export const SUCCESS = { main: '#66BB6A', dark: '#43A047', gradient: 'linear-gradient(195deg, #66BB6A, #43A047)' };
export const WARNING = { main: '#FFA726', dark: '#FB8C00', gradient: 'linear-gradient(195deg, #FFA726, #FB8C00)' };
export const ERROR   = { main: '#EF5350', dark: '#E53935', gradient: 'linear-gradient(195deg, #EF5350, #E53935)' };
export const DARK    = { main: '#42424a', dark: '#191919', gradient: 'linear-gradient(195deg, #42424a, #191919)' };

export const GREY = {
  50:  '#F8F9FA',
  100: '#F0F2F5',
  200: '#E9ECEF',
  300: '#DEE2E6',
  400: '#CED4DA',
  500: '#ADB5BD',
  600: '#6C757D',
  700: '#495057',
  800: '#344767',
  900: '#212529',
};

// UI/UX Pro Max — Effects & Surfaces
export const GLASS_EFFECT = {
  backdropFilter: 'blur(12px) saturate(180%)',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

export const CARD_SHADOW = '0 2px 10px -1px rgba(0,0,0,0.05), 0 1px 4px -1px rgba(0,0,0,0.03)';
export const FLOAT_SHADOW = (color) =>
  `0 8px 24px -6px rgba(0,0,0,0.16), 0 12px 20px -10px ${color}80`;

export const STELA_SHADOWS = {
  nav: '0 8px 16px -4px rgba(0,0,0,0.1)',
  card: '0 4px 20px 0 rgba(0,0,0,0.05)',
  button: '0 3px 5px -1px rgba(0,0,0,0.08), 0 2px 3px -1px rgba(0,0,0,0.05)',
};
