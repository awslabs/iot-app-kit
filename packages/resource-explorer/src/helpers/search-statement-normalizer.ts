const WILDCARD_CHARACTERS = ['%', '*'];

const searchStatementContainsWildcard = (searchStatement: string) => {
  return WILDCARD_CHARACTERS.some((char) => searchStatement.includes(char));
};

const partialize = (searchStatement: string) => {
  return `%${searchStatement}%`;
};

const normalizeWildcards = (searchStatement: string) => {
  return searchStatement.replace(/\*/g, '%');
};

export const normalizeSearchStatement = (searchStatement: string) => {
  if (searchStatementContainsWildcard(searchStatement)) {
    return normalizeWildcards(searchStatement);
  }

  return partialize(searchStatement);
};
