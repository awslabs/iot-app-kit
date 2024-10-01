import type {
  DataZoomComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
  EChartsOption,
  LabelFormatterCallback,
} from 'echarts';
import { ChartAxisOptions, ChartLegend } from './types';
import {
  formatDate,
  getPatternForXAxisLabelForLineChart,
} from '../../utils/time';
import { round } from '@iot-app-kit/core-util';

export const DEFAULT_TOOLBOX_CONFIG: ToolboxComponentOption = {
  show: true,
  right: 52,
  top: 6, // top 6 is to avoid the overalping of echart toolbox with widget toolbox
  feature: {
    dataZoom: { title: { back: 'Undo\nzoom' }, filterMode: 'none' },
  },
  iconStyle: {
    borderColor: '#414d5c',
  },
};

export const DEFAULT_Y_AXIS: YAXisComponentOption = {
  show: true,
  type: 'value',
  position: 'left',
  scale: true,
};

// if you change this, please update the width calculation
export const DEFAULT_MARGIN = 50;

export const DEFAULT_LEGEND: LegendComponentOption = {
  show: true,
  type: 'scroll',
  orient: 'horizontal',
  left: 'left',
  bottom: '0',
  padding: [5, DEFAULT_MARGIN / 2],
};

export const DEFAULT_GRID = {
  left: 8,
  top: DEFAULT_MARGIN,
  right: DEFAULT_MARGIN,
  bottom: DEFAULT_MARGIN,
  containLabel: true,
} as const;

export const DEFAULT_TOOLTIP: TooltipComponentOption = {
  trigger: 'axis',
  confine: true,
};

export const DEFAULT_DATA_ZOOM: DataZoomComponentOption = {
  type: 'inside',
  filterMode: 'filter',
  zoomOnMouseWheel: true,
  moveOnMouseMove: 'shift',
  moveOnMouseWheel: false,
};

export const DEFAULT_X_AXIS_ID = 'default-x-Axis';
export const DEFAULT_X_AXIS: XAXisComponentOption = {
  id: DEFAULT_X_AXIS_ID,
  show: true,
  type: 'time' as const,
  axisLabel: {
    hideOverlap: true,
    color: '#5f6b7a',
  },
  axisLine: {
    lineStyle: {
      color: '#e9ebed',
      width: 2,
    },
  },
  splitNumber: 6,
  // hardcoding the x axis so that all viewport logic is managed exclusively by useDataZoom hooks
  min: 0,
  max: 4102513200000, // Jan 01 2100 19:00:00 UTC
};

export const getDefaultXAxis = (timeZone?: string): XAXisComponentOption => {
  const axisLabel = DEFAULT_X_AXIS.axisLabel;
  return {
    ...DEFAULT_X_AXIS,
    axisLabel: {
      ...axisLabel,
      formatter: (value: number) => {
        const pattern = getPatternForXAxisLabelForLineChart(value);
        return formatDate(value, { pattern, timeZone });
      },
    },
  };
};

export const DEFAULT_CHART_VISUALIZATION = 'line' as const;
// this is the chart live mode refresh rate, this should be inline with the animation props
// https://echarts.apache.org/en/option.html#animation
// packages/react-components/src/components/chart/converters , line 30
export const LIVE_MODE_REFRESH_RATE_MS = 1000;

export const DEFAULT_PRECISION = 4;

// resize constants
export const CHART_RESIZE_INITIAL_FACTOR = 0.7;
export const CHART_RESIZE_MIN_FACTOR = 0.3;

// this is an arbitrary value, so that user can almost "close" the legend section if they want to
export const CHART_RESIZE_MAX_FACTOR = 0.85;

export const MULTI_Y_AXIS_LEGEND_WIDTH = 170;

// style constants
export const EMPHASIZE_SCALE_CONSTANT = 2;
export const DEEMPHASIZE_OPACITY = 0.25;

