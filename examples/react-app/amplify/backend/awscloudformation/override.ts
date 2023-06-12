import { AmplifyRootStackTemplate } from '@aws-amplify/cli-extensibility-helper';
import { CfnRole } from 'aws-cdk-lib/aws-iam';

const TwinMakerPolicy: CfnRole.PolicyProperty = {
  policyName: "amplify-permissions-twinmaker",
  policyDocument: {
      Version: "2012-10-17",
      Statement: [
          {
              "Action": [
                  "iottwinmaker:*",
                  "s3:*",
                  "iotsitewise:*",
                  "kinesisvideo:*",
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
};

export function override(resources: AmplifyRootStackTemplate) {
  const authRole = resources.authRole;

  if (authRole) {
    const basePolicies = Array.isArray(authRole.policies)
      ? authRole.policies
      : [authRole.policies];

    resources.authRole.policies = [
      ...basePolicies,
      TwinMakerPolicy,
    ];
  }
}
