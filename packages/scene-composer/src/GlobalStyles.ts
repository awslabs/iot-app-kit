import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  .sidePanelTabs {
    overflow-y: auto;
  }
  .sidePanelTabs > div:first-of-type {
    padding: 0 !important; // This removes the padding of the Polaris Tabs Component
  }`;
