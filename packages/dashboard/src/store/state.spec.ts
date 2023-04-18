import merge from 'lodash/merge';
import { initialState } from './state';

it('does not modify initialState', () => {
  const illegalModification = () => {
    merge(initialState, {
      dashboardConfiguration: {
        widgets: [
          {
            id: 'test-widget',
            type: 'test',
            x: 0,
            y: 0,
            z: 1,
            height: 10,
            width: 10,
            properties: {},
          },
        ],
      },
    });
  };

  expect(illegalModification).toThrowError();
});
