# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.
## [10.12.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.11.0...react-components-v10.12.0) (2024-09-13)


### Features

* adding timezone support to dashboard/widgets ([6435b90](https://github.com/awslabs/iot-app-kit/commit/6435b90d93246e319b939b7c316c6ffbea12ef8d))
* **dashboard:** add new RE components to dynamic assets tab ([c588848](https://github.com/awslabs/iot-app-kit/commit/c5888485c3205c7ee572ec01d6f0b34d1789da23))
* **dashboard:** use new RE components to update dashboard RE for modeled and unmodeled data ([d7db11e](https://github.com/awslabs/iot-app-kit/commit/d7db11ee7c16dd012b7ced86dc52cde9a483e24e))
* **react-components:** add auto resolution and batching ([073029f](https://github.com/awslabs/iot-app-kit/commit/073029f4312c988bf099251284bf63d9515e01fd))
* **react-components:** add hook for get asset property value history ([c708b4a](https://github.com/awslabs/iot-app-kit/commit/c708b4a6c2c3e9d6e843829692a2046c00ee6950))
* **react-components:** add hook for latest asset property value ([ce9ec7c](https://github.com/awslabs/iot-app-kit/commit/ce9ec7c714e6c600da59af8f4bffaf210f0041c0))
* **react-components:** add useLatestAlarmPropertyValue hook to fetch alarm prop vals in useAlarms ([18aa854](https://github.com/awslabs/iot-app-kit/commit/18aa8548bbc9aa9d4343a1d85b3cefdb798e1b25))
* **react-components:** implement request functions and hooks to build clients ([2ca7e6c](https://github.com/awslabs/iot-app-kit/commit/2ca7e6caf771bd929b993d79f91f6e7d3ce21350))
* **react-components:** initiali implementation for useTimeSeriesData ([50db88f](https://github.com/awslabs/iot-app-kit/commit/50db88f309e6470bfc510824f6deb564c949b794))
* **react-components:** useAlarms hook ([7103db6](https://github.com/awslabs/iot-app-kit/commit/7103db640cd1531823a51fe3277691c869b581ed))
* **react-components:** useDescribeAssets and useDescribeAssetModels queries implemented ([bfb07e1](https://github.com/awslabs/iot-app-kit/commit/bfb07e16b1fceabdd676ebdb833c4d85baaafb0d))
* **sitewise-alarms:** add useAlarmModels hook to fetch iot events alarm models in useAlarms ([c4c4986](https://github.com/awslabs/iot-app-kit/commit/c4c4986fde3fd65d7ca7e8b1f7a364fcc079ca10))


### Bug Fixes

* **dashboard:** add descriptions to all RE tables ([f7b4f0c](https://github.com/awslabs/iot-app-kit/commit/f7b4f0c89d8b05be988acac54b8edf35ab3b7367))
* **dashboard:** add descriptions to all tables in RE ([c7aff00](https://github.com/awslabs/iot-app-kit/commit/c7aff00ea0d6175186317f06ca7eec4c550de7a0))
* **dashboard:** add timezone support for new RE ([2d4b5dd](https://github.com/awslabs/iot-app-kit/commit/2d4b5ddcbdefe4828168a7864bd679744e5a97eb))
* **dashboard:** fast follow to clean up messy code for table cell render ([649f75d](https://github.com/awslabs/iot-app-kit/commit/649f75d91bd4865d94db633ecd3fb865098fc1ff))
* **dashboard:** fix flaky test in dashboard ([6fe3285](https://github.com/awslabs/iot-app-kit/commit/6fe328510bfd4ed36a24935085aa41ac0c83dfa5))
* **dashboard:** label matches kpi name ([f675d11](https://github.com/awslabs/iot-app-kit/commit/f675d11857c0b0a3869d03d9c1339c405a85d11e))
* **dashboard:** re reflects significant digits + timezone support for unmodeled ([195be67](https://github.com/awslabs/iot-app-kit/commit/195be67fe0e5b7ef7b262491ff4fec574c62db8c))
* **react-components:** ensure enabled flag is never undefined for queries ([eb95ef4](https://github.com/awslabs/iot-app-kit/commit/eb95ef4e8f186f5f969e366321f01d9ab1ea1ab8))
* **react-components:** remove flaky test in new RE ([9e15637](https://github.com/awslabs/iot-app-kit/commit/9e15637ecced497aec52a7189fc1e0adcf1de361))
* **react-components:** skip flaky test in new RE ([e7928d3](https://github.com/awslabs/iot-app-kit/commit/e7928d329edef47871ed9978d820994ad2d76dcc))
* **timeZone:** wrap timezone setState in useEffect ([6cd74a1](https://github.com/awslabs/iot-app-kit/commit/6cd74a1019499b8d6586cac0d26d605cdcd9c928))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.11.0 to 10.12.0
    * @iot-app-kit/core bumped from 10.11.0 to 10.12.0
    * @iot-app-kit/core-util bumped from 10.11.0 to 10.12.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.11.0 to 10.12.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.11.0 to 10.12.0
    * @iot-app-kit/jest-config bumped from 10.11.0 to 10.12.0
    * @iot-app-kit/source-iotsitewise bumped from 10.11.0 to 10.12.0
    * @iot-app-kit/testing-util bumped from 10.11.0 to 10.12.0
    * @iot-app-kit/ts-config bumped from 10.11.0 to 10.12.0
    * eslint-config-iot-app-kit bumped from 10.11.0 to 10.12.0

## [10.11.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.10.2...react-components-v10.11.0) (2024-08-28)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.10.2 to 10.11.0
    * @iot-app-kit/core bumped from 10.10.2 to 10.11.0
    * @iot-app-kit/core-util bumped from 10.10.2 to 10.11.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.10.2 to 10.11.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.10.2 to 10.11.0
    * @iot-app-kit/jest-config bumped from 10.10.2 to 10.11.0
    * @iot-app-kit/source-iotsitewise bumped from 10.10.2 to 10.11.0
    * @iot-app-kit/testing-util bumped from 10.10.2 to 10.11.0
    * @iot-app-kit/ts-config bumped from 10.10.2 to 10.11.0
    * eslint-config-iot-app-kit bumped from 10.10.2 to 10.11.0

## [10.10.2](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.10.1...react-components-v10.10.2) (2024-08-08)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.10.1 to 10.10.2
    * @iot-app-kit/core bumped from 10.10.1 to 10.10.2
    * @iot-app-kit/core-util bumped from 10.10.1 to 10.10.2
    * @iot-app-kit/source-iottwinmaker bumped from 10.10.1 to 10.10.2
  * devDependencies
    * @iot-app-kit/core bumped from 10.10.1 to 10.10.2
    * @iot-app-kit/jest-config bumped from 10.10.1 to 10.10.2
    * @iot-app-kit/source-iotsitewise bumped from 10.10.1 to 10.10.2
    * @iot-app-kit/testing-util bumped from 10.10.1 to 10.10.2
    * @iot-app-kit/ts-config bumped from 10.10.1 to 10.10.2
    * eslint-config-iot-app-kit bumped from 10.10.1 to 10.10.2

## [10.10.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.10.0...react-components-v10.10.1) (2024-08-02)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.10.0 to 10.10.1
    * @iot-app-kit/core bumped from 10.10.0 to 10.10.1
    * @iot-app-kit/core-util bumped from 10.10.0 to 10.10.1
    * @iot-app-kit/source-iottwinmaker bumped from 10.10.0 to 10.10.1
  * devDependencies
    * @iot-app-kit/core bumped from 10.10.0 to 10.10.1
    * @iot-app-kit/jest-config bumped from 10.10.0 to 10.10.1
    * @iot-app-kit/source-iotsitewise bumped from 10.10.0 to 10.10.1
    * @iot-app-kit/testing-util bumped from 10.10.0 to 10.10.1
    * @iot-app-kit/ts-config bumped from 10.10.0 to 10.10.1
    * eslint-config-iot-app-kit bumped from 10.10.0 to 10.10.1

## [10.10.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.9.0...react-components-v10.10.0) (2024-07-29)


### Features

* add timezone converter util ([e5d59c4](https://github.com/awslabs/iot-app-kit/commit/e5d59c43803a03413e77556f6ca4179b18ecb3d7))


### Bug Fixes

* **dashboard:** adds resolution and aggregation to new proeprty in gauge widget ([5f5af30](https://github.com/awslabs/iot-app-kit/commit/5f5af3068defeb2a609e68ca0d29cc09f9960cfd))
* move data quality widget on gauge to be closer to value ([d20b65f](https://github.com/awslabs/iot-app-kit/commit/d20b65f5704ffd5d56c4f402877be72d59adcadd))
* **react-components:** gauge properly shows property name again ([ddb65c6](https://github.com/awslabs/iot-app-kit/commit/ddb65c6304c473e01e0c7ae3e868eba98923574c))
* **react-components:** gauge thresholds with negative ranges ([2100221](https://github.com/awslabs/iot-app-kit/commit/21002216dc53230e95762ac3f46734ab90d8d1f6))
* **react-components:** gestures prop works ([6141c32](https://github.com/awslabs/iot-app-kit/commit/6141c3234095c658240e528207cdcbe3ff6e2d62))
* update data quality UX to match mocks ([ed62846](https://github.com/awslabs/iot-app-kit/commit/ed628461c0dd582ae2f03f06b81c8d25aab3832c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.9.0 to 10.10.0
    * @iot-app-kit/core bumped from 10.9.0 to 10.10.0
    * @iot-app-kit/core-util bumped from 10.9.0 to 10.10.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.9.0 to 10.10.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.9.0 to 10.10.0
    * @iot-app-kit/jest-config bumped from 10.9.0 to 10.10.0
    * @iot-app-kit/source-iotsitewise bumped from 10.9.0 to 10.10.0
    * @iot-app-kit/testing-util bumped from 10.9.0 to 10.10.0
    * @iot-app-kit/ts-config bumped from 10.9.0 to 10.10.0
    * eslint-config-iot-app-kit bumped from 10.9.0 to 10.10.0

## [10.9.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.8.1...react-components-v10.9.0) (2024-07-08)


### Bug Fixes

* **react-components:** anomaly chart move loading state ([581a3c5](https://github.com/awslabs/iot-app-kit/commit/581a3c57734ba460ced0e32e232ed38583f232ba))
* **react-components:** anomaly chart xaxis formatting ([740ee2a](https://github.com/awslabs/iot-app-kit/commit/740ee2a0ecbbe29c43a02fd04c0193935d79dd0e))
* **react-components:** ensure anomaly chart colors are in order ([3fd8d87](https://github.com/awslabs/iot-app-kit/commit/3fd8d87c2dee6615a7e22962c0d8dbd0cfff97c0))
* **react-components:** improve axis styling and add labels ([490058f](https://github.com/awslabs/iot-app-kit/commit/490058fbdb9ca102ca85abc2ff5770caafa52a71))
* **react-components:** minor anomaly widget style changes ([19fc67a](https://github.com/awslabs/iot-app-kit/commit/19fc67a7768604d39c728ea4e1df8f318042d8b8))
* **react-components:** zoom icons ([4da01df](https://github.com/awslabs/iot-app-kit/commit/4da01df378b1d3e2804c4802bd9250c7e180990f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.8.1 to 10.9.0
    * @iot-app-kit/core bumped from 10.8.1 to 10.9.0
    * @iot-app-kit/core-util bumped from 10.8.1 to 10.9.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.8.1 to 10.9.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.8.1 to 10.9.0
    * @iot-app-kit/jest-config bumped from 10.8.1 to 10.9.0
    * @iot-app-kit/source-iotsitewise bumped from 10.8.1 to 10.9.0
    * @iot-app-kit/testing-util bumped from 10.8.1 to 10.9.0
    * @iot-app-kit/ts-config bumped from 10.8.1 to 10.9.0
    * eslint-config-iot-app-kit bumped from 10.8.1 to 10.9.0

## [10.8.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.8.0...react-components-v10.8.1) (2024-06-27)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.8.0 to 10.8.1
    * @iot-app-kit/core bumped from 10.8.0 to 10.8.1
    * @iot-app-kit/core-util bumped from 10.8.0 to 10.8.1
    * @iot-app-kit/source-iottwinmaker bumped from 10.8.0 to 10.8.1
  * devDependencies
    * @iot-app-kit/core bumped from 10.8.0 to 10.8.1
    * @iot-app-kit/jest-config bumped from 10.8.0 to 10.8.1
    * @iot-app-kit/source-iotsitewise bumped from 10.8.0 to 10.8.1
    * @iot-app-kit/testing-util bumped from 10.8.0 to 10.8.1
    * @iot-app-kit/ts-config bumped from 10.8.0 to 10.8.1
    * eslint-config-iot-app-kit bumped from 10.8.0 to 10.8.1

## [10.8.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.7.0...react-components-v10.8.0) (2024-06-24)


### Features

* **anomaly-chart:** added `gestures` enablement option ([4c2402c](https://github.com/awslabs/iot-app-kit/commit/4c2402c44a5c3538fdc60fe8210b626670073479))
* **react-components:** add arrow datasource ([efb0d6d](https://github.com/awslabs/iot-app-kit/commit/efb0d6d01549011e57400c6b48033264a7e122c9))


### Bug Fixes

* **react-components:** improve gauge thresholds ([09b352f](https://github.com/awslabs/iot-app-kit/commit/09b352f9a255cf3fb04f8c0382a8013db0f1ae35))
* **react-components:** thresholds properly add and remove series ([bb8e451](https://github.com/awslabs/iot-app-kit/commit/bb8e451fbb4ed57a204b9936cf2e1c8853931c60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.7.0 to 10.8.0
    * @iot-app-kit/core bumped from 10.7.0 to 10.8.0
    * @iot-app-kit/core-util bumped from 10.7.0 to 10.8.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.7.0 to 10.8.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.7.0 to 10.8.0
    * @iot-app-kit/jest-config bumped from 10.7.0 to 10.8.0
    * @iot-app-kit/source-iotsitewise bumped from 10.7.0 to 10.8.0
    * @iot-app-kit/testing-util bumped from 10.7.0 to 10.8.0
    * @iot-app-kit/ts-config bumped from 10.7.0 to 10.8.0
    * eslint-config-iot-app-kit bumped from 10.7.0 to 10.8.0

## [10.7.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.6.1...react-components-v10.7.0) (2024-06-18)


### Features

* customize gauge in dashboard config ([8af089e](https://github.com/awslabs/iot-app-kit/commit/8af089e94a2c11cab1c9473d384ed241da7f6461))
* onViewportChange and currentViewport ([d63c9e3](https://github.com/awslabs/iot-app-kit/commit/d63c9e3a416e78a78b3a453755be39a6879eb07c))


### Bug Fixes

* **dashboard:** decimal places fixes ([710a6ae](https://github.com/awslabs/iot-app-kit/commit/710a6aeee8e16fbf7f204d9214dbd8c86fce16e2))
* **react-components:** add timezone to anomaly chart ([5379bd1](https://github.com/awslabs/iot-app-kit/commit/5379bd19d0d47e62f42a19230e9cf52e2a715d95))
* **react-components:** anomaly chart timestamp padding ([b376bf4](https://github.com/awslabs/iot-app-kit/commit/b376bf4861f58bd5489c907d2ae72107a2178eb3))
* **react-components:** do not use decimal places setting in y axis ([f9fbf74](https://github.com/awslabs/iot-app-kit/commit/f9fbf74311af528b89ad34333b36508eeb3d9ae5))
* **react-components:** ensure chart uses initial passed in viewport ([0b17318](https://github.com/awslabs/iot-app-kit/commit/0b173182adb4180ca0065b4238549cd30a0af3d2))
* **react-components:** fix chart flickering and bugginess in live mode ([3cc3b41](https://github.com/awslabs/iot-app-kit/commit/3cc3b41d59d5c799b750eb76d809007b30dfe2a8))
* **react-components:** fix passed in viewport for anomaly widget ([f73fafc](https://github.com/awslabs/iot-app-kit/commit/f73fafcd5dfdf7238f69848f1808fbbb0b17f281))
* **react-components:** fix support for anomaly datasource outside of time sync ([d45cc6b](https://github.com/awslabs/iot-app-kit/commit/d45cc6b45adb67b8bc44b975a2a65c5942f0d746))
* **react-components:** make anomaly chart responsive ([4b31b8c](https://github.com/awslabs/iot-app-kit/commit/4b31b8cece18f1a1e1e91447c31ca79ec0b3867f))
* **react-components:** timestamp bar correct date ([2063935](https://github.com/awslabs/iot-app-kit/commit/20639352a433cea9abfceee439f7aa9c36db05b9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.6.1 to 10.7.0
    * @iot-app-kit/core bumped from 10.6.1 to 10.7.0
    * @iot-app-kit/core-util bumped from 10.6.1 to 10.7.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.6.1 to 10.7.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.6.1 to 10.7.0
    * @iot-app-kit/jest-config bumped from 10.6.1 to 10.7.0
    * @iot-app-kit/source-iotsitewise bumped from 10.6.1 to 10.7.0
    * @iot-app-kit/testing-util bumped from 10.6.1 to 10.7.0
    * @iot-app-kit/ts-config bumped from 10.6.1 to 10.7.0
    * eslint-config-iot-app-kit bumped from 10.6.1 to 10.7.0

## [10.6.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.6.0...react-components-v10.6.1) (2024-06-12)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.6.0 to 10.6.1
    * @iot-app-kit/core bumped from 10.6.0 to 10.6.1
    * @iot-app-kit/core-util bumped from 10.6.0 to 10.6.1
    * @iot-app-kit/source-iottwinmaker bumped from 10.6.0 to 10.6.1
  * devDependencies
    * @iot-app-kit/core bumped from 10.6.0 to 10.6.1
    * @iot-app-kit/jest-config bumped from 10.6.0 to 10.6.1
    * @iot-app-kit/source-iotsitewise bumped from 10.6.0 to 10.6.1
    * @iot-app-kit/testing-util bumped from 10.6.0 to 10.6.1
    * @iot-app-kit/ts-config bumped from 10.6.0 to 10.6.1
    * eslint-config-iot-app-kit bumped from 10.6.0 to 10.6.1

## [10.6.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.5.0...react-components-v10.6.0) (2024-06-06)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.5.0 to 10.6.0
    * @iot-app-kit/core bumped from 10.5.0 to 10.6.0
    * @iot-app-kit/core-util bumped from 10.5.0 to 10.6.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.5.0 to 10.6.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.5.0 to 10.6.0
    * @iot-app-kit/jest-config bumped from 10.5.0 to 10.6.0
    * @iot-app-kit/source-iotsitewise bumped from 10.5.0 to 10.6.0
    * @iot-app-kit/testing-util bumped from 10.5.0 to 10.6.0
    * @iot-app-kit/ts-config bumped from 10.5.0 to 10.6.0
    * eslint-config-iot-app-kit bumped from 10.5.0 to 10.6.0

## [10.5.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.4.1...react-components-v10.5.0) (2024-05-29)


### Features

* **dashboard:** default viewport setting ([0c3f3ef](https://github.com/awslabs/iot-app-kit/commit/0c3f3efa3a48be537d0eed0e6a1a02ecaa7c1f03))
* resource explorers ([f604b15](https://github.com/awslabs/iot-app-kit/commit/f604b15dd35e014e78e1f56fd666602767e6b5bd))


### Bug Fixes

* **react-components:** anomaly widget error and empty states ([2d70b79](https://github.com/awslabs/iot-app-kit/commit/2d70b79467fe94621dd722bb95e7f52c21b477f2))
* **react-components:** comment out flaky resource expl tests ([ca1039d](https://github.com/awslabs/iot-app-kit/commit/ca1039dc5c66cd30cc578651184463c889febd83))
* **react-components:** filter out non anomalous data ([70f0a1c](https://github.com/awslabs/iot-app-kit/commit/70f0a1cdbada92336d9597c6e2a5f456896a15f5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.4.1 to 10.5.0
    * @iot-app-kit/core bumped from 10.4.1 to 10.5.0
    * @iot-app-kit/core-util bumped from 10.4.1 to 10.5.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.4.1 to 10.5.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.4.1 to 10.5.0
    * @iot-app-kit/jest-config bumped from 10.4.1 to 10.5.0
    * @iot-app-kit/source-iotsitewise bumped from 10.4.1 to 10.5.0
    * @iot-app-kit/testing-util bumped from 10.4.1 to 10.5.0
    * @iot-app-kit/ts-config bumped from 10.4.1 to 10.5.0
    * eslint-config-iot-app-kit bumped from 10.4.1 to 10.5.0

## [10.4.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.4.0...react-components-v10.4.1) (2024-05-20)


### Bug Fixes

* **react-components:** update date-fns dependency ([1267b65](https://github.com/awslabs/iot-app-kit/commit/1267b6583034f17b14b8ca1de52125640bfdf3ea))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.4.0 to 10.4.1
    * @iot-app-kit/core bumped from 10.4.0 to 10.4.1
    * @iot-app-kit/core-util bumped from 10.4.0 to 10.4.1
    * @iot-app-kit/source-iottwinmaker bumped from 10.4.0 to 10.4.1
  * devDependencies
    * @iot-app-kit/core bumped from 10.4.0 to 10.4.1
    * @iot-app-kit/jest-config bumped from 10.4.0 to 10.4.1
    * @iot-app-kit/source-iotsitewise bumped from 10.4.0 to 10.4.1
    * @iot-app-kit/testing-util bumped from 10.4.0 to 10.4.1
    * @iot-app-kit/ts-config bumped from 10.4.0 to 10.4.1
    * eslint-config-iot-app-kit bumped from 10.4.0 to 10.4.1

## [10.4.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.3.0...react-components-v10.4.0) (2024-05-20)


### Features

* add anomaly query ([3c11512](https://github.com/awslabs/iot-app-kit/commit/3c115121db6fc8248bcd6b36989f6ebea3212ba7))
* add gauge component in doc site package ([17a02f5](https://github.com/awslabs/iot-app-kit/commit/17a02f54ac811ab384aa6b8ad2dd4f61e0cc1514))
* add step chart to l4e ([0983438](https://github.com/awslabs/iot-app-kit/commit/0983438c28ad7603e689697b0bd68cc10ce6fb50))
* gauge widget to dashboard ([17cde64](https://github.com/awslabs/iot-app-kit/commit/17cde64259ab6b69beec2f2de4eaca9750504a5c))
* guage component data quality and error text ([2dca188](https://github.com/awslabs/iot-app-kit/commit/2dca1889462a6002980b105ae5338265c187b502))
* guage component initail commit ([305657a](https://github.com/awslabs/iot-app-kit/commit/305657a7aa761883da7a9839d0ae0a3914751a51))
* **react-components:** add axis option to anomaly widget ([d0733e1](https://github.com/awslabs/iot-app-kit/commit/d0733e12863f4ee2db1e29576c8ea6b1d5964f62))
* **react-components:** add intl ([c7c30c3](https://github.com/awslabs/iot-app-kit/commit/c7c30c3f969c71de6856d98d59e1043a6c785a45))
* **react-components:** add l4e datasource ([748f8c1](https://github.com/awslabs/iot-app-kit/commit/748f8c17d56bbef0f2190fde38b5717c29d1d942))
* **react-components:** add l4e queries ([328da8e](https://github.com/awslabs/iot-app-kit/commit/328da8ed9341c68c8c0a3a6b672170f1fa8eeb37))
* **react-components:** l4e anomaly tests ([fbff596](https://github.com/awslabs/iot-app-kit/commit/fbff5968b7ddb406fa0eaaa21b84489010d55591))
* **react-components:** y axis and timestamp options ([bfe2520](https://github.com/awslabs/iot-app-kit/commit/bfe2520a731dc6ea24d0ad928084546d45ed8643))
* **widgets:** add name style settings for line/table + edit label in config panel ([f5e9b3f](https://github.com/awslabs/iot-app-kit/commit/f5e9b3fc99a176b3d9eb54ef0a387d171791aaf9))


### Bug Fixes

* add default settings to charts ([5917c83](https://github.com/awslabs/iot-app-kit/commit/5917c83674ffe67ced2bc7fe18c226460c115e80))
* add trailing zeros to decimal point rounding, fix rounding function ([9c13177](https://github.com/awslabs/iot-app-kit/commit/9c131779c5a3f5b2ce7c6d1239e54ed82bfbf572))
* better handling of light and dark mode w thresholds ([bd70051](https://github.com/awslabs/iot-app-kit/commit/bd70051944a9a21e21479f4793614f85a4716b2b))
* fix bugs on l4e widget ([17a4896](https://github.com/awslabs/iot-app-kit/commit/17a489631da778b13fcb194b8bd527874e9e2858))
* l4e bug fixes ([a71673c](https://github.com/awslabs/iot-app-kit/commit/a71673c9fbc701a5e26ed8d8c9bda191bc9b9285))
* l4e widget quick fixes ([286f724](https://github.com/awslabs/iot-app-kit/commit/286f7244ac501ffc877dd0e0d40d76e97ab98bda))
* migrated tooltip css to styled component for customizing theming options [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([515ad24](https://github.com/awslabs/iot-app-kit/commit/515ad2478abf20a9490ac725ee80ce7cc6ae111f))
* **react-components:** add error state ([e16671f](https://github.com/awslabs/iot-app-kit/commit/e16671f11bbae4b768220b93b8cae0fe9ffee9c3))
* **react-components:** add snapshot tests ([178f0e7](https://github.com/awslabs/iot-app-kit/commit/178f0e7bbba316c711ff7c8fc18455cdccf939fb))
* **react-components:** center error ([12da428](https://github.com/awslabs/iot-app-kit/commit/12da428c354b999a8dc350e3811cd9f3a44ef782))
* **react-components:** export anomaly chart ([30ae675](https://github.com/awslabs/iot-app-kit/commit/30ae675d92acd26d0414f6aa2da953bc0b37d5e7))
* **react-components:** fix error state display ([dead60a](https://github.com/awslabs/iot-app-kit/commit/dead60a175b236b4d74d1ca65a882821c5e49e26))
* **react-components:** fix get value history request ([a701ef4](https://github.com/awslabs/iot-app-kit/commit/a701ef48519807612715eaf2714f3eb6a306de05))
* **react-components:** gauge thresholds ([8e3bec3](https://github.com/awslabs/iot-app-kit/commit/8e3bec3f6058c9c96ac42439c1b33b90a0d3912e))
* **react-components:** support nanoseconds for datapoints ([34d2dff](https://github.com/awslabs/iot-app-kit/commit/34d2dff489ff77d9eb9226443218b4c7cf725ff2))
* **react-components:** viewport fixes ([b5846ed](https://github.com/awslabs/iot-app-kit/commit/b5846edf5c795c2bccdfee2a71d6b65f44dd56e5))
* sort and pagination colors ([4dd6bb9](https://github.com/awslabs/iot-app-kit/commit/4dd6bb94198cd4c40fb1bde2d0b350c97d4ec540))
* tooltip styled component issue is fixed ([5af6e22](https://github.com/awslabs/iot-app-kit/commit/5af6e2285cfc2e346e417e13f305f3a0a0c05439))
* updated the new set of design tokens [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([7bdb8b0](https://github.com/awslabs/iot-app-kit/commit/7bdb8b08db1dcdc06153d71eff191a5e5a93a48b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.3.0 to 10.4.0
    * @iot-app-kit/core bumped from 10.3.0 to 10.4.0
    * @iot-app-kit/core-util bumped from 10.3.0 to 10.4.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.3.0 to 10.4.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.3.0 to 10.4.0
    * @iot-app-kit/jest-config bumped from 10.3.0 to 10.4.0
    * @iot-app-kit/source-iotsitewise bumped from 10.3.0 to 10.4.0
    * @iot-app-kit/testing-util bumped from 10.3.0 to 10.4.0
    * @iot-app-kit/ts-config bumped from 10.3.0 to 10.4.0
    * eslint-config-iot-app-kit bumped from 10.3.0 to 10.4.0

## [10.3.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.2.0...react-components-v10.3.0) (2024-05-09)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.2.0 to 10.3.0
    * @iot-app-kit/core bumped from 10.2.0 to 10.3.0
    * @iot-app-kit/core-util bumped from 10.2.0 to 10.3.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.2.0 to 10.3.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.2.0 to 10.3.0
    * @iot-app-kit/jest-config bumped from 10.2.0 to 10.3.0
    * @iot-app-kit/source-iotsitewise bumped from 10.2.0 to 10.3.0
    * @iot-app-kit/testing-util bumped from 10.2.0 to 10.3.0
    * @iot-app-kit/ts-config bumped from 10.2.0 to 10.3.0
    * eslint-config-iot-app-kit bumped from 10.2.0 to 10.3.0

## [10.2.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.1.0...react-components-v10.2.0) (2024-03-29)


### Features

* add data quality to kpi and status ([7248004](https://github.com/awslabs/iot-app-kit/commit/724800417bc8c74f518d6a39044c815848ef431f))
* display assetname conditionally in legend [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([c4c443f](https://github.com/awslabs/iot-app-kit/commit/c4c443fab77d6e337d32fbecebb308c7f339fab5))
* l4e table ([5bd6898](https://github.com/awslabs/iot-app-kit/commit/5bd68983268d00ff60bf0434e5b810e52254c16c))
* l4e timeline (mock data only) ([829496c](https://github.com/awslabs/iot-app-kit/commit/829496cd0f51fb4131b5a081c8ecc7d17763b5be))
* **react-components:** add data quality to xy-plot ([ed18e0d](https://github.com/awslabs/iot-app-kit/commit/ed18e0d891035803dfc0cc646371ae1e20914d2a))
* updated the theming support for kpi and tc [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([d32a018](https://github.com/awslabs/iot-app-kit/commit/d32a0184518ef02222ef15359d49bccb68f6ee39))


### Bug Fixes

* l4e code clean up ([ad19b6c](https://github.com/awslabs/iot-app-kit/commit/ad19b6c68c515182454d9132629f2736f5fa4988))
* updated theming support for buttons [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([1ffead0](https://github.com/awslabs/iot-app-kit/commit/1ffead0805048445b677f4cd63a31af7d5912095))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/core bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/core-util bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.1.0 to 10.2.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/jest-config bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/source-iotsitewise bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/testing-util bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/ts-config bumped from 10.1.0 to 10.2.0
    * eslint-config-iot-app-kit bumped from 10.1.0 to 10.2.0

## [10.1.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v10.0.0...react-components-v10.1.0) (2024-03-21)


### Features

* add a widget level loading indicator for x-y plot ([9be5617](https://github.com/awslabs/iot-app-kit/commit/9be5617aabe7a1edf88876406aeb1e83f174a288))
* added data quality icon and text next to value in table [#2664](https://github.com/awslabs/iot-app-kit/issues/2664) ([91cd12f](https://github.com/awslabs/iot-app-kit/commit/91cd12f9e73fa5c77ab8e7209376116f4307526b))
* added support for border theming options [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([66e6680](https://github.com/awslabs/iot-app-kit/commit/66e6680fbea3f005aba7239c3c47bf13e5184462))
* chart legend support px rem em % unit type ([4e023e6](https://github.com/awslabs/iot-app-kit/commit/4e023e6c4a735189e2db04de886555a0199087b2))
* new KPI and update tests ([328e41a](https://github.com/awslabs/iot-app-kit/commit/328e41ae6f1b25c743a16f03d966a5b97408455a))
* support theming using cloudscape mechanism [#2667](https://github.com/awslabs/iot-app-kit/issues/2667) ([c342310](https://github.com/awslabs/iot-app-kit/commit/c3423101f4f60410d2168a2605fadeb3c6c2d5bc))
* user selected dashboard refresh-rate ([1c1256d](https://github.com/awslabs/iot-app-kit/commit/1c1256da83c938037a47e930c127c2bf3bc14e90))


### Bug Fixes

* add missing loading indication for widget values ([d90f9a6](https://github.com/awslabs/iot-app-kit/commit/d90f9a68e63b6280c1fb1187b8b34853fc2047ec))
* datastream not show unit if it's undefined [#2660](https://github.com/awslabs/iot-app-kit/issues/2660) ([7418773](https://github.com/awslabs/iot-app-kit/commit/7418773d7a39ef978ad3663e12fcf87082767f54))
* pass in refresh rate through the query instead of props ([b6df585](https://github.com/awslabs/iot-app-kit/commit/b6df5856b4407c74d4746d12a1781d11976f9948))
* **react components:** updating import for popper.js ([00c1707](https://github.com/awslabs/iot-app-kit/commit/00c17078163cc2ef48a8eb6e370652ca9823e8e2))
* **react-components:** lowered min/max throttle to match TC throttle ([e972b1b](https://github.com/awslabs/iot-app-kit/commit/e972b1bfe89a25094b9884c38afd2ac7faa35c5c))
* refresh rate defined in dashboard and on query ([43cc5e4](https://github.com/awslabs/iot-app-kit/commit/43cc5e437543aed60663620655044cba9437a226))
* remove duplicate constants and types ([45c155b](https://github.com/awslabs/iot-app-kit/commit/45c155b414a29c767e276060f1c60ce8401ea456))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/core bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/core-util bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.0.0 to 10.1.0
  * devDependencies
    * @iot-app-kit/core bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/jest-config bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/source-iotsitewise bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/testing-util bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/ts-config bumped from 10.0.0 to 10.1.0
    * eslint-config-iot-app-kit bumped from 10.0.0 to 10.1.0

## [10.0.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.15.0...react-components-v10.0.0) (2024-02-28)


### Features

* add threshold settings to KPI ([2fa0429](https://github.com/awslabs/iot-app-kit/commit/2fa0429b6262092b4b3c86c21b8808b90e2d49fe))
* added a label time range for viewport picker in dashboard header [#2559](https://github.com/awslabs/iot-app-kit/issues/2559) ([743cb80](https://github.com/awslabs/iot-app-kit/commit/743cb80ec36d116d6ef25e97ec54f2238ddb2ea1))
* added accessible labels to different toolbar container [#2510](https://github.com/awslabs/iot-app-kit/issues/2510) ([ce5af6f](https://github.com/awslabs/iot-app-kit/commit/ce5af6fbc6e6b887f3fade9395bcbf54da386a88))
* added viewport timestamps in xy plot [#2470](https://github.com/awslabs/iot-app-kit/issues/2470) ([46c1d24](https://github.com/awslabs/iot-app-kit/commit/46c1d24b99ff2ca9fb990ceed341ad6820c21f01))
* conditionally display latest value in legend table  [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([d3feb29](https://github.com/awslabs/iot-app-kit/commit/d3feb2920f3c63b0b2ce9580fc07a86475fc1ff1))
* kpi and status gated config panel ([1f56b4f](https://github.com/awslabs/iot-app-kit/commit/1f56b4f2e7212ddfcc216fb778e0d4db57309ab2))
* new design status (gated) ([69d6c97](https://github.com/awslabs/iot-app-kit/commit/69d6c979d1baefd4fd486cf0d1402b7357e8506b))
* **react-components:** add max column to legend ([322c20f](https://github.com/awslabs/iot-app-kit/commit/322c20f0d438ecb45ee02fae186f6a198963c5b6))
* **react-components:** add min column to legend ([69ba923](https://github.com/awslabs/iot-app-kit/commit/69ba92324da42770e267c9a0bce717ebf1ca0dbf))
* **react-components:** calculate min/max and store value in store for chart to consume ([41b8551](https://github.com/awslabs/iot-app-kit/commit/41b855103e6643dd79e6e0fc9e7350fddefd9101))
* show/hide aggregation and resolution in KPI ([aef1f14](https://github.com/awslabs/iot-app-kit/commit/aef1f146c6d4db03d759b76896d78e966b1ce1e6))
* updated KPI style (gated) ([31ea2f3](https://github.com/awslabs/iot-app-kit/commit/31ea2f371676be9b6412073772b9110b01c42786))
* widget tool box on mouse hover and selection state ([c80d42a](https://github.com/awslabs/iot-app-kit/commit/c80d42a3d10223d0d7edd5b3ee1b23c9ab613399))


### Bug Fixes

* chart gesture icons overlap on mouse hover ([b5e5c0d](https://github.com/awslabs/iot-app-kit/commit/b5e5c0d6115ed8eb9d819a9b4ceef31c7b56db2b))
* internal pipeline has issues with lfs, reverting ([968f950](https://github.com/awslabs/iot-app-kit/commit/968f95005c51591d7cb99af323808fd232b8d4e9))
* min max is sortable and not present on widget add ([7578a2e](https://github.com/awslabs/iot-app-kit/commit/7578a2e113221b2d3c00c01d2ede253e7ce07081))
* min/max values have correct significant digits ([50e183d](https://github.com/awslabs/iot-app-kit/commit/50e183d240ecf329362e10d21b9864d08cb525ee))
* remove fetchMostRecentBeforeStart from status and kpi ([f9b3183](https://github.com/awslabs/iot-app-kit/commit/f9b3183ce5e52462f5120362a130b4aea6588671))
* update react-components public API for status and kpi widgets ([5e7bd49](https://github.com/awslabs/iot-app-kit/commit/5e7bd49fc6ae36fbdbd85e8c02bbb0b4ac082346))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/core bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/core-util bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.15.0 to 10.0.0
  * devDependencies
    * @iot-app-kit/core bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/jest-config bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/source-iotsitewise bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/testing-util bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/ts-config bumped from 9.15.0 to 10.0.0
    * eslint-config-iot-app-kit bumped from 9.15.0 to 10.0.0

## [9.15.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.14.0...react-components-v9.15.0) (2024-02-01)


### Features

* display legend unit conditionally  [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([9f6440e](https://github.com/awslabs/iot-app-kit/commit/9f6440e9e06c9040a6be46eab3a9141ad02a0509))
* legend resize ([792b617](https://github.com/awslabs/iot-app-kit/commit/792b6170cc19402f3c49fbd60e4a07dc0890c434))
* **react-components:** trendcurors using echarts extension ([a7c6bbe](https://github.com/awslabs/iot-app-kit/commit/a7c6bbe064ae746f024b74d885721a70a06716a2))


### Bug Fixes

* add signigicant digits to xy plot ([70a109e](https://github.com/awslabs/iot-app-kit/commit/70a109e8083b6729313f4f0dc362df0f3cf6ea62))
* fix filtered data on zooms ([99e2f90](https://github.com/awslabs/iot-app-kit/commit/99e2f90aecdbaaa354e62e76b22c88a8530c1509))
* hidden and highlighted datastreams persist correctly ([5a85bb7](https://github.com/awslabs/iot-app-kit/commit/5a85bb7d40d07dce439a1bfa15550d8893089cbd))
* react-component Chart story book is broken ([c273ad5](https://github.com/awslabs/iot-app-kit/commit/c273ad529a7d78f887a2b8c64b50f76bfc018fc2))
* **react-components:** fix global and chart store persistence ([83f1345](https://github.com/awslabs/iot-app-kit/commit/83f13452cbf350639cc2cc576d47a26138d58832))
* **react-components:** refactor legend table into modules ([f5eed70](https://github.com/awslabs/iot-app-kit/commit/f5eed7068b70ae9305782f07b08115294b26a3b7))
* yAxis label collides with yAxis name [#2471](https://github.com/awslabs/iot-app-kit/issues/2471) ([85ac6ac](https://github.com/awslabs/iot-app-kit/commit/85ac6ac4586d560e44cadedbffe5b1a187bd8bb8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/core bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/core-util bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.14.0 to 9.15.0
  * devDependencies
    * @iot-app-kit/core bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/jest-config bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/source-iotsitewise bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/testing-util bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/ts-config bumped from 9.14.0 to 9.15.0
    * eslint-config-iot-app-kit bumped from 9.14.0 to 9.15.0

## [9.14.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.13.0...react-components-v9.14.0) (2024-01-18)


### Features

* changed ui experience of chart legend based on legend position [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([de1f147](https://github.com/awslabs/iot-app-kit/commit/de1f14772b614f67156a34ac64300111a6c55126))


### Bug Fixes

* improved zoom and default values for y axis ([112e5c5](https://github.com/awslabs/iot-app-kit/commit/112e5c58d7e3478dec03dfbb2eb52ec315b4690d))
* make context menu appear on top of chart tooltip ([e1622c8](https://github.com/awslabs/iot-app-kit/commit/e1622c86bf4ead6856e7e1c9be1d5b8a1d6d4d61))
* **react-components:** fix the mouse events ([7c07a37](https://github.com/awslabs/iot-app-kit/commit/7c07a37eb5e8649a6d967c96b297659caad270a8))
* **react-components:** refactor chart to use dataset ([b403789](https://github.com/awslabs/iot-app-kit/commit/b4037897cd4e7169958373bbf61d29c7454706ef))
* removed tanstack table related code ([c8be85d](https://github.com/awslabs/iot-app-kit/commit/c8be85d919faac44441f4b00aa81ac7dbf215599))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/core bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/core-util bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.13.0 to 9.14.0
  * devDependencies
    * @iot-app-kit/core bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/jest-config bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/source-iotsitewise bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/testing-util bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/ts-config bumped from 9.13.0 to 9.14.0
    * eslint-config-iot-app-kit bumped from 9.13.0 to 9.14.0

## [9.13.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.12.0...react-components-v9.13.0) (2024-01-05)


### Features

* legend table is implemeted using tanstack table ([c92533a](https://github.com/awslabs/iot-app-kit/commit/c92533a342c95618d6dcf7d2a13bdad204bb01de))
* **react-components:** hide/show properties from legend ([e666cf1](https://github.com/awslabs/iot-app-kit/commit/e666cf1cfba8343d1a5bbb0f38a4341969a18575))
* **ResourceExplorer:** hide properties table when not needed to be displayed ([0fca5e9](https://github.com/awslabs/iot-app-kit/commit/0fca5e9089ac7af52e1d31b2143acb121cb7869b))
* xy-plot y axis lable changes [#2378](https://github.com/awslabs/iot-app-kit/issues/2378) ([48389c3](https://github.com/awslabs/iot-app-kit/commit/48389c3e59305525b11b63233c3a79d4a8e3a78d))


### Bug Fixes

* fix data-zoom behavior for base chart ([0c66a80](https://github.com/awslabs/iot-app-kit/commit/0c66a8016e2aa827ad3093c3ef89d6437e014d18))
* **react-components:** clear ymin and ymax was getting emitted on every loop ([8609a48](https://github.com/awslabs/iot-app-kit/commit/8609a487a1b7ba9d4884750a6e6ee8819873a4b1))
* **react-components:** confining tootip to the chart area ([1bff986](https://github.com/awslabs/iot-app-kit/commit/1bff986999dc88a261caed22c3a77aab892219ad))
* **react-components:** performance fixes for chart component ([403f2bf](https://github.com/awslabs/iot-app-kit/commit/403f2bf6beea75e1e1668e33c60a6149ef1b5436))
* **react-components:** remove data points after a threshold ([cd6a189](https://github.com/awslabs/iot-app-kit/commit/cd6a18913d2c0f3fb8b066dffbdf48f38d6955e4))
* **react-components:** remove padded y axis code ([7e3d365](https://github.com/awslabs/iot-app-kit/commit/7e3d365d07dd4b074c6dda6d2934b7cb05fcde55))
* **react-components:** remove secondary selection state when using TCs or gestures ([3ba4e6a](https://github.com/awslabs/iot-app-kit/commit/3ba4e6a1cc0c2a7fd48eb130f3b72262fcd97ad5))
* **react-components:** updates for x-axis panning performance ([07a7624](https://github.com/awslabs/iot-app-kit/commit/07a7624d77962c38e7457abea1602082ebf2f5a3))
* relative month test ([5c6e262](https://github.com/awslabs/iot-app-kit/commit/5c6e262b16b8a739c4a4d9e823453094242c67d9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/core bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/core-util bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.12.0 to 9.13.0
  * devDependencies
    * @iot-app-kit/core bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/jest-config bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/source-iotsitewise bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/testing-util bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/ts-config bumped from 9.12.0 to 9.13.0
    * eslint-config-iot-app-kit bumped from 9.12.0 to 9.13.0

## [9.12.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.11.0...react-components-v9.12.0) (2023-12-18)


### Features

* chat legend enhancement [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([b1ca8ae](https://github.com/awslabs/iot-app-kit/commit/b1ca8aeda126f09f371e23133fa600d5b56c9b21))
* **dashboard:** add colors to trendcursors ([a890c7d](https://github.com/awslabs/iot-app-kit/commit/a890c7db39df1a836312ac4050c41e2f4fdd9f4a))
* first click on paginate timeline should move backward from current time duration ([5f9aa42](https://github.com/awslabs/iot-app-kit/commit/5f9aa42aef52d1bade596d0b8cfa1d58d51cce52))
* lint accessibility ([0db36ef](https://github.com/awslabs/iot-app-kit/commit/0db36ef6a07fe5e0709d17081dffa7d23669e2fe))


### Bug Fixes

* table resize button aria label ([1618d50](https://github.com/awslabs/iot-app-kit/commit/1618d50a713cb1be8b9a74899144ca92cd9ec5f1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/core bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/core-util bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.11.0 to 9.12.0
  * devDependencies
    * @iot-app-kit/core bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/jest-config bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/source-iotsitewise bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/testing-util bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/ts-config bumped from 9.11.0 to 9.12.0
    * eslint-config-iot-app-kit bumped from 9.11.0 to 9.12.0

## [9.11.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.10.0...react-components-v9.11.0) (2023-12-07)


### Bug Fixes

* use datastream id as legend table row key ([b4c11bc](https://github.com/awslabs/iot-app-kit/commit/b4c11bcd40400d4f7eae680d5ab521f00b638f64))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/core bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/core-util bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.10.0 to 9.11.0
  * devDependencies
    * @iot-app-kit/core bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/jest-config bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/source-iotsitewise bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/testing-util bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/ts-config bumped from 9.10.0 to 9.11.0
    * eslint-config-iot-app-kit bumped from 9.10.0 to 9.11.0

## [9.10.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.9.1...react-components-v9.10.0) (2023-12-07)


### Bug Fixes

* **react-components:** trendcursor hotkey indicates addition state ([c9d34e0](https://github.com/awslabs/iot-app-kit/commit/c9d34e0ef4ba891522336f05718d1808442949e3))
* updates for performance issues ([8863b9a](https://github.com/awslabs/iot-app-kit/commit/8863b9a80d7a8284aa4732ed25298d165a769ea9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/core bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/core-util bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.9.1 to 9.10.0
  * devDependencies
    * @iot-app-kit/core bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/jest-config bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/source-iotsitewise bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/testing-util bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/ts-config bumped from 9.9.1 to 9.10.0
    * eslint-config-iot-app-kit bumped from 9.9.1 to 9.10.0

## [9.9.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.9.0...react-components-v9.9.1) (2023-12-06)


### Bug Fixes

* update dependency to not include styles ([e09651e](https://github.com/awslabs/iot-app-kit/commit/e09651e5c065458a269d8d95d1c9c959c5f95ace))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/core bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/core-util bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/source-iottwinmaker bumped from 9.9.0 to 9.9.1
  * devDependencies
    * @iot-app-kit/core bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/jest-config bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/source-iotsitewise bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/testing-util bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/ts-config bumped from 9.9.0 to 9.9.1
    * eslint-config-iot-app-kit bumped from 9.9.0 to 9.9.1

## [9.9.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.8.0...react-components-v9.9.0) (2023-12-05)


### Bug Fixes

* accessible property filter labels ([30554a1](https://github.com/awslabs/iot-app-kit/commit/30554a1f59f2462b1a5334424866f67ee4507455))
* fixed property section tooltip gets cut off if property has longer name [#2293](https://github.com/awslabs/iot-app-kit/issues/2293) ([e496e4d](https://github.com/awslabs/iot-app-kit/commit/e496e4d52c566cab3e17e332ef3b587cd9fcc094))
* panning on chart widget moving [#2294](https://github.com/awslabs/iot-app-kit/issues/2294) ([9cefd9a](https://github.com/awslabs/iot-app-kit/commit/9cefd9a2107465ccde1468f1e0e2a271b0d30381))
* **react-components:** add echarts extension for handling custom-y-axis ([b481beb](https://github.com/awslabs/iot-app-kit/commit/b481beb1e5a9a014a688d264aa3cb3addc4f51c7))
* **react-components:** add fallback for property name to id ([a1024d4](https://github.com/awslabs/iot-app-kit/commit/a1024d459fd24d8c7056326706b41ff505eb41ec))
* **react-components:** mock date in viewport adapter date tests ([06200dd](https://github.com/awslabs/iot-app-kit/commit/06200dda24e5956c6db0a2b4bfe750cdf53c8592))
* remove line chart tweening animation ([d9e894b](https://github.com/awslabs/iot-app-kit/commit/d9e894b0f651ad24dce87d7f7c4dbe28f43f43e0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/core bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/core-util bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.8.0 to 9.9.0
  * devDependencies
    * @iot-app-kit/core bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/jest-config bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/source-iotsitewise bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/testing-util bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/ts-config bumped from 9.8.0 to 9.9.0
    * eslint-config-iot-app-kit bumped from 9.8.0 to 9.9.0

## [9.8.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.7.0...react-components-v9.8.0) (2023-11-25)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/core bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/core-util bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.7.0 to 9.8.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/source-iotsitewise bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/testing-util bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/ts-config bumped from 9.7.0 to 9.8.0
    * eslint-config-iot-app-kit bumped from 9.7.0 to 9.8.0

## [9.7.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.6.0...react-components-v9.7.0) (2023-11-21)


### Features

* charts legend resize drag-handle improvements [#2055](https://github.com/awslabs/iot-app-kit/issues/2055) ([9e9db52](https://github.com/awslabs/iot-app-kit/commit/9e9db524cf1b403c9a64c631751ff862349b7ad2))
* **dashboard:** add model based query support ([b95b60c](https://github.com/awslabs/iot-app-kit/commit/b95b60ccf074069268a8d71071067cfbd8265a20))
* **dashboard:** gated CSV download button ([645fb1c](https://github.com/awslabs/iot-app-kit/commit/645fb1cc3fdac5e27369a6ee538e0677ab4eb8b3))
* header design update ([700a913](https://github.com/awslabs/iot-app-kit/commit/700a91366ba57d7f6ca4b2058ee308a7317db9eb))
* **react-components:** adding significant digits to trendcursors ([ef4c987](https://github.com/awslabs/iot-app-kit/commit/ef4c987f5142a7be0ec22aae49a31397999b45e2))
* **react-components:** brush zoom ([bddb7e1](https://github.com/awslabs/iot-app-kit/commit/bddb7e1e7b18a2179678fd6bee6a50d0a978d26d))
* updated the chart legend ux [#1930](https://github.com/awslabs/iot-app-kit/issues/1930) ([68b8618](https://github.com/awslabs/iot-app-kit/commit/68b8618226c5f9ab0c5da64f7ad9210459809232))


### Bug Fixes

* bugfix for overlapping colors in color palette ([7b4c95b](https://github.com/awslabs/iot-app-kit/commit/7b4c95b45866548f85b10fee3167a35354d73cfb))
* chart gesture performance ([cdd52c6](https://github.com/awslabs/iot-app-kit/commit/cdd52c627e99f4e712475b90d2869b16a5684038))
* download button and zoom undo button ([a60a81b](https://github.com/awslabs/iot-app-kit/commit/a60a81b6f6e64b3113b14edcf6efe9fe82ef47f7))
* immediately change the line chart viewport when updating relative time range ([5ebb2f1](https://github.com/awslabs/iot-app-kit/commit/5ebb2f1597595bf66c63850835e2a64752e4ef9b))
* immediately change the line chart viewport when updating relative time range ([95b5b7d](https://github.com/awslabs/iot-app-kit/commit/95b5b7d80914a757613c3263f7bf0218acb355b4))
* **react-components:** adding handling of Yminmax for TC and fixing styling issues ([1581b9f](https://github.com/awslabs/iot-app-kit/commit/1581b9fb7cb77037fa830eaba07155aa253cfa33))
* **react-components:** echarts grab on canvas update cursor and tooltip ([bfef4e8](https://github.com/awslabs/iot-app-kit/commit/bfef4e878e9a47a9ed1f578767a04b03e6bc8a5e))
* **react-components:** pagination can move forward on first click from relative range ([fcb04f7](https://github.com/awslabs/iot-app-kit/commit/fcb04f73c3bf3af8a467169a3e9cbd6a6743d462))
* **react-components:** removing animation for series lines ([b245995](https://github.com/awslabs/iot-app-kit/commit/b245995766c4f2b83bca219e9d8e6f806912cd6c))
* ungate CSV download feature ([ec11c82](https://github.com/awslabs/iot-app-kit/commit/ec11c82c1b2932a5f7f28d9394f469cac6d68f97))
* updated the wcag compliance for dashboard resource explorer pane [#2173](https://github.com/awslabs/iot-app-kit/issues/2173) ([26bd618](https://github.com/awslabs/iot-app-kit/commit/26bd6181e4c507360247d6a7cddee7db0ba2c5bd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/core bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/core-util bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.6.0 to 9.7.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/source-iotsitewise bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/testing-util bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/ts-config bumped from 9.6.0 to 9.7.0
    * eslint-config-iot-app-kit bumped from 9.6.0 to 9.7.0

## [9.6.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.5.0...react-components-v9.6.0) (2023-11-16)


### Bug Fixes

* **video-player:** toggle playback mode and update time range ([a033cb0](https://github.com/awslabs/iot-app-kit/commit/a033cb01824ccff6a63eb4e62d019b691b085a0a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/core bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/core-util bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.5.0 to 9.6.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/source-iotsitewise bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/testing-util bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/ts-config bumped from 9.5.0 to 9.6.0
    * eslint-config-iot-app-kit bumped from 9.5.0 to 9.6.0

## [9.5.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.4.0...react-components-v9.5.0) (2023-11-08)


### Bug Fixes

* **react-components:** update viewportAdapter tests for month and minutes ([a269626](https://github.com/awslabs/iot-app-kit/commit/a269626bd3e78a8b5f515b8f3d590848e9f70725))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/core bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/core-util bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.4.0 to 9.5.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/source-iotsitewise bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/testing-util bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/ts-config bumped from 9.4.0 to 9.5.0
    * eslint-config-iot-app-kit bumped from 9.4.0 to 9.5.0

## [9.4.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.3.0...react-components-v9.4.0) (2023-10-26)


### Bug Fixes

* broken tooltip imports ([8a25332](https://github.com/awslabs/iot-app-kit/commit/8a25332379e647911504cd75ff913f6b911a43c4))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/core bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/core-util bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.3.0 to 9.4.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/source-iotsitewise bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/testing-util bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/ts-config bumped from 9.3.0 to 9.4.0
    * eslint-config-iot-app-kit bumped from 9.3.0 to 9.4.0

## [9.3.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.2.0...react-components-v9.3.0) (2023-10-26)


### Features

* charts legend resize drag handle improvements [#2055](https://github.com/awslabs/iot-app-kit/issues/2055) ([0c69b75](https://github.com/awslabs/iot-app-kit/commit/0c69b755e8b1200238dcaac90a44ad07ab222b23))
* decimal round of in resource table ([a5da972](https://github.com/awslabs/iot-app-kit/commit/a5da9726649ca81a578efd365ba05d0dbe302b55))
* **react-components:** refactoring echarts ([83e505f](https://github.com/awslabs/iot-app-kit/commit/83e505ffaa9d31fe476be4d7f8029b5ae7c5a3ea))


### Bug Fixes

* **react-components:** fixing the prod issue of dashboard throwing exception ([7ecd252](https://github.com/awslabs/iot-app-kit/commit/7ecd2526ed5c07f793ec5e97b1d3eb5595e67a7d))
* **react-components:** hitbox spans entire pagination button ([6a5b2f8](https://github.com/awslabs/iot-app-kit/commit/6a5b2f8eaf237edc4aaae414765f5f186ce09c6a))
* **react-components:** pagination over time + tooltip ([ff052c9](https://github.com/awslabs/iot-app-kit/commit/ff052c94fa9f57ac8138d025301a384ab217b258))
* **react-components:** toggle legend hides container ([8d0ae53](https://github.com/awslabs/iot-app-kit/commit/8d0ae53981698bc8121cb0e40831b9d61e693075))
* **react-component:** updating TC to have a drag area instead of just drag on the line ([05068bd](https://github.com/awslabs/iot-app-kit/commit/05068bddfd3a7ff0876550a11263496765b51080))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/core bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/core-util bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.2.0 to 9.3.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/source-iotsitewise bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/testing-util bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/ts-config bumped from 9.2.0 to 9.3.0
    * eslint-config-iot-app-kit bumped from 9.2.0 to 9.3.0

## [9.2.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.1.0...react-components-v9.2.0) (2023-10-17)


### Bug Fixes

* **react-components:** echarts grab on canvas update cursor and tooltip ([a29da3a](https://github.com/awslabs/iot-app-kit/commit/a29da3a08a769137610bc37efde5605bf6b62dc2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/core bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/core-util bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.1.0 to 9.2.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/source-iotsitewise bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/testing-util bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/ts-config bumped from 9.1.0 to 9.2.0
    * eslint-config-iot-app-kit bumped from 9.1.0 to 9.2.0

## [9.1.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v9.0.0...react-components-v9.1.0) (2023-10-13)


### Features

* **composer:** utils to handle model shader component in entity ([95a4be6](https://github.com/awslabs/iot-app-kit/commit/95a4be668b51d413589b16b7edde67fdd40375d1))


### Bug Fixes

* **dashboard:** improve widget drag and resize ([fcdc586](https://github.com/awslabs/iot-app-kit/commit/fcdc5862fc558f136d510eaa85e241daa61d9988))
* **echarts:** improved x+y axis min and max ([38741e2](https://github.com/awslabs/iot-app-kit/commit/38741e245b450c7e547b10305349f9652ae1872f))
* **react-components:** fixing the xaxis and viewport dependency ([139bcc1](https://github.com/awslabs/iot-app-kit/commit/139bcc15aa219c1906544086ab6bf3d24e4035da))
* style updates and bugfixes for multi y axis ([e11fd3e](https://github.com/awslabs/iot-app-kit/commit/e11fd3eb6629d75b3b2abdb2ad0466d02e66b8ef))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/core bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/core-util bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.0.0 to 9.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/source-iotsitewise bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/testing-util bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/ts-config bumped from 9.0.0 to 9.1.0
    * eslint-config-iot-app-kit bumped from 9.0.0 to 9.1.0

## [9.0.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v8.1.1...react-components-v9.0.0) (2023-10-10)


### Features

* updated the chart legend ux(spacing, legend border color, width, tooltip) ([390cbe3](https://github.com/awslabs/iot-app-kit/commit/390cbe3414286bd7cfb1f041a2d21264552e7bd3))


### Bug Fixes

* line chart progresses in time ([15876a8](https://github.com/awslabs/iot-app-kit/commit/15876a86e4d3790e41f917758618b3f11cc948c7))


### Reverts

* updated the chart legend ux(spacing, legend border color, width, tooltip) ([6bbe391](https://github.com/awslabs/iot-app-kit/commit/6bbe39103f286ed6f09bd1f4fdd3353dba833e5a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/core bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/core-util bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 8.1.1 to 9.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/source-iotsitewise bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/testing-util bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/ts-config bumped from 8.1.1 to 9.0.0
    * eslint-config-iot-app-kit bumped from 8.1.1 to 9.0.0

## [8.1.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v8.1.0...react-components-v8.1.1) (2023-10-05)


### Bug Fixes

* add eslint rule for hooks ([de7cc0d](https://github.com/awslabs/iot-app-kit/commit/de7cc0d94ffdb79d3cb2ce622dd322e6d8497d61))
* **dashboard:** chart respects absolute min and max between data and thresholds ([db16712](https://github.com/awslabs/iot-app-kit/commit/db1671225e300a18765d55a8afd1534640d264de))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/core bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/core-util bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/source-iottwinmaker bumped from 8.1.0 to 8.1.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/source-iotsitewise bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/testing-util bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/ts-config bumped from 8.1.0 to 8.1.1
    * eslint-config-iot-app-kit bumped from 8.1.0 to 8.1.1

## [8.1.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v8.0.2...react-components-v8.1.0) (2023-10-04)


### Bug Fixes

* **video player:** correcting the VideoPlayer export ([18213d7](https://github.com/awslabs/iot-app-kit/commit/18213d7b254355776900c0e6c735ce6a039ac3f5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/core bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/core-util bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 8.0.2 to 8.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/source-iotsitewise bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/testing-util bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/ts-config bumped from 8.0.2 to 8.1.0
    * eslint-config-iot-app-kit bumped from 8.0.2 to 8.1.0

## [8.0.2](https://github.com/awslabs/iot-app-kit/compare/react-components-v8.0.1...react-components-v8.0.2) (2023-09-30)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/core bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/core-util bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/source-iottwinmaker bumped from 8.0.1 to 8.0.2
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/source-iotsitewise bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/testing-util bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/ts-config bumped from 8.0.1 to 8.0.2
    * eslint-config-iot-app-kit bumped from 8.0.1 to 8.0.2

## [8.0.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v8.0.0...react-components-v8.0.1) (2023-09-30)


### Bug Fixes

* toggle working linechar ([9ea6117](https://github.com/awslabs/iot-app-kit/commit/9ea61177710b9ece1be169a0c50e1c19fdefb5e6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/core bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/core-util bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/source-iottwinmaker bumped from 8.0.0 to 8.0.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/source-iotsitewise bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/testing-util bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/ts-config bumped from 8.0.0 to 8.0.1
    * eslint-config-iot-app-kit bumped from 8.0.0 to 8.0.1

## [8.0.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v7.5.0...react-components-v8.0.0) (2023-09-30)


### Features

* add filtering ability ([51933bc](https://github.com/awslabs/iot-app-kit/commit/51933bc6cc1a76071ae1287ee7f79072c8d4dac7))
* preferences for pagination in table widget [#1890](https://github.com/awslabs/iot-app-kit/issues/1890) ([8072232](https://github.com/awslabs/iot-app-kit/commit/8072232240a17274556d208fc22d32a811866517))


### Bug Fixes

* **dashboard:** remove viewport from the dashboard state to use viewport hook ([a9011a8](https://github.com/awslabs/iot-app-kit/commit/a9011a8a22e3bc41076fa6fb64065c016282d012))
* groupable echarts ([d704292](https://github.com/awslabs/iot-app-kit/commit/d704292964e6434450572154c60863fbdb027dc2))
* update unit test ([2276584](https://github.com/awslabs/iot-app-kit/commit/2276584325c75b8aa823d24588fb589b18876699))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/core bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/core-util bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.5.0 to 8.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/source-iotsitewise bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/testing-util bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/ts-config bumped from 7.5.0 to 8.0.0
    * eslint-config-iot-app-kit bumped from 7.5.0 to 8.0.0

## [7.5.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v7.4.0...react-components-v7.5.0) (2023-09-26)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/core bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/core-util bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.4.0 to 7.5.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/source-iotsitewise bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/testing-util bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/ts-config bumped from 7.4.0 to 7.5.0
    * eslint-config-iot-app-kit bumped from 7.4.0 to 7.5.0

## [7.4.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v7.3.1...react-components-v7.4.0) (2023-09-25)


### Features

* add fixed width and height to the table ([7005009](https://github.com/awslabs/iot-app-kit/commit/7005009b1e325a8f333b281113ce1cf4745b0b19))
* chart fit and finish - match cloudscape colors for axis and labels [#1929](https://github.com/awslabs/iot-app-kit/issues/1929) ([6fe3424](https://github.com/awslabs/iot-app-kit/commit/6fe3424ec90052d2e63a06a34b874958b9c7bf0c))
* **dashboard:** new line-scatter-chart ([53768b9](https://github.com/awslabs/iot-app-kit/commit/53768b911a13066b9527c88f0e95a620f0025f7a))
* **echarts:** allow scroll left and right ([5d2341e](https://github.com/awslabs/iot-app-kit/commit/5d2341e71f531556ac8147e1a0742233992ed82d))
* **react-components:** adding TrendCursor Sync to dashboard ([d046184](https://github.com/awslabs/iot-app-kit/commit/d046184b836e9cb3670b210eb24c4fd91167b52a))
* **react-components:** sync echarts viewport ([e04e040](https://github.com/awslabs/iot-app-kit/commit/e04e04079630361047e82d8564678cd4e5857cdd))
* table widget pagination and sortingdisabled ([b727eae](https://github.com/awslabs/iot-app-kit/commit/b727eae8364f19f2e997fa0c9275e1f0a947f854))


### Bug Fixes

* **CSS-Loader:** updated sass-loader & fixed style ([aee4abc](https://github.com/awslabs/iot-app-kit/commit/aee4abcd22617cd1b28641711a4be2d1bab4e252))
* **react-components:** adding debounce to the echarts zoom handler ([b983385](https://github.com/awslabs/iot-app-kit/commit/b98338508da223bab1a99c28641276ff02c537b5))
* **react-components:** echarts resize drag fix ([19ccc7e](https://github.com/awslabs/iot-app-kit/commit/19ccc7ee4569aea891b43883a8ba1dedf3ac4fc9))
* **react-components:** fix TC behaviour when there is a change in query ([50edcc1](https://github.com/awslabs/iot-app-kit/commit/50edcc1b2131c03c9e30621407a3d3d201825a90))
* **react-components:** fixing TCs on data zoom ([379525c](https://github.com/awslabs/iot-app-kit/commit/379525cd1246061398ff8a113963b968466ae11a))
* **react-components:** fixing the duplicate yAxis values ([60073ef](https://github.com/awslabs/iot-app-kit/commit/60073ef7ea4e1167218c8cdecd021bc677d5cc66))
* **react-components:** fixing the viewport and some styling elements ([7d3526e](https://github.com/awslabs/iot-app-kit/commit/7d3526e34c86b55632a4d5aa0c7029fd1499a48b))
* **react-components:** need stop propagation in start and end of resize event ([30e9901](https://github.com/awslabs/iot-app-kit/commit/30e99010bc57e48040ddcac8c41546e745a5a3f9))
* **react-components:** updating echarts ux ([ddfc9c8](https://github.com/awslabs/iot-app-kit/commit/ddfc9c8cc15f32a8c307653daf5d2159918e58b2))
* **react-components:** updating echarts with the fixes founf during bug bash ([9f32c21](https://github.com/awslabs/iot-app-kit/commit/9f32c21ae53d99ddac718caa520d9e852a25f499))
* x-axis toggle will toggle both x and y axis [#1925](https://github.com/awslabs/iot-app-kit/issues/1925) ([58b0dbb](https://github.com/awslabs/iot-app-kit/commit/58b0dbbc72a9dbfd13648a454ea36ac570efd0eb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/core bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/core-util bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.3.1 to 7.4.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/source-iotsitewise bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/testing-util bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/ts-config bumped from 7.3.1 to 7.4.0
    * eslint-config-iot-app-kit bumped from 7.3.1 to 7.4.0

## [7.3.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v7.3.0...react-components-v7.3.1) (2023-08-24)


### Bug Fixes

* **react-component:** updating the calculateTimeStamp method to use ([e0e1f42](https://github.com/awslabs/iot-app-kit/commit/e0e1f428f012b157938eced89efcd30101f2d7f5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/core bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/core-util bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/source-iottwinmaker bumped from 7.3.0 to 7.3.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/source-iotsitewise bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/testing-util bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/ts-config bumped from 7.3.0 to 7.3.1
    * eslint-config-iot-app-kit bumped from 7.3.0 to 7.3.1

## [7.3.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v7.2.1...react-components-v7.3.0) (2023-08-23)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/core bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/core-util bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.2.1 to 7.3.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/source-iotsitewise bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/testing-util bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/ts-config bumped from 7.2.1 to 7.3.0
    * eslint-config-iot-app-kit bumped from 7.2.1 to 7.3.0

## [7.2.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v7.2.0...react-components-v7.2.1) (2023-08-18)


### Bug Fixes

* **react-components:** the dependencies were added to dashboard instead of react-components ([8b2f12f](https://github.com/awslabs/iot-app-kit/commit/8b2f12fb67a1705ffdb722e02cf8c1ff1ae2ed97))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/core bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/core-util bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/source-iottwinmaker bumped from 7.2.0 to 7.2.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/source-iotsitewise bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/testing-util bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/ts-config bumped from 7.2.0 to 7.2.1
    * eslint-config-iot-app-kit bumped from 7.2.0 to 7.2.1

## [7.2.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v7.1.0...react-components-v7.2.0) (2023-08-17)


### Features

* **dashboard:** add advanced search using knowledge graph to query editor ([8722b33](https://github.com/awslabs/iot-app-kit/commit/8722b338a919d6fb51b21a861cf7e96e44246dbd))
* **echarts:** threshold support ([2d7ccfe](https://github.com/awslabs/iot-app-kit/commit/2d7ccfe6695070126b60f352733ef1512c966984))
* **react-component:** adding config service to toggle echarts ([96d0351](https://github.com/awslabs/iot-app-kit/commit/96d0351b7e20a728154d3ebfed0efd5205b841bd))
* **react-component:** adding context menu per chart ([a368eb9](https://github.com/awslabs/iot-app-kit/commit/a368eb99b230f2a5a8bb39d7c0bc52e42ae9f5ad))
* **react-component:** adding sorting ability for the chart legends ([ca330eb](https://github.com/awslabs/iot-app-kit/commit/ca330eb711923a32531871b714c2252fe31850ae))
* **react-component:** adding trendcursor sync component ([52d6033](https://github.com/awslabs/iot-app-kit/commit/52d6033337937c5b7b1774d5a5b04907e126df60))
* **react-components:** add a sitewise connected chart story ([b66de3b](https://github.com/awslabs/iot-app-kit/commit/b66de3b4d87ac2a3157c6cae176a216dff1ceb92))
* **react-components:** add multiple y axis legend ([79023c0](https://github.com/awslabs/iot-app-kit/commit/79023c025e09e3ad485c84ad1d54b0ed2e0e0589))
* **react-components:** supporting live mode in echarts ([cdf1caa](https://github.com/awslabs/iot-app-kit/commit/cdf1caab9399cc770c91c3fd40ffde23e7795ab5))


### Bug Fixes

* **3DKG:** fix height flexibility for KG component ([f9943ce](https://github.com/awslabs/iot-app-kit/commit/f9943cee4741da7b5fc2f11f67a429424c2d88b7))
* **react-component:** removing the dependency of the yMin and Ymax and ([9360fe4](https://github.com/awslabs/iot-app-kit/commit/9360fe42e081263ccd1896f47fb5d8a7ba6b1d0f))
* **react-component:** removing transition animation for trend cursors ([5e84d15](https://github.com/awslabs/iot-app-kit/commit/5e84d15fcecb7ee0e1f242fd0f1ce47960818696))
* **react-components:** add memoization for chart reactivity and refactor echarts hook ([128f5b0](https://github.com/awslabs/iot-app-kit/commit/128f5b0c2f8a1c164241ef216d5d489d9d69164c))
* **react-component:** updating the sytling and adding some visual ques for the trend cursors ([dc50a2c](https://github.com/awslabs/iot-app-kit/commit/dc50a2c8c04167f1137deec350d735847d6d233a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/core bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/core-util bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.1.0 to 7.2.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/source-iotsitewise bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/testing-util bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/ts-config bumped from 7.1.0 to 7.2.0
    * eslint-config-iot-app-kit bumped from 7.1.0 to 7.2.0

## [7.1.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v7.0.0...react-components-v7.1.0) (2023-07-28)


### Miscellaneous Chores

* **react-components:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/core bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/core-util bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.0.0 to 7.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/source-iotsitewise bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/testing-util bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/ts-config bumped from 7.0.0 to 7.1.0
    * eslint-config-iot-app-kit bumped from 7.0.0 to 7.1.0

## [7.0.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v6.3.1...react-components-v7.0.0) (2023-07-25)


### Features

* **react-component:** adding drag and delete to TC ([7c6a017](https://github.com/awslabs/iot-app-kit/commit/7c6a017eaad9fe4c2f6881adb7e807f4b154f93c))
* **react-component:** adding resizability for Charts components ([3ae7f56](https://github.com/awslabs/iot-app-kit/commit/3ae7f568a30947782c2d29ecf72eacf3df31d18b))
* **react-component:** adding TC markers ([4105adb](https://github.com/awslabs/iot-app-kit/commit/4105adb218fbf05b6145348d660fc24b2cec0b66))
* **react-component:** adding the inital implementation of the trend cursors ([ce37fe2](https://github.com/awslabs/iot-app-kit/commit/ce37fe21a36f13fe1438c0653eb47992d774b15e))
* **react-components:** add menu component ([cdd196e](https://github.com/awslabs/iot-app-kit/commit/cdd196ebcf42b5ddbdc34005fe4b54ae24767609))
* **react-components:** add time selection component to react components ([e99f301](https://github.com/awslabs/iot-app-kit/commit/e99f3011a063c861cc22264687a9f3d5d9d56841))
* **react-components:** adding resizing to trend cursors ([400189a](https://github.com/awslabs/iot-app-kit/commit/400189a221f16123ce193222eacd2583ea25360a))
* **react-components:** feature flag context ([d313682](https://github.com/awslabs/iot-app-kit/commit/d31368282b9f5882c6f6cef0a66c2c085ee56aff))
* **Vite:** migrate example app to vite ([d2e65be](https://github.com/awslabs/iot-app-kit/commit/d2e65bed32dc3c470b52d418dacb61610c16ab5a))


### Bug Fixes

* **react-components:** ensure provider is unsubscribed correctly ([2db74d2](https://github.com/awslabs/iot-app-kit/commit/2db74d2d51f1104478540528cb4be982c4afc351))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/core bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/core-util bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 6.3.1 to 7.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/source-iotsitewise bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/testing-util bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/ts-config bumped from 6.3.1 to 7.0.0
    * eslint-config-iot-app-kit bumped from 6.3.1 to 7.0.0

## [6.3.1](https://github.com/awslabs/iot-app-kit/compare/root-v6.3.0...root-v6.3.1) (2023-06-28)

## Fix
* **Emergency revert**

## [6.3.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v6.2.0...react-components-v6.3.0) (2023-06-23)


### Features

* **react-components:** add significant digits configuration for charts ([41cba0e](https://github.com/awslabs/iot-app-kit/commit/41cba0e655ac944889d6f15db56282a30e53997e))
* **react-components:** base echarts ([bc6ee62](https://github.com/awslabs/iot-app-kit/commit/bc6ee6250417a7d71f6aaf0692f1a02d4059b8f6))


### Bug Fixes

* **dashboard:** fixed the flash of graphs on change in query(s) ([45edc69](https://github.com/awslabs/iot-app-kit/commit/45edc69ae67796ce9566c491a8f39921029ad0a0))
* **KG Component:** ux review changes ([9133094](https://github.com/awslabs/iot-app-kit/commit/9133094b7352676277e951dda2c92cb0db566488))
* **knowledge-graph:** fix node to node selection and layout adjustment ([98df518](https://github.com/awslabs/iot-app-kit/commit/98df518f25cc3a15254917520a1750d013fc2984))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/core bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/core-util bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/source-iottwinmaker bumped from 6.2.0 to 6.3.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/source-iotsitewise bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/testing-util bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/ts-config bumped from 6.2.0 to 6.3.0
    * eslint-config-iot-app-kit bumped from 6.2.0 to 6.3.0

## [6.2.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v6.1.0...react-components-v6.2.0) (2023-06-07)


### Features

* **Knowledge Graph:** adding clear and render graph results events ([5479a51](https://github.com/awslabs/iot-app-kit/commit/5479a51b85574d4c751c8e0aba40fa54e76d7504))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/core bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/core-util bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/source-iottwinmaker bumped from 6.1.0 to 6.2.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/source-iotsitewise bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/testing-util bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/ts-config bumped from 6.1.0 to 6.2.0
    * eslint-config-iot-app-kit bumped from 6.1.0 to 6.2.0

## [6.1.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v6.0.0...react-components-v6.1.0) (2023-06-06)


### Features

* **KG Component:** event modeling ([b918237](https://github.com/awslabs/iot-app-kit/commit/b918237e82738cf1dbc61f95c303881b65166abb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/core bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/core-util bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 6.0.0 to 6.1.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/source-iotsitewise bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/testing-util bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/ts-config bumped from 6.0.0 to 6.1.0
    * eslint-config-iot-app-kit bumped from 6.0.0 to 6.1.0

## [6.0.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.9.0...react-components-v6.0.0) (2023-06-05)


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
    * @iot-app-kit/source-iottwinmaker bumped from 5.9.0 to 6.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/source-iotsitewise bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/testing-util bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/ts-config bumped from 5.9.0 to 6.0.0
    * eslint-config-iot-app-kit bumped from 5.9.0 to 6.0.0

## [5.9.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.8.1...react-components-v5.9.0) (2023-06-01)


### Features

* **Knowledge Graph:** adding KG parent component, search and explore logic ([95cc307](https://github.com/awslabs/iot-app-kit/commit/95cc307d6fcf2592d376830283069ddce463d0cf))


### Bug Fixes

* graph css not distributed correctly ([d7b2717](https://github.com/awslabs/iot-app-kit/commit/d7b2717647507533bfeda81774c44a3c5727e15c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/core bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/core-util bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/source-iottwinmaker bumped from 5.8.1 to 5.9.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/source-iotsitewise bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/testing-util bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/ts-config bumped from 5.8.1 to 5.9.0
    * eslint-config-iot-app-kit bumped from 5.8.1 to 5.9.0

## [5.8.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.8.0...react-components-v5.8.1) (2023-05-19)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/core bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/core-util bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/source-iottwinmaker bumped from 5.8.0 to 5.8.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/source-iotsitewise bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/testing-util bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/ts-config bumped from 5.8.0 to 5.8.1
    * eslint-config-iot-app-kit bumped from 5.8.0 to 5.8.1

## [5.8.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.7.0...react-components-v5.8.0) (2023-05-18)


### Features

* **GraphVisualization:** graph data visualizer ([13e004a](https://github.com/awslabs/iot-app-kit/commit/13e004a3c9256cc20af1e49dd52737b17ae7078b))
* **SkinVisualization:** enable default style for visualization and allow overrides ([6240195](https://github.com/awslabs/iot-app-kit/commit/624019522a940bc9cf5c69253156db871576302d))


### Bug Fixes

* **scene composer:** refactoring video player to work with react 18 updates ([c177802](https://github.com/awslabs/iot-app-kit/commit/c1778025babf75d89d74c1b355f54e46f2e740be))
* **video-player:** video seek percent calculation ([828e4f1](https://github.com/awslabs/iot-app-kit/commit/828e4f18dfe5f25ddd6f045f921f24ffba35535c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/core bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/core-util bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/source-iottwinmaker bumped from 5.7.0 to 5.8.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/source-iotsitewise bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/testing-util bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/ts-config bumped from 5.7.0 to 5.8.0
    * eslint-config-iot-app-kit bumped from 5.7.0 to 5.8.0

## [5.7.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.6.0...react-components-v5.7.0) (2023-05-02)


### Bug Fixes

* no flash of error, remove ghosting ([5a2723b](https://github.com/awslabs/iot-app-kit/commit/5a2723ba9cb78d3b4fbd6ed64e9c1558d6a01c98))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/core bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/core-util bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/source-iottwinmaker bumped from 5.6.0 to 5.7.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/source-iotsitewise bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/testing-util bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/ts-config bumped from 5.6.0 to 5.7.0
    * eslint-config-iot-app-kit bumped from 5.6.0 to 5.7.0

## [5.6.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.5.2...react-components-v5.6.0) (2023-04-20)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/core bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/core-util bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/source-iottwinmaker bumped from 5.5.2 to 5.6.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/source-iotsitewise bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/testing-util bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/ts-config bumped from 5.5.2 to 5.6.0
    * eslint-config-iot-app-kit bumped from 5.5.2 to 5.6.0

## [5.5.2](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.5.1...react-components-v5.5.2) (2023-04-19)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/core bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/core-util bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/source-iottwinmaker bumped from 5.5.1 to 5.5.2
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/source-iotsitewise bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/testing-util bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/ts-config bumped from 5.5.1 to 5.5.2
    * eslint-config-iot-app-kit bumped from 5.5.1 to 5.5.2

## [5.5.1](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.5.0...react-components-v5.5.1) (2023-04-14)


### Bug Fixes

* **react-components:** useTimeSeriesData hook works when number of queries changes ([feb6076](https://github.com/awslabs/iot-app-kit/commit/feb607642299fb90fb9f70f8cd4b76007bd5791e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/core bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/core-util bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/source-iottwinmaker bumped from 5.5.0 to 5.5.1
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/source-iotsitewise bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/testing-util bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/ts-config bumped from 5.5.0 to 5.5.1
    * eslint-config-iot-app-kit bumped from 5.5.0 to 5.5.1

## [5.5.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.4.0...react-components-v5.5.0) (2023-04-13)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/core bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/core-util bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/source-iottwinmaker bumped from 5.4.0 to 5.5.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/source-iotsitewise bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/testing-util bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/ts-config bumped from 5.4.0 to 5.5.0
    * eslint-config-iot-app-kit bumped from 5.4.0 to 5.5.0

## [5.4.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.3.0...react-components-v5.4.0) (2023-04-12)


### Bug Fixes

* **dashboard:** fix tooltip positioning ([cc82474](https://github.com/awslabs/iot-app-kit/commit/cc824747e85a56c35c590020dd185d576f45ee6f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/core bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/core-util bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/source-iottwinmaker bumped from 5.3.0 to 5.4.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/source-iotsitewise bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/testing-util bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/ts-config bumped from 5.3.0 to 5.4.0
    * eslint-config-iot-app-kit bumped from 5.3.0 to 5.4.0

## [5.3.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v5.2.0...react-components-v5.3.0) (2023-04-12)


### Miscellaneous Chores

* **react-components:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/components bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/core bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/core-util bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/source-iottwinmaker bumped from 5.2.0 to 5.3.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/source-iotsitewise bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/testing-util bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/ts-config bumped from 5.2.0 to 5.3.0
    * eslint-config-iot-app-kit bumped from 5.2.0 to 5.3.0

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
