import { mockReactIntl } from './__mocks__/MockReactIntl';
import 'jest-styled-components';

window.URL.createObjectURL = jest.fn();

mockReactIntl();

jest.doMock('@awsui/design-tokens', () => ({
  colorBackgroundContainerContent: 'colorBackgroundContainerContent',
  colorBackgroundContainerHeader: 'colorBackgroundContainerHeader',
  colorBackgroundDropdownItemDefault: 'colorBackgroundDropdownItemDefault',
  colorBackgroundDropdownItemHover: 'colorBackgroundDropdownItemHover',
  colorBackgroundInputDefault: 'colorBackgroundInputDefault',
  colorBackgroundInputDisabled: 'colorBackgroundInputDisabled',
  colorBackgroundItemSelected: 'colorBackgroundItemSelected',
  colorBackgroundLayoutMain: 'colorBackgroundLayoutMain',
  colorBackgroundNotificationBlue: 'colorBackgroundNotificationBlue',
  colorBackgroundNotificationGreen: 'colorBackgroundNotificationGreen',
  colorBackgroundNotificationRed: 'colorBackgroundNotificationRed',
  colorBorderButtonNormalDefault: 'colorBorderButtonNormalDefault',
  colorBorderContainerTop: 'colorBorderContainerTop',
  colorBorderDividerDefault: 'colorBorderDividerDefault',
  colorChartsYellow700: 'colorChartsYellow700',
  colorForegroundControlDefault: 'colorForegroundControlDefault',
  colorTextBodySecondar: 'colorTextBodySecondary',
  colorTextFormSecondary: 'colorTextFormSecondary',
  colorTextHeadingDefault: 'colorTextHeadingDefault',
  colorTextInputPlaceholder: 'colorTextInputPlaceholder',
  colorTextLabel: 'colorTextLabel',
  colorTextNotificationDefault: 'colorTextNotificationDefault',
}));

export {};
