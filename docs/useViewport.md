## [This documentation is deprecated: instead visit the IoT App Kit Docs](https://awslabs.github.io/iot-app-kit/)

# useViewport react hook
The `useViewport` react hook is a function which can be used within react components to utilize and update a shared time frame within a group of
IoT App Kit widgets.

`useViewport` should be used within the context of a `<TimeSync />`. [Learn more about Time Sync](https://github.com/awslabs/iot-app-kit/blob/main/docs/TimeSync.md)

NOTE: This documentation assumes you are familiar with react and react-hooks. If you need to brush up, learn more at https://reactjs.org/docs/hooks-intro.html

#  Example usage
Below is an example of a simple component which displays the current viewport, and provides a button to set the viewport
to the last 5 minutes:
```
const BasicComponent = () => {
  const { viewport, setViewport } = useViewport();
  return (
    <div>
      {JSON.stringify(viewport)}
      <button onClick={() => setViewport({ duration: '5m' })}>Set viewport</button>
    </div>
  )
}
```

This component can then be used as follows in junction with the `<TimeSync />` component:

```
import { TimeSync } from '@iot-app-kit/react-components';


<TimeSync initialViewport={{ duration: '10m' }}>
  <BasicComponent />
</TimeSync>
```

To demonstrate the synchronizing of viewports, we can utilize multiple of the newly created `<BasicComponent />`, which will all display the same viewport:

```
import { TimeSync } from '@iot-app-kit/react-components';


<TimeSync initialViewport={{ duration: '10m' }}>
  <BasicComponent />
  <BasicComponent />
  <BasicComponent />
</TimeSync>
```

### API Summary

The `useViewport` takes no inputs, and returns an object containing the following fields:

### `viewport`

The current viewport for the viewport group subscribed to. Will be undefined if the hook is used outside of the context of a `<TimeSync />`.
Will also be undefined if the associated viewport group has no associated viewport.

Type: Object or undefined

### `setViewport: (viewport, lastUpdatedBy?: string) => void`

A function which you pass a viewport and an optional lastUpdatedBy string to set the current viewport group to. When called, the viewport group will update and all consumers of the viewport group will immediately receive the updated viewport provided. The lastUpdatedBy string is used to more gracefully rerender when gestures are made on the charts within the TimeSync group.

### `group: string`

An identifier representing the viewport shared amongst widget in the same TimeSync group. It is equal to the group passed into the parent TimeSync component (if provided) or will be a random UUID assigned by the TimeSync component.
