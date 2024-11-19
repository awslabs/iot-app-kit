import { fireEvent, render } from '@/tests/testing-library';

import { accessStore } from '../../../store';
import { isDynamicScene } from '../../../utils/entityModelUtils/sceneUtils';

import { ConvertSceneSettings } from './ConvertSceneSettings';

vi.mock('../../../utils/entityModelUtils/sceneUtils');

describe('ConvertSceneSettings', () => {
  const setConvertSceneModalVisibility = vi.fn();
  const baseState = {
    setConvertSceneModalVisibility,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with convert button disabled', () => {
    accessStore('default').setState(baseState);
    (isDynamicScene as vi.Mock).mockReturnValue(true);

    const { container, queryByTestId } = render(<ConvertSceneSettings />);

    expect(queryByTestId('convert-button')?.getAttribute('disabled')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with convert button enabled', () => {
    accessStore('default').setState(baseState);
    (isDynamicScene as vi.Mock).mockReturnValue(false);

    const { container, queryByTestId } = render(<ConvertSceneSettings />);

    expect(queryByTestId('convert-button')?.getAttribute('disabled')).toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should set convert scene modal to visible on convert button click', () => {
    accessStore('default').setState(baseState);
    (isDynamicScene as vi.Mock).mockReturnValue(false);

    const { queryByTestId } = render(<ConvertSceneSettings />);
    const button = queryByTestId('convert-button');
    fireEvent.click(button!);

    expect(setConvertSceneModalVisibility).toBeCalledTimes(1);
    expect(setConvertSceneModalVisibility).toBeCalledWith(true);
  });
});
