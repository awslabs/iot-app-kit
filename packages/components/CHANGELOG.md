# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.0](https://github.com/awslabs/iot-app-kit/compare/components-v3.0.0...components-v4.0.0) (2023-03-15)


### ⚠ BREAKING CHANGES

* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper

### Features

* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))


### Bug Fixes

* **components:** fix connector to iot app kit components ([be91864](https://github.com/awslabs/iot-app-kit/commit/be91864aee326c1c3fd5320b30b86d34f9f246d0))
* **typescript:** re-enables typescript for component package tests ([12f60b7](https://github.com/awslabs/iot-app-kit/commit/12f60b7847853e17d398e6346d470606467e2d5c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 3.0.0 to 4.0.0
    * @iot-app-kit/related-table bumped from 3.0.0 to 4.0.0
    * @iot-app-kit/source-iotsitewise bumped from 3.0.0 to 4.0.0

## [3.0.0](https://github.com/awslabs/iot-app-kit/compare/components-v2.6.5...components-v3.0.0) (2023-03-04)


### ⚠ BREAKING CHANGES

* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))

### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 3.0.0
    * @iot-app-kit/related-table bumped from * to 3.0.0
    * @iot-app-kit/source-iotsitewise bumped from * to 3.0.0
    * @iot-app-kit/table bumped from * to 3.0.0

## [2.6.5](https://github.com/awslabs/iot-app-kit/compare/components-v2.6.4...components-v2.6.5) (2023-01-25)


### Bug Fixes

* use viewport from provider ([#515](https://github.com/awslabs/iot-app-kit/issues/515)) ([eb515a5](https://github.com/awslabs/iot-app-kit/commit/eb515a58cb807f421ca62004bb07cc3bdcb7cc50))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.4 to ^2.6.5
    * @iot-app-kit/related-table bumped from ^2.6.4 to ^2.6.5
    * @iot-app-kit/source-iotsitewise bumped from ^2.6.4 to ^2.6.5
    * @iot-app-kit/table bumped from ^2.6.4 to ^2.6.5

## [2.6.4](https://github.com/awslabs/iot-app-kit/compare/components-v2.6.3...components-v2.6.4) (2023-01-23)


### Miscellaneous Chores

* **components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.3 to ^2.6.4
    * @iot-app-kit/related-table bumped from ^2.6.3 to ^2.6.4
    * @iot-app-kit/source-iotsitewise bumped from ^2.6.3 to ^2.6.4
    * @iot-app-kit/table bumped from ^2.6.3 to ^2.6.4

## [2.6.3](https://github.com/awslabs/iot-app-kit/compare/components-v2.6.2...components-v2.6.3) (2023-01-13)


### Miscellaneous Chores

* **components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.2 to ^2.6.3
    * @iot-app-kit/related-table bumped from ^2.6.2 to ^2.6.3
    * @iot-app-kit/source-iotsitewise bumped from ^2.6.2 to ^2.6.3
    * @iot-app-kit/table bumped from ^2.6.2 to ^2.6.3

## [2.6.2](https://github.com/awslabs/iot-app-kit/compare/components-v2.6.1...components-v2.6.2) (2023-01-09)


### Bug Fixes

* prevent stream render if dataType unknown ([#448](https://github.com/awslabs/iot-app-kit/issues/448)) ([16999db](https://github.com/awslabs/iot-app-kit/commit/16999dbf8ed18770cccda0c993041a57e1c3d0c0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.1 to ^2.6.2
    * @iot-app-kit/related-table bumped from ^2.6.1 to ^2.6.2
    * @iot-app-kit/source-iotsitewise bumped from ^2.6.1 to ^2.6.2
    * @iot-app-kit/table bumped from ^2.6.1 to ^2.6.2

## [2.6.1](https://github.com/awslabs/iot-app-kit/compare/components-v2.6.0...components-v2.6.1) (2023-01-09)


### Miscellaneous Chores

* **components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.0 to ^2.6.1
    * @iot-app-kit/related-table bumped from ^2.6.0 to ^2.6.1
    * @iot-app-kit/source-iotsitewise bumped from ^2.6.0 to ^2.6.1
    * @iot-app-kit/table bumped from ^2.6.0 to ^2.6.1

## [2.6.0](https://github.com/awslabs/iot-app-kit/compare/components-v2.5.1...components-v2.6.0) (2022-12-19)


### Features

* prevent unsupported data types from being rendered ([#426](https://github.com/awslabs/iot-app-kit/issues/426)) ([dec2a86](https://github.com/awslabs/iot-app-kit/commit/dec2a86f0eccfe87ebfc32d89f74fb8695bb552d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.5.1 to ^2.6.0
    * @iot-app-kit/related-table bumped from ^2.5.1 to ^2.6.0
    * @iot-app-kit/source-iotsitewise bumped from ^2.5.1 to ^2.6.0
    * @iot-app-kit/table bumped from ^2.5.1 to ^2.6.0

## [2.5.1](https://github.com/awslabs/iot-app-kit/compare/components-v2.5.0...components-v2.5.1) (2022-11-16)


### Miscellaneous Chores

* **components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.5.0 to ^2.5.1
    * @iot-app-kit/related-table bumped from ^2.5.0 to ^2.5.1
    * @iot-app-kit/source-iotsitewise bumped from ^2.5.0 to ^2.5.1
    * @iot-app-kit/table bumped from ^2.5.0 to ^2.5.1

## [2.5.0](https://github.com/awslabs/iot-app-kit/compare/components-v2.4.2...components-v2.5.0) (2022-11-11)


### Miscellaneous Chores

* **components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.2 to ^2.5.0
    * @iot-app-kit/related-table bumped from ^2.4.2 to ^2.5.0
    * @iot-app-kit/source-iotsitewise bumped from ^2.4.2 to ^2.5.0
    * @iot-app-kit/table bumped from ^2.4.2 to ^2.5.0

## [2.4.2](https://github.com/awslabs/iot-app-kit/compare/components-v2.4.1...components-v2.4.2) (2022-11-08)


### Miscellaneous Chores

* **components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.1 to ^2.4.2
    * @iot-app-kit/related-table bumped from ^2.4.1 to ^2.4.2
    * @iot-app-kit/source-iotsitewise bumped from ^2.4.1 to ^2.4.2
    * @iot-app-kit/table bumped from ^2.4.1 to ^2.4.2

## [2.4.1](https://github.com/awslabs/iot-app-kit/compare/components-v2.4.0...components-v2.4.1) (2022-11-07)


### Miscellaneous Chores

* **components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.0 to ^2.4.1
    * @iot-app-kit/related-table bumped from ^2.4.0 to ^2.4.1
    * @iot-app-kit/source-iotsitewise bumped from ^2.4.0 to ^2.4.1
    * @iot-app-kit/table bumped from ^2.4.0 to ^2.4.1

## [2.4.0](https://github.com/awslabs/iot-app-kit/compare/components-v2.3.0...components-v2.4.0) (2022-11-04)


### Miscellaneous Chores

* **components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.3.0 to ^2.4.0
    * @iot-app-kit/related-table bumped from ^2.3.0 to ^2.4.0
    * @iot-app-kit/source-iotsitewise bumped from ^2.3.0 to ^2.4.0
    * @iot-app-kit/table bumped from ^2.3.0 to ^2.4.0

## [2.3.0](https://github.com/awslabs/iot-app-kit/compare/components-v2.2.0...components-v2.3.0) (2022-11-02)


### Bug Fixes

* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([016c216](https://github.com/awslabs/iot-app-kit/commit/016c216c2934d150f94e595d3ebb34aaafa69e27))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.2.0 to ^2.3.0
    * @iot-app-kit/related-table bumped from ^2.2.0 to ^2.3.0
    * @iot-app-kit/source-iotsitewise bumped from ^2.2.0 to ^2.3.0
    * @iot-app-kit/table bumped from ^2.2.0 to ^2.3.0

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

### BREAKING CHANGES
* `@iot-app-kit/components/iot-table` now uses AWS-UI's table components (wrapped as a separated [table package](https://github.com/awslabs/iot-app-kit/blob/main/packages/table)) instead of Synchro-chart's table component.
  Because of this change, we have new APIs for `iot-table` component. Check this [documentation](https://github.com/awslabs/iot-app-kit/blob/main/docs/Table.md) for more information about new APIs and migration from old APIs.
* At current version (v2.0.0), `iot-table` does **NOT** support viewport groups. It will be added in a later version.

### Features
* introduce new table component supporting filtering and sorting. ([c75d4f0](https://github.com/awslabs/iot-app-kit/commit/c75d4f05b64c801c06ba45acd3b5df2fb7d2e30a))

### Miscellaneous
* bump synchro-charts/core version from v5 to v6 (#199) ([ad1e3e6](https://github.com/awslabs/iot-app-kit/commit/ad1e3e6108cc02d58060365ab4bad950f0e991cc))
* Migrate to NPM workspaces ([8e200be](https://github.com/awslabs/iot-app-kit/commit/8e200be0401fe6fa989cbf9a1ad96aafd8305a96))

## 1.5.0 (2022-07-09)


### Features

* synchro-charts version updated to 5.0.0

* Added properties to the following components:

IotBarChart:
* alarms
* axis
* gestures
* layout
* legend
* messageOverrides
* movement
* scale
* size
* trends

IotKpi:
* messageOverrides

IotLineChart:
* axis
* gestures
* layout
* legend
* messageOverrides
* movement
* scale
* size
* trends

IotScatterChart:
* alarms
* axis
* gestures
* layout
* legend
* messageOverrides
* movement
* scale
* size
* trends

IotStatusGrid:
* labelsConfig

IotStatusTimeline:
* alarms
* annotations
* axis
* gestures
* layout
* messageOverrides
* movement
* scale
* size

IotTable:
* messageOverrides
* trends

### Fixes

* integration tests asset model and asset summary mocks updated to return current response.




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


### Bug Fixes

* mock SDK in component tests ([#56](https://github.com/awslabs/iot-app-kit/issues/56)) ([7b6f7da](https://github.com/awslabs/iot-app-kit/commit/7b6f7daeaa5c40b068bdd2f3ba684da066ef3386))
* related-table eslint and prettier ([#10](https://github.com/awslabs/iot-app-kit/issues/10)) ([a75e64a](https://github.com/awslabs/iot-app-kit/commit/a75e64aafdccfe8df37f72b9a087dc3b06cacb00))
* remove prettier, enforce eslint on build ([#29](https://github.com/awslabs/iot-app-kit/issues/29)) ([225afef](https://github.com/awslabs/iot-app-kit/commit/225afeffb8ac57b662e5b0fbaa4aeda515bd2c48))
* requestBuffer ([#49](https://github.com/awslabs/iot-app-kit/issues/49)) ([4702ad5](https://github.com/awslabs/iot-app-kit/commit/4702ad52794341d174ccf95a19589014ee8bbaee))
* sitewise source time series module ([#71](https://github.com/awslabs/iot-app-kit/issues/71)) ([998d59f](https://github.com/awslabs/iot-app-kit/commit/998d59f63fed1c97a9529f54928719e58fc00c5d))
* testing ground DataModule parameter ([#17](https://github.com/awslabs/iot-app-kit/issues/17)) ([b4fde90](https://github.com/awslabs/iot-app-kit/commit/b4fde9002f67057fc938b90841eed1b1b6a42fc1))


### Features

* Add Asset Hierarchy loading & Asset Tree support ([6adc67e](https://github.com/awslabs/iot-app-kit/commit/6adc67eeb70871ea866ef22ca3a6ee63fb1499e3))
* Add Core SiteWise Asset Module ([1287af8](https://github.com/awslabs/iot-app-kit/commit/1287af8652d8be3bd1471414b552ba246802790b))
* add in styles overrides and refId in query ([#38](https://github.com/awslabs/iot-app-kit/issues/38)) ([7b82989](https://github.com/awslabs/iot-app-kit/commit/7b82989e00b7385effa6ab29337e88352a9aed63))
* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([1d14361](https://github.com/awslabs/iot-app-kit/commit/1d14361b88e86ea44ad2d38409dd53c96f550fd3))
* Add proposed API changes within types declarations ([#37](https://github.com/awslabs/iot-app-kit/issues/37)) ([d165299](https://github.com/awslabs/iot-app-kit/commit/d1652990dff23cdc398374cd549a7c4ac9dfb711))
* add support for resolution mapping ([#16](https://github.com/awslabs/iot-app-kit/issues/16)) ([1dad2b6](https://github.com/awslabs/iot-app-kit/commit/1dad2b663a60ef939e48b58dae5d9c3f07bc68a4))
* add test runner github action ([#8](https://github.com/awslabs/iot-app-kit/issues/8)) ([5a468ff](https://github.com/awslabs/iot-app-kit/commit/5a468fffcb237bfbec6e0573c8df71e5a9ca3929))
* allow to specify region for data-module ([#4](https://github.com/awslabs/iot-app-kit/issues/4)) ([e49716f](https://github.com/awslabs/iot-app-kit/commit/e49716fb3a137ec139e1c236bf5eb29573dab8c9))
* api simplification of requestSettings ([#27](https://github.com/awslabs/iot-app-kit/issues/27)) ([3d6f458](https://github.com/awslabs/iot-app-kit/commit/3d6f458e8987a7c61b9b4d931426f33ef016a3bd))
* backfill component integration tests ([#66](https://github.com/awslabs/iot-app-kit/issues/66)) ([ac16b08](https://github.com/awslabs/iot-app-kit/commit/ac16b0807cdb86cbd700e38154bd7a563222560e))
* bind gestures to components ([#31](https://github.com/awslabs/iot-app-kit/issues/31)) ([c48e114](https://github.com/awslabs/iot-app-kit/commit/c48e114486e60784e32bc2ceb708525435ad0db8))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([7b0f3cf](https://github.com/awslabs/iot-app-kit/commit/7b0f3cf443d89ff7f89f334d9c5abb7400ab084b))
* create tree table base component ([#15](https://github.com/awslabs/iot-app-kit/issues/15)) ([0e4412c](https://github.com/awslabs/iot-app-kit/commit/0e4412c7a3f73b2ffd56dbc7c44ee7afbc93b09f))
* customizable resolutions ([#23](https://github.com/awslabs/iot-app-kit/issues/23)) ([08129f1](https://github.com/awslabs/iot-app-kit/commit/08129f17ff9579123525f56735ae65e3602cb89e))
* error handling/data-module core ([#14](https://github.com/awslabs/iot-app-kit/issues/14)) ([cb85241](https://github.com/awslabs/iot-app-kit/commit/cb852416bc2fb941e119bea4f79cf7c12e39d099))
* explicitly type sitewise query ([#59](https://github.com/awslabs/iot-app-kit/issues/59)) ([96102b9](https://github.com/awslabs/iot-app-kit/commit/96102b94b4c799392b0c1620f6eaaf07bf6d4862))
* improve error handling ([#61](https://github.com/awslabs/iot-app-kit/issues/61)) ([183c01d](https://github.com/awslabs/iot-app-kit/commit/183c01d8f255c3e528aee79b58fbbc89f1567b31))
* introduce module coordinator ([#47](https://github.com/awslabs/iot-app-kit/issues/47)) ([3fb5076](https://github.com/awslabs/iot-app-kit/commit/3fb50764115d3f417e1ccf0320eb19e95c80759e))
* Onboard cypress with component test runner ([#34](https://github.com/awslabs/iot-app-kit/issues/34)) ([82479eb](https://github.com/awslabs/iot-app-kit/commit/82479eb4434344fbfd93c5d4773243b62edc1bc4))
* pass thru annotations ([#65](https://github.com/awslabs/iot-app-kit/issues/65)) ([22bca08](https://github.com/awslabs/iot-app-kit/commit/22bca08dea0cabef1e17931ee394dc54522fd7a8))
* query provider classes and TimeSeriesData support ([#51](https://github.com/awslabs/iot-app-kit/issues/51)) ([655e545](https://github.com/awslabs/iot-app-kit/commit/655e545b099ef7163a53d6fe71af9c980ce1ed64))
* refactor app kit ([#67](https://github.com/awslabs/iot-app-kit/issues/67)) ([ec1ba70](https://github.com/awslabs/iot-app-kit/commit/ec1ba7051e779f947d31aa8611e31d039f60b2be))
* Refactor Asset Tree to use the new Query/Provider system ([#62](https://github.com/awslabs/iot-app-kit/issues/62)) ([f21b230](https://github.com/awslabs/iot-app-kit/commit/f21b230cfe12bd51ebb29280ab8c20fedfaea7e8))
* Refactor Site Wise Asset session interface to support Promises ([#40](https://github.com/awslabs/iot-app-kit/issues/40)) ([d309262](https://github.com/awslabs/iot-app-kit/commit/d309262a97d38151a1352567a362b4abf2efd080))
* request data in descending order ([#30](https://github.com/awslabs/iot-app-kit/issues/30)) ([ffbbe19](https://github.com/awslabs/iot-app-kit/commit/ffbbe19a4842a179188487f38415bbc6b33ad49a))
* Resource Explorer ([#24](https://github.com/awslabs/iot-app-kit/issues/24)) ([2151f5e](https://github.com/awslabs/iot-app-kit/commit/2151f5e22516100404ac6ac7076ce27e25915e02))
* restructure mocks of sitewise to all be co-located ([#52](https://github.com/awslabs/iot-app-kit/issues/52)) ([5bafe89](https://github.com/awslabs/iot-app-kit/commit/5bafe89eb3122aa90c9fe25d8aac66658aa91551))
* sitewise components use query and provider ([#54](https://github.com/awslabs/iot-app-kit/issues/54)) ([dd24732](https://github.com/awslabs/iot-app-kit/commit/dd24732ea574441813c5af8e05773d8894732b4b))
* Sitewise Resource Explorer ([#21](https://github.com/awslabs/iot-app-kit/issues/21)) ([df030fa](https://github.com/awslabs/iot-app-kit/commit/df030fa33e5f7e86d4377adc0fc66753533ab88f))
* source-iotsitewise useable module ([#63](https://github.com/awslabs/iot-app-kit/issues/63)) ([9807c69](https://github.com/awslabs/iot-app-kit/commit/9807c69dae88933d43e67d5862526a87901e8810))
* Support multiple queries per subscription ([#39](https://github.com/awslabs/iot-app-kit/issues/39)) ([67b7afa](https://github.com/awslabs/iot-app-kit/commit/67b7afaca9d7979419e7ca80ce9f1dcc6294a346))
* update sitewise component interface ([#58](https://github.com/awslabs/iot-app-kit/issues/58)) ([afc672a](https://github.com/awslabs/iot-app-kit/commit/afc672a8e425f95eac28d7b14c16ce422a8f6abf))
