import { registerTheme } from 'echarts';

export const registerCloudscapeThemes = () => {
  registerTheme('cloudscapeLightTheme', {
    color: [
      '#688ae8',
      '#e07f9d',
      '#2ea597',
      '#8456ce',
      '#e07941',
      '#3759ce',
      '#962249',
      '#096f64',
      '#6237a7',
      '#a84401',
      '#273ea5',
      '#780d35',
      '#03524a',
      '#4a238b',
      '#7e3103',
      '#1b2b88',
      '#ce567c',
      '#003e38',
      '#9469d6',
      '#602400',
      '#4066df',
      '#a32952',
      '#0d7d70',
      '#6b40b2',
      '#bc4d01',
      '#2c46b1',
      '#81143b',
      '#045b52',
      '#512994',
      '#8a3603',
      '#1f3191',
      '#da7596',
      '#01443e',
      '#a783e1',
      '#692801',
      '#5978e3',
      '#b1325c',
      '#1c8e81',
      '#7749bf',
      '#cc5f21',
      '#314fbf',
      '#8b1b42',
      '#06645a',
      '#59309d',
      '#983c02',
      '#23379b',
      '#6f062f',
      '#014b44',
      '#431d84',
      '#732c02',
    ],
    backgroundColor: '#ffffff',
    textStyle: {},
    title: {
      textStyle: {
        color: '#000716',
      },
      subtextStyle: {
        color: '#000716',
      },
    },
    line: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: 'emptyCircle',
      smooth: false,
    },
    radar: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: 'emptyCircle',
      smooth: false,
    },
    bar: {
      itemStyle: {
        barBorderWidth: '0',
        barBorderColor: '#ccc',
      },
    },
    pie: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    candlestick: {
      itemStyle: {
        color: '#eb5454',
        color0: '#47b262',
        borderColor: '#eb5454',
        borderColor0: '#47b262',
        borderWidth: 1,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
      lineStyle: {
        width: 1,
        color: '#aaa',
      },
      symbolSize: 4,
      symbol: 'emptyCircle',
      smooth: false,
      color: [
        '#688ae8',
        '#e07f9d',
        '#2ea597',
        '#8456ce',
        '#e07941',
        '#3759ce',
        '#962249',
        '#096f64',
        '#6237a7',
        '#a84401',
        '#273ea5',
        '#780d35',
        '#03524a',
        '#4a238b',
        '#7e3103',
        '#1b2b88',
        '#ce567c',
        '#003e38',
        '#9469d6',
        '#602400',
        '#4066df',
        '#a32952',
        '#0d7d70',
        '#6b40b2',
        '#bc4d01',
        '#2c46b1',
        '#81143b',
        '#045b52',
        '#512994',
        '#8a3603',
        '#1f3191',
        '#da7596',
        '#01443e',
        '#a783e1',
        '#692801',
        '#5978e3',
        '#b1325c',
        '#1c8e81',
        '#7749bf',
        '#cc5f21',
        '#314fbf',
        '#8b1b42',
        '#06645a',
        '#59309d',
        '#983c02',
        '#23379b',
        '#6f062f',
        '#014b44',
        '#431d84',
        '#732c02',
      ],
      label: {
        color: '#000716',
      },
    },
    map: {
      itemStyle: {
        areaColor: '#eee',
        borderColor: '#444',
        borderWidth: 0.5,
      },
      label: {
        color: '#000',
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(255,215,0,0.8)',
          borderColor: '#444',
          borderWidth: 1,
        },
        label: {
          color: 'rgb(100,0,0)',
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: '#eee',
        borderColor: '#444',
        borderWidth: 0.5,
      },
      label: {
        color: '#000',
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(255,215,0,0.8)',
          borderColor: '#444',
          borderWidth: 1,
        },
        label: {
          color: 'rgb(100,0,0)',
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#e0e2e7',
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#e0e2e7',
        },
      },
      axisLabel: {
        show: true,
        color: '#404d5c',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#e0e2e7'],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#e0e2e7',
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#e0e2e7',
        },
      },
      axisLabel: {
        show: true,
        color: '#404d5c',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#e0e2e7'],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#e0e2e7',
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#e0e2e7',
        },
      },
      axisLabel: {
        show: true,
        color: '#404d5c',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#e0e2e7'],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#e0e2e7',
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#e0e2e7',
        },
      },
      axisLabel: {
        show: true,
        color: '#404d5c',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#e0e2e7'],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: '#5f6b7a',
      },
      emphasis: {
        iconStyle: {
          borderColor: '#5f6b7a',
        },
      },
    },
    legend: {
      textStyle: {
        color: '#404d5c',
      },
      pageTextStyle: {
        color: '#404d5c',
      },
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#5f6b7a',
          width: 1,
        },
        crossStyle: {
          color: '#5f6b7a',
          width: 1,
        },
      },
    },
    timeline: {
      lineStyle: {
        color: '#dae1f5',
        width: 2,
      },
      itemStyle: {
        color: '#a4b1d7',
        borderWidth: 1,
      },
      controlStyle: {
        color: '#a4b1d7',
        borderColor: '#a4b1d7',
        borderWidth: 1,
      },
      checkpointStyle: {
        color: '#316bf3',
        borderColor: '#ffffff',
      },
      label: {
        color: '#a4b1d7',
      },
      emphasis: {
        itemStyle: {
          color: '#ffffff',
        },
        controlStyle: {
          color: '#a4b1d7',
          borderColor: '#a4b1d7',
          borderWidth: 1,
        },
        label: {
          color: '#a4b1d7',
        },
      },
    },
    visualMap: {
      color: ['#bf444c'],
    },
    dataZoom: {
      handleSize: 'undefined%',
      textStyle: {},
    },
    markPoint: {
      label: {
        color: '#000716',
      },
      emphasis: {
        label: {
          color: '#000716',
        },
      },
    },
  });
  registerTheme('cloudscapeDarkTheme', {
    color: [
      '#486de8',
      '#e07f9d',
      '#018977',
      '#b088f5',
      '#c55305',
      '#8ea9ff',
      '#ffb0c8',
      '#40bfa9',
      '#d6baff',
      '#f89256',
      '#c3d1ff',
      '#ffdfe8',
      '#94e0d0',
      '#efe2ff',
      '#ffc6a4',
      '#ecf0ff',
      '#d56889',
      '#d7f7f0',
      '#a173ea',
      '#ffede2',
      '#7698fe',
      '#f5a2bb',
      '#00b09b',
      '#cbabfc',
      '#f27c36',
      '#b1c5ff',
      '#ffd1de',
      '#77d7c3',
      '#e8d5ff',
      '#ffb68b',
      '#dfe6ff',
      '#c64a70',
      '#c2f0e6',
      '#8d59de',
      '#ffe1cf',
      '#6384f5',
      '#eb92ad',
      '#009d89',
      '#bf9bf9',
      '#de6923',
      '#a2b8ff',
      '#ffc1d4',
      '#5fccb7',
      '#dfc8ff',
      '#fca572',
      '#d2dcff',
      '#ffecf1',
      '#ace9db',
      '#f5edff',
      '#ffd4bb',
    ],
    backgroundColor: '#0f1b2a',
    textStyle: {},
    title: {
      textStyle: {
        color: '#fbfbfb',
      },
      subtextStyle: {
        color: '#fbfbfb',
      },
    },
    line: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: 'emptyCircle',
      smooth: false,
    },
    radar: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: 'emptyCircle',
      smooth: false,
    },
    bar: {
      itemStyle: {
        barBorderWidth: '0',
        barBorderColor: '#ccc',
      },
    },
    pie: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
    },
    candlestick: {
      itemStyle: {
        color: '#eb5454',
        color0: '#47b262',
        borderColor: '#eb5454',
        borderColor0: '#47b262',
        borderWidth: 1,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: '0',
        borderColor: '#ccc',
      },
      lineStyle: {
        width: 1,
        color: '#aaa',
      },
      symbolSize: 4,
      symbol: 'emptyCircle',
      smooth: false,
      color: [
        '#486de8',
        '#e07f9d',
        '#018977',
        '#b088f5',
        '#c55305',
        '#8ea9ff',
        '#ffb0c8',
        '#40bfa9',
        '#d6baff',
        '#f89256',
        '#c3d1ff',
        '#ffdfe8',
        '#94e0d0',
        '#efe2ff',
        '#ffc6a4',
        '#ecf0ff',
        '#d56889',
        '#d7f7f0',
        '#a173ea',
        '#ffede2',
        '#7698fe',
        '#f5a2bb',
        '#00b09b',
        '#cbabfc',
        '#f27c36',
        '#b1c5ff',
        '#ffd1de',
        '#77d7c3',
        '#e8d5ff',
        '#ffb68b',
        '#dfe6ff',
        '#c64a70',
        '#c2f0e6',
        '#8d59de',
        '#ffe1cf',
        '#6384f5',
        '#eb92ad',
        '#009d89',
        '#bf9bf9',
        '#de6923',
        '#a2b8ff',
        '#ffc1d4',
        '#5fccb7',
        '#dfc8ff',
        '#fca572',
        '#d2dcff',
        '#ffecf1',
        '#ace9db',
        '#f5edff',
        '#ffd4bb',
      ],
      label: {
        color: '#ffffff',
      },
    },
    map: {
      itemStyle: {
        areaColor: '#eee',
        borderColor: '#444',
        borderWidth: 0.5,
      },
      label: {
        color: '#000',
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(255,215,0,0.8)',
          borderColor: '#444',
          borderWidth: 1,
        },
        label: {
          color: 'rgb(100,0,0)',
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: '#eee',
        borderColor: '#444',
        borderWidth: 0.5,
      },
      label: {
        color: '#000',
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(255,215,0,0.8)',
          borderColor: '#444',
          borderWidth: 1,
        },
        label: {
          color: 'rgb(100,0,0)',
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#5f6b7a',
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#5f6b7a',
        },
      },
      axisLabel: {
        show: true,
        color: '#bfc4cb',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#586473'],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#5f6b7a',
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#5f6b7a',
        },
      },
      axisLabel: {
        show: true,
        color: '#bfc4cb',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#586473'],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#5f6b7a',
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#5f6b7a',
        },
      },
      axisLabel: {
        show: true,
        color: '#bfc4cb',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#586473'],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#5f6b7a',
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#5f6b7a',
        },
      },
      axisLabel: {
        show: true,
        color: '#bfc4cb',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#586473'],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: '#b6bec9',
      },
      emphasis: {
        iconStyle: {
          borderColor: '#ffffff',
        },
      },
    },
    legend: {
      textStyle: {
        color: '#b6bec9',
      },
      pageTextStyle: {
        color: '#b6bec9',
      },
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#ffffff',
          width: 1,
        },
        crossStyle: {
          color: '#ffffff',
          width: 1,
        },
      },
    },
    timeline: {
      lineStyle: {
        color: '#dae1f5',
        width: 2,
      },
      itemStyle: {
        color: '#a4b1d7',
        borderWidth: 1,
      },
      controlStyle: {
        color: '#a4b1d7',
        borderColor: '#a4b1d7',
        borderWidth: 1,
      },
      checkpointStyle: {
        color: '#316bf3',
        borderColor: '#ffffff',
      },
      label: {
        color: '#a4b1d7',
      },
      emphasis: {
        itemStyle: {
          color: '#ffffff',
        },
        controlStyle: {
          color: '#a4b1d7',
          borderColor: '#a4b1d7',
          borderWidth: 1,
        },
        label: {
          color: '#a4b1d7',
        },
      },
    },
    visualMap: {
      color: ['#bf444c'],
    },
    dataZoom: {
      handleSize: 'undefined%',
      textStyle: {},
    },
    markPoint: {
      label: {
        color: '#ffffff',
      },
      emphasis: {
        label: {
          color: '#ffffff',
        },
      },
    },
  });
};
