import { queryFactory } from './queryFactory';
import { dataStreamFactory } from './selectionFactory';

/**
 * Converts between a query and a selection.
 *
 * @remarks
 *
 * This component is a facade for the query and selection factories.
 */
export const querySelectionConverter = {
  toQuery: queryFactory.create,
  toSelection: dataStreamFactory.createFromQuery,
};
