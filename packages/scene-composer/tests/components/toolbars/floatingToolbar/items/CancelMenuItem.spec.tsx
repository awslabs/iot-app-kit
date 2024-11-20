/* eslint-disable import/first,import/order */
import { fireEvent, render, screen } from '@testing-library/react';

import { CancelMenuItem } from '../../../../../src/components/toolbars/floatingToolbar/items';
import { accessStore } from '../../../../../src/store';

describe('CancelMenuItem', () => {
  const setAddingWidget = vi.fn();

  beforeEach(() => {
    accessStore('default').setState({
      setAddingWidget,
    } as any);
    viarAllMocks();
  });

  it('should call setAddingWidget with undefined when clicked', () => {
    render(<CancelMenuItem />);
    const sut = screen.getByTestId('cancel');
    fireEvent.pointerUp(sut);
    expect(setAddingWidget).toBeCalledWith(undefined);
  });
});
