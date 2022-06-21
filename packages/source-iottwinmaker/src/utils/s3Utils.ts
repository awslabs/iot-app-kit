export const S3Protocol = 's3:';
export const S3Prefix = `${S3Protocol}//`;

export const getS3BucketAndKey = (uri: string): { Bucket: string; Key: string } | undefined => {
  if (!uri.startsWith(S3Prefix)) {
    return undefined;
  }

  uri = uri.substring(S3Prefix.length);
  const slashIndex = uri.indexOf('/');
  if (slashIndex < 0) {
    return undefined;
  }

  return {
    Bucket: uri.substring(0, slashIndex),
    Key: uri.substring(slashIndex + 1),
  };
};
