import { handler, Options } from './nuke';
import { Arguments } from 'yargs';
import { mockClient } from 'aws-sdk-client-mock';
import * as prompts from 'prompts';
import {
  DeleteComponentTypeCommand,
  DeleteEntityCommand,
  DeleteSceneCommand,
  GetWorkspaceCommand,
  IoTTwinMakerClient,
  ListComponentTypesCommand,
  ListEntitiesCommand,
  ListScenesCommand,
  ResourceNotFoundException,
} from '@aws-sdk/client-iottwinmaker';
import {
  emptyListComponentTypesResp,
  emptyListEntitiesResp,
  emptyListScenesResp,
  getComponentType1Resp,
  getEntity1Resp,
  oneCtListComponentTypesResp,
  oneEntityListEntitiesResp,
  oneSceneListScenesResp,
} from './test-constants';
import { workspaceId } from './test-utils';

const twinmakerMock = mockClient(IoTTwinMakerClient);

beforeEach(() => {
  twinmakerMock.reset();
});

it('throws error when given workspace that does not exist', async () => {
  twinmakerMock.on(GetWorkspaceCommand).rejects(new ResourceNotFoundException({ $metadata: {}, message: '' }));

  const argv2 = {
    _: ['nuke'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': 'non-existent',
  } as Arguments<Options>;
  await expect(handler(argv2)).rejects.toThrow(ResourceNotFoundException);
});

it("exits without deleting anything when not given 'Y' input", async () => {
  prompts.inject(['n']);
  twinmakerMock.on(GetWorkspaceCommand).resolves({});

  const argv2 = {
    _: ['nuke'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(0);
});

it('deletes nothing when given an empty workspace', async () => {
  prompts.inject(['Y']);
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock.on(ListComponentTypesCommand).resolves(emptyListComponentTypesResp);
  twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
  twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

  const argv2 = {
    _: ['nuke'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(0);
});

it('deletes 1 entity when given a workspace with 1 entity', async () => {
  prompts.inject(['Y']);
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock.on(ListComponentTypesCommand).resolves(emptyListComponentTypesResp);
  twinmakerMock.on(ListEntitiesCommand).resolvesOnce(oneEntityListEntitiesResp).resolves(emptyListEntitiesResp);
  twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

  const argv2 = {
    _: ['nuke'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(DeleteEntityCommand)[0].args[0].input).toStrictEqual({
    workspaceId: workspaceId,
    entityId: getEntity1Resp.entityId,
    isRecursive: true,
  });
  expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(0);
});

it('deletes 1 component type when given a workspace with 1 component type', async () => {
  prompts.inject(['Y']);
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock
    .on(ListComponentTypesCommand)
    .resolvesOnce(oneCtListComponentTypesResp)
    .resolves(emptyListComponentTypesResp);
  twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
  twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

  const argv2 = {
    _: ['nuke'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand)[0].args[0].input).toStrictEqual({
    workspaceId: workspaceId,
    componentTypeId: getComponentType1Resp.componentTypeId,
  });
  expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(0);
});

it('deletes 1 scene when given a workspace with 1 scene', async () => {
  prompts.inject(['Y']);
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock.on(ListComponentTypesCommand).resolves(emptyListComponentTypesResp);
  twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
  twinmakerMock.on(ListScenesCommand).resolvesOnce(oneSceneListScenesResp).resolves(emptyListScenesResp);

  const argv2 = {
    _: ['nuke'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(DeleteSceneCommand)[0].args[0].input).toStrictEqual({
    workspaceId: workspaceId,
    sceneId: oneSceneListScenesResp.sceneSummaries![0].sceneId,
  });
});

it('deletes all twinmaker resources when given a populated workspace', async () => {
  prompts.inject(['Y']);
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock
    .on(ListComponentTypesCommand)
    .resolvesOnce(oneCtListComponentTypesResp)
    .resolves(emptyListComponentTypesResp);
  twinmakerMock.on(ListEntitiesCommand).resolvesOnce(oneEntityListEntitiesResp).resolves(emptyListEntitiesResp);
  twinmakerMock.on(ListScenesCommand).resolvesOnce(oneSceneListScenesResp).resolves(emptyListScenesResp);

  const argv2 = {
    _: ['nuke'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(DeleteEntityCommand)[0].args[0].input).toStrictEqual({
    workspaceId: workspaceId,
    entityId: getEntity1Resp.entityId,
    isRecursive: true,
  });
  expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand)[0].args[0].input).toStrictEqual({
    workspaceId: workspaceId,
    componentTypeId: getComponentType1Resp.componentTypeId,
  });
  expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(DeleteSceneCommand)[0].args[0].input).toStrictEqual({
    workspaceId: workspaceId,
    sceneId: oneSceneListScenesResp.sceneSummaries![0].sceneId,
  });
});
