import { act, fireEvent, render } from '@/tests/testing-library';
import { number } from 'prop-types';
import { toNumber } from '../../../utils/stringUtils';
import { DynamicSelect, ExpandableInfoSection, Matrix3XInputGrid, NumericInput } from '../CommonPanelComponents';

describe('render correct panels.', () => {
  it('render correct numeric input.', async () => {
    const setValue = vi.fn();
    const toStr = vi.fn().mockImplementation((num) => num + '');
    const fromStr = vi.fn();
    const { container } = render(<NumericInput value={2} setValue={setValue} toStr={toStr} fromStr={fromStr} />);

    const input = container.querySelectorAll('[data-mocked="Input"]')[0];

    fireEvent.change(input, { detail: { value: 2 } });
    fireEvent.blur(input);

    expect(setValue).toBeCalledTimes(1);
    expect(fromStr).toBeCalledTimes(1);
    expect(toStr).toBeCalledTimes(2);
  });

  it('useEffect is called after mounting.', async () => {
    const setValue = vi.fn();
    const toStr = vi.fn().mockImplementation((num) => num + '');
    const fromStr = vi.fn();
    act(() => {
      render(<NumericInput value={2} setValue={setValue} toStr={toStr} fromStr={fromStr} />);
    });
    expect(toStr).toBeCalledTimes(2);
  });

  it('render Matrix3XInputGrid correctly.', async () => {
    const onChange = vi.fn();
    const toStr = vi.fn().mockImplementation((num) => num + '');
    const fromStr = vi.fn().mockImplementation((str) => number + str);

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
    const toStr = vi.fn().mockImplementation((num) => num + '');
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
