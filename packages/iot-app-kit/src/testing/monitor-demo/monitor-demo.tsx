/* eslint-disable max-len */
import { Component, h, Listen, Prop, State } from '@stencil/core';

import {
  Axis,
  DataStreamInfo,
  DataType,
  LEGEND_POSITION,
  TableColumn,
  Trend,
  TREND_TYPE,
  Annotations,
  ChartConfig,
  COMPARISON_OPERATOR,
  Threshold,
  YAnnotation,
} from '@synchro-charts/core';
import { TESTING_GROUND_CHART_CONFIG } from './testConfigs';
import { DAY_IN_MS, MINUTE_IN_MS, MONTH_IN_MS } from '../../utils/time';
import { ThresholdListItem } from './threshold-list';
import { TrendLineListItem } from './trend-line-list';
import { DurationOptions } from './DurationOptions';
import { isNumeric } from '../../utils/number';
import { isMinimalStaticViewport, isValid } from '../../utils/predicates';

type WidgetUpdatedEvent = CustomEvent<Partial<ChartConfig>>;

const DISABLE_DURATION = -1;
const WEEK = DAY_IN_MS * 7;

const pallet = ['#0073bb', '#dd6b10', '#1d8102', '#8b3333'];

// To test against your own map. Replace the below with your map configuration.
const mapName = 'TestMap';
const region = 'us-east-1';

// Insert credentials from aws-iot-black-pearl+dev@amazon.com account
const credentials = {
  accessKeyId: '',
  secretAccessKey: '',
  sessionToken: '',
};

// alter this to change the number of widgets to display. useful for performance testing.
const NUM_WIDGETS = 1;

const MIN_HEIGHT = 380;
const VIEWPORT_DURATION = 30 * MINUTE_IN_MS;

const DEFAULT_TAG = 'sc-line-chart';

const COLUMNS: TableColumn[] = [
  {
    header: 'Property',
    rows: [],
  },
  {
    header: 'Property 2',
    rows: [],
  },
  {
    header: 'Property 3',
    rows: [],
  },
];

@Component({
  tag: 'monitor-demo',
  styleUrl: 'monitor-demo.css',
})
export class MonitorDemo {
  @Prop() showAllControls: boolean;

  @State() isEditing: boolean = false;
  @State() config: ChartConfig & { dataStreamInfo: DataStreamInfo[] } = {
    ...TESTING_GROUND_CHART_CONFIG,
    viewport: {
      ...TESTING_GROUND_CHART_CONFIG.viewport,
      start: new Date(1998, 0, 0),
      end: new Date(1998, 1, 0),
    },
  };
  @State() height: number = MIN_HEIGHT;
  @State() viewPortDuration: number = VIEWPORT_DURATION;
  @State() isBottomLegend: boolean = true;
  @State() numCharts: number = NUM_WIDGETS;
  @State() componentTag: string = DEFAULT_TAG;
  @State() annotationColor: string = '#d13212';
  @State() annotationValue: string | number = 0;
  @State() annotationName: string | undefined;
  @State() annotationComp: COMPARISON_OPERATOR = COMPARISON_OPERATOR.LESS_THAN;
  @State() annotations: Annotations = {
    x: [],
    y: [],
    thresholdOptions: {
      showColor: true,
    },
  };
  @State() trendDataId: string = '';
  @State() trendType: string = 'linear-regression';
  @State() trendColor: string = 'black';
  @State() trends: Trend[] = [];
  @State() axis: Axis.Options = {};
  @State() isDurationMode: boolean = false;
  @State() duration: number;

  updateViewPortToNow = () => {
    this.config = {
      ...this.config,
      viewport: {
        ...this.config.viewport,
        lastUpdatedBy: undefined,
        end: new Date(),
        start: new Date(new Date().getTime() - this.viewPortDuration),
      },
    };
  };

  tableColumns = (): TableColumn[] => {
    return COLUMNS.map(c => ({
      ...c,
      rows: this.config.dataStreamInfo.map(({ id }) => id),
    }));
  };

