import { type ISceneDocument } from '../interfaces';

export const emptyScene: ISceneDocument = {
  specVersion: '1.0',
  version: '1',
  unit: 'meters',
  nodeMap: {},
  rootNodeRefs: [],
  ruleMap: {
    sampleAlarmIconRule: {
      statements: [
        {
          expression: "alarm_status == 'ACTIVE'",
          target: 'iottwinmaker.common.icon:Error',
        },
        {
          expression: "alarm_status == 'ACKNOWLEDGED'",
          target: 'iottwinmaker.common.icon:Warning',
        },
        {
          expression: "alarm_status == 'SNOOZE_DISABLED'",
          target: 'iottwinmaker.common.icon:Warning',
        },
        {
          expression: "alarm_status == 'NORMAL'",
          target: 'iottwinmaker.common.icon:Info',
        },
      ],
    },
    sampleTimeSeriesIconRule: {
      statements: [
        {
          expression: 'temperature >= 40',
          target: 'iottwinmaker.common.icon:Error',
        },
        {
          expression: 'temperature >= 20',
          target: 'iottwinmaker.common.icon:Warning',
        },
        {
          expression: 'temperature < 20',
          target: 'iottwinmaker.common.icon:Info',
        },
      ],
    },
    sampleTimeSeriesColorRule: {
      statements: [
        {
          expression: 'temperature >= 40',
          target: 'iottwinmaker.common.color:#FF0000',
        },
        {
          expression: 'temperature >= 20',
          target: 'iottwinmaker.common.color:#FFFF00',
        },
        {
          expression: 'temperature < 20',
          target: 'iottwinmaker.common.color:#00FF00',
        },
      ],
    },
  },
  properties: {
    environmentPreset: 'neutral',
  },
};