export const UNCERTAIN_DATA_ICON_COLOR = '#8D6605';
export const UNCERTAIN_DATA_ICON_SIZE = 20;
export const UNCERTAIN_DATA_ICON =
  'path://M13.9088 12.7337L7.78375 0.483688C7.46129 -0.161229 6.54096 -0.161229 6.2185 0.483688L0.0935051 12.7337C-0.197389 13.3155 0.22567 14 0.876129 14H13.1261C13.7766 14 14.1996 13.3155 13.9088 12.7337ZM2.29191 12.25L7.00113 2.83156L11.7103 12.25H2.29191ZM7.87613 9.625V11.375H6.12613V9.625H7.87613ZM6.12613 8.75V5.25H7.87613V8.75H6.12613Z';
export const BAD_DATA_ICON_COLOR = '#D91515';
export const BAD_DATA_ICON_SIZE = 20;
export const BAD_DATA_ICON =
  'path://M0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7ZM12.25 7C12.25 9.8995 9.8995 12.25 7 12.25C4.1005 12.25 1.75 9.8995 1.75 7C1.75 4.1005 4.1005 1.75 7 1.75C9.8995 1.75 12.25 4.1005 12.25 7ZM5.76256 7L3.90503 8.85753L5.14247 10.095L7 8.23744L8.85753 10.095L10.095 8.85753L8.23744 7L10.095 5.14247L8.85753 3.90503L7 5.76256L5.14247 3.90503L3.90503 5.14247L5.76256 7Z';

export const ALARM_NORMAL_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOLSURBVHgBrVexctNAEN07yZlMcGaUP1C+gNCls93RAR1USb4g0KXCUhra5AswHR1JB1XsDirCFyC+AE1iZjzOScvuyXbu5JMj29kZJfLqbt/e3t7uOwE1JYiC4Bayl/TaQsQ9ARCyevI5RYBEgLgGAYNt8C7SKE3r2BUPDdiMglChOiaAQwOwjuleQ3jxKEqThaOqPvCKb1B1acBbWENo/pmKh+8WfJ8XXvUdZlcAGMKjiEgoGh1XNGRZ0Yie7C0AT4WAmJ5OQ/i7WTwU+hH+DuvoOWew+WmoF8S251wzf1SvXCRC4JGKhn2oIV60fQgIXZedciRmEeA9d4ELhPNMeM/qgrNk0W2P5xQRMaWIBBDWzNnpy7jlf6BwPC+Bx+p0eAL90QiWFZqT98dfvc4GR7ltfAk8yDfzwfibxuA/RejV7xL4OYGvdQKm4kfNM0Q4NnWcQ7wVegsoLF17ikiU9CN4JFHkQjk5Va704gTvh4fqr40vjngfYQXx4u0DzDDMT4exqacotCkKV4YqpdOzK72ivJroyTrgkGOPki+S75tWVCdJbJbnoEHYko5Ly4JHvIQVZAo+s+NwonwqcuorUgDaxUHChcu4BqgJPtNL8aek6lsOUVOTWHS1mVDCXDuN0+NyogpcUh7dlbaSbCfmb8bmU2B3OKONzhkvObEM+MR2UtIEPiwSdDSrwonZe23wCuEIWMSBi9L0XZ8GMggOJ1YCN0rwRFJKQkhMjQIVmr8rnVgWnMQHZSU8Y0sU4pc1Krfqdi0nlgi7VXMI+5q3oG8r7Zr9kBPL7DmieFFSDWRGBBJKFYrLJtRwYhlwzRFKrZ6xdZbPdysqx9TPoYLZsjEOXV1wzagx+2k5IESPFnSkjyEViDMPlOEAhj4RUgXgJJOacEB9mZDb0LJBVYT/F4SkP0qJOOzQ274xZl+0NgAH4wGsITJudolbnJg65hp5fPP53gGSvL31nTrTazAqIzWPttfeCPLO1o9lWRGHXbOsErjeXum/mdqzKx0VIa+ClNLIuG6bLnq/+OiyQ7nVMUvyXKll6pyj/OKm5cSOAS9o1mWTmtb0+qVvT1TA8hxaFDVmOoFrbibyVxD9s5qd+2ZUGYlVZX7lU5HO8TTQTatXgJ7Qeqi4Iz54OdXRoINHZewA6gvfoD7x8YZVL6cOR4IJf2xTHjylwhWCcT0nQH09J5o10NW15vX8P6ro3nV6/uhRAAAAAElFTkSuQmCC';
export const ALARM_NORMAL_ICON_COLOR = '#027F0C';

