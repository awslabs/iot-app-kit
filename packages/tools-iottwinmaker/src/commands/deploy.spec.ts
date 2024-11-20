import {
  AttachRolePolicyCommand,
  CreatePolicyCommand,
  CreateRoleCommand,
  GetRoleCommand,
  IAMClient,
  NoSuchEntityException,
} from '@aws-sdk/client-iam';
import {
  CreateComponentTypeCommand,
  CreateEntityCommand,
  CreateSceneCommand,
  CreateWorkspaceCommand,
  GetComponentTypeCommand,
  GetEntityCommand,
  GetWorkspaceCommand,
  IoTTwinMakerClient,
  ResourceNotFoundException,
} from '@aws-sdk/client-iottwinmaker';
import {
  CreateBucketCommand,
  PutBucketAclCommand,
  PutBucketCorsCommand,
  PutBucketEncryptionCommand,
  PutBucketPolicyCommand,
  PutBucketVersioningCommand,
  PutObjectCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { mockClient } from 'aws-sdk-client-mock';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as prompts from 'prompts';
import { type Arguments } from 'yargs';
import { handler, type Options } from './deploy';
import {
  componentType1Definition,
  componentTypeWithDefaultValue,
  componentTypeWithInheritedProperty,
  emptyTmdt,
  entity1Definition,
  fakePolicy,
  fakeRole,
  modifiedComponentTypeWithDefaultValue,
  modifiedComponentTypeWithInheritedProperty,
  scene1,
} from './test-constants';
import {
  s3BucketArn,
  s3ContentLocationBase,
  workspaceBucket,
  workspaceId,
} from './test-utils';

vi.mock('fs', async () => ({
  __esModule: true, // Use it when dealing with esModules
  ...(await vi.importActual('fs')),
}));
vi.mock('fs/promises', () => {
  return { readFile: vi.fn() };
});
const twinmakerMock = mockClient(IoTTwinMakerClient);
const s3Mock = mockClient(S3Client);
const iamMock = mockClient(IAMClient);
const stsMock = mockClient(STSClient);
const fakeTmdtDir = '/tmp/deploy-unit-tests';

const emptyProjectSpy = () => {
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  vi.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdt')) {
      return JSON.stringify(emptyTmdt, null, 4);
    } else {
      // covers entities.json
      return JSON.stringify([], null, 4);
    }
  });
};

const mockCallsForWorkspaceDoesNotExist = () => {
  stsMock
    .on(GetCallerIdentityCommand)
    .resolves({ Account: 'fakeAccountId', Arn: 'fakeAccountArn' });
  twinmakerMock
    .on(GetWorkspaceCommand)
    .rejectsOnce(new ResourceNotFoundException({ $metadata: {}, message: '' }))
    .rejectsOnce(new ResourceNotFoundException({ $metadata: {}, message: '' }))
    .resolves({ workspaceId: 'fakeId' });
  s3Mock.on(CreateBucketCommand).resolves({ Location: 'fakeLocation' });
  s3Mock.on(PutBucketVersioningCommand).resolves({});
  s3Mock.on(PutBucketPolicyCommand).resolves({});
  s3Mock.on(PutPublicAccessBlockCommand).resolves({});
  s3Mock.on(PutBucketEncryptionCommand).resolves({});
  s3Mock.on(PutBucketAclCommand).resolves({});
  s3Mock.on(PutBucketCorsCommand).resolves({});
  twinmakerMock.on(CreateWorkspaceCommand).resolves({ arn: '*' });
  iamMock.on(CreateRoleCommand).resolves({ Role: fakeRole });
  iamMock.on(CreatePolicyCommand).resolves({ Policy: fakePolicy });
  iamMock.on(AttachRolePolicyCommand).resolves({});
};

beforeEach(() => {
  twinmakerMock.reset();
  s3Mock.reset();
  iamMock.reset();
  vi.resetAllMocks();
});

