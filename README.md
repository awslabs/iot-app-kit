# IoT Application Kit
[![Build Status](https://github.com/awslabs/iot-app-kit/actions/workflows/run-tests.yml/badge.svg?event=push)](https://github.com/awslabs/iot-app-kit/actions/workflows/run-tests.yml)
[![NPM Version](https://img.shields.io/npm/v/@iot-app-kit/core)](https://npmjs.org/package/@iot-app-kit/core)
[![License](https://img.shields.io/npm/l/@iot-app-kit/core)](https://github.com/awslabs/iot-app-kit/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@iot-app-kit/core)](https://bundlephobia.com/package/@iot-app-kit/core)
[![Downloads](https://img.shields.io/npm/dw/@iot-app-kit/core)](https://npmjs.org/package/@iot-app-kit/core)

---
**NEW in 4.0**: IoT Application Kit has been fully migrated to React 18! There are a number of key breaking changes in React 18 that you should be aware of before upgrading to this version, which you can find details about here:

- https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html

At this point, AppKit version ^3 versions move into maintenance mode, and will only receive critical upgrades. Please submit a Github issue if you need a new feature and are currently unable to upgrade, and we
will work with you on coming up with a solution.

There should be no breaking changes in the AppKit components themselves, but their behaviors might be altered as a result of this upgrade, so if you find any issues please report them via the github issues at the top, and we will do our best to prioritize these.

Thanks!
- AWS IoT AppKit Team
---

IoT Application Kit is a development library for building Industrial IoT web based applications.

IoT App Kit is an open-source library consisting of front-end components and utilities. With IoT App Kit, you can build front-end applications and webpages to utilize IoT data. By default, IoT App Kit helps to retrieve data from [AWS IoT SiteWise](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/what-is-sitewise.html) and [AWS IoT TwinMaker](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html) You can also install plugins to retrieve data from your own sources. There’s no charge for using IoT App Kit.

For an example of a real world use case using the IoT App Kit, [visit this tutorial on how to use IoT App Kit](https://aws.amazon.com/blogs/iot/build-iot-applications-using-aws-iot-application-kit/)

<img width="1170" alt="IoT App Kit Demo" src="https://user-images.githubusercontent.com/6397726/159107236-ea95e7ba-a89c-43e6-a34c-c5ea1dd37e8b.png">

# Table of contents
* [Getting started with IoT Application Kit](https://github.com/awslabs/iot-app-kit/tree/main/docs/GettingStarted.md)

## Components

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
* [Time Sync](https://github.com/awslabs/iot-app-kit/blob/main/docs/TimeSync.md)

## React hooks (For building custom IoT App Kit components)

* [useViewport](https://github.com/awslabs/iot-app-kit/blob/main/docs/useViewport.md)

## Utilities

* [Viewport manager](https://github.com/awslabs/iot-app-kit/tree/main/docs/ViewportManager.md) - Learn how to make your custom IoT App Kit components synchronize with viewport groups

## Data sources

* [AWS IoT SiteWise source](https://github.com/awslabs/iot-app-kit/tree/main/docs/AWSIoTSiteWiseSource.md) - Learn how to connect the IoT App Kit components with AWS IoT SiteWise

* [AWS IoT TwinMaker source](https://github.com/awslabs/iot-app-kit/blob/main/docs/AWSIoTTwinMakerSource.md) - Learn how to connect the IoT App Kit components with AWS IoT TwinMaker

## Data source features built into AWS IoT SiteWise and AWS IoT TwinMaker

* [Time series data features](https://github.com/awslabs/iot-app-kit/tree/main/docs/TimeSeriesDataFeatures.md) - Learn about what IoT App Kit does for you when managing time series data around caching, TTLs, buffering, etc.


## For IoT App Kit contributors

* [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md) - Learn more about the core of IoT App Kit.

* [Creating a custom source](https://github.com/awslabs/iot-app-kit/tree/main/docs/CustomSources.md) - Learn how to create a custom source for your needs.

## Contributors guide to IoT App Kit
Learn how to contribute at [the development guide](https://github.com/awslabs/iot-app-kit/tree/main/docs/development.md).

## Packages

The IoT Application Kit containing the following public packages:

### @iot-app-kit/react-components
`@iot-app-kit/react-components` exposes the core iot-app-kit web components as React components.

[Learn more here](https://github.com/awslabs/iot-app-kit/tree/main/docs/Components.md).

### @iot-app-kit/scene-composer
`@iot-app-kit/scene-composer` is a 3D rendering component built over `@react-three/fiber` that renders your digital twin and enables you to interact with it.

[Learn more here](https://github.com/awslabs/iot-app-kit/blob/main/docs/SceneViewer.md).

### @iot-app-kit/source-iotsitewise
`@iot-app-kit/source-iotsitewise` exposes the AWS IoT SiteWise source, which enables you to visualize and interact with your [AWS IoT SiteWise](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/what-is-sitewise.html) data and assets.

[Learn more here](https://github.com/awslabs/iot-app-kit/tree/main/docs/AWSIoTSiteWiseSource.md).

### @iot-app-kit/source-iottwinmaker
`@iot-app-kit/source-iottwinmaker` exposes the AWS IoT TwinMaker source, which enables you to visualize and interact with your [AWS IoT TwinMaker](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html) data and digital twins.

[Learn more here](https://github.com/awslabs/iot-app-kit/blob/main/docs/AWSIoTTwinMakerSource.md).

### @iot-app-kit/core
`@iot-app-kit/core` is the core library which exposes the iot-app-kit framework and shared typescript Types and utilities, and is what iot-app-kit components are built upon.

[Learn more here](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md).

## Security
See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License
This project is licensed under the Apache-2.0 License.
