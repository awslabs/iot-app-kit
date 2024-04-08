import { AnomalyObjectDataSource } from '../../src/data';
import shuffle from 'lodash/shuffle';

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

// creates array of 10 random dates within last 7 days
const times = new Array(10)
  .fill(null)
  .map(() =>
    getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date())
  );

export const mockDatasource: AnomalyObjectDataSource = {
  state: 'success',
  value: {
    data: times.map((t) => ({
      timestamp: new Date(t).toISOString(),
      diagnostics: BaseAnomalyResult.value.diagnostics.map((d) => ({
        id: d.name,
        name: d.name,
        value: valuePicker.next(),
      })),
    })),
  },
};
