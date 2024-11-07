import { render } from '@testing-library/react';
import { AlarmStateText } from './alarmStateText';

describe('AlarmStateText', () => {
  it('renders Active state', () => {
    const { getByText } = render(
      <AlarmStateText alarmState='Active' isLoading={false} />
    );

    expect(getByText('Active alarm')).toBeInTheDocument();
  });

  it('renders Normal state', () => {
    const { getByText } = render(
      <AlarmStateText alarmState='Normal' isLoading={false} />
    );

    expect(getByText('Normal')).toBeInTheDocument();
  });

  it('renders Latched state', () => {
    const { getByText } = render(
      <AlarmStateText alarmState='Latched' isLoading={false} />
    );

    expect(getByText('Latched alarm')).toBeInTheDocument();
  });

  it('renders Acknowledged state', () => {
    const { getByText } = render(
      <AlarmStateText alarmState='Acknowledged' isLoading={false} />
    );

    expect(getByText('Acknowledged alarm')).toBeInTheDocument();
  });

  it('renders Disabled state', () => {
    const { getByText } = render(
      <AlarmStateText alarmState='Disabled' isLoading={false} />
    );

    expect(getByText('Disabled alarm')).toBeInTheDocument();
  });

  it('renders SnoozeDisabled state', () => {
    const { getByText } = render(
      <AlarmStateText alarmState='SnoozeDisabled' isLoading={false} />
    );

    expect(getByText('Snoozed alarm')).toBeInTheDocument();
  });

  it('renders Loading state', () => {
    const { queryByText } = render(
      <AlarmStateText
        alarmState='Active'
        isLoading={false}
        status={{
          isLoading: true,
          isRefetching: false,
          isSuccess: true,
          isError: false,
        }}
      />
    );

    expect(queryByText('Active alarm')).toBeNull();
  });

  it('if loading data return null', () => {
    const { queryByText } = render(
      <AlarmStateText alarmState='Active' isLoading={true} />
    );

    expect(queryByText('Active alarm')).toBeNull();
  });
});
