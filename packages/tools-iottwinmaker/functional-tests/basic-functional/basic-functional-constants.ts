import * as path from 'path';
import * as os from 'os';
import {
  CreateComponentTypeCommandInput,
  CreateEntityCommandInput,
  CreateSceneCommandInput,
  GetComponentTypeCommandOutput,
} from '@aws-sdk/client-iottwinmaker';

type tmdtDefinition = {
  version: string;
  component_types: string[];
  scenes: string[];
  models: string[];
  entities: string;
};

type entityDefinition = {
  components: GetComponentTypeCommandOutput[];
  description: string;
  entityName: string;
  parentEntityId: string;
};

export const localResourcesDir: string = path.join(__dirname, 'basic-functional-resources');
export const timestamp: number = Date.now() % 10000;
export const workspaceId = `tmdt-functional-test-workspace-${timestamp}`;
export const region = 'us-east-1';
export const tmdtDirectory: string = path.join(os.tmpdir(), 'functional-tmdt-test');
export const tmdtFile = 'tmdt.json';
export const entitiesFile = 'entities.json';

export const componentType1Input: CreateComponentTypeCommandInput = {
  workspaceId: workspaceId,
  componentTypeId: 'testComponentType1',
};

export const componentType2Name = 'testComponentType2';
export const componentType2: CreateComponentTypeCommandInput = {
  workspaceId: workspaceId,
  componentTypeId: 'testComponentType2',
};

export const scene1FileName = 'testScene1.json';
export const scene2FileName = 'testScene2.json';

export const scene1Input: CreateSceneCommandInput = {
  workspaceId: workspaceId,
  sceneId: 'testScene1',
  contentLocation: 'contentLocation',
};

export const entity1Input: CreateEntityCommandInput = {
  workspaceId: workspaceId,
  entityName: 'testEntity1',
};

export const entity2Definition: entityDefinition = {
  components: [],
  description: '',
  entityName: 'testEntity2',
  parentEntityId: '$ROOT',
};

export const model1FileName = 'CookieFactoryMixer.glb';
export const model2FileName = 'CookieFactoryWaterTank.glb';

export const resourceActiveState = 'ACTIVE';
export const jsonEncoding: BufferEncoding = 'utf-8';

export const expectedTmdt: tmdtDefinition = {
  version: '0.0.2',
  component_types: ['testComponentType1.json'],
  scenes: ['testScene1.json'],
  models: ['CookieFactoryMixer.glb'],
  entities: 'entities.json',
};