  /**
   *
   * Event Listeners
   *
   */

  /**
   * Applies update to the widgets config
   */
  @Listen('widgetUpdated')
  onWidgetUpdated({ detail: configUpdate }: WidgetUpdatedEvent) {
    this.config = {
      ...this.config,
      ...configUpdate,
    };
  }

  /**
   *
   * State Updaters
   *
   */

  toggleIsEditing = () => {
    this.isEditing = !this.isEditing;
  };

  increaseYMax = () => {
    this.config = {
      ...this.config,
      viewport: {
        ...this.config.viewport,
        yMax: this.config.viewport.yMax || 50,
      },
    };
  };

  addStream = () => {
    const index = this.config.dataStreamInfo.length;
    const color = pallet[index % pallet.length];
    const id = (index + 1).toString();
    if (id != null) {
      this.config = {
        ...this.config,
        dataStreamInfo: [
          ...this.config.dataStreamInfo,
          {
            id,
            color,
            resolution: MONTH_IN_MS,
            name: `Asset ${id}`,
            detailedName: `Asset ${id} - Factor ${id}`,
            unit: 'm/s',
            dataType: DataType.NUMBER,
          },
        ],
      };
    } else {
      this.config = {
        ...this.config,
        dataStreamInfo: [
          ...this.config.dataStreamInfo,
          {
            id: `non-existent-stream-${index + 1}`,
            resolution: MINUTE_IN_MS,
            color: 'black',
            name: `a pretty cool stream ${index}`,
            unit: 'M',
            dataType: DataType.NUMBER,
          },
        ],
      };
    }
  };

  // Remove last added stream
  removeStream = () => {
    this.config = {
      ...this.config,
      dataStreamInfo: this.config.dataStreamInfo.slice(0, -1),
    };
  };

  toggleLegendPosition = () => {
    this.isBottomLegend = !this.isBottomLegend;
    this.config = {
      ...this.config,
      legend: {
        width: 200,
        ...this.config.legend,
        position: this.isBottomLegend ? LEGEND_POSITION.BOTTOM : LEGEND_POSITION.RIGHT,
      },
    };
  };

  increaseEndDate = () => {
    if (isMinimalStaticViewport(this.config.viewport)) {
      this.config = {
        ...this.config,
        viewport: {
          ...this.config.viewport,
          start: new Date(this.config.viewport.start),
          end: new Date(new Date(this.config.viewport.end).getTime() + WEEK * 6),
          lastUpdatedBy: undefined,
        },
      };
    }
  };

  increaseStartDate = () => {
    if (isMinimalStaticViewport(this.config.viewport)) {
      const { start } = this.config.viewport;
      const newStart = new Date(new Date(this.config.viewport.start).getTime() + WEEK * 6);

      // Prevent the start from going pass the end date!
      if (newStart < start) {
        this.config = {
          ...this.config,
          viewport: {
            ...this.config.viewport,
            end: this.config.viewport.end,
            start: newStart,
            lastUpdatedBy: undefined,
          },
        };
      }
    }
  };

  addChart = () => {
    this.numCharts += 1;
  };

  removeChart = () => {
    this.numCharts -= 1;
  };

  changeComponent = (event: Event) => {
    // @ts-ignore
    this.componentTag = event.target.value;
  };

  changeAnnotationColor = (event: Event) => {
    if (event != null && event.target != null) {
      this.annotationColor = (event.target as HTMLInputElement).value;
    }
  };

  changeAnnotationValue = (event: Event) => {
    if (event != null && event.target != null) {
      const targetValue = (event.target as HTMLInputElement).value;
      if (!isNumeric(targetValue)) {
        this.annotationValue = targetValue;
      }
      if (isNumeric(targetValue)) {
        this.annotationValue = Number(targetValue);
      }
    }
  };

