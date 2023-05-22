import { renderHook } from '@testing-library/react';
import useCyEvent from './useCyEvent';
import { MutableRefObject, useRef } from 'react';
import { Core } from 'cytoscape';

describe('useCyEvent', () => {
  it('should properly subscrube and unsubscribe to event on mount/unmount', () => {
    const callback = jest.fn();
    const onMock = jest.fn();
    const offMock = jest.fn();

    const { unmount } = renderHook(() => {
      const cy = useRef<Core>();
      cy.current = {
        on: onMock,
        off: offMock,
      } as unknown as Core;

      useCyEvent('tap', 'node', callback, cy as MutableRefObject<Core>);
    });

    expect(onMock).toHaveBeenCalledWith('tap', 'node', callback);

    unmount();

    expect(offMock).toHaveBeenCalledWith('tap', 'node', callback);
  });
});
