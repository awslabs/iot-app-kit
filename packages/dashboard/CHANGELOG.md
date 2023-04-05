# Changelog

## [5.2.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.1.1...dashboard-v5.2.0) (2023-04-05)


### Bug Fixes

* **dashboard:** add buffer to dependencies so consuming apps don't need to install it ([bb9d48a](https://github.com/awslabs/iot-app-kit/commit/bb9d48a64c18dc925a788c2d8a1528ff3d26db30))
* **dashboard:** add css resets ([7e23bc1](https://github.com/awslabs/iot-app-kit/commit/7e23bc13ff99ff80d769d69558a96a44f138faba))
* **dashboard:** disable user select on drag to prevent text selection ([56b5d09](https://github.com/awslabs/iot-app-kit/commit/56b5d098ebfda31e9c200c5d665b90f158cadebd))
* **dashboard:** update type path in package json ([d4647e1](https://github.com/awslabs/iot-app-kit/commit/d4647e1b85eb8bcc2e343de954f9d51260c62a77))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/core bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/core-util bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/react-components bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/source-iotsitewise bumped from 5.1.1 to 5.2.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/testing-util bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/ts-config bumped from 5.1.1 to 5.2.0
    * eslint-config-iot-app-kit bumped from 5.1.1 to 5.2.0

## [5.1.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.1.0...dashboard-v5.1.1) (2023-04-03)


### Bug Fixes

* **dashboard:** allow gestures when widget is in error state ([7545487](https://github.com/awslabs/iot-app-kit/commit/754548700fdaff1d84db63d29d244fb411898241))
* **dashboard:** better empty thresholds pane ([493b9f2](https://github.com/awslabs/iot-app-kit/commit/493b9f2442f618617eaa6821fe9d89e3cb844f9a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/core bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/core-util bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/react-components bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/source-iotsitewise bumped from 5.1.0 to 5.1.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/testing-util bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/ts-config bumped from 5.1.0 to 5.1.1
    * eslint-config-iot-app-kit bumped from 5.1.0 to 5.1.1

## [5.1.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.0.0...dashboard-v5.1.0) (2023-04-03)


### Features

* **charts:** add legend to charts ([0abfcf6](https://github.com/awslabs/iot-app-kit/commit/0abfcf6c5a325ee24290d5ac990703e24f6db3f0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/core bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/core-util bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/react-components bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/source-iotsitewise bumped from 5.0.0 to 5.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/testing-util bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/ts-config bumped from 5.0.0 to 5.1.0
    * eslint-config-iot-app-kit bumped from 5.0.0 to 5.1.0

## [5.0.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v4.0.3...dashboard-v5.0.0) (2023-03-31)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper

### Features

* **all:** release 4.0.3 ([2b933ba](https://github.com/awslabs/iot-app-kit/commit/2b933ba31e60666323df7bfae0e962698636a4bf))
* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* **dashboard/components:** memoize components to prevent unnecessary re-renders ([50050ca](https://github.com/awslabs/iot-app-kit/commit/50050ca206efa320256b848f187854c11de85d73))
* **dashboard:** add alarm support for widgets ([bf7964a](https://github.com/awslabs/iot-app-kit/commit/bf7964ac18c66c3bcc979425f62a13a705bfae7c))
* **dashboard:** add input widet configuration ([#581](https://github.com/awslabs/iot-app-kit/issues/581)) ([a1bf180](https://github.com/awslabs/iot-app-kit/commit/a1bf18084aed3126dac0540a848a0e3b35492e32))
* **dashboard:** add selection and move components and actions ([13aa08e](https://github.com/awslabs/iot-app-kit/commit/13aa08e26c1a6fee6b791851fdd1a233ccc62e81))
* **dashboard:** add status timeline widget ([085ab29](https://github.com/awslabs/iot-app-kit/commit/085ab29fcd18778c6232bb6823b843dba8ae81e7))
* **dashboard:** add table support to dashboard ([1d8d44e](https://github.com/awslabs/iot-app-kit/commit/1d8d44e2a7bb67811de9702efa23dbdd5653f572))
* **dashboard:** alpha release of dashboard component ([a2f237e](https://github.com/awslabs/iot-app-kit/commit/a2f237ec0434cff0c3b765d5c46686b190620b53))
* **dashboard:** assign default color based on cloudscape design ([5855096](https://github.com/awslabs/iot-app-kit/commit/58550960ce402c6e18ee25ffee87945a6aeb4f77))
* **dashboard:** complete table support ([29bbb4c](https://github.com/awslabs/iot-app-kit/commit/29bbb4cb3297ed739390e349af9069ad6601c368))
* **dashboard:** define public api ([35910ba](https://github.com/awslabs/iot-app-kit/commit/35910ba8531ebe09468902fb87577357aaea4ddd))
* **dashboard:** disable asset drop for widgets that are not compatible with that data type ([31b8361](https://github.com/awslabs/iot-app-kit/commit/31b83611ffdd478ad2020dcac9dcf395caa2af79))
* **dashboard:** enable edit mode for text widget by default ([2b4db27](https://github.com/awslabs/iot-app-kit/commit/2b4db27d1acb468293d702c0a5aba02cdbd235cc))
* **dashboard:** enable font size dropdown selection ([fe25dd7](https://github.com/awslabs/iot-app-kit/commit/fe25dd70ed7c6a2ad54a196923cb1057abe7c97e))
* **dashboard:** initial dashboard work ([06cc210](https://github.com/awslabs/iot-app-kit/commit/06cc21079dc0446a06c72db676dba27f05a1606f))
* **dashboard:** initial scaffolding for input widget ([#566](https://github.com/awslabs/iot-app-kit/issues/566)) ([e6bbb46](https://github.com/awslabs/iot-app-kit/commit/e6bbb46cf738dceeb7a9a3a8873f0d148f182db8))
* **dashboard:** kpi and status widget empty states ([9dea96d](https://github.com/awslabs/iot-app-kit/commit/9dea96d8b6fb1f59ba2173510ebeb749ebe6233c))
* **dashboard:** refactor sitewise clients ([ddac5b2](https://github.com/awslabs/iot-app-kit/commit/ddac5b2626d24bf8bfacb840611b8b880b2c99af))
* **dashboard:** update resource explorer ([#613](https://github.com/awslabs/iot-app-kit/issues/613)) ([b75a33b](https://github.com/awslabs/iot-app-kit/commit/b75a33be0106ff341e66c219e7090f7f0c8f791b))
* **react-comp:** sync viewports using @iot-app-kit/charts pckg ([08c7eda](https://github.com/awslabs/iot-app-kit/commit/08c7eda38c600120aebe228285c5c1dc311ab8af))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))
* **resource explorer:** allow dashboard to only show asset name ([5df2c5c](https://github.com/awslabs/iot-app-kit/commit/5df2c5cf9f289360ea4a80f3188c7d16307b5e06))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))


### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **charts:** fix live mode viewport scrollingbug ([dbea3ff](https://github.com/awslabs/iot-app-kit/commit/dbea3ff3f1908a6a48b1ca9ee5c654f9b55eb616))
* **composer:** Removing dashboard package to fix pipeline ([#338](https://github.com/awslabs/iot-app-kit/issues/338)) ([9a2c991](https://github.com/awslabs/iot-app-kit/commit/9a2c9917729a5a8b273920aec91e47bacf8b8251))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* **dashboard:** add guard on widget sizes & positions and dispatch relative actions from side panel ([12044ec](https://github.com/awslabs/iot-app-kit/commit/12044ec65af159b4f65ba41af8134271536c3dda))
* **dashboard:** add node polyfill and svg plugin ([08ca02d](https://github.com/awslabs/iot-app-kit/commit/08ca02de6c475978334a629bf0995dd803333a29))
* **dashboard:** bugfix for color reset on new property drop ([05c04e6](https://github.com/awslabs/iot-app-kit/commit/05c04e6db3beeca398d0c288209fe9ba2bffc1c4))
* **dashboard:** constrain drag start and endpoint in grid ([ea2b875](https://github.com/awslabs/iot-app-kit/commit/ea2b8757adcf26f9cd6afc0db36031159d2e0142))
* **dashboard:** fix edit mode bugs ([2e88abf](https://github.com/awslabs/iot-app-kit/commit/2e88abf6c7ec72f192ec272b13c3d66101646734))
* **dashboard:** fix grid scrolling issues ([bbb43aa](https://github.com/awslabs/iot-app-kit/commit/bbb43aa70e73ed19f2d7641f78f3f123e22edd2d))
* **dashboard:** fix layering of widgets with selection and context menu ([f98d5e7](https://github.com/awslabs/iot-app-kit/commit/f98d5e7642d6c73ad88206391e418347b840b69b))
* **dashboard:** fix resizing issue ([024feb9](https://github.com/awslabs/iot-app-kit/commit/024feb923500f9e798c4a84b94aa5667ce1ce3b4))
* **dashboard:** fix styling for component palette and add tests for drag and drop ([41fd944](https://github.com/awslabs/iot-app-kit/commit/41fd944edcfdd0159aec29dd86b5f0b3dc17ff23))
* **dashboard:** fix the build ([c160031](https://github.com/awslabs/iot-app-kit/commit/c16003156ed22e85b1569a7b3e5024c53b8a4be4))
* **dashboard:** grow asset properties panel ([#628](https://github.com/awslabs/iot-app-kit/issues/628)) ([89fb6b6](https://github.com/awslabs/iot-app-kit/commit/89fb6b6e0c8b76068febb7810e0425080b436d27))
* **dashboard:** hide y axis settings for status timeline component ([217899a](https://github.com/awslabs/iot-app-kit/commit/217899a787f1076806fa977d29491058da0caf5f))
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **dashboard:** remove chart suffix from empty states ([28e4c09](https://github.com/awslabs/iot-app-kit/commit/28e4c09b56896f0083d501b2f0f1fe9d536deb7e))
* **dashboard:** remove font dropdown and text position dropdowns ([bc4ca9a](https://github.com/awslabs/iot-app-kit/commit/bc4ca9acae3dce98af991e689139ecc3f8486b20))
* **dashboard:** remove tailing digits on widget dragging. ([b89c5f7](https://github.com/awslabs/iot-app-kit/commit/b89c5f794adc782b51090d13e6bd47b6169e5c0a))
* **dashboard:** remove testing-util as a dependency ([8f7bce5](https://github.com/awslabs/iot-app-kit/commit/8f7bce54b9c1f9615fba4e40ea89462d6d96f05f))
* **dashboard:** remove widget background color ([7392aad](https://github.com/awslabs/iot-app-kit/commit/7392aad1d6800a3c932f196788e9fe9085c9beee))
* **dashboard:** resolve pretty paths in storybook ([#588](https://github.com/awslabs/iot-app-kit/issues/588)) ([a82178e](https://github.com/awslabs/iot-app-kit/commit/a82178ebc7f05375b1108aad98cb4cfd966dd20e))
* **dashboard:** support decimals for thresholds ([3cfd8a4](https://github.com/awslabs/iot-app-kit/commit/3cfd8a44d6028486a9f7b6cb4694a828d23bbb56))
* **DashboardToolbar:** remove scrollbar from toolbar ([8a18a25](https://github.com/awslabs/iot-app-kit/commit/8a18a250106d16bcad2f8bda63f0fc2a42c9f47b))
* **dashboard:** update props passed to kpi and status components based on new api ([e2023c9](https://github.com/awslabs/iot-app-kit/commit/e2023c92ecfea6cac947f5c5f795001395ad2bd4))
* **dashboard:** update side panel styling to remove sass variable references ([36d8648](https://github.com/awslabs/iot-app-kit/commit/36d8648818edba3b83f8a36912290ef641cacd9a))
* **dashboard:** use sentence casting in headers ([90ff030](https://github.com/awslabs/iot-app-kit/commit/90ff0308693d6110438659b5b4d1241a0b8a8f84))
* **UITests:** fix dashbaord e2e tests ([dd98c0e](https://github.com/awslabs/iot-app-kit/commit/dd98c0ea9ccd6a7dacc9ee5f994ccce7007f0b21))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/core bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/core-util bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/react-components bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/source-iotsitewise bumped from 4.0.3 to 5.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/testing-util bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/ts-config bumped from 4.0.3 to 5.0.0
    * eslint-config-iot-app-kit bumped from 4.0.3 to 5.0.0

## [4.0.3](https://github.com/awslabs/iot-app-kit/compare/dashboard-v4.0.2...dashboard-v4.0.3) (2023-03-31)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper

### Features

* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* **dashboard/components:** memoize components to prevent unnecessary re-renders ([50050ca](https://github.com/awslabs/iot-app-kit/commit/50050ca206efa320256b848f187854c11de85d73))
* **dashboard:** add alarm support for widgets ([bf7964a](https://github.com/awslabs/iot-app-kit/commit/bf7964ac18c66c3bcc979425f62a13a705bfae7c))
* **dashboard:** add input widet configuration ([#581](https://github.com/awslabs/iot-app-kit/issues/581)) ([a1bf180](https://github.com/awslabs/iot-app-kit/commit/a1bf18084aed3126dac0540a848a0e3b35492e32))
* **dashboard:** add selection and move components and actions ([13aa08e](https://github.com/awslabs/iot-app-kit/commit/13aa08e26c1a6fee6b791851fdd1a233ccc62e81))
* **dashboard:** add status timeline widget ([085ab29](https://github.com/awslabs/iot-app-kit/commit/085ab29fcd18778c6232bb6823b843dba8ae81e7))
* **dashboard:** add table support to dashboard ([1d8d44e](https://github.com/awslabs/iot-app-kit/commit/1d8d44e2a7bb67811de9702efa23dbdd5653f572))
* **dashboard:** alpha release of dashboard component ([a2f237e](https://github.com/awslabs/iot-app-kit/commit/a2f237ec0434cff0c3b765d5c46686b190620b53))
* **dashboard:** assign default color based on cloudscape design ([5855096](https://github.com/awslabs/iot-app-kit/commit/58550960ce402c6e18ee25ffee87945a6aeb4f77))
* **dashboard:** complete table support ([29bbb4c](https://github.com/awslabs/iot-app-kit/commit/29bbb4cb3297ed739390e349af9069ad6601c368))
* **dashboard:** define public api ([35910ba](https://github.com/awslabs/iot-app-kit/commit/35910ba8531ebe09468902fb87577357aaea4ddd))
* **dashboard:** disable asset drop for widgets that are not compatible with that data type ([31b8361](https://github.com/awslabs/iot-app-kit/commit/31b83611ffdd478ad2020dcac9dcf395caa2af79))
* **dashboard:** enable edit mode for text widget by default ([2b4db27](https://github.com/awslabs/iot-app-kit/commit/2b4db27d1acb468293d702c0a5aba02cdbd235cc))
* **dashboard:** enable font size dropdown selection ([fe25dd7](https://github.com/awslabs/iot-app-kit/commit/fe25dd70ed7c6a2ad54a196923cb1057abe7c97e))
* **dashboard:** initial dashboard work ([06cc210](https://github.com/awslabs/iot-app-kit/commit/06cc21079dc0446a06c72db676dba27f05a1606f))
* **dashboard:** initial scaffolding for input widget ([#566](https://github.com/awslabs/iot-app-kit/issues/566)) ([e6bbb46](https://github.com/awslabs/iot-app-kit/commit/e6bbb46cf738dceeb7a9a3a8873f0d148f182db8))
* **dashboard:** kpi and status widget empty states ([9dea96d](https://github.com/awslabs/iot-app-kit/commit/9dea96d8b6fb1f59ba2173510ebeb749ebe6233c))
* **dashboard:** refactor sitewise clients ([ddac5b2](https://github.com/awslabs/iot-app-kit/commit/ddac5b2626d24bf8bfacb840611b8b880b2c99af))
* **dashboard:** update resource explorer ([#613](https://github.com/awslabs/iot-app-kit/issues/613)) ([b75a33b](https://github.com/awslabs/iot-app-kit/commit/b75a33be0106ff341e66c219e7090f7f0c8f791b))
* **react-comp:** sync viewports using @iot-app-kit/charts pckg ([08c7eda](https://github.com/awslabs/iot-app-kit/commit/08c7eda38c600120aebe228285c5c1dc311ab8af))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))
* **resource explorer:** allow dashboard to only show asset name ([5df2c5c](https://github.com/awslabs/iot-app-kit/commit/5df2c5cf9f289360ea4a80f3188c7d16307b5e06))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))


### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **charts:** fix live mode viewport scrollingbug ([dbea3ff](https://github.com/awslabs/iot-app-kit/commit/dbea3ff3f1908a6a48b1ca9ee5c654f9b55eb616))
* **composer:** Removing dashboard package to fix pipeline ([#338](https://github.com/awslabs/iot-app-kit/issues/338)) ([9a2c991](https://github.com/awslabs/iot-app-kit/commit/9a2c9917729a5a8b273920aec91e47bacf8b8251))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* **dashboard:** add guard on widget sizes & positions and dispatch relative actions from side panel ([12044ec](https://github.com/awslabs/iot-app-kit/commit/12044ec65af159b4f65ba41af8134271536c3dda))
* **dashboard:** add node polyfill and svg plugin ([08ca02d](https://github.com/awslabs/iot-app-kit/commit/08ca02de6c475978334a629bf0995dd803333a29))
* **dashboard:** bugfix for color reset on new property drop ([05c04e6](https://github.com/awslabs/iot-app-kit/commit/05c04e6db3beeca398d0c288209fe9ba2bffc1c4))
* **dashboard:** constrain drag start and endpoint in grid ([ea2b875](https://github.com/awslabs/iot-app-kit/commit/ea2b8757adcf26f9cd6afc0db36031159d2e0142))
* **dashboard:** fix edit mode bugs ([2e88abf](https://github.com/awslabs/iot-app-kit/commit/2e88abf6c7ec72f192ec272b13c3d66101646734))
* **dashboard:** fix grid scrolling issues ([bbb43aa](https://github.com/awslabs/iot-app-kit/commit/bbb43aa70e73ed19f2d7641f78f3f123e22edd2d))
* **dashboard:** fix layering of widgets with selection and context menu ([f98d5e7](https://github.com/awslabs/iot-app-kit/commit/f98d5e7642d6c73ad88206391e418347b840b69b))
* **dashboard:** fix resizing issue ([024feb9](https://github.com/awslabs/iot-app-kit/commit/024feb923500f9e798c4a84b94aa5667ce1ce3b4))
* **dashboard:** fix styling for component palette and add tests for drag and drop ([41fd944](https://github.com/awslabs/iot-app-kit/commit/41fd944edcfdd0159aec29dd86b5f0b3dc17ff23))
* **dashboard:** fix the build ([c160031](https://github.com/awslabs/iot-app-kit/commit/c16003156ed22e85b1569a7b3e5024c53b8a4be4))
* **dashboard:** grow asset properties panel ([#628](https://github.com/awslabs/iot-app-kit/issues/628)) ([89fb6b6](https://github.com/awslabs/iot-app-kit/commit/89fb6b6e0c8b76068febb7810e0425080b436d27))
* **dashboard:** hide y axis settings for status timeline component ([217899a](https://github.com/awslabs/iot-app-kit/commit/217899a787f1076806fa977d29491058da0caf5f))
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **dashboard:** remove chart suffix from empty states ([28e4c09](https://github.com/awslabs/iot-app-kit/commit/28e4c09b56896f0083d501b2f0f1fe9d536deb7e))
* **dashboard:** remove font dropdown and text position dropdowns ([bc4ca9a](https://github.com/awslabs/iot-app-kit/commit/bc4ca9acae3dce98af991e689139ecc3f8486b20))
* **dashboard:** remove tailing digits on widget dragging. ([b89c5f7](https://github.com/awslabs/iot-app-kit/commit/b89c5f794adc782b51090d13e6bd47b6169e5c0a))
* **dashboard:** remove testing-util as a dependency ([8f7bce5](https://github.com/awslabs/iot-app-kit/commit/8f7bce54b9c1f9615fba4e40ea89462d6d96f05f))
* **dashboard:** remove widget background color ([7392aad](https://github.com/awslabs/iot-app-kit/commit/7392aad1d6800a3c932f196788e9fe9085c9beee))
* **dashboard:** resolve pretty paths in storybook ([#588](https://github.com/awslabs/iot-app-kit/issues/588)) ([a82178e](https://github.com/awslabs/iot-app-kit/commit/a82178ebc7f05375b1108aad98cb4cfd966dd20e))
* **dashboard:** support decimals for thresholds ([3cfd8a4](https://github.com/awslabs/iot-app-kit/commit/3cfd8a44d6028486a9f7b6cb4694a828d23bbb56))
* **DashboardToolbar:** remove scrollbar from toolbar ([8a18a25](https://github.com/awslabs/iot-app-kit/commit/8a18a250106d16bcad2f8bda63f0fc2a42c9f47b))
* **dashboard:** update props passed to kpi and status components based on new api ([e2023c9](https://github.com/awslabs/iot-app-kit/commit/e2023c92ecfea6cac947f5c5f795001395ad2bd4))
* **dashboard:** update side panel styling to remove sass variable references ([36d8648](https://github.com/awslabs/iot-app-kit/commit/36d8648818edba3b83f8a36912290ef641cacd9a))
* **dashboard:** use sentence casting in headers ([90ff030](https://github.com/awslabs/iot-app-kit/commit/90ff0308693d6110438659b5b4d1241a0b8a8f84))
* **UITests:** fix dashbaord e2e tests ([dd98c0e](https://github.com/awslabs/iot-app-kit/commit/dd98c0ea9ccd6a7dacc9ee5f994ccce7007f0b21))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/core bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/core-util bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/react-components bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/source-iotsitewise bumped from 4.0.2 to 4.0.3
  * devDependencies
    * @iot-app-kit/jest-config bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/testing-util bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/ts-config bumped from 4.0.2 to 4.0.3
    * eslint-config-iot-app-kit bumped from 4.0.2 to 4.0.3

## [4.0.2](https://github.com/awslabs/iot-app-kit/compare/dashboard-v4.0.1...dashboard-v4.0.2) (2023-03-30)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper

### Features

* **dashboard/components:** memoize components to prevent unnecessary re-renders ([50050ca](https://github.com/awslabs/iot-app-kit/commit/50050ca206efa320256b848f187854c11de85d73))
* **dashboard:** add alarm support for widgets ([bf7964a](https://github.com/awslabs/iot-app-kit/commit/bf7964ac18c66c3bcc979425f62a13a705bfae7c))
* **dashboard:** add input widet configuration ([#581](https://github.com/awslabs/iot-app-kit/issues/581)) ([a1bf180](https://github.com/awslabs/iot-app-kit/commit/a1bf18084aed3126dac0540a848a0e3b35492e32))
* **dashboard:** add selection and move components and actions ([13aa08e](https://github.com/awslabs/iot-app-kit/commit/13aa08e26c1a6fee6b791851fdd1a233ccc62e81))
* **dashboard:** add status timeline widget ([085ab29](https://github.com/awslabs/iot-app-kit/commit/085ab29fcd18778c6232bb6823b843dba8ae81e7))
* **dashboard:** add table support to dashboard ([1d8d44e](https://github.com/awslabs/iot-app-kit/commit/1d8d44e2a7bb67811de9702efa23dbdd5653f572))
* **dashboard:** alpha release of dashboard component ([a2f237e](https://github.com/awslabs/iot-app-kit/commit/a2f237ec0434cff0c3b765d5c46686b190620b53))
* **dashboard:** assign default color based on cloudscape design ([5855096](https://github.com/awslabs/iot-app-kit/commit/58550960ce402c6e18ee25ffee87945a6aeb4f77))
* **dashboard:** complete table support ([29bbb4c](https://github.com/awslabs/iot-app-kit/commit/29bbb4cb3297ed739390e349af9069ad6601c368))
* **dashboard:** define public api ([35910ba](https://github.com/awslabs/iot-app-kit/commit/35910ba8531ebe09468902fb87577357aaea4ddd))
* **dashboard:** disable asset drop for widgets that are not compatible with that data type ([31b8361](https://github.com/awslabs/iot-app-kit/commit/31b83611ffdd478ad2020dcac9dcf395caa2af79))
* **dashboard:** enable edit mode for text widget by default ([2b4db27](https://github.com/awslabs/iot-app-kit/commit/2b4db27d1acb468293d702c0a5aba02cdbd235cc))
* **dashboard:** enable font size dropdown selection ([fe25dd7](https://github.com/awslabs/iot-app-kit/commit/fe25dd70ed7c6a2ad54a196923cb1057abe7c97e))
* **dashboard:** initial dashboard work ([06cc210](https://github.com/awslabs/iot-app-kit/commit/06cc21079dc0446a06c72db676dba27f05a1606f))
* **dashboard:** initial scaffolding for input widget ([#566](https://github.com/awslabs/iot-app-kit/issues/566)) ([e6bbb46](https://github.com/awslabs/iot-app-kit/commit/e6bbb46cf738dceeb7a9a3a8873f0d148f182db8))
* **dashboard:** kpi and status widget empty states ([9dea96d](https://github.com/awslabs/iot-app-kit/commit/9dea96d8b6fb1f59ba2173510ebeb749ebe6233c))
* **dashboard:** refactor sitewise clients ([ddac5b2](https://github.com/awslabs/iot-app-kit/commit/ddac5b2626d24bf8bfacb840611b8b880b2c99af))
* **dashboard:** update resource explorer ([#613](https://github.com/awslabs/iot-app-kit/issues/613)) ([b75a33b](https://github.com/awslabs/iot-app-kit/commit/b75a33be0106ff341e66c219e7090f7f0c8f791b))
* **react-comp:** sync viewports using @iot-app-kit/charts pckg ([08c7eda](https://github.com/awslabs/iot-app-kit/commit/08c7eda38c600120aebe228285c5c1dc311ab8af))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))
* **resource explorer:** allow dashboard to only show asset name ([5df2c5c](https://github.com/awslabs/iot-app-kit/commit/5df2c5cf9f289360ea4a80f3188c7d16307b5e06))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))


### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **charts:** fix live mode viewport scrollingbug ([dbea3ff](https://github.com/awslabs/iot-app-kit/commit/dbea3ff3f1908a6a48b1ca9ee5c654f9b55eb616))
* **composer:** Removing dashboard package to fix pipeline ([#338](https://github.com/awslabs/iot-app-kit/issues/338)) ([9a2c991](https://github.com/awslabs/iot-app-kit/commit/9a2c9917729a5a8b273920aec91e47bacf8b8251))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* **dashboard:** add guard on widget sizes & positions and dispatch relative actions from side panel ([12044ec](https://github.com/awslabs/iot-app-kit/commit/12044ec65af159b4f65ba41af8134271536c3dda))
* **dashboard:** add node polyfill and svg plugin ([08ca02d](https://github.com/awslabs/iot-app-kit/commit/08ca02de6c475978334a629bf0995dd803333a29))
* **dashboard:** bugfix for color reset on new property drop ([05c04e6](https://github.com/awslabs/iot-app-kit/commit/05c04e6db3beeca398d0c288209fe9ba2bffc1c4))
* **dashboard:** constrain drag start and endpoint in grid ([ea2b875](https://github.com/awslabs/iot-app-kit/commit/ea2b8757adcf26f9cd6afc0db36031159d2e0142))
* **dashboard:** fix edit mode bugs ([2e88abf](https://github.com/awslabs/iot-app-kit/commit/2e88abf6c7ec72f192ec272b13c3d66101646734))
* **dashboard:** fix grid scrolling issues ([bbb43aa](https://github.com/awslabs/iot-app-kit/commit/bbb43aa70e73ed19f2d7641f78f3f123e22edd2d))
* **dashboard:** fix layering of widgets with selection and context menu ([f98d5e7](https://github.com/awslabs/iot-app-kit/commit/f98d5e7642d6c73ad88206391e418347b840b69b))
* **dashboard:** fix resizing issue ([024feb9](https://github.com/awslabs/iot-app-kit/commit/024feb923500f9e798c4a84b94aa5667ce1ce3b4))
* **dashboard:** fix styling for component palette and add tests for drag and drop ([41fd944](https://github.com/awslabs/iot-app-kit/commit/41fd944edcfdd0159aec29dd86b5f0b3dc17ff23))
* **dashboard:** fix the build ([c160031](https://github.com/awslabs/iot-app-kit/commit/c16003156ed22e85b1569a7b3e5024c53b8a4be4))
* **dashboard:** grow asset properties panel ([#628](https://github.com/awslabs/iot-app-kit/issues/628)) ([89fb6b6](https://github.com/awslabs/iot-app-kit/commit/89fb6b6e0c8b76068febb7810e0425080b436d27))
* **dashboard:** hide y axis settings for status timeline component ([217899a](https://github.com/awslabs/iot-app-kit/commit/217899a787f1076806fa977d29491058da0caf5f))
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **dashboard:** remove chart suffix from empty states ([28e4c09](https://github.com/awslabs/iot-app-kit/commit/28e4c09b56896f0083d501b2f0f1fe9d536deb7e))
* **dashboard:** remove font dropdown and text position dropdowns ([bc4ca9a](https://github.com/awslabs/iot-app-kit/commit/bc4ca9acae3dce98af991e689139ecc3f8486b20))
* **dashboard:** remove tailing digits on widget dragging. ([b89c5f7](https://github.com/awslabs/iot-app-kit/commit/b89c5f794adc782b51090d13e6bd47b6169e5c0a))
* **dashboard:** remove testing-util as a dependency ([8f7bce5](https://github.com/awslabs/iot-app-kit/commit/8f7bce54b9c1f9615fba4e40ea89462d6d96f05f))
* **dashboard:** remove widget background color ([7392aad](https://github.com/awslabs/iot-app-kit/commit/7392aad1d6800a3c932f196788e9fe9085c9beee))
* **dashboard:** resolve pretty paths in storybook ([#588](https://github.com/awslabs/iot-app-kit/issues/588)) ([a82178e](https://github.com/awslabs/iot-app-kit/commit/a82178ebc7f05375b1108aad98cb4cfd966dd20e))
* **dashboard:** support decimals for thresholds ([3cfd8a4](https://github.com/awslabs/iot-app-kit/commit/3cfd8a44d6028486a9f7b6cb4694a828d23bbb56))
* **DashboardToolbar:** remove scrollbar from toolbar ([8a18a25](https://github.com/awslabs/iot-app-kit/commit/8a18a250106d16bcad2f8bda63f0fc2a42c9f47b))
* **dashboard:** update props passed to kpi and status components based on new api ([e2023c9](https://github.com/awslabs/iot-app-kit/commit/e2023c92ecfea6cac947f5c5f795001395ad2bd4))
* **dashboard:** update side panel styling to remove sass variable references ([36d8648](https://github.com/awslabs/iot-app-kit/commit/36d8648818edba3b83f8a36912290ef641cacd9a))
* **dashboard:** use sentence casting in headers ([90ff030](https://github.com/awslabs/iot-app-kit/commit/90ff0308693d6110438659b5b4d1241a0b8a8f84))
* **UITests:** fix dashbaord e2e tests ([dd98c0e](https://github.com/awslabs/iot-app-kit/commit/dd98c0ea9ccd6a7dacc9ee5f994ccce7007f0b21))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 4.0.1 to 4.0.2
    * @iot-app-kit/core bumped from 4.0.1 to 4.0.2
    * @iot-app-kit/core-util bumped from * to 4.0.2
    * @iot-app-kit/react-components bumped from 4.0.1 to 4.0.2
    * @iot-app-kit/source-iotsitewise bumped from 4.0.1 to 4.0.2
  * devDependencies
    * @iot-app-kit/jest-config bumped from * to 4.0.2
    * @iot-app-kit/testing-util bumped from * to 4.0.2
    * @iot-app-kit/ts-config bumped from * to 4.0.2
    * eslint-config-iot-app-kit bumped from * to 4.0.2

## [4.0.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v4.0.0...dashboard-v4.0.1) (2023-03-28)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations

### Features

* **dashboard/components:** memoize components to prevent unnecessary re-renders ([50050ca](https://github.com/awslabs/iot-app-kit/commit/50050ca206efa320256b848f187854c11de85d73))
* **dashboard:** kpi and status widget empty states ([9dea96d](https://github.com/awslabs/iot-app-kit/commit/9dea96d8b6fb1f59ba2173510ebeb749ebe6233c))
* **dashboard:** refactor sitewise clients ([ddac5b2](https://github.com/awslabs/iot-app-kit/commit/ddac5b2626d24bf8bfacb840611b8b880b2c99af))
* **resource explorer:** allow dashboard to only show asset name ([5df2c5c](https://github.com/awslabs/iot-app-kit/commit/5df2c5cf9f289360ea4a80f3188c7d16307b5e06))


### Bug Fixes

* **dashboard:** constrain drag start and endpoint in grid ([ea2b875](https://github.com/awslabs/iot-app-kit/commit/ea2b8757adcf26f9cd6afc0db36031159d2e0142))
* **dashboard:** fix resizing issue ([024feb9](https://github.com/awslabs/iot-app-kit/commit/024feb923500f9e798c4a84b94aa5667ce1ce3b4))
* **dashboard:** remove chart suffix from empty states ([28e4c09](https://github.com/awslabs/iot-app-kit/commit/28e4c09b56896f0083d501b2f0f1fe9d536deb7e))
* **dashboard:** support decimals for thresholds ([3cfd8a4](https://github.com/awslabs/iot-app-kit/commit/3cfd8a44d6028486a9f7b6cb4694a828d23bbb56))
* **DashboardToolbar:** remove scrollbar from toolbar ([8a18a25](https://github.com/awslabs/iot-app-kit/commit/8a18a250106d16bcad2f8bda63f0fc2a42c9f47b))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from ^4.0.0 to ^4.0.1
    * @iot-app-kit/core bumped from ^4.0.0 to ^4.0.1
    * @iot-app-kit/react-components bumped from 4.0.0 to 4.0.1
    * @iot-app-kit/source-iotsitewise bumped from 4.0.0 to 4.0.1

## [4.0.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v3.0.0...dashboard-v4.0.0) (2023-03-15)


### ⚠ BREAKING CHANGES

* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper

### Features

* **dashboard:** add alarm support for widgets ([bf7964a](https://github.com/awslabs/iot-app-kit/commit/bf7964ac18c66c3bcc979425f62a13a705bfae7c))
* **dashboard:** add table support to dashboard ([1d8d44e](https://github.com/awslabs/iot-app-kit/commit/1d8d44e2a7bb67811de9702efa23dbdd5653f572))
* **dashboard:** complete table support ([29bbb4c](https://github.com/awslabs/iot-app-kit/commit/29bbb4cb3297ed739390e349af9069ad6601c368))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))


### Bug Fixes

* **dashboard:** add guard on widget sizes & positions and dispatch relative actions from side panel ([12044ec](https://github.com/awslabs/iot-app-kit/commit/12044ec65af159b4f65ba41af8134271536c3dda))
* **dashboard:** fix edit mode bugs ([2e88abf](https://github.com/awslabs/iot-app-kit/commit/2e88abf6c7ec72f192ec272b13c3d66101646734))
* **dashboard:** fix styling for component palette and add tests for drag and drop ([41fd944](https://github.com/awslabs/iot-app-kit/commit/41fd944edcfdd0159aec29dd86b5f0b3dc17ff23))
* **dashboard:** fix the build ([c160031](https://github.com/awslabs/iot-app-kit/commit/c16003156ed22e85b1569a7b3e5024c53b8a4be4))
* **dashboard:** remove widget background color ([7392aad](https://github.com/awslabs/iot-app-kit/commit/7392aad1d6800a3c932f196788e9fe9085c9beee))
* **dashboard:** update side panel styling to remove sass variable references ([36d8648](https://github.com/awslabs/iot-app-kit/commit/36d8648818edba3b83f8a36912290ef641cacd9a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from ^3.0.0 to ^4.0.0
    * @iot-app-kit/core bumped from ^3.0.0 to ^4.0.0
    * @iot-app-kit/react-components bumped from 3.0.0 to 4.0.0
    * @iot-app-kit/source-iotsitewise bumped from 3.0.0 to 4.0.0

## [3.0.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v2.6.5...dashboard-v3.0.0) (2023-03-04)


### Features

* **dashboard:** add input widet configuration ([#581](https://github.com/awslabs/iot-app-kit/issues/581)) ([a1bf180](https://github.com/awslabs/iot-app-kit/commit/a1bf18084aed3126dac0540a848a0e3b35492e32))
* **dashboard:** add selection and move components and actions ([13aa08e](https://github.com/awslabs/iot-app-kit/commit/13aa08e26c1a6fee6b791851fdd1a233ccc62e81))
* **dashboard:** alpha release of dashboard component ([a2f237e](https://github.com/awslabs/iot-app-kit/commit/a2f237ec0434cff0c3b765d5c46686b190620b53))
* **dashboard:** initial dashboard work ([06cc210](https://github.com/awslabs/iot-app-kit/commit/06cc21079dc0446a06c72db676dba27f05a1606f))
* **dashboard:** initial scaffolding for input widget ([#566](https://github.com/awslabs/iot-app-kit/issues/566)) ([e6bbb46](https://github.com/awslabs/iot-app-kit/commit/e6bbb46cf738dceeb7a9a3a8873f0d148f182db8))
* **dashboard:** update resource explorer ([#613](https://github.com/awslabs/iot-app-kit/issues/613)) ([b75a33b](https://github.com/awslabs/iot-app-kit/commit/b75a33be0106ff341e66c219e7090f7f0c8f791b))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))


### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **composer:** Removing dashboard package to fix pipeline ([#338](https://github.com/awslabs/iot-app-kit/issues/338)) ([9a2c991](https://github.com/awslabs/iot-app-kit/commit/9a2c9917729a5a8b273920aec91e47bacf8b8251))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* **dashboard:** add node polyfill and svg plugin ([08ca02d](https://github.com/awslabs/iot-app-kit/commit/08ca02de6c475978334a629bf0995dd803333a29))
* **dashboard:** fix layering of widgets with selection and context menu ([f98d5e7](https://github.com/awslabs/iot-app-kit/commit/f98d5e7642d6c73ad88206391e418347b840b69b))
* **dashboard:** grow asset properties panel ([#628](https://github.com/awslabs/iot-app-kit/issues/628)) ([89fb6b6](https://github.com/awslabs/iot-app-kit/commit/89fb6b6e0c8b76068febb7810e0425080b436d27))
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **dashboard:** remove tailing digits on widget dragging. ([b89c5f7](https://github.com/awslabs/iot-app-kit/commit/b89c5f794adc782b51090d13e6bd47b6169e5c0a))
* **dashboard:** resolve pretty paths in storybook ([#588](https://github.com/awslabs/iot-app-kit/issues/588)) ([a82178e](https://github.com/awslabs/iot-app-kit/commit/a82178ebc7f05375b1108aad98cb4cfd966dd20e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from * to 3.0.0
    * @iot-app-kit/core bumped from * to 3.0.0
    * @iot-app-kit/react-components bumped from * to 3.0.0
    * @iot-app-kit/source-iotsitewise bumped from * to 3.0.0

## [2.4.2](https://github.com/awslabs/iot-app-kit/compare/dashboard-v2.4.1...dashboard-v2.4.2) (2022-11-08)


### Miscellaneous Chores

* **dashboard:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.1 to ^2.4.2
    * @iot-app-kit/source-iotsitewise bumped from ^2.4.1 to ^2.4.2

## [2.4.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v2.4.0...dashboard-v2.4.1) (2022-11-07)


### Miscellaneous Chores

* **dashboard:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.0 to ^2.4.1
    * @iot-app-kit/source-iotsitewise bumped from ^2.4.0 to ^2.4.1

## [2.4.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v2.3.0...dashboard-v2.4.0) (2022-11-04)


### Features

* **dashboard:** add selection and move components and actions ([13aa08e](https://github.com/awslabs/iot-app-kit/commit/13aa08e26c1a6fee6b791851fdd1a233ccc62e81))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.2.0 to ^2.4.0
    * @iot-app-kit/source-iotsitewise bumped from ^2.2.0 to ^2.4.0

## 2.3.0 (2022-11-02)


### Features

* **dashboard:** alpha release of dashboard component ([f13002e](https://github.com/awslabs/iot-app-kit/commit/f13002e9df6e683de4fd88bbde1c55d36630830c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.2.0 to ^2.3.0
    * @iot-app-kit/source-iotsitewise bumped from ^2.2.0 to ^2.3.0