  changeAnnotationComparator = (event: Event) => {
    if (event != null && event.target != null) {
      this.annotationComp = (event.target as HTMLInputElement).value as COMPARISON_OPERATOR;
    }
  };

  saveThreshold = () => {
    const threshold: Threshold = {
      color: this.annotationColor,
      value: this.annotationValue,
      showValue: true,
      comparisonOperator: this.annotationComp,
      isEditable: true,
    };

    if (this.annotationName != null) {
      threshold.label = {
        text: this.annotationName,
        show: true,
      };
    }
    this.annotations = {
      ...this.annotations,
      y: [...(this.annotations.y || []), threshold],
    };
    this.annotationValue = 0;
    this.annotationName = undefined;
  };

  removeThreshold = (index: number) => {
    if (this.annotations == null || this.annotations.y == null || this.annotations.y.length === 0) {
      return;
    }
    // This assume that all Y in annotations are thresholds
    const { y } = this.annotations;

    this.annotations = {
      ...this.annotations,
      y: (y as YAnnotation[]).filter((_, i) => i !== index),
    };
  };

  getThresholds = (): Threshold[] =>
    this.annotations && this.annotations.y ? this.annotations.y.filter(isValid(t => t.comparisonOperator != null)) : [];

  // checks if threshold exists with the selected value and comparison operator
  doesThresholdExist = () => {
    return this.getThresholds().some(
      threshold => threshold.value === this.annotationValue && threshold.comparisonOperator === this.annotationComp
    );
  };

  changeDuration = (duration: number) => {
    this.duration = duration;
    this.config = {
      ...this.config,
      viewport: {
        ...this.config.viewport,
        lastUpdatedBy: undefined,
        start: new Date(Date.now() - duration),
        end: new Date(),
        duration,
      },
    };
  };

  changeTrendDataId = (event: Event) => {
    if (event != null && event.target != null) {
      this.trendDataId = (event.target as HTMLInputElement).value;
      const streamInfo = this.config.dataStreamInfo.find(info => info.id === this.trendDataId);
      if (streamInfo) {
        this.trendColor = streamInfo.color || 'black';
      }
    }
  };

  changeTrendType = (event: Event) => {
    if (event != null && event.target != null) {
      this.trendType = (event.target as HTMLInputElement).value as TREND_TYPE;
    }
  };

  changeTrendColor = (event: Event) => {
    if (event != null && event.target != null) {
      this.trendColor = (event.target as HTMLInputElement).value;
    }
  };

  // checks if the selected trend type exists on the selected metric
  doesTrendExist = () => {
    return (
      this.trendDataId === '' ||
      this.trends.some(trend => trend.dataStreamId === this.trendDataId && trend.type === this.trendType)
    );
  };

  addTrend = () => {
    if (!this.doesTrendExist()) {
      this.trends = [
        ...this.trends,
        {
          type: this.trendType,
          dataStreamId: this.trendDataId,
          color: this.trendColor,
        } as Trend,
      ];
    }
  };

  removeTrend = (dataStreamId: string, trendType: TREND_TYPE) => {
    this.trends = this.trends.filter(trend => trend.dataStreamId !== dataStreamId || trend.type !== trendType);
  };

  toggleThresholdColoration = () => {
    const { thresholdOptions } = this.annotations;
    if (thresholdOptions == null) {
      this.annotations = {
        ...this.annotations,
        thresholdOptions: {
          showColor: true,
        },
      };
      return;
    }
    if (typeof thresholdOptions === 'boolean') {
      throw new Error('for demo we do not use boolean');
    }
    this.annotations = {
      ...this.annotations,
      thresholdOptions: {
        ...thresholdOptions,
        showColor: !thresholdOptions.showColor,
      },
    };
  };

  isColorationEnabled = (): boolean => {
    if (this.annotations == null || this.annotations.thresholdOptions == null) {
      return true;
    }

    const { thresholdOptions } = this.annotations;

    if (typeof thresholdOptions === 'boolean') {
      return thresholdOptions;
    }

    return thresholdOptions.showColor == null ? true : thresholdOptions.showColor;
  };

