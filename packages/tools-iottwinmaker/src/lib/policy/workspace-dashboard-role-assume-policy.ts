export const WORKSPACE_DASHBOARD_ROLE_ASSUME_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {
        AWS: '{dashboardRoleAssumedByArn}',
      },
      Action: 'sts:AssumeRole',
    },
  ],
};
