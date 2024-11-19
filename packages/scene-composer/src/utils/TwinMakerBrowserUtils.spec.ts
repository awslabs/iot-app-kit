import str2ab from 'string-to-arraybuffer';

import { type GetSceneObjectFunction } from '../interfaces';

import { createTwinMakerFetch } from './TwinMakerBrowserUtils';

describe('createTwinMakerFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should replace fetch to the fetch using getSceneObjectFunction', async () => {
    const mockResponseString = '{"key1":"value1","key2":123}';
    const mockArrayBuffer = str2ab(mockResponseString);
    const mockGetSceneObjectFunction: GetSceneObjectFunction = vi.fn(() => Promise.resolve(mockArrayBuffer));
    const fetchFunc = createTwinMakerFetch(mockGetSceneObjectFunction);
    const result = await fetchFunc('s3://bucket-name/path/file.ext');
    expect(mockGetSceneObjectFunction).toBeCalledTimes(1);
    expect((await result.json()).key1).toBe('value1');
    expect(await result.arrayBuffer()).toBe(mockArrayBuffer);
    expect(await result.text()).toBe(mockResponseString);
    expect(() => result.blob()).toThrow('[Not Implemented] blob()');
    expect(() => result.clone()).toThrow('[Not Implemented] clone()');
    expect(() => result.formData()).toThrow('[Not Implemented] formData()');
  });

  it('should get error if getSceneObjectFunction failed when the fetch is using getSceneObjectFunction', async () => {
    const mockError = new Error('Mock-Error');
    const fetchFunc = createTwinMakerFetch(() => Promise.reject(mockError));
    let actualError: unknown = null;

    try {
      await fetchFunc('s3://bucket-name/path/file.ext');
    } catch (err) {
      actualError = err;
    }

    expect(actualError).toEqual(mockError);
  });

  it('should use the original fetch for non-getSceneObjectFunction url', async () => {
    const _fetch = window.fetch;
    const mockFetch = vi.fn();
    window.fetch = mockFetch;
    const mockResolve = vi.fn();
    const mockGetSceneObjectFunction: GetSceneObjectFunction = vi.fn(() => new Promise<ArrayBuffer>(mockResolve));

    const fetchFunc = createTwinMakerFetch(mockGetSceneObjectFunction);
    fetchFunc('http://bucket-name/path/file.ext');
    expect(mockResolve).toBeCalledTimes(0);
    expect(mockFetch).toBeCalledTimes(1);

    window.fetch = _fetch;
  });
});
