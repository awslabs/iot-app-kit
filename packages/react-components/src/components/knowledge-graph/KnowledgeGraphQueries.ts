import { TwinMakerKGQueryDataModule } from '@iot-app-kit/source-iottwinmaker';
import { ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';
export interface KnowledgeGraphQueryInterface {
  findEntitiesByName(name: string): Promise<void>;
  findEntitesByEntityOrPropertyName(entityName?: string, propertyName?: string): Promise<void>;
  findPropertiesByEntityOrPropertyName(entityName?: string, propertyName?: string): Promise<void>;
  findRelatedEntities(entityId: string): Promise<void>;
  executeExternalEntityQuery(entityId: string): Promise<void>;
}
export const createKnowledgeGraphQueryClient = function (
  dataSource: TwinMakerKGQueryDataModule,
  updateQueryResults: (result: ExecuteQueryCommandOutput) => void
) {
  const knowledgeGraphQuery: KnowledgeGraphQueryInterface = {
    findEntitesByEntityOrPropertyName: async (entityName?: string, propertyName?: string): Promise<void> => {
      const queryStatement = `SELECT e FROM EntityGraph MATCH (e), e.components AS c, c.properties as p WHERE c.entityName LIKE '%${entityName}%' or p.propertyName LIKE '%${propertyName}%'`;
      const result = await dataSource.executeQuery({ queryStatement });
      updateQueryResults(result);
    },
    findPropertiesByEntityOrPropertyName: async (entityName?: string, propertyName?: string): Promise<void> => {
      const queryStatement = `SELECT p FROM EntityGraph MATCH (e), e.components AS c, c.properties AS p WHERE p.propertyName LIKE '%${propertyName}%' OR c.entityName LIKE '%${entityName}%'`;
      const result = await dataSource.executeQuery({ queryStatement });
      updateQueryResults(result);
    },
    findEntitiesByName: async (name: string): Promise<void> => {
      const result = await dataSource.executeQuery({
        queryStatement: `SELECT e FROM EntityGraph MATCH (e) WHERE e.entityName like '%${name}%'`,
      });
      updateQueryResults(result);
    },
    findRelatedEntities: async (entityId: string): Promise<void> => {
      const result = await dataSource.executeQuery({
        queryStatement: `SELECT e1, r1, e2, r2, e3, r3, e4
        FROM EntityGraph 
        MATCH (e1)-[r1]-(e2)-[r2]-(e3)-[r3]-(e4) WHERE e1.entityId = '${entityId}'`,
      });
      updateQueryResults(result);
    },
    executeExternalEntityQuery: async (entityId: string): Promise<void> => {
      const result = await dataSource.executeQuery({
        queryStatement: `SELECT e FROM EntityGraph MATCH (e) WHERE e.entityId = '${entityId}'`,
      });
      updateQueryResults(result);
    },
  };

  return knowledgeGraphQuery;
};
