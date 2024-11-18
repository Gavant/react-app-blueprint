import { createGlobalStyle } from 'styled-components';

/* eslint-disable import/extensions */
import flaticonEot from '~/assets/fonts/flaticon.eot';
import flaticonSvg from '~/assets/fonts/flaticon.svg';
import flaticonTTF from '~/assets/fonts/flaticon.ttf';
import flaticonWoff from '~/assets/fonts/flaticon.woff';
import flaticonWoff2 from '~/assets/fonts/flaticon.woff2';

export const UnauthorizedRootCss = createGlobalStyle`
  body, #root {
    margin: 0;
    min-height: 100vh;
    height: 100vh;
    width: 100vw;
    color: #676666; //TODO - check theme typography color and set in theme
  }
  @font-face {
    font-family: "flaticon";
    src: url(${flaticonTTF}) format("truetype"),
         url(${flaticonWoff}) format("woff"),
         url(${flaticonWoff2}) format("woff2"),
         url(${flaticonEot}) format("embedded-opentype"),
         url(${flaticonSvg}) format("svg");
  }

  i[class^="flaticon-"]:before, i[class*=" flaticon-"]:before {
    font-family: "flaticon" !important;
    font-style: normal;
    font-weight: normal !important;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
