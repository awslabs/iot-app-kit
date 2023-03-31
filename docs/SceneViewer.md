## [This documentation is deprecated: instead visit the IoT App Kit Docs](https://awslabs.github.io/iot-app-kit/)

# Scene Viewer

The SceneViewer component allows you to render a specified [AWS IoT TwinMaker scene](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/scenes.html) for viewing experience.

## Setup

The SceneViewer component renders assets including `.svg` and `.hdr` files. You will need to configure proper loader like [file-loader](https://v4.webpack.js.org/loaders/file-loader/) for your application.

There is sample code in [examples/react-app](https://github.com/awslabs/iot-app-kit/tree/main/examples/react-app) that shows how to use this component in detail.

### Basic React component example

```tsx
import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { SceneViewer } from '@iot-app-kit/scene-composer';

const sceneLoader = initialize({ ... }).s3SceneLoader('scene-id');

<SceneViewer 
  sceneLoader={sceneLoader}
/>
```

## Properties

The SceneViewer component contains the following properties that you can customize. 

### `sceneLoader`

The class to load scene metadata and content.

**Note: When a new instance of this object is passed in, the SceneView will trigger a new loading of the whole scene. Therefore, do not recreate this object when not needed.**

Type: `SceneLoader` defined in `@iot-app-kit/source-iottwinmaker`

### `sceneComposerId`

(Optinal) An unique id for one instance of the SceneViewer component. If not provided, an uuid will be auto generated.

Type: String

### `dataStreams`

(Optional) The data used by the viewer to change the visuals of the scene objects. 

The `meta` field of each stream is required to contain values for keys `entityId`, `componentName` and `propertyName`. The scene objects with the matching meta values will use the corresponding stream.

Type: `DataStream[]` defined in `@iot-app-kit/core`

### `queries`

(Optional) Selects what data to be fetched. Learn more about queries, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md). 

Type: `TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[]` defined in `@iot-app-kit/core`

This property is used together with `viewport`.

### `viewport` 

(Optional) Specifies the window over which to query the data. 

Type: `Viewport` defined in `@iot-app-kit/core`

This property is used together with `queires`.

### `dataBindingTemplate`

(Optional) A map from data binding template names to the actual values to be used by the scene.

Type: `Record<string, string>`

Example: 

With a template named `sel_entity` defined in your scene and bind to a Tag widget, you can pass the following as `dataBindingTemplate`
```ts
{
  'sel_entity': 'real-entity-1'
}
```
Then the Tag widget will use the data from `real-entity-1` to change its visual.

### `onSelectionChanged`

(Optional) A callback that will be triggered when the selected node in the scene is changed. The information about the selection node will be passed out.

Empty information will be sent when deselection happens.

Type: `SelectionChangedEventCallback` defined in `@iot-app-kit/scene-composer`

### `onWidgetClick`

(Optional) A callback that will be triggered when a widget in the scene is clicked. The information about the clicked widget will be passed out.

Currently, only Tag widget will trigger this callback.

Type: `WidgetClickEventCallback` defined in `@iot-app-kit/scene-composer`

### `selectedDataBinding`

(Optional) Set the selected node to be the Tag widget with matching `entityId` and `componentName`,
and move the camera target to it.

When the selectedDataBinding value is undefined, no action will be taken. 

When there is no matching Tag widget found, the currently selected node will be deselected.

Type: `Record<'entityId' | 'componentName', string>`

### `activeCamera`

(Optional) Sets the camera to view from by Camera name.

When this is not found or not set the default initial camera is used. When `selectedDataBinding` is set this is ignored in favor of focusing on the selected item.

Type: String

### `config`

(Optional) The configurations of the component

- `dracoDecoder`

  (Optional) The configurations for a draco decoder. More information can be found [here](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/scenes-before-starting.html)

  Type: Object
  
- `locale`

  (Optional) The language for the texts displayed in the component. Default to `en-US`. 
  
  The supported locales can be found under `packages/scene-composer/translations` folder.

  Type: String

