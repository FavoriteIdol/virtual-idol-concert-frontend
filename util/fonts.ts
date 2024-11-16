// util/fonts.ts

import localFont from 'next/font/local';

export const tt = localFont({
  src: '../public/fonts/gg.ttf',
    variable: '--font-tt',
    display: 'swap',
});

export const nanum = localFont({
  src: '../public/fonts/NanumSquareL.ttf',
    variable: '--font-nanum',
    display: 'swap',
});