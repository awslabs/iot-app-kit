import {
  GetComponentTypeCommand,
  GetEntityCommand,
  GetWorkspaceCommand,
  IoTTwinMakerClient,
  ListComponentTypesCommand,
  ListEntitiesCommand,
  ListScenesCommand,
  ResourceNotFoundException,
} from '@aws-sdk/client-iottwinmaker';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { type SdkStream } from '@aws-sdk/types';
import { mockClient } from 'aws-sdk-client-mock';
import * as fs from 'fs';
import { type Arguments } from 'yargs';
import { streamToBuffer } from '../lib/stream-to-buffer';
import { handler, type Options } from './init';
import {
  componentType1Definition,
  emptyListComponentTypesResp,
  emptyListEntitiesResp,
  emptyListScenesResp,
  entity1Definition,
  getComponentType1Resp,
  getEntity1Resp,
  oneCtListComponentTypesResp,
  oneEntityListEntitiesResp,
  oneSceneListScenesResp,
  scene1,
} from './test-constants';
import { fakeModelData, workspaceId } from './test-utils';

vi.mock('fs', async () => ({
  __esModule: true, // Use it when dealing with esModules
  ...(await vi.importActual('fs')),
}));

vi.mock('../lib/stream-to-buffer', async () => {
  const originalModule = await vi.importActual('../lib/stream-to-buffer');
  return {
    __esModule: true,
    ...originalModule,
    streamToBuffer: vi.fn(() => 'mock'),
  };
});

const outDir = '/tmp/init-unit-tests';
const twinmakerMock = mockClient(IoTTwinMakerClient);
const s3Mock = mockClient(S3Client);

beforeEach(() => {
  s3Mock.reset();
  twinmakerMock.reset();
  vi.spyOn(fs, 'writeFileSync');
  vi.spyOn(fs, 'createWriteStream');
});

it('throws error when given tmdt project that does not exist', async () => {
  twinmakerMock
    .on(GetWorkspaceCommand)
    .rejects(new ResourceNotFoundException({ $metadata: {}, message: '' }));

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': 'non-existent',
    out: outDir,
  } as Arguments<Options>;
  await expect(handler(argv2)).rejects.toThrow(ResourceNotFoundException);
});

it('creates an empty tmdt project when given no twinmaker resources', async () => {
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock
    .on(ListComponentTypesCommand)
    .resolves(emptyListComponentTypesResp);
  twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
  twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    out: outDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  const expectedTmdt = {
    version: '0.0.2',
    component_types: [],
    scenes: [],
    models: [],
    entities: 'entities.json',
  };
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/tmdt.json`,
    JSON.stringify(expectedTmdt, null, 4)
  );
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/entities.json`,
    JSON.stringify([], null, 4)
  );
});

it('creates a tmdt project with one component type when given one component type', async () => {
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock
    .on(ListComponentTypesCommand)
    .resolves(oneCtListComponentTypesResp);
  twinmakerMock.on(GetComponentTypeCommand).resolves(getComponentType1Resp);
  twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
  twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    out: outDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  const expectedTmdt = {
    version: '0.0.2',
    component_types: [`${getComponentType1Resp['componentTypeId']}.json`],
    scenes: [],
    models: [],
    entities: 'entities.json',
  };

  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/tmdt.json`,
    JSON.stringify(expectedTmdt, null, 4)
  );
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/entities.json`,
    JSON.stringify([], null, 4)
  );
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/${getComponentType1Resp['componentTypeId']}.json`,
    JSON.stringify(componentType1Definition, null, 4)
  );
});

it('creates a tmdt project with one model and one scene when given one scene and model', async () => {
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock
    .on(ListComponentTypesCommand)
    .resolves(emptyListComponentTypesResp);
  twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
  twinmakerMock.on(ListScenesCommand).resolves(oneSceneListScenesResp);
  const filePipeMock = vi.fn();
  const s3ResponseBodyMock = (content: string) => {
    return {
      transformToString: () => {
        return Promise.resolve(content);
      },
      pipe: filePipeMock,
    } as unknown as SdkStream<Blob>;
  };

  s3Mock
    .on(GetObjectCommand, { Bucket: 'workspace-bucket', Key: 'scene1.json' })
    .resolves({
      $metadata: {},
      Body: s3ResponseBodyMock(JSON.stringify(scene1, null, 4)),
    });
  s3Mock
    .on(GetObjectCommand, { Bucket: 'workspace-bucket', Key: 'model1.glb' })
    .resolves({
      $metadata: {},
      Body: s3ResponseBodyMock(fakeModelData),
    });

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    out: outDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  const expectedTmdt = {
    version: '0.0.2',
    component_types: [],
    scenes: ['scene1.json'],
    models: ['model1.glb'],
    entities: 'entities.json',
  };

  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/tmdt.json`,
    JSON.stringify(expectedTmdt, null, 4)
  );
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/entities.json`,
    JSON.stringify([], null, 4)
  );
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/scene1.json`,
    JSON.stringify(scene1, null, 4)
  );
  expect(filePipeMock).toBeCalledTimes(1);
});

