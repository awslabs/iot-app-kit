import { Arguments } from 'yargs';
import { workspaceId, s3BucketArn, s3ContentLocationBase, workspaceBucket } from './test-utils';
import { mockClient } from 'aws-sdk-client-mock';
import {
  CreateComponentTypeCommand,
  CreateEntityCommand,
  CreateSceneCommand,
  GetComponentTypeCommand,
  GetEntityCommand,
  GetWorkspaceCommand,
  IoTTwinMakerClient,
  ResourceNotFoundException,
} from '@aws-sdk/client-iottwinmaker';
import { emptyTmdk, componentType1Definition, scene1, entity1Definition } from './test-constants';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as fsPromises from 'fs/promises';
import { handler, Options } from './deploy';
import * as fs from 'fs';

jest.mock('fs', () => ({
  __esModule: true, // Use it when dealing with esModules
  ...jest.requireActual('fs'),
}));
jest.mock('fs/promises', () => {
  return { readFile: jest.fn() };
});
const twinmakerMock = mockClient(IoTTwinMakerClient);
const s3Mock = mockClient(S3Client);
const fakeTmdkDir = '/tmp/deploy-unit-tests';

beforeEach(() => {
  twinmakerMock.reset();
  s3Mock.reset();
  jest.resetAllMocks();
});

it('throws error when given tmdk project that does not exist', async () => {
  const argv2 = {
    _: ['deploy'],
    $0: 'tmdk_local',
    region: 'us-east-1',
    'workspace-id': 'irrelevant',
    dir: 'i-do-not-exist',
  } as Arguments<Options>;
  await expect(handler(argv2)).rejects.toThrow(Error('TDMK.json does not exist. Please run tmdk init first.'));
});

it('throws error when given workspace that does not exist', async () => {
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({}, null, 4));
  twinmakerMock.on(GetWorkspaceCommand).rejects(new ResourceNotFoundException({ $metadata: {}, message: '' }));

  const argv2 = {
    _: ['init'],
    $0: 'tmdk_local',
    region: 'us-east-1',
    'workspace-id': 'non-existent',
    dir: fakeTmdkDir,
  } as Arguments<Options>;
  await expect(handler(argv2)).rejects.toThrow(ResourceNotFoundException);
});

it('deploys nothing when given an empty tmdk project', async () => {
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdk')) {
      return JSON.stringify(emptyTmdk, null, 4);
    } else {
      // covers entities.json
      return JSON.stringify([], null, 4);
    }
  });
  twinmakerMock.on(GetWorkspaceCommand).resolves({});

  const argv2 = {
    _: ['init'],
    $0: 'tmdk_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdkDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(0);
});

it('deploys successfully when given a tmdk project with one component type', async () => {
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdk')) {
      const tmdk1Ct = JSON.parse(JSON.stringify(emptyTmdk));
      tmdk1Ct['component_types'] = ['componentType1.json'];
      return JSON.stringify(tmdk1Ct, null, 4);
    } else if (path.includes('componentType1.json')) {
      return JSON.stringify(componentType1Definition, null, 4);
    } else {
      // covers entities.json
      return JSON.stringify([], null, 4);
    }
  });
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock
    .on(GetComponentTypeCommand)
    .rejectsOnce(new ResourceNotFoundException({ $metadata: {}, message: '' }))
    .resolves({});

  const argv2 = {
    _: ['init'],
    $0: 'tmdk_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdkDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand)[0].args[0].input).toStrictEqual({
    workspaceId: workspaceId,
    ...componentType1Definition,
  });
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(0);
});

it('deploys successfully when given a tmdk project with one scene with one model', async () => {
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdk')) {
      const tmdk1SceneAndModel = JSON.parse(JSON.stringify(emptyTmdk));
      tmdk1SceneAndModel['scenes'] = ['scene1.json'];
      tmdk1SceneAndModel['models'] = ['model1.glb'];
      return JSON.stringify(tmdk1SceneAndModel, null, 4);
    } else {
      // covers entities.json
      return JSON.stringify([], null, 4);
    }
  });
  jest.spyOn(fsPromises, 'readFile').mockImplementation(async (path) => {
    if (path.toString().includes('scene1')) {
      return Promise.resolve(JSON.stringify(scene1, null, 4));
    } else {
      return Promise.resolve('empty readFile result');
    }
  });
  twinmakerMock.on(GetWorkspaceCommand).resolves({
    s3Location: s3BucketArn,
  });

  const argv2 = {
    _: ['init'],
    $0: 'tmdk_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdkDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(CreateSceneCommand)[0].args[0].input).toStrictEqual({
    workspaceId: workspaceId,
    sceneId: 'scene1',
    contentLocation: `${s3ContentLocationBase}scene1.json`,
  });
  expect(s3Mock.commandCalls(PutObjectCommand).length).toBe(2);
  expect(s3Mock.commandCalls(PutObjectCommand)[0].args[0].input).toStrictEqual({
    Bucket: workspaceBucket,
    Key: 'scene1.json',
    ContentType: 'application/json',
    Body: expect.anything(),
  });
  expect(s3Mock.commandCalls(PutObjectCommand)[1].args[0].input).toStrictEqual({
    Bucket: workspaceBucket,
    Key: 'model1.glb',
    Body: expect.anything(),
  });
});

it('deploys successfully when given a tmdk project with one entity', async () => {
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdk')) {
      const tmdk1Ct = JSON.parse(JSON.stringify(emptyTmdk));
      tmdk1Ct['entities'] = 'entities.json';
      return JSON.stringify(tmdk1Ct, null, 4);
    } else if (path.includes('entities.json')) {
      return JSON.stringify([entity1Definition], null, 4);
    } else {
      // covers entities.json
      return JSON.stringify([], null, 4);
    }
  });
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock
    .on(GetEntityCommand)
    .rejectsOnce(new ResourceNotFoundException({ $metadata: {}, message: '' }))
    .resolves({});

  const argv2 = {
    _: ['init'],
    $0: 'tmdk_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdkDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(CreateEntityCommand)[0].args[0].input).toStrictEqual({
    workspaceId: workspaceId,
    isProcessed: true,
    ...entity1Definition,
  });
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(0);
});
