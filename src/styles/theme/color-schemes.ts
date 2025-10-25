import type { ColorSystemOptions } from "@mui/material/styles";
import type { ColorScheme } from "./types";
import { capitalBlue, capitalRed, capitalGray, capitalGreen, capitalYellow } from "./colors";

export const colorSchemes = {
  dark: {
    palette: {
      common: { black: '#000000', white: '#ffffff' },
      background: {
        default: capitalGray[900],
        defaultChannel: '17 24 39',
        paper: capitalGray[800],
        paperChannel: '31 41 55',
        level1: capitalGray[700],
        level2: capitalGray[600],
        level3: capitalGray[500],
      },
      divider: capitalGray[700],
      primary: {
        ...capitalBlue,
        light: capitalBlue[400],
        main: capitalBlue[500],
        dark: capitalBlue[600],
        contrastText: '#ffffff',
      },
      secondary: {
        ...capitalRed,
        light: capitalRed[400],
        main: capitalRed[500],
        dark: capitalRed[600],
        contrastText: '#ffffff',
      },
      neutral: { ...capitalGray },
      success: {
        ...capitalGreen,
        light: capitalGreen[400],
        main: capitalGreen[500],
        dark: capitalGreen[600],
        contrastText: '#ffffff',
      },
      warning: {
        ...capitalYellow,
        light: capitalYellow[400],
        main: capitalYellow[500],
        dark: capitalYellow[600],
        contrastText: '#000000',
      },
      error: {
        ...capitalRed,
        light: capitalRed[400],
        main: capitalRed[500],
        dark: capitalRed[600],
        contrastText: '#ffffff',
      },
      text: {
        primary: '#F9FAFB',
        secondary: '#9CA3AF',
        disabled: '#6B7280',
      },
      info: {
        ...capitalBlue,
        light: capitalBlue[300],
        main: capitalBlue[400],
        dark: capitalBlue[500],
        contrastText: '#ffffff',
      },
    },
  },
  light: {
    palette: {
      common: { black: '#000000', white: '#ffffff' },
      background: {
        default: '#ffffff',
        defaultChannel: '255 255 255',
        paper: '#ffffff',
        paperChannel: '255 255 255',
        level1: capitalGray[50],
        level2: capitalGray[100],
        level3: capitalGray[200],
      },
      divider: capitalGray[200],
      primary: {
        ...capitalBlue,
        light: capitalBlue[400],
        main: capitalBlue[500],
        dark: capitalBlue[600],
        contrastText: '#ffffff',
      },
      secondary: {
        ...capitalRed,
        light: capitalRed[400],
        main: capitalRed[500],
        dark: capitalRed[600],
        contrastText: '#ffffff',
      },
      neutral: { ...capitalGray },
      success: {
        ...capitalGreen,
        light: capitalGreen[400],
        main: capitalGreen[500],
        dark: capitalGreen[600],
        contrastText: '#ffffff',
      },
      warning: {
        ...capitalYellow,
        light: capitalYellow[400],
        main: capitalYellow[500],
        dark: capitalYellow[600],
        contrastText: '#000000',
      },
      error: {
        ...capitalRed,
        light: capitalRed[400],
        main: capitalRed[500],
        dark: capitalRed[600],
        contrastText: '#ffffff',
      },
      text: {
        primary: capitalGray[900],
        secondary: capitalGray[600],
        disabled: capitalGray[400],
      },
      info: {
        ...capitalBlue,
        light: capitalBlue[300],
        main: capitalBlue[400],
        dark: capitalBlue[500],
        contrastText: '#ffffff',
      },
    },
  },
} satisfies Partial<Record<ColorScheme, ColorSystemOptions>>;
