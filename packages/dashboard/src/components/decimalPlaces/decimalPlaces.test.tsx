import { getByLabelText, render, screen } from '@testing-library/react';
import DecimalPlaces from './index';
import userEvent from '@testing-library/user-event';

const TestComponent = () => (
  <DecimalPlaces
    significantDigits={0}
    onSignificantDigitsChange={() => {}}
    shouldClearErrors={true}
    showFormFieldLabel={true}
  />
);

describe('Decimal Places', () => {
  it('renders', () => {
    const elem = render(<TestComponent />).baseElement;
    expect(elem).toBeTruthy();
  });

  it('renders the decimal places input', async () => {
    const elem = render(<TestComponent />).baseElement;
    expect(getByLabelText(elem, 'Decimal places')).toBeTruthy();
  });

  it('shows error if decimal places input is greater than 100', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    const input = screen.getByLabelText('Decimal places');
    await user.type(input, '145');
    const errorText = screen.queryByText(
      'Decimal places must be between 0 and 100.'
    );
    expect(errorText).toBeTruthy();
  });
  it('Does not show error if decimal places input is less than 100', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    const input = screen.getByLabelText('Decimal places');
    await user.type(input, '30');
    const errorText = screen.queryByText(
      'Decimal places must be between 0 and 100.'
    );
    expect(errorText).not.toBeTruthy();
  });
});
