/* eslint-disable import/first */
/* eslint-disable import/order */
import * as React from 'react';
import renderer from 'react-test-renderer';

import { ErrorCode, ErrorLevel, SceneComposerRuntimeError } from '../src';

import { mockPolaris } from './__mocks__/MockPolaris';

mockPolaris();

import DefaultErrorFallback from '../src/components/DefaultErrorFallback';

jest.mock('../src/components/StaticLayout', () => ({
  StaticLayout: 'StaticLayout',
}));

describe('DefaultErrorFallback', () => {
  const sceneComposerRuntimeError = new SceneComposerRuntimeError(
    ErrorLevel.ERROR,
    ErrorCode.SC_ERROR_LOAD_SCENE,
    'Testing a SceneComposerRuntimeError',
    { test: 'test' },
    new Error('Testing an innerError'),
  );
  const error = new Error('Testing an error');
  const errorString = 'Testing a string' as any;
  const other = {} as any;

  [
    ['SceneComposerRuntimeError', sceneComposerRuntimeError],
    ['Error', error],
    ['String', errorString],
    ['Unknown', other],
  ].forEach((value) => {
    it(`should render correctly with a ${value[0]} type`, () => {
      const container = renderer.create(<DefaultErrorFallback error={value[1] as any} />);

      expect(container).toMatchSnapshot();
    });
  });
});
