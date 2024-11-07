import { componentTypeToId } from '../../common/entityModelConstants';
import { type IMotionIndicatorComponent, KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';
import { type IMotionIndicatorComponentInternal } from '../../store';

import {
  EMPTY_COLOR_STRING,
  createMotionIndicatorEntityComponent,
  parseMotionIndicatorComp,
  updateMotionIndicatorEntityComponent,
} from './motionIndicatorComponent';

const indicatorBase: IMotionIndicatorComponent = {
  type: KnownComponentType.MotionIndicator,
  shape: Component.MotionIndicatorShape.LinearPlane,
  config: {
    numOfRepeatInY: 2,
    backgroundColorOpacity: 0.5,
  },
  valueDataBindings: {},
};

describe('createMotionIndicatorEntityComponent', () => {
  it('should return expected basic motion indicator component', () => {
    expect(createMotionIndicatorEntityComponent(indicatorBase)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
      properties: {
        shape: {
          value: {
            stringValue: indicatorBase.shape,
          },
        },
        config_numOfRepeatInY: {
          value: {
            integerValue: indicatorBase.config.numOfRepeatInY,
          },
        },
        config_backgroundColorOpacity: {
          value: {
            doubleValue: indicatorBase.config.backgroundColorOpacity,
          },
        },
        config_defaultBackgroundColor: {
          value: {
            stringValue: EMPTY_COLOR_STRING,
          },
        },
        config_defaultForegroundColor: {
          value: {
            stringValue: EMPTY_COLOR_STRING,
          },
        },
      },
    });
  });

  it('should return expected motion indicator component with default speed', () => {
    const result = createMotionIndicatorEntityComponent({
      ...indicatorBase,
      config: { ...indicatorBase.config, defaultSpeed: 11 },
    });

    expect(result.properties!['config_defaultSpeed']).toEqual({
      value: { doubleValue: 11 },
    });
  });

  it('should return expected motion indicator component with default background color', () => {
    const result = createMotionIndicatorEntityComponent({
      ...indicatorBase,
      config: { ...indicatorBase.config, defaultBackgroundColor: '#123' },
    });

    expect(result.properties!['config_defaultBackgroundColor']).toEqual({
      value: { stringValue: '#123' },
    });
  });

  it('should return expected motion indicator component with default foreground color', () => {
    const result = createMotionIndicatorEntityComponent({
      ...indicatorBase,
      config: { ...indicatorBase.config, defaultForegroundColor: '#abc' },
    });

    expect(result.properties!['config_defaultForegroundColor']).toEqual({
      value: { stringValue: '#abc' },
    });
  });

  it('should return expected motion indicator component with speed binding', () => {
    const result = createMotionIndicatorEntityComponent({
      ...indicatorBase,
      valueDataBindings: {
        speed: { ruleBasedMapId: 'rule-id', valueDataBinding: { dataBindingContext: { entityId: 'eid' } } },
      },
    });

    expect(result.properties!['appearanceBindings']).toEqual({
      value: {
        listValue: [
          {
            mapValue: {
              ruleBasedMapId: {
                stringValue: 'rule-id',
              },
              bindingName: {
                stringValue: 'speed',
              },
              entityId: {
                stringValue: 'eid',
              },
            },
          },
        ],
      },
    });
  });

  it('should return expected motion indicator component with empty speed binding', () => {
    const result = createMotionIndicatorEntityComponent({
      ...indicatorBase,
      valueDataBindings: {
        speed: undefined,
      },
    });

    expect(result.properties!['appearanceBindings']).toEqual({
      value: {
        listValue: [
          {
            mapValue: {
              bindingName: {
                stringValue: 'speed',
              },
            },
          },
        ],
      },
    });
  });

  it('should return expected motion indicator component with background color binding', () => {
    const result = createMotionIndicatorEntityComponent({
      ...indicatorBase,
      valueDataBindings: {
        backgroundColor: { valueDataBinding: { dataBindingContext: { entityId: 'eid' } } },
      },
    });

    expect(result.properties!['appearanceBindings']).toEqual({
      value: {
        listValue: [
          {
            mapValue: {
              bindingName: {
                stringValue: 'backgroundColor',
              },
              entityId: {
                stringValue: 'eid',
              },
            },
          },
        ],
      },
    });
  });

  it('should return expected motion indicator component with multiple bindings', () => {
    const result = createMotionIndicatorEntityComponent({
      ...indicatorBase,
      valueDataBindings: {
        foregroundColor: { valueDataBinding: { dataBindingContext: { entityId: 'eid' } } },
        speed: { ruleBasedMapId: 'rule-id', valueDataBinding: { dataBindingContext: { entityId: 'eid' } } },
      },
    });

    expect(result.properties!['appearanceBindings']).toEqual({
      value: {
        listValue: [
          {
            mapValue: {
              bindingName: {
                stringValue: 'foregroundColor',
              },
              entityId: {
                stringValue: 'eid',
              },
            },
          },
          {
            mapValue: {
              ruleBasedMapId: {
                stringValue: 'rule-id',
              },
              bindingName: {
                stringValue: 'speed',
              },
              entityId: {
                stringValue: 'eid',
              },
            },
          },
        ],
      },
    });
  });
});

