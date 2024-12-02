import { act, renderHook } from '@iot-app-kit/testing-util/testing-library';
import { useMode } from './useMode';

test('change mode', () => {
  const { result } = renderHook(() => useMode());

  act(() => {
    result.current.selectMode({ mode: 'edit' });
  });

  expect(result.current.mode).toEqual('edit');

  act(() => {
    result.current.selectMode({ mode: 'view' });
  });

  expect(result.current.mode).toEqual('view');
});
