/* eslint-disable import/first,import/order */
import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import { AddObjectMenu } from '../../../../src/components/toolbars/floatingToolbar/items/AddObjectMenu';

import { FloatingToolbar } from '../../../../src/components/toolbars';
import { accessStore } from '../../../../src/store';
import { ToolbarOrientation } from '../../../../src/components/toolbars/common/types';
import { act } from 'react-dom/test-utils';

jest.mock('../../../../src/components/toolbars/floatingToolbar/items', () => ({
  HistoryItemGroup: 'HistoryItemGroup',
  ObjectItemGroup: 'ObjectItemGroup',
  SceneItemGroup: 'SceneItemGroup',
  CancelMenuItem: 'CancelMenuItem',
}));
jest.mock('../../../../src/components/toolbars/floatingToolbar/items/AddObjectMenu', () => ({
  AddObjectMenu: 'AddObjectMenu',
}));

describe('FloatingToolbar', () => {
  beforeEach(() => {
    accessStore('default').setState({
      addingWidget: undefined,
    } as any);
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const container = create(
      <FloatingToolbar
        enableDefaultItems={true}
        additionalMenuItems={
          <AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly in view mode', () => {
    const container = create(
      <FloatingToolbar
        isViewing={true}
        enableDefaultItems={true}
        additionalMenuItems={
          <AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly when addingWidget', () => {
    accessStore('default').setState({
      addingWidget: {},
    } as any);
    const container = create(<FloatingToolbar enableDefaultItems={true} />);
    expect(container).toMatchSnapshot();
  });

  it('should display the toolbar vertically if the canvas is big', async () => {
    const mockCanvas = document.createElement('canvas');
    mockCanvas.setAttribute('id', 'tm-scene-unselectable-canvas');
    Object.defineProperty(mockCanvas, 'clientHeight', { configurable: true, value: '1000' });
    jest.spyOn(document, 'getElementById').mockReturnValue(mockCanvas);

    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(<FloatingToolbar enableDefaultItems={true} />);
      container = rendered.container;
    });

    expect(container).toMatchSnapshot();
  });

  it('should display the toolbar horiontally if the canvas is small', async () => {
    const mockCanvas = document.createElement('canvas');
    mockCanvas.setAttribute('id', 'tm-scene-unselectable-canvas');
    Object.defineProperty(mockCanvas, 'clientHeight', { configurable: true, value: '1' });
    jest.spyOn(document, 'getElementById').mockReturnValue(mockCanvas);

    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(<FloatingToolbar enableDefaultItems={true} />);
      container = rendered.container;
    });

    expect(container).toMatchSnapshot();
  });
});
