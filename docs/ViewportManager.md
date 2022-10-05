# Viewport manager

The viewport manager is an exposed utility of `@iot-app-kit/core` which allows IoT App Kit components to synchronize their viewport within their
specified viewport group.

You can see a live demo of this within the (SynchroCharts demo on synchronization)[https://synchrocharts.com/#/Features/Synchronization]. This example
demonstrates 3 line charts within the same viewport group - when you pan one chart, it communicates it's updated viewport to the entire group. This is the functionality that the viewport manager enables.

## How to use

Within your component, import the `viewportManager` and subscribe to it:

```
import { viewportManager } from '@iot-app-kit/core';

const { viewport, unsubscribe } = viewportManager.subscribe(viewport.group, (viewport) => {
  // Use the updated viewport
})
```

## Method summary

### `subscribe(viewportGroup, callback) -> { viewport, unsubscribe }`

Method to subscribe to viewport updates from the specified viewport group. Every time the viewport group has an update passed to it, the callback will
be fired with the updated viewport.

**Returns**:

- `viewport`: The current viewport of the group at the point in time of subscribing. Returns `undefined` if there is no current viewport associated with the group.
- `unsubscribe() -> void`: Unsubscribe method to the viewport updates. Once called, the callback will no longer be fired with the viewport group has updates.

### `update(viewportGroup, viewport) -> void`

Provides updated viewport to the specified viewport group.

### `reset() -> void`

Completely resets all viewport groups, including removing all subscriptions and removing all viewports associated to viewport groups.


## Notes

Currently, we don't support switching viewport group through Viewport Manager. 
If a component changes its viewport group, it must unsubscribe from the old group and then subscribe to the new viewport. 
Otherwise, the component will still continue previous subscription to the old group, and will change along with the old group.