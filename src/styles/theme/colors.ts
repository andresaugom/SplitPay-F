import type { PartialColor } from "@mui/material/styles";

export const capitalBlue = {
  50: '#e9f3fa',
  100: '#c8e1f3',
  200: '#9cc8e9',
  300: '#6da9db',
  400: '#468bca',
  500: '#0276b1', // main blue (replaced with project blue)
  600: '#004879',
  700: '#00355d',
  800: '#002844',
  900: '#001f35',
  950: '#001524',
} satisfies PartialColor;

// Project-wide single-color constants
export const white = '#ffffff';
export const black = '#000000';


export const capitalRed = {
  50: '#fdecea',
  100: '#fbd0cb',
  200: '#f3a199',
  300: '#eb7269',
  400: '#e0493f',
  500: '#d03027', // swoosh red (replaced with project red)
  600: '#b72620',
  700: '#8f1e19',
  800: '#671714',
  900: '#4a120f',
  950: '#290a08',
} satisfies PartialColor;

export const capitalGray = {
  50: '#f9fafb',
  100: '#dddddd', // light gray (user provided)
  200: '#d9d9d9', // secondary light gray (user provided)
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#545454', // main gray (user provided)
  600: '#444444',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#0a0f17',
} satisfies PartialColor;

export const capitalGreen = {
  50: '#ecfdf3',
  100: '#d1fae0',
  200: '#a7f3c9',
  300: '#6ee7ad',
  400: '#34d399',
  500: '#00A86B', // success green
  600: '#008c5b',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
  950: '#022c22',
} satisfies PartialColor;

export const capitalYellow = {
  50: '#fffbea',
  100: '#fff2c6',
  200: '#ffe587',
  300: '#ffd049',
  400: '#ffc72c',
  500: '#ffb800', // warning
  600: '#e09b00',
  700: '#b77a00',
  800: '#8f5e00',
  900: '#734b00',
  950: '#432800',
} satisfies PartialColor;
