export const DEFAULT_GAUGE_PROGRESS_COLOR = '#0173BC';
export const DEFAULT_GAUGE_SETTINGS = {
  series: [
    {
      type: 'gauge',
      center: ['50%', '70%'], //The first value '50%' is used to horizontally center the component, while the second value '70%' is used to vertically position the component starting from the top.
      radius: '98%', //radius of the gauge
      startAngle: 190, //start angle of the gauge in degrees
      endAngle: -10, //end angle of the gauge in degrees
      min: 0, //guage default start point
      max: 100, //gauge default end point
      silent: true, //control mouse hover actions
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
        /**
         * make axis line wider and default color in gray
         */
        lineStyle: {
          width: 30,
          color: [[1, '#D5DBDB']],
        },
      },
    },
  ],
};
export const DEFAULT_GAUGE_PROGRESS_SETTINGS = {
  series: [
    ...DEFAULT_GAUGE_SETTINGS.series,
    {
      type: 'gauge',
      center: ['50%', '70%'], //The first value '50%' is used to horizontally center the component, while the second value '70%' is used to vertically position the component starting from the top.
      radius: '98%', //radius of the gauge progress bar
      startAngle: 190, //start angle of the gauge in degrees progress bar
      endAngle: -10, //end angle of the gauge in degrees progress bar
      silent: true, //control mouse hover actions
      min: 0, //guage progress bar default start point
      max: 100, //gauge progress bar default end point
      animation: false, // no animation while value changes
      itemStyle: {
        color: DEFAULT_GAUGE_PROGRESS_COLOR, // default color for gauge progress bar
      },
      progress: {
        show: true,
        width: 30, //gauge progress bar thickness
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
        /**
         * center value settings for color, position, animation, value font size & font weigth and unit size & font weight etc..
         */
        valueAnimation: false, // no animation while value changes
        offsetCenter: [0, '-10%'], // position of the center value
        fontSize: 25, // font size of the center value in px
        fontWeight: '500', // font weight of the center value in px
        formatter: '{value}', // formatter of the center value
        color: 'inherit', // color of the center value
        rich: {
          value: {
            fontWeight: 'bolder', // font weight of the value
          },
          unit: {
            fontWeight: 'bolder', // font weight of the unit value
            padding: [0, 0, -15, -5],
          },
        },
      },
      title: {
        /**
         * title settings for the position, width, overflow and ellipsis
         */
        show: false,
        offsetCenter: [0, 15],
        width: 300, // width of the title in px
        overflow: 'truncate',
        ellipsis: '...',
        rich: {
          name: {
            fontSize: 12, // font size of the title in px
            color: '#000', // color of the title
          },
        },
      },
    },
  ],
};
export const DEFAULT_GAUGE_PROGRESS_SETTINGS_WITH_THRESHOLDS = {
  series: [
    ...DEFAULT_GAUGE_PROGRESS_SETTINGS.series,
    {
      type: 'gauge',
      center: ['50%', '70%'], //The first value '50%' is used to horizontally center the component, while the second value '70%' is used to vertically position the component starting from the top.
      radius: '100%', //radius of the gauge outside the arc
      startAngle: 190, //start angle of the gauge in degrees
      endAngle: -10, //end angle of the gauge in degrees
      min: 0, //outside the arc default start point
      max: 100, //outside the arc default end point
      silent: true, //control mouse hover actions
      splitNumber: 10, //number of split lines in the outside the arc
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
        /**
         * make split line distance to oustside arc, length, wider, and default color in white
         */
        distance: 0,
        length: 3,
        lineStyle: {
          width: 1,
          color: '#fff',
        },
      },
      axisLabel: {
        /**
         * make axis label distance to oustside arc, color, rotate and font size
         */
        distance: -20,
        color: 'auto',
        fontSize: 12,
        rotate: 'tangential', // Given tangential because if min and max are having four or more digit number and if the rotate is not tangential then the label is overlapping with the arc
      },
      axisLine: {
        /**
         * outside arc axis line thickness
         */
        lineStyle: {
          width: -3,
        },
      },
      anchor: {
        show: false,
      },
      detail: {
        /**
         * center value settings for color, position, animation, value font size, font weigth and unit size, font weight etc..
         */
        valueAnimation: false, // no animation while value changes
        offsetCenter: [0, '-10%'], // position of the center value
        fontSize: 25, //font size of the center value
        fontWeight: '500', //font weight of the center value
        formatter: '{value}', //formatter for the center value
        color: 'inherit', //color of the center value
        rich: {
          value: {
            fontWeight: 'bolder', //font weight of the value
          },
          unit: {
            fontWeight: 'bolder', //font weight of the unit
            padding: [0, 0, -15, -5],
          },
        },
      },
      title: {
        show: false, //hide title for outside arc
      },
    },
  ],
};

export const DEFAULT_GAUGE_STYLES = {
  gaugeThickness: 30,
  showName: false,
  showUnit: true,
  fontSize: 40,
  labelFontSize: 12,
  unitFontSize: 16,
  yMin: 0,
  yMax: 100,
};
