import { delay, EntityDefinitionForSync } from './utils';
import * as path from 'path';
import * as fs from 'fs';
import { getDefaultAwsClients as aws } from './aws-clients';
import { PropertyValueEntry, State } from '@aws-sdk/client-iottwinmaker';

// TODO documentation
async function syncSiteWisePropertyValues(
  workspaceId: string,
  propertyValueDir: string,
  entityDefinitions: EntityDefinitionForSync[]
): Promise<void> {
  for (const [_, entityDefinition] of entityDefinitions.entries()) {
    if (typeof entityDefinition.entityId !== 'string') {
      // TODO clean up types
      continue;
    }

    const staticDataFile = `${entityDefinition.entityName}_PropertyValuesStatic.json`;
    if (fs.existsSync(path.join(propertyValueDir, staticDataFile))) {
      await awaitEntityActive(workspaceId, entityDefinition.entityId);
      // TODO upload static data?
      console.log(`Uploading sitewise static property values for entity with name ${entityDefinition.entityName}`);
    }

    const timeSeriesDataFile = `${entityDefinition.entityName}_PropertyValuesTimeSeries.json`;
    if (fs.existsSync(path.join(propertyValueDir, timeSeriesDataFile))) {
      await awaitEntityActive(workspaceId, entityDefinition.entityId);
      console.log(`Uploading sitewise time series data for entity with name ${entityDefinition.entityName}`);
      let propertyValueEntries: PropertyValueEntry[] = JSON.parse(
        fs.readFileSync(path.join(propertyValueDir, timeSeriesDataFile), 'utf-8')
      );
      // strip outdated data from snapshot (SiteWise only allows data from the last week)
      const oneWeekAgo: Date = new Date(Date.now() - 604800100); // dirty way to get a week ago - 100 seconds
      propertyValueEntries.forEach(function (entry) {
        entry.propertyValues = entry.propertyValues?.filter((propertyValue) => {
          const propertyValueTimestamp: Date = propertyValue.time
            ? new Date(propertyValue.time)
            : propertyValue.timestamp
            ? propertyValue.timestamp
            : new Date(0);
          return propertyValueTimestamp.getTime() >= oneWeekAgo.getTime();
        });
      });
      propertyValueEntries = propertyValueEntries.filter(
        (entry) => entry.propertyValues && entry.propertyValues.length && entry.propertyValues.length > 0
      );
      if (propertyValueEntries.length > 0) {
        await aws().tm.batchPutPropertyValues({
          workspaceId,
          entries: propertyValueEntries,
        });
      }
    }
  }
}

async function awaitEntityActive(workspaceId: string, entityId: string): Promise<void> {
  const getEntity = await aws().tm.getEntity({
    workspaceId,
    entityId,
  });
  let active: boolean = getEntity.status?.state == State.ACTIVE;
  while (!active) {
    const getEntity = await aws().tm.getEntity({
      workspaceId,
      entityId,
    });
    active = getEntity.status?.state == State.ACTIVE;
    await delay(500);
  }
}

export { syncSiteWisePropertyValues };
