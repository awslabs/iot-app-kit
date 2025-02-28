import {
  getPatternForXAxisLabelForAnomalyChart,
  getPatternForXAxisLabelForLineChart,
} from './time';

describe('getPatternForXAxisLabelForAnomalyChart', () => {
  it('gets year pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(1);
    date.setMonth(0);

    const pattern = getPatternForXAxisLabelForAnomalyChart(date.getTime());
    expect(pattern).toBe('yyyy');
  });
  it('gets month pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(1);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForAnomalyChart(date.getTime());
    expect(pattern).toBe('MMM');
  });
  it('gets day pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(2);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForAnomalyChart(date.getTime());
    expect(pattern).toBe('MMM d');
  });
  it('gets hour pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(1);
    date.setDate(1);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForAnomalyChart(date.getTime());
    expect(pattern).toBe("MMM d'\n'HH:mm");
  });
  it('gets minute pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(1);
    date.setHours(1);
    date.setDate(1);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForAnomalyChart(date.getTime());
    expect(pattern).toBe("MMM d'\n'HH:mm");
  });
  it('gets second pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(1);
    date.setMinutes(1);
    date.setHours(1);
    date.setDate(1);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForAnomalyChart(date.getTime());
    expect(pattern).toBe("MMM d'\n'HH:mm:ss");
  });
});

describe('getPatternForXAxisLabelForLineChart', () => {
  it('gets year pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(1);
    date.setMonth(0);

    const pattern = getPatternForXAxisLabelForLineChart(date.getTime());
    expect(pattern).toBe('yyyy');
  });
  it('gets month pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(1);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForLineChart(date.getTime());
    expect(pattern).toBe('MMM');
  });
  it('gets day pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(2);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForLineChart(date.getTime());
    expect(pattern).toBe('d');
  });
  it('gets hour pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(1);
    date.setDate(1);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForLineChart(date.getTime());
    expect(pattern).toBe('HH:mm');
  });
  it('gets minute pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(1);
    date.setHours(1);
    date.setDate(1);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForLineChart(date.getTime());
    expect(pattern).toBe('HH:mm');
  });
  it('gets second pattern', () => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(1);
    date.setMinutes(1);
    date.setHours(1);
    date.setDate(1);
    date.setMonth(1);

    const pattern = getPatternForXAxisLabelForLineChart(date.getTime());
    expect(pattern).toBe('HH:mm:ss');
  });
});
