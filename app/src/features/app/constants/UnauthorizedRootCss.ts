import { createGlobalStyle } from 'styled-components';

export const UnauthorizedRootCss = createGlobalStyle`
  body, #root {
    margin: 0;
    min-height: 100vh;
    height: 100vh;
    width: 100vw;
    color: #676666; //TODO - check theme typography color and set in theme
  }
`;
