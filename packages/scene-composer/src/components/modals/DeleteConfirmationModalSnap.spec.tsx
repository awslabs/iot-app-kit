import React from 'react';
import { render, screen } from '@testing-library/react';

import { useStore } from '../../store';

import DeleteConfirmationModal from './DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const baseState = {
    setDeleteConfirmationModalVisible: jest.fn(),
  };

  it('should render correctly', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <DeleteConfirmationModal
        title='title-string'
        contentBody='body-string'
        warningMessage='warning-string'
        onDelete={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with delete button disabled', () => {
    useStore('default').setState(baseState);

    const { container } = render(
      <DeleteConfirmationModal
        deleteButtonDisabled
        title='title-string'
        contentBody='body-string'
        warningMessage='warning-string'
        onDelete={jest.fn()}
      />,
    );
    const deleteButton = screen.getByTestId('delete-button');
    expect(deleteButton.getAttribute('disabled')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
});