export const ALARM_ACTIVE_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALASURBVHgBxVdRTttAEJ11UIQCH0bCIZ/OTyFfLSdocoK2JyA5AeQEkBvACQg3aE/Q3CD5o5RK8SeQSHU/EGqL7b6xnLDexvZ6i+iTLGc3szOzs29mx0SG+OY4B1eO8x3PFM8BGUKQIdgwXm4y9Hdnsy0ygEUGuG402pJxhn1Vr78nA5SKwFfHOYyITthghogHhYNXs9mQNKEdget6/RjGT3OMM1zInLMsaUIrAqwwjKITKoHIsvp7t7enRXKFDlw2Gq4VBFNl2sdOL/BMeIAwtvH6KxPCSqXZurnx6F8cwLmfw1D3aYXwQsvqqIoTR8ckHRGUj8CHDpk6sGr3IVGvlUGyy+3ttiXEZ3muurGx1fQ8nzKQS8JKELRTE0JMWjkMb83nI961PPfz4aFLOch1IIqid6mxEBdUAJD1U8pAGL4mUweEEG7KgSCYUAEWxJTGbTJ1IEpXO1rf3Cx0YP3xUZWxjRzgqqcuziPTUsb3VRn7y87OEZVxgNmflNwngICkCZWIIgyPWSfpODB1XRupx6kk795H7n8gTQSVSo/XSFOxTtZd6MDv+3uu4648h2wYFFU0GSzLa5RpN9Gd7UBy26XOC+Ozvfm8sKar4DVRGJ4puo5UPiwr4apSymW3Wqvt65BvFaa2bf+qVscIoStN+7gj9hcRjSOQc+4dU+MMzgjWQTl8iB14jnPPQhEfRHLupc/4OcA9g1Cay5eGz0dg0/+CEL6F+73PbKeXhx8GwUCrJ0TLPQQrly0XFvXUzhdc6nJDKskMIdMr0q3VFYPFaiq+XSGWmkNkf5AG1nSE4MBH9AaHyzF6RHTK3lqtFlc6TqlU30hxLzHS0a39YYIQj2HkjZYwOLV7d9fUES3zaabecFlYVD8taDsAQk0Qrk5uxuA/lilTQUt9nLITvDtwoi+k3o9/oxkd8MXFMiVU0h+mZjs0Rdiu8gAAAABJRU5ErkJggg==';
export const ALARM_ACTIVE_ICON_COLOR = '#D91515';

export const ALARM_LATCHED_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG3SURBVHgBxZffbcIwEIfPJuozfUdVOk6lqlUnoBukmYAwQUHtADBB1T/vXSWqGIABiN0z6iGTOI7PCfSTQCQY+35f7OAIiOTr9WqqKr3Aj1sJorjNftYQgYAI3p7TVMrqW4BO/05tK5VcP+TlFphIiCBJdlNrcMNYyt0TRMA24EhPRFlgG3CkJ6IssAx40hNsCywDzfSixJc9GNtCsAFXeq1gbiJgJzOrKctCsAFX+gtIVkoliz4Wggow6ZUSj/Y5rfT6Ji9Lk1SDXtrfoZEMfzMO6TuogLb0dNTHQmcBvvR03MdC0tkA0+NkS62uMf1o9bGcaLsdTrzLkawyLI8GJQuFr3+vgZD0RKwFbwFd175OzFxoLYCTnoix0FoANz3BteAsICY9wbXgLCA2PcGx0CigT3qCY6FxH2hb9/V2d9nG+0dmLITcF44MDJGeCLVwZCA0vaF+J3QZCbFwMDBkeiLEwqGAvjO/ja4VsS/gFOmJLgv7OcC59kTXKrDxzQXRtte7zzcFDMj7clK49o7i82UywwEL+AdwGc1l/dqfEzMXJL4FbR5PVAI+WSvI9f4B4/yD49jzX51ZaGPj2PA5AAAAAElFTkSuQmCC';
export const ALARM_LATCHED_ICON_COLOR = '#B3911D';

