# IoT Application Kit
[![Build Status](https://github.com/awslabs/iot-app-kit/actions/workflows/run-tests.yml/badge.svg?event=push)](https://github.com/awslabs/iot-app-kit/actions/workflows/run-tests.yml)
[![NPM Version](https://img.shields.io/npm/v/@iot-app-kit/core)](https://npmjs.org/package/@iot-app-kit/core)
[![License](https://img.shields.io/npm/l/@iot-app-kit/core)](https://github.com/awslabs/iot-app-kit/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@iot-app-kit/core)](https://bundlephobia.com/package/@iot-app-kit/core)
[![Downloads](https://img.shields.io/npm/dw/@iot-app-kit/core)](https://npmjs.org/package/@iot-app-kit/core)

IoT Application Kit is a development library for creating web applications to visualize industrial data.

<img width="1170" alt="IoT App Kit Demo" src="https://user-images.githubusercontent.com/6397726/159107236-ea95e7ba-a89c-43e6-a34c-c5ea1dd37e8b.png">

# Documentation table of contents

[What is IoT Application Kit?](https://github.com/awslabs/iot-app-kit/tree/main/docs/WhatIs.md)

[Getting started with IoT Application Kit](https://github.com/awslabs/iot-app-kit/tree/main/docs/GettingStarted.md)

[Components](https://github.com/awslabs/iot-app-kit/tree/main/docs/Components.md)

* [Line chart](https://github.com/awslabs/iot-app-kit/tree/main/docs/LineChart.md)
* [Scatter chart](https://github.com/awslabs/iot-app-kit/tree/main/docs/ScatterChart.md)
* [Bar chart](https://github.com/awslabs/iot-app-kit/tree/main/docs/BarChart.md)
* [Status grid](https://github.com/awslabs/iot-app-kit/tree/main/docs/StatusGrid.md)
* [KPI](https://github.com/awslabs/iot-app-kit/tree/main/docs/KPI.md)
* [Status timeline](https://github.com/awslabs/iot-app-kit/tree/main/docs/StatusTimeline.md)
* [Resource explorer](https://github.com/awslabs/iot-app-kit/tree/main/docs/ResourceExplorer.md)
* [Table](https://github.com/awslabs/iot-app-kit/tree/main/docs/Table.md)
* [Scene Viewer](https://github.com/awslabs/iot-app-kit/blob/main/docs/SceneViewer.md)
* [Video Player](https://github.com/awslabs/iot-app-kit/blob/main/docs/VideoPlayer.md)

[AWS IoT SiteWise source](https://github.com/awslabs/iot-app-kit/tree/main/docs/AWSIoTSiteWiseSource.md) - Learn how to connect the IoT App Kit components with AWS IoT SiteWise

[AWS IoT TwinMaker source](https://github.com/awslabs/iot-app-kit/blob/main/docs/AWSIoTTwinMakerSource.md) - Learn how to connect the IoT App Kit components with AWS IoT TwinMaker

[Time series data features](https://github.com/awslabs/iot-app-kit/tree/main/docs/TimeSeriesDataFeatures.md) - Learn about what IoT App Kit does for you when managing time series data around caching, TTLs, buffering, etc.

### For IoT App Kit contributors

[Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md) - Learn more about the core of IoT App Kit.

[Creating a custom source](https://github.com/awslabs/iot-app-kit/tree/main/docs/CustomSources.md) - Learn how to create a custom source for your needs.

[Viewport manager](https://github.com/awslabs/iot-app-kit/tree/main/docs/CustomSources.md) - Learn how to make your custom IoT App Kit components synchronize with viewport groups

## Packages

The IoT Application Kit mono-repo containing the following packages:

### @iot-app-kit/core
`@iot-app-kit/core` is the core library which exposes the iot-app-kit framework, and is what iot-app-kit components are built upon.

[Learn more here](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md).

### @iot-app-kit/components
`@iot-app-kit/components` is a collection of web components which are connected to iot-app-kit.

[Learn more here](https://github.com/awslabs/iot-app-kit/tree/main/docs/Components.md).

### @iot-app-kit/react-components
`@iot-app-kit/react-components` exposes the core iot-app-kit web components as React components.

[Learn more here](https://github.com/awslabs/iot-app-kit/tree/main/docs/Components.md).

### @iot-app-kit/source-iotsitewise
`@iot-app-kit/source-iotsitewise` exposes the AWS IoT SiteWise source, which enables you to visualize and interact with your [AWS IoT SiteWise](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/what-is-sitewise.html) data and assets.

[Learn more here](https://github.com/awslabs/iot-app-kit/tree/main/docs/AWSIoTSiteWiseSource.md).

### @iot-app-kit/source-iottwinmaker
`@iot-app-kit/source-iottwinmaker` exposes the AWS IoT TwinMaker source, which enables you to visualize and interact with your [AWS IoT TwinMaker](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html) data and digital twins.

[Learn more here](https://github.com/awslabs/iot-app-kit/blob/main/docs/AWSIoTTwinMakerSource.md).

### @iot-app-kit/related-table
`@iot-app-kit/related-table` is a tree view table component built over `@awsui/components-react` components providing client-side filtering, sorting and pagination with highly performant and optimistic rendering.

[Learn more here](https://github.com/awslabs/iot-app-kit/blob/main/packages/related-table/README.md).

### @iot-app-kit/scene-composer
`@iot-app-kit/scene-composer` is a 3D rendering component built over `@react-three/fiber` that renders your digital twin and enables you to interact with it.

[Learn more here](https://github.com/awslabs/iot-app-kit/blob/main/docs/SceneViewer.md).

## Security
See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## Developing iot-app-kit
Working on building or contributing to iot-app-kit itself? see [the development guide](https://github.com/awslabs/iot-app-kit/tree/main/docs/development.md).

## License
This project is licensed under the Apache-2.0 License.

