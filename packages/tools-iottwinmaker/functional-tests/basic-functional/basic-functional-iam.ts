export const twinMakerAssumeRolePolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {
        Service: 'iottwinmaker.amazonaws.com',
      },
      Action: 'sts:AssumeRole',
    },
  ],
};

export const twinMakerPermissionPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        's3:GetBucket',
        's3:GetObject',
        's3:ListBucket',
        's3:PutObject',
        's3:ListObjects',
        's3:ListObjectsV2',
        's3:GetBucketLocation',
      ],
      Resource: [
        '__S3_ARN_STAR__', // replaced with workspace bucket
        '__S3_ARN_STANDARD__', // replaced with workspace bucket
      ],
    },
    {
      Effect: 'Allow',
      Action: ['s3:DeleteObject'],
      Resource: [
        '__S3_ARN_FOR_DELETE__', // replaced with workspace bucket
      ],
    },
    {
      Effect: 'Allow',
      Action: 'lambda:InvokeFunction',
      Resource: 'arn:aws:lambda:*:*:function:iottwinmaker-*',
    },
    {
      Effect: 'Allow',
      Action: 'kinesisvideo:DescribeStream',
      Resource: '*',
    },
    {
      Effect: 'Allow',
      Action: [
        'iotsitewise:DescribeAssetModel',
        'iotsitewise:ListAssetModels',
        'iotsitewise:DescribeAsset',
        'iotsitewise:ListAssets',
        'iotsitewise:DescribeAssetProperty',
        'iotsitewise:GetAssetPropertyValue',
        'iotsitewise:GetAssetPropertyValueHistory',
      ],
      Resource: '*',
    },
  ],
};
