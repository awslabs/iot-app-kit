import { type ITreeNode } from '../Model/TreeNode';

export function filteringFunction<T extends Record<string, any>>(
  item: ITreeNode<T>,
  filteringText: string,
  filteringFields?: string[],
  customFilteringFunction?: (
    item: ITreeNode<T>,
    filteringText: string,
    filteringFields?: string[]
  ) => boolean
): boolean {
  if (filteringText.length === 0) {
    return item.isVisible();
  }

  let filterMatched;
  if (customFilteringFunction) {
    filterMatched = customFilteringFunction(
      item,
      filteringText,
      filteringFields
    );
  } else {
    const fields = filteringFields || Object.keys(item);
    const lowFilteringText = filteringText.toLowerCase();
    filterMatched = fields.some(
      (key) => String(item[key]).toLowerCase().indexOf(lowFilteringText) > -1
    );
  }

  if (!filterMatched) {
    const childrenFiltered = item
      .getChildren()
      .map((child) => filteringFunction(child, filteringText, filteringFields))
      .find((found) => found);
    return typeof childrenFiltered !== 'undefined';
  }
  return filterMatched;
}