describe('updateMotionIndicatorEntityComponent', () => {
  it('should return expected motion indicator component update request', () => {
    expect(updateMotionIndicatorEntityComponent(indicatorBase)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
      propertyUpdates: expect.any(Object),
    });
  });
});

describe('parseMotionIndicatorComp', () => {
  const indicatorBasePropsWithoutColors = [
    {
      propertyName: 'shape',
      propertyValue: 'LinearPlane',
    },
    {
      propertyName: 'config_numOfRepeatInY',
      propertyValue: 2,
    },
    {
      propertyName: 'config_backgroundColorOpacity',
      propertyValue: 0,
    },
  ];
  const indicatorBaseProps = [
    ...indicatorBasePropsWithoutColors,
    {
      propertyName: 'config_defaultBackgroundColor',
      propertyValue: EMPTY_COLOR_STRING,
    },
    {
      propertyName: 'config_defaultForegroundColor',
      propertyValue: EMPTY_COLOR_STRING,
    },
  ];

  it('should parse to expected basic motion indicator component', () => {
    const expected: IMotionIndicatorComponentInternal = {
      ref: expect.any(String),
      type: KnownComponentType.MotionIndicator,
      shape: Component.MotionIndicatorShape.LinearPlane,
      config: {
        numOfRepeatInY: 2,
        backgroundColorOpacity: 0,
      },
      valueDataBindings: {},
    };

    expect(
      parseMotionIndicatorComp({
        componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
        properties: indicatorBaseProps,
      }),
    ).toEqual(expected);
  });

  it('should parse to expected motion indicator component with default speed', () => {
    const result = parseMotionIndicatorComp({
      componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
      properties: [
        ...indicatorBaseProps,
        {
          propertyName: 'config_defaultSpeed',
          propertyValue: 3,
        },
      ],
    });

    expect(result?.config.defaultSpeed).toEqual(3);
  });

  it('should parse to expected motion indicator component with default background color', () => {
    const result = parseMotionIndicatorComp({
      componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
      properties: [
        ...indicatorBasePropsWithoutColors,
        {
          propertyName: 'config_defaultBackgroundColor',
          propertyValue: '#abc',
        },
      ],
    });

    expect(result?.config.defaultBackgroundColor).toEqual('#abc');
  });

  it('should parse to expected motion indicator component with default foreground color', () => {
    const result = parseMotionIndicatorComp({
      componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
      properties: [
        ...indicatorBasePropsWithoutColors,
        {
          propertyName: 'config_defaultForegroundColor',
          propertyValue: '#abc',
        },
      ],
    });

    expect(result?.config.defaultForegroundColor).toEqual('#abc');
  });

  it('should parse to expected motion indicator component with speed binding', () => {
    const result = parseMotionIndicatorComp({
      componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
      properties: [
        ...indicatorBaseProps,
        {
          propertyName: 'appearanceBindings',
          propertyValue: [
            {
              bindingName: 'speed',
              ruleBasedMapId: 'rule-id',
              entityId: 'eid',
            },
          ],
        },
      ],
    });

    expect(result?.valueDataBindings).toEqual({
      speed: {
        ruleBasedMapId: 'rule-id',
        valueDataBinding: {
          dataBindingContext: {
            entityId: 'eid',
          },
        },
      },
    });
  });

  it('should parse to expected motion indicator component with background color binding', () => {
    const result = parseMotionIndicatorComp({
      componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
      properties: [
        ...indicatorBaseProps,
        {
          propertyName: 'appearanceBindings',
          propertyValue: [
            {
              bindingName: 'backgroundColor',
              ruleBasedMapId: 'rule-id',
            },
          ],
        },
      ],
    });

    expect(result?.valueDataBindings).toEqual({
      backgroundColor: {
        ruleBasedMapId: 'rule-id',
      },
    });
  });

  it('should parse to expected motion indicator component with multiple bindings', () => {
    const result = parseMotionIndicatorComp({
      componentTypeId: componentTypeToId[KnownComponentType.MotionIndicator],
      properties: [
        ...indicatorBaseProps,
        {
          propertyName: 'appearanceBindings',
          propertyValue: [
            {
              bindingName: 'speed',
              ruleBasedMapId: 'rule-id',
              entityId: 'eid',
            },
            {
              bindingName: 'foregroundColor',
              ruleBasedMapId: 'rule-id-2',
            },
          ],
        },
      ],
    });

    expect(result?.valueDataBindings).toEqual({
      speed: {
        ruleBasedMapId: 'rule-id',
        valueDataBinding: {
          dataBindingContext: {
            entityId: 'eid',
          },
        },
      },
      foregroundColor: {
        ruleBasedMapId: 'rule-id-2',
      },
    });
  });
});
