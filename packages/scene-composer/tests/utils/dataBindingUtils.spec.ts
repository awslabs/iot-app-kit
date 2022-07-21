import { IDataFrame, IDataInput, IotTwinMakerNumberNamespace, IRuleBasedMap } from '../../src/interfaces';
import { dataBindingValuesProvider, ruleEvaluator } from '../../src/utils/dataBindingUtils';

describe('dataBindingValuesProvider', () => {
  const createMockDataFrames = (desc = true): IDataFrame[] => {
    const timeValues = desc ? [10, 8, 6, 4, 2, 0] : [0, 2, 4, 6, 8, 10];
    return [
      {
        dataFrameId: 'A',
        fields: [
          {
            name: 'time',
            valueType: 'time',
            values: timeValues,
          },
          {
            name: 'temperature',
            valueType: 'number',
            labels: { key1: 'value1', key2: 'value2' },
            values: [47, 48, 49, 50, 51, 52],
          },
        ],
      },
    ];
  };
  const dataBinding = { dataBindingContext: { key1: 'value1', key2: 'value2' }, dataFrameLabel: '' };

  it('should return a value succesfully in DESC order with time cursor in range', () => {
    const dataInput: IDataInput = {
      dataFrames: createMockDataFrames(),
      timeCursor: 7,
      timeRange: { from: 0, to: 10 },
    };
    const result = dataBindingValuesProvider(dataInput, dataBinding);
    expect(result).toEqual({ temperature: 48, temperature_raw: [47, 48, 49, 50, 51, 52] });
  });

  it('should return a value succesfully in DESC order with time cursor outside the range', () => {
    const dataInput1: IDataInput = {
      dataFrames: createMockDataFrames(),
      timeCursor: 12,
      timeRange: { from: 0, to: 15 },
    };
    expect(dataBindingValuesProvider(dataInput1, dataBinding)).toEqual({
      temperature: 47,
      temperature_raw: [47, 48, 49, 50, 51, 52],
    });

    const dataInput2: IDataInput = {
      dataFrames: createMockDataFrames(),
      timeCursor: -2,
      timeRange: { from: -5, to: 10 },
    };
    expect(dataBindingValuesProvider(dataInput2, dataBinding)).toEqual({
      temperature: 52,
      temperature_raw: [47, 48, 49, 50, 51, 52],
    });
  });

  it('should return a value succesfully in ASC order with time cursor in range', () => {
    const dataInput: IDataInput = {
      dataFrames: createMockDataFrames(false),
      timeCursor: 7,
      timeRange: { from: 0, to: 10 },
    };
    const result = dataBindingValuesProvider(dataInput, dataBinding);
    expect(result).toEqual({ temperature: 51, temperature_raw: [47, 48, 49, 50, 51, 52] });
  });

  it('should return a value succesfully in ASC order with time cursor outside the range', () => {
    const dataInput1: IDataInput = {
      dataFrames: createMockDataFrames(false),
      timeCursor: -2,
      timeRange: { from: -5, to: 10 },
    };
    expect(dataBindingValuesProvider(dataInput1, dataBinding)).toEqual({
      temperature: 47,
      temperature_raw: [47, 48, 49, 50, 51, 52],
    });

    const dataInput2: IDataInput = {
      dataFrames: createMockDataFrames(false),
      timeCursor: 12,
      timeRange: { from: 0, to: 15 },
    };
    expect(dataBindingValuesProvider(dataInput2, dataBinding)).toEqual({
      temperature: 52,
      temperature_raw: [47, 48, 49, 50, 51, 52],
    });
  });

  it('should return empty value if timeCursor is out of the time range', () => {
    const dataInput1: IDataInput = {
      dataFrames: createMockDataFrames(),
      timeCursor: 1,
      timeRange: { from: 5, to: 10 },
    };
    expect(dataBindingValuesProvider(dataInput1, dataBinding)).toEqual({});

    const dataInput2: IDataInput = {
      dataFrames: createMockDataFrames(),
      timeCursor: 15,
      timeRange: { from: 5, to: 10 },
    };
    expect(dataBindingValuesProvider(dataInput2, dataBinding)).toEqual({});
  });

  it('should return the latest value without timeCursor', () => {
    const dataInput1: IDataInput = {
      dataFrames: createMockDataFrames(),
      timeRange: { from: 0, to: 10 },
    };
    expect(dataBindingValuesProvider(dataInput1, dataBinding)).toEqual({
      temperature: 47,
      temperature_raw: [47, 48, 49, 50, 51, 52],
    });

    const dataInput2: IDataInput = {
      dataFrames: createMockDataFrames(false),
      timeRange: { from: 0, to: 10 },
    };
    expect(dataBindingValuesProvider(dataInput2, dataBinding)).toEqual({
      temperature: 52,
      temperature_raw: [47, 48, 49, 50, 51, 52],
    });
  });

  it('should return empty value without time data field', () => {
    const dataFrames: IDataFrame[] = [
      {
        dataFrameId: 'A',
        fields: [
          {
            name: 'temperature',
            valueType: 'number',
            labels: { key1: 'value1', key2: 'value2' },
            values: [47, 48, 49, 50, 51, 52],
          },
        ],
      },
    ];

    const dataInput: IDataInput = {
      dataFrames,
      timeCursor: 6,
      timeRange: { from: 0, to: 10 },
    };

    const result = dataBindingValuesProvider(dataInput, dataBinding);
    expect(result).toEqual({});
  });

  it('should return empty value with invalid inputs', () => {
    const dataInput: IDataInput = {
      dataFrames: createMockDataFrames(),
      timeCursor: 6,
      timeRange: { from: 0, to: 10 },
    };

    expect(dataBindingValuesProvider(undefined, dataBinding)).toEqual({});
    expect(dataBindingValuesProvider(dataInput, undefined)).toEqual({});
    expect(dataBindingValuesProvider(undefined, undefined)).toEqual({});
  });

  it('should return empty value with no values in dataField', () => {
    const dataFrames: IDataFrame[] = [
      {
        dataFrameId: 'A',
        fields: [
          {
            name: 'time',
            valueType: 'time',
            values: [],
          },
          {
            name: 'temperature',
            valueType: 'number',
            labels: { key1: 'value1', key2: 'value2' },
            values: [],
          },
        ],
      },
    ];

    const dataInput: IDataInput = {
      dataFrames,
      timeCursor: 6,
      timeRange: { from: 0, to: 10 },
    };

    expect(dataBindingValuesProvider(dataInput, dataBinding)).toEqual({});
  });
});

