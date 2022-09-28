import { DataStream } from '@iot-app-kit/core';

import { IDataInput } from '../src/interfaces';

import scene1 from './scenes/scene_1.json';
import scene2 from './scenes/scene_2.json';
import scene3 from './scenes/scene_3.json';
import waterTankScene from './scenes/CookieFactoryWaterTank.json';
import privateBetaScene from './scenes/private-beta-scene.json';
import unsupportedMajorVersionScene from './scenes/unsupported-major-version-scene.json';
import unsupportedMinorVersionScene from './scenes/unsupported-minor-version-scene.json';
import invalidSpecVersionScene from './scenes/invalid-spec-version-scene.json';
import mixErrorWarningScene from './scenes/mix-error-warning-scene.json';
import testDataContinuous from './data/test_input_data_continous.json';
import testDataDiscrete from './data/test_input_data_discrete.json';

export const testScenes = {
  scene1: JSON.stringify(scene1),
  scene2: JSON.stringify(scene2),
  scene3: JSON.stringify(scene3),
  waterTank: JSON.stringify(waterTankScene),
};

export const invalidTestScenes = {
  empty: '',
  invalidJson: '{this is not a valid json}',
  privateBeta: JSON.stringify(privateBetaScene),
  unsupportedMajorVersion: JSON.stringify(unsupportedMajorVersionScene),
  unsupportedMinorVersionScene: JSON.stringify(unsupportedMinorVersionScene),
  invalidSpecVersionScene: JSON.stringify(invalidSpecVersionScene),
  mixErrorWarningScene: JSON.stringify(mixErrorWarningScene),
};

export function getTestDataInputDiscrete(): IDataInput {
  return testDataDiscrete as IDataInput;
}

export function getTestDataInputContinuous(): IDataInput {
  return testDataContinuous as IDataInput;
}

export function convertDataInputToDataStreams(dataInput: IDataInput): DataStream[] {
  const streams: DataStream[] = [];
  dataInput.dataFrames.forEach((frame) => {
    const timeFieldIndex = frame.fields.findIndex((field) => field.valueType === 'time');
    if (timeFieldIndex >= 0) {
      const times = frame.fields[timeFieldIndex].values;

      frame.fields.forEach((field, index) => {
        if (index !== timeFieldIndex) {
          streams.push({
            id: frame.dataFrameId,
            resolution: 0,
            data: field.values.map((y, index) => ({ x: times[index], y })),
            meta: { ...field.labels, propertyName: field.name },
          });
        }
      });
    }
  });

  return streams;
}
