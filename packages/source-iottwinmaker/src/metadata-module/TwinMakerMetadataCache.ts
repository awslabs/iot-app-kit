import { GetEntityResponse } from '@aws-sdk/client-iottwinmaker';

export class TwinMakerMetadataCache {
  private entityCache: Record<string, GetEntityResponse> = {};

  public getEntity(entityId: string): GetEntityResponse | undefined {
    return this.entityCache[entityId];
  }

  public storeEntity(entity: GetEntityResponse) {
    if (entity.entityId) {
      this.entityCache[entity.entityId] = entity;
    }
  }
}
