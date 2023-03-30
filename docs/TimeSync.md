## [This documentation is deprecated: instead visit the IoT App Kit Docs](https://awslabs.github.io/iot-app-kit/)

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

# Utilizing the synchronized time across IoT App Kit components

The synchronized time can be utilized and updated within components by utilizing the `useViewport` hook.
[Learn more about the useViewport hook here](https://github.com/awslabs/iot-app-kit/tree/main/docs/useViewport.md).

# Programmatically control your viewports (without react)

An alternative way to manage viewports is through an exposed utility `viewportManager` within `@iot-app-kit/core` which allows you to manage your viewport groups in plain javascript.

Read more at the [viewport manager documentation](https://github.com/awslabs/iot-app-kit/tree/main/docs/ViewportManager.md).
