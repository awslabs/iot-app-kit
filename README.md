# IoT Application Kit
[![Build Status](https://github.com/awslabs/iot-app-kit/actions/workflows/run-tests.yml/badge.svg?event=push)](https://github.com/awslabs/iot-app-kit/actions/workflows/run-tests.yml)
[![NPM Version](https://img.shields.io/npm/v/@iot-app-kit/core)](https://npmjs.org/package/@iot-app-kit/core)
[![License](https://img.shields.io/npm/l/@iot-app-kit/core)](https://github.com/awslabs/iot-app-kit/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@iot-app-kit/core)](https://bundlephobia.com/package/@iot-app-kit/core)
[![Downloads](https://img.shields.io/npm/dw/@iot-app-kit/core)](https://npmjs.org/package/@iot-app-kit/core)


## [Official IoT App Kit documentation site](https://awslabs.github.io/iot-app-kit/)

## Overview

IoT Application Kit is a development library for building Industrial IoT web based applications.

IoT App Kit is an open-source library consisting of front-end components and utilities. With IoT App Kit, you can build front-end applications and webpages to utilize IoT data. By default, IoT App Kit helps to retrieve data from [AWS IoT SiteWise](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/what-is-sitewise.html) and [AWS IoT TwinMaker](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html) You can also install plugins to retrieve data from your own sources. There’s no charge for using IoT App Kit.

For an example of a real world use case using the IoT App Kit, [visit this tutorial on how to use IoT App Kit](https://aws.amazon.com/blogs/iot/build-iot-applications-using-aws-iot-application-kit/)

<img width="1170" alt="IoT App Kit Demo" src="https://user-images.githubusercontent.com/6397726/159107236-ea95e7ba-a89c-43e6-a34c-c5ea1dd37e8b.png">

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
