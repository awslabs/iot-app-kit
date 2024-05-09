import { AnomalyObjectDataSource } from '../../../data/transformers/anomaly/object/datasource';

export const MOCK_DATA_SOURCE_EMPTY_SUCCESS: AnomalyObjectDataSource = {
  state: 'success',
  value: { data: [] },
};

export const MOCK_DATA_SOURCE_SUCCESS: AnomalyObjectDataSource = {
  state: 'success',
  value: {
    data: [
      {
        timestamp: 1714909732438,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.25,
          },
          {
            name: 'Average Wind Speed',
            value: 0.1,
          },
          {
            name: 'RPM',
            value: 0.1,
          },
          {
            name: 'Torque',
            value: 0.18,
          },
          {
            name: 'Wind Direction',
            value: 0.15,
          },
          {
            name: 'Wind Speed',
            value: 0.22,
          },
        ],
      },
      {
        timestamp: 1714419170826,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.1,
          },
          {
            name: 'Average Wind Speed',
            value: 0.22,
          },
          {
            name: 'RPM',
            value: 0.15,
          },
          {
            name: 'Torque',
            value: 0.18,
          },
          {
            name: 'Wind Direction',
            value: 0.25,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
      {
        timestamp: 1714578429305,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.25,
          },
          {
            name: 'Average Wind Speed',
            value: 0.15,
          },
          {
            name: 'RPM',
            value: 0.22,
          },
          {
            name: 'Torque',
            value: 0.18,
          },
          {
            name: 'Wind Direction',
            value: 0.1,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
      {
        timestamp: 1714643198943,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.22,
          },
          {
            name: 'Average Wind Speed',
            value: 0.18,
          },
          {
            name: 'RPM',
            value: 0.15,
          },
          {
            name: 'Torque',
            value: 0.1,
          },
          {
            name: 'Wind Direction',
            value: 0.25,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
      {
        timestamp: 1714480555677,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.15,
          },
          {
            name: 'Average Wind Speed',
            value: 0.18,
          },
          {
            name: 'RPM',
            value: 0.1,
          },
          {
            name: 'Torque',
            value: 0.1,
          },
          {
            name: 'Wind Direction',
            value: 0.25,
          },
          {
            name: 'Wind Speed',
            value: 0.22,
          },
        ],
      },
      {
        timestamp: 1714411937923,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.1,
          },
          {
            name: 'Average Wind Speed',
            value: 0.18,
          },
          {
            name: 'RPM',
            value: 0.1,
          },
          {
            name: 'Torque',
            value: 0.25,
          },
          {
            name: 'Wind Direction',
            value: 0.22,
          },
          {
            name: 'Wind Speed',
            value: 0.15,
          },
        ],
      },
      {
        timestamp: 1714627287904,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.22,
          },
          {
            name: 'Average Wind Speed',
            value: 0.15,
          },
          {
            name: 'RPM',
            value: 0.1,
          },
          {
            name: 'Torque',
            value: 0.18,
          },
          {
            name: 'Wind Direction',
            value: 0.1,
          },
          {
            name: 'Wind Speed',
            value: 0.25,
          },
        ],
      },
      {
        timestamp: 1714999072631,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.1,
          },
          {
            name: 'Average Wind Speed',
            value: 0.25,
          },
          {
            name: 'RPM',
            value: 0.22,
          },
          {
            name: 'Torque',
            value: 0.1,
          },
          {
            name: 'Wind Direction',
            value: 0.18,
          },
          {
            name: 'Wind Speed',
            value: 0.15,
          },
        ],
      },
      {
        timestamp: 1714628340330,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.25,
          },
          {
            name: 'Average Wind Speed',
            value: 0.18,
          },
          {
            name: 'RPM',
            value: 0.22,
          },
          {
            name: 'Torque',
            value: 0.1,
          },
          {
            name: 'Wind Direction',
            value: 0.15,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
      {
        timestamp: 1714731287864,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.15,
          },
          {
            name: 'Average Wind Speed',
            value: 0.22,
          },
          {
            name: 'RPM',
            value: 0.25,
          },
          {
            name: 'Torque',
            value: 0.1,
          },
          {
            name: 'Wind Direction',
            value: 0.18,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
      {
        timestamp: 1714822944244,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.22,
          },
          {
            name: 'Average Wind Speed',
            value: 0.25,
          },
          {
            name: 'RPM',
            value: 0.15,
          },
          {
            name: 'Torque',
            value: 0.18,
          },
          {
            name: 'Wind Direction',
            value: 0.1,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
      {
        timestamp: 1714933880365,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.15,
          },
          {
            name: 'Average Wind Speed',
            value: 0.18,
          },
          {
            name: 'RPM',
            value: 0.22,
          },
          {
            name: 'Torque',
            value: 0.25,
          },
          {
            name: 'Wind Direction',
            value: 0.1,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
      {
        timestamp: 1714632308567,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.25,
          },
          {
            name: 'Average Wind Speed',
            value: 0.1,
          },
          {
            name: 'RPM',
            value: 0.18,
          },
          {
            name: 'Torque',
            value: 0.15,
          },
          {
            name: 'Wind Direction',
            value: 0.1,
          },
          {
            name: 'Wind Speed',
            value: 0.22,
          },
        ],
      },
      {
        timestamp: 1714757072072,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.18,
          },
          {
            name: 'Average Wind Speed',
            value: 0.15,
          },
          {
            name: 'RPM',
            value: 0.22,
          },
          {
            name: 'Torque',
            value: 0.1,
          },
          {
            name: 'Wind Direction',
            value: 0.25,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
      {
        timestamp: 1714455343258,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.25,
          },
          {
            name: 'Average Wind Speed',
            value: 0.1,
          },
          {
            name: 'RPM',
            value: 0.22,
          },
          {
            name: 'Torque',
            value: 0.18,
          },
          {
            name: 'Wind Direction',
            value: 0.1,
          },
          {
            name: 'Wind Speed',
            value: 0.15,
          },
        ],
      },
      {
        timestamp: 1714409979348,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.15,
          },
          {
            name: 'Average Wind Speed',
            value: 0.1,
          },
          {
            name: 'RPM',
            value: 0.25,
          },
          {
            name: 'Torque',
            value: 0.1,
          },
          {
            name: 'Wind Direction',
            value: 0.18,
          },
          {
            name: 'Wind Speed',
            value: 0.22,
          },
        ],
      },
      {
        timestamp: 1714459669203,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.15,
          },
          {
            name: 'Average Wind Speed',
            value: 0.25,
          },
          {
            name: 'RPM',
            value: 0.1,
          },
          {
            name: 'Torque',
            value: 0.22,
          },
          {
            name: 'Wind Direction',
            value: 0.1,
          },
          {
            name: 'Wind Speed',
            value: 0.18,
          },
        ],
      },
      {
        timestamp: 1714511393770,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.1,
          },
          {
            name: 'Average Wind Speed',
            value: 0.25,
          },
          {
            name: 'RPM',
            value: 0.18,
          },
          {
            name: 'Torque',
            value: 0.22,
          },
          {
            name: 'Wind Direction',
            value: 0.15,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
      {
        timestamp: 1714464450991,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.25,
          },
          {
            name: 'Average Wind Speed',
            value: 0.1,
          },
          {
            name: 'RPM',
            value: 0.1,
          },
          {
            name: 'Torque',
            value: 0.18,
          },
          {
            name: 'Wind Direction',
            value: 0.15,
          },
          {
            name: 'Wind Speed',
            value: 0.22,
          },
        ],
      },
      {
        timestamp: 1714660199070,
        diagnostics: [
          {
            name: 'Average Power',
            value: 0.22,
          },
          {
            name: 'Average Wind Speed',
            value: 0.18,
          },
          {
            name: 'RPM',
            value: 0.15,
          },
          {
            name: 'Torque',
            value: 0.25,
          },
          {
            name: 'Wind Direction',
            value: 0.1,
          },
          {
            name: 'Wind Speed',
            value: 0.1,
          },
        ],
      },
    ],
  },
};
