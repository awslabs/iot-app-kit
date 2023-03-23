export const workspaceDashboardRolePolicyTemplate = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: ['s3:GetObject'],
      Resource: ['{workspaceS3BucketArn}', '{workspaceS3BucketArn}/*'],
    },
    {
      Effect: 'Allow',
      Action: ['iottwinmaker:Get*', 'iottwinmaker:List*'],
      Resource: ['{workspaceArn}', '{workspaceArn}/*'],
    },
    {
      Effect: 'Allow',
      Action: 'iottwinmaker:ListWorkspaces',
      Resource: '*',
    },
  ],
};
