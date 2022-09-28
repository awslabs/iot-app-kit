import { KnownComponentType } from '../../../../../interfaces';
import draggable from '../../../../../enhancers/draggable';
import droppable from '../../../../../enhancers/droppable';
import Tree, { TreeItem } from '../../../../Tree';

export const AcceptableDropTypes = [
  ...Object.keys(KnownComponentType).filter((t) => t !== KnownComponentType.SubModelRef),
  'Space',
  'default',
];

export const EnhancedTreeItem = droppable(draggable(TreeItem));
export const EnhancedTree = droppable(Tree);