it('throws error when given tmdt project that does not exist', async () => {
  const argv2 = {
    _: ['deploy'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': 'irrelevant',
    dir: 'i-do-not-exist',
  } as Arguments<Options>;
  await expect(handler(argv2)).rejects.toThrow(
    Error('TDMK.json does not exist. Please run tmdt init first.')
  );
});

it('throws error when user provided execution role does not exist', async () => {
  emptyProjectSpy();

  prompts.inject(['Y']);

  mockCallsForWorkspaceDoesNotExist();
  const error = new NoSuchEntityException({ $metadata: {}, message: '' });
  iamMock.on(GetRoleCommand).rejects(error);

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': 'non-existent',
    dir: fakeTmdtDir,
    'execution-role': 'role-name-does-not-exist',
  } as Arguments<Options>;
  await expect(handler(argv2)).rejects.toThrow(error);
});

it('deploys nothing when given an empty tmdt project', async () => {
  emptyProjectSpy();
  twinmakerMock.on(GetWorkspaceCommand).resolves({});

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdtDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(0);
});

it('creates new workspace when given workspace that does not exist and user prompts to create new one', async () => {
  emptyProjectSpy();

  prompts.inject(['Y']);

  mockCallsForWorkspaceDoesNotExist();
  iamMock
    .on(GetRoleCommand)
    .rejects(new NoSuchEntityException({ $metadata: {}, message: '' }));

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': 'non-existent',
    dir: fakeTmdtDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(s3Mock.commandCalls(CreateBucketCommand).length).toBe(2);
  expect(s3Mock.commandCalls(PutBucketVersioningCommand).length).toBe(2);
  expect(s3Mock.commandCalls(PutBucketPolicyCommand).length).toBe(3);
  expect(s3Mock.commandCalls(PutPublicAccessBlockCommand).length).toBe(2);
  expect(s3Mock.commandCalls(PutBucketEncryptionCommand).length).toBe(2);
  expect(s3Mock.commandCalls(PutBucketAclCommand).length).toBe(0);
  expect(s3Mock.commandCalls(PutBucketCorsCommand).length).toBe(1);
  expect(twinmakerMock.commandCalls(GetWorkspaceCommand).length).toBe(4);
  expect(twinmakerMock.commandCalls(CreateWorkspaceCommand).length).toBe(1);
  expect(iamMock.commandCalls(GetRoleCommand).length).toBe(2);
  expect(iamMock.commandCalls(CreateRoleCommand).length).toBe(2);
  expect(iamMock.commandCalls(CreatePolicyCommand).length).toBe(2);
  expect(iamMock.commandCalls(AttachRolePolicyCommand).length).toBe(2);
});

it('creates new workspace when given workspace that does not exist and a user provided execution role', async () => {
  emptyProjectSpy();

  prompts.inject(['Y']);

  mockCallsForWorkspaceDoesNotExist();
  iamMock
    .on(GetRoleCommand)
    .resolvesOnce({
      Role: {
        Path: 'fakePath',
        RoleName: 'fakeRoleName',
        RoleId: 'fakeRoleId',
        Arn: 'fakeRoleArn',
        CreateDate: new Date(),
      },
    })
    .rejects(new NoSuchEntityException({ $metadata: {}, message: '' }));

  const argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': 'non-existent',
    dir: fakeTmdtDir,
    'execution-role': 'fakeRoleName',
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(iamMock.commandCalls(GetRoleCommand).length).toBe(2);
  expect(iamMock.commandCalls(CreateRoleCommand).length).toBe(1);
  expect(iamMock.commandCalls(CreatePolicyCommand).length).toBe(1);
  expect(iamMock.commandCalls(AttachRolePolicyCommand).length).toBe(1);
});