export const ALARM_ACKNOWLEDGED_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG7SURBVHgB7VdNTsJAFP4eFLZyA3sDceXKBI7gCRx3RljgEmJiSRRZsgDjjuEEHsEad648Qo/AkgDynKHhz7aRKYEmpt+inbyXee/rzJvvdUjcNIpM1Ae4iMPCI8aFxYRXldzG4WGr3P2MHiA5FDNIGFaIzSOQiz2AwSX8WvEAAQJc2Xu8wh4gKnXJIHvdlvgWpARSAlaUQ9ScAqbjmh4rqT7CDAUiGsjugyuuHRvWWGz4ct9N2Wl7onpXAmaluY/pWL8pl7uVHWdoRACjUYGzmXv4kXwb8bs/a2or06Zvag3U09PJlz7wIlhTPUIJ/MMamOlVSJKAISJrQL60PcyVOcSnCjHS99yS+oUtkepASiAlEDiGSjyLotpw/po4F5x83lUa762b5z1kMhFKtguB2EwnK3n2QZeVBiM+PMrlywsSuklxdvwGgz/tXQksSWCkvs0wuYbaAlJdKrhcBrB5ohJn/THM4GWIuQyYNZAwEjBOTkN9NVvquSoee+u507FY9fyI8IQmrLyM8i/qhhAT+qREkdDJZbflYAtkERNfnx/u6dm5/oBS3OQ7EdgkQepqTyMC12XvqW0S4wcfpZ5+MEuxmwAAAABJRU5ErkJggg==';
export const ALARM_ACKNOWLEDGED_ICON_COLOR = '#5F6B7A';

export const ALARM_DISABLED_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMfSURBVHgBxVfBTttAEJ3ZODmnf+B+AXCoygUBXwD9gRJuFSCR3lBaKY7U0h5DBVVvmFtvhS8A1N7aQ/iC+g/qs+PudmbtJN6NDSZx1CclXq935+3Mzs7MIpREq+01IYq2FeI6gFoGQJeezeQrhtQO6DlApW6h0bj0+15YRi4+NKD1ynNVfXgIEloTwlKifazXe7SQ4N5RRR9YYzUcdom0DXMB+xdn718Xfs3r1FrXomtqulANAqw3NvOsIabI9zrLxeQYIkIPUWySwKcXZ8fIP2o/0X0IJ0w2PQ9cNYyuWfaURIO8WPOACHb903c3UAJE1FII3Vw5liXGFtB7nkPOWtGklbLkDP/zsc9zUotkkViCT1QKZ9RIHG6KvOefHnswA9Jj2G4ddEKltDUyi9Bc2jH1FqSm/22RnxD5nCcgAS2iT4s4NOSTD/FW6C1QtWHXmhOA0/CgKiSyAqMvjrRymJz36E/2GyrY5X2ECtE6eLuhlLzOdIVsBcHh1RobVE3OSJwYs+G5CX+jbZHE9glo769gQUBU5qmQsC7IDa3gIC5hYRA32TcFsOzQv2uMcZxB9nVnv6NgDnCkHL/EcQA1I/i6ws5wZdPoLPC/fAysrqaA/wxheSaF5CMXFoRsCE4ROuSEAfnBxBFjx4VM0DD2cF7EsZ0NA4FK3pl9cgMWBmnEHNJsIEDhTbbTjtlVgmRvmR1wK7iAtCMUh02oGFwjgF0fELfgY0cR6gKMlcrzHIeZnZzzDRopmc3vM3dyDGPZt+aMcnYlyKs1oC57/Kjx3+DXj3Dl+doTaq5mhqwuPVuDu5/fb2EOvNzrdCm/HGX7dK3x6cNXbo8rIp2zh9FWdqU00NvZf9NM6/tHRch7ynqj1rCK0iOqjER+UaqoPCuZptPcf54rpy6pKJ2E5Kkgo8tyhG+QfycIQOAlKrzipDWyCmnrUpBxpZTriNguuEGxEi9ICSPZFVxMCi0xK6Y0HyE3GXHWKiirH41xWZ9Drr8/JICtATX0FOAOlAYmscWR/SLi0gsYLyS9nlPFugEolpQuZCbXc0yS2gAeeT3/B4OvYmrMYEdwAAAAAElFTkSuQmCC';
export const ALARM_DISABLED_ICON_COLOR = '#5F6B7A';

