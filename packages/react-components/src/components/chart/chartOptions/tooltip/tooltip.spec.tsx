import React from 'react';
import { render, screen } from '@testing-library/react';
import { XYPlotTooltip } from './tooltip';
import { DataPoint } from '@iot-app-kit/core';
import { IdentifiableDataStreamOptions } from './datastreams';

const time = 1710519237362;

const mockDataStream1 = {
  id: 'datastream-1',
  name: 'fake datastream',
  color: 'red',
  value: 10,
  significantDigits: 4,
  quality: 'GOOD' as DataPoint['quality'],
} satisfies IdentifiableDataStreamOptions;

const mockDataStream2 = {
  id: 'datastream-2',
  name: 'fake datastream 2',
  color: 'blue',
  value: 20,
  significantDigits: 4,
  quality: 'BAD' as DataPoint['quality'],
} satisfies IdentifiableDataStreamOptions;

const mockDataStreamAlarm1 = {
  ...mockDataStream1,
  assetId: 'assetId-1',
  alarmName: 'alarmName-1',
  alarmExpression: 'Temperature = 30',
  severity: 12481,
  alarmState: 'Active',
} satisfies IdentifiableDataStreamOptions;

const mockDataStreamAlarm2 = {
  ...mockDataStream2,
  assetId: 'assetId-2',
  alarmName: 'alarmName-2',
  alarmExpression: 'Rotation = 100',
  severity: 28230,
  alarmState: 'Normal',
} satisfies IdentifiableDataStreamOptions;

describe('echarts tooltip', () => {
  it('can render a tooltip', () => {
    const datastreams = [mockDataStream1, mockDataStream2];
    const tooltip = render(
      <XYPlotTooltip
        datastreams={datastreams}
        time={time}
        showBadDataIcons={true}
        showUncertainDataIcons={true}
      />
    );

    expect(tooltip).not.toBeNull();
    expect(screen.getByText(mockDataStream1.name)).not.toBeNull();
    expect(screen.getByText('10.0000')).not.toBeNull();
    expect(screen.getByText(mockDataStream2.name)).not.toBeNull();
    expect(tooltip.queryByText('(Bad data quality)')).toBeInTheDocument();
    expect(screen.getByText('20.0000')).not.toBeNull();
  });

  it('does not show data quality if the settings are disabled', () => {
    const mockDataStreamUncertainQuality = {
      ...mockDataStream1,
      quality: 'UNCERTAIN' as DataPoint['quality'],
    };
    const mockDataStreamBadQuality = {
      ...mockDataStream2,
      quality: 'BAD' as DataPoint['quality'],
    };
    const datastreams = [mockDataStreamUncertainQuality, mockDataStreamBadQuality];
    const tooltip = render(
      <XYPlotTooltip
        datastreams={datastreams}
        time={time}
        showBadDataIcons={false}
        showUncertainDataIcons={false}
      />
    );

    expect(tooltip).not.toBeNull();
    expect(screen.getByText(mockDataStream1.name)).not.toBeNull();
    expect(
      tooltip.queryByText('(Uncertain data quality)')
    ).not.toBeInTheDocument();
    expect(screen.getByText('10.0000')).not.toBeNull();
    expect(screen.getByText(mockDataStream2.name)).not.toBeNull();
    expect(tooltip.queryByText('(Bad data quality)')).not.toBeInTheDocument();
    expect(screen.getByText('20.0000')).not.toBeNull();
  });

  it('can render a tooltip with alarm data', () => {
    const datastreams = [mockDataStreamAlarm1, mockDataStreamAlarm2];

    const tooltip = render(
      <XYPlotTooltip
        datastreams={datastreams}
        time={time}
        showBadDataIcons={true}
        showUncertainDataIcons={true}
        showAlarmIcons={true}
      />
    );

    expect(tooltip).not.toBeNull();
    expect(screen.getByText(mockDataStreamAlarm1.name)).not.toBeNull();
    expect(screen.getByText('10.0000')).not.toBeNull();
    expect(screen.getByText(mockDataStreamAlarm2.name)).not.toBeNull();
    expect(tooltip.queryByText('(Bad data quality)')).toBeInTheDocument();
    expect(screen.getByText('20.0000')).not.toBeNull();

    expect(screen.getByText(mockDataStreamAlarm1.alarmName)).not.toBeNull();
    expect(screen.getByText(/Temperature \= 30/)).not.toBeNull();
    expect(screen.getByText(/12481/)).not.toBeNull();
    expect(screen.getByText(mockDataStreamAlarm2.alarmName)).not.toBeNull();
    expect(screen.getByText(/Rotation \= 100/)).not.toBeNull();
    expect(screen.getByText(/28230/)).not.toBeNull();
  });

  it('does not show alarm data if alarm setting is disabled', () => {
    const datastreams = [mockDataStreamAlarm1, mockDataStreamAlarm2];

    const tooltip = render(
      <XYPlotTooltip
        datastreams={datastreams}
        time={time}
        showAlarmIcons={false}
      />
    );

    expect(tooltip).not.toBeNull();
    expect(tooltip.queryByText(mockDataStreamAlarm1.alarmName)).not.toBeInTheDocument();
    expect(tooltip.queryByText(/Temperature \= 30/)).not.toBeInTheDocument();
    expect(tooltip.queryByText(/12481/)).not.toBeInTheDocument();
    expect(tooltip.queryByText(mockDataStreamAlarm2.alarmName)).not.toBeInTheDocument();
    expect(tooltip.queryByText(/Rotation \= 100/)).not.toBeInTheDocument();
    expect(tooltip.queryByText(/28230/)).not.toBeInTheDocument();
  });
});
