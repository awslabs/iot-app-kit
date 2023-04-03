import React from 'react';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';

import { DataBindingMapNameEditor } from './DataBindingMapNameEditor';

describe('DataBindingMapNameEditor', () => {
  const valueDataBindings = [
    {
      bindingName: 'binding-1',
      valueDataBinding: {
        dataBindingContext: 'random-1',
      },
    },
    {
      bindingName: 'binding-2',
      valueDataBinding: {
        dataBindingContext: 'random-2',
      },
    },
  ];
  const onUpdateCallbackMock = jest.fn();

  it('should render binding name correctly', async () => {
    const { container } = render(
      <DataBindingMapNameEditor
        bindingName='binding-1'
        index={0}
        valueDataBindings={valueDataBindings}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with invalid binding name error', async () => {
    const { container } = render(
      <DataBindingMapNameEditor
        bindingName=''
        index={0}
        valueDataBindings={valueDataBindings}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with duplicate binding name error', async () => {
    const bindings = cloneDeep(valueDataBindings);
    bindings[0].bindingName = valueDataBindings[1].bindingName;
    const { container } = render(
      <DataBindingMapNameEditor
        bindingName={valueDataBindings[1].bindingName}
        index={0}
        valueDataBindings={bindings}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with invalid character in name error for $', async () => {
    const { container } = render(
      <DataBindingMapNameEditor
        bindingName='aa $ bb'
        index={0}
        valueDataBindings={valueDataBindings}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );

    expect(container.querySelector('[errortext="Invalid character in the name"]')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should render with invalid character in name error for {', async () => {
    const { container } = render(
      <DataBindingMapNameEditor
        bindingName='aa { bb'
        index={0}
        valueDataBindings={valueDataBindings}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );

    expect(container.querySelector('[errortext="Invalid character in the name"]')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should render with invalid character in name error for }', async () => {
    const { container } = render(
      <DataBindingMapNameEditor
        bindingName='aa } bb'
        index={0}
        valueDataBindings={valueDataBindings}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );

    expect(container.querySelector('[errortext="Invalid character in the name"]')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should render with invalid character in name error for .', async () => {
    const { container } = render(
      <DataBindingMapNameEditor
        bindingName='aa . bb'
        index={0}
        valueDataBindings={valueDataBindings}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );

    expect(container.querySelector('[errortext="Invalid character in the name"]')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
});
