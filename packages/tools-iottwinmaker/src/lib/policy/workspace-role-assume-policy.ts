export const getWorkspaceRoleAssumePolicy = (isGamma: boolean) => {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: [
            isGamma
              ? 'iottwinmaker.aws.internal'
              : 'iottwinmaker.amazonaws.com',
          ],
        },
        Action: 'sts:AssumeRole',
      },
    ],
  };
};
