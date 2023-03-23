import {
  GetEntityCommandOutput,
  ComponentRequest,
  ParentEntityUpdateRequest,
  ResourceNotFoundException,
  ValidationException,
} from '@aws-sdk/client-iottwinmaker';
import { getDefaultAwsClients as aws } from './aws-clients';
import { updateEntity } from './entity';
import { componentsNeedUpdates } from './component-diff';

type EntityDefinitionForSync = {
  entityId?: string | { lookupByPath: string } | undefined;
  entityName: string | undefined;
  description?: string | undefined;
  components?: { [key: string]: ComponentRequest } | undefined;
  parentEntityId?: string | undefined;
  tags?: { [key: string]: string } | undefined;
  autoGeneratedEntityId?: string;
  isProcessed?: boolean | undefined;
};

// Initialize global counters for sync summary
let numEntitiesSynced = 0;
let numEntitiesFailed = 0;

/**
 * Driver function for script. Iterate over each entity in the provided file and attempt to sync to workspace.
 *
 * @param workspaceId - the TwinMaker workspaceId
 * @param entityDefinitions - a list of imported entities
 * @returns void
 */
async function syncEntitiesFunction(workspaceId: string, entityDefinitions: EntityDefinitionForSync[]): Promise<void> {
  for (const [i, entityDefinition] of entityDefinitions.entries()) {
    if (!entityDefinition.isProcessed) {
      if (await recursiveSyncEntity(workspaceId, entityDefinition, entityDefinitions.slice(i))) {
        numEntitiesSynced++;
      } else {
        numEntitiesFailed++;
      }
    }
  }
  console.log();
  console.log(`Successfully synced ${numEntitiesSynced} entities`);
  if (numEntitiesFailed > 0) {
    console.log(`Failed to sync ${numEntitiesFailed} entities.`);
  }
}

/**
 * Contains main logic for the entity sync.
 *
 * @param workspaceId - the TwinMaker workspaceId
 * @param entityDefinition - the specific entity that we are syncing
 * @param entityDefinitions - a slice of the list of imported entities used for finding parents
 * @returns boolean that indicates whether entity update or creation was successful
 */
async function recursiveSyncEntity(
  workspaceId: string,
  entityDefinition: EntityDefinitionForSync,
  entityDefinitions: EntityDefinitionForSync[]
): Promise<boolean> {
  entityDefinition.isProcessed = true;
  const { entityId, ...entityInformation } = entityDefinition;
  // ensure entityId field was provided, either as object containing lookup method or string Id
  if (entityId == undefined) {
    // if entityId is not provided, we can create entity with randomId;
    try {
      const entityBody = await aws().tm.createEntity({
        workspaceId,
        ...entityInformation,
      });
      entityDefinition.autoGeneratedEntityId = entityBody.entityId;
      console.log(`Created Entity with name ${entityDefinition.entityName}`);
    } catch (e) {
      if (e instanceof ValidationException && e.message.includes('Unable to find parent entity id')) {
        // recursive case:
        if (entityDefinition.parentEntityId != undefined) {
          const parent = findParentEntityDefinition(entityDefinitions, entityDefinition.parentEntityId, undefined);
          if (parent != undefined) {
            // sync parent first. If sucessful, we can retry child
            if (await recursiveSyncEntity(workspaceId, parent, entityDefinitions)) {
              numEntitiesSynced++;
              await recursiveSyncEntity(workspaceId, entityDefinition, entityDefinitions);
            } else {
              numEntitiesFailed++;
              return false;
            }
          } else {
            console.log(`Parent does not exist in file: ${e}`);
            return false;
          }
        }
      } else {
        console.log(`Could not create entity: ${e}`);
        return false;
      }
    }
  } else if (typeof entityId === 'string') {
    // if entityId string is given we try to see if the entity exists
    try {
      await getEntityAndUpdateIfNeeded(workspaceId, entityId, entityDefinition);
    } catch (e) {
      if (e instanceof ResourceNotFoundException) {
        // if entity does not exist, we try to create entity
        try {
          await aws().tm.createEntity({
            workspaceId,
            entityId,
            ...entityInformation,
          });
          console.log(`Created Entity ${entityDefinition.entityId}`);
        } catch (e) {
          if (e instanceof ValidationException && e.message.includes('Unable to find parent entity id')) {
            // recursive case:
            if (entityDefinition.parentEntityId != undefined) {
              const parent = findParentEntityDefinition(entityDefinitions, entityDefinition.parentEntityId, undefined);
              if (parent != undefined) {
                // sync parent first. If sucessful, we can retry child
                if (await recursiveSyncEntity(workspaceId, parent, entityDefinitions)) {
                  numEntitiesSynced++;
                  await recursiveSyncEntity(workspaceId, entityDefinition, entityDefinitions);
                } else {
                  numEntitiesFailed++;
                  return false;
                }
              } else {
                console.log(`Parent does not exist in file: ${e}`);
                return false;
              }
            }
          } else {
            console.log(`Could not create entity: ${e}`);
            return false;
          }
        }
      } else {
        console.log(`Get Entity or Update Failed: ${e}`);
        return false;
      }
    }
  } else {
    // if entityId does not match of any the expected types
    console.log(`Invalid entityId type given for: ${entityId}`);
    return false;
  }
  return true;
}

