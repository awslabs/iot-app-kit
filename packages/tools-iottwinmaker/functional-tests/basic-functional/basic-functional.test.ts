import { getDefaultAwsClients as aws, initDefaultAwsClients } from '../../src/lib/aws-clients';
import { Arguments } from 'yargs';
import * as deploy from '../../src/commands/deploy';
import * as init from '../../src/commands/init';
import * as nuke from '../../src/commands/nuke';
import * as fs from 'fs';
import * as constants from './basic-functional-constants';
import { twinMakerAssumeRolePolicy, twinMakerPermissionPolicy } from './basic-functional-iam';
import { ComponentTypeSummary, GetComponentTypeCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import * as path from 'path';
import { EntitySummary } from '@aws-sdk/client-iottwinmaker/dist-types/models/models_0';
import { delay } from '../../src/lib/utils';
import * as prompts from 'prompts';
import { componentType1Input, expectedTmdt } from './basic-functional-constants';

// Ensure nuke always operates
prompts.inject(['Y', 'Y']);

test('basic functional test', async () => {
  console.log('//////      BEGIN BASIC FUNCTIONAL TEST     //////');
  let argv2;

  // 0. Get account info
  console.log('Initializing AWS client.');
  initDefaultAwsClients({ region: constants.region });
  const accountId = (await aws().getCurrentIdentity())['accountId'];
  const twinMakerRoleName = `${constants.workspaceId}-${accountId}-${constants.timestamp}-role`;
  const twinMakerPolicyName = `${twinMakerRoleName}PermissionPolicy`;
  const twinMakerRoleArn = `arn:aws:iam::${accountId}:role/${twinMakerRoleName}`;
  const workspaceS3BucketName = `${constants.workspaceId}-${accountId}`;
  const workspaceS3BucketArn = `arn:aws:s3:::${workspaceS3BucketName}`;
  const scene1S3Location = `s3://${workspaceS3BucketName}/${constants.scene1FileName}`;
  const model1S3Location = `s3://${workspaceS3BucketName}/${constants.model1FileName}`;
  const model2S3Location = `s3://${workspaceS3BucketName}/${constants.model2FileName}`;

  // 1. Clean up pre-existing resources, if any
  console.log('Deleting test IAM role, s3 bucket, and workspace if they exist.');
  try {
    await aws().tm.getWorkspace({ workspaceId: constants.workspaceId });
    console.log('Workspace exists, nuking it.');
    argv2 = {
      _: ['nuke'],
      $0: 'tmdt_local',
      region: 'us-east-1',
      'workspace-id': constants.workspaceId,
    } as Arguments<nuke.Options>;
    await nuke.handler(argv2);
    await aws().tm.deleteWorkspace({ workspaceId: constants.workspaceId });
  } catch (e) {
    console.log('Workspace does not exist, as expected.');
  }
  try {
    await aws().s3.send(
      new DeleteObjectCommand({
        Bucket: workspaceS3BucketName,
        Key: constants.model1FileName,
      })
    );
    await aws().s3.send(
      new DeleteObjectCommand({
        Bucket: workspaceS3BucketName,
        Key: constants.model2FileName,
      })
    );
    await aws().s3.send(
      new DeleteObjectCommand({
        Bucket: workspaceS3BucketName,
        Key: constants.scene1FileName,
      })
    );
    await aws().s3.send(
      new DeleteObjectCommand({
        Bucket: workspaceS3BucketName,
        Key: constants.scene2FileName,
      })
    );
    await aws().s3.deleteBucket({ Bucket: workspaceS3BucketName });
  } catch (e) {
    console.log('S3 bucket does not exist, as expected.');
  }
  try {
    await aws().iam.deleteRolePolicy({
      RoleName: twinMakerRoleName,
      PolicyName: twinMakerPolicyName,
    });
  } catch (e) {
    console.log('IAM role policy does not exist, as expected.');
  }
  try {
    await aws().iam.deleteRole({ RoleName: twinMakerRoleName });
  } catch (e) {
    console.log('IAM role does not exist, as expected.');
  }

  // 2. Set up test resources
  try {
    console.log(`Creating IAM role: ${twinMakerRoleName}`);
    await aws().iam.createRole({
      RoleName: twinMakerRoleName,
      AssumeRolePolicyDocument: JSON.stringify(twinMakerAssumeRolePolicy),
    });
    let twinMakerPolicyString = JSON.stringify(twinMakerPermissionPolicy);
    twinMakerPolicyString = twinMakerPolicyString.replace('__S3_ARN_STAR__', `${workspaceS3BucketArn}/*`);
    twinMakerPolicyString = twinMakerPolicyString.replace('__S3_ARN_STANDARD__', workspaceS3BucketArn);
    twinMakerPolicyString = twinMakerPolicyString.replace(
      '__S3_ARN_FOR_DELETE__',
      `${workspaceS3BucketArn}/DO_NOT_DELETE_WORKSPACE_*`
    );
    await aws().iam.putRolePolicy({
      RoleName: twinMakerRoleName,
      PolicyName: twinMakerPolicyName,
      PolicyDocument: twinMakerPolicyString,
    });
    await delay(10000); // TODO replace with method to wait for role creation and propagation
    console.log(`Creating workspace bucket: ${workspaceS3BucketName}`);
    await aws().s3.createBucket({
      Bucket: workspaceS3BucketName,
    });
    console.log(`Creating workspace: ${constants.workspaceId}`);
    await aws().tm.createWorkspace({
      workspaceId: constants.workspaceId,
      s3Location: workspaceS3BucketArn,
      role: twinMakerRoleArn,
    });
    console.log(`Uploading scene 1 definition file to s3 bucket: ${workspaceS3BucketName}`);
    const scene1Definition = JSON.parse(
      fs.readFileSync(path.join(constants.localResourcesDir, constants.scene1FileName), constants.jsonEncoding)
    );
    scene1Definition['nodes'][0]['components'][0]['uri'] = model1S3Location;
    const scene1UploadParams = {
      Bucket: workspaceS3BucketName,
      Key: constants.scene1FileName,
      Body: JSON.stringify(scene1Definition),
    };
    await aws().s3.send(new PutObjectCommand(scene1UploadParams));
    constants.scene1Input['contentLocation'] = scene1S3Location;
    console.log(`Uploading model 1 glb file to s3 bucket: ${workspaceS3BucketName}`);
    const model1UploadParams = {
      Bucket: workspaceS3BucketName,
      Key: constants.model1FileName,
      Body: fs.createReadStream(path.join(constants.localResourcesDir, constants.model1FileName)),
    };
    await aws().s3.send(new PutObjectCommand(model1UploadParams));
    console.log('Successfully set up test resources.');
  } catch (e) {
    console.error('Error while setting up test resources, please check logs, clean up, and restart test. \n', e);
    throw e;
  }

  // 3. Create some TwinMaker resources
  console.log('Setting up first round of TwinMaker resources.');
  try {
    await aws().tm.createComponentType(constants.componentType1Input);
    await aws().tm.createScene(constants.scene1Input); // Scene already contains model 1
    await aws().tm.createEntity(constants.entity1Input);
    console.log('Successfully set up first round of TwinMaker resources.');
  } catch (e) {
    console.error('Error while creating TwinMaker resources, please check logs, clean up, and restart test. \n', e);
    throw e;
  }

  // 4. Init tmdt project
  console.log(`Using init to initialize tmdt project in dir: ${constants.tmdtDirectory}`);
  argv2 = {
    _: ['init'],
    $0: 'tmdt_local',
    region: constants.region,
    'workspace-id': constants.workspaceId,
    out: constants.tmdtDirectory,
    'snapshot-sitewise': false,
  } as Arguments<init.Options>;
  expect(await init.handler(argv2)).toBe(0);

  // 5. Validate tmdt definition
  console.log(`Init succeeded, validating tmdt definition in dir: ${constants.tmdtDirectory}`);
  const tmdtDefinition1 = JSON.parse(
    fs.readFileSync(path.join(constants.tmdtDirectory, 'tmdt.json'), constants.jsonEncoding)
  );
  expect(tmdtDefinition1['component_types']).toStrictEqual(expectedTmdt['component_types']);
  const ct1Definition = JSON.parse(
    fs.readFileSync(path.join(constants.tmdtDirectory, 'testComponentType1.json'), constants.jsonEncoding)
  );
  expect(ct1Definition['componentTypeId']).toStrictEqual(componentType1Input.componentTypeId);
  expect(tmdtDefinition1['scenes']).toStrictEqual(expectedTmdt['scenes']);
  const scene1Definition = JSON.parse(
    fs.readFileSync(path.join(constants.tmdtDirectory, 'testScene1.json'), constants.jsonEncoding)
  );
  expect(scene1Definition['nodes'][0]['name']).toStrictEqual('CookieFactoryMixer');
  expect(tmdtDefinition1['models']).toStrictEqual(expectedTmdt['models']);
  expect(tmdtDefinition1['entities']).toStrictEqual(expectedTmdt['entities']);
  expect(fs.existsSync(path.join(constants.tmdtDirectory, 'entities.json'))).toBeTruthy();
  const entities1Definition = JSON.parse(
    fs.readFileSync(path.join(constants.tmdtDirectory, 'entities.json'), constants.jsonEncoding)
  );
  expect(entities1Definition[0]['entityName']).toStrictEqual('testEntity1');
  console.log('tmdt definition validated successfully');

  // 6. Update tmdt definition, add resources
  console.log(`Updating tmdt definition in dir: ${constants.tmdtDirectory} and adding resources`);
  fs.copyFileSync(
    path.join(constants.localResourcesDir, constants.model2FileName),
    path.join(constants.tmdtDirectory, `3d_models/${constants.model2FileName}`)
  );
  const scene2Definition = JSON.parse(
    fs.readFileSync(path.join(constants.localResourcesDir, constants.scene2FileName), constants.jsonEncoding)
  );
  scene2Definition['nodes'][0]['components'][0]['uri'] = model1S3Location;
  scene2Definition['nodes'][1]['components'][0]['uri'] = model2S3Location;
  fs.writeFileSync(path.join(constants.tmdtDirectory, constants.scene2FileName), JSON.stringify(scene2Definition));
  fs.writeFileSync(
    path.join(constants.tmdtDirectory, `${constants.componentType2Name}.json`),
    JSON.stringify(constants.componentType2)
  );
  const entities = JSON.parse(
    fs.readFileSync(path.join(constants.tmdtDirectory, constants.entitiesFile), constants.jsonEncoding)
  );
  const entity1Id = entities[0].entityId;
  entities.push(constants.entity2Definition);
  fs.writeFileSync(path.join(constants.tmdtDirectory, 'entities.json'), JSON.stringify(entities));
  const tmdtDefinition = JSON.parse(
    fs.readFileSync(path.join(constants.tmdtDirectory, constants.tmdtFile), constants.jsonEncoding)
  );
  tmdtDefinition['component_types'].push(`${constants.componentType2Name}.json`);
  tmdtDefinition['scenes'].push(constants.scene2FileName);
  tmdtDefinition['models'].push(constants.model2FileName);
  fs.writeFileSync(path.join(constants.tmdtDirectory, constants.tmdtFile), JSON.stringify(tmdtDefinition));
  console.log('tmdt definition updated');

  // 7. Deploy to workspace
  console.log(`Deploying updated tmdt project to workspace: ${constants.workspaceId}`);
  argv2 = {
    _: ['deploy'],
    $0: 'tmdt_local',
    region: constants.region,
    'workspace-id': constants.workspaceId,
    dir: constants.tmdtDirectory,
  } as Arguments<deploy.Options>;
  expect(await deploy.handler(argv2)).toBe(0);

  // 8. Validate resources were created
  console.log(`Verifying TwinMaker resource in dir: ${constants.tmdtDirectory}`);
  // Verify Component Types
  const componentType1Result: GetComponentTypeCommandOutput = await aws().tm.getComponentType({
    workspaceId: constants.workspaceId,
    componentTypeId: constants.componentType1Input.componentTypeId,
  });
  expect(componentType1Result.componentTypeId).toEqual(constants.componentType1Input.componentTypeId);
  expect(componentType1Result.status).toMatchObject({
    state: constants.resourceActiveState,
  });
  const componentType2Result: GetComponentTypeCommandOutput = await aws().tm.getComponentType({
    workspaceId: constants.workspaceId,
    componentTypeId: constants.componentType2.componentTypeId,
  });
  expect(componentType2Result.componentTypeId).toEqual(constants.componentType2.componentTypeId);
  expect(componentType2Result.status).toMatchObject({
    state: constants.resourceActiveState,
  });
  // Verify Entities
  const entity1Result = await aws().tm.getEntity({
    workspaceId: constants.workspaceId,
    entityId: entity1Id,
  });
  expect(entity1Result.entityId).toEqual(entity1Id);
  expect(entity1Result.entityName).toEqual(constants.entity1Input.entityName);
  expect(entity1Result.status).toBeTruthy();
  expect(entity1Result.status?.state).toBe(constants.resourceActiveState);
  const listEntitiesResult: EntitySummary[] =
    (await aws().tm.listEntities({ workspaceId: constants.workspaceId })).entitySummaries || [];
  listEntitiesResult.forEach(function (entity) {
    if (entity.entityName === constants.entity2Definition.entityName) {
      expect(entity.status?.state).toBe(constants.resourceActiveState);
    }
  });
  // Verify Scenes
  const scene1Result = await aws().tm.getScene({
    workspaceId: constants.workspaceId,
    sceneId: constants.scene1Input.sceneId,
  });
  expect(scene1Result.contentLocation).toBe(scene1S3Location);
  const scene1S3Response = await aws().s3.getObject({
    Bucket: workspaceS3BucketName,
    Key: constants.scene1FileName,
  });
  if (scene1S3Response.Body == undefined) {
    throw new Error(`Error reading from s3 Bucket: ${workspaceS3BucketArn}`);
  }
  const scene1JsonResult = JSON.parse(await scene1S3Response.Body.transformToString(constants.jsonEncoding));
  expect(scene1JsonResult.nodes[0].name).toBe(constants.model1FileName.replace('.glb', ''));
  const scene2Result = await aws().tm.getScene({
    workspaceId: constants.workspaceId,
    sceneId: constants.scene2FileName.replace('.json', ''),
  });
  expect(scene2Result.contentLocation).toBe(
    scene1S3Location.replace(constants.scene1FileName, constants.scene2FileName)
  );
  const scene2S3Response = await aws().s3.getObject({
    Bucket: workspaceS3BucketName,
    Key: constants.scene2FileName,
  });
  if (scene2S3Response.Body == undefined) {
    throw new Error(`Error reading from s3 Bucket: ${workspaceS3BucketArn}`);
  }
  const scene2JsonResult = JSON.parse(await scene2S3Response.Body.transformToString(constants.jsonEncoding));
  const scene2ModelNames: string[] = [];
  scene2JsonResult.nodes.forEach(function (model: { name: string }) {
    scene2ModelNames.push(model.name);
  });
  expect(scene2ModelNames).toContain(constants.model1FileName.replace('.glb', ''));
  expect(scene2ModelNames).toContain(constants.model2FileName.replace('.glb', ''));
  // Verify Models
  const model1S3Response = await aws().s3.getObject({
    Bucket: workspaceS3BucketName,
    Key: constants.model1FileName,
  });
  expect(model1S3Response).toHaveProperty('Body');
  const model2S3Response = await aws().s3.getObject({
    Bucket: workspaceS3BucketName,
    Key: constants.model2FileName,
  });
  expect(model2S3Response).toHaveProperty('Body');
  console.log('TwinMaker resources verified, deploy successfully created resources.');

  // 9. Nuke workspace
  console.log(`Nuking workspace: ${constants.workspaceId}`);
  argv2 = {
    _: ['nuke'],
    $0: 'tmdk_local',
    region: 'us-east-1',
    'workspace-id': constants.workspaceId,
  } as Arguments<nuke.Options>;
  expect(await nuke.handler(argv2)).toBe(0);

  // 10. Validate nuke
  console.log('Validating nuke cleared all TwinMaker resources.');
  expect((await aws().tm.listEntities({ workspaceId: constants.workspaceId })).entitySummaries).toMatchObject([]);
  expect((await aws().tm.listScenes({ workspaceId: constants.workspaceId })).sceneSummaries).toMatchObject([]);
  const listComponentTypesResult: ComponentTypeSummary[] =
    (await aws().tm.listComponentTypes({ workspaceId: constants.workspaceId })).componentTypeSummaries || [];
  listComponentTypesResult.forEach(function (componentType) {
    expect(componentType.componentTypeId?.includes('com.amazon')).toBeTruthy();
  });
  console.log('Nuke successfully deleted all TwinMaker resources.');

  // 1. Clean up
  console.log('Cleaning up test resources.');
  try {
    await aws().tm.deleteWorkspace({ workspaceId: constants.workspaceId });
    await aws().s3.send(
      new DeleteObjectCommand({
        Bucket: workspaceS3BucketName,
        Key: constants.model1FileName,
      })
    );
    await aws().s3.send(
      new DeleteObjectCommand({
        Bucket: workspaceS3BucketName,
        Key: constants.model2FileName,
      })
    );
    await aws().s3.send(
      new DeleteObjectCommand({
        Bucket: workspaceS3BucketName,
        Key: constants.scene1FileName,
      })
    );
    await aws().s3.send(
      new DeleteObjectCommand({
        Bucket: workspaceS3BucketName,
        Key: constants.scene2FileName,
      })
    );
    await aws().s3.deleteBucket({ Bucket: workspaceS3BucketName });
    await aws().iam.deleteRolePolicy({
      RoleName: twinMakerRoleName,
      PolicyName: twinMakerPolicyName,
    });
    await aws().iam.deleteRole({ RoleName: twinMakerRoleName });
  } catch (e) {
    console.error('Error while deleting test resources. \n', e);
  }

  console.log('//////      TEST PASS     //////');
}, 999999);
