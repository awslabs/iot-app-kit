import { useContext } from 'react';

import { useModelExplorer } from '../Context';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn((arg) => arg),
}));

describe('useModelExplorer', () => {
  it('should provide access to the appropriate context', () => {
    const result = useModelExplorer();

    expect(useContext).toBeCalledWith(result);
  });
});
