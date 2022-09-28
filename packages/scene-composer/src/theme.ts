import * as awsui from '@awsui/design-tokens';
/*
TODO: Shadows are not exported from the design token library.
Extract the below to a separate file and add dark mode support.

Below are styles copied from awsui src code
    shadow: {
      default: {
        name: 'shadow-default',
        value: '{color.grey.transparent-heavy}',
      },
      medium: {
        name: 'shadow-medium',
        value: '{color.grey.transparent}',
      },
      side: {
        name: 'shadow-side',
        value: '{color.grey.transparent-light}',
      },
    },

    'transparent-heavy': {
      value: 'rgba(0, 28, 36, 0.5)',
      'value-dark': 'rgba(0, 0, 0, 0.5)',
    },
    transparent: {
      value: 'rgba(0, 28, 36, 0.3)',
      'value-dark': 'rgba(0, 0, 0, 0.3)',
    },
    'transparent-light': {
      value: 'rgba(0, 28, 36, 0.15)',
      'value-dark': 'rgba(0, 0, 0, 0.3)',
    },

// We drop shadow to three sides because 1px blur works inconsistently between browsers
// default shadow for most of the cases
$box-shadow: 0 1px 1px 0 awsui.$color-shadow-medium, 1px 1px 1px 0 awsui.$color-shadow-side,
  -1px 1px 1px 0 awsui.$color-shadow-side;
// shadow for components that pop up to the top, for example dropdown at the bottom of the screen
$box-shadow-up: 0 -1px 1px 0 awsui.$color-shadow-medium, 1px -1px 1px 0 awsui.$color-shadow-side,
  -1px -1px 1px 0 awsui.$color-shadow-side;
// shadow for inner elements inside containers, that already have shadow around
$box-shadow-inner: 0px 1px 4px -2px awsui.$color-shadow-default;

// shadow for clickable elements, like buttons
$box-shadow-focused: theming.themed-value(
  $polaris: 0 0 0 2px awsui.$color-border-item-focused,
  $uxdg: 0 0 8px awsui.$color-border-item-focused
);
// shadow for form input elements, excluding buttons
$box-shadow-focused-light: theming.themed-value(
  $polaris: 0 0 0 1px awsui.$color-border-item-focused,
  $uxdg: $box-shadow-focused
);
*/

namespace light {
  export namespace color {
    export namespace grey {
      export const transparent = 'rgba(0, 28, 36, 0.3)';
      export const transparentLight = 'rgba(0, 28, 36, 0.15)';
    }
  }
}

namespace dark {
  export namespace color {
    export namespace grey {
      export const transparent = 'rgba(0, 0, 0, 0.3)';
      export const transparentLight = 'rgba(0, 0, 0, 0.3)';
    }
  }
}

const colorShadowMediumLight = light.color.grey.transparent;
const colorShadowSideLight = light.color.grey.transparentLight;
const colorShadowMediumDark = dark.color.grey.transparent;
const colorShadowSideDark = dark.color.grey.transparentLight;

export const lightTheme = {
  boxShadow: `0 1px 1px 0 ${colorShadowMediumLight}, 1px 1px 1px 0 ${colorShadowSideLight}, -1px 1px 1px 0 ${colorShadowSideLight}`,
  canvasBackground: `${awsui.colorBackgroundContainerContent}`,
};

export const darkTheme = {
  boxShadow: `0 1px 1px 0 ${colorShadowMediumDark}, 1px 1px 1px 0 ${colorShadowSideDark}, -1px 1px 1px 0 ${colorShadowSideDark}`,
  canvasBackground: `radial-gradient(circle, ${awsui.colorBackgroundContainerContent} 0%, ${awsui.colorBackgroundInputDefault} 100%)`,
};
