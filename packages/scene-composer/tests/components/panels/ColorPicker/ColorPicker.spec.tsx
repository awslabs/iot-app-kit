import { act, render } from '@testing-library/react';

import { ColorPicker } from '../../../../src/components/panels/ColorPicker/ColorPicker';

jest.mock('@cloudscape-design/components', () => ({
  SpaceBetween: 'space-between',
  Input: 'input',
  FormField: 'form-field',
}));

const onChangeMock = jest.fn();
const undefinedColor = <ColorPicker color={undefined} onChange={onChangeMock} />;
const definedColor = <ColorPicker color='#010101' onChange={onChangeMock} />;

describe('ColorPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(undefinedColor);
      container = rendered.container;
    });

    expect(container).toBeDefined();
  });

  it('should load with the default color if no color is provided', async () => {
    let findByTestId;
    await act(async () => {
      const rendered = render(undefinedColor);
      findByTestId = rendered.findByTestId;
    });

    const hexInput = await findByTestId('rule-color-selector-hex');
    const redInput = await findByTestId('rule-color-selector-red');
    const greenInput = await findByTestId('rule-color-selector-green');
    const blueInput = await findByTestId('rule-color-selector-blue');

    expect(hexInput.getAttribute('value')).toBe('#000000');
    expect(redInput.getAttribute('value')).toBe('0');
    expect(greenInput.getAttribute('value')).toBe('0');
    expect(blueInput.getAttribute('value')).toBe('0');
  });

  it('should load with the provided color', async () => {
    let findByTestId;
    await act(async () => {
      const rendered = render(definedColor);
      findByTestId = rendered.findByTestId;
    });

    const hexInput = await findByTestId('rule-color-selector-hex');
    const redInput = await findByTestId('rule-color-selector-red');
    const greenInput = await findByTestId('rule-color-selector-green');
    const blueInput = await findByTestId('rule-color-selector-blue');

    expect(hexInput.getAttribute('value')).toBe('#010101');
    expect(redInput.getAttribute('value')).toBe('1');
    expect(greenInput.getAttribute('value')).toBe('1');
    expect(blueInput.getAttribute('value')).toBe('1');
  });
});
