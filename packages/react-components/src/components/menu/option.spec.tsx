import { act, fireEvent, render, screen } from '@testing-library/react';
import { MenuOption } from './option';

it('renders', () => {
  render(
    <MenuOption
      iconStart={() => <div>icon-start</div>}
      label='test option'
      iconEnd={() => <div>icon-end</div>}
    />
  );

  expect(screen.queryByText('icon-start')).not.toBeNull();
  expect(screen.queryByText('icon-end')).not.toBeNull();
  expect(screen.queryByText('test option')).not.toBeNull();
});

it('is actionable', () => {
  const mockAction = jest.fn();
  render(<MenuOption label='test option' action={mockAction} />);

  act(() => {
    fireEvent.click(screen.queryByText('test option') as Element);
  });

  expect(mockAction).toBeCalledTimes(1);
});

it('is not actionable when disabled', () => {
  const mockAction = jest.fn();
  render(<MenuOption label='test option' disabled action={mockAction} />);

  act(() => {
    fireEvent.click(screen.queryByText('test option') as Element);
  });

  expect(mockAction).not.toBeCalled();
});
