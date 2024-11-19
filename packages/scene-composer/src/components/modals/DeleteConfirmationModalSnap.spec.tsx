import { render, screen } from '@/tests/testing-library';

import { accessStore } from '../../store';

import DeleteConfirmationModal from './DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const baseState = {
    setDeleteConfirmationModalVisible: vi.fn(),
  };

  it('should render correctly', () => {
    accessStore('default').setState(baseState);

    const { container } = render(
      <DeleteConfirmationModal
        title='title-string'
        contentBody='body-string'
        warningMessage='warning-string'
        onDelete={vi.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with delete button disabled', () => {
    accessStore('default').setState(baseState);

    const { container } = render(
      <DeleteConfirmationModal
        deleteButtonDisabled
        title='title-string'
        contentBody='body-string'
        warningMessage='warning-string'
        onDelete={vi.fn()}
      />,
    );
    const deleteButton = screen.getByTestId('delete-button');
    expect(deleteButton.getAttribute('disabled')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
});
