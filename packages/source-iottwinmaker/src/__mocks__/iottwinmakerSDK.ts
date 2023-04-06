import { GetEntityCommandInput, GetEntityCommandOutput, GetPropertyValueHistoryCommandInput, GetPropertyValueHistoryCommandOutput, GetSceneCommandInput, GetSceneCommandOutput, IoTTwinMakerClient, ListEntitiesCommandInput, ListEntitiesCommandOutput, UpdateSceneCommandInput, UpdateSceneCommandOutput } from '@aws-sdk/client-iottwinmaker';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export const createMockTwinMakerSDK = ({
  getEntity = nonOverriddenMock,
  getPropertyValueHistory = nonOverriddenMock,
  getScene = nonOverriddenMock,
  listEntities = nonOverriddenMock,
  updateScene = nonOverriddenMock,
}: {
  getEntity?: (input: GetEntityCommandInput) => Promise<GetEntityCommandOutput>;
  getPropertyValueHistory?: (input: GetPropertyValueHistoryCommandInput) => Promise<GetPropertyValueHistoryCommandOutput>;
  getScene?: (input: GetSceneCommandInput) => Promise<GetSceneCommandOutput>;
  listEntities?: (input: ListEntitiesCommandInput) => Promise<ListEntitiesCommandOutput>;
  updateScene?: (input: UpdateSceneCommandInput) => Promise<UpdateSceneCommandOutput>;
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
        case 'GetSceneCommand':
          return getScene(command.input);
        case 'ListEntitiesCommand':
          return listEntities(command.input);
        case 'UpdateSceneCommand':
          return updateScene(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock IotTwinMaker SDK.`
          );
      }
    },
  } as unknown as IoTTwinMakerClient);