it('deploys successfully when given a tmdt project with one component type', async () => {
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  vi.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdt')) {
      const tmdt1Ct = JSON.parse(JSON.stringify(emptyTmdt));
      tmdt1Ct['component_types'] = ['componentType1.json'];
      return JSON.stringify(tmdt1Ct, null, 4);
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
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdtDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(1);
  expect(
    twinmakerMock.commandCalls(CreateComponentTypeCommand)[0].args[0].input
  ).toStrictEqual({
    workspaceId: workspaceId,
    ...componentType1Definition,
  });
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(0);
});

it('deploys successfully when given a tmdt project with one scene with one model', async () => {
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  vi.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdt')) {
      const tmdt1SceneAndModel = JSON.parse(JSON.stringify(emptyTmdt));
      tmdt1SceneAndModel['scenes'] = ['scene1.json'];
      tmdt1SceneAndModel['models'] = ['model1.glb'];
      return JSON.stringify(tmdt1SceneAndModel, null, 4);
    } else {
      // covers entities.json
      return JSON.stringify([], null, 4);
    }
  });
  vi.spyOn(fsPromises, 'readFile').mockImplementation(async (path) => {
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
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdtDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(1);
  expect(
    twinmakerMock.commandCalls(CreateSceneCommand)[0].args[0].input
  ).toStrictEqual({
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

it('deploys successfully when given a tmdt project with one entity', async () => {
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  vi.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdt')) {
      const tmdt1Ct = JSON.parse(JSON.stringify(emptyTmdt));
      tmdt1Ct['entities'] = 'entities.json';
      return JSON.stringify(tmdt1Ct, null, 4);
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
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdtDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(1);
  expect(
    twinmakerMock.commandCalls(CreateEntityCommand)[0].args[0].input
  ).toStrictEqual({
    workspaceId: workspaceId,
    isProcessed: true,
    ...entity1Definition,
  });
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(0);
});

it('deploys successfully when a component type has an inherited property by removing inherited values', async () => {
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  vi.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdt')) {
      const tmdt1Ct = JSON.parse(JSON.stringify(emptyTmdt));
      tmdt1Ct['component_types'] = ['componentType2.json'];
      return JSON.stringify(tmdt1Ct, null, 4);
    } else if (path.includes('componentType2.json')) {
      return JSON.stringify(componentTypeWithInheritedProperty, null, 4);
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
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdtDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(1);
  // the expected modifiedComponentType input should have its property removed
  expect(
    twinmakerMock.commandCalls(CreateComponentTypeCommand)[0].args[0].input
  ).toStrictEqual({
    workspaceId: workspaceId,
    ...modifiedComponentTypeWithInheritedProperty,
  });
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(0);
});

it('deploys successfully when a component type has an inherited property with defaultValue by removing inherited values', async () => {
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  vi.spyOn(fs, 'readFileSync').mockImplementation((path) => {
    if (typeof path !== 'string') throw new Error('Not a string');
    if (path.includes('tmdt')) {
      const tmdt1Ct = JSON.parse(JSON.stringify(emptyTmdt));
      tmdt1Ct['component_types'] = ['componentType3.json'];
      return JSON.stringify(tmdt1Ct, null, 4);
    } else if (path.includes('componentType3.json')) {
      return JSON.stringify(componentTypeWithDefaultValue, null, 4);
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
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': workspaceId,
    dir: fakeTmdtDir,
  } as Arguments<Options>;
  expect(await handler(argv2)).toBe(0);
  expect(twinmakerMock.commandCalls(CreateComponentTypeCommand).length).toBe(1);
  // the expected modifiedComponentType input should have the property only contain the defaultValue
  expect(
    twinmakerMock.commandCalls(CreateComponentTypeCommand)[0].args[0].input
  ).toStrictEqual({
    workspaceId: workspaceId,
    ...modifiedComponentTypeWithDefaultValue,
  });
  expect(twinmakerMock.commandCalls(CreateEntityCommand).length).toBe(0);
  expect(twinmakerMock.commandCalls(CreateSceneCommand).length).toBe(0);
});
