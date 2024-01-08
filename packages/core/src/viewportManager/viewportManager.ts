import { v4 } from 'uuid';
import type { Viewport } from '../data-module/data-cache/requestTypes';

type ViewportListener = (viewport: Viewport, topic?: string) => void;

const listenerMap: Map<string, Map<string, ViewportListener>> = new Map();
const viewportMap: Map<string, Viewport> = new Map();
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
    listenerMap.clear();
    viewportMap.clear();
  },
  /**
   * Subscribe to viewport group
   *
   * @param viewportGroup - group to subscribe to
   * @param viewportListener - listener for viewport group updates. Called every time an update to the group is called. Not called upon initial subscription
   */
  subscribe: (
    viewportGroup: string,
    viewportListener: ViewportListener
  ): {
    unsubscribe: () => void;
    viewport: Viewport | null;
  } => {
    const id = v4();
    const listeners =
      listenerMap.get(viewportGroup) || new Map<string, ViewportListener>();
    listeners.set(id, viewportListener);
    listenerMap.set(viewportGroup, listeners);

    return {
      // Current viewport for the group
      viewport: viewportMap.get(viewportGroup) || null,
      // Leave viewport group, prevents listener from being called in the future
      unsubscribe: () => {
        listenerMap.get(viewportGroup)?.delete(id);
      },
    };
  },
  update: (viewportGroup: string, viewport: Viewport, topic?: string): void => {
    viewportMap.set(viewportGroup, viewport);
    const listeners = listenerMap.get(viewportGroup);
    if (!listeners) return;
    // broadcast update to all listeners within the group
    for (const [, viewportListener] of listeners) {
      viewportListener(viewport, topic);
    }
  },
};
