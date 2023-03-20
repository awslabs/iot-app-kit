import { ListSecretsCommandInput, ListSecretsCommandOutput, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export const createMockSecretsManagerSDK = ({
  listSecrets = nonOverriddenMock,
}: {
  listSecrets?: (input: ListSecretsCommandInput) => Promise<ListSecretsCommandOutput>;
} = {}) =>
  ({
    send: (command: { input: any }) => {
      // Mocks out the process of a sending a command within the JS AWS-SDK v3, learn more at
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#high-level-concepts
      const commandName = command.constructor.name;

      switch (commandName) {
        case 'ListSecretsCommand':
          return listSecrets(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock SecretsManager SDK.`
          );
      }
    },
  } as unknown as SecretsManagerClient);
