# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.
## [5.2.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.1.1...react-components-v5.2.0) (2023-04-05)


### Bug Fixes

* **react-components:** add core-util as a dependency ([5c4d420](https://github.com/awslabs/iot-app-kit/commit/5c4d4209d364640aebb78134fc08bc32707795f0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/core bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/core-util bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/source-iottwinmaker bumped from 5.1.1 to 5.2.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/source-iotsitewise bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/testing-util bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/ts-config bumped from 5.1.1 to 5.2.0
    * eslint-config-iot-app-kit bumped from 5.1.1 to 5.2.0

## [5.1.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.1.0...react-components-v5.1.1) (2023-04-03)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/core bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/source-iottwinmaker bumped from 5.1.0 to 5.1.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/source-iotsitewise bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/testing-util bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/ts-config bumped from 5.1.0 to 5.1.1
    * eslint-config-iot-app-kit bumped from 5.1.0 to 5.1.1

## [5.1.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.0.0...react-components-v5.1.0) (2023-04-03)


### Features

* **charts:** add legend to charts ([0abfcf6](https://github.com/awslabs/iot-app-kit/commit/0abfcf6c5a325ee24290d5ac990703e24f6db3f0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/core bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 5.0.0 to 5.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/source-iotsitewise bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/testing-util bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/ts-config bumped from 5.0.0 to 5.1.0
    * eslint-config-iot-app-kit bumped from 5.0.0 to 5.1.0

## [5.0.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v4.0.3...react-components-v5.0.0) (2023-03-31)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))

### Features

* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([64e64b8](https://github.com/awslabs/iot-app-kit/commit/64e64b800ad3b6ddbee78cfe84c3750e73dead65))
* **all:** release 4.0.3 ([2b933ba](https://github.com/awslabs/iot-app-kit/commit/2b933ba31e60666323df7bfae0e962698636a4bf))
* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* backfill component integration tests ([#66](https://github.com/awslabs/iot-app-kit/issues/66)) ([4f17201](https://github.com/awslabs/iot-app-kit/commit/4f17201f5990876b67861f091dbdcdb5345a28c2))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([16451b1](https://github.com/awslabs/iot-app-kit/commit/16451b12e0fe2662069275185b2fea61048d3fab))
* **dashboard:** add table support to dashboard ([1d8d44e](https://github.com/awslabs/iot-app-kit/commit/1d8d44e2a7bb67811de9702efa23dbdd5653f572))
* **dashboard:** assign default color based on cloudscape design ([5855096](https://github.com/awslabs/iot-app-kit/commit/58550960ce402c6e18ee25ffee87945a6aeb4f77))
* **dashboard:** initial dashboard work ([06cc210](https://github.com/awslabs/iot-app-kit/commit/06cc21079dc0446a06c72db676dba27f05a1606f))
* **EnvironmentModel:** Adding support for environment overlay ([#262](https://github.com/awslabs/iot-app-kit/issues/262)) ([0277027](https://github.com/awslabs/iot-app-kit/commit/0277027d59f232c2c8e29fac0bc53399a1eb9c1e))
* improve documentation and clarity of react-components pkg ([#60](https://github.com/awslabs/iot-app-kit/issues/60)) ([f4239cf](https://github.com/awslabs/iot-app-kit/commit/f4239cf1ca201044095004a2e6c358f3a4c90ebc))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* **props:** adapt props for synchro-charts ([#133](https://github.com/awslabs/iot-app-kit/issues/133)) ([a98bf06](https://github.com/awslabs/iot-app-kit/commit/a98bf064f14979823f51437dbd599259b6bd6d78))
* **react-comp:** isThresholdBreached checks all comparison ops ([de3fe49](https://github.com/awslabs/iot-app-kit/commit/de3fe495b764d45dd9c364b93f2e5898d2cb661e))
* **react-components:** publish TimeSync component as part of the public API ([#621](https://github.com/awslabs/iot-app-kit/issues/621)) ([a4e2f66](https://github.com/awslabs/iot-app-kit/commit/a4e2f66e6a0a2d58eb1a5316ac3fab4520dd3161))
* **react-components:** release useViewport hook ([#631](https://github.com/awslabs/iot-app-kit/issues/631)) ([794b4a4](https://github.com/awslabs/iot-app-kit/commit/794b4a49c70824836ac0fadf8008d0937059d16d))
* **react-comp:** sync viewports using @iot-app-kit/charts pckg ([08c7eda](https://github.com/awslabs/iot-app-kit/commit/08c7eda38c600120aebe228285c5c1dc311ab8af))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **ReactComponents:** support alarms via thresholds ingested from useTimeSeriesData hook ([4df9ff0](https://github.com/awslabs/iot-app-kit/commit/4df9ff00083239e3eb32b7766ec16396a5f7deb4))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))
* **time-sync:** useViewport returns a group ([c12349b](https://github.com/awslabs/iot-app-kit/commit/c12349b17e7ed917babd394a05c7a47f0b8bccc0))
* **TimeSync:** add a lastUsedBy string to the useViewport hook ([526f059](https://github.com/awslabs/iot-app-kit/commit/526f059dcfe74d8590b9ee0add435700d3ed943d))
* **TwinMaker:** Add TwinMaker packages ([#252](https://github.com/awslabs/iot-app-kit/issues/252)) ([fabbe03](https://github.com/awslabs/iot-app-kit/commit/fabbe0399dd37293e99588124404c37c929f4330))


### Bug Fixes

* **BarChart:** prevent bar chart from trying to request raw data by default ([6845d95](https://github.com/awslabs/iot-app-kit/commit/6845d95789861a1d6d97cfb4322f6371983de729))
* **charts:** fix live mode viewport scrollingbug ([dbea3ff](https://github.com/awslabs/iot-app-kit/commit/dbea3ff3f1908a6a48b1ca9ee5c654f9b55eb616))
* **components:** fix connector to iot app kit components ([be91864](https://github.com/awslabs/iot-app-kit/commit/be91864aee326c1c3fd5320b30b86d34f9f246d0))
* **dashboard:** update props passed to kpi and status components based on new api ([e2023c9](https://github.com/awslabs/iot-app-kit/commit/e2023c92ecfea6cac947f5c5f795001395ad2bd4))
* **react-components, videoPlayer:** fix propertiesNotChanged for videoPlayer ([11665c0](https://github.com/awslabs/iot-app-kit/commit/11665c0af13e98dc6602d8bf8aac7733d063633c))
* **react-components:** fix binding styles in `useTimeSeriesData` hook ([c1c0125](https://github.com/awslabs/iot-app-kit/commit/c1c012577448c6e07090b23ad988e39a3d530bb6))
* **react-components:** set timezone for jest to UTC to prevent local test failures ([44c3793](https://github.com/awslabs/iot-app-kit/commit/44c379338a2a9110600a0502e37ae4dceaf0ab09))
* **ReactComponents:** configure table, kpi and status to always fetch raw data ([c02b566](https://github.com/awslabs/iot-app-kit/commit/c02b566cad9aa2b8e700765f7923df2d4a6fbec4))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* **UITests:** fix dashbaord e2e tests ([dd98c0e](https://github.com/awslabs/iot-app-kit/commit/dd98c0ea9ccd6a7dacc9ee5f994ccce7007f0b21))
* **video-player:** use static timestamps instead dynamic ones ([1e434a6](https://github.com/awslabs/iot-app-kit/commit/1e434a6632c6dd797f9d0dacd3ed3547622d93c9))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/core bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 4.0.3 to 5.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/source-iotsitewise bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/testing-util bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/ts-config bumped from 4.0.3 to 5.0.0
    * eslint-config-iot-app-kit bumped from 4.0.3 to 5.0.0

## [4.0.3](https://github.com/awslabs/iot-app-kit/compare/react-components-v4.0.2...react-components-v4.0.3) (2023-03-31)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))

### Features

* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([64e64b8](https://github.com/awslabs/iot-app-kit/commit/64e64b800ad3b6ddbee78cfe84c3750e73dead65))
* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* backfill component integration tests ([#66](https://github.com/awslabs/iot-app-kit/issues/66)) ([4f17201](https://github.com/awslabs/iot-app-kit/commit/4f17201f5990876b67861f091dbdcdb5345a28c2))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([16451b1](https://github.com/awslabs/iot-app-kit/commit/16451b12e0fe2662069275185b2fea61048d3fab))
* **dashboard:** add table support to dashboard ([1d8d44e](https://github.com/awslabs/iot-app-kit/commit/1d8d44e2a7bb67811de9702efa23dbdd5653f572))
* **dashboard:** assign default color based on cloudscape design ([5855096](https://github.com/awslabs/iot-app-kit/commit/58550960ce402c6e18ee25ffee87945a6aeb4f77))
* **dashboard:** initial dashboard work ([06cc210](https://github.com/awslabs/iot-app-kit/commit/06cc21079dc0446a06c72db676dba27f05a1606f))
* **EnvironmentModel:** Adding support for environment overlay ([#262](https://github.com/awslabs/iot-app-kit/issues/262)) ([0277027](https://github.com/awslabs/iot-app-kit/commit/0277027d59f232c2c8e29fac0bc53399a1eb9c1e))
* improve documentation and clarity of react-components pkg ([#60](https://github.com/awslabs/iot-app-kit/issues/60)) ([f4239cf](https://github.com/awslabs/iot-app-kit/commit/f4239cf1ca201044095004a2e6c358f3a4c90ebc))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* **props:** adapt props for synchro-charts ([#133](https://github.com/awslabs/iot-app-kit/issues/133)) ([a98bf06](https://github.com/awslabs/iot-app-kit/commit/a98bf064f14979823f51437dbd599259b6bd6d78))
* **react-comp:** isThresholdBreached checks all comparison ops ([de3fe49](https://github.com/awslabs/iot-app-kit/commit/de3fe495b764d45dd9c364b93f2e5898d2cb661e))
* **react-components:** publish TimeSync component as part of the public API ([#621](https://github.com/awslabs/iot-app-kit/issues/621)) ([a4e2f66](https://github.com/awslabs/iot-app-kit/commit/a4e2f66e6a0a2d58eb1a5316ac3fab4520dd3161))
* **react-components:** release useViewport hook ([#631](https://github.com/awslabs/iot-app-kit/issues/631)) ([794b4a4](https://github.com/awslabs/iot-app-kit/commit/794b4a49c70824836ac0fadf8008d0937059d16d))
* **react-comp:** sync viewports using @iot-app-kit/charts pckg ([08c7eda](https://github.com/awslabs/iot-app-kit/commit/08c7eda38c600120aebe228285c5c1dc311ab8af))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **ReactComponents:** support alarms via thresholds ingested from useTimeSeriesData hook ([4df9ff0](https://github.com/awslabs/iot-app-kit/commit/4df9ff00083239e3eb32b7766ec16396a5f7deb4))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))
* **time-sync:** useViewport returns a group ([c12349b](https://github.com/awslabs/iot-app-kit/commit/c12349b17e7ed917babd394a05c7a47f0b8bccc0))
* **TimeSync:** add a lastUsedBy string to the useViewport hook ([526f059](https://github.com/awslabs/iot-app-kit/commit/526f059dcfe74d8590b9ee0add435700d3ed943d))
* **TwinMaker:** Add TwinMaker packages ([#252](https://github.com/awslabs/iot-app-kit/issues/252)) ([fabbe03](https://github.com/awslabs/iot-app-kit/commit/fabbe0399dd37293e99588124404c37c929f4330))


### Bug Fixes

* **BarChart:** prevent bar chart from trying to request raw data by default ([6845d95](https://github.com/awslabs/iot-app-kit/commit/6845d95789861a1d6d97cfb4322f6371983de729))
* **charts:** fix live mode viewport scrollingbug ([dbea3ff](https://github.com/awslabs/iot-app-kit/commit/dbea3ff3f1908a6a48b1ca9ee5c654f9b55eb616))
* **components:** fix connector to iot app kit components ([be91864](https://github.com/awslabs/iot-app-kit/commit/be91864aee326c1c3fd5320b30b86d34f9f246d0))
* **dashboard:** update props passed to kpi and status components based on new api ([e2023c9](https://github.com/awslabs/iot-app-kit/commit/e2023c92ecfea6cac947f5c5f795001395ad2bd4))
* **react-components, videoPlayer:** fix propertiesNotChanged for videoPlayer ([11665c0](https://github.com/awslabs/iot-app-kit/commit/11665c0af13e98dc6602d8bf8aac7733d063633c))
* **react-components:** fix binding styles in `useTimeSeriesData` hook ([c1c0125](https://github.com/awslabs/iot-app-kit/commit/c1c012577448c6e07090b23ad988e39a3d530bb6))
* **react-components:** set timezone for jest to UTC to prevent local test failures ([44c3793](https://github.com/awslabs/iot-app-kit/commit/44c379338a2a9110600a0502e37ae4dceaf0ab09))
* **ReactComponents:** configure table, kpi and status to always fetch raw data ([c02b566](https://github.com/awslabs/iot-app-kit/commit/c02b566cad9aa2b8e700765f7923df2d4a6fbec4))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* **UITests:** fix dashbaord e2e tests ([dd98c0e](https://github.com/awslabs/iot-app-kit/commit/dd98c0ea9ccd6a7dacc9ee5f994ccce7007f0b21))
* **video-player:** use static timestamps instead dynamic ones ([1e434a6](https://github.com/awslabs/iot-app-kit/commit/1e434a6632c6dd797f9d0dacd3ed3547622d93c9))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/core bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/source-iottwinmaker bumped from 4.0.2 to 4.0.3
  * devDependencies
    * @iot-app-kit/jest-config bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/source-iotsitewise bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/testing-util bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/ts-config bumped from 4.0.2 to 4.0.3
    * eslint-config-iot-app-kit bumped from 4.0.2 to 4.0.3

## [4.0.2](https://github.com/awslabs/iot-app-kit/compare/react-components-v4.0.1...react-components-v4.0.2) (2023-03-30)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))

### Features

* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([64e64b8](https://github.com/awslabs/iot-app-kit/commit/64e64b800ad3b6ddbee78cfe84c3750e73dead65))
* backfill component integration tests ([#66](https://github.com/awslabs/iot-app-kit/issues/66)) ([4f17201](https://github.com/awslabs/iot-app-kit/commit/4f17201f5990876b67861f091dbdcdb5345a28c2))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([16451b1](https://github.com/awslabs/iot-app-kit/commit/16451b12e0fe2662069275185b2fea61048d3fab))
* **dashboard:** add table support to dashboard ([1d8d44e](https://github.com/awslabs/iot-app-kit/commit/1d8d44e2a7bb67811de9702efa23dbdd5653f572))
* **dashboard:** assign default color based on cloudscape design ([5855096](https://github.com/awslabs/iot-app-kit/commit/58550960ce402c6e18ee25ffee87945a6aeb4f77))
* **dashboard:** initial dashboard work ([06cc210](https://github.com/awslabs/iot-app-kit/commit/06cc21079dc0446a06c72db676dba27f05a1606f))
* **EnvironmentModel:** Adding support for environment overlay ([#262](https://github.com/awslabs/iot-app-kit/issues/262)) ([0277027](https://github.com/awslabs/iot-app-kit/commit/0277027d59f232c2c8e29fac0bc53399a1eb9c1e))
* improve documentation and clarity of react-components pkg ([#60](https://github.com/awslabs/iot-app-kit/issues/60)) ([f4239cf](https://github.com/awslabs/iot-app-kit/commit/f4239cf1ca201044095004a2e6c358f3a4c90ebc))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* **props:** adapt props for synchro-charts ([#133](https://github.com/awslabs/iot-app-kit/issues/133)) ([a98bf06](https://github.com/awslabs/iot-app-kit/commit/a98bf064f14979823f51437dbd599259b6bd6d78))
* **react-comp:** isThresholdBreached checks all comparison ops ([de3fe49](https://github.com/awslabs/iot-app-kit/commit/de3fe495b764d45dd9c364b93f2e5898d2cb661e))
* **react-components:** publish TimeSync component as part of the public API ([#621](https://github.com/awslabs/iot-app-kit/issues/621)) ([a4e2f66](https://github.com/awslabs/iot-app-kit/commit/a4e2f66e6a0a2d58eb1a5316ac3fab4520dd3161))
* **react-components:** release useViewport hook ([#631](https://github.com/awslabs/iot-app-kit/issues/631)) ([794b4a4](https://github.com/awslabs/iot-app-kit/commit/794b4a49c70824836ac0fadf8008d0937059d16d))
* **react-comp:** sync viewports using @iot-app-kit/charts pckg ([08c7eda](https://github.com/awslabs/iot-app-kit/commit/08c7eda38c600120aebe228285c5c1dc311ab8af))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **ReactComponents:** support alarms via thresholds ingested from useTimeSeriesData hook ([4df9ff0](https://github.com/awslabs/iot-app-kit/commit/4df9ff00083239e3eb32b7766ec16396a5f7deb4))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))
* **time-sync:** useViewport returns a group ([c12349b](https://github.com/awslabs/iot-app-kit/commit/c12349b17e7ed917babd394a05c7a47f0b8bccc0))
* **TimeSync:** add a lastUsedBy string to the useViewport hook ([526f059](https://github.com/awslabs/iot-app-kit/commit/526f059dcfe74d8590b9ee0add435700d3ed943d))
* **TwinMaker:** Add TwinMaker packages ([#252](https://github.com/awslabs/iot-app-kit/issues/252)) ([fabbe03](https://github.com/awslabs/iot-app-kit/commit/fabbe0399dd37293e99588124404c37c929f4330))


### Bug Fixes

* **BarChart:** prevent bar chart from trying to request raw data by default ([6845d95](https://github.com/awslabs/iot-app-kit/commit/6845d95789861a1d6d97cfb4322f6371983de729))
* **charts:** fix live mode viewport scrollingbug ([dbea3ff](https://github.com/awslabs/iot-app-kit/commit/dbea3ff3f1908a6a48b1ca9ee5c654f9b55eb616))
* **components:** fix connector to iot app kit components ([be91864](https://github.com/awslabs/iot-app-kit/commit/be91864aee326c1c3fd5320b30b86d34f9f246d0))
* **dashboard:** update props passed to kpi and status components based on new api ([e2023c9](https://github.com/awslabs/iot-app-kit/commit/e2023c92ecfea6cac947f5c5f795001395ad2bd4))
* **react-components, videoPlayer:** fix propertiesNotChanged for videoPlayer ([11665c0](https://github.com/awslabs/iot-app-kit/commit/11665c0af13e98dc6602d8bf8aac7733d063633c))
* **react-components:** fix binding styles in `useTimeSeriesData` hook ([c1c0125](https://github.com/awslabs/iot-app-kit/commit/c1c012577448c6e07090b23ad988e39a3d530bb6))
* **react-components:** set timezone for jest to UTC to prevent local test failures ([44c3793](https://github.com/awslabs/iot-app-kit/commit/44c379338a2a9110600a0502e37ae4dceaf0ab09))
* **ReactComponents:** configure table, kpi and status to always fetch raw data ([c02b566](https://github.com/awslabs/iot-app-kit/commit/c02b566cad9aa2b8e700765f7923df2d4a6fbec4))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* **UITests:** fix dashbaord e2e tests ([dd98c0e](https://github.com/awslabs/iot-app-kit/commit/dd98c0ea9ccd6a7dacc9ee5f994ccce7007f0b21))
* **video-player:** use static timestamps instead dynamic ones ([1e434a6](https://github.com/awslabs/iot-app-kit/commit/1e434a6632c6dd797f9d0dacd3ed3547622d93c9))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 4.0.1 to 4.0.2
    * @iot-app-kit/core bumped from 4.0.1 to 4.0.2
    * @iot-app-kit/source-iottwinmaker bumped from 4.0.1 to 4.0.2
  * devDependencies
    * @iot-app-kit/jest-config bumped from * to 4.0.2
    * @iot-app-kit/source-iotsitewise bumped from 4.0.1 to 4.0.2
    * @iot-app-kit/testing-util bumped from * to 4.0.2
    * @iot-app-kit/ts-config bumped from * to 4.0.2
    * eslint-config-iot-app-kit bumped from * to 4.0.2

## [4.0.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v4.0.0...react-components-v4.0.1) (2023-03-28)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations

### Features

* **ReactComponents:** support alarms via thresholds ingested from useTimeSeriesData hook ([4df9ff0](https://github.com/awslabs/iot-app-kit/commit/4df9ff00083239e3eb32b7766ec16396a5f7deb4))
* **time-sync:** useViewport returns a group ([c12349b](https://github.com/awslabs/iot-app-kit/commit/c12349b17e7ed917babd394a05c7a47f0b8bccc0))
* **TimeSync:** add a lastUsedBy string to the useViewport hook ([526f059](https://github.com/awslabs/iot-app-kit/commit/526f059dcfe74d8590b9ee0add435700d3ed943d))


### Bug Fixes

* **BarChart:** prevent bar chart from trying to request raw data by default ([6845d95](https://github.com/awslabs/iot-app-kit/commit/6845d95789861a1d6d97cfb4322f6371983de729))
* **react-components:** fix binding styles in `useTimeSeriesData` hook ([c1c0125](https://github.com/awslabs/iot-app-kit/commit/c1c012577448c6e07090b23ad988e39a3d530bb6))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 4.0.0 to 4.0.1
    * @iot-app-kit/core bumped from 4.0.0 to 4.0.1
    * @iot-app-kit/source-iottwinmaker bumped from 4.0.0 to 4.0.1
  * devDependencies
    * @iot-app-kit/source-iotsitewise bumped from ^4.0.0 to ^4.0.1

## [4.0.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v3.0.0...react-components-v4.0.0) (2023-03-15)


### ⚠ BREAKING CHANGES

* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper

### Features

* **dashboard:** add table support to dashboard ([1d8d44e](https://github.com/awslabs/iot-app-kit/commit/1d8d44e2a7bb67811de9702efa23dbdd5653f572))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))


### Bug Fixes

* **components:** fix connector to iot app kit components ([be91864](https://github.com/awslabs/iot-app-kit/commit/be91864aee326c1c3fd5320b30b86d34f9f246d0))
* **react-components:** set timezone for jest to UTC to prevent local test failures ([44c3793](https://github.com/awslabs/iot-app-kit/commit/44c379338a2a9110600a0502e37ae4dceaf0ab09))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 3.0.0 to 4.0.0
    * @iot-app-kit/core bumped from 3.0.0 to 4.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 3.0.0 to 4.0.0
  * devDependencies
    * @iot-app-kit/source-iotsitewise bumped from ^3.0.0 to ^4.0.0

## [3.0.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.6.5...react-components-v3.0.0) (2023-03-04)


### ⚠ BREAKING CHANGES

* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))

### Features

* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* **dashboard:** initial dashboard work ([06cc210](https://github.com/awslabs/iot-app-kit/commit/06cc21079dc0446a06c72db676dba27f05a1606f))
* **react-components:** publish TimeSync component as part of the public API ([#621](https://github.com/awslabs/iot-app-kit/issues/621)) ([a4e2f66](https://github.com/awslabs/iot-app-kit/commit/a4e2f66e6a0a2d58eb1a5316ac3fab4520dd3161))
* **react-components:** release useViewport hook ([#631](https://github.com/awslabs/iot-app-kit/issues/631)) ([794b4a4](https://github.com/awslabs/iot-app-kit/commit/794b4a49c70824836ac0fadf8008d0937059d16d))


### Bug Fixes

* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from * to 3.0.0
    * @iot-app-kit/core bumped from * to 3.0.0
    * @iot-app-kit/source-iottwinmaker bumped from * to 3.0.0

## [2.6.5](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.6.4...react-components-v2.6.5) (2023-01-25)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.4 to ^2.6.5
    * @iot-app-kit/components bumped from ^2.6.4 to ^2.6.5
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.4 to ^2.6.5

## [2.6.4](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.6.3...react-components-v2.6.4) (2023-01-23)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.3 to ^2.6.4
    * @iot-app-kit/components bumped from ^2.6.3 to ^2.6.4
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.3 to ^2.6.4

## [2.6.3](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.6.2...react-components-v2.6.3) (2023-01-13)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.2 to ^2.6.3
    * @iot-app-kit/components bumped from ^2.6.2 to ^2.6.3
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.2 to ^2.6.3

## [2.6.2](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.6.1...react-components-v2.6.2) (2023-01-09)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.1 to ^2.6.2
    * @iot-app-kit/components bumped from ^2.6.1 to ^2.6.2
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.1 to ^2.6.2

## [2.6.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.6.0...react-components-v2.6.1) (2023-01-09)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.0 to ^2.6.1
    * @iot-app-kit/components bumped from ^2.6.0 to ^2.6.1
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.0 to ^2.6.1

## [2.6.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.5.1...react-components-v2.6.0) (2022-12-19)


### Bug Fixes

* **video-player:** use static timestamps instead dynamic ones ([1e434a6](https://github.com/awslabs/iot-app-kit/commit/1e434a6632c6dd797f9d0dacd3ed3547622d93c9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.5.1 to ^2.6.0
    * @iot-app-kit/components bumped from ^2.5.1 to ^2.6.0
    * @iot-app-kit/source-iottwinmaker bumped from ^2.5.1 to ^2.6.0

## [2.5.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.5.0...react-components-v2.5.1) (2022-11-16)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.5.0 to ^2.5.1
    * @iot-app-kit/components bumped from ^2.5.0 to ^2.5.1
    * @iot-app-kit/source-iottwinmaker bumped from ^2.5.0 to ^2.5.1

## [2.5.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.4.2...react-components-v2.5.0) (2022-11-11)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.2 to ^2.5.0
    * @iot-app-kit/components bumped from ^2.4.2 to ^2.5.0
    * @iot-app-kit/source-iottwinmaker bumped from ^2.4.2 to ^2.5.0

## [2.4.2](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.4.1...react-components-v2.4.2) (2022-11-08)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.1 to ^2.4.2
    * @iot-app-kit/components bumped from ^2.4.1 to ^2.4.2
    * @iot-app-kit/source-iottwinmaker bumped from ^2.4.1 to ^2.4.2

## [2.4.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.4.0...react-components-v2.4.1) (2022-11-07)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.0 to ^2.4.1
    * @iot-app-kit/components bumped from ^2.4.0 to ^2.4.1
    * @iot-app-kit/source-iottwinmaker bumped from ^2.4.0 to ^2.4.1

## [2.4.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.3.0...react-components-v2.4.0) (2022-11-04)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.3.0 to ^2.4.0
    * @iot-app-kit/components bumped from ^2.3.0 to ^2.4.0
    * @iot-app-kit/source-iottwinmaker bumped from ^2.3.0 to ^2.4.0

## [2.3.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v2.2.0...react-components-v2.3.0) (2022-11-02)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.2.0 to ^2.3.0
    * @iot-app-kit/components bumped from ^2.2.0 to ^2.3.0
    * @iot-app-kit/source-iottwinmaker bumped from ^2.2.0 to ^2.3.0

## 2.2.0 (2022-10-21)

### Features

* source-iotsitewise, core, components:
  * Introduce alarms support ([9bc221e](https://github.com/awslabs/iot-app-kit/commit/9bc221ef19fc5a9db4360c1d124f41e7b0d896be))

* react-components, scene-composer:
  * EnvironmentModelComponent for Adding support for environment overlay ([eb91179](https://github.com/awslabs/iot-app-kit/commit/eb911799e555c07c535853661e93237969159ff0))

* core, components:
  * Support viewport grouping in iot-table ([be5b588](https://github.com/awslabs/iot-app-kit/commit/be5b588a90ec267a2c8cdce24bdea86b45c97136))

* scene-composer:
  * Removes the dependency on the feature flag for the top bar camera drowpdown ([fb8e333](https://github.com/awslabs/iot-app-kit/commit/fb8e3330cc4f4933ccd6f9cde32b1d4694897358))
  * Add flag to resizable tags ([560e1b1](https://github.com/awslabs/iot-app-kit/commit/560e1b1a2db0f60700b7246626c71f1bc05f49e1))

### Bug Fixes

* scene-composer:
  * Camera Component Editor for Lens and Clipping planes updates when changing between cameras ([94c5978](https://github.com/awslabs/iot-app-kit/commit/94c59786aae02a4c9fd088cfc6c9cea516880f3c))
  * improve ViewCursorWidget performance ([58b70bd](https://github.com/awslabs/iot-app-kit/commit/58b70bdc82cd1e4bbcc0c0e7f66bfef3f064e86b))
  * Allows user to hit Esc key to cancel Enhanced Editing ([9c1b9e6](https://github.com/awslabs/iot-app-kit/commit/9c1b9e64c725671adb0766d1c080297389385fd8))
  * selectedDataBinding not able to update selected node ([b23bce2](https://github.com/awslabs/iot-app-kit/commit/b23bce279b81496583c052a0dc69ac9be5994643))
  * use arrow data as texture to avoid public path issue ([0d2e427](https://github.com/awslabs/iot-app-kit/commit/0d2e427354cbd3c0678d579ceaffab84e5e88e5c))
  * fix show svg ([cb6094e](https://github.com/awslabs/iot-app-kit/commit/cb6094e724465ccc11d9f7ae7f7fe3179d4d2596))
  * fix adding tag always attached to root ([775446a](https://github.com/awslabs/iot-app-kit/commit/775446a210877780c2a220092e6b0210edc7ea2c))
  * Fix the tag scaling with parent scale regression ([4483140](https://github.com/awslabs/iot-app-kit/commit/448314018882912a49c8522786bc8ae3c964b7aa))
  * SceneHierarchy Tree Performance ([c74d1dc](https://github.com/awslabs/iot-app-kit/commit/c74d1dc8be97135529d55e994834e7dd3f352ee8))
  * Minimum FOV check introduced ([720b8e8](https://github.com/awslabs/iot-app-kit/commit/720b8e85d3b8329c898638030e32ad1e910c4e62))
  * Fix the camera zoom field locked to 1 or greater ([cada75e](https://github.com/awslabs/iot-app-kit/commit/cada75ec32c81312bf5ee403f10bbf4567c30c05))
  * Add success popup message when updating camera location ([4af9c07](https://github.com/awslabs/iot-app-kit/commit/4af9c0758c8adc04f35c80fae2f39b60460e903a))
  * Update the text from Cameras in the drop down to Camera View ([5687f5e](https://github.com/awslabs/iot-app-kit/commit/5687f5efc38dabbd0ec06ccc5e395576fa3d57e4))
  * fix model shader material color restore ([0786c4a](https://github.com/awslabs/iot-app-kit/commit/0786c4a038cbe93be8a4d7a4b2f7a57bfacd76c2))
  * CSS updates to Scene Hierarchy ([ab3c749](https://github.com/awslabs/iot-app-kit/commit/ab3c7490add7338611533e6b68cecefe0f9cb3a1))

* core:
  * add currentTime param to viewportStartDate and `viewportEndDate` ([eb02085](https://github.com/awslabs/iot-app-kit/commit/eb02085fd3b0aa987c38278cedc8eba0e56d9fa9))

* react-components:
  * fix propertiesNotChanged for videoPlayer ([9a360b1](https://github.com/awslabs/iot-app-kit/commit/9a360b10fc87b2e31b4c6a00d9e49a5224e207d0))

### Documentation

* Updating scene-composer documentation for Storybook ([901ff53](https://github.com/awslabs/iot-app-kit/commit/901ff53efc86d0c68f0cbc15dc7be9dfc00b0243))
* add TwinMaker components to GettingStarted doc ([84e9fdf](https://github.com/awslabs/iot-app-kit/commit/84e9fdfb3b1af3c47343a91ca1259e5e45f1eaac))

### Miscellaneous

* reduce concurrent workers in testing ([e8d6dbc](https://github.com/awslabs/iot-app-kit/commit/e8d6dbcac3f3e2e503e02db0087d5db324e9b521))
* easier linking for iot-app-kit packages ([44d454d](https://github.com/awslabs/iot-app-kit/commit/44d454d955e22581228d3d77829b8ad27a24fd52))

## 2.1.0 (2022-09-30)

### Features

* react-components:
  * add VideoPlayer and RequestVideoUpload components ([f08c541](https://github.com/awslabs/iot-app-kit/commit/f08c541f017f4bbefae085e45c2ef2e686eb5919))
* scene-composer:
  * add SceneViewer component ([f08c541](https://github.com/awslabs/iot-app-kit/commit/f08c541f017f4bbefae085e45c2ef2e686eb5919))
* source-iottwinmaker:
  * add source-iottwinmaker module ([f08c541](https://github.com/awslabs/iot-app-kit/commit/f08c541f017f4bbefae085e45c2ef2e686eb5919))

### Bug Fixes

* components:
  * import missing CSS style sheets. ([f2450bc](https://github.com/awslabs/iot-app-kit/commit/f2450bc17906bff2ad4ac065eb26b36726d530d6))

### Documentation

* add SceneViewer, VideoPlayer and AWSIoTTwinMakerSource documentation and link to main ([f08c541](https://github.com/awslabs/iot-app-kit/commit/f08c541f017f4bbefae085e45c2ef2e686eb5919) & [71e59be](https://github.com/awslabs/iot-app-kit/commit/71e59be2ad0abcabb9136cf88c3c6c1d16606390))
* doc: update link in Coding Guidelines ([ea041cd](https://github.com/awslabs/iot-app-kit/commit/ea041cd8aadcb65b08c5bc09e6baf2958dbbdd35))

### Miscellaneous

* update react / react-dom versions from >=16 to ^17 ([f08c541](https://github.com/awslabs/iot-app-kit/commit/f08c541f017f4bbefae085e45c2ef2e686eb5919))
* update jest versions from 28 to 27 to be consistent with other modules ([f08c541](https://github.com/awslabs/iot-app-kit/commit/f08c541f017f4bbefae085e45c2ef2e686eb5919))

## 2.0.0 (2022-09-14)

### Miscellaneous
* Migrate to NPM workspaces ([8e200be](https://github.com/awslabs/iot-app-kit/commit/8e200be0401fe6fa989cbf9a1ad96aafd8305a96))


## 1.4.0 (2022-06-09)


### Features

* support auto-assigning colors for certain components ([8df4f15](https://github.com/awslabs/iot-app-kit/commit/8df4f150be4d8d1d8c3b55fe46ec91e6d9a7bb9a))
* bump synchro-charts to 4.0.1 ([977f461](https://github.com/awslabs/iot-app-kit/commit/977f461504292409cbde7e82166fa32ef0c9a93c))
* add expanded property to iot-resource-explorer ([dda6ef8](https://github.com/awslabs/iot-app-kit/commit/dda6ef8957617cfcb1c99d4bea06036a896c6aae))




## 1.3.0 (2022-04-29)
* update documentation ([a9154ef](https://github.com/awslabs/iot-app-kit/commit/b02ed4a48f1e4cdbf948ac482062df6b3c9d2ab7))
* automatically define components for the react-components library ([a9154ef](https://github.com/awslabs/iot-app-kit/commit/b02ed4a48f1e4cdbf948ac482062df6b3c9d2ab7))

## 1.2.1 (2022-03-11)


### Bug Fixes

* unsubrscribe data provider on component updates ([a9154ef](https://github.com/awslabs/iot-app-kit/commit/a9154eff3f3fcd55eb5ae501354de8530f706108))





# 1.2.0 (2022-03-03)


### Bug Fixes

* attach ResourceExplorer react component onSelectionChange prop ([#81](https://github.com/awslabs/iot-app-kit/issues/81))


### Features

* export table react component ([#81](https://github.com/awslabs/iot-app-kit/issues/81))





# 1.1.0 (2022-03-01)


### Features

* Export global styles. This will allow imports from @iot-app-kit/components/styles.css ([#72](https://github.com/awslabs/iot-app-kit/issues/72))





# 1.0.0 (2022-02-28)


### Features

* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([1d14361](https://github.com/awslabs/iot-app-kit/commit/1d14361b88e86ea44ad2d38409dd53c96f550fd3))
* backfill component integration tests ([#66](https://github.com/awslabs/iot-app-kit/issues/66)) ([ac16b08](https://github.com/awslabs/iot-app-kit/commit/ac16b0807cdb86cbd700e38154bd7a563222560e))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([7b0f3cf](https://github.com/awslabs/iot-app-kit/commit/7b0f3cf443d89ff7f89f334d9c5abb7400ab084b))
* improve documentation and clarity of react-components pkg ([#60](https://github.com/awslabs/iot-app-kit/issues/60)) ([a1615f9](https://github.com/awslabs/iot-app-kit/commit/a1615f958371b14e75550df97e56e0deca3c34e3))
