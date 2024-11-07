import { act, fireEvent, render, screen } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useDashboardPlugins } from '../../customization/api';
import { AppKitConfig } from '@iot-app-kit/react-components';
// FIXME: Export DEFAULT_APP_KIT_CONFIG from @iot-app-kit/react-components
// eslint-disable-next-line no-restricted-imports
import { DEFAULT_APP_KIT_CONFIG } from '@iot-app-kit/react-components/src/components/iot-app-kit-config/defaultValues';
import Palette from './index';

const ComponentPaletteTestComponent = ({
  onAddWidget,
}: {
  onAddWidget: typeof jest.fn;
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
   * to maintain in the jest context
   */

  it('adds a widget when clicked', () => {
    const onAddWidgetStub = jest.fn();
    render(<ComponentPaletteTestComponent onAddWidget={onAddWidgetStub} />);

    const lineWidget = screen.getByLabelText(/add line widget/i);

    act(() => {
      fireEvent.click(lineWidget);
    });

    expect(onAddWidgetStub).toBeCalledWith('xy-plot');
  });

  it('adds a widget on enter or space', () => {
    const onAddWidgetStub = jest.fn();
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
