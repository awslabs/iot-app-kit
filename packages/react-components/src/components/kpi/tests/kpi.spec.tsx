import { render, screen } from '@testing-library/react';
import { KPI } from '../kpi';
import {
  COMPARISON_OPERATOR,
  type Viewport,
  formatDate,
} from '@iot-app-kit/core';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';

export const VIEWPORT = { duration: '5m' };
export const PREVIOUS_VALUE = 123.21239;
export const LATEST_VALUE = 20.21239;
export const DATA_STREAM = {
  id: 'abc-1',
  data: [
    { x: new Date(2000, 0, 0).getTime(), y: PREVIOUS_VALUE },
    { x: new Date(2005, 0, 0).getTime(), y: LATEST_VALUE },
  ],
  resolution: 0,
  name: 'some name',
  unit: 'mph',
};
export const LOADING_DATA_STREAM = {
  id: 'abc-1',
  data: [],
  isLoading: true,
  resolution: 0,
  name: 'some name',
  unit: 'mph',
};
export const ERROR_DATA_STREAM = {
  id: 'abc-1',
  data: [],
  error: {
    msg: 'Error: Failed to load data',
  },
  resolution: 0,
  name: 'some name',
  unit: 'mph',
};

export const THRESHOLD = {
  comparisonOperator: COMPARISON_OPERATOR.GT,
  value: 10,
  visible: true,
  color: '#ff0000', // red threshold
};

export const FILLED_THRESHOLD = {
  comparisonOperator: COMPARISON_OPERATOR.GT,
  value: 10,
  visible: true,
  fill: '#ff0000',
  color: '#ff0000', // red threshold
};

