import {
  CreateEntityCommandInput,
  CreateEntityCommandOutput,
  DeleteEntityCommandInput,
  DeleteEntityCommandOutput,
  ExecuteQueryCommandInput,
  ExecuteQueryCommandOutput,
  GetEntityCommandInput,
  GetEntityCommandOutput,
  GetPropertyValueCommandInput,
  GetPropertyValueCommandOutput,
  GetPropertyValueHistoryCommandInput,
  GetPropertyValueHistoryCommandOutput,
  GetSceneCommandInput,
  GetSceneCommandOutput,
  IoTTwinMakerClient,
  ListEntitiesCommandInput,
  ListEntitiesCommandOutput,
  UpdateEntityCommandInput,
  UpdateEntityCommandOutput,
  UpdateSceneCommandInput,
  UpdateSceneCommandOutput,
} from '@aws-sdk/client-iottwinmaker';
import { SceneInfo } from '../types';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export const createMockTwinMakerSDK = ({
  getEntity = nonOverriddenMock,
  createEntity = nonOverriddenMock,
  updateEntity = nonOverriddenMock,
  deleteEntity = nonOverriddenMock,
  getPropertyValueHistory = nonOverriddenMock,
  getPropertyValue = nonOverriddenMock,
  getScene = nonOverriddenMock,
  listEntities = nonOverriddenMock,
  updateScene = nonOverriddenMock,
  executeQuery = nonOverriddenMock,
  createScene = nonOverriddenMock,
}: {
  getEntity?: (input: GetEntityCommandInput) => Promise<GetEntityCommandOutput>;
  createEntity?: (input: CreateEntityCommandInput) => Promise<CreateEntityCommandOutput>;
  updateEntity?: (input: UpdateEntityCommandInput) => Promise<UpdateEntityCommandOutput>;
  deleteEntity?: (input: DeleteEntityCommandInput) => Promise<DeleteEntityCommandOutput>;
  getPropertyValueHistory?: (
    input: GetPropertyValueHistoryCommandInput
  ) => Promise<GetPropertyValueHistoryCommandOutput>;
  getPropertyValue?: (
    input: GetPropertyValueCommandInput
  ) => Promise<GetPropertyValueCommandOutput>;
  getScene?: (input: GetSceneCommandInput) => Promise<GetSceneCommandOutput>;
  listEntities?: (input: ListEntitiesCommandInput) => Promise<ListEntitiesCommandOutput>;
  updateScene?: (input: UpdateSceneCommandInput) => Promise<UpdateSceneCommandOutput>;
  executeQuery?: (input: ExecuteQueryCommandInput) => Promise<ExecuteQueryCommandOutput>;
  createScene?: (input: SceneInfo) => Promise<void>;
} = {}) =>
  ({
    send: (command: { input: any }) => {
      // Mocks out the process of a sending a command within the JS AWS-SDK v3, learn more at
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#high-level-concepts
      const commandName = command.constructor.name;

      switch (commandName) {
        case 'GetEntityCommand':
          return getEntity(command.input);
        case 'UpdateEntityCommand':
          return updateEntity(command.input);
        case 'DeleteEntityCommand':
          return deleteEntity(command.input);
        case 'CreateEntityCommand':
          return createEntity(command.input);
        case 'GetPropertyValueHistoryCommand':
          return getPropertyValueHistory(command.input);
        case 'GetPropertyValueCommand':
          return getPropertyValue(command.input);
        case 'GetSceneCommand':
          return getScene(command.input);
        case 'ListEntitiesCommand':
          return listEntities(command.input);
        case 'UpdateSceneCommand':
          return updateScene(command.input);
        case 'ExecuteQueryCommand':
          return executeQuery(command.input);
        case 'CreateSceneCommand':
          return createScene(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock IotTwinMaker SDK.`
          );
      }
    },
  } as unknown as IoTTwinMakerClient);
