import { v4 } from 'uuid';
import type { Viewport } from '../data-module/data-cache/requestTypes';

type ViewportListener = (viewport: Viewport) => void;

let listenerMap: { [group: string]: { [id: string]: ViewportListener } } = {};
let viewportMap: { [group: string]: Viewport } = {};
/**
 * Publicly exposed manager of viewport groups. Allows components, both internally to IoT App Kit,
 * and external components / code to broadcast updates to viewports within a group.
 *
 * Utilized to allow widgets to provide a synchronized view into data - an example can be
 * found at https://synchrocharts.com/#/Features/Synchronization
 */
export const viewportManager = {
  /**
   * Resets all state related to viewport groups.
   */
  reset: () => {
    listenerMap = {};
    viewportMap = {};
  },
  /**
   * Subscribe to viewport group
   *
   * @param viewportGroup - group to subscribe to
   * @param viewportListener - listener for viewport group updates. Called every time an update to the group is called. Not called upon initial subscription
   */
  subscribe: (
    viewportGroup: string,
    viewportListener: (viewport: Viewport) => void
  ): {
    unsubscribe: () => void;
    viewport: Viewport | null;
  } => {
    const id = v4();
    if (listenerMap[viewportGroup] == null) {
      listenerMap[viewportGroup] = {};
    }
    listenerMap[viewportGroup][id] = viewportListener;

    return {
      // Current viewport for the group
      viewport: viewportMap[viewportGroup],
      // Leave viewport group, prevents listener from being called in the future
      unsubscribe: () => {
        delete listenerMap[viewportGroup][id];
      },
    };
  },
  update: (viewportGroup: string, viewport: Viewport): void => {
    viewportMap[viewportGroup] = viewport;
    // broadcast update to all listeners within the group
    Object.keys(listenerMap[viewportGroup] || {}).forEach((id) => listenerMap[viewportGroup][id](viewport));
  },
};
