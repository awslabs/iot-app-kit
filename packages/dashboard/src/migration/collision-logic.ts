import { type ForeignWidgetInstance } from './types';

/*
 * The logic for this collision algorithm has been uplifted from the
 * vue-grid-layout library to be used with SiteWise Monitor widget-instance.
 * {@link https://github.com/jbaysolutions/vue-grid-layout/tree/master vue-grid-layout GitHub}
 */

export interface LayoutItem extends ForeignWidgetInstance {
  moved?: boolean;
}

type Layout = NonNullable<Array<LayoutItem>>;

function collides(l1: LayoutItem, l2: LayoutItem): boolean {
  if (l1 === l2) return false;
  if (l1.x + l1.width <= l2.x) return false; // l1 left l2
  if (l1.x >= l2.x + l2.width) return false; // l1 right l2
  if (l1.y + l1.height <= l2.y) return false; // l1 above l2
  if (l1.y >= l2.y + l2.height) return false; // l1 below l2
  return true;
}

export function removeCollisions(layout: Layout): Layout {
  const compareWith = [];
  const sorted = sortLayoutItemsByRowCol(layout);
  const compactedLayout: Layout = Array(layout.length);

  for (let i = 0, len = sorted.length; i < len; i++) {
    let l = sorted[i];
    l = compactItem(compareWith, l);
    compareWith.push(l);
    // Add to output to ensure correct order
    compactedLayout[layout.indexOf(l)] = l;
    l.moved = false;
  }
  return compactedLayout;
}

function compactItem(compareWith: Layout, l: LayoutItem): LayoutItem {
  // Move the element up as far as it can go without colliding.
  while (l.y > 0 && !getFirstCollision(compareWith, l)) {
    l.y--;
  }
  // Move it down, and keep moving it down if it's colliding.
  let collides;
  while ((collides = getFirstCollision(compareWith, l))) {
    l.y = collides.y + collides.height;
  }
  return l;
}

function getFirstCollision(
  layout: Layout,
  layoutItem: LayoutItem
): LayoutItem | undefined {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (collides(layout[i], layoutItem)) return layout[i];
  }
}

function getAllCollisions(
  layout: Layout,
  layoutItem: LayoutItem
): Array<LayoutItem> {
  return layout.filter((l) => collides(l, layoutItem));
}

function moveElement(
  layout: Layout,
  l: LayoutItem,
  x: number,
  y: number
): Layout {
  const oldX = l.x;
  const oldY = l.y;

  const movingUp = y && l.y > y;
  l.x = x;
  l.y = y;
  l.moved = true;

  // sort to get nearest collision
  let sorted = sortLayoutItemsByRowCol(layout);
  if (movingUp) sorted = sorted.reverse();
  const collisions = getAllCollisions(sorted, l);

  if (collisions.length) {
    l.x = oldX;
    l.y = oldY;
    l.moved = false;
    return layout;
  }

  //move colliding items
  for (let i = 0, len = collisions.length; i < len; i++) {
    const collision = collisions[i];

    if (
      collision.moved &&
      l.y > collision.y &&
      l.y - collision.y > collision.height / 4
    )
      continue;
    layout = moveElementAwayFromCollision(layout, l, collision);
  }

  return layout;
}

function moveElementAwayFromCollision(
  layout: Layout,
  collidesWith: LayoutItem,
  itemToMove: LayoutItem
): Layout {
  // mock item so we don't modify the element
  const fakeItem: LayoutItem = {
    x: itemToMove.x,
    y: itemToMove.y,
    width: itemToMove.width,
    height: itemToMove.height,
    type: itemToMove.type,
    title: itemToMove.title,
  };

  fakeItem.y = Math.max(collidesWith.y - itemToMove.height, 0);
  if (!getFirstCollision(layout, fakeItem)) {
    return moveElement(layout, itemToMove, fakeItem.x, fakeItem.y);
  }
  return moveElement(layout, itemToMove, itemToMove.x, itemToMove.y + 1);
}

function sortLayoutItemsByRowCol(layout: Layout): Layout {
  return layout.sort(function (a: LayoutItem, b: LayoutItem) {
    if (a.y === b.y && a.x === b.x) {
      return 0;
    }
    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1;
    }
    return -1;
  });
}
