/* eslint-disable import/first,import/order */
import { fireEvent, render, screen } from '@testing-library/react';

import { accessStore } from '../../../../../src/store';
import { CancelMenuItem } from '../../../../../src/components/toolbars/floatingToolbar/items';

describe('CancelMenuItem', () => {
  const setAddingWidget = jest.fn();

  beforeEach(() => {
    accessStore('default').setState({
      setAddingWidget,
    } as any);
    jest.clearAllMocks();
  });

  it('should call setAddingWidget with undefined when clicked', () => {
    render(<CancelMenuItem />);
    const sut = screen.getByTestId('cancel');
    fireEvent.pointerUp(sut);
    expect(setAddingWidget).toBeCalledWith(undefined);
  });
});
