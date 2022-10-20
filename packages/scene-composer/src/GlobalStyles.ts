import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  .tm-side-panel-tabs {
    height: 100vh;
    max-width: 100vw;
    overflow: auto;
  }
  .tm-side-panel-tabs > div:first-of-type {
    padding: 0 !important; // This removes the padding of the AWSUI Tabs Component
  }`;
