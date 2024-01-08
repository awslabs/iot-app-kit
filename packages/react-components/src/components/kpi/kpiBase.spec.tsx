import React from 'react';
import { render, screen } from '@testing-library/react';
import { KpiBase } from './kpiBase';
import { StatusIconType } from '../../common/constants';
import type { DataPoint } from '@iot-app-kit/core';

describe('name', () => {
  it('renders name when showName is true', () => {
    const someName = 'some-name';
    render(<KpiBase name={someName} settings={{ showName: true }} />);

    expect(screen.queryByText(someName)).not.toBeNull();
  });

  it('does not render name when showName is false', () => {
    const someName = 'some-name';
    render(<KpiBase name={someName} settings={{ showName: false }} />);

    expect(screen.queryByText(someName)).toBeNull();
  });
});

describe('unit', () => {
  const point: DataPoint = { x: 1213, y: 123 };

  it('renders unit when showUnit is true and provided a property point', () => {
    const someUnit = 'some-Unit';
    render(
      <KpiBase
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
      <KpiBase
        unit={someUnit}
        alarmPoint={point}
        settings={{ showUnit: true }}
      />
    );

    expect(screen.queryByText(someUnit)).not.toBeNull();
  });

  it('does not render unit when showUnit is true and is not provided a data point', () => {
    const someUnit = 'some-Unit';
    render(<KpiBase unit={someUnit} settings={{ showUnit: true }} />);

    expect(screen.queryByText(someUnit)).toBeNull();
  });

  it('does not render unit when showUnit is false', () => {
    const someUnit = 'some-Unit';
    render(
      <KpiBase
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
      <KpiBase
        propertyPoint={{ x: new Date().getTime(), y: Y_VALUE }}
        settings={{ showName: false }}
      />
    );
    expect(screen.queryByText(Y_VALUE)).not.toBeNull();
  });

  it('renders alarm points y value', () => {
    const Y_VALUE = 123445;
    render(
      <KpiBase
        alarmPoint={{ x: new Date().getTime(), y: Y_VALUE }}
        settings={{ showName: false }}
      />
    );
    expect(screen.queryByText(Y_VALUE)).not.toBeNull();
  });

  it('renders property points y value when provided both an alarm and a property', () => {
    const Y_VALUE_PROPERTY = 123445;
    const Y_VALUE_ALARM = 'alarm_value';
    render(
      <KpiBase
        alarmPoint={{ x: new Date().getTime(), y: Y_VALUE_ALARM }}
        propertyPoint={{ x: 234324, y: Y_VALUE_PROPERTY }}
        settings={{ showName: false }}
      />
    );

    expect(screen.queryByText(Y_VALUE_PROPERTY)).not.toBeNull();
    expect(screen.queryByText(Y_VALUE_ALARM)).toBeNull();
  });
});

describe('timestamp', () => {
  const PROPERTY_POINT_DATE = new Date(2000, 0, 0);
  const ALARM_POINT_DATE = new Date(2001, 0, 0);

  it('renders property timestamp when showTimestamp is true', () => {
    render(
      <KpiBase
        propertyPoint={{ x: PROPERTY_POINT_DATE.getTime(), y: 123123 }}
        settings={{ showTimestamp: true }}
      />
    );

    expect(
      screen.queryByText(PROPERTY_POINT_DATE.toLocaleString())
    ).not.toBeNull();
  });

  it('does not render property timestamp when showTimestamp is false', () => {
    render(
      <KpiBase
        propertyPoint={{ x: PROPERTY_POINT_DATE.getTime(), y: 123123 }}
        settings={{ showTimestamp: false }}
      />
    );

    expect(screen.queryByText(PROPERTY_POINT_DATE.toLocaleString())).toBeNull();
  });

  it('renders alarm timestamp when showTimestamp is true', () => {
    render(
      <KpiBase
        alarmPoint={{ x: ALARM_POINT_DATE.getTime(), y: 123123 }}
        settings={{ showTimestamp: true }}
      />
    );

    expect(
      screen.queryByText(ALARM_POINT_DATE.toLocaleString())
    ).not.toBeNull();
  });

  it('does not render alarm timestamp when showTimestamp is false', () => {
    render(
      <KpiBase
        alarmPoint={{ x: ALARM_POINT_DATE.getTime(), y: 123123 }}
        settings={{ showTimestamp: false }}
      />
    );

    expect(screen.queryByText(ALARM_POINT_DATE.toLocaleString())).toBeNull();
  });

  it('renders only property time stamp when provided property and alarm', () => {
    render(
      <KpiBase
        alarmPoint={{ x: ALARM_POINT_DATE.getTime(), y: 123123 }}
        propertyPoint={{ x: PROPERTY_POINT_DATE.getTime(), y: 123123 }}
        settings={{ showTimestamp: true }}
      />
    );

    expect(screen.queryByText(ALARM_POINT_DATE.toLocaleString())).toBeNull();
    expect(
      screen.queryByText(PROPERTY_POINT_DATE.toLocaleString())
    ).not.toBeNull();
  });
});

describe('error', () => {
  it('renders error', () => {
    const someError = 'some-error';
    render(<KpiBase error={someError} settings={{}} />);

    expect(screen.queryByText(someError)).not.toBeNull();
  });
});

describe('loading', () => {
  it('renders loading spinner while isLoading is true', () => {
    render(<KpiBase isLoading settings={{}} />);

    expect(screen.queryByTestId('loading')).not.toBeNull();
  });

  it('does not render loading spinner while isLoading is false', () => {
    render(<KpiBase isLoading={false} settings={{}} />);

    expect(screen.queryByTestId('loading')).toBeNull();
  });

  it('renders error while loading', () => {
    const someError = 'some-error';
    render(<KpiBase error={someError} isLoading settings={{}} />);

    expect(screen.queryByText(someError)).not.toBeNull();
  });

  it('does not render icon while loading when showIcon is true', () => {
    render(
      <KpiBase
        isLoading
        icon={StatusIconType.ACTIVE}
        settings={{ showIcon: true }}
      />
    );
    expect(screen.queryByTestId('status-icon-active')).toBeNull();
  });

  it('does not render data point while isLoading is true', () => {
    const point = { x: 12341, y: 123213 };
    render(<KpiBase propertyPoint={point} isLoading settings={{}} />);

    expect(screen.queryByText(point.y)).toBeNull();
  });

  it('does not render timestamp while loading and showTimestamp is true', () => {
    const DATE = new Date(2001, 0, 0);
    render(
      <KpiBase
        propertyPoint={{ x: DATE.getTime(), y: 123123 }}
        isLoading
        settings={{ showTimestamp: true }}
      />
    );

    expect(screen.queryByText(DATE.toLocaleString())).toBeNull();
  });
});

describe('icon', () => {
  it('renders icon when showIcon is true', () => {
    render(
      <KpiBase icon={StatusIconType.ACTIVE} settings={{ showIcon: true }} />
    );
    expect(screen.queryByTestId('status-icon-active')).not.toBeNull();
  });

  it('does not render icon when showIcon is false', () => {
    render(
      <KpiBase icon={StatusIconType.ACTIVE} settings={{ showIcon: false }} />
    );
    expect(screen.queryByTestId('status-icon-active')).toBeNull();
  });
});
