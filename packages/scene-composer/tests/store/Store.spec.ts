import { useStore } from '../../src/store';

describe('useStore', () => {
  it('should get store by id', () => {
    const initialStore = useStore('test1');
    const getStore = useStore('test1');
    const otherStore = useStore('test2');

    expect(initialStore).toEqual(getStore);
    expect(otherStore).not.toEqual(getStore);
  });
});
