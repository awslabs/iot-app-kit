import { act, fireEvent, render, screen } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  AppKitConfig,
  DEFAULT_APP_KIT_CONFIG,
} from '@iot-app-kit/react-components';
import { useDashboardPlugins } from '../../customization/api';
import Palette from './index';

const ComponentPaletteTestComponent = ({
  onAddWidget,
}: {
  onAddWidget: typeof vi.fn;
}) => {
  useDashboardPlugins();
  return (
    <AppKitConfig
      customFeatureConfig={DEFAULT_APP_KIT_CONFIG.featureFlagConfig}
    >
      <DndProvider
        backend={HTML5Backend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <Palette onAddWidget={onAddWidget} />
      </DndProvider>
    </AppKitConfig>
  );
};

describe('Component Palette', () => {
  /**
   * drag and drop functionality covered by dashboard e2e tests
   * removing them here because they are redundant and difficult
   * to maintain in the vi context
   */

  it('adds a widget when clicked', () => {
    const onAddWidgetStub = vi.fn();
    render(<ComponentPaletteTestComponent onAddWidget={onAddWidgetStub} />);

    const lineWidget = screen.getByLabelText(/add line widget/i);

    act(() => {
      fireEvent.click(lineWidget);
    });

    expect(onAddWidgetStub).toBeCalledWith('xy-plot');
  });

  it('adds a widget on enter or space', () => {
    const onAddWidgetStub = vi.fn();
    render(<ComponentPaletteTestComponent onAddWidget={onAddWidgetStub} />);

    const lineWidget = screen.getByLabelText(/add line widget/i);

    act(() => {
      fireEvent.keyDown(lineWidget, { code: 'a' });
    });

    expect(onAddWidgetStub).not.toBeCalled();

    act(() => {
      fireEvent.keyDown(lineWidget, { code: 'enter' });
    });

    expect(onAddWidgetStub).toBeCalledWith('xy-plot');

    act(() => {
      fireEvent.keyDown(lineWidget, { code: 'space' });
    });

    expect(onAddWidgetStub).toBeCalledWith('xy-plot');
  });
});
