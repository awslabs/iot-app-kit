import React from 'react';
import { render, screen } from '@testing-library/react';
import { DialBase } from './dialBase';
import type { DataPoint } from '@iot-app-kit/core';

describe('name', () => {
  it('renders name when showName is true', () => {
    const someName = 'some-name';
    render(<DialBase name={someName} settings={{ showName: true }} />);

    expect(screen.queryByText(someName)).not.toBeNull();
  });

  it('does not render name when showName is false', () => {
    const someName = 'some-name';
    render(<DialBase name={someName} settings={{ showName: false }} />);

    expect(screen.queryByText(someName)).toBeNull();
  });
});

describe('unit', () => {
  const point: DataPoint = { x: 1213, y: 123 };

  it('renders unit when showUnit is true and provided a property point', () => {
    const someUnit = 'some-Unit';
    render(
      <DialBase
        unit={someUnit}
        propertyPoint={point}
        settings={{ showUnit: true }}
      />
    );

    expect(screen.queryByText(someUnit)).not.toBeNull();
  });

  it('renders unit when showUnit is true and provided a alarm point', () => {
    const someUnit = 'some-Unit';
    render(
      <DialBase
        unit={someUnit}
        alarmPoint={point}
        settings={{ showUnit: true }}
      />
    );

    expect(screen.queryByText(someUnit)).not.toBeNull();
  });

  it('does not render unit when showUnit is true and is not provided a data point', () => {
    const someUnit = 'some-Unit';
    render(<DialBase unit={someUnit} settings={{ showUnit: true }} />);

    expect(screen.queryByText(someUnit)).toBeNull();
  });

  it('does not render unit when showUnit is false', () => {
    const someUnit = 'some-Unit';
    render(
      <DialBase
        unit={someUnit}
        settings={{ showUnit: false }}
        propertyPoint={point}
      />
    );

    expect(screen.queryByText(someUnit)).toBeNull();
  });
});

describe('property value', () => {
  it('renders property points y value', () => {
    const Y_VALUE = 123445;
    render(
      <DialBase
        propertyPoint={{ x: new Date().getTime(), y: Y_VALUE }}
        settings={{ showName: false }}
      />
    );
    expect(screen.queryByText(Y_VALUE)).not.toBeNull();
  });

  it('renders alarm points y value', () => {
    const Y_VALUE = 123445;
    render(
      <DialBase
        alarmPoint={{ x: new Date().getTime(), y: Y_VALUE }}
        settings={{ showName: false }}
      />
    );
    expect(screen.queryByText(Y_VALUE)).not.toBeNull();
  });

  it('renders property points y value and alarm points y value when provided both an alarm and a property', () => {
    const Y_VALUE_PROPERTY = 123445;
    const Y_VALUE_ALARM = 'alarm_value';
    render(
      <DialBase
        alarmPoint={{ x: new Date().getTime(), y: Y_VALUE_ALARM }}
        propertyPoint={{ x: 234324, y: Y_VALUE_PROPERTY }}
        settings={{ showName: false }}
      />
    );

    expect(screen.queryByText(Y_VALUE_PROPERTY)).not.toBeNull();
    expect(screen.queryByText(Y_VALUE_ALARM)).not.toBeNull();
  });
});

describe('error', () => {
  it('renders error', () => {
    const someError = 'some-error';
    render(<DialBase error={someError} settings={{}} />);

    expect(screen.queryByText(someError)).not.toBeNull();
  });
});

describe('loading', () => {
  it('renders loading spinner while isLoading is true', () => {
    render(<DialBase isLoading settings={{}} />);

    expect(screen.queryByTestId('loading')).not.toBeNull();
  });

  it('does not render loading spinner while isLoading is false', () => {
    render(<DialBase isLoading={false} settings={{}} />);

    expect(screen.queryByTestId('loading')).toBeNull();
  });

  it('renders error while loading', () => {
    const someError = 'some-error';
    render(<DialBase error={someError} isLoading settings={{}} />);

    expect(screen.queryByText(someError)).not.toBeNull();
  });

  it('does not render data point while isLoading is true', () => {
    const point = { x: 12341, y: 123213 };
    render(<DialBase propertyPoint={point} isLoading settings={{}} />);

    expect(screen.queryByText(point.y)).toBeNull();
  });

  it('does not render alarm or property data point while isLoading is true', () => {
    const point = { x: 12341, y: 123213 };
    const alarmPoint = { x: 12341, y: 'warning' };
    render(
      <DialBase
        propertyPoint={point}
        alarmPoint={alarmPoint}
        isLoading
        settings={{}}
      />
    );

    expect(screen.queryByText(point.y)).toBeNull();
    expect(screen.queryByText(alarmPoint.y)).toBeNull();
  });
});
