import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { number } from 'prop-types';

import {
  DynamicSelect,
  ExpandableInfoSection,
  Matrix3XInputGrid,
  NumericInput,
  TextInput,
} from '../CommonPanelComponents';
import { toNumber } from '../../../utils/stringUtils';

describe('render correct panels.', () => {
  it('render correct numeric input.', async () => {
    const setValue = jest.fn();
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const fromStr = jest.fn();
    const { container } = render(<NumericInput value={2} setValue={setValue} toStr={toStr} fromStr={fromStr} />);

    const input = container.querySelectorAll('[data-mocked="Input"]')[0];

    expect(input.outerHTML).toMatchInlineSnapshot(`"<div data-mocked="Input" value="2"></div>"`);

    fireEvent.change(input, { detail: { value: 2 } });
    fireEvent.blur(input);

    expect(setValue).toBeCalledTimes(1);
    expect(fromStr).toBeCalledTimes(1);
    expect(toStr).toBeCalledTimes(2);
  });

  it('useEffect is called after mounting.', async () => {
    const setValue = jest.fn();
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const fromStr = jest.fn();
    act(() => {
      render(<NumericInput value={2} setValue={setValue} toStr={toStr} fromStr={fromStr} />);
    });
    expect(toStr).toBeCalledTimes(2);
  });

  it('render Matrix3XInputGrid correctly.', async () => {
    const onChange = jest.fn();
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const fromStr = jest.fn().mockImplementation((str) => number + str);

    const { container } = render(
      <Matrix3XInputGrid<number>
        name='gridName'
        labels={['l1', 'l2', 'l3']}
        values={[1, 2, 3]}
        onChange={onChange}
        toStr={toStr}
        fromStr={fromStr}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('render ExpandableInfoSection correctly', async () => {
    const container = render(<ExpandableInfoSection title='testTile' />);
    expect(container).toMatchSnapshot();
  });

  it('render Matrix3XInputGrid readonly correctly.', async () => {
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const { container } = render(
      <Matrix3XInputGrid
        name='gridName'
        labels={['l1', 'l2', 'l3']}
        values={[1, 2, 3]}
        readonly={[true, true, true]}
        fromStr={toNumber}
        onChange={() => {}}
        toStr={toStr}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  describe('DynamicSelect', () => {
    const originalOptions = [
      {
        label: '10 units',
        value: '10',
      },
      {
        label: '20 units',
        value: '20',
      },
      {
        label: '30 units',
        value: '30',
      },
    ];

    it('should render Dynamic Select correctly with existing options', () => {
      const { container } = render(
        <DynamicSelect selectedOption={{ label: '10 units', value: '10' }} options={originalOptions} />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render Dynamic Select correctly with new option', () => {
      const { container } = render(
        <DynamicSelect selectedOption={{ label: '15 units', value: '15' }} options={originalOptions} />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});

describe('TextInput', () => {
  it('should populate with a given value', () => {
    const setValue = jest.fn();
    const { container } = render(<TextInput value='test' setValue={setValue} />);
    const input = container.querySelectorAll('[data-mocked="Input"]')[0];

    expect(input.outerHTML).toMatchInlineSnapshot(`"<div data-mocked="Input" value="test"></div>"`);
  });
});
