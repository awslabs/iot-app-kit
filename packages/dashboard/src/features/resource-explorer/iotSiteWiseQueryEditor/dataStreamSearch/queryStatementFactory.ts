import type { SearchFields } from './types';

export class QueryStatementFactory {
  readonly #searchQuery: SearchFields['searchQuery'];

  constructor(searchQuery: SearchFields['searchQuery']) {
    const formattedSearchQuery = this.#formatSearchQuery(searchQuery);

    this.#searchQuery = formattedSearchQuery;
  }

  public create() {
    const queryStatement = this.#createQueryStatement();

    return queryStatement;
  }

  #createQueryStatement() {
    const searchQuery = this.#searchQuery;
    const selectClause = `SELECT e.entityId AS assetId, e.entityName AS assetName, p.definition.configuration.sitewisePropertyId AS propertyId, p.definition.displayName AS propertyName`;
    const fromClause = `FROM EntityGraph`;
    const matchClause = `MATCH (e), e.components AS c, c.properties AS p`;
    const whereClause = `WHERE p.propertyValue IS MISSING AND (e.entityName LIKE '${searchQuery}' OR p.definition.displayName LIKE '${searchQuery}' OR p.propertyName LIKE '${searchQuery}' OR c.description LIKE '${searchQuery}')`;

    const queryStatement = `
      ${selectClause}
      ${fromClause}
      ${matchClause}
      ${whereClause}
    `;

    return queryStatement;
  }

  #formatSearchQuery(searchQuery: string): string {
    let formattedSearchQuery = this.#replaceWildcardCharacters(searchQuery);

    if (this.#isNoWildcards(formattedSearchQuery)) {
      formattedSearchQuery = this.#wrapInWildcards(formattedSearchQuery);
    }

    return formattedSearchQuery;
  }

  #replaceWildcardCharacters(searchQuery: string): string {
    const searchQueryWithValidWildcardCharacters = searchQuery.replaceAll(
      '*',
      '%'
    );

    return searchQueryWithValidWildcardCharacters;
  }

  #isNoWildcards(searchQuery: string): boolean {
    const isNoWildcards = searchQuery.indexOf('%') === -1;

    return isNoWildcards;
  }

  #wrapInWildcards(searchQuery: string): string {
    const wrappedSearchQuery = `%${searchQuery}%`;

    return wrappedSearchQuery;
  }
}
