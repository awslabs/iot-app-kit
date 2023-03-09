import { v4 as uuidv4 } from 'uuid';

export enum ExpandableTableNodeStatus {
  normal,
  loading,
  emptyChildren,
}

export enum LinePrefixTypes {
  MiddleChild = 'MiddleChild',
  LastChild = 'LastChild',
  ChildOfMiddleChild = 'ChildOfMiddleChild',
  ChildOfLastChild = 'ChildOfLastChild',
  Indentation = 'Indentation',
}

export interface Metadata<T> {
  prefix: LinePrefixTypes[];
  children: ITreeNode<T>[];
  status: ExpandableTableNodeStatus;
  expanded: boolean;
  visible: boolean;
  parent?: ITreeNode<T>;
}

export type TreeMap<T> = Map<string, ITreeNode<T>>;

class InternalTreeNode<T> {
  public hasChildren = false;

  public id: string = uuidv4();

  private metadata: Metadata<T> = {
    prefix: [],
    children: [],
    status: ExpandableTableNodeStatus.normal,
    expanded: false,
    visible: false,
  };

  public constructor(params: T, metadata?: Metadata<T>) {
    Object.assign(this, params);
    this.metadata = {
      ...this.metadata,
      ...metadata,
    };
  }

  addChild(child: ITreeNode<T>) {
    this.metadata.children.push(child);
  }

  removeAllChildren() {
    this.metadata.children = [];
  }

  getChildren() {
    return this.metadata.children;
  }

  getParent() {
    return this.metadata.parent;
  }

  toggleExpandCollapse() {
    this.metadata.expanded = !this.metadata.expanded;
  }

  isExpanded() {
    return this.metadata.expanded;
  }

  isVisible() {
    return this.metadata.visible;
  }

  getMetadata() {
    return this.metadata;
  }

  getPrefix() {
    return this.metadata.prefix;
  }

  getStatus() {
    return this.metadata.status;
  }

  setStatus(status: ExpandableTableNodeStatus) {
    this.metadata.status = status;
  }

  setVisible(visible: boolean) {
    this.metadata.visible = visible;
  }

  setParentNode(parentNode: any) {
    this.metadata.parent = parentNode;
  }

  buildPrefix(lastChild: boolean, parentLastChildPath: boolean[]) {
    const parent = this.getParent();
    if (!parent) {
      return;
    }

    const prefix: LinePrefixTypes[] = [
      LinePrefixTypes.Indentation,
      lastChild ? LinePrefixTypes.LastChild : LinePrefixTypes.MiddleChild,
    ];

    for (let i = parentLastChildPath.length - 1; i >= 1; i -= 1) {
      const isParentLastChild = parentLastChildPath[i];
      const treeLineMode = isParentLastChild ? LinePrefixTypes.ChildOfLastChild : LinePrefixTypes.ChildOfMiddleChild;
      prefix.splice(1, 0, treeLineMode);
    }

    this.metadata.prefix = prefix;
  }
}

export type ITreeNode<T> = InternalTreeNode<T> & T;
export const TreeNode = InternalTreeNode as new <T>(props: T, metadata?: Metadata<T>) => ITreeNode<T>;
