import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { useStore } from '../../../store';
import { isDynamicScene } from '../../../utils/entityModelUtils/sceneUtils';

import { ConvertSceneSettings } from './ConvertSceneSettings';

jest.mock('../../../utils/entityModelUtils/sceneUtils');

describe('ConvertSceneSettings', () => {
  const setConvertSceneModalVisibility = jest.fn();
  const baseState = {
    setConvertSceneModalVisibility,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with convert button disabled', () => {
    useStore('default').setState(baseState);
    (isDynamicScene as jest.Mock).mockReturnValue(true);

    const { container, queryByTestId } = render(<ConvertSceneSettings />);

    expect(queryByTestId('convert-button')?.getAttribute('disabled')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with convert button enabled', () => {
    useStore('default').setState(baseState);
    (isDynamicScene as jest.Mock).mockReturnValue(false);

    const { container, queryByTestId } = render(<ConvertSceneSettings />);

    expect(queryByTestId('convert-button')?.getAttribute('disabled')).toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should set convert scene modal to visible on convert button click', () => {
    useStore('default').setState(baseState);
    (isDynamicScene as jest.Mock).mockReturnValue(false);

    const { queryByTestId } = render(<ConvertSceneSettings />);
    const button = queryByTestId('convert-button');
    fireEvent.click(button!);

    expect(setConvertSceneModalVisibility).toBeCalledTimes(1);
    expect(setConvertSceneModalVisibility).toBeCalledWith(true);
  });
});