  changeAxis = (event: Event) => {
    if (event != null && event.target != null) {
      const { name } = event.target as HTMLInputElement;

      this.axis = {
        ...this.axis,
        [name]: (event.target as HTMLInputElement).checked,
      };
    }
  };

  showAnnotations = (event: Event) => {
    if (event != null && event.target != null) {
      this.annotations = {
        ...this.annotations,
        show: (event.target as HTMLInputElement).checked,
      };
    }
  };

  changeLabel = (event: Event) => {
    if (event != null && event.target != null) {
      this.axis = {
        ...this.axis,
        labels: {
          yAxis: {
            content: (event.target as HTMLInputElement).value,
          },
        },
      };
    } else {
      // remove the label
      this.axis.labels = undefined;
    }
  };

  render() {
    return (
      <bp-data-store>
        <div>
          <div style={{ display: 'flex' }}>
            <label htmlFor="display">
              <strong>Display: </strong>
              <select id="display" onChange={this.changeComponent}>
                <option value="sc-line-chart">Line Chart</option>
                <option value="sc-scatter-chart">Scatter Chart</option>
                <option value="sc-bar-chart">Bar Chart</option>
                <option value="bp-map">Map View</option>
                {this.showAllControls && <option value="sc-status-timeline">Status Timeline</option>}
                {this.showAllControls && <option value="sc-status-grid">Status Grid</option>}
                {this.showAllControls && <option value="sc-table">Table</option>}
                {this.showAllControls && <option value="sc-kpi">KPI</option>}
                {this.showAllControls && <option value="monitor-latest-value">Latest Value</option>}
              </select>
            </label>
            {this.showAllControls && (
              <DurationOptions
                duration={this.isDurationMode ? this.duration : DISABLE_DURATION}
                changeDuration={this.changeDuration}
              />
            )}
            <div style={{ flexGrow: '1' }} />
            <div>
              <button onClick={this.addChart}>
                <strong>+</strong> Chart
              </button>{' '}
              <button onClick={this.removeChart} disabled={this.numCharts <= 1}>
                <strong>-</strong> Chart
              </button>{' '}
              |{' '}
              <button onClick={this.addStream}>
                <strong>+</strong> Data
              </button>{' '}
              <button disabled={this.numCharts === 0} onClick={this.removeStream}>
                <strong>-</strong> Data
              </button>{' '}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {new Array(this.numCharts).fill(0).map(i => (
              <div
                class="chart-container"
                style={{
                  height: `${this.height}px`,
                  width: '100%',
                }}
              >
                <bp-mocked-source-widget
                  tableColumns={this.tableColumns()}
                  componentTag={this.componentTag}
                  widgetId={this.config.widgetId + i.toString()}
                  isEditing={this.isEditing}
                  viewport={{ ...this.config.viewport, duration: this.duration, group: 'DEMO_GROUP' }}
                  legend={this.config.legend}
                  dataStreamInfo={this.config.dataStreamInfo}
                  annotations={this.annotations}
                  trends={this.trends}
                  axis={this.axis}
                  mapName={mapName}
                  region={region}
                  credentials={credentials}
                />
              </div>
            ))}
          </div>
          {this.showAllControls && (
            <span>
              <button onClick={this.toggleLegendPosition}>
                Show legend on <strong>{this.isBottomLegend ? 'right' : 'bottom'}</strong>
              </button>{' '}
              | <button onClick={this.toggleIsEditing}>{this.isEditing ? 'Disable' : 'Enable'} editing</button>
              <button onClick={this.increaseEndDate}>Increase end date</button>{' '}
              <button
                onClick={() => {
                  this.height += 15;
                }}
              >
                Increase height
              </button>{' '}
              <button
                onClick={() => {
                  this.height -= 15;
                }}
              >
                Decrease height
              </button>{' '}
              <button onClick={this.increaseStartDate}>Increase start date</button> |{' '}
              <button onClick={this.toggleThresholdColoration}>
                {this.isColorationEnabled() ? 'Disable' : 'Enable'} threshold coloration
              </button>
            </span>
          )}
          <div class="configurations">
            <div>
              <h2>Thresholds</h2>
              <table class="configuration-table">
                <tr>
                  <th>Color</th>
                  <th>Value</th>
                  <th>Comparator</th>
                </tr>
                <tr>
                  <td>
                    <input
                      style={{ height: '18px' }}
                      type="color"
                      value={this.annotationColor}
                      onChange={this.changeAnnotationColor}
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: '60px' }}
                      {...(this.annotationComp !== COMPARISON_OPERATOR.EQUAL && { type: 'number' })}
                      onChange={this.changeAnnotationValue}
                      placeholder="value"
                      value={this.annotationValue}
                    />
                  </td>
                  <td>
                    <select onChange={this.changeAnnotationComparator}>
                      <option value={COMPARISON_OPERATOR.LESS_THAN}>Less than {"'<'"}</option>
                      <option value={COMPARISON_OPERATOR.LESS_THAN_EQUAL}>Less than or equal {"'<='"}</option>
                      <option value={COMPARISON_OPERATOR.GREATER_THAN}>Greater than {"'>'"} </option>
                      <option value={COMPARISON_OPERATOR.GREATER_THAN_EQUAL}>Greater than or equal {"'>='"} </option>
                      <option value={COMPARISON_OPERATOR.EQUAL}>Equal &#39;=&#39; </option>
                    </select>
                  </td>
                  <td>
                    <button onClick={this.saveThreshold} disabled={this.doesThresholdExist()}>
                      Add Threshold
                    </button>
                  </td>
                </tr>
                {this.getThresholds().map((threshold, i) => {
                  return (
                    <ThresholdListItem threshold={threshold} thresholdId={i} removeThreshold={this.removeThreshold} />
                  );
                })}
              </table>
            </div>
            <div>
              <h2>Trends</h2>
              <table class="configuration-table">
                <tr>
                  <th>Color</th>
                  <th>Data Set</th>
                </tr>
                <tr>
                  <td>
                    <input
                      style={{ height: '18px' }}
                      type="color"
                      value={this.trendColor}
                      onChange={this.changeTrendColor}
                    />
                  </td>
                  <td>
                    <select onChange={this.changeTrendDataId}>
                      <option value="">Select a data set</option>
                      {this.config.dataStreamInfo.map(({ id, name }) => {
                        return <option value={id}>{name}</option>;
                      })}
                    </select>
                  </td>
                  <td>
                    <button onClick={this.addTrend} disabled={this.doesTrendExist()}>
                      Add Trend
                    </button>
                  </td>
                </tr>
                {this.trends.map(trend => {
                  const stream = this.config.dataStreamInfo.find(elt => elt.id === trend.dataStreamId);
                  if (stream) {
                    return (
                      <TrendLineListItem
                        dataStreamName={stream.name}
                        trend={trend}
                        removeTrendLine={this.removeTrend}
                      />
                    );
                  }
                  return null;
                })}
              </table>
            </div>
            {this.showAllControls && (
              <div>
                <h2>Options</h2>
                <div class="options">
                  <div class="option">
                    <input type="checkbox" checked onChange={this.changeAxis} name="showX" />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="showX">Show X axis</label>
                  </div>
                  <div class="option">
                    <input type="checkbox" checked onChange={this.changeAxis} name="showY" />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="showY">Show Y axis</label>
                  </div>
                  <div class="option">
                    <input type="checkbox" checked onChange={this.showAnnotations} name="showAnnotations" />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="showAnnotations">Show annotation lines and values</label>
                  </div>
                  <div class="option">
                    <input type="text" name="Y-axis label" onChange={this.changeLabel} />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="Y-axis label">Show label for Y-axis</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </bp-data-store>
    );
  }
}
