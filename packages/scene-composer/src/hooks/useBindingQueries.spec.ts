import { renderHook } from '@testing-library/react';

import { useStore } from '../store';

import useBindingQueries from './useBindingQueries';

describe('useBindingQueries', () => {
  const mockProvider = {
    createQuery: jest.fn(),
  };

  beforeEach(() => {
    useStore('default').setState({
      getEditorConfig: jest.fn().mockReturnValue({ valueDataBindingProvider: mockProvider }),
    });
  });

  it('should return undefined when bindings are empty', () => {
    const queries = renderHook(() => useBindingQueries([])).result.current.queries;

    expect(queries).toBeUndefined();
  });

  it('should return queries for each binding in the matching order', () => {
    const expectedQueries = [{ entityId: 'AA' }, undefined, { entityId: 'BB' }];
    const bindings = [
      { dataBindingContext: { entityId: 'AA' } },
      { dataBindingContext: { entityId: 'CC' } },
      { dataBindingContext: { entityId: 'BB' } },
    ];
    mockProvider.createQuery.mockImplementation((binding) => {
      const id = binding.dataBindingContext.entityId;
      if (id === 'AA' || id === 'BB') {
        return { entityId: id };
      }
      return undefined;
    });
    const queries = renderHook(() => useBindingQueries(bindings)).result.current.queries;

    expect(queries).toEqual(expectedQueries);
  });
});