/**
 * Helper function which either successfully updates an entity, informs the user that an update was not
 * needed, or returns a ResourceNotFound exception if GetEntity fails.
 *
 * @remarks We had to split entityId and entityDefinition because sometimes the entityId is given as path
 * so we must find the string Id first. This is handled in the recursiveEntitySync main logic
 *
 * @param workspaceId - the TwinMaker workspaceId
 * @param entityId - the entityId which we are currently working with
 * @param entityDefinition - the rest of the entity definition
 * @returns void
 */
async function getEntityAndUpdateIfNeeded(
  workspaceId: string,
  entityId: string,
  entityDefinition: EntityDefinitionForSync
): Promise<void> {
  const existingBody = await aws().tm.getEntity({
    workspaceId,
    entityId,
  });
  // if we get here, the entity exists
  const componentUpdates = entityDefinition['components'];
  const entityName = entityDefinition['entityName'];
  const description = entityDefinition['description'];
  const parentEntityId = entityDefinition['parentEntityId'];
  if (entityNeedsUpdate(existingBody, componentUpdates, entityName, description, parentEntityId)) {
    try {
      // Let's check if parentEntityId was one of the updates needed
      let parentEntityUpdate: ParentEntityUpdateRequest | undefined = undefined;
      // we have to convert parentEntityId to ParentEntityUpdateRequest type
      if (parentEntityId != undefined && existingBody['parentEntityId'] !== parentEntityId) {
        if (parentEntityId == '') {
          parentEntityUpdate = { updateType: 'DELETE' };
        } else {
          parentEntityUpdate = {
            updateType: 'UPDATE',
            parentEntityId: parentEntityId,
          };
        }
      }
      await updateEntity(workspaceId, entityId, entityName, description, componentUpdates, parentEntityUpdate);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log(`Entity does not need update: ${entityId}`);
  }
}

/**
 * Helper function determine if an imported entityBody has new information to update for existingBody.
 * Adds propertyUpdates field if needed to accomodate API input.
 *
 * @param existingBody - GetEntity response JSON of existing entity
 * @param componentUpdates - imported entity's component body
 * @param entityName - imported entity's entity name
 * @param description - imported entity's description
 * @param parentEntityId - imported entity's parentEntityId
 * @returns true if entity requires update and false otherwise
 */
function entityNeedsUpdate(
  existingBody: GetEntityCommandOutput,
  componentUpdates: { [key: string]: ComponentRequest } | undefined,
  entityName: string | undefined,
  description: string | undefined,
  parentEntityId: string | undefined
): boolean {
  if (
    componentUpdates != undefined &&
    Object.keys(componentUpdates).length != 0 &&
    componentsNeedUpdates(existingBody, componentUpdates)
  ) {
    const componentRequestList = Object.values(componentUpdates);
    // We assume that the schema always has properties (not properyUpdate field) due to intermediate schema
    // we need to change the ComponentRequest to a ComponentUpdateRequest by adding a propertyUpdates field
    componentRequestList.forEach((component) => {
      Object.assign(component, { propertyUpdates: component.properties });
    });
    return true;
  }
  if (entityName != undefined && existingBody['entityName'] !== entityName) {
    return true;
  }
  if (description != undefined && existingBody['description'] !== description) {
    return true;
  }
  if (parentEntityId != undefined && existingBody['parentEntityId'] !== parentEntityId) {
    return true;
  }
  return false;
}

/**
 * Helper function used to locate parents in the import file which have not yet been created in workspace.
 *
 * @param entityDefinitions - slice of imported entity list to search through
 * @param parentEntityId - optional field of child's parentEntityId to search for
 * @param parentPath - optional field of the assumed path of the parent based on child path substring
 * @returns parent entity definition if the entity is found
 */
function findParentEntityDefinition(
  entityDefinitions: EntityDefinitionForSync[],
  parentEntityId?: string,
  parentPath?: string
): EntityDefinitionForSync | undefined {
  for (const entityDefinition of entityDefinitions) {
    if (
      (typeof entityDefinition.entityId == 'string' && entityDefinition.entityId == parentEntityId) ||
      (typeof entityDefinition.entityId == 'object' &&
        entityDefinition.entityId.lookupByPath != undefined &&
        entityDefinition.entityId.lookupByPath == parentPath)
    ) {
      // if found, we must mark the entity as processed
      entityDefinition.isProcessed = true;
      // return parent
      return entityDefinition;
    }
  }
}

export { syncEntitiesFunction };
