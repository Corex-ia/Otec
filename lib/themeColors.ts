/**
 * DESIGN SYSTEM - El Poder de Crear OTEC
 *
 * Paleta unificada para Corporate Site + CRM + LMS
 * Primario: Violeta #5D3FD3 | Acento: Naranja #FF8C42
 */

export const brand = {
  purple: '#5D3FD3',
  purpleDark: '#4A2FB3',
  purpleLight: '#7B5CE7',
  purplePale: '#F0ECFF',
  purpleMid: '#EDE9FF',

  orange: '#FF8C42',
  orangeDark: '#E5722A',
  orangeLight: '#FFA066',
  orangePale: '#FFF3E8',

  blue: '#2F5E9E',
  blueLight: '#4A90E2',
  bluePale: '#EBF2FF',
} as const;

export const getThemeColors = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    return {
      primary: '#7B5CE7',
      primaryLight: 'rgba(123, 92, 231, 0.15)',
      secondary: '#4A90E2',
      accent: '#FFA066',
      accentLight: 'rgba(255, 160, 102, 0.15)',

      bgPrimary: '#0A0914',
      bgSecondary: '#13102B',
      bgLight: '#1A1735',
      bgCard: '#13102B',

      textPrimary: '#F1F0FF',
      textSecondary: '#9E9BC0',
      textMuted: '#6B6890',

      border: '#2A2650',
      borderLight: '#1A1735',

      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#4A90E2',

      overlay: 'rgba(0, 0, 0, 0.75)',
      overlayLight: 'rgba(0, 0, 0, 0.5)',
    };
  }

  return {
    primary: '#5D3FD3',
    primaryLight: '#F0ECFF',
    secondary: '#2F5E9E',
    accent: '#FF8C42',
    accentLight: '#FFF3E8',

    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8F7FF',
    bgLight: '#F3F1FC',
    bgCard: '#FFFFFF',

    textPrimary: '#1A1040',
    textSecondary: '#5E5A80',
    textMuted: '#9E9BC0',

    border: '#E4E1F5',
    borderLight: '#F0ECFF',

    success: '#059669',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#2563EB',

    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  };
};

export const shadows = {
  sm: '0 1px 3px rgba(93, 63, 211, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 16px rgba(93, 63, 211, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 32px rgba(93, 63, 211, 0.14), 0 4px 8px rgba(0, 0, 0, 0.08)',
  xl: '0 20px 48px rgba(93, 63, 211, 0.18), 0 8px 16px rgba(0, 0, 0, 0.08)',
  orange: '0 8px 24px rgba(255, 140, 66, 0.3)',
  purple: '0 8px 24px rgba(93, 63, 211, 0.3)',
} as const;
