import { renderHook, waitFor } from '@testing-library/react';

import { accessStore } from '../store';

import useBindingData from './useBindingData';

describe('useBindingData', () => {
  const mockProvider = {
    createQuery: jest.fn(),
  };

  beforeEach(() => {
    accessStore('default').getState().noHistoryStates.setAutoQueryEnabled(true);
    accessStore('default').getState().noHistoryStates.setViewport({ duration: '5m' });
    accessStore('default').setState({
      getEditorConfig: jest.fn().mockReturnValue({ valueDataBindingProvider: mockProvider }),
    });
  });

  it('should return undefined when auto query is not enabled', () => {
    accessStore('default').getState().noHistoryStates.setAutoQueryEnabled(false);

    const data = renderHook(() => useBindingData([])).result.current.data;

    expect(data).toBeUndefined();
  });

  it('should return undefined when bindings are empty', () => {
    const data = renderHook(() => useBindingData([])).result.current.data;

    expect(data).toBeUndefined();
  });

  it('should return undefined when viewport is undefined', () => {
    accessStore('default').getState().noHistoryStates.setViewport(undefined);

    const data = renderHook(() => useBindingData([])).result.current.data;

    expect(data).toBeUndefined();
  });

  it('should return data for each binding in the matching order', async () => {
    const expectedData = [{ prop: 'AA' }, undefined, { prop: 'BB' }];
    const bindings = [
      { dataBindingContext: { entityId: 'AA', propertyName: 'prop' } },
      { dataBindingContext: { entityId: 'CC', propertyName: 'prop' } },
      { dataBindingContext: { entityId: 'BB', propertyName: 'prop' } },
    ];
    mockProvider.createQuery.mockImplementation((binding) => {
      const id = binding.dataBindingContext.entityId;
      if (id === 'AA' || id === 'BB') {
        return {
          build: jest.fn().mockReturnValue({
            subscribe: jest
              .fn()
              .mockImplementation((cb) => cb.next([{ dataStreams: [{ data: [{ y: 'random' }, { y: id }] }] }])),
            unsubscribe: jest.fn(),
          }),
        };
      }
      return undefined;
    });

    await waitFor(() => {
      const { result } = renderHook(() => useBindingData(bindings));
      expect(result.current.data).toEqual(expectedData);
    });
  });
});
