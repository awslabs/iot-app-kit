import { Component, State, h } from '@stencil/core';
import { DashboardConfiguration } from '../../types';
import { dashboardConfig } from '../mocks';

import { XAnnotation, DataStream as SynchroChartsDataStream, DataType } from '@synchro-charts/core';

import { addXAnnotation, deleteXAnnotation, editXAnnotation } from '../../dashboard-actions/annotations';

const DAY_RESOLUTION = 1000 * 60 * 60 * 24; // one day
const style = { width: '100%' };

const widgetId = 'some-id';

const XANNOTATION_1: XAnnotation = {
  color: 'red',
  value: new Date(2000, 1, 0),
};

const standardAnnotation = {
  color: 'red',
  value: 40,
  showValue: true,
};

const sampleAnnotations = {
  y: [standardAnnotation],
};
const sampleViewport = {
  start: new Date(2000, 0, 0),
  end: new Date(2001, 0, 0),
  group: 'viewport-group',
};
const sampleLegend = {
  width: 100,
  position: 'BOTTOM',
};
const sampleDataStreams = [
  {
    id: 'car-count',
    dataType: DataType.STRING,
    color: '#1d8102',
    name: 'Car Count',
    resolution: DAY_RESOLUTION, // one day
    data: [
      {
        x: new Date(2000, 1, 0).getTime(),
        y: 7,
      },
      {
        x: new Date(2000, 3, 0).getTime(),
        y: 18,
      },
      {
        x: new Date(2000, 4, 0).getTime(),
        y: 11,
      },
      {
        x: new Date(2000, 5, 0).getTime(),
        y: 30,
      },
      {
        x: new Date(2000, 7, 0).getTime(),
        y: 16,
      },
      {
        x: new Date(2000, 8, 0).getTime(),
        y: 26,
      },
      {
        x: new Date(2000, 10, 0).getTime(),
        y: 46,
      },
      {
        x: new Date(2000, 11, 0).getTime(),
        y: 100,
      },
    ],
    aggregates: {
      [DAY_RESOLUTION]: [
        {
          x: new Date(2000, 1, 0).getTime(),
          y: 7,
        },
        {
          x: new Date(2000, 3, 0).getTime(),
          y: 18,
        },
        {
          x: new Date(2000, 4, 0).getTime(),
          y: 11,
        },
        {
          x: new Date(2000, 5, 0).getTime(),
          y: 30,
        },
        {
          x: new Date(2000, 7, 0).getTime(),
          y: 16,
        },
        {
          x: new Date(2000, 8, 0).getTime(),
          y: 26,
        },
        {
          x: new Date(2000, 10, 0).getTime(),
          y: 46,
        },
        {
          x: new Date(2000, 11, 0).getTime(),
          y: 100,
        },
      ],
    },
  },
];

const sampleTimeSeriesData = {
  datastreams: sampleDataStreams,
  viewport: sampleViewport,
};

const DEFAULT_CELL_SIZE = 30;
const DEFAULT_WIDTH = 1000;
const DEFAULT_STRETCH_TO_FIT = true;

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  @State() dashboardConfiguration: DashboardConfiguration = dashboardConfig;
  @State() cellSize = DEFAULT_CELL_SIZE;
  @State() stretchToFit = DEFAULT_STRETCH_TO_FIT;
  @State() width = DEFAULT_WIDTH;

  addWidget = () => {
    this.dashboardConfiguration = [
      ...this.dashboardConfiguration,
      {
        x: 1,
        y: 1,
        z: 1,
        width: 4,
        height: 4,
        widget: 'line-chart',
        id: Math.random().toString() + new Date().toISOString(),
      },
    ];
  };

  onCellSizeInput = (e: Event) => {
    this.cellSize = Math.max((e as any).target.value, 0);
  };

  onWidthInput = (e: Event) => {
    this.width = Math.max((e as any).target.value, 1);
  };

  onStretchToFit = (e: Event) => {
    this.stretchToFit = (e as any).target.checked;
  };

  addAnnotation = (e: Event) => {
    e.preventDefault();
    const original = this.dashboardConfiguration;
    const XANNOTATION: XAnnotation = {
      color: 'red',
      value: (e as any).target.value,
      id: Date.now().toString(),
    };
    console.log('Annotation for ', XANNOTATION.value, ' added!');
    this.dashboardConfiguration = addXAnnotation({
      dashboardConfiguration: original,
      widgetId: widgetId,
      annotation: XANNOTATION,
    });
  };

  deleteAnnotation = (e: Event) => {
    e.preventDefault();
    const original = this.dashboardConfiguration;
    const stringInput = (e as any).target[0].value;
    console.log('Annotation ', stringInput, ' deleted!');
    this.dashboardConfiguration = deleteXAnnotation({
      dashboardConfiguration: original,
      widgetId: widgetId,
      annotationIdToDelete: stringInput,
    });
  };

  editAnnotation = (e: Event) => {
    e.preventDefault();
    const original = this.dashboardConfiguration;
    const dateInput = (e as any).target[1].value;
    const stringInput = (e as any).target[0].value;
    console.log('Annotation ', stringInput, ' edited!');
    const XANNOTATION: XAnnotation = {
      color: 'red',
      value: dateInput,
      id: Date.now().toString(),
    };
    this.dashboardConfiguration = editXAnnotation({
      dashboardConfiguration: original,
      widgetId: widgetId,
      oldAnnotationId: stringInput,
      newAnnotation: XANNOTATION,
    });
  };

  listWidgets = (e: Event) => {
    console.log('List of widgets:', JSON.stringify(this.dashboardConfiguration));
  };

  render() {
    return (
      <div>
        <button onClick={this.addWidget}>Add widget</button>
        <br />
        <br />
        <div>
          <label>Cell size pixels</label>
          <input type="number" value={this.cellSize} onChange={this.onCellSizeInput} />
        </div>
        <br />
        <div>
          <label>Width pixels</label>
          <input type="number" value={this.width} onChange={this.onWidthInput} />
        </div>
        <br />
        <div>
          <label>Stretch to fit</label>
          <input type="checkbox" checked={this.stretchToFit} onChange={this.onStretchToFit} />
        </div>
        <iot-dashboard
          width={this.width}
          cellSize={this.cellSize}
          stretchToFit={this.stretchToFit}
          dashboardConfiguration={this.dashboardConfiguration}
          onDashboardConfigurationChange={(newConfig) => {
            this.dashboardConfiguration = newConfig;
          }}
        />
      </div>
    );
  }
}
