import {
  CreateEntityRequest,
  ListEntitiesFilter,
  ComponentUpdateRequest,
  ParentEntityUpdateRequest,
  ListEntitiesCommandOutput,
} from '@aws-sdk/client-iottwinmaker';
import { getDefaultAwsClients as aws } from './aws-clients';
import { delay } from './utils';

type EntityDefinition = Omit<CreateEntityRequest, 'workspaceId'>;

/**
 * Function deletes all child entities, including the selected parent
 * @param workspaceId TM workspaceId
 * @param entityId top entity from which to delete (use $ROOT to delete all in workspace)
 */
async function recursiveDeleteEntities(workspaceId: string, entityId: string) {
  const filters: ListEntitiesFilter[] = [{ parentEntityId: entityId }];
  const maxResults = 200;
  const isRecursive: boolean | undefined = true;
  // first we do a depth first recursive delete to get down to leaf nodes
  let nextToken: string | undefined = '';
  while (nextToken != undefined) {
    const resp: ListEntitiesCommandOutput = await aws().tm.listEntities({
      workspaceId,
      filters,
      maxResults,
      nextToken,
    });
    const parentsList = resp['entitySummaries'];
    if (parentsList != undefined) {
      for (const parent of parentsList) {
        if (parent['entityId'] != undefined) {
          await recursiveDeleteEntities(workspaceId, parent['entityId']);
        }
      }
    }
    nextToken = resp['nextToken'];
  }

  // at this point we have called recursive delete on all of children
  // and will wait for our immediate children to finish deleting
  let resp: ListEntitiesCommandOutput = await aws().tm.listEntities({
    workspaceId,
    filters,
  });
  let numTries = 0;
  while (resp['entitySummaries'] != undefined && resp['entitySummaries'].length > 0) {
    console.log(`Waiting for children of ${entityId} to finish deleting. ${resp['entitySummaries'].length} remaining.`);
    const prevRemaining = resp['entitySummaries'].length;
    await delay(2000);
    resp = await aws().tm.listEntities({
      workspaceId,
      filters,
    });
    // we want to prevent an endless loop if there is an internal error that the script cannot detect
    if (resp['entitySummaries'] != undefined && resp['entitySummaries'].length == prevRemaining) {
      // we introduce a limit to the number of tries when our entitySummary length has not changed
      if (numTries++ > 15) {
        throw 'Encountered Exception While Deleting Entities. Please check console for more details and retry.';
      }
    } else {
      numTries = 0;
    }
  }
  // children are now deleted so delete self
  if (entityId != '$ROOT') {
    console.log('Deleting entity: ' + entityId);
    try {
      await aws().tm.deleteEntity({
        workspaceId,
        entityId,
        isRecursive,
      });
    } catch (e) {
      console.log(`Failed to delete entity: ${entityId}`);
    }
  }
}

/**
 * Wrapper function that deletes all entities in a given workspace
 * @param workspaceId TM workspace
 */
async function deleteEntities(workspaceId: string) {
  await recursiveDeleteEntities(workspaceId, '$ROOT');
}

/**
 * Deletes all entities in workspace using service side recursion
 * @param workspaceId TM workspace
 */
async function deleteEntitiesWithServiceRecursion(workspaceId: string) {
  const filters: ListEntitiesFilter[] = [{ parentEntityId: '$ROOT' }];

  // for each child of $ROOT call delete with service-side recursive deletion flag set to true
  const maxResults = 200;
  let nextToken: string | undefined = '';
  while (nextToken != undefined) {
    const resp: ListEntitiesCommandOutput = await aws().tm.listEntities({
      workspaceId,
      filters,
      maxResults,
      nextToken,
    });
    const rootEntities = resp['entitySummaries'];
    if (rootEntities != undefined) {
      for (const entity of rootEntities) {
        if (entity['entityId'] != undefined) {
          console.log(`recursively deleting entity: ${entity['entityId']}`);
          await aws().tm.deleteEntity({
            workspaceId,
            entityId: entity['entityId'],
            isRecursive: true,
          });
        }
      }
    }
    nextToken = resp['nextToken'];
  }

  // wait for all entities to be deleted
  let total_entities_remaining = 1;
  while (total_entities_remaining > 0) {
    total_entities_remaining = 0;
    let nextToken: string | undefined = '';
    while (nextToken != undefined) {
      const listResp: ListEntitiesCommandOutput = await aws().tm.listEntities({
        workspaceId,
        maxResults,
        nextToken,
      });
      const entities_on_page = listResp['entitySummaries'];
      if (entities_on_page != undefined) {
        total_entities_remaining += entities_on_page?.length;
      }
      nextToken = listResp['nextToken'];
    }

    if (total_entities_remaining > 0) {
      console.log(`waiting for entities to finish deleting... (${total_entities_remaining} remaining)`);
      await delay(5000); // call throttling
    }
  }
}

/**
 * Helper function for updating entities that checks state
 * @param error_message Passed in error message from API
 * @returns
 */
function entity_in_state_transition(error_message: string) {
  if (error_message.indexOf('Cannot update Entity') > -1) {
    if (error_message.indexOf('when it is in CREATING state') > -1) {
      return true;
    } else if (error_message.indexOf('when it is in UPDATING state') > -1) {
      return true;
    }
  }
  return false;
}

/**
 * Updates an existing entity with the provided parameters
 * @param workspaceId TM workspace
 * @param entityId entity which is to be updated
 * @param entityName entity name (does not have to be new)
 * @param description description (does not have to be new)
 * @param componentUpdates componentUpdateRequest (does not have to be new)
 * @param parentEntityUpdate parent entity ID (does not have to be new)
 */
async function updateEntity(
  workspaceId: string,
  entityId: string,
  entityName?: string,
  description?: string,
  componentUpdates?: {
    [key: string]: ComponentUpdateRequest;
  },
  parentEntityUpdate?: ParentEntityUpdateRequest
) {
  let state_transition_error = 'Cannot update Entity when it is in CREATING state';
  console.log(`updating entity: ${entityId}`);
  while (entity_in_state_transition(state_transition_error)) {
    try {
      await aws().tm.updateEntity({
        workspaceId,
        entityId,
        entityName,
        description,
        componentUpdates,
        parentEntityUpdate,
      });
      break; // fixed this bug from python version
    } catch (e) {
      state_transition_error = String(e);
      if (state_transition_error.indexOf('cannot be created as it already exists') > -1) {
        // pass
      } else if (entity_in_state_transition(state_transition_error)) {
        console.log(
          `waiting for entity ${entityId} to finish transition state before updating again: ${state_transition_error}`
        );
        await delay(10000);
      } else {
        throw e;
      }
    }
  }
  console.log(`updated entity: ${entityId}`);
}

export { deleteEntities, updateEntity, deleteEntitiesWithServiceRecursion };
export type { EntityDefinition };
