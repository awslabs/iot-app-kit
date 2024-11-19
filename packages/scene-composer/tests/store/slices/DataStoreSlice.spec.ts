import { createDataStoreSlice } from '../../../src/store/slices/DataStoreSlice';

describe('createDataStoreSlice', () => {
  it('should be able to setDataInput', () => {
    const dataInput = 'Test dataInput';
    const draft = { lastOperation: undefined, dataInput };

    const get = vi.fn();
    const set = vi.fn(((callback) => callback(draft)) as any);

    const { setDataInput } = createDataStoreSlice(set, get, undefined as any);
    setDataInput(dataInput as any);

    expect(draft.lastOperation!).toEqual('setDataInput');
    expect(draft.dataInput).toEqual(dataInput);
  });
});
