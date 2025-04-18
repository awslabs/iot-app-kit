import { act, render } from '@testing-library/react';
import ue from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { DefaultDashboardMessages } from '~/messages';
import { configureDashboardStore } from '~/store';
import {
  onAssistantCleanWidgetsSelectionAction,
  onAssistantSelectWidgetsAction,
  onToggleAssistantModeAction,
} from '~/store/actions';
import { initialState } from '~/store/state';
import {
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
  MOCK_SCATTER_CHART_WIDGET,
  MOCK_STATUS_TIMELINE_WIDGET,
} from '../../../testing/mocks';
import { AssistantFloatingMenu } from './assistantFloatingMenu';

const user = ue.setup();

const store = configureDashboardStore(initialState);
const TestProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => <Provider store={store}>{children}</Provider>;

const Component = () => (
  <TestProvider>
    <AssistantFloatingMenu
      width={500}
      messageOverrides={DefaultDashboardMessages}
    />
  </TestProvider>
);

describe('Chatbot', () => {
  it('renders correctly', () => {
    const { getByRole } = render(<Component />);
    expect(
      getByRole('button', {
        name: DefaultDashboardMessages.assistant.floatingMenu.buttonAIAssistant,
      })
    ).toBeInTheDocument();
  });

  it('should display buttons when assistant mode is on', async () => {
    const { getByRole } = render(<Component />);

    await user.click(
      getByRole('button', {
        name: DefaultDashboardMessages.assistant.floatingMenu.buttonAIAssistant,
      })
    );

    expect(
      getByRole('button', {
        name: DefaultDashboardMessages.assistant.floatingMenu.buttonClearAll,
      })
    ).toBeInTheDocument();
    expect(
      getByRole('button', {
        name: DefaultDashboardMessages.assistant.floatingMenu
          .buttonGenerateSummary,
      })
    ).toBeInTheDocument();
  });

  it('should not display buttons when assistant mode is off', () => {
    const { queryByRole } = render(<Component />);

    act(() => {
      store.dispatch(
        onToggleAssistantModeAction({
          mode: 'off',
        })
      );
    });

    expect(
      queryByRole('button', {
        name: DefaultDashboardMessages.assistant.floatingMenu.buttonClearAll,
      })
    ).toBeNull();
    expect(
      queryByRole('button', {
        name: DefaultDashboardMessages.assistant.floatingMenu
          .buttonGenerateSummary,
      })
    ).toBeNull();
  });

  it('should display error message when number of widgets selected bigger than max allowed', async () => {
    const { getByText, getByRole } = render(<Component />);

    act(() => {
      store.dispatch(
        onAssistantSelectWidgetsAction({
          widgetId: MOCK_KPI_WIDGET.id,
          widgetType: MOCK_KPI_WIDGET.type,
          selectedProperties: 1,
        })
      );
    });

    act(() => {
      store.dispatch(
        onAssistantSelectWidgetsAction({
          widgetId: MOCK_LINE_CHART_WIDGET.id,
          widgetType: MOCK_LINE_CHART_WIDGET.type,
          selectedProperties: 2,
        })
      );
    });

    act(() => {
      store.dispatch(
        onAssistantSelectWidgetsAction({
          widgetId: MOCK_STATUS_TIMELINE_WIDGET.id,
          widgetType: MOCK_STATUS_TIMELINE_WIDGET.type,
          selectedProperties: 1,
        })
      );
    });

    act(() => {
      store.dispatch(
        onAssistantSelectWidgetsAction({
          widgetId: MOCK_SCATTER_CHART_WIDGET.id,
          widgetType: MOCK_SCATTER_CHART_WIDGET.type,
          selectedProperties: 2,
        })
      );
    });

    act(() => {
      store.dispatch(
        onToggleAssistantModeAction({
          mode: 'on',
        })
      );
    });

    await user.click(
      getByRole('button', {
        name: '6/3 items selected',
      })
    );

    expect(
      getByText(
        DefaultDashboardMessages.assistant.floatingMenu.error
          .propertyLimitMessage
      )
    ).toBeInTheDocument();
  });
});

it('should clear all selection if clear all button is clicked', async () => {
  const { getByRole } = render(<Component />);

  act(() => {
    store.dispatch(onAssistantCleanWidgetsSelectionAction());
  });

  act(() => {
    store.dispatch(
      onToggleAssistantModeAction({
        mode: 'on',
      })
    );
  });

  act(() => {
    store.dispatch(
      onAssistantSelectWidgetsAction({
        widgetId: MOCK_KPI_WIDGET.id,
        widgetType: MOCK_KPI_WIDGET.type,
        selectedProperties: 1,
      })
    );
  });

  await user.click(
    getByRole('button', {
      name: DefaultDashboardMessages.assistant.floatingMenu.buttonClearAll,
    })
  );

  expect(store.getState().assistant.selectedQueries).toEqual([]);
});

it('should open the chatbot when generate summary is clicked', async () => {
  const { getByRole } = render(<Component />);

  act(() => {
    store.dispatch(onAssistantCleanWidgetsSelectionAction());
  });

  act(() => {
    store.dispatch(
      onAssistantSelectWidgetsAction({
        widgetId: MOCK_KPI_WIDGET.id,
        widgetType: MOCK_KPI_WIDGET.type,
        selectedProperties: 1,
      })
    );
  });

  act(() => {
    store.dispatch(
      onToggleAssistantModeAction({
        mode: 'on',
      })
    );
  });

  await user.click(
    getByRole('button', {
      name: DefaultDashboardMessages.assistant.floatingMenu
        .buttonGenerateSummary,
    })
  );

  expect(store.getState().assistant.isChatbotOpen).toBeTruthy();
});
