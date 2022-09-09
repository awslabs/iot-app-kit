import { EntitySummary, GetEntityResponse } from '@aws-sdk/client-iottwinmaker';

export class TwinMakerMetadataCache {
  private entityCache: Record<string, GetEntityResponse> = {};
  private entitySummaryCache: Record<string, EntitySummary> = {};
  private componentTypeToEntityIdCache: Record<string, string[]> = {};

  public getEntity(entityId: string): GetEntityResponse | undefined {
    return this.entityCache[entityId];
  }

  public storeEntity(entity: GetEntityResponse) {
    if (entity.entityId) {
      this.entityCache[entity.entityId] = entity;
    }
  }

  public getEntitySummariesByComponentType(componentTypeId: string): EntitySummary[] | undefined {
    if (!this.componentTypeToEntityIdCache[componentTypeId]) {
      return undefined;
    }

    return this.componentTypeToEntityIdCache[componentTypeId].map((id) => this.entitySummaryCache[id]);
  }

  public storeEntitySummariesByComponentType(componentTypeId: string, entitySummaries: EntitySummary[]) {
    const entityIds: string[] = [];
    entitySummaries.forEach((summary) => {
      if (summary.entityId) {
        entityIds.push(summary.entityId);
        this.entitySummaryCache[summary.entityId] = summary;
      }
    });
    this.componentTypeToEntityIdCache[componentTypeId] = entityIds;
  }
}
