export function override(resources) {
  const authRole = resources.authRole;

  if (authRole) {
    const basePolicies = Array.isArray(authRole.policies)
      ? authRole.policies
      : [authRole.policies];

    authRole.policies = [
      ...basePolicies,
      {
        policyName: "amplify-permissions-twinmaker",
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    "Action": [
                        "iottwinmaker:*",
                        "s3:*",
                        "iotsitewise:*",
                        "kinesisvideo:*"
                    ],
                    "Resource": [
                        "*"
                    ],
                    "Effect": "Allow"
                },
                {
                    "Action": [
                        "lambda:invokeFunction"
                    ],
                    "Resource": [
                        "*"
                    ],
                    "Effect": "Allow"
                },
                {
                    "Condition": {
                        "StringEquals": {
                            "iam:PassedToService": "lambda.amazonaws.com"
                        }
                    },
                    "Action": [
                        "iam:PassRole"
                    ],
                    "Resource": [
                        "*"
                    ],
                    "Effect": "Allow"
                }
            ]
        },
    },
    ];
  }
}
