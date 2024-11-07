import { render, fireEvent } from '@testing-library/react';
import CustomOrangeButton from './index';

describe('CustomOrangeButton', () => {
  const title = 'Test Button';
  const handleClick = jest.fn();

  test('renders button with correct title', () => {
    const { getByText } = render(
      <CustomOrangeButton title={title} handleClick={handleClick} />
    );
    expect(getByText(title)).toBeInTheDocument();
  });
  test('calls handleClick when button is clicked', () => {
    const { getByRole } = render(
      <CustomOrangeButton title={title} handleClick={handleClick} />
    );
    const button = getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
