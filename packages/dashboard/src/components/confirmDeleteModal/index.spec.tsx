import { render, fireEvent } from '@testing-library/react';
import ConfirmDeleteModal from './index';

describe('Confirm Delete Modal', () => {
  test('renders correctly', () => {
    const props = {
      headerTitle: 'Confirmation',
      submitTitle: 'Submit',
      description: 'Are you sure you want to submit?',
      visible: true,
      handleDismiss: vi.fn(),
      handleCancel: vi.fn(),
      handleSubmit: vi.fn(),
    };
    const { getByText, getByTestId } = render(
      <ConfirmDeleteModal {...props} />
    );

    // Assert that the header, description, cancel button, and submit button are rendered correctly
    expect(getByText('Confirmation')).toBeInTheDocument();
    expect(getByText('Are you sure you want to submit?')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByTestId('custom-orange-button')).toBeInTheDocument();
  });

  test('calls handleCancel when cancel button is clicked', () => {
    const handleCancel = vi.fn();
    const props = {
      headerTitle: 'Confirmation',
      submitTitle: 'Submit',
      description: 'Are you sure you want to submit?',
      visible: true,
      handleDismiss: vi.fn(),
      handleCancel,
      handleSubmit: vi.fn(),
    };
    const { getByText } = render(<ConfirmDeleteModal {...props} />);
    const cancelButton = getByText('Cancel');

    fireEvent.click(cancelButton); // Simulate clicking the cancel button

    // Assert that handleCancel is called
    expect(handleCancel).toHaveBeenCalled();
  });

  test('calls handleSubmit when submit button is clicked', () => {
    const handleSubmit = vi.fn();
    const props = {
      headerTitle: 'Confirmation',
      submitTitle: 'Submit',
      description: 'Are you sure you want to submit?',
      visible: true,
      handleDismiss: vi.fn(),
      handleCancel: vi.fn(),
      handleSubmit,
    };
    const { getByTestId } = render(<ConfirmDeleteModal {...props} />);
    const submitButton = getByTestId('custom-orange-button');

    fireEvent.click(submitButton); // Simulate clicking the submit button

    // Assert that handleSubmit is called
    expect(handleSubmit).toHaveBeenCalled();
  });
});
