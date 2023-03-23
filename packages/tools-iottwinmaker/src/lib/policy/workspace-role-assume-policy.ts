export const WORKSPACE_ROLE_ASSUME_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {
        Service: ['iottwinmaker.amazonaws.com'],
      },
      Action: 'sts:AssumeRole',
    },
  ],
};
