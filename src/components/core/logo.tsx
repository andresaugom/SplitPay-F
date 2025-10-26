'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 120;
const WIDTH = 120;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  let url: string;

  if (emblem) {
    url = color === 'light' ? '/assets/logoSplitPay.png' : '/assets/logoSplitPay.png';
  } else {
    url = color === 'light' ? '/assets/logoSplitPay.png' : '/assets/logoSplitPay.png';
  }

  return (
    <Box
      alt="img"
      component="img"
      src={url}
      // --- INICIO DE CAMBIOS ---
      sx={{
        height: height, // Pasa height como CSS
        width: width,   // Pasa width como CSS
        objectFit: 'contain' // Tu línea es correcta
      }}
      // --- FIN DE CAMBIOS ---
      
      // Borra esto, ya no es necesario
      // height={height}
      // width={width}
    />
  );
}
export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