export const ALARM_SNOOZED_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAM5SURBVHgBtVfBbtNAEJ3ZOBHH9A/cL2h7QPRSNb1xo/wAMbeqrdRwiwJSEwkKN1LUIm64N260Nzg1VTkgQML9AvwJOSLH3WXGdlJ7bacOdZ6UeD27O293PTv7FqEgrFa3Dp63qRDXAdQyAJr0rIe1OKSyS08HlbqAWu3U7neHRfzibQ2sra6pqqM9kGDdEBZybWO12qOBuFNb5VXwjNVotE+kLbgTsH9y/OpZbm2WMZh1xTunognlwMVqbSNrNUSKfLuznE+OQ0ToIYoNcrh4cnyA/KPyQmBDOGSydD8w1cg7Z98pjwny/Jm7RPDUPno5gAIgIksh7Gf60VYisQJZ5Dwr6rRSlJxhvz+wuU+0InGEK8E7KkJlXGjuPH9Lj4caec8+Omg73wd/YUZwH+fH5ZeVB2u8yo1YVR2kvHf18/JrwMF/0dL/0cgPiTx3BzR3Oir+zrGQ19ba7fSVgr2Ef4oh/hTBJ1AV3m4JuGDUulAWQl9uwuZ7weRE+D2UFa9DBb2imawI2BcHcdxGK9JkbsHpVWvvchBByQiDGOOTqsO1tynC3H4D+vZnMCcgquSukLAuKAy15CBOYW4Qg/gbRfGyoH8z0cYwHJgXfN/VLKbQT7gyg0+H/eGNq5nqxm2d9P1eNoQWmXQMt02YE+IpOMKQg9BNmHzDhHnB9/XT0BWo5FXSJhswN8hEzqHc7RigcECl5tgY5ezu+H1ajp8V5PtR0gAXggWknqGs3RcNKBmsEUDXB8QtwjytTiAxUvkxI2D+n5z1ZShQJqBltZk7FCS+7Gt9zFCQloPIl5kwVmWPH4EgcX59G5JwWKDiaqzJ6tL9NSDhcAF3wJPtzj6dL+24LdAa715/CspjYyjDvd+pkZKsjvT9TBlyiqx3KbAXxy8TTRjEwrXcgJSqVS0eWBRExcgpiMPJpMmxGnBMkNpigSxH+AzZdwIXBJ6iwjM+tMarQrM1KcmYUsp1RGzl3KBcEjqPSWs4UwcQONxqk0YUJV9MJMnx1GGUvpgw+NTKkdUzYyLrM8iD+tsc8GpABbsKsAmFgWFuMWQ/j7jwACYDia7npFgbgGJJBULm5nqOfKgpcGDG6/k/LBporMyhan8AAAAASUVORK5CYII=';
export const ALARM_SNOOZED_ICON_COLOR = '#5F6B7A';

const alarmLabelFormatter: (
  significantDigits: number,
  showAlarmIcons: boolean
) => LabelFormatterCallback =
  (significantDigits, showAlarmIcons) => (params) => {
    if (
      showAlarmIcons &&
      typeof params.value === 'object' &&
      'alarmState' in params.value
    ) {
      const alarmState = params.value.alarmState;
      const propertyValue = params.value.y;
      const showAlarmYLabelValue = !!params.value.showAlarmYLabelValue;
      return `{${alarmState}|} {${alarmState}_text|${
        showAlarmYLabelValue && propertyValue
          ? round(Number(propertyValue), significantDigits)
          : ''
      }}`;
    }
    return '';
  };
