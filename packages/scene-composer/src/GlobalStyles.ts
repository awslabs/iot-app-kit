import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  .sidePanelTabs {
    overflow: auto;
    height: 100vh;
  }
  .sidePanelTabs > div:first-of-type {
    padding: 0 !important; // This removes the padding of the AWSUI Tabs Component
  }`;
