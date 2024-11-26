import shuffle from 'lodash-es/shuffle';
import { type AnomalyObjectDataSource } from '../../src/data';

const randomValuePicker = (
  initialValues = [0.1, 0.1, 0.15, 0.18, 0.22, 0.25]
) => {
  let values = shuffle(initialValues.slice());

  return {
    next: () => {
      let nextValue = values.pop();
      if (!nextValue) {
        values = shuffle(initialValues.slice());
        nextValue = values.pop();
      }
      values = shuffle(values);

      return nextValue ?? 0;
    },
  };
};

const valuePicker = randomValuePicker();

export const BaseAnomalyResult = {
  quality: 'GOOD',
  value: {
    anomalyScore: 50,
    predictionReason: 'bad stuff idk',
    diagnostics: [
      { name: 'Average Power', value: 0.1 },
      { name: 'Average Wind Speed', value: 0.22 },
      { name: 'RPM', value: 0.18 },
      { name: 'Torque', value: 0.1 },
      { name: 'Wind Direction', value: 0.25 },
      { name: 'Wind Speed', value: 0.15 },
    ],
  },
};

function getRandomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime)).getTime();
}

export const MOCK_DATA_VIEWPORT = {
  start: new Date(),
  end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
};
// creates array of 10 random dates within last 7 days
const times = new Array(20)
  .fill(null)
  .map(() => getRandomDate(MOCK_DATA_VIEWPORT.end, MOCK_DATA_VIEWPORT.start));

export const mockDatasource: AnomalyObjectDataSource = {
  state: 'success',
  value: {
    data: times.map((t) => ({
      timestamp: t,
      prediction: 1,
      diagnostics: BaseAnomalyResult.value.diagnostics.map((d) => ({
        id: d.name,
        name: d.name,
        value: valuePicker.next(),
      })),
    })),
  },
};

export const emptyMockDatasource: AnomalyObjectDataSource = {
  state: 'success',
  value: { data: [] },
};

export const loadingMockDatasource: AnomalyObjectDataSource = {
  state: 'loading',
  value: { data: [] },
};

export const failedMockDatasource: AnomalyObjectDataSource = {
  state: 'failed',
  value: { data: [] },
};

export const errorMockDatasource: AnomalyObjectDataSource = {
  state: 'error',
  value: { data: [] },
};
