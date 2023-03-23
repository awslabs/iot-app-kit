export const workspaceRolePolicyTemplate = {
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
      Resource: ['{workspaceS3BucketArn}', '{workspaceS3BucketArn}/*'],
    },
    {
      Effect: 'Allow',
      Action: ['s3:DeleteObject'],
      Resource: ['{workspaceS3BucketArn}/DO_NOT_DELETE_WORKSPACE_*'],
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
