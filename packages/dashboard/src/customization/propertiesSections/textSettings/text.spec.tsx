import { MOCK_TEXT_WIDGET } from '../../../../testing/mocks';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import type { DashboardState } from '~/store/state';
import type { TextWidget } from '~/customization/widgets/types';
import { TextSettingsConfiguration } from './index';

const widget: TextWidget = {
  ...MOCK_TEXT_WIDGET,
  properties: {
    ...MOCK_TEXT_WIDGET.properties,
    fontSettings: {
      isBold: true,
      isItalic: true,
      isUnderlined: false,
    },
  },
};

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [widget],
  },
  selectedWidgets: [widget],
};

it('renders font style settings reflecting the initial values passed in', () => {
  render(
    <Provider store={configureDashboardStore(state)}>
      <TextSettingsConfiguration />
    </Provider>
  );

  const bold = screen.queryByLabelText('toggle bold text');
  expect(bold).toBeChecked();

  const italic = screen.queryByLabelText('toggle italicize text');
  expect(italic).toBeChecked();

  const underline = screen.queryByLabelText('toggle underline text');
  expect(underline).not.toBeChecked();
});
