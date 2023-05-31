export interface INodeResults {
  entityName?: string;
  entityId: string;
  creationDate?: Date;
  lastUpdateDate?: Date;
  arn?: string;
  workspaceId?: string;
  components?: [];
  description?: string;
}

export interface IRelationResults {
  sourceEntityId: string;
  targetEntityId: string;
  relationshipName?: string;
  sourceComponentName?: string;
  sourceComponentTypeId?: string;
}
