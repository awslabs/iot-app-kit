import React from 'react';

import { render, RenderResult } from '@testing-library/react';

import { act } from 'react-dom/test-utils';

import { Provider, useSelector } from 'react-redux';
import UserEvent from '@testing-library/user-event';

import TextWidgetComponent from './component';
import { TextWidget } from '../types';
import { MOCK_TEXT_WIDGET } from '../../../../testing/mocks';

import { configureDashboardStore } from '../../../store';
import { DashboardState } from '../../../store/state';

type RenderTextWidgetArgs = {
  textWidget?: TextWidget;
  readOnlyMode?: boolean;
  isSelected?: boolean;
  remove?: boolean;
};

const WidgetWrapper: React.FC<{ widget: TextWidget; remove: boolean }> = ({ widget, remove }) => {
  if (remove) return null;

  const widgets = useSelector((state: DashboardState) => state.dashboardConfiguration.widgets);
  const textWidget = widgets.find((w) => w.id === widget.id);

  return <TextWidgetComponent {...textWidget} />;
};

const renderWrapper = (renderFunc: (ui: React.ReactElement) => RenderResult | void, args?: RenderTextWidgetArgs) => {
  const widget = args?.textWidget || MOCK_TEXT_WIDGET;
  const readOnly = args?.readOnlyMode || false;
  const selected = args?.isSelected || false;
  const shouldRemove = args?.remove || false;
  const store = configureDashboardStore({
    readOnly,
    dashboardConfiguration: {
      widgets: [widget],
    },
    selectedWidgets: selected ? [widget] : [],
  });

  const renderResult = renderFunc(
    <Provider store={store}>
      <WidgetWrapper widget={widget} remove={shouldRemove} />
    </Provider>
  );

  return { store, renderResult };
};

const renderTextWidget = (args?: RenderTextWidgetArgs) => {
  const { renderResult, store } = renderWrapper(render, args);

  if (!renderResult) throw new Error('Could not properly setup test renderer');

  const { container, rerender } = renderResult;

  const rerenderTextWidget = (rerenderArgs?: RenderTextWidgetArgs) => {
    renderWrapper(rerender, rerenderArgs);
  };

  return { container, rerenderTextWidget, store };
};

describe('Text Widget', () => {
  it('is editable when clicked while selected', async () => {
    const { container, store } = renderTextWidget({ isSelected: true });

    const textWidgetDisplay = container.querySelector('p.text-widget');
    expect(textWidgetDisplay).toBeInTheDocument();

    if (!textWidgetDisplay) throw new Error('text widget not mounted');

    expect(store.getState().grid.enabled).toEqual(true);

    await act(async () => {
      await UserEvent.pointer({
        keys: '[MouseLeft][/MouseLeft]',
        target: textWidgetDisplay,
      });
    });

    expect(store.getState().grid.enabled).toEqual(false);
    const textWidgetTextArea = container.querySelector('textarea.text-widget');
    expect(textWidgetTextArea).toBeInTheDocument();

    await act(async () => {
      await UserEvent.keyboard('-editable');
    });

    expect(store.getState().dashboardConfiguration.widgets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          properties: {
            value: MOCK_TEXT_WIDGET.properties.value + '-editable',
          },
        }),
      ])
    );
  });

  it('is not editable when in read only', async () => {
    const { container } = renderTextWidget({ readOnlyMode: true });

    const textWidgetDisplay = container.querySelector('p.text-widget');
    expect(textWidgetDisplay).toBeInTheDocument();

    if (!textWidgetDisplay) throw new Error('text widget not mounted');

    await act(async () => {
      await UserEvent.pointer({
        keys: '[MouseLeft][/MouseLeft]',
        target: textWidgetDisplay,
      });
    });

    const textWidgetTextArea = container.querySelector('textarea.text-widget');
    expect(textWidgetTextArea).not.toBeInTheDocument();
  });

  it('dashboard grid becomes editable when the widget is removed', async () => {
    const { container, rerenderTextWidget, store } = renderTextWidget({ isSelected: true });

    const textWidgetDisplay = container.querySelector('p.text-widget');

    if (!textWidgetDisplay) throw new Error('text widget not mounted');

    expect(store.getState().grid.enabled).toEqual(true);

    await act(async () => {
      await UserEvent.pointer({
        keys: '[MouseLeft][/MouseLeft]',
        target: textWidgetDisplay,
      });
    });

    expect(store.getState().grid.enabled).toEqual(false);

    rerenderTextWidget({ remove: true });

    expect(store.getState().grid.enabled).toEqual(true);
  });
});
