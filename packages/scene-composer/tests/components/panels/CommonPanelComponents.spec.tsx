/* eslint-disable import/first */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import * as RTL from '@testing-library/react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Box, FormField, Input } from '@awsui/components-react';
import { act } from 'react-dom/test-utils';
import { number } from 'prop-types';

import {
  DynamicSelect,
  ExpandableInfoSection,
  ExpandableSectionWithBorder,
  Matrix3XInputGrid,
  MatrixCellInputWrapper,
  MatrixLabel,
  NumericInput,
} from '../../../src/components/panels/CommonPanelComponents';
import { toNumber } from '../../../src/utils/stringUtils';

let container = null;

beforeEach(() => {
  container = document.createElement('div') as any;
  document.body.appendChild(container as any);
});

afterEach(() => {
  unmountComponentAtNode(container as any);
  (container as any).remove();
  container = null;
});

configure({ adapter: new Adapter() });
describe('render correct panels.', () => {
  it('render correct numeric input.', async () => {
    const setValue = jest.fn();
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const fromStr = jest.fn();
    const wrapper = shallow(<NumericInput value={2} setValue={setValue} toStr={toStr} fromStr={fromStr} />);

    const inputProps = wrapper.find(Input).props();
    expect(inputProps.value).toBe('2');

    inputProps.onChange({ detail: { value: 2 } });
    inputProps.onBlur();
    expect(setValue).toBeCalledTimes(1);
    expect(fromStr).toBeCalledTimes(1);
    expect(toStr).toBeCalledTimes(2);
  });

  it('useEffect is called after mounting.', async () => {
    const setValue = jest.fn();
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const fromStr = jest.fn();
    act(() => {
      render(<NumericInput value={2} setValue={setValue} toStr={toStr} fromStr={fromStr} />, container);
    });
    expect(toStr).toBeCalledTimes(2);
  });

  it('render Matrix3XInputGrid correctly.', async () => {
    const onChange = jest.fn();
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const fromStr = jest.fn().mockImplementation((str) => number + str);
    const wrapper = shallow(
      <Matrix3XInputGrid<Number>
        name='gridName'
        labels={['l1', 'l2', 'l3']}
        values={[1, 2, 3]}
        onChange={onChange}
        toStr={toStr}
        fromStr={fromStr}
      />,
    );

    const formFieldProps = wrapper.find(FormField).props();

    expect(formFieldProps.label).toBe('gridName');
    expect(wrapper.find(MatrixCellInputWrapper).length).toBe(3);
    const childProps1 = wrapper.find(MatrixCellInputWrapper).at(0).props().children[1].props;
    expect(childProps1.controlId).toBe('gridName_input_l1');
    expect(childProps1.value).toBe('1');

    const childProps2 = wrapper.find(MatrixCellInputWrapper).at(1).props().children[1].props;
    expect(childProps2.controlId).toBe('gridName_input_l2');
    expect(childProps2.value).toBe('2');

    const childProps3 = wrapper.find(MatrixCellInputWrapper).at(2).props().children[1].props;
    expect(childProps3.controlId).toBe('gridName_input_l3');
    expect(childProps3.value).toBe('3');

    // assert function
    childProps3.onFocus();
    childProps3.onBlur();
    childProps3.onChange({ detail: { value: 2 } });
  });

  it('useEffect is called after Matrix3XInputGrid is mounted.', async () => {
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const fromStr = jest.fn().mockImplementation((str) => number + str);
    const onChange = jest.fn();
    const setDirty = jest.fn();

    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([['1'], jest.fn()])
      .mockReturnValueOnce([true, setDirty])
      .mockReturnValueOnce([false, jest.fn()]);

    act(() => {
      render(
        <Matrix3XInputGrid<Number>
          name='gridName'
          labels={['l1', 'l2', 'l3']}
          values={[1, 2, 3]}
          onChange={onChange}
          toStr={toStr}
          fromStr={fromStr}
        />,
        container,
      );
    });

    expect(setDirty).toBeCalledTimes(1);
    expect(setDirty.mock.calls[0][0]).toBe(false);
  });

  it('setIntervals is called after Matrix3XInputGrid is mounted when not dirty and not focus.', async () => {
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const fromStr = jest.fn().mockImplementation((str) => number + str);
    const onChange = jest.fn();
    const setDirty = jest.fn();
    const setIntervals = jest.fn();

    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([['1'], setIntervals])
      .mockReturnValueOnce([false, setDirty])
      .mockReturnValueOnce([false, jest.fn()]);

    act(() => {
      render(
        <Matrix3XInputGrid<Number>
          name='gridName'
          labels={['l1', 'l2', 'l3']}
          values={[1, 2, 3]}
          onChange={onChange}
          toStr={toStr}
          fromStr={fromStr}
        />,
        container,
      );
    });

    expect(setIntervals).toBeCalledTimes(1);
    expect(setIntervals.mock.calls[0][0][0]).toBe('1');
    expect(setIntervals.mock.calls[0][0][1]).toBe('2');
    expect(setIntervals.mock.calls[0][0][2]).toBe('3');
  });

  it('render ExpandableInfoSection correctly', async () => {
    const wrapper = shallow(<ExpandableInfoSection title='testTile' />);
    expect(wrapper.find(ExpandableSectionWithBorder).length).toBe(1);
    expect(wrapper.find(Box).length).toBe(1);
  });

  it('render Matrix3XInputGrid readonly correctly.', async () => {
    const toStr = jest.fn().mockImplementation((num) => num + '');
    const wrapper = shallow(
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

    const formFieldProps = wrapper.find(FormField).props();

    expect(formFieldProps.label).toBe('gridName');
    expect(wrapper.find(MatrixCellInputWrapper).length).toBe(3);
    expect(wrapper.find(MatrixLabel).length).toBe(3);
    expect(wrapper.find(Input).length).toBe(0);

    const childMatrixCellWrapperProps1 = wrapper.find(MatrixCellInputWrapper).at(0).props().children[0].props;
    const childMatrixLabelProps1 = wrapper.find(MatrixLabel).at(0).props().children.props;
    expect(childMatrixCellWrapperProps1.children[1]).toBe('1');
    expect(childMatrixLabelProps1.children.props.children).toBe('l1');

    const childMatrixCellWrapperProps2 = wrapper.find(MatrixCellInputWrapper).at(1).props().children[0].props;
    const childMatrixLabelProps2 = wrapper.find(MatrixLabel).at(1).props().children.props;
    expect(childMatrixCellWrapperProps2.children[1]).toBe('2');
    expect(childMatrixLabelProps2.children.props.children).toBe('l2');

    const childMatrixCellWrapperProps3 = wrapper.find(MatrixCellInputWrapper).at(2).props().children[0].props;
    const childMatrixLabelProps3 = wrapper.find(MatrixLabel).at(2).props().children.props;
    expect(childMatrixCellWrapperProps3.children[1]).toBe('3');
    expect(childMatrixLabelProps3.children.props.children).toBe('l3');
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
      const container = RTL.render(
        <DynamicSelect selectedOption={{ label: '10 units', value: '10' }} options={originalOptions} />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render Dynamic Select correctly with new option', () => {
      const container = RTL.render(
        <DynamicSelect selectedOption={{ label: '15 units', value: '15' }} options={originalOptions} />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
