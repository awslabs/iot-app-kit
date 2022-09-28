import {
  extractFileNameExtFromUrl,
  getContainingDir,
  parseS3BucketFromArn,
  combineUrls,
} from '../../src/utils/pathUtils';

describe('extractFileNameExtFromUrl', () => {
  it('should handle absolute path correctly', () => {
    let [basename, ext] = extractFileNameExtFromUrl('s3://bucket/folder/subfolder/abc.gltf?key=123&foo=bar');

    expect(basename).toBe('abc');
    expect(ext).toBe('gltf');

    [basename, ext] = extractFileNameExtFromUrl('https://www.amazon.com/folder/subfolder/abc.gltf?key=123&foo=bar');

    expect(basename).toBe('abc');
    expect(ext).toBe('gltf');
  });

  it('should handle relative path correctly', () => {
    let [basename, ext] = extractFileNameExtFromUrl('/bucket/folder/subfolder/abc.gltf?key=123&foo=bar');

    expect(basename).toBe('abc');
    expect(ext).toBe('gltf');

    [basename, ext] = extractFileNameExtFromUrl('abc.gltf?key=123&foo=bar');

    expect(basename).toBe('abc');
    expect(ext).toBe('gltf');
  });

  it('should handle non-ascii chars correctly', () => {
    const [basename, ext] = extractFileNameExtFromUrl('/bucket/folder/subfolder/шеллы®.模型?key=123&foo=bar');

    expect(basename).toBe('шеллы®');
    expect(ext).toBe('模型');
  });

  it('should handle empty path correctly', () => {
    const [basename, ext] = extractFileNameExtFromUrl('');

    expect(basename).toBe('');
    expect(ext).toBe('');
  });

  it('should handle file without extension correctly', () => {
    let [basename, ext] = extractFileNameExtFromUrl('abc');

    expect(basename).toBe('abc');
    expect(ext).toBe('');

    [basename, ext] = extractFileNameExtFromUrl('.abc');

    expect(basename).toBe('.abc');
    expect(ext).toBe('');
  });
});

describe('getContainingDir', () => {
  it('should return s3 folder when an s3 file path is given', () => {
    const result = getContainingDir('s3://bucket/folder/subfolder/key');
    expect(result).toBe('s3://bucket/folder/subfolder/');
  });

  it('should return s3 folder when an s3 folder is given', () => {
    const result = getContainingDir('s3://bucket/folder/subfolder/');
    expect(result).toBe('s3://bucket/folder/subfolder/');
  });

  it('should remove query string from url', () => {
    const result = getContainingDir('https://www.amazon.com/test/data?q=123&v=abc');
    expect(result).toBe('https://www.amazon.com/test/');
  });

  it('should return a folder when relative path is given', () => {
    const result = getContainingDir('test/abc/def.json');
    expect(result).toBe('test/abc/');
  });

  it('should return empty if the relative path has no containing folder', () => {
    const result = getContainingDir('test.json');
    expect(result).toBe('');
  });
});

describe('parseS3BucketFromArn', () => {
  it('should parse s3 arn correctly', () => {
    const res = parseS3BucketFromArn('arn:aws:s3:::bucketname');
    expect(res).toBe('bucketname');
  });
});

describe('combineUrls', () => {
  it('should merge paths correctly', () => {
    let res = combineUrls('https://example.com/', '/abc/def?q=123');
    expect(res).toBe('https://example.com/abc/def?q=123');

    res = combineUrls('https://example.com', '/abc/def?q=123');
    expect(res).toBe('https://example.com/abc/def?q=123');

    res = combineUrls('/example.com', '/abc/def?q=123');
    expect(res).toBe('/example.com/abc/def?q=123');

    res = combineUrls('/example.com//', '/abc/def?q=123');
    expect(res).toBe('/example.com/abc/def?q=123');

    res = combineUrls('https://example.com', 'abc/def?q=123');
    expect(res).toBe('https://example.com/abc/def?q=123');

    res = combineUrls('https://example.com', '/hdri/');
    expect(res).toBe('https://example.com/hdri/');

    res = combineUrls('https://example.com/', '/hdri/');
    expect(res).toBe('https://example.com/hdri/');
  });
});
