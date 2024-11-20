import { render } from '@/tests/testing-library';
import { act } from 'react-test-renderer';

import { KnownComponentType } from '../../../../interfaces';
import { accessStore } from '../../../../store';
import { ToolbarOrientation } from '../../common/types';

import { ObjectItemGroup } from '.';

vi.mock('../../common/ToolbarItem', () => ({
  ToolbarItem: (...props: unknown[]) => <div data-testid='ToolbarItem'>{JSON.stringify(props)}</div>,
}));

vi.mock('../../../../assets/svgs', async () => ({
  ...(await vi.importActual('../../../../assets/svgs')),
  DeleteSvg: 'DeleteSvg',
  RotateIconSvg: 'RotateIconSvg',
  ScaleIconSvg: 'ScaleIconSvg',
  TranslateIconSvg: 'TranslateIconSvg',
}));

describe('ObjectItemGroupSnap', () => {
  const removeSceneNode = vi.fn();
  const selectedSceneNodeRef = 'test-ref';
  const setTransformControlMode = vi.fn();
  const getSceneNodeByRef = vi.fn();

  beforeEach(() => {
    accessStore('default').setState({
      selectedSceneNodeRef,
      removeSceneNode,
      transformControlMode: 'translate',
      setTransformControlMode,
      getSceneNodeByRef,
    });
    vi.clearAllMocks();
  });

  it('should render with disabled rotate and scale when Tag is selected', () => {
    getSceneNodeByRef.mockReturnValue({ components: [{ type: KnownComponentType.Tag }] });
    const { container, queryAllByText } = render(
      <ObjectItemGroup canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />,
    );

    expect(queryAllByText('"isDisabled":true', { exact: false }).length).toBe(1);
    expect(container).toMatchSnapshot();
  });

  it('should render with disabled rotate and scale when Overlay is selected', () => {
    getSceneNodeByRef.mockReturnValue({ components: [{ type: KnownComponentType.DataOverlay }] });
    const { container, queryAllByText } = render(
      <ObjectItemGroup canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />,
    );

    expect(queryAllByText('"isDisabled":true', { exact: false }).length).toBe(1);
    expect(container).toMatchSnapshot();
  });

  it('should correctly render horizontally', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(
        <ObjectItemGroup canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Horizontal} />,
      );
      container = rendered.container;
    });

    expect(container).toMatchSnapshot();
  });
});
