import React from 'react';
import { render, screen } from '@testing-library/react';
import { XYPlotTooltip } from './tooltip';
import { DataPoint } from '@iot-app-kit/core';

const time = 1710519237362;

describe('echarts tooltip', () => {
  it('can render a tooltip', () => {
    const datastreams = [
      {
        id: 'datastream-1',
        name: 'fake datastream',
        color: 'red',
        value: 10,
        significantDigits: 4,
        quality: 'GOOD' as DataPoint['quality'],
      },
      {
        id: 'datastream-2',
        name: 'fake datastream 2',
        color: 'blue',
        value: 20,
        significantDigits: 4,
        quality: 'BAD' as DataPoint['quality'],
      },
    ];
    const tooltip = render(
      <XYPlotTooltip
        datastreams={datastreams}
        time={time}
        showBadDataIcons={true}
        showUncertainDataIcons={true}
      />
    );

    expect(tooltip).not.toBeNull();
    expect(screen.getByText('fake datastream')).not.toBeNull();
    expect(screen.getByText('10.0000')).not.toBeNull();
    expect(screen.getByText('fake datastream 2')).not.toBeNull();
    expect(tooltip.queryByText('(Bad data quality)')).toBeInTheDocument();
    expect(screen.getByText('20.0000')).not.toBeNull();
  });

  it('does not show data quality if the settings are disabled', () => {
    const datastreams = [
      {
        id: 'datastream-1',
        name: 'fake datastream',
        color: 'red',
        value: 10,
        significantDigits: 4,
        quality: 'UNCERTAIN' as DataPoint['quality'],
      },
      {
        id: 'datastream-2',
        name: 'fake datastream 2',
        color: 'blue',
        value: 20,
        significantDigits: 4,
        quality: 'BAD' as DataPoint['quality'],
      },
    ];
    const tooltip = render(
      <XYPlotTooltip
        datastreams={datastreams}
        time={time}
        showBadDataIcons={false}
        showUncertainDataIcons={false}
      />
    );

    expect(tooltip).not.toBeNull();
    expect(screen.getByText('fake datastream')).not.toBeNull();
    expect(
      tooltip.queryByText('(Uncertain data quality)')
    ).not.toBeInTheDocument();
    expect(screen.getByText('10.0000')).not.toBeNull();
    expect(screen.getByText('fake datastream 2')).not.toBeNull();
    expect(tooltip.queryByText('(Bad data quality)')).not.toBeInTheDocument();
    expect(screen.getByText('20.0000')).not.toBeNull();
  });
});
