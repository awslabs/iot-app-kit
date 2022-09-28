import { getS3BucketAndKey, parseS3BucketFromArn, parseS3RelativeScenePathFromURI } from './s3Utils';

describe('getS3BucketAndKey', () => {
  it('should return s3 bucket & key successful', async () => {
    const result = getS3BucketAndKey('s3://my-bucket-name/mypath1/mypath2/filename.ext');
    expect(result?.Bucket).toBe('my-bucket-name');
    expect(result?.Key).toBe('mypath1/mypath2/filename.ext');
  });

  it('should return undefined if not in S3 protocol', async () => {
    const result = getS3BucketAndKey('/my-bucket-name/mypath1/mypath2/filename.ext');
    expect(result).toBe(undefined);
  });

  it('should return s3 bucket & key successful', async () => {
    const result = getS3BucketAndKey('s3://filename.ext');

    expect(result).toBe(undefined);
  });
});

describe('parseS3BucketFromArn', () => {
  it('should parse s3 arn correctly', () => {
    const res = parseS3BucketFromArn('arn:aws:s3:::bucketname');
    expect(res).toBe('bucketname');
  });
});

describe('parseS3RelativeScenePathFromURI', () => {
  it('should return  result for s3 path', async () => {
    const uri = 's3://workspaceBucket/scene/name.gltf';
    const expected = 'scene/name.gltf';

    const result = parseS3RelativeScenePathFromURI(uri);
    expect(result).toEqual(expected);
  });
  it('should return  result for s3 path', async () => {
    const uri = 's3://workspaceBucket/name.gltf';
    const expected = 'name.gltf';

    const result = parseS3RelativeScenePathFromURI(uri);
    expect(result).toEqual(expected);
  });
});
