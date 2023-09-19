export const searchStatementFactory = {
  createSearchStatement(searchString: string): string {
    if (searchString.indexOf('*') === -1) {
      return `
        SELECT
          e.entityId AS assetId,
          e.entityName AS assetName,
          p.definition.configuration.sitewisePropertyId AS propertyId,
          p.definition.displayName AS propertyName
        FROM EntityGraph
        MATCH
          (e),
          e.components AS c,
          c.properties AS p
        WHERE p.propertyValue IS MISSING
        AND (e.entityName LIKE '%${searchString}%'
        OR p.propertyName LIKE '%${searchString}%'
        OR p.definition.displayName LIKE '%${searchString}%'
        OR c.description LIKE '%${searchString}%')`;
    }
    const searchTerms = searchString.replaceAll('*', '%');

    const searchStatement = `
      SELECT
        entity.entityId AS assetId,
        entity.entityName AS assetName,
        properties.definition.configuration.sitewisePropertyId AS propertyId,
        properties.definition.displayName AS propertyName
      FROM EntityGraph
      MATCH
        (entity),
        entity.components AS components,
        components.properties AS properties
      WHERE properties.propertyValue IS MISSING
        AND (entity.entityName LIKE '${searchTerms}'
          OR properties.definition.displayName LIKE '${searchTerms}'
          OR properties.propertyName LIKE '${searchTerms}'
          OR components.description LIKE '${searchTerms}')`;

    return searchStatement;
  },
};