export const createAlarmLabel = (
  significantDigits: number,
  showAlarmIcons = true
) => ({
  show: true,
  offset: [0, -10],
  align: 'center',
  formatter: alarmLabelFormatter(significantDigits, showAlarmIcons),
  rich: {
    Normal: {
      height: 20,
      width: 20,
      color: ALARM_NORMAL_ICON_COLOR,
      backgroundColor: {
        image: ALARM_NORMAL_ICON,
      },
    },
    Normal_text: {
      color: ALARM_NORMAL_ICON_COLOR,
    },
    Active: {
      height: 20,
      width: 20,
      color: ALARM_ACTIVE_ICON_COLOR,
      backgroundColor: {
        image: ALARM_ACTIVE_ICON,
      },
    },
    Active_text: {
      color: ALARM_ACTIVE_ICON_COLOR,
    },
    Latched: {
      height: 20,
      width: 20,
      color: ALARM_LATCHED_ICON_COLOR,
      backgroundColor: {
        image: ALARM_LATCHED_ICON,
      },
    },
    Latched_text: {
      color: ALARM_LATCHED_ICON_COLOR,
    },
    Acknowledged: {
      height: 20,
      width: 20,
      color: ALARM_ACKNOWLEDGED_ICON_COLOR,
      backgroundColor: {
        image: ALARM_ACKNOWLEDGED_ICON,
      },
    },
    Acknowledged_text: {
      color: ALARM_ACKNOWLEDGED_ICON_COLOR,
    },
    Disabled: {
      height: 20,
      width: 20,
      color: ALARM_DISABLED_ICON_COLOR,
      backgroundColor: {
        image: ALARM_DISABLED_ICON,
      },
    },
    Disabled_text: {
      color: ALARM_DISABLED_ICON_COLOR,
    },
    Snoozed: {
      height: 20,
      width: 20,
      color: ALARM_SNOOZED_ICON_COLOR,
      backgroundColor: {
        image: ALARM_SNOOZED_ICON,
      },
    },
    Snoozed_text: {
      color: ALARM_SNOOZED_ICON_COLOR,
    },
    SnoozeDisabled: {
      height: 20,
      width: 20,
      color: ALARM_SNOOZED_ICON_COLOR,
      backgroundColor: {
        image: ALARM_SNOOZED_ICON,
      },
    },
    SnoozeDisabled_text: {
      color: ALARM_SNOOZED_ICON_COLOR,
    },
  },
});

/**
 * Echarts tooltip has z-index of 9999999.
 * Must set context menu above this so its always displayed on top.
 */
export const CONTEXT_MENU_Z_INDEX = 10000000;

// Zoom constants

export const ECHARTS_ZOOM_DEBOUNCE_MS = 300;

// viewport timestamp constants
export const TIMESTAMP_WIDTH_FACTOR = 44;
export const TIMESTAMP_WIDTH_FACTOR_BOTTOM = 24;
export const TIMESTAMP_HEIGHT_FACTOR_BOTTOM = 24;

// loading indicator
export const REFRESHING_DELAY_MS = 3000;

// legend constants
export const LEGEND_NAME_MIN_WIDTH_FACTOR = 3.5;
export const LEGEND_ASSET_NAME_COL_MIN_WIDTH = 100;
export const LEGEND_ASSET_NAME_COL_MAX_WIDTH = 200;

export const PERFORMANCE_MODE_THRESHOLD = 4000;

const DEFAULT_CHART_OPTION: EChartsOption = {
  aria: {
    enabled: true,
  },
  title: {
    top: 10,
  },
  animation: false,
  toolbox: DEFAULT_TOOLBOX_CONFIG,
  xAxis: DEFAULT_X_AXIS,
  yAxis: [DEFAULT_Y_AXIS],
  grid: DEFAULT_GRID,
  tooltip: DEFAULT_TOOLTIP,
};

export const getDefaultChartOption = (timeZone?: string): EChartsOption => {
  return {
    ...DEFAULT_CHART_OPTION,
    xAxis: getDefaultXAxis(timeZone),
  };
};

export const DEFAULT_CHART_SETTINGS = {
  line: {
    connectionStyle: 'linear',
    style: 'solid',
  },
  symbol: {
    style: 'filled-circle',
  },
  axis: {
    yVisible: true,
    xVisible: true,
  } as ChartAxisOptions,
  legend: {
    visible: true,
    position: 'right',
    width: '30%',
    height: '30%',
    visibleContent: {
      unit: true,
      asset: true,
      latestValue: true,
      maxValue: false,
      minValue: false,
    },
  } as ChartLegend,
};
