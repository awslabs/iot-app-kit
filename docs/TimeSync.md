# Time Sync component
The `<TimeSync />` is a component of IoT App Kit which enables the management of viewports between all of your IoT App Kit components, enabling use cases such as synchronizing viewports across components in one or more groups, and providing the ability
for components to easily send updates to their viewport group.

You can see a live demo of this within the (SynchroCharts demo on synchronization)[https://synchrocharts.com/#/Features/Synchronization]. This example
demonstrates 3 line charts within the same viewport group - when you pan one chart, it communicates it's updated viewport to the entire group. This is the functionality that the `<TimeSync />` enables.

## How to use

To utilize the `<TimeSync />`, simply wrap the components which you want to share a viewport with the `<TimeSync />` as shown below:

```
import { LineChart, TimeSync } from '@iot-app-kit/react-components

 <TimeSync initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </TimeSync>
```

or to have multiple viewport groups, we can use the `<TimeSync />` in multiple locations, such as shown below:
```
import { LineChart, TimeSync } from '@iot-app-kit/react-components

 <TimeSync initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </TimeSync>
 <TimeSync initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
 </TimeSync>
 <TimeSync initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </TimeSync>
```

if you want to have different viewport groups in your application that cannot be wrapped by a single `<TimeSync />`, you can specify a `group` attribute that is common between them:
or to have multiple viewport groups, we can use the `<TimeSync />` in multiple locations, such as shown below:
```
import { LineChart, TimeSync } from '@iot-app-kit/react-components

 <TimeSync group="my-group" initialViewport={{ duration: '5m' }}}>
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </TimeSync>
 <TimeSync group="my-group">
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </TimeSync>
 <TimeSync group="my-group">
    <LineChart ... />
    <LineChart ... />
    <LineChart ... />
  </TimeSync>
```

## `<TimeSync />` API Summary

### `group`

(Optional) Name of the viewport group that the `<TimeSync />` will propagate to it's contained components. If left empty, the TimeSync component will assign a unique string by default. All viewports across all `<TimeSync />`s
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

This widget will now work as expected when wrapped in a `TimeSync`, as shown below:
```
<TimeSync>
  <MyWidget />
</TimeSync>
```

if we now have multiple of the widgets, they will stay in sync and all display the same viewport:
```
<TimeSync>
  <MyWidget />
  <MyWidget />
  <MyWidget />
</TimeSync>
```

### useViewport API Summary

The `useViewport` takes no inputs, and returns an object containing the following fields:

### viewport

The current viewport for the viewport group subscribed to. Will be undefined if the hook is used outside of the context of a `<TimeSync />`.
Will also be undefined if the associated viewport group has no associated viewport.

Type: Object or undefined

### `update: (viewport) => void`

A function which you pass a viewport to set the current viewport group to. When called, the viewport group will update and all consumers of the viewport group will immediately receive the updated viewport provided.

# Programmatically control your viewports (without react)

An alternative way to manage viewports is through an exposed utility `viewportManager` within `@iot-app-kit/core` which allows you to manage your viewport groups in plain javascript.

Read more at the [viewport manager documentation](https://github.com/awslabs/iot-app-kit/tree/main/docs/ViewportManager.md).
