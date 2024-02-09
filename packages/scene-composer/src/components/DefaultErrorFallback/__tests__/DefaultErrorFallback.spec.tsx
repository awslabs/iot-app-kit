import * as React from 'react';
import { create } from 'react-test-renderer';

import { ErrorCode, ErrorLevel, SceneComposerRuntimeError } from '../../..';
import DefaultErrorFallback from '..';

jest.mock('../../../layouts/StaticLayout', () => ({
  StaticLayout: 'StaticLayout',
}));

describe('DefaultErrorFallback', () => {
  const sceneComposerRuntimeError = new SceneComposerRuntimeError({
    level: ErrorLevel.ERROR,
    code: ErrorCode.SC_ERROR_LOAD_SCENE,
    message: 'Testing a SceneComposerRuntimeError',
    context: { test: 'test' },
    innerError: new Error('Testing an innerError'),
  });
  const error = new Error('Testing an error');
  const errorString = 'Testing a string';
  const other = {} as any;

  [
    ['SceneComposerRuntimeError', sceneComposerRuntimeError],
    ['Error', error],
    ['String', errorString],
    ['Unknown', other],
  ].forEach((value) => {
    it(`should render correctly with a ${value[0]} type`, () => {
      const container = create(<DefaultErrorFallback error={value[1]} />);

      expect(container).toMatchSnapshot();
    });
  });
});
