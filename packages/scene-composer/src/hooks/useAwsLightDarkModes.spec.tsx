import { Mode } from '@cloudscape-design/global-styles';
import { render, renderHook } from '@testing-library/react';
import { createRef } from 'react';

const applyModeMock = vi.fn();
import useAwsLightDarkModes from './useAwsLightDarkModes';

vi.mock('@cloudscape-design/global-styles', async () => {
  const globalStyles = await vi.importActual('@cloudscape-design/global-styles');
  const Mode = globalStyles.Mode;

  return {
    applyMode: (...o: unknown[]) => applyModeMock(...o),
    Mode,
  };
});

describe('useAwsLightDarkModes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
