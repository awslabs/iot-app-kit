import { accessStore } from '../../src/store';

describe('accessStore', () => {
  it('should get store by id', () => {
    const initialStore = accessStore('test1');
    const getStore = accessStore('test1');
    const otherStore = accessStore('test2');

    expect(initialStore).toEqual(getStore);
    expect(otherStore).not.toEqual(getStore);
  });
});
