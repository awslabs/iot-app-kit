# What is IoT Application Kit? 


IoT Application Kit is an open-source library consisting of front-end components and utilities. With IoT Application Kit, you can build front-end applications and webpages to utilize IoT data. By default, IoT Application Kit helps to retrieve data from [AWS IoT SiteWise](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/what-is-sitewise.html). You can also install plugins to retrieve data from your own sources. There’s no charge for using IoT Application Kit. 

IoT Application Kit provides web and [React](https://reactjs.org/) components that enable you to visualize, analyze, manage, and interact with your IoT data. 

## Components

The [components package](https://www.npmjs.com/package/@iot-app-kit/components) contains web components that you can use to build IoT Applications. With IoT Application Kit, you can get authenticated (signed in) to access data sources. You can visualize and interact with your IoT data by passing queries into the supported web components. IoT Application Kit provides you with an advanced solution so you don’t have to worry about interacting with services to fetch your IoT data or clearing cached data. For more information about how to configure a specific component, visit one or the following documentation. 

* [Line chart](https://github.com/awslabs/iot-app-kit/tree/main/docs/LineChart.md)
* [Scatter chart](https://github.com/awslabs/iot-app-kit/tree/main/docs/ScatterChart.md)
* [Bar chart](https://github.com/awslabs/iot-app-kit/tree/main/docs/BarChart.md)
* [Status grid](https://github.com/awslabs/iot-app-kit/tree/main/docs/StatusGrid.md)
* [KPI](https://github.com/awslabs/iot-app-kit/tree/main/docs/KPI.md)
* [Status timeline](https://github.com/awslabs/iot-app-kit/tree/main/docs/StatusTimeline.md)
* [Resource explorer](https://github.com/awslabs/iot-app-kit/tree/main/docs/ResourceExplorer.md)

The [react-components package](https://www.npmjs.com/package/@iot-app-kit/react-components) provides a React interface to the underlying web components.

## Sources

IoT Application Kit retrieves data from sources. You can add new sources at runtime.

By default, IoT Application Kit retrieves data from [AWS IoT SiteWise](https://www.npmjs.com/package/@iot-app-kit/source-iotsitewise). You can configure the AWS IoT SiteWise source to define an [AWS Credential Provider](https://www.npmjs.com/package/@aws-sdk/credential-providers). You can also configure a custom source to retrieve data from your own sources. For more information about how to configure a source, see [Sources](https://github.com/awslabs/iot-app-kit/tree/main/docs/Sources.md). 


## Core

The [core package](https://www.npmjs.com/package/@iot-app-kit/core) contains the base framework of which the IoT Application Kit components are built with. The core provides support for creating and accessing your custom sources. For more information about how to configure the core, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md).  

