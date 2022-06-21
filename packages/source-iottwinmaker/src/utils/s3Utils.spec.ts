import { getS3BucketAndKey } from './s3Utils';

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