it('creates a tmdt project with one entity when given one entity', async () => {
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock
    .on(ListComponentTypesCommand)
    .resolves(emptyListComponentTypesResp);
  twinmakerMock.on(ListEntitiesCommand).resolves(oneEntityListEntitiesResp);
  twinmakerMock.on(GetEntityCommand).resolves(getEntity1Resp);
  twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    out: outDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  const expectedTmdt = {
    version: '0.0.2',
    component_types: [],
    scenes: [],
    models: [],
    entities: 'entities.json',
  };
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/tmdt.json`,
    JSON.stringify(expectedTmdt, null, 4)
  );
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/entities.json`,
    JSON.stringify([entity1Definition], null, 4)
  );
});

it('creates a fully populated tmdt project when given a full workspace', async () => {
  twinmakerMock.on(GetWorkspaceCommand).resolves({});
  twinmakerMock
    .on(ListComponentTypesCommand)
    .resolves(oneCtListComponentTypesResp);
  twinmakerMock.on(GetComponentTypeCommand).resolves(getComponentType1Resp);
  twinmakerMock.on(ListEntitiesCommand).resolves(oneEntityListEntitiesResp);
  twinmakerMock.on(GetEntityCommand).resolves(getEntity1Resp);
  twinmakerMock.on(ListScenesCommand).resolves(oneSceneListScenesResp);
  const filePipeMock = vi.fn();
  const s3ResponseBodyMock = (content: string) => {
    return {
      transformToString: () => {
        return Promise.resolve(content);
      },
      pipe: filePipeMock,
    } as unknown as SdkStream<Blob>;
  };

  s3Mock
    .on(GetObjectCommand, { Bucket: 'workspace-bucket', Key: 'scene1.json' })
    .resolves({
      $metadata: {},
      Body: s3ResponseBodyMock(JSON.stringify(scene1, null, 4)),
    });
  s3Mock
    .on(GetObjectCommand, { Bucket: 'workspace-bucket', Key: 'model1.glb' })
    .resolves({
      $metadata: {},
      Body: s3ResponseBodyMock(fakeModelData),
    });
  expect(
    streamToBuffer({
      transformToString: () => {
        return Promise.resolve(JSON.stringify(scene1, null, 4));
      },
    } as SdkStream<Blob>)
  ).toEqual('mock');

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    out: outDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  const expectedTmdt = {
    version: '0.0.2',
    component_types: [`${getComponentType1Resp['componentTypeId']}.json`],
    scenes: ['scene1.json'],
    models: ['model1.glb'],
    entities: 'entities.json',
  };

  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/tmdt.json`,
    JSON.stringify(expectedTmdt, null, 4)
  );
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/entities.json`,
    JSON.stringify([entity1Definition], null, 4)
  );
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/${getComponentType1Resp['componentTypeId']}.json`,
    JSON.stringify(componentType1Definition, null, 4)
  );
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    `${outDir}/scene1.json`,
    JSON.stringify(scene1, null, 4)
  );
  expect(filePipeMock).toBeCalledTimes(1);
});
