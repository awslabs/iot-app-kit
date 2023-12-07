# Changelog

## [9.10.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.9.1...dashboard-v9.10.0) (2023-12-07)


### Features

* tabs on config panel present that are unusable [#2308](https://github.com/awslabs/iot-app-kit/issues/2308) ([9f0b63d](https://github.com/awslabs/iot-app-kit/commit/9f0b63d81446a1fce4a4635804cff9a6c06c9387))


### Bug Fixes

* **dashboard:** color picker has keyboard focus and can be interacted with ([1e4547e](https://github.com/awslabs/iot-app-kit/commit/1e4547e3aa2bc521c315391cabac569beab10508))
* updates for performance issues ([8863b9a](https://github.com/awslabs/iot-app-kit/commit/8863b9a80d7a8284aa4732ed25298d165a769ea9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/core bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/core-util bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/react-components bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/source-iotsitewise bumped from 9.9.1 to 9.10.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/testing-util bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/ts-config bumped from 9.9.1 to 9.10.0
    * eslint-config-iot-app-kit bumped from 9.9.1 to 9.10.0

## [9.9.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.9.0...dashboard-v9.9.1) (2023-12-06)


### Bug Fixes

* **dashboard:** clear selected properties on asset change ([05f0374](https://github.com/awslabs/iot-app-kit/commit/05f037402d785d9f6d449c88170f2ad91f2735d9))
* **dashboard:** listAssetPropertiesCall for msw + path objects for all assetModels ([b207547](https://github.com/awslabs/iot-app-kit/commit/b20754707774e19e107f1378cecaaba38384e4b3))
* **dashboard:** refactor component library to use list elements ([71a0b29](https://github.com/awslabs/iot-app-kit/commit/71a0b29e2b37685c5fcaa861a3c31291018e65ec))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/core bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/core-util bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/react-components bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/source-iotsitewise bumped from 9.9.0 to 9.9.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/testing-util bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/ts-config bumped from 9.9.0 to 9.9.1
    * eslint-config-iot-app-kit bumped from 9.9.0 to 9.9.1

## [9.9.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.8.0...dashboard-v9.9.0) (2023-12-05)


### Features

* added the error state for resource explorer tables [#2242](https://github.com/awslabs/iot-app-kit/issues/2242) ([351e142](https://github.com/awslabs/iot-app-kit/commit/351e1420508c37dddb37fb2fe9f2225c51365760))
* added title in bar and status timeline [#2312](https://github.com/awslabs/iot-app-kit/issues/2312) ([c6ea993](https://github.com/awslabs/iot-app-kit/commit/c6ea993c9d50bcd5fe75c7a5ec424d158fdf9c85))
* missing empty state for workspaces dropdown [#2305](https://github.com/awslabs/iot-app-kit/issues/2305) ([11edf2d](https://github.com/awslabs/iot-app-kit/commit/11edf2d01a4c6406810efbdc1977f2c10e379506))


### Bug Fixes

* accessibility fixes ([4caa534](https://github.com/awslabs/iot-app-kit/commit/4caa53433d3d9df858ee25d71d3b92b93cdf7617))
* accessible property filter labels ([30554a1](https://github.com/awslabs/iot-app-kit/commit/30554a1f59f2462b1a5334424866f67ee4507455))
* **dashboard:** bold, italics, underline interactable by keyboard ([ccba8c6](https://github.com/awslabs/iot-app-kit/commit/ccba8c6433967e40b07a6ed78568a8d580def221))
* fixed property section tooltip gets cut off if property has longer name [#2293](https://github.com/awslabs/iot-app-kit/issues/2293) ([e496e4d](https://github.com/awslabs/iot-app-kit/commit/e496e4d52c566cab3e17e332ef3b587cd9fcc094))
* missing pagination handling for searched model data [#1994](https://github.com/awslabs/iot-app-kit/issues/1994) ([81d5269](https://github.com/awslabs/iot-app-kit/commit/81d5269a0bd0349d95b2495330401623afd5b5b0))
* **react-components:** add echarts extension for handling custom-y-axis ([b481beb](https://github.com/awslabs/iot-app-kit/commit/b481beb1e5a9a014a688d264aa3cb3addc4f51c7))
* resolved delete button invisible issue [#2164](https://github.com/awslabs/iot-app-kit/issues/2164) ([3ec8743](https://github.com/awslabs/iot-app-kit/commit/3ec8743115848175682e5a8c80bf605d6a2669a7))
* time machine enable in edit and preview mode ([c30d68b](https://github.com/awslabs/iot-app-kit/commit/c30d68b65dbf4003bc19220fa97a0b9b4b4dac40))
* updated the resource explorer default width [#2292](https://github.com/awslabs/iot-app-kit/issues/2292) ([149ec60](https://github.com/awslabs/iot-app-kit/commit/149ec60e9055851ca8d7abdd787f2762cdcfc8ea))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/core bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/core-util bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/react-components bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/source-iotsitewise bumped from 9.8.0 to 9.9.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/testing-util bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/ts-config bumped from 9.8.0 to 9.9.0
    * eslint-config-iot-app-kit bumped from 9.8.0 to 9.9.0

## [9.8.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.7.0...dashboard-v9.8.0) (2023-11-25)


### Features

* **dashboard:** composite model api calls and updated SDK ([9c23a38](https://github.com/awslabs/iot-app-kit/commit/9c23a383a46895bab05eccc265dc61318c767b49))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/core bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/core-util bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/react-components bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/source-iotsitewise bumped from 9.7.0 to 9.8.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/testing-util bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/ts-config bumped from 9.7.0 to 9.8.0
    * eslint-config-iot-app-kit bumped from 9.7.0 to 9.8.0

## [9.7.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.6.0...dashboard-v9.7.0) (2023-11-21)


### Features

* added date time formatter in resource explorer table [#2140](https://github.com/awslabs/iot-app-kit/issues/2140) ([10137b7](https://github.com/awslabs/iot-app-kit/commit/10137b780ec3ac1fb3f1dc5d120493345ce20e1a))
* added delete option for empty widget [#2139](https://github.com/awslabs/iot-app-kit/issues/2139) ([bbab890](https://github.com/awslabs/iot-app-kit/commit/bbab89048dc5b43fd92670c7df98bd38043bbe40))
* **dashboard:** add e2e tests ([a52242e](https://github.com/awslabs/iot-app-kit/commit/a52242e3e687e899058e8477852228dde791dff7))
* **dashboard:** add model based query support ([b95b60c](https://github.com/awslabs/iot-app-kit/commit/b95b60ccf074069268a8d71071067cfbd8265a20))
* **dashboard:** adding watch mode for dashboard ([bc6fd3a](https://github.com/awslabs/iot-app-kit/commit/bc6fd3aaaa3354d555e644653d4a5081066aa747))
* **dashboard:** csv data hook ([33379af](https://github.com/awslabs/iot-app-kit/commit/33379af40ab79a79ac755be3a7f22f6701129ef6))
* **dashboard:** fit and finish for model-based-queries ([1a2bbaf](https://github.com/awslabs/iot-app-kit/commit/1a2bbaf32f58930f89a123684d55fdafb315a9bd))
* **dashboard:** gated CSV download button ([645fb1c](https://github.com/awslabs/iot-app-kit/commit/645fb1cc3fdac5e27369a6ee538e0677ab4eb8b3))
* **dashboard:** json to csv package ([918515d](https://github.com/awslabs/iot-app-kit/commit/918515d698ce63de3e3aea486c1ff5c69a4b6ee7))
* **dashboard:** move mock service worker to mock storybook story ([aae9f2b](https://github.com/awslabs/iot-app-kit/commit/aae9f2b2ab0c69417d346dd38515647c6ce43362))
* **dashboard:** query for describing unmodeled data stream ([2d1226d](https://github.com/awslabs/iot-app-kit/commit/2d1226dcc00fd8f4d138151d0aeb4a494d5e119c))
* disable add button when more than one widgets are selected [#2115](https://github.com/awslabs/iot-app-kit/issues/2115) ([c1ec145](https://github.com/awslabs/iot-app-kit/commit/c1ec145eb1cf1a4595124f5602eb2f1feee305e0))
* disable add button when no widget and propertyselected [#2115](https://github.com/awslabs/iot-app-kit/issues/2115) ([276309b](https://github.com/awslabs/iot-app-kit/commit/276309b8934b7b97228e8829c1c9047343c0d968))
* draw box align with mouse pointer [#2137](https://github.com/awslabs/iot-app-kit/issues/2137) ([a93613a](https://github.com/awslabs/iot-app-kit/commit/a93613ab95c91aed374d2812e098bcc07b1bc46b))
* fake sitewise ([5fc9557](https://github.com/awslabs/iot-app-kit/commit/5fc9557d46fc3ed193862940ee058fd0e49f33e4))
* fixed the add and reset buttons to bottom right [#2114](https://github.com/awslabs/iot-app-kit/issues/2114) ([15108b0](https://github.com/awslabs/iot-app-kit/commit/15108b058302a775b0b9a332d0ff901f81f2e676))
* format latest value time in resource explorer [#2140](https://github.com/awslabs/iot-app-kit/issues/2140) ([51be7da](https://github.com/awslabs/iot-app-kit/commit/51be7da3db56e4641526bb4333a622ae8c93e5df))
* header design update ([700a913](https://github.com/awslabs/iot-app-kit/commit/700a91366ba57d7f6ca4b2058ee308a7317db9eb))
* remove stretch to fit from dashboard [#2255](https://github.com/awslabs/iot-app-kit/issues/2255) ([e8d7778](https://github.com/awslabs/iot-app-kit/commit/e8d77786719cb30c462f1cf67f2fbfc388189490))
* widget configuration improvements, per property, and general UX [#2243](https://github.com/awslabs/iot-app-kit/issues/2243) ([94f0490](https://github.com/awslabs/iot-app-kit/commit/94f04906d35b814ce6393e2873f9ffd9c905e0b9))


### Bug Fixes

* add tests for CSV ([28c6ca9](https://github.com/awslabs/iot-app-kit/commit/28c6ca94b6efe55b33a30cd2106f4d5536f8a556))
* better disabled states and error handling CSV ([3bae192](https://github.com/awslabs/iot-app-kit/commit/3bae19293b7bedd0dcbfafc999cd6ed1e611dccc))
* bugfix for overlapping colors in color palette ([7b4c95b](https://github.com/awslabs/iot-app-kit/commit/7b4c95b45866548f85b10fee3167a35354d73cfb))
* change test id for download button ([88c16b9](https://github.com/awslabs/iot-app-kit/commit/88c16b9b1ca12dca37a910b0ce4d226838fd261c))
* copy paste issue on macos [#2136](https://github.com/awslabs/iot-app-kit/issues/2136) ([b7e8574](https://github.com/awslabs/iot-app-kit/commit/b7e8574d1f3d627694f0b0962565266d2b6ab8dc))
* **dashboard:** bugfix for barchart positioning ([16babf6](https://github.com/awslabs/iot-app-kit/commit/16babf6667c886597d527534ddd7e9b355e2f988))
* **dashboard:** conditionally start msw for mocked data stories ([b9fb349](https://github.com/awslabs/iot-app-kit/commit/b9fb349546ddc1bca9b2dbc0d934f5769836ae91))
* **dashboard:** csv  will download if viewport has no data ([b0cbbad](https://github.com/awslabs/iot-app-kit/commit/b0cbbad5348d4000674cf0e2b1d20e2782428b41))
* **dashboard:** remove hide/show from dashboard definition and config panel ([1919341](https://github.com/awslabs/iot-app-kit/commit/191934129f1c64ca52bb5333d882421aeeab91b0))
* **dashboard:** toggle from hide to show for unmodeled datastreams ([cea7c30](https://github.com/awslabs/iot-app-kit/commit/cea7c30cce8fa685cd9a0a9a8077c4e1d6b9ec4f))
* **dashboard:** update styling for model based query editor ([cb0d969](https://github.com/awslabs/iot-app-kit/commit/cb0d969e528b74c3c7d429a7b4a3335e004af9d0))
* download button and zoom undo button ([a60a81b](https://github.com/awslabs/iot-app-kit/commit/a60a81b6f6e64b3113b14edcf6efe9fe82ef47f7))
* increase the text widget initial size ([7d7918d](https://github.com/awslabs/iot-app-kit/commit/7d7918d50b10b04f75e0d9265da111a06c482600))
* missing raect key internal space between ([9cbb214](https://github.com/awslabs/iot-app-kit/commit/9cbb214035f1434719cbbb94ac0360103fb232c6))
* pagination default pagesize is set to 250 and error message update [#2242](https://github.com/awslabs/iot-app-kit/issues/2242) ([3a2d632](https://github.com/awslabs/iot-app-kit/commit/3a2d632e8430fb837656a43b030ef6eb35468417))
* panel resizing issue fix [#2256](https://github.com/awslabs/iot-app-kit/issues/2256) ([21dcb51](https://github.com/awslabs/iot-app-kit/commit/21dcb51fd8b05f4df4b5a8c4d6097ac97073d922))
* pasting at the edge of dashboard should paste widget within the grid [#2141](https://github.com/awslabs/iot-app-kit/issues/2141) ([ad1dde7](https://github.com/awslabs/iot-app-kit/commit/ad1dde7282983d7d6710c25b2399851c0ad03df7))
* remove size and position settings - [#2249](https://github.com/awslabs/iot-app-kit/issues/2249) ([276a1a1](https://github.com/awslabs/iot-app-kit/commit/276a1a1540087f6c3cc4e8c4c41cd2c7695f10a6))
* remove widget panel from text widget ([0620284](https://github.com/awslabs/iot-app-kit/commit/06202847ff980b851bf8ff836ebb2a239c3d00e7))
* twitchy widget icons [#2143](https://github.com/awslabs/iot-app-kit/issues/2143) ([60e7ad3](https://github.com/awslabs/iot-app-kit/commit/60e7ad306fb184e0be0be0ee9e56e4a6a988c073))
* ungate CSV download feature ([ec11c82](https://github.com/awslabs/iot-app-kit/commit/ec11c82c1b2932a5f7f28d9394f469cac6d68f97))
* unit test fail fix - [#2249](https://github.com/awslabs/iot-app-kit/issues/2249) ([b3a574c](https://github.com/awslabs/iot-app-kit/commit/b3a574c7d443d893aece711813265d94a0ef5ee6))
* updated the wcag compliance for dashboard resource explorer pane [#2173](https://github.com/awslabs/iot-app-kit/issues/2173) ([26bd618](https://github.com/awslabs/iot-app-kit/commit/26bd6181e4c507360247d6a7cddee7db0ba2c5bd))


### Performance Improvements

* use requestAnimationFrame when dragging widgets on the dashboard ([ef3fc4e](https://github.com/awslabs/iot-app-kit/commit/ef3fc4ec1fed1cefa2f8cc58084b1d968eb1a08f))


### Reverts

* filter query on asset models ([c5aa946](https://github.com/awslabs/iot-app-kit/commit/c5aa946584194110cac9313e3150644951635e9c))
* reverting fix(dashboard): remove hide/show from dashboard definition and config panel ([7f63922](https://github.com/awslabs/iot-app-kit/commit/7f6392213d525ec3f5c7534b61323dfc896d112e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/core bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/core-util bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/react-components bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/source-iotsitewise bumped from 9.6.0 to 9.7.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/testing-util bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/ts-config bumped from 9.6.0 to 9.7.0
    * eslint-config-iot-app-kit bumped from 9.6.0 to 9.7.0

## [9.6.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.5.0...dashboard-v9.6.0) (2023-11-16)


### Bug Fixes

* restrict [@iot-app-kit](https://github.com/iot-app-kit) imports ([780f404](https://github.com/awslabs/iot-app-kit/commit/780f404f20475dab7d0e21af271b5f3f98defee5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/core bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/core-util bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/react-components bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/source-iotsitewise bumped from 9.5.0 to 9.6.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/testing-util bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/ts-config bumped from 9.5.0 to 9.6.0
    * eslint-config-iot-app-kit bumped from 9.5.0 to 9.6.0

## [9.5.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.4.0...dashboard-v9.5.0) (2023-11-08)


### Miscellaneous Chores

* **dashboard:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/core bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/core-util bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/react-components bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/source-iotsitewise bumped from 9.4.0 to 9.5.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/testing-util bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/ts-config bumped from 9.4.0 to 9.5.0
    * eslint-config-iot-app-kit bumped from 9.4.0 to 9.5.0

## [9.4.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.3.0...dashboard-v9.4.0) (2023-10-26)


### Bug Fixes

* broken tooltip imports ([8a25332](https://github.com/awslabs/iot-app-kit/commit/8a25332379e647911504cd75ff913f6b911a43c4))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/core bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/core-util bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/react-components bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/source-iotsitewise bumped from 9.3.0 to 9.4.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/testing-util bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/ts-config bumped from 9.3.0 to 9.4.0
    * eslint-config-iot-app-kit bumped from 9.3.0 to 9.4.0

## [9.3.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.2.0...dashboard-v9.3.0) (2023-10-26)


### Features

* add line style thickness per property ([fb19652](https://github.com/awslabs/iot-app-kit/commit/fb196521ba7b35019828e1c9f2c4383841e4620b))
* added line style customization per property ([abe942f](https://github.com/awslabs/iot-app-kit/commit/abe942f7a95458087cd1f7075091ee3acca41ada))
* added widget text in the widget panel [#2036](https://github.com/awslabs/iot-app-kit/issues/2036) ([a46da1d](https://github.com/awslabs/iot-app-kit/commit/a46da1dc2166913bfc9ba81d5eec4388d17399d8))
* decimal round of in resource table ([a5da972](https://github.com/awslabs/iot-app-kit/commit/a5da9726649ca81a578efd365ba05d0dbe302b55))
* handle long properties name in properties section in config panel [#1984](https://github.com/awslabs/iot-app-kit/issues/1984) ([fda011f](https://github.com/awslabs/iot-app-kit/commit/fda011f83e610a14cd6115ebf6aaf88b32589091))


### Bug Fixes

* **dashboard:** tc sync is broken in prod ([c357902](https://github.com/awslabs/iot-app-kit/commit/c3579027e3bb3e38af4042bc6749ffb648a62e71))
* do not override selected data stream preferences ([02b80fe](https://github.com/awslabs/iot-app-kit/commit/02b80fed798ad859a1e5aa0993ea479aa48e0b38))
* **react-components:** pagination over time + tooltip ([ff052c9](https://github.com/awslabs/iot-app-kit/commit/ff052c94fa9f57ac8138d025301a384ab217b258))
* **react-components:** toggle legend hides container ([8d0ae53](https://github.com/awslabs/iot-app-kit/commit/8d0ae53981698bc8121cb0e40831b9d61e693075))
* **react-component:** updating TC to have a drag area instead of just drag on the line ([05068bd](https://github.com/awslabs/iot-app-kit/commit/05068bddfd3a7ff0876550a11263496765b51080))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/core bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/core-util bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/react-components bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/source-iotsitewise bumped from 9.2.0 to 9.3.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/testing-util bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/ts-config bumped from 9.2.0 to 9.3.0
    * eslint-config-iot-app-kit bumped from 9.2.0 to 9.3.0

## [9.2.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.1.0...dashboard-v9.2.0) (2023-10-17)


### Features

* setting the sizes, and sizing behavior of the left and right side panels within the dashboard ([8cec7c0](https://github.com/awslabs/iot-app-kit/commit/8cec7c070ab401d71397676c25037ad28f0168b5))


### Bug Fixes

* **react-components:** echarts grab on canvas update cursor and tooltip ([a29da3a](https://github.com/awslabs/iot-app-kit/commit/a29da3a08a769137610bc37efde5605bf6b62dc2))
* synchronize batching ([dd0c0c6](https://github.com/awslabs/iot-app-kit/commit/dd0c0c6d0b17f4662ef370633ccd300899f9c106))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/core bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/core-util bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/react-components bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/source-iotsitewise bumped from 9.1.0 to 9.2.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/testing-util bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/ts-config bumped from 9.1.0 to 9.2.0
    * eslint-config-iot-app-kit bumped from 9.1.0 to 9.2.0

## [9.1.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v9.0.0...dashboard-v9.1.0) (2023-10-13)


### Features

* side-panels toggle open hit and tooltip on mouseover [#2003](https://github.com/awslabs/iot-app-kit/issues/2003) ([a974964](https://github.com/awslabs/iot-app-kit/commit/a9749645567611a430113071fb2cfcb7bb93b2a3))


### Bug Fixes

* **dashboard:** fix toggle hide thresholds ([0abb1b2](https://github.com/awslabs/iot-app-kit/commit/0abb1b24d6117ae13e27fe1b1e02ee9684cf0962))
* **dashboard:** improve widget drag and resize ([fcdc586](https://github.com/awslabs/iot-app-kit/commit/fcdc5862fc558f136d510eaa85e241daa61d9988))
* **dashboard:** update unmodeled latest value to timestamp.timeInSeconds ([70bd004](https://github.com/awslabs/iot-app-kit/commit/70bd0048d7e30274c61b41cfc0334362b9f96042))
* firefox dnd ([5fd8b4f](https://github.com/awslabs/iot-app-kit/commit/5fd8b4f4eed0039852305d4ba8ebec1f453d1fbb))
* latest value filtering and sorting ([6610382](https://github.com/awslabs/iot-app-kit/commit/66103826b0e157a737cdc2661c4c8bfa5edcb56f))
* line charts colors too quickly choose similar colors ([0af5465](https://github.com/awslabs/iot-app-kit/commit/0af5465ffc0a7f587a8e4a53487c8fb56c35d36a))
* **react-components:** fixing the xaxis and viewport dependency ([139bcc1](https://github.com/awslabs/iot-app-kit/commit/139bcc15aa219c1906544086ab6bf3d24e4035da))
* style updates and bugfixes for multi y axis ([e11fd3e](https://github.com/awslabs/iot-app-kit/commit/e11fd3eb6629d75b3b2abdb2ad0466d02e66b8ef))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/core bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/core-util bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/react-components bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/source-iotsitewise bumped from 9.0.0 to 9.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/testing-util bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/ts-config bumped from 9.0.0 to 9.1.0
    * eslint-config-iot-app-kit bumped from 9.0.0 to 9.1.0

## [9.0.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v8.1.1...dashboard-v9.0.0) (2023-10-10)


### ⚠ BREAKING CHANGES

* **dashboard:** widget type change from line-scatter-chart -> xy-plot

### Features

* resource explorer table preferences columns visibility [#1980](https://github.com/awslabs/iot-app-kit/issues/1980) ([22d7028](https://github.com/awslabs/iot-app-kit/commit/22d70287dce77ae072e425ccbaa4fc2132b63595))


### Bug Fixes

* **dashboard:** bar chart default aggregation+resolution ([44fd991](https://github.com/awslabs/iot-app-kit/commit/44fd99128d13053cd48fae2d8c9562d6d8ab4ef2))
* **dashboard:** minor threshold fixes ([5b5c570](https://github.com/awslabs/iot-app-kit/commit/5b5c570f0ab026144e4009663c02ca3e0c948f3c))


### Miscellaneous Chores

* **dashboard:** change line-scatter-chart to xy-plot ([70593da](https://github.com/awslabs/iot-app-kit/commit/70593da0638b689f55396488def2c84fdc7dac19))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/core bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/core-util bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/react-components bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/source-iotsitewise bumped from 8.1.1 to 9.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/testing-util bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/ts-config bumped from 8.1.1 to 9.0.0
    * eslint-config-iot-app-kit bumped from 8.1.1 to 9.0.0

## [8.1.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v8.1.0...dashboard-v8.1.1) (2023-10-05)


### Bug Fixes

* add eslint rule for hooks ([de7cc0d](https://github.com/awslabs/iot-app-kit/commit/de7cc0d94ffdb79d3cb2ce622dd322e6d8497d61))
* aggregation and resolution settings ([06207f9](https://github.com/awslabs/iot-app-kit/commit/06207f9204c1a57d390f189e29858b9c8b862b4f))
* **dashboard:** chart respects absolute min and max between data and thresholds ([db16712](https://github.com/awslabs/iot-app-kit/commit/db1671225e300a18765d55a8afd1534640d264de))
* default resolution and aggregation ([e5afdc0](https://github.com/awslabs/iot-app-kit/commit/e5afdc025b83013de26b5c3dbac1e5db5e8aca53))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/core bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/core-util bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/react-components bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/source-iotsitewise bumped from 8.1.0 to 8.1.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/testing-util bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/ts-config bumped from 8.1.0 to 8.1.1
    * eslint-config-iot-app-kit bumped from 8.1.0 to 8.1.1

## [8.1.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v8.0.2...dashboard-v8.1.0) (2023-10-04)


### Bug Fixes

* **dashboard:** correctly update aggregation and resolution configs ([e749d48](https://github.com/awslabs/iot-app-kit/commit/e749d48985f9d9d419a98a299ab933273fb45c85))
* remove slashes from property alias when requesting latest in query editor ([fbead83](https://github.com/awslabs/iot-app-kit/commit/fbead83ac6765e4fed27b73925a9c4d460dc5a08))
* remove viewport and query from widget render key ([1587e2a](https://github.com/awslabs/iot-app-kit/commit/1587e2aa05887b1e9b1e486c153e8adc74cfde21))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/core bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/core-util bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/react-components bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/source-iotsitewise bumped from 8.0.2 to 8.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/testing-util bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/ts-config bumped from 8.0.2 to 8.1.0
    * eslint-config-iot-app-kit bumped from 8.0.2 to 8.1.0

## [8.0.2](https://github.com/awslabs/iot-app-kit/compare/dashboard-v8.0.1...dashboard-v8.0.2) (2023-09-30)


### Bug Fixes

* **Dashboard:** fix breaking build due to invalid import ([6690640](https://github.com/awslabs/iot-app-kit/commit/6690640ddc41797a3e1a3bb724974deb2a963db0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/core bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/core-util bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/react-components bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/source-iotsitewise bumped from 8.0.1 to 8.0.2
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/testing-util bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/ts-config bumped from 8.0.1 to 8.0.2
    * eslint-config-iot-app-kit bumped from 8.0.1 to 8.0.2

## [8.0.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v8.0.0...dashboard-v8.0.1) (2023-09-30)


### Bug Fixes

* toggle working linechar ([9ea6117](https://github.com/awslabs/iot-app-kit/commit/9ea61177710b9ece1be169a0c50e1c19fdefb5e6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/core bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/core-util bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/react-components bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/source-iotsitewise bumped from 8.0.0 to 8.0.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/testing-util bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/ts-config bumped from 8.0.0 to 8.0.1
    * eslint-config-iot-app-kit bumped from 8.0.0 to 8.0.1

## [8.0.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v7.5.0...dashboard-v8.0.0) (2023-09-30)


### ⚠ BREAKING CHANGES

* **dashboard:** remove line and scatter widgets

### Features

* ability to toggle property visibility in config panel [#1986](https://github.com/awslabs/iot-app-kit/issues/1986) ([560b776](https://github.com/awslabs/iot-app-kit/commit/560b7765c4a4ae8db6d06e70f69b2276844716a8))
* add delete confirm modal for widgets ([84fb016](https://github.com/awslabs/iot-app-kit/commit/84fb01663e37ac5c1ba84a08baf75d1b1a7668f0))
* add filtering ability ([51933bc](https://github.com/awslabs/iot-app-kit/commit/51933bc6cc1a76071ae1287ee7f79072c8d4dac7))
* added empty state for line and scatter chart widgets ([f2662cc](https://github.com/awslabs/iot-app-kit/commit/f2662cc23860d08f1c8fd3cde69e86df4d3c3b6c))
* dashboard: re-introduce status widget icon [#1977](https://github.com/awslabs/iot-app-kit/issues/1977) ([0b62042](https://github.com/awslabs/iot-app-kit/commit/0b6204289d3dd1d0d3627cac4c9dcb0d330d2369))
* **dashboard:** add echart line-scatter-widget ([076f151](https://github.com/awslabs/iot-app-kit/commit/076f15129b4a1e61b4ef57467031210365ef58cb))
* empty state within the dashboard to help guide users how to create their dashboard ([f59a069](https://github.com/awslabs/iot-app-kit/commit/f59a0693480832cc3af38b8d9addef88309fecce))
* make session token optional for local development ([1a26b36](https://github.com/awslabs/iot-app-kit/commit/1a26b3622d3e8780cc54b1a66fc83aac96ecf2d9))
* preferences for pagination in table widget [#1890](https://github.com/awslabs/iot-app-kit/issues/1890) ([8072232](https://github.com/awslabs/iot-app-kit/commit/8072232240a17274556d208fc22d32a811866517))
* unmodeled data streams ([71bebef](https://github.com/awslabs/iot-app-kit/commit/71bebefebdaefc235ec2ec505bc5f4dd0d1c7f31))


### Bug Fixes

* add more unique colors ([8641b1f](https://github.com/awslabs/iot-app-kit/commit/8641b1f737919b868da7b309cb7ebc6183ef1918))
* **dashboard:** disable dashboard drag when shift key is pressed ([2e47a3c](https://github.com/awslabs/iot-app-kit/commit/2e47a3cee18d1cbfdb0509f599b3cbc575f2f94a))
* **dashboard:** fix styling for tile and config panel ([932d2f0](https://github.com/awslabs/iot-app-kit/commit/932d2f0b5e0910069cd030044dbe5cf9d26f7287))
* **dashboard:** fix table item creation ([1c406b6](https://github.com/awslabs/iot-app-kit/commit/1c406b6de03e620fcb2f6c88bd1da256377d178b))
* **dashboard:** remove viewport from the dashboard state to use viewport hook ([a9011a8](https://github.com/awslabs/iot-app-kit/commit/a9011a8a22e3bc41076fa6fb64065c016282d012))
* **dashboard:** text widget crashed dashboard when resource explorer is open ([337bcaf](https://github.com/awslabs/iot-app-kit/commit/337bcaf3b8ae4b846a5f82180856ce046f1fa719))
* **dashboard:** update icon path for empty dashboard ([b24a2b5](https://github.com/awslabs/iot-app-kit/commit/b24a2b5752520b7c52a09d47bd7ae660b238139d))
* dont move widget when resizing legend ([a7cefce](https://github.com/awslabs/iot-app-kit/commit/a7cefce603e98776b1ab5d8914e929fe73ac7517))
* enable changing resolution and aggregation of unmodeled data streams ([e187898](https://github.com/awslabs/iot-app-kit/commit/e187898fd63872ae11b8592e865fc29959492761))
* fix broken synchro-charts widgets ([5e61361](https://github.com/awslabs/iot-app-kit/commit/5e61361084c59bb4ea90ba65ac2016aba99f658e))
* fixed step after chart type [#1978](https://github.com/awslabs/iot-app-kit/issues/1978) ([546b2a0](https://github.com/awslabs/iot-app-kit/commit/546b2a004a3d8793fd8283a6d69d631fc3ace93d))
* **ResourceExplorer:** implement toggling on/off of properties visibility ([8666736](https://github.com/awslabs/iot-app-kit/commit/8666736eb4642cadd7efcedd99fc680b4df17f83))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/core bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/core-util bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/react-components bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/source-iotsitewise bumped from 7.5.0 to 8.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/testing-util bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/ts-config bumped from 7.5.0 to 8.0.0
    * eslint-config-iot-app-kit bumped from 7.5.0 to 8.0.0

## [7.5.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v7.4.0...dashboard-v7.5.0) (2023-09-26)


### Features

* integrate query editor ([82c36a1](https://github.com/awslabs/iot-app-kit/commit/82c36a1cf4f7c47b45ba32c1f5e15cdf3e132cb4))


### Bug Fixes

* **dashboard:** set initial viewport to 5m ([f7a5684](https://github.com/awslabs/iot-app-kit/commit/f7a568414a772e98ceb03bdac4978173b36ddb47))
* **echarts:** bugs for demo ([b1e57ee](https://github.com/awslabs/iot-app-kit/commit/b1e57ee4b0d768c0a83be24c55b837a8f0fd950d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/core bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/core-util bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/react-components bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/source-iotsitewise bumped from 7.4.0 to 7.5.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/testing-util bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/ts-config bumped from 7.4.0 to 7.5.0
    * eslint-config-iot-app-kit bumped from 7.4.0 to 7.5.0

## [7.4.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v7.3.1...dashboard-v7.4.0) (2023-09-25)


### Features

* add fixed width and height to the table ([7005009](https://github.com/awslabs/iot-app-kit/commit/7005009b1e325a8f333b281113ce1cf4745b0b19))
* auto collapse state for both panels ([fc54b1c](https://github.com/awslabs/iot-app-kit/commit/fc54b1cb71979e48dc5440620577ca8a2adc4be6))
* **dashboard:** add widget tile ([13573c5](https://github.com/awslabs/iot-app-kit/commit/13573c59d560e7192159db8751d6818cfebcf531))
* **dashboard:** break out properties sections into tabs ([fb8b685](https://github.com/awslabs/iot-app-kit/commit/fb8b685f1d6ea8459c40637f12f0cf6ddc75aa55))
* **dashboard:** change dashboard viewport default from 5m to 10m ([803d9a4](https://github.com/awslabs/iot-app-kit/commit/803d9a4944f6a55cb2e0e9691ddc3e537966c501))
* **dashboard:** empty widget configuration panel ([72bc7e3](https://github.com/awslabs/iot-app-kit/commit/72bc7e32a373a724077e1b7ba0d9f671af4495eb))
* **dashboard:** line symbol ([bba8e8d](https://github.com/awslabs/iot-app-kit/commit/bba8e8d392f73b3e52109bad1557cda4ef00221c))
* **dashboard:** new line-scatter-chart ([53768b9](https://github.com/awslabs/iot-app-kit/commit/53768b911a13066b9527c88f0e95a620f0025f7a))
* **dashboard:** update collapsible side panels ([1495451](https://github.com/awslabs/iot-app-kit/commit/149545160551174af83ce3ddb2a61f1a61977c94))
* **react-components:** adding TrendCursor Sync to dashboard ([d046184](https://github.com/awslabs/iot-app-kit/commit/d046184b836e9cb3670b210eb24c4fd91167b52a))
* **react-components:** sync echarts viewport ([e04e040](https://github.com/awslabs/iot-app-kit/commit/e04e04079630361047e82d8564678cd4e5857cdd))
* remove drag icon in chat widget ([64e1b89](https://github.com/awslabs/iot-app-kit/commit/64e1b897dc9389055cfd9df9fce01b0415b9e170))
* table widget pagination and sortingdisabled ([b727eae](https://github.com/awslabs/iot-app-kit/commit/b727eae8364f19f2e997fa0c9275e1f0a947f854))
* update icons for widget library-952 ([5f7f9ee](https://github.com/awslabs/iot-app-kit/commit/5f7f9ee8274f99b88fd464bd4ee434d0f4126594))
* updated chart initial widget size [#1920](https://github.com/awslabs/iot-app-kit/issues/1920)) ([88218af](https://github.com/awslabs/iot-app-kit/commit/88218afb1aed84e63d08fbad3acacab044c2ab8a))
* updated dashboard background color to grey-125 [#1950](https://github.com/awslabs/iot-app-kit/issues/1950) ([0f81bb2](https://github.com/awslabs/iot-app-kit/commit/0f81bb2240086c9222ab0063dac576927fd407c1))


### Bug Fixes

* **dashboard:** removing all props wont crash chart ([bac2fb6](https://github.com/awslabs/iot-app-kit/commit/bac2fb6debc1364d831c2b93e68a7eafd2b45b9c))
* **react-components:** fixing the viewport and some styling elements ([7d3526e](https://github.com/awslabs/iot-app-kit/commit/7d3526e34c86b55632a4d5aa0c7029fd1499a48b))
* **react-components:** updating echarts ux ([ddfc9c8](https://github.com/awslabs/iot-app-kit/commit/ddfc9c8cc15f32a8c307653daf5d2159918e58b2))
* **react-components:** updating echarts with the fixes founf during bug bash ([9f32c21](https://github.com/awslabs/iot-app-kit/commit/9f32c21ae53d99ddac718caa520d9e852a25f499))
* resolved table widget column resize issue ([8b6b418](https://github.com/awslabs/iot-app-kit/commit/8b6b4189601c594ffef9dd6ed915e6ddbf7fa938))
* resolved table widget column resize issue ([08b1993](https://github.com/awslabs/iot-app-kit/commit/08b19932614978cac915e34a27747f72da78c657))
* use one timesync for all of dashboard ([c979995](https://github.com/awslabs/iot-app-kit/commit/c979995ec642d0ac8081056a3d2e83dd42a90d18))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/core bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/core-util bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/react-components bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/source-iotsitewise bumped from 7.3.1 to 7.4.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/testing-util bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/ts-config bumped from 7.3.1 to 7.4.0
    * eslint-config-iot-app-kit bumped from 7.3.1 to 7.4.0

## [7.3.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v7.3.0...dashboard-v7.3.1) (2023-08-24)


### Bug Fixes

* **dashboard:** adding a ts module file for supporting svg files ([61ac00d](https://github.com/awslabs/iot-app-kit/commit/61ac00dba2029a060692fd736616185f07b74bc2))
* **react-component:** updating the calculateTimeStamp method to use ([e0e1f42](https://github.com/awslabs/iot-app-kit/commit/e0e1f428f012b157938eced89efcd30101f2d7f5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/core bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/core-util bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/react-components bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/source-iotsitewise bumped from 7.3.0 to 7.3.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/testing-util bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/ts-config bumped from 7.3.0 to 7.3.1
    * eslint-config-iot-app-kit bumped from 7.3.0 to 7.3.1

## [7.3.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v7.2.1...dashboard-v7.3.0) (2023-08-23)


### Miscellaneous Chores

* **dashboard:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/core bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/core-util bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/react-components bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/source-iotsitewise bumped from 7.2.1 to 7.3.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/testing-util bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/ts-config bumped from 7.2.1 to 7.3.0
    * eslint-config-iot-app-kit bumped from 7.2.1 to 7.3.0

## [7.2.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v7.2.0...dashboard-v7.2.1) (2023-08-18)


### Bug Fixes

* **react-components:** the dependencies were added to dashboard instead of react-components ([8b2f12f](https://github.com/awslabs/iot-app-kit/commit/8b2f12fb67a1705ffdb722e02cf8c1ff1ae2ed97))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/core bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/core-util bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/react-components bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/source-iotsitewise bumped from 7.2.0 to 7.2.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/testing-util bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/ts-config bumped from 7.2.0 to 7.2.1
    * eslint-config-iot-app-kit bumped from 7.2.0 to 7.2.1

## [7.2.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v7.1.0...dashboard-v7.2.0) (2023-08-17)


### Features

* **dashboard:** add advanced search using knowledge graph to query editor ([8722b33](https://github.com/awslabs/iot-app-kit/commit/8722b338a919d6fb51b21a861cf7e96e44246dbd))
* **react-component:** adding config service to toggle echarts ([96d0351](https://github.com/awslabs/iot-app-kit/commit/96d0351b7e20a728154d3ebfed0efd5205b841bd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/core bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/core-util bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/react-components bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/source-iotsitewise bumped from 7.1.0 to 7.2.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/testing-util bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/ts-config bumped from 7.1.0 to 7.2.0
    * eslint-config-iot-app-kit bumped from 7.1.0 to 7.2.0

## [7.1.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v7.0.0...dashboard-v7.1.0) (2023-07-28)


### Miscellaneous Chores

* **dashboard:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/core bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/core-util bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/react-components bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/source-iotsitewise bumped from 7.0.0 to 7.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/testing-util bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/ts-config bumped from 7.0.0 to 7.1.0
    * eslint-config-iot-app-kit bumped from 7.0.0 to 7.1.0

## [7.0.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v6.3.1...dashboard-v7.0.0) (2023-07-25)


### Features

* **react-component:** adding the inital implementation of the trend cursors ([ce37fe2](https://github.com/awslabs/iot-app-kit/commit/ce37fe21a36f13fe1438c0653eb47992d774b15e))
* **react-components:** feature flag context ([d313682](https://github.com/awslabs/iot-app-kit/commit/d31368282b9f5882c6f6cef0a66c2c085ee56aff))


### Bug Fixes

* use REGION env variable in dashboard testing environment ([c62e68b](https://github.com/awslabs/iot-app-kit/commit/c62e68bc9181ad2d6995097fb60638f41dc168ab))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/core bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/core-util bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/react-components bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/source-iotsitewise bumped from 6.3.1 to 7.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/testing-util bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/ts-config bumped from 6.3.1 to 7.0.0
    * eslint-config-iot-app-kit bumped from 6.3.1 to 7.0.0

## [6.3.1](https://github.com/awslabs/iot-app-kit/compare/root-v6.3.0...root-v6.3.1) (2023-06-28)

## Fix
* **Emergency revert**

## [6.3.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v6.2.0...dashboard-v6.3.0) (2023-06-23)


### Features

* **dashboard:** add api for customizing the properties panel ([368ad97](https://github.com/awslabs/iot-app-kit/commit/368ad974a5fa0e22851918b89b8e3a152165dbe8))
* **dashboard:** add significant digits configuration ([bcc5c51](https://github.com/awslabs/iot-app-kit/commit/bcc5c51a1732bc785a45ec939fb111f52ae14421))
* **react-components:** add significant digits configuration for charts ([41cba0e](https://github.com/awslabs/iot-app-kit/commit/41cba0e655ac944889d6f15db56282a30e53997e))
* **react-components:** base echarts ([bc6ee62](https://github.com/awslabs/iot-app-kit/commit/bc6ee6250417a7d71f6aaf0692f1a02d4059b8f6))


### Bug Fixes

* **dashboard:** add box sizing reset for dashboard ([712598b](https://github.com/awslabs/iot-app-kit/commit/712598b13f4c3c81a3d4d8b6609d7bd149c16859))
* **dashboard:** fixed the flash of graphs on change in query(s) ([45edc69](https://github.com/awslabs/iot-app-kit/commit/45edc69ae67796ce9566c491a8f39921029ad0a0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/core bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/core-util bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/react-components bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/source-iotsitewise bumped from 6.2.0 to 6.3.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/testing-util bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/ts-config bumped from 6.2.0 to 6.3.0
    * eslint-config-iot-app-kit bumped from 6.2.0 to 6.3.0

## [6.2.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v6.1.0...dashboard-v6.2.0) (2023-06-07)


### Bug Fixes

* **dashboard:** better toolbar ([c0b9cc8](https://github.com/awslabs/iot-app-kit/commit/c0b9cc8bf135caaa8f5722defba87be65ef06f70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/core bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/core-util bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/react-components bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/source-iotsitewise bumped from 6.1.0 to 6.2.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/testing-util bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/ts-config bumped from 6.1.0 to 6.2.0
    * eslint-config-iot-app-kit bumped from 6.1.0 to 6.2.0

## [6.1.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v6.0.0...dashboard-v6.1.0) (2023-06-06)


### Bug Fixes

* **dashboard:** editable link ([1675de6](https://github.com/awslabs/iot-app-kit/commit/1675de6ff50f536b27d6258734fb312f50b40c7b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/core bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/core-util bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/react-components bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/source-iotsitewise bumped from 6.0.0 to 6.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/testing-util bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/ts-config bumped from 6.0.0 to 6.1.0
    * eslint-config-iot-app-kit bumped from 6.0.0 to 6.1.0

## [6.0.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.9.0...dashboard-v6.0.0) (2023-06-05)


### ⚠ BREAKING CHANGES

* aggregation and resolution picker

### Features

* aggregation and resolution picker ([77a53fe](https://github.com/awslabs/iot-app-kit/commit/77a53feffdb1956707dca5d45f43a1f7ea0c5453))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/core bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/core-util bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/react-components bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/source-iotsitewise bumped from 5.9.0 to 6.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/testing-util bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/ts-config bumped from 5.9.0 to 6.0.0
    * eslint-config-iot-app-kit bumped from 5.9.0 to 6.0.0

## [5.9.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.8.1...dashboard-v5.9.0) (2023-06-01)


### Features

* **dashboard:** refactor asset description sdk calls to use tanstack ([f99bcde](https://github.com/awslabs/iot-app-kit/commit/f99bcde75f3fad7dac82ac657f1a2aca8dbbbc4c))


### Bug Fixes

* **dashboard:** change min widget sizing from 2 to 1 ([d840fc1](https://github.com/awslabs/iot-app-kit/commit/d840fc1ac8efbe9e79ff5937f22cc3545abfdd0d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/core bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/core-util bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/react-components bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/source-iotsitewise bumped from 5.8.1 to 5.9.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/testing-util bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/ts-config bumped from 5.8.1 to 5.9.0
    * eslint-config-iot-app-kit bumped from 5.8.1 to 5.9.0

## [5.8.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.8.0...dashboard-v5.8.1) (2023-05-19)


### Miscellaneous Chores

* **dashboard:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/core bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/core-util bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/react-components bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/source-iotsitewise bumped from 5.8.0 to 5.8.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/testing-util bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/ts-config bumped from 5.8.0 to 5.8.1
    * eslint-config-iot-app-kit bumped from 5.8.0 to 5.8.1

## [5.8.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.7.0...dashboard-v5.8.0) (2023-05-18)


### Features

* **dashboard:** add grid settings configuration ux ([f5ca885](https://github.com/awslabs/iot-app-kit/commit/f5ca88515992637837db778acb198a83d46a16b6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/core bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/core-util bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/react-components bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/source-iotsitewise bumped from 5.7.0 to 5.8.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/testing-util bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/ts-config bumped from 5.7.0 to 5.8.0
    * eslint-config-iot-app-kit bumped from 5.7.0 to 5.8.0

## [5.7.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.6.0...dashboard-v5.7.0) (2023-05-02)


### Features

* **dashboard:** add utils for e2e testing dashboard ([8a917eb](https://github.com/awslabs/iot-app-kit/commit/8a917eb4b0ed6ed0d52a900c0e643f948d612ecc))


### Bug Fixes

* **dashboard:** remove box-intersect dependency ([703f1a5](https://github.com/awslabs/iot-app-kit/commit/703f1a5f15bb8c227fb726fc026a6983dc2c5f25))
* no flash of error, remove ghosting ([5a2723b](https://github.com/awslabs/iot-app-kit/commit/5a2723ba9cb78d3b4fbd6ed64e9c1558d6a01c98))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/core bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/core-util bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/react-components bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/source-iotsitewise bumped from 5.6.0 to 5.7.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/testing-util bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/ts-config bumped from 5.6.0 to 5.7.0
    * eslint-config-iot-app-kit bumped from 5.6.0 to 5.7.0

## [5.6.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.5.2...dashboard-v5.6.0) (2023-04-20)


### Miscellaneous Chores

* **dashboard:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/core bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/core-util bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/react-components bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/source-iotsitewise bumped from 5.5.2 to 5.6.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/testing-util bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/ts-config bumped from 5.5.2 to 5.6.0
    * eslint-config-iot-app-kit bumped from 5.5.2 to 5.6.0

## [5.5.2](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.5.1...dashboard-v5.5.2) (2023-04-19)


### Bug Fixes

* **dashboard:** ensure auto size grid recalculates any time cellSize changes from outside component ([7132c4d](https://github.com/awslabs/iot-app-kit/commit/7132c4df21306c4ad735cdc0818ea5cf22c4afa2))
* **dashboard:** prevent initialState from being shared across dashboard instances ([5403928](https://github.com/awslabs/iot-app-kit/commit/5403928136d5b4babcb32f6060334ec0467e3044))
* **dashboard:** refactor grid component to make it more maintainable ([d84db01](https://github.com/awslabs/iot-app-kit/commit/d84db0110d47107c6b0974cda021dacfdae42e00))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/core bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/core-util bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/react-components bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/source-iotsitewise bumped from 5.5.1 to 5.5.2
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/testing-util bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/ts-config bumped from 5.5.1 to 5.5.2
    * eslint-config-iot-app-kit bumped from 5.5.1 to 5.5.2

## [5.5.1](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.5.0...dashboard-v5.5.1) (2023-04-14)


### Miscellaneous Chores

* **dashboard:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/core bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/core-util bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/react-components bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/source-iotsitewise bumped from 5.5.0 to 5.5.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/testing-util bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/ts-config bumped from 5.5.0 to 5.5.1
    * eslint-config-iot-app-kit bumped from 5.5.0 to 5.5.1

## [5.5.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.4.0...dashboard-v5.5.0) (2023-04-13)


### Features

* **dashboard:** add autosizing grid ([fcaca20](https://github.com/awslabs/iot-app-kit/commit/fcaca207862658a0b299cd0f61feb7144a4541b3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/core bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/core-util bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/react-components bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/source-iotsitewise bumped from 5.4.0 to 5.5.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/testing-util bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/ts-config bumped from 5.4.0 to 5.5.0
    * eslint-config-iot-app-kit bumped from 5.4.0 to 5.5.0

## [5.4.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.3.0...dashboard-v5.4.0) (2023-04-12)


### Features

* **dashboard:** add initial view mode configuration to dashboard ([ddc7316](https://github.com/awslabs/iot-app-kit/commit/ddc73163a06b269de98c30dcf4f1f57bc79a0679))


### Bug Fixes

* **dashboard:** fix tooltip positioning ([cc82474](https://github.com/awslabs/iot-app-kit/commit/cc824747e85a56c35c590020dd185d576f45ee6f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/core bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/core-util bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/react-components bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/source-iotsitewise bumped from 5.3.0 to 5.4.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/testing-util bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/ts-config bumped from 5.3.0 to 5.4.0
    * eslint-config-iot-app-kit bumped from 5.3.0 to 5.4.0

## [5.3.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v5.2.0...dashboard-v5.3.0) (2023-04-12)


### Bug Fixes

* **dashboard:** update property name for tables when displaying alarms ([d8d5541](https://github.com/awslabs/iot-app-kit/commit/d8d55410c78abf6c8cd7f9d442c311f0e2e9a752))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/core bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/core-util bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/react-components bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/source-iotsitewise bumped from 5.2.0 to 5.3.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/testing-util bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/ts-config bumped from 5.2.0 to 5.3.0
    * eslint-config-iot-app-kit bumped from 5.2.0 to 5.3.0

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
