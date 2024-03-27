export const DEFAULT_GAUGE_PROGRESS_COLOR = '#0173BC';
export const DEFAULT_GAUGE_SETTINGS = {
  series: [
    {
      type: 'gauge',
      center: ['50%', '50%'],
      radius: '40%',
      startAngle: 190,
      endAngle: -10,
      min: 0,
      max: 100,
      silent: true,
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          width: 30,
          color: [[1, '#D5DBDB']],
        },
      },
    },
    {
      type: 'gauge',
      center: ['50%', '50%'],
      radius: '40%',
      startAngle: 190,
      endAngle: -10,
      silent: true,
      min: 0,
      max: 100,
      itemStyle: {
        color: DEFAULT_GAUGE_PROGRESS_COLOR,
      },
      progress: {
        show: true,
        width: 30,
      },
      pointer: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '-10%'],
        fontSize: 25,
        fontWeight: '500',
        formatter: '{value}',
        color: 'inherit',
        rich: {
          value: {
            fontWeight: 'bolder',
          },
          unit: {
            fontWeight: 'bolder',
            padding: [0, 0, -15, -5],
          },
        },
      },
      title: {
        show: false,
        offsetCenter: [0, 10],
        width: 300,
        overflow: 'truncate',
        ellipsis: '...',
      },
    },
  ],
};
export const DEFAULT_GAUGE_SETTINGS_WITH_THRESHOLDS = {
  series: [
    ...DEFAULT_GAUGE_SETTINGS.series,
    {
      type: 'gauge',
      center: ['50%', '50%'],
      radius: '41%',
      startAngle: 190,
      endAngle: -10,
      min: 0,
      max: 100,
      silent: true,
      splitNumber: 10,
      progress: {
        show: false,
      },
      pointer: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        distance: 0,
        length: 3,
        lineStyle: {
          width: 1,
          color: '#fff',
        },
      },
      axisLabel: {
        distance: -30,
        color: 'auto',
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          width: -3,
        },
      },
      anchor: {
        show: false,
      },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '-10%'],
        fontSize: 25,
        fontWeight: '500',
        formatter: '{value}',
        color: 'inherit',
        rich: {
          value: {
            fontWeight: 'bolder',
          },
          unit: {
            fontWeight: 'bolder',
            padding: [0, 0, -15, -5],
          },
        },
      },
      title: {
        show: false,
      },
    },
  ],
};