describe('ruleEvaluator', () => {
  it('should return default state with no rules', async () => {
    const result = ruleEvaluator('mockDefaultState', {});
    expect(result).toBe('mockDefaultState');
  });

  it('should return default state with empty value', async () => {
    const rule: IRuleBasedMap = {
      statements: [
        {
          expression: 'temperature < 20',
          target: 'mockTarget1',
        },
      ],
    };

    const result = ruleEvaluator('mockDefaultState', {}, rule);
    expect(result).toBe('mockDefaultState');
  });

  it('should return rule target if it matches', async () => {
    const value = { temperature: 20 };
    const rule: IRuleBasedMap = {
      statements: [
        {
          expression: 'temperature < 20',
          target: 'mockTarget1',
        },
        {
          expression: 'temperature >= 20',
          target: 'mockTarget2',
        },
      ],
    };
    const result = ruleEvaluator('mockDefaultState', value, rule);
    expect(result).toBe('mockTarget2');
  });

  it('should return rule evaluation result if target is number', async () => {
    const value = { temperature: 20 };
    const rule: IRuleBasedMap = {
      statements: [
        {
          expression: 'temperature >= 20 ? 2 : 3',
          target: IotTwinMakerNumberNamespace,
        },
      ],
    };
    expect(ruleEvaluator('mockDefaultState', value, rule)).toEqual(2);
    expect(ruleEvaluator('mockDefaultState', { temperature: 10 }, rule)).toEqual(3);
  });

  it('should return default state if rule evaluation result is a number while target is number', async () => {
    const value = { temperature: 20 };
    const rule: IRuleBasedMap = {
      statements: [
        {
          expression: 'abc',
          target: IotTwinMakerNumberNamespace,
        },
      ],
    };
    expect(ruleEvaluator('mockDefaultState', value, rule)).toEqual('mockDefaultState');
  });

  it('should return default state if no rule matches', async () => {
    const value = { temperature: 20 };
    const rule: IRuleBasedMap = {
      statements: [
        {
          expression: 'temperature < 20',
          target: 'mockTarget1',
        },
        {
          expression: 'temperature >= 20 & temperature < 30',
          target: 'mockTarget2',
        },
      ],
    };
    const result = ruleEvaluator('mockDefaultState', value, rule);
    expect(result).toBe('mockDefaultState');
  });

  it('should property names with special characters should work correctly', async () => {
    const key1 = 'my-temperature';
    const key2 = 'myRPM';
    const value = {
      [key1]: 22,
      [key2]: 99,
    };
    const rule: IRuleBasedMap = {
      statements: [
        {
          expression: `${key1} < 20 && ${key2} > 50`,
          target: 'mockTarget1',
        },
        {
          expression: `${key1} >= 20 && ${key2} > 50`,
          target: 'mockTarget2',
        },
      ],
    };
    const result = ruleEvaluator('mockDefaultState', value, rule);
    expect(result).toBe('mockTarget2');
  });
});
