# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.2.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v5.1.1...source-iotsitewise-v5.2.0) (2023-04-05)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/core-util bumped from 5.1.1 to 5.2.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/testing-util bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/ts-config bumped from 5.1.1 to 5.2.0
    * eslint-config-iot-app-kit bumped from 5.1.1 to 5.2.0

## [5.1.1](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v5.1.0...source-iotsitewise-v5.1.1) (2023-04-03)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/core-util bumped from 5.1.0 to 5.1.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/testing-util bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/ts-config bumped from 5.1.0 to 5.1.1
    * eslint-config-iot-app-kit bumped from 5.1.0 to 5.1.1

## [5.1.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v5.0.0...source-iotsitewise-v5.1.0) (2023-04-03)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/core-util bumped from 5.0.0 to 5.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/testing-util bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/ts-config bumped from 5.0.0 to 5.1.0
    * eslint-config-iot-app-kit bumped from 5.0.0 to 5.1.0

## [5.0.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v4.0.3...source-iotsitewise-v5.0.0) (2023-03-31)


### ⚠ BREAKING CHANGES

* **source-iotsitewise:** support propertyAlias in quries
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* **core, source-iotsitewise:** 
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async
* **core:** Refactored export from `@iot-app-kit/core` IoTAppKitDataModule to be named TimeSeriesDataModule, and removed the concept of multiple data sources per time series data module

### Features

* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([64e64b8](https://github.com/awslabs/iot-app-kit/commit/64e64b800ad3b6ddbee78cfe84c3750e73dead65))
* **all:** release 4.0.3 ([2b933ba](https://github.com/awslabs/iot-app-kit/commit/2b933ba31e60666323df7bfae0e962698636a4bf))
* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* batch API for historical, aggregated, and latest value data ([#137](https://github.com/awslabs/iot-app-kit/issues/137)) ([b7a38e2](https://github.com/awslabs/iot-app-kit/commit/b7a38e225199989524914b88f8da43ca77af2e54))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async ([69a017e](https://github.com/awslabs/iot-app-kit/commit/69a017ea8dfbd99fcd3c155278cac3c241b30527))
* **core:** Refactor time series data module to  remove unused functionality. Add meta field to data stream. ([7f12267](https://github.com/awslabs/iot-app-kit/commit/7f1226784158bdfff6ab67ab5b0523649a2f7a34))
* **core:** Support caching of dataType, name and other fields describing dataStreams ([542add6](https://github.com/awslabs/iot-app-kit/commit/542add6cac2f40c421687843c3977c9e4cb6e808))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([16451b1](https://github.com/awslabs/iot-app-kit/commit/16451b12e0fe2662069275185b2fea61048d3fab))
* **dashboard:** refactor sitewise clients ([ddac5b2](https://github.com/awslabs/iot-app-kit/commit/ddac5b2626d24bf8bfacb840611b8b880b2c99af))
* expand children in resource explorer ([#115](https://github.com/awslabs/iot-app-kit/issues/115)) ([8f1c03c](https://github.com/awslabs/iot-app-kit/commit/8f1c03c57f19c30dc04fbad10b5622ad9fc3c5bd))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* prevent unsupported data types from being rendered ([#426](https://github.com/awslabs/iot-app-kit/issues/426)) ([dec2a86](https://github.com/awslabs/iot-app-kit/commit/dec2a86f0eccfe87ebfc32d89f74fb8695bb552d))
* **props:** adapt props for synchro-charts ([#133](https://github.com/awslabs/iot-app-kit/issues/133)) ([a98bf06](https://github.com/awslabs/iot-app-kit/commit/a98bf064f14979823f51437dbd599259b6bd6d78))
* refactor app kit ([#67](https://github.com/awslabs/iot-app-kit/issues/67)) ([215584d](https://github.com/awslabs/iot-app-kit/commit/215584db25265437117462c579c1d15c2f1e4dca))
* source-iotsitewise useable module ([#63](https://github.com/awslabs/iot-app-kit/issues/63)) ([21a1014](https://github.com/awslabs/iot-app-kit/commit/21a1014b29df70185360d71fdfb963863b1944d9))
* **source-iotsitewise:** support propertyAlias in quries ([bfe32ce](https://github.com/awslabs/iot-app-kit/commit/bfe32ce74ba6008ae6bb15d1b5f60e8546d36135))
* support fetchMostRecentBeforeStart ([#79](https://github.com/awslabs/iot-app-kit/issues/79)) ([c44b7b8](https://github.com/awslabs/iot-app-kit/commit/c44b7b8d3e04d1b7becacd1fe1f7c59de681d517))


### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **core, source-iotsitewise:** Remove unecessary exports ([#620](https://github.com/awslabs/iot-app-kit/issues/620)) ([4bfe6f8](https://github.com/awslabs/iot-app-kit/commit/4bfe6f8724b48e28c7efc668aa7268f39e60385a))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([164b751](https://github.com/awslabs/iot-app-kit/commit/164b7511ef2d42f1e816d804628440e577f03e43))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* sitewise source time series module ([#71](https://github.com/awslabs/iot-app-kit/issues/71)) ([6671217](https://github.com/awslabs/iot-app-kit/commit/6671217f3f2b813ecec6e907ee85ba6e0dd347c6))
* **source-iotsitewise:** deduplicate batch requests ([#629](https://github.com/awslabs/iot-app-kit/issues/629)) ([0a5e8a1](https://github.com/awslabs/iot-app-kit/commit/0a5e8a1ec7eeec2c7f214a0f8c7963bb66990678))
* **source-iotsitewise:** move testing util to dev dep ([e10e548](https://github.com/awslabs/iot-app-kit/commit/e10e5487bf3f31e3b107a51cb4fc9da28057efe6))
* **source-iotsitewise:** use alarm model name in data stream instead of alarm state name ([3c3a1ae](https://github.com/awslabs/iot-app-kit/commit/3c3a1ae52df8f32d0217e82c463e624cc4880890))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/core-util bumped from 4.0.3 to 5.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/testing-util bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/ts-config bumped from 4.0.3 to 5.0.0
    * eslint-config-iot-app-kit bumped from 4.0.3 to 5.0.0

## [4.0.3](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v4.0.2...source-iotsitewise-v4.0.3) (2023-03-31)


### ⚠ BREAKING CHANGES

* **source-iotsitewise:** support propertyAlias in quries
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* **core, source-iotsitewise:** 
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async
* **core:** Refactored export from `@iot-app-kit/core` IoTAppKitDataModule to be named TimeSeriesDataModule, and removed the concept of multiple data sources per time series data module

### Features

* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([64e64b8](https://github.com/awslabs/iot-app-kit/commit/64e64b800ad3b6ddbee78cfe84c3750e73dead65))
* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* batch API for historical, aggregated, and latest value data ([#137](https://github.com/awslabs/iot-app-kit/issues/137)) ([b7a38e2](https://github.com/awslabs/iot-app-kit/commit/b7a38e225199989524914b88f8da43ca77af2e54))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async ([69a017e](https://github.com/awslabs/iot-app-kit/commit/69a017ea8dfbd99fcd3c155278cac3c241b30527))
* **core:** Refactor time series data module to  remove unused functionality. Add meta field to data stream. ([7f12267](https://github.com/awslabs/iot-app-kit/commit/7f1226784158bdfff6ab67ab5b0523649a2f7a34))
* **core:** Support caching of dataType, name and other fields describing dataStreams ([542add6](https://github.com/awslabs/iot-app-kit/commit/542add6cac2f40c421687843c3977c9e4cb6e808))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([16451b1](https://github.com/awslabs/iot-app-kit/commit/16451b12e0fe2662069275185b2fea61048d3fab))
* **dashboard:** refactor sitewise clients ([ddac5b2](https://github.com/awslabs/iot-app-kit/commit/ddac5b2626d24bf8bfacb840611b8b880b2c99af))
* expand children in resource explorer ([#115](https://github.com/awslabs/iot-app-kit/issues/115)) ([8f1c03c](https://github.com/awslabs/iot-app-kit/commit/8f1c03c57f19c30dc04fbad10b5622ad9fc3c5bd))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* prevent unsupported data types from being rendered ([#426](https://github.com/awslabs/iot-app-kit/issues/426)) ([dec2a86](https://github.com/awslabs/iot-app-kit/commit/dec2a86f0eccfe87ebfc32d89f74fb8695bb552d))
* **props:** adapt props for synchro-charts ([#133](https://github.com/awslabs/iot-app-kit/issues/133)) ([a98bf06](https://github.com/awslabs/iot-app-kit/commit/a98bf064f14979823f51437dbd599259b6bd6d78))
* refactor app kit ([#67](https://github.com/awslabs/iot-app-kit/issues/67)) ([215584d](https://github.com/awslabs/iot-app-kit/commit/215584db25265437117462c579c1d15c2f1e4dca))
* source-iotsitewise useable module ([#63](https://github.com/awslabs/iot-app-kit/issues/63)) ([21a1014](https://github.com/awslabs/iot-app-kit/commit/21a1014b29df70185360d71fdfb963863b1944d9))
* **source-iotsitewise:** support propertyAlias in quries ([bfe32ce](https://github.com/awslabs/iot-app-kit/commit/bfe32ce74ba6008ae6bb15d1b5f60e8546d36135))
* support fetchMostRecentBeforeStart ([#79](https://github.com/awslabs/iot-app-kit/issues/79)) ([c44b7b8](https://github.com/awslabs/iot-app-kit/commit/c44b7b8d3e04d1b7becacd1fe1f7c59de681d517))


### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **core, source-iotsitewise:** Remove unecessary exports ([#620](https://github.com/awslabs/iot-app-kit/issues/620)) ([4bfe6f8](https://github.com/awslabs/iot-app-kit/commit/4bfe6f8724b48e28c7efc668aa7268f39e60385a))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([164b751](https://github.com/awslabs/iot-app-kit/commit/164b7511ef2d42f1e816d804628440e577f03e43))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* sitewise source time series module ([#71](https://github.com/awslabs/iot-app-kit/issues/71)) ([6671217](https://github.com/awslabs/iot-app-kit/commit/6671217f3f2b813ecec6e907ee85ba6e0dd347c6))
* **source-iotsitewise:** deduplicate batch requests ([#629](https://github.com/awslabs/iot-app-kit/issues/629)) ([0a5e8a1](https://github.com/awslabs/iot-app-kit/commit/0a5e8a1ec7eeec2c7f214a0f8c7963bb66990678))
* **source-iotsitewise:** move testing util to dev dep ([e10e548](https://github.com/awslabs/iot-app-kit/commit/e10e5487bf3f31e3b107a51cb4fc9da28057efe6))
* **source-iotsitewise:** use alarm model name in data stream instead of alarm state name ([3c3a1ae](https://github.com/awslabs/iot-app-kit/commit/3c3a1ae52df8f32d0217e82c463e624cc4880890))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/core-util bumped from 4.0.2 to 4.0.3
  * devDependencies
    * @iot-app-kit/jest-config bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/testing-util bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/ts-config bumped from 4.0.2 to 4.0.3
    * eslint-config-iot-app-kit bumped from 4.0.2 to 4.0.3

## [4.0.2](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v4.0.1...source-iotsitewise-v4.0.2) (2023-03-30)


### ⚠ BREAKING CHANGES

* **source-iotsitewise:** support propertyAlias in quries
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* **core, source-iotsitewise:** 
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async
* **core:** Refactored export from `@iot-app-kit/core` IoTAppKitDataModule to be named TimeSeriesDataModule, and removed the concept of multiple data sources per time series data module

### Features

* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([64e64b8](https://github.com/awslabs/iot-app-kit/commit/64e64b800ad3b6ddbee78cfe84c3750e73dead65))
* batch API for historical, aggregated, and latest value data ([#137](https://github.com/awslabs/iot-app-kit/issues/137)) ([b7a38e2](https://github.com/awslabs/iot-app-kit/commit/b7a38e225199989524914b88f8da43ca77af2e54))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async ([69a017e](https://github.com/awslabs/iot-app-kit/commit/69a017ea8dfbd99fcd3c155278cac3c241b30527))
* **core:** Refactor time series data module to  remove unused functionality. Add meta field to data stream. ([7f12267](https://github.com/awslabs/iot-app-kit/commit/7f1226784158bdfff6ab67ab5b0523649a2f7a34))
* **core:** Support caching of dataType, name and other fields describing dataStreams ([542add6](https://github.com/awslabs/iot-app-kit/commit/542add6cac2f40c421687843c3977c9e4cb6e808))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([16451b1](https://github.com/awslabs/iot-app-kit/commit/16451b12e0fe2662069275185b2fea61048d3fab))
* **dashboard:** refactor sitewise clients ([ddac5b2](https://github.com/awslabs/iot-app-kit/commit/ddac5b2626d24bf8bfacb840611b8b880b2c99af))
* expand children in resource explorer ([#115](https://github.com/awslabs/iot-app-kit/issues/115)) ([8f1c03c](https://github.com/awslabs/iot-app-kit/commit/8f1c03c57f19c30dc04fbad10b5622ad9fc3c5bd))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* prevent unsupported data types from being rendered ([#426](https://github.com/awslabs/iot-app-kit/issues/426)) ([dec2a86](https://github.com/awslabs/iot-app-kit/commit/dec2a86f0eccfe87ebfc32d89f74fb8695bb552d))
* **props:** adapt props for synchro-charts ([#133](https://github.com/awslabs/iot-app-kit/issues/133)) ([a98bf06](https://github.com/awslabs/iot-app-kit/commit/a98bf064f14979823f51437dbd599259b6bd6d78))
* refactor app kit ([#67](https://github.com/awslabs/iot-app-kit/issues/67)) ([215584d](https://github.com/awslabs/iot-app-kit/commit/215584db25265437117462c579c1d15c2f1e4dca))
* source-iotsitewise useable module ([#63](https://github.com/awslabs/iot-app-kit/issues/63)) ([21a1014](https://github.com/awslabs/iot-app-kit/commit/21a1014b29df70185360d71fdfb963863b1944d9))
* **source-iotsitewise:** support propertyAlias in quries ([bfe32ce](https://github.com/awslabs/iot-app-kit/commit/bfe32ce74ba6008ae6bb15d1b5f60e8546d36135))
* support fetchMostRecentBeforeStart ([#79](https://github.com/awslabs/iot-app-kit/issues/79)) ([c44b7b8](https://github.com/awslabs/iot-app-kit/commit/c44b7b8d3e04d1b7becacd1fe1f7c59de681d517))


### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **core, source-iotsitewise:** Remove unecessary exports ([#620](https://github.com/awslabs/iot-app-kit/issues/620)) ([4bfe6f8](https://github.com/awslabs/iot-app-kit/commit/4bfe6f8724b48e28c7efc668aa7268f39e60385a))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([164b751](https://github.com/awslabs/iot-app-kit/commit/164b7511ef2d42f1e816d804628440e577f03e43))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* sitewise source time series module ([#71](https://github.com/awslabs/iot-app-kit/issues/71)) ([6671217](https://github.com/awslabs/iot-app-kit/commit/6671217f3f2b813ecec6e907ee85ba6e0dd347c6))
* **source-iotsitewise:** deduplicate batch requests ([#629](https://github.com/awslabs/iot-app-kit/issues/629)) ([0a5e8a1](https://github.com/awslabs/iot-app-kit/commit/0a5e8a1ec7eeec2c7f214a0f8c7963bb66990678))
* **source-iotsitewise:** use alarm model name in data stream instead of alarm state name ([3c3a1ae](https://github.com/awslabs/iot-app-kit/commit/3c3a1ae52df8f32d0217e82c463e624cc4880890))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 4.0.1 to 4.0.2
    * @iot-app-kit/core-util bumped from * to 4.0.2
    * @iot-app-kit/testing-util bumped from * to 4.0.2
  * devDependencies
    * @iot-app-kit/jest-config bumped from * to 4.0.2
    * @iot-app-kit/ts-config bumped from * to 4.0.2
    * eslint-config-iot-app-kit bumped from * to 4.0.2

## [4.0.1](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v4.0.0...source-iotsitewise-v4.0.1) (2023-03-28)


### Features

* **dashboard:** refactor sitewise clients ([ddac5b2](https://github.com/awslabs/iot-app-kit/commit/ddac5b2626d24bf8bfacb840611b8b880b2c99af))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 4.0.0 to 4.0.1

## [4.0.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v3.0.0...source-iotsitewise-v4.0.0) (2023-03-15)


### ⚠ BREAKING CHANGES

* **source-iotsitewise:** support propertyAlias in quries

### Features

* **source-iotsitewise:** support propertyAlias in quries ([bfe32ce](https://github.com/awslabs/iot-app-kit/commit/bfe32ce74ba6008ae6bb15d1b5f60e8546d36135))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 3.0.0 to 4.0.0

## [3.0.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.6.5...source-iotsitewise-v3.0.0) (2023-03-04)


### ⚠ BREAKING CHANGES

* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* **core, source-iotsitewise:** 
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))

### Features

* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))


### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **core, source-iotsitewise:** Remove unecessary exports ([#620](https://github.com/awslabs/iot-app-kit/issues/620)) ([4bfe6f8](https://github.com/awslabs/iot-app-kit/commit/4bfe6f8724b48e28c7efc668aa7268f39e60385a))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* **source-iotsitewise:** deduplicate batch requests ([#629](https://github.com/awslabs/iot-app-kit/issues/629)) ([0a5e8a1](https://github.com/awslabs/iot-app-kit/commit/0a5e8a1ec7eeec2c7f214a0f8c7963bb66990678))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 3.0.0

## [2.6.5](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.6.4...source-iotsitewise-v2.6.5) (2023-01-25)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.4 to ^2.6.5

## [2.6.4](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.6.3...source-iotsitewise-v2.6.4) (2023-01-23)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.3 to ^2.6.4

## [2.6.3](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.6.2...source-iotsitewise-v2.6.3) (2023-01-13)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.2 to ^2.6.3

## [2.6.2](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.6.1...source-iotsitewise-v2.6.2) (2023-01-09)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.1 to ^2.6.2

## [2.6.1](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.6.0...source-iotsitewise-v2.6.1) (2023-01-09)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.0 to ^2.6.1

## [2.6.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.5.1...source-iotsitewise-v2.6.0) (2022-12-19)


### Features

* prevent unsupported data types from being rendered ([#426](https://github.com/awslabs/iot-app-kit/issues/426)) ([dec2a86](https://github.com/awslabs/iot-app-kit/commit/dec2a86f0eccfe87ebfc32d89f74fb8695bb552d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.5.1 to ^2.6.0

## [2.5.1](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.5.0...source-iotsitewise-v2.5.1) (2022-11-16)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.5.0 to ^2.5.1

## [2.5.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.4.2...source-iotsitewise-v2.5.0) (2022-11-11)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.2 to ^2.5.0

## [2.4.2](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.4.1...source-iotsitewise-v2.4.2) (2022-11-08)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.1 to ^2.4.2

## [2.4.1](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.4.0...source-iotsitewise-v2.4.1) (2022-11-07)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.0 to ^2.4.1

## [2.4.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.3.0...source-iotsitewise-v2.4.0) (2022-11-04)


### Miscellaneous Chores

* **source-iotsitewise:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.3.0 to ^2.4.0

## [2.3.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v2.2.0...source-iotsitewise-v2.3.0) (2022-11-02)


### Bug Fixes

* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([016c216](https://github.com/awslabs/iot-app-kit/commit/016c216c2934d150f94e595d3ebb34aaafa69e27))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.2.0 to ^2.3.0

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
* Change time series data modules getRequestsFromQueries to be async ([11f7fb0](https://github.com/awslabs/iot-app-kit/commit/11f7fb0442045d20c1ff9cce1567d3126380b29b))

### Miscellaneous
* bump synchro-charts/core version from v5 to v6 (#199) ([ad1e3e6](https://github.com/awslabs/iot-app-kit/commit/ad1e3e6108cc02d58060365ab4bad950f0e991cc))
* Migrate to NPM workspaces ([8e200be](https://github.com/awslabs/iot-app-kit/commit/8e200be0401fe6fa989cbf9a1ad96aafd8305a96))

## 1.5.0 (2022-07-09)


### Features

* synchro-charts version updated to 5.0.0




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

* sitewise source time series module ([#71](https://github.com/awslabs/iot-app-kit/issues/71)) ([998d59f](https://github.com/awslabs/iot-app-kit/commit/998d59f63fed1c97a9529f54928719e58fc00c5d))


### Features

* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([1d14361](https://github.com/awslabs/iot-app-kit/commit/1d14361b88e86ea44ad2d38409dd53c96f550fd3))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([7b0f3cf](https://github.com/awslabs/iot-app-kit/commit/7b0f3cf443d89ff7f89f334d9c5abb7400ab084b))
* refactor app kit ([#67](https://github.com/awslabs/iot-app-kit/issues/67)) ([ec1ba70](https://github.com/awslabs/iot-app-kit/commit/ec1ba7051e779f947d31aa8611e31d039f60b2be))
* source-iotsitewise useable module ([#63](https://github.com/awslabs/iot-app-kit/issues/63)) ([9807c69](https://github.com/awslabs/iot-app-kit/commit/9807c69dae88933d43e67d5862526a87901e8810))
