export const BREAKPOINT = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
}
export type Breakpoint = keyof typeof BREAKPOINT

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
export const GRID_COLUMN = 12
export const GRID_GAP = SPACING.md

export const FONT_SIZES = {
  xxs: 12,
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
};
export const FONT_WEIGHTS = {
  regular: 'normal',
  medium: '500',
  bold: 'bold',
};
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  round: 9999,
};