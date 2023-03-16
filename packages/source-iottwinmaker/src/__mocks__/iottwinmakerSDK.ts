import { GetEntityCommandInput, GetEntityCommandOutput, GetPropertyValueHistoryCommandInput, GetPropertyValueHistoryCommandOutput, IoTTwinMakerClient, ListEntitiesCommandInput, ListEntitiesCommandOutput } from '@aws-sdk/client-iottwinmaker';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export const createMockTwinMakerSDK = ({
  getEntity = nonOverriddenMock,
  getPropertyValueHistory = nonOverriddenMock,
  listEntities = nonOverriddenMock,
}: {
  getEntity?: (input: GetEntityCommandInput) => Promise<GetEntityCommandOutput>;
  getPropertyValueHistory?: (input: GetPropertyValueHistoryCommandInput) => Promise<GetPropertyValueHistoryCommandOutput>;
  listEntities?: (input: ListEntitiesCommandInput) => Promise<ListEntitiesCommandOutput>;
} = {}) =>
  ({
    send: (command: { input: any }) => {
      // Mocks out the process of a sending a command within the JS AWS-SDK v3, learn more at
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#high-level-concepts
      const commandName = command.constructor.name;

      switch (commandName) {
        case 'GetEntityCommand':
          return getEntity(command.input);
        case 'GetPropertyValueHistoryCommand':
          return getPropertyValueHistory(command.input);
        case 'ListEntitiesCommand':
          return listEntities(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock IotTwinMaker SDK.`
          );
      }
    },
  } as unknown as IoTTwinMakerClient);
