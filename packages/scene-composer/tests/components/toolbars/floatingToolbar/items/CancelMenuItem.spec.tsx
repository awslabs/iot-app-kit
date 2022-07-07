/* eslint-disable import/first,import/order */
import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';

import { mockReactIntl } from '../../../../__mocks__/MockReactIntl';
mockReactIntl();

import { useStore } from '../../../../../src/store';
import { CancelMenuItem } from '../../../../../src/components/toolbars/floatingToolbar/items';

describe('CancelMenuItem', () => {
  const setAddingWidget = jest.fn();

  beforeEach(() => {
    useStore('default').setState({
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
