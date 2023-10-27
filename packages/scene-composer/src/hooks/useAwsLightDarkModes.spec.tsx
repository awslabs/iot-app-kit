import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
const applyModeMock = jest.fn();
jest.mock('@awsui/global-styles', () => ({
  applyMode: applyModeMock,
  Mode: jest.requireActual('@awsui/global-styles').Mode,
}));
import { Mode } from '@awsui/global-styles';

import useAwsLightDarkModes from './useAwsLightDarkModes';

describe('useAwsLightDarkModes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should apply light mode', () => {
    const divRef = createRef<HTMLDivElement>();
    render(<div ref={divRef}></div>);
    renderHook(() => useAwsLightDarkModes(divRef, Mode.Light));
    expect(applyModeMock).toBeCalledWith(Mode.Light, divRef.current);
  });
  it('should apply dark mode', () => {
    const divRef = createRef<HTMLDivElement>();
    render(<div ref={divRef}></div>);
    renderHook(() => useAwsLightDarkModes(divRef, Mode.Dark));
    expect(applyModeMock).toBeCalledWith(Mode.Dark, divRef.current);
  });
});