export const SUCCESS_QUERY = mockTimeSeriesDataQuery([
  {
    dataStreams: [DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);

export const ERROR_QUERY = mockTimeSeriesDataQuery([
  {
    dataStreams: [ERROR_DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);

export const LOADING_QUERY = mockTimeSeriesDataQuery([
  {
    dataStreams: [LOADING_DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);

const mockUserViewport: {
  viewport?: Viewport;
  setViewport: (viewport: Viewport) => void;
  group: string;
} = { viewport: undefined, setViewport: vi.fn(), group: 'group' };

vi.mock('@iot-app-kit/component-core', async () => {
  const actual = await vi.importActual('@iot-app-kit/component-core');
  return {
    ...actual,
    useViewport: vi.fn(() => mockUserViewport),
  };
});

// a default KPI widget has all values, text, dates, etc. set to be visible
describe('default kpi widget', () => {
  it('renders default widget', () => {
    const DECIMAL_PLACES = 4;
    render(<KPI query={SUCCESS_QUERY} />);

    expect(screen.getByText(`${DATA_STREAM.name}`)).toBeVisible();
    expect(screen.getByText(`(${DATA_STREAM.unit})`)).toBeVisible();
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
    expect(
      screen.getByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).toBeVisible();
  });

  it('renders default widget in error state', () => {
    render(<KPI query={ERROR_QUERY} />);
    expect(screen.getByText(ERROR_DATA_STREAM.error.msg)).toBeVisible();
  });

  it('renders default widget in loading state', () => {
    render(<KPI query={LOADING_QUERY} />);

    expect(screen.getByTestId('kpi-loading-spinner')).toBeVisible();
  });
});

describe('default kpi with thresholds', () => {
  // test is similar to above except the threshold color is found in the kpi-side-threshold
  it('renders a kpi with a side threhsold', () => {
    const COLOR_RED = '#ff0000';
    const DECIMAL_PLACES = 4;
    render(<KPI query={SUCCESS_QUERY} thresholds={[THRESHOLD]} />);

    expect(screen.getByText(`${DATA_STREAM.name}`)).toBeVisible();
    expect(screen.getByText(`(${DATA_STREAM.unit})`)).toBeVisible();
    expect(
      screen.getByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).toBeVisible();
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
    expect(screen.getByTestId('kpi-side-threshold')).toHaveStyle(
      `background-color: ${COLOR_RED}`
    );
  });

  // test is similar to above except the threshold color is found in the kpi-base-component
  it('renders a kpi with a filled threhsold', () => {
    const COLOR_RED = '#ff0000';
    const DECIMAL_PLACES = 4;
    render(<KPI query={SUCCESS_QUERY} thresholds={[FILLED_THRESHOLD]} />);
    expect(screen.getByText(`${DATA_STREAM.name}`)).toBeVisible();
    expect(screen.getByText(`(${DATA_STREAM.unit})`)).toBeVisible();
    expect(
      screen.getByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).toBeVisible();
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
    expect(screen.getByTestId('kpi-base-component')).toHaveStyle(
      `background-color: ${COLOR_RED}`
    );
  });

  it('does not render the kpi + side threshold in a loading state', () => {
    render(<KPI query={LOADING_QUERY} thresholds={[THRESHOLD]} />);
    expect(screen.queryByTestId('kpi-side-threshold')).not.toBeInTheDocument();
  });

  it('does not render the kpi + side threshold in an error state', () => {
    render(
      <KPI query={ERROR_QUERY} viewport={VIEWPORT} thresholds={[THRESHOLD]} />
    );
    expect(screen.queryByTestId('kpi-side-threshold')).not.toBeInTheDocument();
  });
});

describe('kpi with custom settings', () => {
  it('renders a kpi widget with only the value set to visible', () => {
    const DECIMAL_PLACES = 4;
    const AGGREGATION_STRING = 'raw data';

    render(
      <KPI
        query={SUCCESS_QUERY}
        settings={{
          showAggregationAndResolution: false,
          showDataQuality: false,
          showName: false,
          showTimestamp: false,
          showUnit: false,
        }}
      />
    );

    // settings are set to hide all text except for KPI value
    expect(screen.queryByText(DATA_STREAM.name)).not.toBeInTheDocument();
    expect(screen.queryByText(`(${DATA_STREAM.unit})`)).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText(AGGREGATION_STRING)).not.toBeInTheDocument();

    // KPI value should be visible
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
  });

  it('renders a kpi widget with only the value and aggregation set to visible', () => {
    const DECIMAL_PLACES = 4;
    const AGGREGATION_STRING = 'raw data';

    render(
      <KPI
        query={SUCCESS_QUERY}
        settings={{
          showDataQuality: false,
          showName: false,
          showTimestamp: false,
          showUnit: false,
        }}
      />
    );

    // settings are set to hide all text except for KPI value
    expect(screen.queryByText(DATA_STREAM.name)).not.toBeInTheDocument();
    expect(screen.queryByText(`(${DATA_STREAM.unit})`)).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).not.toBeInTheDocument();

    // KPI value and aggregation should be visible
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
    expect(screen.getByText(AGGREGATION_STRING)).toBeVisible();
  });

  it('renders a kpi widget with only the value and name set to visible', () => {
    const DECIMAL_PLACES = 4;
    const AGGREGATION_STRING = 'raw data';

    render(
      <KPI
        query={SUCCESS_QUERY}
        settings={{
          showAggregationAndResolution: false,
          showDataQuality: false,
          showTimestamp: false,
          showUnit: false,
        }}
      />
    );

    // settings are set to hide all text except for KPI value
    expect(screen.queryByText(`(${DATA_STREAM.unit})`)).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText(AGGREGATION_STRING)).not.toBeInTheDocument();

    // KPI value and name should be visible
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
    expect(screen.getByText(DATA_STREAM.name)).toBeVisible();
  });

  it('renders a kpi widget with only the value and timestamp set to visible', () => {
    const DECIMAL_PLACES = 4;
    const AGGREGATION_STRING = 'raw data';

    render(
      <KPI
        query={SUCCESS_QUERY}
        settings={{
          showAggregationAndResolution: false,
          showDataQuality: false,
          showName: false,
          showUnit: false,
        }}
      />
    );

    // settings are set to hide all text except for KPI value
    expect(screen.queryByText(DATA_STREAM.name)).not.toBeInTheDocument();
    expect(screen.queryByText(`(${DATA_STREAM.unit})`)).not.toBeInTheDocument();
    expect(screen.queryByText(AGGREGATION_STRING)).not.toBeInTheDocument();

    // KPI value should be visible
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
    expect(
      screen.getByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).toBeVisible();
  });

  it('renders a kpi widget with only the value and unit set to visible', () => {
    const DECIMAL_PLACES = 4;
    const AGGREGATION_STRING = 'raw data';

    render(
      <KPI
        query={SUCCESS_QUERY}
        settings={{
          showAggregationAndResolution: false,
          showDataQuality: false,
          showName: false,
          showTimestamp: false,
        }}
      />
    );

    // settings are set to hide all text except for KPI value
    expect(screen.queryByText(DATA_STREAM.name)).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText(AGGREGATION_STRING)).not.toBeInTheDocument();

    // KPI value should be visible
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
    expect(screen.getByText(`(${DATA_STREAM.unit})`)).toBeVisible();
  });

  it('kpi widget default decimal places', () => {
    const DECIMAL_PLACES = 4;
    render(<KPI query={SUCCESS_QUERY} />);
    // KPI value should be visible with the defaut 4 decimal places
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
  });

  it('kpi widget custom decimal places', () => {
    const DECIMAL_PLACES = 5;
    render(<KPI query={SUCCESS_QUERY} decimalPlaces={DECIMAL_PLACES} />);

    // KPI value should be visible with 5 decimal places
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
  });

  it('kpi widget no decimal places', () => {
    const DECIMAL_PLACES = 0;
    render(<KPI query={SUCCESS_QUERY} decimalPlaces={DECIMAL_PLACES} />);

    // KPI value should be visible with no decimal places
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toBeVisible();
  });

  it('kpi widget with custom green background color', () => {
    const COLOR_GREEN = '#00ff00';
    const DECIMAL_PLACES = 4;
    render(
      <KPI query={SUCCESS_QUERY} settings={{ backgroundColor: COLOR_GREEN }} />
    );

    // background color is set
    expect(screen.getByTestId('kpi-base-component')).toHaveStyle(
      `background-color: ${COLOR_GREEN}`
    );

    // font color is calculated to use the highest contrast color (in this case it is black)
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DECIMAL_PLACES))
    ).toHaveStyle('color: black');
  });

  it('kpi widget with custom green background color and filled threshold', () => {
    const COLOR_RED = '#ff0000';
    const COLOR_GREEN = '#00ff00';
    render(
      <KPI
        query={SUCCESS_QUERY}
        settings={{ backgroundColor: COLOR_GREEN }}
        thresholds={[FILLED_THRESHOLD]}
      />
    );

    // background color is set to the threshold color and NOT the custom background color
    expect(screen.getByTestId('kpi-base-component')).toHaveStyle(
      `background-color: ${COLOR_RED}`
    );
  });

  it('kpi widget in error state with custom green background color', () => {
    const COLOR_GREEN = '#00ff00';
    render(
      <KPI query={ERROR_QUERY} settings={{ backgroundColor: COLOR_GREEN }} />
    );

    // background color is set to the custom background color
    expect(screen.getByTestId('kpi-error-component')).toHaveStyle(
      `background-color: ${COLOR_GREEN}`
    );
  });
});

describe('kpi widget with custom viewports', () => {
  const DEFAULT_DECIMAL_PLACES = 4;
  // the mock query has two data points -
  // data point 1 is on new Date(2000, 0, 0)
  // data point 2 is on new Date(2005, 0, 0)
  it('useViewport with a value of 1999-2001 should show the first data point', () => {
    mockUserViewport.viewport = {
      start: new Date(1999, 0, 0),
      end: new Date(2001, 0, 0),
    };

    render(<KPI query={SUCCESS_QUERY} />);
    expect(
      screen.getByText(
        formatDate(DATA_STREAM.data[0].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).toBeVisible();
    expect(
      screen.getByText(DATA_STREAM.data[0].y.toFixed(DEFAULT_DECIMAL_PLACES))
    ).toBeVisible();
  });

  it('useViewport with a value of last 30 minutes should show the second data point', () => {
    mockUserViewport.viewport = { duration: '30m' };

    render(<KPI query={SUCCESS_QUERY} />);
    expect(
      screen.getByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).toBeVisible();
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DEFAULT_DECIMAL_PLACES))
    ).toBeVisible();
  });

  it('useViewport with a value of 1999-2006 should show the second data point', () => {
    mockUserViewport.viewport = {
      start: new Date(1999, 0, 0),
      end: new Date(2006, 0, 0),
    };

    render(<KPI query={SUCCESS_QUERY} />);
    expect(
      screen.getByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).toBeVisible();
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DEFAULT_DECIMAL_PLACES))
    ).toBeVisible();
  });

  it('useViewport with a value of 1992-1997 should show no data point', () => {
    mockUserViewport.viewport = {
      start: new Date(1992, 0, 0),
      end: new Date(1997, 0, 0),
    };

    render(<KPI query={SUCCESS_QUERY} />);
    expect(screen.getByText('-')).toBeVisible();
  });

  it('useViewport with no value should show the second data point', () => {
    // in the case of no viewport the widget should fall back to the passed in viewport or default viewport
    mockUserViewport.viewport = undefined;

    render(<KPI query={SUCCESS_QUERY} />);
    expect(
      screen.getByText(
        formatDate(DATA_STREAM.data[1].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).toBeVisible();
    expect(
      screen.getByText(DATA_STREAM.data[1].y.toFixed(DEFAULT_DECIMAL_PLACES))
    ).toBeVisible();
  });

  it('useViewport with no value and a passed in viewport should show the first data point', () => {
    // in the case of no viewport the widget should fall back to the passed in viewport or default viewport
    mockUserViewport.viewport = undefined;

    render(
      <KPI
        viewport={{ start: new Date(1999, 0, 0), end: new Date(2001, 0, 0) }}
        query={SUCCESS_QUERY}
      />
    );
    expect(
      screen.getByText(
        formatDate(DATA_STREAM.data[0].x, { pattern: 'M/dd/yyyy, h:mm:ss aa' })
      )
    ).toBeVisible();
    expect(
      screen.getByText(DATA_STREAM.data[0].y.toFixed(DEFAULT_DECIMAL_PLACES))
    ).toBeVisible();
  });
});
