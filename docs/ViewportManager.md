# Viewport manager
The `<ViewportManager />` is a component of IoT App Kit which enables the management of viewports between all of your IoT App Kit components, enabling use cases such as synchronizing viewports across components in one or more groups, and providing the ability
for components to easily send updates to their viewport group.

You can see a live demo of this within the (SynchroCharts demo on synchronization)[https://synchrocharts.com/#/Features/Synchronization]. This example
demonstrates 3 line charts within the same viewport group - when you pan one chart, it communicates it's updated viewport to the entire group. This is the functionality that the viewport manager enables.

## How to use

To utilize the `<ViewportManager />`, simply wrap the components which you want to share a viewport with the `<ViewportManager />` as shown below:

```
import { LineChart, ViewportManager } from '@iot-app-kit/react-components

 <ViewportManager initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </ViewportManager
```

or to have multiple viewport groups, we can use the `<ViewportManager />` in multiple locations, such as shown below:
```
import { LineChart, ViewportManager } from '@iot-app-kit/react-components

 <ViewportManager initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </ViewportManager
 <ViewportManager initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </ViewportManager
 <ViewportManager initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </ViewportManager
```

if you want to have different viewport groups in your application that cannot be wrapped by a single `<ViewportGroup />`, you can specify a `group` attribute that is common between them:
or to have multiple viewport groups, we can use the `<ViewportManager />` in multiple locations, such as shown below:
```
import { LineChart, ViewportManager } from '@iot-app-kit/react-components

 <ViewportManager group="my-group" initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </ViewportManager
 <ViewportManager group="my-group">
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </ViewportManager
 <ViewportManager group="my-group">
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </ViewportManager
```

Viewport manager is quite flexible, and can be nested. The viewport group associated with the closest viewport manager to the child component will be the group that
the component is part of. For example, in the code sample below, the first two line charts are part of the "outer-group", and the third line chart would be part of the "inner-group":

```
import { LineChart, ViewportManager } from '@iot-app-kit/react-components

 <ViewportManager group="outer-group" initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    
    <ViewportManager group="inner-group" />
      <LineChart ... />
    </ViewportManager />
  </ViewportManager
```


## `<ViewportManager />` API Summary

### `group`

(Optional) Name of the viewport group that the viewport manager will manager. If left empty, the viewport manager will assign a unique string by default. All viewports across all viewport managers
that share the same group, will stay in sync. Updates made to the viewport group, will be shared to all consumers of the viewport group.

Type: String

### `initialViewport`

(Optional) Initial value to set the viewport group to, if no viewport is associated with the given viewport group. If the viewport group already has a viewport associated with it, the `initialViewport` will be ignored.

Type: Object

## Using viewport with `useViewport` hook
When building custom components, it can be useful to have access to the current viewport, as well as the ability to update the viewport of the viewport group. `useViewport` provides this functionality. To brush up on react hooks, please refer to https://reactjs.org/docs/hooks-intro.html.

Below is an example of how to use the `useViewport` hook:

```

const MyWidget = () => {
  const { viewport, update } = useViewport();
  
  return (
    <div>
      {JSON.stringify(viewport)}
      <button onClick={() => {update({ viewport: '5m' )}}>
        Show last 5 minutes
      </button>
    </div>
  )
}
```

This widget will now work as expected when wrapped in a `ViewportManager`, as shown below:
```
<ViewportManager>
  <MyWidget />
</ViewportManager>
```

if we now have multiple of the widgets, they will stay in sync and all display the same viewport:
```
<ViewportManager>
  <MyWidget />
  <MyWidget />
  <MyWidget />
</ViewportManager>
```

### useViewport API Summary

The `useViewport` takes no inputs, and returns an object containing the following fields:

### viewport

The current viewport for the viewport group subscribed to. Will be undefined if the hook is used outside of the context of a `<ViewportManager />`.
Will also be undefined if the associated viewport group has no associated viewport.

Type: Object or undefined

### `update: (viewport) => void`

A function which you pass a viewport to set the current viewport group to. When called, the viewport group will update and all consumers of the viewport group will immediately receive the updated viewport provided.

# Programmatically control your viewports (without react)

An alternative way to manager viewports is through  an exposed utility of `@iot-app-kit/core` which allows you to manage your viewport groups in plain javascript.


## How to use

Within your component, import the `viewportManager` and subscribe to it:

```
import { viewportManager } from '@iot-app-kit/core';

const { viewport, unsubscribe } = viewportManager.subscribe(viewport.group, (viewport) => {
  // Use the updated viewport
})
```

This subscription to the viewport group will be called and provided the lastest version of the viewport every time the viewport updates.


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