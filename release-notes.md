:robot: I have created a release *beep* *boop*
---


<details><summary>core: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/core-v11.0.0...core-v12.0.0) (2024-11-18)


### Features

* add a widget level loading indicator for x-y plot ([9be5617](https://github.com/awslabs/iot-app-kit/commit/9be5617aabe7a1edf88876406aeb1e83f174a288))
* add dataquality attribute to data-point ([5fb23de](https://github.com/awslabs/iot-app-kit/commit/5fb23de5473fa4f9c2377330b598711209514620))
* add threshold settings to KPI ([2fa0429](https://github.com/awslabs/iot-app-kit/commit/2fa0429b6262092b4b3c86c21b8808b90e2d49fe))
* async fetchTimeSeriesData ([2b776cc](https://github.com/awslabs/iot-app-kit/commit/2b776ccf73a538abfbcf4a0ba175dca7c2c4aa0c))
* **composer:** support showing flash message ([da7281a](https://github.com/awslabs/iot-app-kit/commit/da7281a84e47325c56071850f6ea49a6eed73233))
* display assetname conditionally in legend [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([c4c443f](https://github.com/awslabs/iot-app-kit/commit/c4c443fab77d6e337d32fbecebb308c7f339fab5))
* fetchTimeSeriesData ([1c65191](https://github.com/awslabs/iot-app-kit/commit/1c65191654c726b66cf1e0bcc2df83d620f6d4a5))
* introduce edgeMode in dashboard components ([c168fb4](https://github.com/awslabs/iot-app-kit/commit/c168fb45b68252e25385c38bc20752ce1ffcd4e8))
* **react-components:** add l4e queries ([328da8e](https://github.com/awslabs/iot-app-kit/commit/328da8ed9341c68c8c0a3a6b672170f1fa8eeb37))
* **react-components:** implement request functions and hooks to build clients ([2ca7e6c](https://github.com/awslabs/iot-app-kit/commit/2ca7e6caf771bd929b993d79f91f6e7d3ce21350))
* user selected dashboard refresh-rate ([1c1256d](https://github.com/awslabs/iot-app-kit/commit/1c1256da83c938037a47e930c127c2bf3bc14e90))


### Bug Fixes

* add request settings to fetchTimeSeriesData ([d7cbd9d](https://github.com/awslabs/iot-app-kit/commit/d7cbd9d8bb5a5f56804a7ebce2c87e944bcb6f2b))
* aws clients marked as peer dependencies ([0272167](https://github.com/awslabs/iot-app-kit/commit/027216707ec5fdd77390ef1de132ef744f4f17b8))
* **core:** increase cache and min request interval to prevent making many requests for near now data ([403fec9](https://github.com/awslabs/iot-app-kit/commit/403fec94c16a68adbae04134dc4ee69bedb4f4d6))
* corrected the spelling in refresh rate error in documentation [#2777](https://github.com/awslabs/iot-app-kit/issues/2777) ([03e58e7](https://github.com/awslabs/iot-app-kit/commit/03e58e7403fbc501e00dd1b216d710a5a4dafcdb))
* fix data-zoom behavior for base chart ([0c66a80](https://github.com/awslabs/iot-app-kit/commit/0c66a8016e2aa827ad3093c3ef89d6437e014d18))
* pass in refresh rate through the query instead of props ([b6df585](https://github.com/awslabs/iot-app-kit/commit/b6df5856b4407c74d4746d12a1781d11976f9948))
* refresh rate defined in dashboard and on query ([43cc5e4](https://github.com/awslabs/iot-app-kit/commit/43cc5e437543aed60663620655044cba9437a226))
* remove duplicate constants and types ([45c155b](https://github.com/awslabs/iot-app-kit/commit/45c155b414a29c767e276060f1c60ce8401ea456))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @iot-app-kit/jest-config bumped from * to 12.0.0
    * @iot-app-kit/ts-config bumped from * to 12.0.0
    * eslint-config-iot-app-kit bumped from * to 12.0.0
</details>

<details><summary>core-util: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/core-util-v11.0.0...core-util-v12.0.0) (2024-11-18)


### Features

* **dashboard:** default viewport setting ([0c3f3ef](https://github.com/awslabs/iot-app-kit/commit/0c3f3efa3a48be537d0eed0e6a1a02ecaa7c1f03))


### Bug Fixes

* add trailing zeros to decimal point rounding, fix rounding function ([9c13177](https://github.com/awslabs/iot-app-kit/commit/9c131779c5a3f5b2ce7c6d1239e54ed82bfbf572))
* aws clients marked as peer dependencies ([d944df4](https://github.com/awslabs/iot-app-kit/commit/d944df4113822671b84737b98dee261cab692421))
* aws clients marked as peer dependencies ([0272167](https://github.com/awslabs/iot-app-kit/commit/027216707ec5fdd77390ef1de132ef744f4f17b8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 12.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from * to 12.0.0
    * @iot-app-kit/ts-config bumped from * to 12.0.0
</details>

<details><summary>dashboard: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/dashboard-v11.0.0...dashboard-v12.0.0) (2024-11-18)


### Features

* add alarm data source query ([32fe5c7](https://github.com/awslabs/iot-app-kit/commit/32fe5c706fba1c483b98d7baa1d1045eb6cf2ac3))
* add anomaly query ([3c11512](https://github.com/awslabs/iot-app-kit/commit/3c115121db6fc8248bcd6b36989f6ebea3212ba7))
* add arrow to asset name [#2551](https://github.com/awslabs/iot-app-kit/issues/2551) ([bd12bea](https://github.com/awslabs/iot-app-kit/commit/bd12bea402358d9a641740cb17c8bc9a04e215cc))
* add CSV download button ([d89b1f8](https://github.com/awslabs/iot-app-kit/commit/d89b1f880491615c023ea84d53b0c843d52315b4))
* add data quality to kpi and status ([7248004](https://github.com/awslabs/iot-app-kit/commit/724800417bc8c74f518d6a39044c815848ef431f))
* add e2e gauge tests to dashboard tests ([188f9d2](https://github.com/awslabs/iot-app-kit/commit/188f9d2cf84d96e5a2bc77803bf8160174fba2b7))
* add threshold settings to KPI ([2fa0429](https://github.com/awslabs/iot-app-kit/commit/2fa0429b6262092b4b3c86c21b8808b90e2d49fe))
* added a label time range for viewport picker in dashboard header [#2559](https://github.com/awslabs/iot-app-kit/issues/2559) ([743cb80](https://github.com/awslabs/iot-app-kit/commit/743cb80ec36d116d6ef25e97ec54f2238ddb2ea1))
* added accessible labels to different toolbar container [#2510](https://github.com/awslabs/iot-app-kit/issues/2510) ([ce5af6f](https://github.com/awslabs/iot-app-kit/commit/ce5af6fbc6e6b887f3fade9395bcbf54da386a88))
* added validation for decimal places input and moved in section format data [#2599](https://github.com/awslabs/iot-app-kit/issues/2599) ([1cd97c1](https://github.com/awslabs/iot-app-kit/commit/1cd97c14f569df5867e8865151e76a457c8af52d))
* added visible labels operator and value for threshold controls for accessibility [#2512](https://github.com/awslabs/iot-app-kit/issues/2512) [#2513](https://github.com/awslabs/iot-app-kit/issues/2513) ([06b5ee5](https://github.com/awslabs/iot-app-kit/commit/06b5ee58a9a823bacb29c60c546b803b89f1cb97))
* adding timezone support to dashboard/widgets ([6435b90](https://github.com/awslabs/iot-app-kit/commit/6435b90d93246e319b939b7c316c6ffbea12ef8d))
* async fetchTimeSeriesData ([2b776cc](https://github.com/awslabs/iot-app-kit/commit/2b776ccf73a538abfbcf4a0ba175dca7c2c4aa0c))
* async listAssetPropertiesDescription ([6632db5](https://github.com/awslabs/iot-app-kit/commit/6632db5837e75d8786cb2c2150986d57f4e6ad39))
* automatically selecting previously selected workspace or first workspace from options [#2384](https://github.com/awslabs/iot-app-kit/issues/2384) ([c1424a2](https://github.com/awslabs/iot-app-kit/commit/c1424a2b2ac7d7034c748cb221e565a8967c3da8))
* changed outline for config panel text style buttons on focus initiated by tab [#2547](https://github.com/awslabs/iot-app-kit/issues/2547) ([e94fee7](https://github.com/awslabs/iot-app-kit/commit/e94fee72e095161258d01cbe9777aeca833f5c90))
* chat legend enhancement [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([b1ca8ae](https://github.com/awslabs/iot-app-kit/commit/b1ca8aeda126f09f371e23133fa600d5b56c9b21))
* conditionally display latest value in legend table  [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([d3feb29](https://github.com/awslabs/iot-app-kit/commit/d3feb2920f3c63b0b2ce9580fc07a86475fc1ff1))
* customize gauge in dashboard config ([8af089e](https://github.com/awslabs/iot-app-kit/commit/8af089e94a2c11cab1c9473d384ed241da7f6461))
* **dashboard:** add logging for custom y-axis ([582fddf](https://github.com/awslabs/iot-app-kit/commit/582fddfa3ccca07e2ffd2b51047d989685a5940c))
* **dashboard:** add logging for query editor ([d115606](https://github.com/awslabs/iot-app-kit/commit/d115606d2e974e1fcdd9111d6c470b97589280cc))
* **dashboard:** add metrics for query editor usage ([e8ac4f9](https://github.com/awslabs/iot-app-kit/commit/e8ac4f9c7a47d9f776ef057cb2c5cf13628b78e9))
* **dashboard:** add new RE components to dynamic assets tab ([c588848](https://github.com/awslabs/iot-app-kit/commit/c5888485c3205c7ee572ec01d6f0b34d1789da23))
* **dashboard:** add on configuration change ([e386353](https://github.com/awslabs/iot-app-kit/commit/e386353f8bc1888e3cc1c9a21b24e9012ae8682a))
* **dashboard:** adding new property panel layout ([617c77c](https://github.com/awslabs/iot-app-kit/commit/617c77c06a5496641cc75df963a12a1a8dda7be6))
* **dashboard:** adding new property panel layout ([39a8271](https://github.com/awslabs/iot-app-kit/commit/39a82711f97cf14494bd0ff6e74338bb41b8ff18))
* **dashboard:** default viewport setting ([0c3f3ef](https://github.com/awslabs/iot-app-kit/commit/0c3f3efa3a48be537d0eed0e6a1a02ecaa7c1f03))
* **dashboard:** make component library keyboard accessible ([164b0ce](https://github.com/awslabs/iot-app-kit/commit/164b0ce2a2ec6b5610d9a5c346cecda914d3bdea))
* **dashboard:** migration logic now supports avoiding collisions that lead to overlap ([c64e184](https://github.com/awslabs/iot-app-kit/commit/c64e184ad883c0515c3f6106e6e58f27b0ff69d3))
* **dashboard:** move dashboard migration utility to app-kit ([99a9aa8](https://github.com/awslabs/iot-app-kit/commit/99a9aa81ea6feb20364fd6305f0e36627c1ae163))
* **dashboard:** support custom toolbar ([c5374b5](https://github.com/awslabs/iot-app-kit/commit/c5374b5f8f3a4b399f83cc5c9a3adad604a64bff))
* **dashboard:** use new RE components to update dashboard RE for modeled and unmodeled data ([d7db11e](https://github.com/awslabs/iot-app-kit/commit/d7db11ee7c16dd012b7ced86dc52cde9a483e24e))
* display assetname conditionally in legend [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([c4c443f](https://github.com/awslabs/iot-app-kit/commit/c4c443fab77d6e337d32fbecebb308c7f339fab5))
* display legend unit conditionally  [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([9f6440e](https://github.com/awslabs/iot-app-kit/commit/9f6440e9e06c9040a6be46eab3a9141ad02a0509))
* enable dynamic assets on edge mode ([5b6a9e8](https://github.com/awslabs/iot-app-kit/commit/5b6a9e8d43b45ec0c3d4e60491557542f969ef58))
* fetchTimeSeriesData ([1c65191](https://github.com/awslabs/iot-app-kit/commit/1c65191654c726b66cf1e0bcc2df83d620f6d4a5))
* fix tabs on config panel present that are unusable [#2308](https://github.com/awslabs/iot-app-kit/issues/2308) ([4d3b6d5](https://github.com/awslabs/iot-app-kit/commit/4d3b6d5fea6b271bfdbce13679b0fa4b4d0cdf60))
* gauge widget to dashboard ([17cde64](https://github.com/awslabs/iot-app-kit/commit/17cde64259ab6b69beec2f2de4eaca9750504a5c))
* introduce edgeMode in dashboard components ([c168fb4](https://github.com/awslabs/iot-app-kit/commit/c168fb45b68252e25385c38bc20752ce1ffcd4e8))
* kpi and status gated config panel ([1f56b4f](https://github.com/awslabs/iot-app-kit/commit/1f56b4f2e7212ddfcc216fb778e0d4db57309ab2))
* legend resize ([792b617](https://github.com/awslabs/iot-app-kit/commit/792b6170cc19402f3c49fbd60e4a07dc0890c434))
* lint accessibility ([0db36ef](https://github.com/awslabs/iot-app-kit/commit/0db36ef6a07fe5e0709d17081dffa7d23669e2fe))
* made widget tooltip dismissable by pressing escape key [#2511](https://github.com/awslabs/iot-app-kit/issues/2511) ([87c81b5](https://github.com/awslabs/iot-app-kit/commit/87c81b5d2302c2656a9dbeacea02bbae9a334ede))
* new KPI and update tests ([328e41a](https://github.com/awslabs/iot-app-kit/commit/328e41ae6f1b25c743a16f03d966a5b97408455a))
* onViewportChange and currentViewport ([d63c9e3](https://github.com/awslabs/iot-app-kit/commit/d63c9e3a416e78a78b3a453755be39a6879eb07c))
* **react-components:** add arrow datasource ([efb0d6d](https://github.com/awslabs/iot-app-kit/commit/efb0d6d01549011e57400c6b48033264a7e122c9))
* **react-components:** add data quality to xy-plot ([ed18e0d](https://github.com/awslabs/iot-app-kit/commit/ed18e0d891035803dfc0cc646371ae1e20914d2a))
* **react-components:** add max column to legend ([322c20f](https://github.com/awslabs/iot-app-kit/commit/322c20f0d438ecb45ee02fae186f6a198963c5b6))
* **react-components:** add min column to legend ([69ba923](https://github.com/awslabs/iot-app-kit/commit/69ba92324da42770e267c9a0bce717ebf1ca0dbf))
* **react-components:** adding a fps display ([48cd9ef](https://github.com/awslabs/iot-app-kit/commit/48cd9efa3e5823086f0b7695886e934cc9303216))
* **react-components:** hide/show properties from legend ([e666cf1](https://github.com/awslabs/iot-app-kit/commit/e666cf1cfba8343d1a5bbb0f38a4341969a18575))
* **react-components:** l4e anomaly tests ([fbff596](https://github.com/awslabs/iot-app-kit/commit/fbff5968b7ddb406fa0eaaa21b84489010d55591))
* **react-components:** trendcurors using echarts extension ([a7c6bbe](https://github.com/awslabs/iot-app-kit/commit/a7c6bbe064ae746f024b74d885721a70a06716a2))
* **ResourceExplorer:** hide properties table when not needed to be displayed ([0fca5e9](https://github.com/awslabs/iot-app-kit/commit/0fca5e9089ac7af52e1d31b2143acb121cb7869b))
* **ResourceExplorer:** hide properties table when not needed to be displayed ([bcf36b1](https://github.com/awslabs/iot-app-kit/commit/bcf36b1080393ba0d5126d79e38b373ffcbd2442))
* scatter chart is selected the line style dropdown should be disabled for scatter chart [#2427](https://github.com/awslabs/iot-app-kit/issues/2427) ([d407ba3](https://github.com/awslabs/iot-app-kit/commit/d407ba344c41480b5986a8c8eb0ec8e79ade21a8))
* screen reader and keyboard accessibility for text widget link settings [#2363](https://github.com/awslabs/iot-app-kit/issues/2363) ([f0c0811](https://github.com/awslabs/iot-app-kit/commit/f0c08117f18158f7d2b486ce2ae0f21cfcf0a1f6))
* show/hide aggregation and resolution in KPI ([aef1f14](https://github.com/awslabs/iot-app-kit/commit/aef1f146c6d4db03d759b76896d78e966b1ce1e6))
* tabs on config panel present that are unusable [#2308](https://github.com/awslabs/iot-app-kit/issues/2308) ([9f0b63d](https://github.com/awslabs/iot-app-kit/commit/9f0b63d81446a1fce4a4635804cff9a6c06c9387))
* updated background color tokens to support theming [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([a21fbe7](https://github.com/awslabs/iot-app-kit/commit/a21fbe7ca1c90dedb1ba024a1cc17682343e0c1f))
* updated the theming support for kpi and tc [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([d32a018](https://github.com/awslabs/iot-app-kit/commit/d32a0184518ef02222ef15359d49bccb68f6ee39))
* user selected dashboard refresh-rate ([1c1256d](https://github.com/awslabs/iot-app-kit/commit/1c1256da83c938037a47e930c127c2bf3bc14e90))
* widget tool box on mouse hover and selection state ([c80d42a](https://github.com/awslabs/iot-app-kit/commit/c80d42a3d10223d0d7edd5b3ee1b23c9ab613399))
* **widgets:** add name style settings for line/table + edit label in config panel ([f5e9b3f](https://github.com/awslabs/iot-app-kit/commit/f5e9b3fc99a176b3d9eb54ef0a387d171791aaf9))
* xy-plot & bar-chart allow only numerical datatypes [#1952](https://github.com/awslabs/iot-app-kit/issues/1952) ([10b057a](https://github.com/awslabs/iot-app-kit/commit/10b057a1e088ad9ecdc710af73dfd947398659f3))
* xy-plot y axis lable changes [#2378](https://github.com/awslabs/iot-app-kit/issues/2378) ([48389c3](https://github.com/awslabs/iot-app-kit/commit/48389c3e59305525b11b63233c3a79d4a8e3a78d))


### Bug Fixes

* add left border to configuration panel ([7f684d1](https://github.com/awslabs/iot-app-kit/commit/7f684d17b2945f67982474ad9d36beaa966999f0))
* add range for table significant digits test ([ac53406](https://github.com/awslabs/iot-app-kit/commit/ac53406823e2c359e635720b918bccb1bf9fb0f7))
* add signigicant digits to xy plot ([70a109e](https://github.com/awslabs/iot-app-kit/commit/70a109e8083b6729313f4f0dc362df0f3cf6ea62))
* add timeZone prop to DashboardViewWrapper ([21f9b15](https://github.com/awslabs/iot-app-kit/commit/21f9b15f2c603e17b139de8b0caba99288207ffb))
* add trailing zeros to decimal point rounding, fix rounding function ([9c13177](https://github.com/awslabs/iot-app-kit/commit/9c131779c5a3f5b2ce7c6d1239e54ed82bfbf572))
* added aria label to dashboard threshold delete button ([ff94bb0](https://github.com/awslabs/iot-app-kit/commit/ff94bb0e5c367ec02a572938a08dcf859e4820f5))
* added aria-label to the config panel text link control for accessibility [#2362](https://github.com/awslabs/iot-app-kit/issues/2362) ([a6f9c22](https://github.com/awslabs/iot-app-kit/commit/a6f9c22e40660e8e30f3b1f65f71f968dc4a0cac))
* added the selection list reset in unmodeled section after clicking add [#2659](https://github.com/awslabs/iot-app-kit/issues/2659) ([7288bc7](https://github.com/awslabs/iot-app-kit/commit/7288bc75afe8f7dac66a6588cd1c21d674bac7dc))
* added validation for decimal places input in dashboard settings [#2723](https://github.com/awslabs/iot-app-kit/issues/2723) ([ac39b8d](https://github.com/awslabs/iot-app-kit/commit/ac39b8db8ad71e08e1cea4f612b4806f861ffaec))
* added validation for the decimal places input [#2567](https://github.com/awslabs/iot-app-kit/issues/2567) ([57bcb3d](https://github.com/awslabs/iot-app-kit/commit/57bcb3ddd4d1b0d88d301838f736fbf601ba48d5))
* aws clients marked as peer dependencies ([0272167](https://github.com/awslabs/iot-app-kit/commit/027216707ec5fdd77390ef1de132ef744f4f17b8))
* bar chart break due to css property of line chart ([512e48c](https://github.com/awslabs/iot-app-kit/commit/512e48c5f61e7ac8b09a25551702136f0a01c918))
* broken search results disabled state ([38ef2be](https://github.com/awslabs/iot-app-kit/commit/38ef2beb9d7673e8cc0438424631343d5a4eb3ca))
* chart gesture icons overlap on mouse hover ([b5e5c0d](https://github.com/awslabs/iot-app-kit/commit/b5e5c0d6115ed8eb9d819a9b4ceef31c7b56db2b))
* check if href is a valid url before rendering ([ab24822](https://github.com/awslabs/iot-app-kit/commit/ab24822d1792b259529f617bef20b54150e54db2))
* clearing the properties table when user navigates using breadcrumbs [#2751](https://github.com/awslabs/iot-app-kit/issues/2751) ([0653565](https://github.com/awslabs/iot-app-kit/commit/065356516252be2d07c84d0c4a8d9d3d6e392d1c))
* dark mode support for expandable sections in config panel and text widget text color [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([89ba559](https://github.com/awslabs/iot-app-kit/commit/89ba5596fb6c185e8c78e73617733c123a7ef1b3))
* dashboard settings to set correct columns and rows [#2313](https://github.com/awslabs/iot-app-kit/issues/2313) ([cd952c5](https://github.com/awslabs/iot-app-kit/commit/cd952c5e6462fa25350ccc28eb261a70bfa29d98))
* **dashboard-dynamic-asset:** asset name should be shown on refresh in dropdown ([d799487](https://github.com/awslabs/iot-app-kit/commit/d799487b5f72e274a89dce39c94438151c6170f2))
* **dashboard-RE-improvements:** add timezone + sig digits to dynamic tab ([8a6b3ed](https://github.com/awslabs/iot-app-kit/commit/8a6b3ed0052eb37f6a8f0aea7739d6ea076466ac))
* **dashboard:** add apply and cancel buttons to settings modal ([81336cf](https://github.com/awslabs/iot-app-kit/commit/81336cf77806292663cafb929d828e6a95e164af))
* **dashboard:** add descriptions to all RE tables ([f7b4f0c](https://github.com/awslabs/iot-app-kit/commit/f7b4f0c89d8b05be988acac54b8edf35ab3b7367))
* **dashboard:** add descriptions to all tables in RE ([c7aff00](https://github.com/awslabs/iot-app-kit/commit/c7aff00ea0d6175186317f06ca7eec4c550de7a0))
* **dashboard:** add timezone support for new RE ([2d4b5dd](https://github.com/awslabs/iot-app-kit/commit/2d4b5ddcbdefe4828168a7864bd679744e5a97eb))
* **dashboard:** adds resolution and aggregation to new proeprty in gauge widget ([5f5af30](https://github.com/awslabs/iot-app-kit/commit/5f5af3068defeb2a609e68ca0d29cc09f9960cfd))
* **dashboard:** assetName displays conditionally in config panel for linechart ([85496ab](https://github.com/awslabs/iot-app-kit/commit/85496abf0ac3bbb6890678f7c647beaa8cbfbb9d))
* **dashboard:** bring dashboard view component up to date ([cf75507](https://github.com/awslabs/iot-app-kit/commit/cf75507b76130f708dba67a61dc14e6ba3dac7ff))
* **dashboard:** color picker has keyboard focus and can be interacted with ([1e4547e](https://github.com/awslabs/iot-app-kit/commit/1e4547e3aa2bc521c315391cabac569beab10508))
* **dashboard:** composite model tests run correctly ([d2cbaaf](https://github.com/awslabs/iot-app-kit/commit/d2cbaafef6639b84a8762dda9fccf3d3e86fbefd))
* **dashboard:** decimal places fixes ([710a6ae](https://github.com/awslabs/iot-app-kit/commit/710a6aeee8e16fbf7f204d9214dbd8c86fce16e2))
* **dashboard:** decrease width of property label in config panel to stop overflow of delete button ([ee027e5](https://github.com/awslabs/iot-app-kit/commit/ee027e5d95946b89bebcd5e3bdc3a82aecd60d0b))
* **dashboard:** ensure there is a current viewport ([dc31ecf](https://github.com/awslabs/iot-app-kit/commit/dc31ecfa29cc1fd809daf992027670ae8cb39519))
* **dashboard:** expand hitbox for widget action buttons ([64b77db](https://github.com/awslabs/iot-app-kit/commit/64b77db50fe224273db58ab38a67fe478e94ccc2))
* **dashboard:** fast follow improvements for new RE ([ea8c93c](https://github.com/awslabs/iot-app-kit/commit/ea8c93ce12aadafcd5c3e1c8794cedb07cc843f1))
* **dashboard:** fix flaky test in dashboard ([6fe3285](https://github.com/awslabs/iot-app-kit/commit/6fe328510bfd4ed36a24935085aa41ac0c83dfa5))
* **dashboard:** fix spacing between widgets without selection box ([7cc590d](https://github.com/awslabs/iot-app-kit/commit/7cc590dd988bf244c430e55e43745a8be344e8d7))
* **dashboard:** fix spacing issues on editable grid ([0529abd](https://github.com/awslabs/iot-app-kit/commit/0529abd18267bf69ea36a2795096d724784ce3bc))
* **dashboard:** for kpi/status disable add of RE when an property is already added ([712c1a7](https://github.com/awslabs/iot-app-kit/commit/712c1a777bc51c69956bfbb855bd0a01a6721e18))
* **dashboard:** for kpi/status disable add of RE when an property is already added ([eff3282](https://github.com/awslabs/iot-app-kit/commit/eff328273955d5e8a4ae815e03855aae6c48e162))
* **dashboard:** gauge bug fixes ([d93a42a](https://github.com/awslabs/iot-app-kit/commit/d93a42a1a62a1cfa31a6c342429a730663b8a591))
* **dashboard:** increase width of property label in config panel to span width of panel ([642f7c6](https://github.com/awslabs/iot-app-kit/commit/642f7c6ad5b50d20009ba21067255aab1e8d4780))
* **dashboard:** kpi/status bug to stop adding more than 1 property ([f68c5eb](https://github.com/awslabs/iot-app-kit/commit/f68c5eb42d34aa3483d3f85fe01dfb5d4e64fb3a))
* **dashboard:** label matches kpi name ([f675d11](https://github.com/awslabs/iot-app-kit/commit/f675d11857c0b0a3869d03d9c1339c405a85d11e))
* **dashboard:** make onSave optional ([1e92359](https://github.com/awslabs/iot-app-kit/commit/1e92359faa2c4ce3e8c169491729187b02e4562e))
* **dashboard:** migration for sitewise component + blackpearl widget types ([c91a0e9](https://github.com/awslabs/iot-app-kit/commit/c91a0e9cda943cad530c722dc6c8097b225a45da))
* **dashboard:** migration migrates custom name for properties ([bd7862b](https://github.com/awslabs/iot-app-kit/commit/bd7862b5faabe379821385e7cfb2f14a647da803))
* **dashboard:** missing dependency for dashboard wrapper ([c6b73db](https://github.com/awslabs/iot-app-kit/commit/c6b73db473948be887e0968864a0f896fdc4d680))
* **dashboard:** modeled datastreams are displayed in msw ([a2833a1](https://github.com/awslabs/iot-app-kit/commit/a2833a174ccb8f66b547451f92ff2b6c6194beca))
* **dashboard:** padding for tabs in config panel + remove scroll in threshold panel ([d3f969c](https://github.com/awslabs/iot-app-kit/commit/d3f969c092a271e7b26289d0160e0c4901282b1e))
* **dashboard:** re reflects significant digits + timezone support for unmodeled ([195be67](https://github.com/awslabs/iot-app-kit/commit/195be67fe0e5b7ef7b262491ff4fec574c62db8c))
* **dashboard:** reenable gestures in edit mode ([16bd88f](https://github.com/awslabs/iot-app-kit/commit/16bd88fad43742488efdfaa433104446ad5b2b08))
* **dashboard:** remove promise client from public API and internally generate it ([b98f5c7](https://github.com/awslabs/iot-app-kit/commit/b98f5c7ad292cee108c744d2ceec0d5117dd90b0))
* **dashboard:** revert the title change for line chart ([88ed63e](https://github.com/awslabs/iot-app-kit/commit/88ed63ebd6e4f4da8c25820891afdc2ce6ac8903))
* **dashboard:** sanitize href input in text widget ([f766a3b](https://github.com/awslabs/iot-app-kit/commit/f766a3bd3cb410d098f3e9606fe24e2f61c4ae0f))
* **dashboard:** selected assets do not deselect on widget selection ([5c717f8](https://github.com/awslabs/iot-app-kit/commit/5c717f8bf57788ae9cac6521807d82622b47ac8a))
* **dashboard:** style fixes to make the dashboard accessible at small screensizes ([dde49e6](https://github.com/awslabs/iot-app-kit/commit/dde49e6bc06f8b7f2472ab36db91196e93ce84aa))
* **dashboard:** style updates to widget title bar ([1b224bf](https://github.com/awslabs/iot-app-kit/commit/1b224bf36768ed628946512be1feab2d0446985f))
* **dashboard:** use more descriptive name for the settings label ([2d0b36c](https://github.com/awslabs/iot-app-kit/commit/2d0b36c29cad264f45f3e7178dcd3c296692c69e))
* default Style tab upon widget selection ([5456435](https://github.com/awslabs/iot-app-kit/commit/5456435081da8e77a860c2c3f38b841a728eb4f8))
* disable equals and contains operators in gauge thresholds ([6fd0ab4](https://github.com/awslabs/iot-app-kit/commit/6fd0ab40f0553067a65f5b5a25b0a6b299d3d1ac))
* disable options in legend or yaxis section if visible is false [#2467](https://github.com/awslabs/iot-app-kit/issues/2467) ([b4daa17](https://github.com/awslabs/iot-app-kit/commit/b4daa17735a6ebed582c98d292e7b1c261a65dea))
* empty state overflow ([3e073f7](https://github.com/awslabs/iot-app-kit/commit/3e073f72cfd0a47c87bf09d8b20c64ef54907430))
* filter component models from query editor ([8245b6d](https://github.com/awslabs/iot-app-kit/commit/8245b6d4e8c6f120af0c523c41ee3ccc9d4097fa))
* fix data-zoom behavior for base chart ([0c66a80](https://github.com/awslabs/iot-app-kit/commit/0c66a8016e2aa827ad3093c3ef89d6437e014d18))
* fixed the bug in saving workspace in localstorage [#2566](https://github.com/awslabs/iot-app-kit/issues/2566) ([7a7f619](https://github.com/awslabs/iot-app-kit/commit/7a7f61920438b8d30b8a42a1d71971e4822d56be))
* fixed the issue with no aggregation change [#2605](https://github.com/awslabs/iot-app-kit/issues/2605) ([569854e](https://github.com/awslabs/iot-app-kit/commit/569854e1e0778b569a0dc9ca265e77f1d1508efc))
* fixed the properties tab child key error [#2809](https://github.com/awslabs/iot-app-kit/issues/2809) ([370e1f7](https://github.com/awslabs/iot-app-kit/commit/370e1f7061908d4c1334fca9b8454c2ba0e32e5c))
* fixed the timezone issue in unit test [#2623](https://github.com/awslabs/iot-app-kit/issues/2623) ([a8200dc](https://github.com/awslabs/iot-app-kit/commit/a8200dc6ff783fbfda924ee52080582bd0a1f222))
* fixed the view mode edge mode actions issue [#2650](https://github.com/awslabs/iot-app-kit/issues/2650) ([4298a6b](https://github.com/awslabs/iot-app-kit/commit/4298a6b1981db2e2bd3a9c00947fd90573baed50))
* fixed the workspace required errorin search [#2384](https://github.com/awslabs/iot-app-kit/issues/2384) ([0ff9bc3](https://github.com/awslabs/iot-app-kit/commit/0ff9bc3887cc87441b80df017d964be36727be7f))
* grouped the style buttons together and associated with style label for screen reader [#2360](https://github.com/awslabs/iot-app-kit/issues/2360) ([da7f0c1](https://github.com/awslabs/iot-app-kit/commit/da7f0c1f5bbdb0735fec4ddfbf53726ba5c319cc))
* hidden and highlighted datastreams persist correctly ([5a85bb7](https://github.com/awslabs/iot-app-kit/commit/5a85bb7d40d07dce439a1bfa15550d8893089cbd))
* **imports:** move luxon dependency to right package ([31235da](https://github.com/awslabs/iot-app-kit/commit/31235da4b31e49ec0fc0f1ec21f649cf7af7e253))
* improve properties panel styling ([f3de67e](https://github.com/awslabs/iot-app-kit/commit/f3de67e73c7197c6bf63254c93476475661738b0))
* loads properties panel if some of the assets do not exist [#2808](https://github.com/awslabs/iot-app-kit/issues/2808) ([c4a98a5](https://github.com/awslabs/iot-app-kit/commit/c4a98a5f04143a827aba4176117b049bcacb946c))
* make gauge widget default size smaller ([937199a](https://github.com/awslabs/iot-app-kit/commit/937199adfdd536681700919ddcea7648860c7052))
* migrated widget tooltip css to styled-components for theming [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([2ee5eca](https://github.com/awslabs/iot-app-kit/commit/2ee5ecad15ea7aa200693b4922128191e1808106))
* min max is sortable and not present on widget add ([7578a2e](https://github.com/awslabs/iot-app-kit/commit/7578a2e113221b2d3c00c01d2ede253e7ce07081))
* min/max values have correct significant digits ([50e183d](https://github.com/awslabs/iot-app-kit/commit/50e183d240ecf329362e10d21b9864d08cb525ee))
* msw batchGetAssetPropertyValueHandler response timeInSeconds values ([5869a00](https://github.com/awslabs/iot-app-kit/commit/5869a009550399ab73b882e2f253aa9c10ec1179))
* msw batchGetAssetPropertyValueHistoryHandler timestamp ([ccf21a7](https://github.com/awslabs/iot-app-kit/commit/ccf21a73a1391ac9da3ccceb18916897ef51066e))
* pass in refresh rate through the query instead of props ([b6df585](https://github.com/awslabs/iot-app-kit/commit/b6df5856b4407c74d4746d12a1781d11976f9948))
* preserve viewMode onSave ([731756a](https://github.com/awslabs/iot-app-kit/commit/731756a3d89bb5eca611c0bb4d3b576822f108f3))
* prevent creating new chart when iconn is dragged over different chart type ([7feff77](https://github.com/awslabs/iot-app-kit/commit/7feff773d0a06f4029824b02a30371c1993b05bf))
* programatically linked the color-picker id with color label in configPanelText [#2361](https://github.com/awslabs/iot-app-kit/issues/2361) ([ab05475](https://github.com/awslabs/iot-app-kit/commit/ab0547539bb9b47130c66c0520d7c0bce9cf5aee))
* **react components:** updating import for popper.js ([00c1707](https://github.com/awslabs/iot-app-kit/commit/00c17078163cc2ef48a8eb6e370652ca9823e8e2))
* **react-components:** add snapshot tests ([178f0e7](https://github.com/awslabs/iot-app-kit/commit/178f0e7bbba316c711ff7c8fc18455cdccf939fb))
* **react-components:** gauge properly shows property name again ([ddb65c6](https://github.com/awslabs/iot-app-kit/commit/ddb65c6304c473e01e0c7ae3e868eba98923574c))
* **react-components:** refactor chart to use dataset ([b403789](https://github.com/awslabs/iot-app-kit/commit/b4037897cd4e7169958373bbf61d29c7454706ef))
* **react-components:** timestamp bar correct date ([2063935](https://github.com/awslabs/iot-app-kit/commit/20639352a433cea9abfceee439f7aa9c36db05b9))
* **react-components:** updates for x-axis panning performance ([07a7624](https://github.com/awslabs/iot-app-kit/commit/07a7624d77962c38e7457abea1602082ebf2f5a3))
* realistic dev experience on storybook ([377d64a](https://github.com/awslabs/iot-app-kit/commit/377d64a4ead7b0a68d5df47a5df568da7d188021))
* refresh rate defined in dashboard and on query ([43cc5e4](https://github.com/awslabs/iot-app-kit/commit/43cc5e437543aed60663620655044cba9437a226))
* remove double aggregation picker ([dea30ce](https://github.com/awslabs/iot-app-kit/commit/dea30ce3e50f5bba5931970eaf5e8d233753b1b2))
* remove duplicate constants and types ([45c155b](https://github.com/awslabs/iot-app-kit/commit/45c155b414a29c767e276060f1c60ce8401ea456))
* **ResourceExplorer:** filter out invalid twinmaker execute query search results ([e616be4](https://github.com/awslabs/iot-app-kit/commit/e616be4c6d8e2d8a01b5ba931a57307ea8b7f307))
* table resize button aria label ([1618d50](https://github.com/awslabs/iot-app-kit/commit/1618d50a713cb1be8b9a74899144ca92cd9ec5f1))
* template asset table disables invalid dataTypes ([7cacc1c](https://github.com/awslabs/iot-app-kit/commit/7cacc1cee19fa9c9d116435d377e4bf820ba9ff9))
* text widget enhancement - 2429 ([0d5a367](https://github.com/awslabs/iot-app-kit/commit/0d5a367c074b12d98aa91a5b5c1ea37e3033c047))
* tooltip styled component issue is fixed ([5af6e22](https://github.com/awslabs/iot-app-kit/commit/5af6e2285cfc2e346e417e13f305f3a0a0c05439))
* update default cellsize in migration to 20 ([12db8f9](https://github.com/awslabs/iot-app-kit/commit/12db8f91940747b7159c2384057247f61995d1f2))
* updated the new set of design tokens [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([7bdb8b0](https://github.com/awslabs/iot-app-kit/commit/7bdb8b08db1dcdc06153d71eff191a5e5a93a48b))
* updated the ux for widget actions [#2439](https://github.com/awslabs/iot-app-kit/issues/2439) ([c50cd03](https://github.com/awslabs/iot-app-kit/commit/c50cd0381e7e1240b30bbffa1cd4a4c4f5de4987))
* updated the viewport settings for dynamic input [#2565](https://github.com/awslabs/iot-app-kit/issues/2565) ([0e31d25](https://github.com/awslabs/iot-app-kit/commit/0e31d25b9a7001a6216057681ac5aa7b6ec327ed))
* updated the viewport settings for dynamic input [#2565](https://github.com/awslabs/iot-app-kit/issues/2565) ([7589b1d](https://github.com/awslabs/iot-app-kit/commit/7589b1d1c52aa9a9c5e4ce2336afb8b44d251f55))
* updated theming support for buttons [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([1ffead0](https://github.com/awslabs/iot-app-kit/commit/1ffead0805048445b677f4cd63a31af7d5912095))
* updates for performance issues ([8863b9a](https://github.com/awslabs/iot-app-kit/commit/8863b9a80d7a8284aa4732ed25298d165a769ea9))


### Performance Improvements

* initial Animator implementation ([3b30cd2](https://github.com/awslabs/iot-app-kit/commit/3b30cd2c236704145ac29b2cf0222a28de9a0959))


### Reverts

* "feat(dashboard): adding new property panel layout" ([880125b](https://github.com/awslabs/iot-app-kit/commit/880125baadbf5ce1b478566154d8f352143e9784))
* "feat(dashboard): adding new property panel layout" ([9f6b707](https://github.com/awslabs/iot-app-kit/commit/9f6b707b0ba78981d6ee65536260acf0e1a3bb38))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 12.0.0
    * @iot-app-kit/core-util bumped from * to 12.0.0
    * @iot-app-kit/react-components bumped from * to 12.0.0
    * @iot-app-kit/source-iotsitewise bumped from * to 12.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from * to 12.0.0
    * @iot-app-kit/testing-util bumped from * to 12.0.0
    * @iot-app-kit/ts-config bumped from * to 12.0.0
    * eslint-config-iot-app-kit bumped from * to 12.0.0
</details>

<details><summary>doc-site: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/doc-site-v11.0.0...doc-site-v12.0.0) (2024-11-18)


### Features

* add alarm data source query ([32fe5c7](https://github.com/awslabs/iot-app-kit/commit/32fe5c706fba1c483b98d7baa1d1045eb6cf2ac3))
* add gauge component in doc site package ([17a02f5](https://github.com/awslabs/iot-app-kit/commit/17a02f54ac811ab384aa6b8ad2dd4f61e0cc1514))
* add timezone docs ([8995f92](https://github.com/awslabs/iot-app-kit/commit/8995f92959132da6feaace768206070a8c8aae6d))
* **anomaly-chart:** added `gestures` enablement option ([4c2402c](https://github.com/awslabs/iot-app-kit/commit/4c2402c44a5c3538fdc60fe8210b626670073479))
* **doc-site:** adding doc-site ([743ca50](https://github.com/awslabs/iot-app-kit/commit/743ca509649a31f11334fbbd2785cce1dbb4b735))
* **react-components:** add arrow datasource ([efb0d6d](https://github.com/awslabs/iot-app-kit/commit/efb0d6d01549011e57400c6b48033264a7e122c9))


### Bug Fixes

* add doc-site to release-please config ([ccf5086](https://github.com/awslabs/iot-app-kit/commit/ccf5086fc9ef362e7c61c4d02cb3e88aa20b21c5))
* anomaly chart docs not loading ([8e01a69](https://github.com/awslabs/iot-app-kit/commit/8e01a69f48b0632b80cb432f6a5f0decdf3301d4))
* **dashboard:** bring dashboard view component up to date ([cf75507](https://github.com/awslabs/iot-app-kit/commit/cf75507b76130f708dba67a61dc14e6ba3dac7ff))
* **doc-site:** canvas not recognised automatically ([1e42f58](https://github.com/awslabs/iot-app-kit/commit/1e42f5872f863349b51264526d4b74271e811412))
* fix for css style issue in doc site [#2718](https://github.com/awslabs/iot-app-kit/issues/2718) ([e50f2ae](https://github.com/awslabs/iot-app-kit/commit/e50f2aeeee42e337e0a3327f5989f224241bdf74))
* l4e bug fixes ([a71673c](https://github.com/awslabs/iot-app-kit/commit/a71673c9fbc701a5e26ed8d8c9bda191bc9b9285))
* make gauge values absolute values in gauge docs ([dbb4901](https://github.com/awslabs/iot-app-kit/commit/dbb490144d14e144636ab02c7e4d4fa7b79188df))
* **react-components:** export anomaly chart ([30ae675](https://github.com/awslabs/iot-app-kit/commit/30ae675d92acd26d0414f6aa2da953bc0b37d5e7))
* **react-components:** gauge properly shows property name again ([ddb65c6](https://github.com/awslabs/iot-app-kit/commit/ddb65c6304c473e01e0c7ae3e868eba98923574c))
* testing-util as devDependency of doc-site ([3cc2bb0](https://github.com/awslabs/iot-app-kit/commit/3cc2bb08294244c3f6fd15800892d6402894b434))
* update data quality UX to match mocks ([ed62846](https://github.com/awslabs/iot-app-kit/commit/ed628461c0dd582ae2f03f06b81c8d25aab3832c))
* update docs for KPI ([84a51f5](https://github.com/awslabs/iot-app-kit/commit/84a51f51c71527a4ffec72fbffb118f6e0b7f67d))
* update timezone docs based on feedback ([17be12d](https://github.com/awslabs/iot-app-kit/commit/17be12d6336a607866a27af31e742b74d712c571))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 12.0.0
    * @iot-app-kit/react-components bumped from * to 12.0.0
  * devDependencies
    * @iot-app-kit/testing-util bumped from * to 12.0.0
    * eslint-config-iot-app-kit bumped from * to 12.0.0
</details>

<details><summary>jest-config: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/jest-config-v11.0.0...jest-config-v12.0.0) (2024-11-18)


### Miscellaneous Chores

* **jest-config:** Synchronize iot-app-kit versions
</details>

<details><summary>react-components: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/react-components-v11.0.0...react-components-v12.0.0) (2024-11-18)


### Features

* add a widget level loading indicator for x-y plot ([9be5617](https://github.com/awslabs/iot-app-kit/commit/9be5617aabe7a1edf88876406aeb1e83f174a288))
* add anomaly query ([3c11512](https://github.com/awslabs/iot-app-kit/commit/3c115121db6fc8248bcd6b36989f6ebea3212ba7))
* add data quality to kpi and status ([7248004](https://github.com/awslabs/iot-app-kit/commit/724800417bc8c74f518d6a39044c815848ef431f))
* add gauge component in doc site package ([17a02f5](https://github.com/awslabs/iot-app-kit/commit/17a02f54ac811ab384aa6b8ad2dd4f61e0cc1514))
* add step chart to l4e ([0983438](https://github.com/awslabs/iot-app-kit/commit/0983438c28ad7603e689697b0bd68cc10ce6fb50))
* add threshold settings to KPI ([2fa0429](https://github.com/awslabs/iot-app-kit/commit/2fa0429b6262092b4b3c86c21b8808b90e2d49fe))
* add timezone converter util ([e5d59c4](https://github.com/awslabs/iot-app-kit/commit/e5d59c43803a03413e77556f6ca4179b18ecb3d7))
* added a label time range for viewport picker in dashboard header [#2559](https://github.com/awslabs/iot-app-kit/issues/2559) ([743cb80](https://github.com/awslabs/iot-app-kit/commit/743cb80ec36d116d6ef25e97ec54f2238ddb2ea1))
* added accessible labels to different toolbar container [#2510](https://github.com/awslabs/iot-app-kit/issues/2510) ([ce5af6f](https://github.com/awslabs/iot-app-kit/commit/ce5af6fbc6e6b887f3fade9395bcbf54da386a88))
* added data quality icon and text next to value in table [#2664](https://github.com/awslabs/iot-app-kit/issues/2664) ([91cd12f](https://github.com/awslabs/iot-app-kit/commit/91cd12f9e73fa5c77ab8e7209376116f4307526b))
* added support for border theming options [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([66e6680](https://github.com/awslabs/iot-app-kit/commit/66e6680fbea3f005aba7239c3c47bf13e5184462))
* added viewport timestamps in xy plot [#2470](https://github.com/awslabs/iot-app-kit/issues/2470) ([46c1d24](https://github.com/awslabs/iot-app-kit/commit/46c1d24b99ff2ca9fb990ceed341ad6820c21f01))
* adding timezone support to dashboard/widgets ([6435b90](https://github.com/awslabs/iot-app-kit/commit/6435b90d93246e319b939b7c316c6ffbea12ef8d))
* **anomaly-chart:** added `gestures` enablement option ([4c2402c](https://github.com/awslabs/iot-app-kit/commit/4c2402c44a5c3538fdc60fe8210b626670073479))
* changed ui experience of chart legend based on legend position [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([de1f147](https://github.com/awslabs/iot-app-kit/commit/de1f14772b614f67156a34ac64300111a6c55126))
* chart legend support px rem em % unit type ([4e023e6](https://github.com/awslabs/iot-app-kit/commit/4e023e6c4a735189e2db04de886555a0199087b2))
* chat legend enhancement [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([b1ca8ae](https://github.com/awslabs/iot-app-kit/commit/b1ca8aeda126f09f371e23133fa600d5b56c9b21))
* conditionally display latest value in legend table  [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([d3feb29](https://github.com/awslabs/iot-app-kit/commit/d3feb2920f3c63b0b2ce9580fc07a86475fc1ff1))
* customize gauge in dashboard config ([8af089e](https://github.com/awslabs/iot-app-kit/commit/8af089e94a2c11cab1c9473d384ed241da7f6461))
* **dashboard:** add colors to trendcursors ([a890c7d](https://github.com/awslabs/iot-app-kit/commit/a890c7db39df1a836312ac4050c41e2f4fdd9f4a))
* **dashboard:** add new RE components to dynamic assets tab ([c588848](https://github.com/awslabs/iot-app-kit/commit/c5888485c3205c7ee572ec01d6f0b34d1789da23))
* **dashboard:** default viewport setting ([0c3f3ef](https://github.com/awslabs/iot-app-kit/commit/0c3f3efa3a48be537d0eed0e6a1a02ecaa7c1f03))
* **dashboard:** use new RE components to update dashboard RE for modeled and unmodeled data ([d7db11e](https://github.com/awslabs/iot-app-kit/commit/d7db11ee7c16dd012b7ced86dc52cde9a483e24e))
* display assetname conditionally in legend [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([c4c443f](https://github.com/awslabs/iot-app-kit/commit/c4c443fab77d6e337d32fbecebb308c7f339fab5))
* display legend unit conditionally  [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([9f6440e](https://github.com/awslabs/iot-app-kit/commit/9f6440e9e06c9040a6be46eab3a9141ad02a0509))
* first click on paginate timeline should move backward from current time duration ([5f9aa42](https://github.com/awslabs/iot-app-kit/commit/5f9aa42aef52d1bade596d0b8cfa1d58d51cce52))
* gauge widget to dashboard ([17cde64](https://github.com/awslabs/iot-app-kit/commit/17cde64259ab6b69beec2f2de4eaca9750504a5c))
* guage component data quality and error text ([2dca188](https://github.com/awslabs/iot-app-kit/commit/2dca1889462a6002980b105ae5338265c187b502))
* guage component initail commit ([305657a](https://github.com/awslabs/iot-app-kit/commit/305657a7aa761883da7a9839d0ae0a3914751a51))
* kpi and status gated config panel ([1f56b4f](https://github.com/awslabs/iot-app-kit/commit/1f56b4f2e7212ddfcc216fb778e0d4db57309ab2))
* l4e table ([5bd6898](https://github.com/awslabs/iot-app-kit/commit/5bd68983268d00ff60bf0434e5b810e52254c16c))
* l4e timeline (mock data only) ([829496c](https://github.com/awslabs/iot-app-kit/commit/829496cd0f51fb4131b5a081c8ecc7d17763b5be))
* legend resize ([792b617](https://github.com/awslabs/iot-app-kit/commit/792b6170cc19402f3c49fbd60e4a07dc0890c434))
* legend table is implemeted using tanstack table ([c92533a](https://github.com/awslabs/iot-app-kit/commit/c92533a342c95618d6dcf7d2a13bdad204bb01de))
* lint accessibility ([0db36ef](https://github.com/awslabs/iot-app-kit/commit/0db36ef6a07fe5e0709d17081dffa7d23669e2fe))
* new design status (gated) ([69d6c97](https://github.com/awslabs/iot-app-kit/commit/69d6c979d1baefd4fd486cf0d1402b7357e8506b))
* new KPI and update tests ([328e41a](https://github.com/awslabs/iot-app-kit/commit/328e41ae6f1b25c743a16f03d966a5b97408455a))
* onViewportChange and currentViewport ([d63c9e3](https://github.com/awslabs/iot-app-kit/commit/d63c9e3a416e78a78b3a453755be39a6879eb07c))
* **react-components:** add arrow datasource ([efb0d6d](https://github.com/awslabs/iot-app-kit/commit/efb0d6d01549011e57400c6b48033264a7e122c9))
* **react-components:** add auto resolution and batching ([073029f](https://github.com/awslabs/iot-app-kit/commit/073029f4312c988bf099251284bf63d9515e01fd))
* **react-components:** add axis option to anomaly widget ([d0733e1](https://github.com/awslabs/iot-app-kit/commit/d0733e12863f4ee2db1e29576c8ea6b1d5964f62))
* **react-components:** add data quality to xy-plot ([ed18e0d](https://github.com/awslabs/iot-app-kit/commit/ed18e0d891035803dfc0cc646371ae1e20914d2a))
* **react-components:** add hook for get asset property value history ([c708b4a](https://github.com/awslabs/iot-app-kit/commit/c708b4a6c2c3e9d6e843829692a2046c00ee6950))
* **react-components:** add hook for latest asset property value ([ce9ec7c](https://github.com/awslabs/iot-app-kit/commit/ce9ec7c714e6c600da59af8f4bffaf210f0041c0))
* **react-components:** add intl ([c7c30c3](https://github.com/awslabs/iot-app-kit/commit/c7c30c3f969c71de6856d98d59e1043a6c785a45))
* **react-components:** add l4e datasource ([748f8c1](https://github.com/awslabs/iot-app-kit/commit/748f8c17d56bbef0f2190fde38b5717c29d1d942))
* **react-components:** add l4e queries ([328da8e](https://github.com/awslabs/iot-app-kit/commit/328da8ed9341c68c8c0a3a6b672170f1fa8eeb37))
* **react-components:** add max column to legend ([322c20f](https://github.com/awslabs/iot-app-kit/commit/322c20f0d438ecb45ee02fae186f6a198963c5b6))
* **react-components:** add min column to legend ([69ba923](https://github.com/awslabs/iot-app-kit/commit/69ba92324da42770e267c9a0bce717ebf1ca0dbf))
* **react-components:** add useLatestAlarmPropertyValue hook to fetch alarm prop vals in useAlarms ([18aa854](https://github.com/awslabs/iot-app-kit/commit/18aa8548bbc9aa9d4343a1d85b3cefdb798e1b25))
* **react-components:** calculate min/max and store value in store for chart to consume ([41b8551](https://github.com/awslabs/iot-app-kit/commit/41b855103e6643dd79e6e0fc9e7350fddefd9101))
* **react-components:** hide/show properties from legend ([e666cf1](https://github.com/awslabs/iot-app-kit/commit/e666cf1cfba8343d1a5bbb0f38a4341969a18575))
* **react-components:** implement request functions and hooks to build clients ([2ca7e6c](https://github.com/awslabs/iot-app-kit/commit/2ca7e6caf771bd929b993d79f91f6e7d3ce21350))
* **react-components:** initiali implementation for useTimeSeriesData ([50db88f](https://github.com/awslabs/iot-app-kit/commit/50db88f309e6470bfc510824f6deb564c949b794))
* **react-components:** l4e anomaly tests ([fbff596](https://github.com/awslabs/iot-app-kit/commit/fbff5968b7ddb406fa0eaaa21b84489010d55591))
* **react-components:** trendcurors using echarts extension ([a7c6bbe](https://github.com/awslabs/iot-app-kit/commit/a7c6bbe064ae746f024b74d885721a70a06716a2))
* **react-components:** useAlarms hook ([7103db6](https://github.com/awslabs/iot-app-kit/commit/7103db640cd1531823a51fe3277691c869b581ed))
* **react-components:** useDescribeAssets and useDescribeAssetModels queries implemented ([bfb07e1](https://github.com/awslabs/iot-app-kit/commit/bfb07e16b1fceabdd676ebdb833c4d85baaafb0d))
* **react-components:** y axis and timestamp options ([bfe2520](https://github.com/awslabs/iot-app-kit/commit/bfe2520a731dc6ea24d0ad928084546d45ed8643))
* resource explorers ([f604b15](https://github.com/awslabs/iot-app-kit/commit/f604b15dd35e014e78e1f56fd666602767e6b5bd))
* **ResourceExplorer:** hide properties table when not needed to be displayed ([0fca5e9](https://github.com/awslabs/iot-app-kit/commit/0fca5e9089ac7af52e1d31b2143acb121cb7869b))
* show/hide aggregation and resolution in KPI ([aef1f14](https://github.com/awslabs/iot-app-kit/commit/aef1f146c6d4db03d759b76896d78e966b1ce1e6))
* **sitewise-alarms:** add useAlarmModels hook to fetch iot events alarm models in useAlarms ([c4c4986](https://github.com/awslabs/iot-app-kit/commit/c4c4986fde3fd65d7ca7e8b1f7a364fcc079ca10))
* support theming using cloudscape mechanism [#2667](https://github.com/awslabs/iot-app-kit/issues/2667) ([c342310](https://github.com/awslabs/iot-app-kit/commit/c3423101f4f60410d2168a2605fadeb3c6c2d5bc))
* updated KPI style (gated) ([31ea2f3](https://github.com/awslabs/iot-app-kit/commit/31ea2f371676be9b6412073772b9110b01c42786))
* updated the theming support for kpi and tc [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([d32a018](https://github.com/awslabs/iot-app-kit/commit/d32a0184518ef02222ef15359d49bccb68f6ee39))
* user selected dashboard refresh-rate ([1c1256d](https://github.com/awslabs/iot-app-kit/commit/1c1256da83c938037a47e930c127c2bf3bc14e90))
* widget tool box on mouse hover and selection state ([c80d42a](https://github.com/awslabs/iot-app-kit/commit/c80d42a3d10223d0d7edd5b3ee1b23c9ab613399))
* **widgets:** add name style settings for line/table + edit label in config panel ([f5e9b3f](https://github.com/awslabs/iot-app-kit/commit/f5e9b3fc99a176b3d9eb54ef0a387d171791aaf9))
* xy-plot y axis lable changes [#2378](https://github.com/awslabs/iot-app-kit/issues/2378) ([48389c3](https://github.com/awslabs/iot-app-kit/commit/48389c3e59305525b11b63233c3a79d4a8e3a78d))


### Bug Fixes

* add default settings to charts ([5917c83](https://github.com/awslabs/iot-app-kit/commit/5917c83674ffe67ced2bc7fe18c226460c115e80))
* add missing loading indication for widget values ([d90f9a6](https://github.com/awslabs/iot-app-kit/commit/d90f9a68e63b6280c1fb1187b8b34853fc2047ec))
* add signigicant digits to xy plot ([70a109e](https://github.com/awslabs/iot-app-kit/commit/70a109e8083b6729313f4f0dc362df0f3cf6ea62))
* add trailing zeros to decimal point rounding, fix rounding function ([9c13177](https://github.com/awslabs/iot-app-kit/commit/9c131779c5a3f5b2ce7c6d1239e54ed82bfbf572))
* better handling of light and dark mode w thresholds ([bd70051](https://github.com/awslabs/iot-app-kit/commit/bd70051944a9a21e21479f4793614f85a4716b2b))
* chart gesture icons overlap on mouse hover ([b5e5c0d](https://github.com/awslabs/iot-app-kit/commit/b5e5c0d6115ed8eb9d819a9b4ceef31c7b56db2b))
* **dashboard:** add descriptions to all RE tables ([f7b4f0c](https://github.com/awslabs/iot-app-kit/commit/f7b4f0c89d8b05be988acac54b8edf35ab3b7367))
* **dashboard:** add descriptions to all tables in RE ([c7aff00](https://github.com/awslabs/iot-app-kit/commit/c7aff00ea0d6175186317f06ca7eec4c550de7a0))
* **dashboard:** add timezone support for new RE ([2d4b5dd](https://github.com/awslabs/iot-app-kit/commit/2d4b5ddcbdefe4828168a7864bd679744e5a97eb))
* **dashboard:** adds resolution and aggregation to new proeprty in gauge widget ([5f5af30](https://github.com/awslabs/iot-app-kit/commit/5f5af3068defeb2a609e68ca0d29cc09f9960cfd))
* **dashboard:** decimal places fixes ([710a6ae](https://github.com/awslabs/iot-app-kit/commit/710a6aeee8e16fbf7f204d9214dbd8c86fce16e2))
* **dashboard:** fast follow to clean up messy code for table cell render ([649f75d](https://github.com/awslabs/iot-app-kit/commit/649f75d91bd4865d94db633ecd3fb865098fc1ff))
* **dashboard:** fix flaky test in dashboard ([6fe3285](https://github.com/awslabs/iot-app-kit/commit/6fe328510bfd4ed36a24935085aa41ac0c83dfa5))
* **dashboard:** label matches kpi name ([f675d11](https://github.com/awslabs/iot-app-kit/commit/f675d11857c0b0a3869d03d9c1339c405a85d11e))
* **dashboard:** re reflects significant digits + timezone support for unmodeled ([195be67](https://github.com/awslabs/iot-app-kit/commit/195be67fe0e5b7ef7b262491ff4fec574c62db8c))
* datastream not show unit if it's undefined [#2660](https://github.com/awslabs/iot-app-kit/issues/2660) ([7418773](https://github.com/awslabs/iot-app-kit/commit/7418773d7a39ef978ad3663e12fcf87082767f54))
* fix bugs on l4e widget ([17a4896](https://github.com/awslabs/iot-app-kit/commit/17a489631da778b13fcb194b8bd527874e9e2858))
* fix data-zoom behavior for base chart ([0c66a80](https://github.com/awslabs/iot-app-kit/commit/0c66a8016e2aa827ad3093c3ef89d6437e014d18))
* fix filtered data on zooms ([99e2f90](https://github.com/awslabs/iot-app-kit/commit/99e2f90aecdbaaa354e62e76b22c88a8530c1509))
* hidden and highlighted datastreams persist correctly ([5a85bb7](https://github.com/awslabs/iot-app-kit/commit/5a85bb7d40d07dce439a1bfa15550d8893089cbd))
* **imports:** move luxon dependency to right package ([31235da](https://github.com/awslabs/iot-app-kit/commit/31235da4b31e49ec0fc0f1ec21f649cf7af7e253))
* improved zoom and default values for y axis ([112e5c5](https://github.com/awslabs/iot-app-kit/commit/112e5c58d7e3478dec03dfbb2eb52ec315b4690d))
* internal pipeline has issues with lfs, reverting ([968f950](https://github.com/awslabs/iot-app-kit/commit/968f95005c51591d7cb99af323808fd232b8d4e9))
* l4e bug fixes ([a71673c](https://github.com/awslabs/iot-app-kit/commit/a71673c9fbc701a5e26ed8d8c9bda191bc9b9285))
* l4e code clean up ([ad19b6c](https://github.com/awslabs/iot-app-kit/commit/ad19b6c68c515182454d9132629f2736f5fa4988))
* l4e widget quick fixes ([286f724](https://github.com/awslabs/iot-app-kit/commit/286f7244ac501ffc877dd0e0d40d76e97ab98bda))
* make context menu appear on top of chart tooltip ([e1622c8](https://github.com/awslabs/iot-app-kit/commit/e1622c86bf4ead6856e7e1c9be1d5b8a1d6d4d61))
* migrated tooltip css to styled component for customizing theming options [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([515ad24](https://github.com/awslabs/iot-app-kit/commit/515ad2478abf20a9490ac725ee80ce7cc6ae111f))
* min max is sortable and not present on widget add ([7578a2e](https://github.com/awslabs/iot-app-kit/commit/7578a2e113221b2d3c00c01d2ede253e7ce07081))
* min/max values have correct significant digits ([50e183d](https://github.com/awslabs/iot-app-kit/commit/50e183d240ecf329362e10d21b9864d08cb525ee))
* move data quality widget on gauge to be closer to value ([d20b65f](https://github.com/awslabs/iot-app-kit/commit/d20b65f5704ffd5d56c4f402877be72d59adcadd))
* pass in refresh rate through the query instead of props ([b6df585](https://github.com/awslabs/iot-app-kit/commit/b6df5856b4407c74d4746d12a1781d11976f9948))
* **react components:** updating import for popper.js ([00c1707](https://github.com/awslabs/iot-app-kit/commit/00c17078163cc2ef48a8eb6e370652ca9823e8e2))
* react-component Chart story book is broken ([c273ad5](https://github.com/awslabs/iot-app-kit/commit/c273ad529a7d78f887a2b8c64b50f76bfc018fc2))
* **react-components:** add error state ([e16671f](https://github.com/awslabs/iot-app-kit/commit/e16671f11bbae4b768220b93b8cae0fe9ffee9c3))
* **react-components:** add snapshot tests ([178f0e7](https://github.com/awslabs/iot-app-kit/commit/178f0e7bbba316c711ff7c8fc18455cdccf939fb))
* **react-components:** add timezone to anomaly chart ([5379bd1](https://github.com/awslabs/iot-app-kit/commit/5379bd19d0d47e62f42a19230e9cf52e2a715d95))
* **react-components:** anomaly chart move loading state ([581a3c5](https://github.com/awslabs/iot-app-kit/commit/581a3c57734ba460ced0e32e232ed38583f232ba))
* **react-components:** anomaly chart timestamp padding ([b376bf4](https://github.com/awslabs/iot-app-kit/commit/b376bf4861f58bd5489c907d2ae72107a2178eb3))
* **react-components:** anomaly chart xaxis formatting ([740ee2a](https://github.com/awslabs/iot-app-kit/commit/740ee2a0ecbbe29c43a02fd04c0193935d79dd0e))
* **react-components:** anomaly widget error and empty states ([2d70b79](https://github.com/awslabs/iot-app-kit/commit/2d70b79467fe94621dd722bb95e7f52c21b477f2))
* **react-components:** center error ([12da428](https://github.com/awslabs/iot-app-kit/commit/12da428c354b999a8dc350e3811cd9f3a44ef782))
* **react-components:** clear ymin and ymax was getting emitted on every loop ([8609a48](https://github.com/awslabs/iot-app-kit/commit/8609a487a1b7ba9d4884750a6e6ee8819873a4b1))
* **react-components:** comment out flaky resource expl tests ([ca1039d](https://github.com/awslabs/iot-app-kit/commit/ca1039dc5c66cd30cc578651184463c889febd83))
* **react-components:** confining tootip to the chart area ([1bff986](https://github.com/awslabs/iot-app-kit/commit/1bff986999dc88a261caed22c3a77aab892219ad))
* **react-components:** do not use decimal places setting in y axis ([f9fbf74](https://github.com/awslabs/iot-app-kit/commit/f9fbf74311af528b89ad34333b36508eeb3d9ae5))
* **react-components:** ensure anomaly chart colors are in order ([3fd8d87](https://github.com/awslabs/iot-app-kit/commit/3fd8d87c2dee6615a7e22962c0d8dbd0cfff97c0))
* **react-components:** ensure chart uses initial passed in viewport ([0b17318](https://github.com/awslabs/iot-app-kit/commit/0b173182adb4180ca0065b4238549cd30a0af3d2))
* **react-components:** ensure enabled flag is never undefined for queries ([eb95ef4](https://github.com/awslabs/iot-app-kit/commit/eb95ef4e8f186f5f969e366321f01d9ab1ea1ab8))
* **react-components:** export anomaly chart ([30ae675](https://github.com/awslabs/iot-app-kit/commit/30ae675d92acd26d0414f6aa2da953bc0b37d5e7))
* **react-components:** filter out non anomalous data ([70f0a1c](https://github.com/awslabs/iot-app-kit/commit/70f0a1cdbada92336d9597c6e2a5f456896a15f5))
* **react-components:** fix chart flickering and bugginess in live mode ([3cc3b41](https://github.com/awslabs/iot-app-kit/commit/3cc3b41d59d5c799b750eb76d809007b30dfe2a8))
* **react-components:** fix error state display ([dead60a](https://github.com/awslabs/iot-app-kit/commit/dead60a175b236b4d74d1ca65a882821c5e49e26))
* **react-components:** fix get value history request ([a701ef4](https://github.com/awslabs/iot-app-kit/commit/a701ef48519807612715eaf2714f3eb6a306de05))
* **react-components:** fix global and chart store persistence ([83f1345](https://github.com/awslabs/iot-app-kit/commit/83f13452cbf350639cc2cc576d47a26138d58832))
* **react-components:** fix passed in viewport for anomaly widget ([f73fafc](https://github.com/awslabs/iot-app-kit/commit/f73fafcd5dfdf7238f69848f1808fbbb0b17f281))
* **react-components:** fix support for anomaly datasource outside of time sync ([d45cc6b](https://github.com/awslabs/iot-app-kit/commit/d45cc6b45adb67b8bc44b975a2a65c5942f0d746))
* **react-components:** fix the mouse events ([7c07a37](https://github.com/awslabs/iot-app-kit/commit/7c07a37eb5e8649a6d967c96b297659caad270a8))
* **react-components:** gauge properly shows property name again ([ddb65c6](https://github.com/awslabs/iot-app-kit/commit/ddb65c6304c473e01e0c7ae3e868eba98923574c))
* **react-components:** gauge thresholds ([8e3bec3](https://github.com/awslabs/iot-app-kit/commit/8e3bec3f6058c9c96ac42439c1b33b90a0d3912e))
* **react-components:** gauge thresholds with negative ranges ([2100221](https://github.com/awslabs/iot-app-kit/commit/21002216dc53230e95762ac3f46734ab90d8d1f6))
* **react-components:** gestures prop works ([6141c32](https://github.com/awslabs/iot-app-kit/commit/6141c3234095c658240e528207cdcbe3ff6e2d62))
* **react-components:** improve axis styling and add labels ([490058f](https://github.com/awslabs/iot-app-kit/commit/490058fbdb9ca102ca85abc2ff5770caafa52a71))
* **react-components:** improve gauge thresholds ([09b352f](https://github.com/awslabs/iot-app-kit/commit/09b352f9a255cf3fb04f8c0382a8013db0f1ae35))
* **react-components:** lowered min/max throttle to match TC throttle ([e972b1b](https://github.com/awslabs/iot-app-kit/commit/e972b1bfe89a25094b9884c38afd2ac7faa35c5c))
* **react-components:** make anomaly chart responsive ([4b31b8c](https://github.com/awslabs/iot-app-kit/commit/4b31b8cece18f1a1e1e91447c31ca79ec0b3867f))
* **react-components:** minor anomaly widget style changes ([19fc67a](https://github.com/awslabs/iot-app-kit/commit/19fc67a7768604d39c728ea4e1df8f318042d8b8))
* **react-components:** performance fixes for chart component ([403f2bf](https://github.com/awslabs/iot-app-kit/commit/403f2bf6beea75e1e1668e33c60a6149ef1b5436))
* **react-components:** refactor chart to use dataset ([b403789](https://github.com/awslabs/iot-app-kit/commit/b4037897cd4e7169958373bbf61d29c7454706ef))
* **react-components:** refactor legend table into modules ([f5eed70](https://github.com/awslabs/iot-app-kit/commit/f5eed7068b70ae9305782f07b08115294b26a3b7))
* **react-components:** remove data points after a threshold ([cd6a189](https://github.com/awslabs/iot-app-kit/commit/cd6a18913d2c0f3fb8b066dffbdf48f38d6955e4))
* **react-components:** remove flaky test in new RE ([9e15637](https://github.com/awslabs/iot-app-kit/commit/9e15637ecced497aec52a7189fc1e0adcf1de361))
* **react-components:** remove padded y axis code ([7e3d365](https://github.com/awslabs/iot-app-kit/commit/7e3d365d07dd4b074c6dda6d2934b7cb05fcde55))
* **react-components:** remove secondary selection state when using TCs or gestures ([3ba4e6a](https://github.com/awslabs/iot-app-kit/commit/3ba4e6a1cc0c2a7fd48eb130f3b72262fcd97ad5))
* **react-components:** skip flaky test in new RE ([e7928d3](https://github.com/awslabs/iot-app-kit/commit/e7928d329edef47871ed9978d820994ad2d76dcc))
* **react-components:** support nanoseconds for datapoints ([34d2dff](https://github.com/awslabs/iot-app-kit/commit/34d2dff489ff77d9eb9226443218b4c7cf725ff2))
* **react-components:** thresholds properly add and remove series ([bb8e451](https://github.com/awslabs/iot-app-kit/commit/bb8e451fbb4ed57a204b9936cf2e1c8853931c60))
* **react-components:** timestamp bar correct date ([2063935](https://github.com/awslabs/iot-app-kit/commit/20639352a433cea9abfceee439f7aa9c36db05b9))
* **react-components:** trendcursor hotkey indicates addition state ([c9d34e0](https://github.com/awslabs/iot-app-kit/commit/c9d34e0ef4ba891522336f05718d1808442949e3))
* **react-components:** update date-fns dependency ([1267b65](https://github.com/awslabs/iot-app-kit/commit/1267b6583034f17b14b8ca1de52125640bfdf3ea))
* **react-components:** updates for x-axis panning performance ([07a7624](https://github.com/awslabs/iot-app-kit/commit/07a7624d77962c38e7457abea1602082ebf2f5a3))
* **react-components:** viewport fixes ([b5846ed](https://github.com/awslabs/iot-app-kit/commit/b5846edf5c795c2bccdfee2a71d6b65f44dd56e5))
* **react-components:** zoom icons ([4da01df](https://github.com/awslabs/iot-app-kit/commit/4da01df378b1d3e2804c4802bd9250c7e180990f))
* refresh rate defined in dashboard and on query ([43cc5e4](https://github.com/awslabs/iot-app-kit/commit/43cc5e437543aed60663620655044cba9437a226))
* relative month test ([5c6e262](https://github.com/awslabs/iot-app-kit/commit/5c6e262b16b8a739c4a4d9e823453094242c67d9))
* remove duplicate constants and types ([45c155b](https://github.com/awslabs/iot-app-kit/commit/45c155b414a29c767e276060f1c60ce8401ea456))
* remove fetchMostRecentBeforeStart from status and kpi ([f9b3183](https://github.com/awslabs/iot-app-kit/commit/f9b3183ce5e52462f5120362a130b4aea6588671))
* removed tanstack table related code ([c8be85d](https://github.com/awslabs/iot-app-kit/commit/c8be85d919faac44441f4b00aa81ac7dbf215599))
* **resource-explorer:** only use alias to query if present ([ca35aee](https://github.com/awslabs/iot-app-kit/commit/ca35aee4cdd31c79302c282d5965911df6d0b6f5))
* sort and pagination colors ([4dd6bb9](https://github.com/awslabs/iot-app-kit/commit/4dd6bb94198cd4c40fb1bde2d0b350c97d4ec540))
* table resize button aria label ([1618d50](https://github.com/awslabs/iot-app-kit/commit/1618d50a713cb1be8b9a74899144ca92cd9ec5f1))
* **timeZone:** wrap timezone setState in useEffect ([6cd74a1](https://github.com/awslabs/iot-app-kit/commit/6cd74a1019499b8d6586cac0d26d605cdcd9c928))
* tooltip styled component issue is fixed ([5af6e22](https://github.com/awslabs/iot-app-kit/commit/5af6e2285cfc2e346e417e13f305f3a0a0c05439))
* update data quality UX to match mocks ([ed62846](https://github.com/awslabs/iot-app-kit/commit/ed628461c0dd582ae2f03f06b81c8d25aab3832c))
* update react-components public API for status and kpi widgets ([5e7bd49](https://github.com/awslabs/iot-app-kit/commit/5e7bd49fc6ae36fbdbd85e8c02bbb0b4ac082346))
* updated the new set of design tokens [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([7bdb8b0](https://github.com/awslabs/iot-app-kit/commit/7bdb8b08db1dcdc06153d71eff191a5e5a93a48b))
* updated theming support for buttons [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([1ffead0](https://github.com/awslabs/iot-app-kit/commit/1ffead0805048445b677f4cd63a31af7d5912095))
* updates for performance issues ([8863b9a](https://github.com/awslabs/iot-app-kit/commit/8863b9a80d7a8284aa4732ed25298d165a769ea9))
* use datastream id as legend table row key ([b4c11bc](https://github.com/awslabs/iot-app-kit/commit/b4c11bcd40400d4f7eae680d5ab521f00b638f64))
* yAxis label collides with yAxis name [#2471](https://github.com/awslabs/iot-app-kit/issues/2471) ([85ac6ac](https://github.com/awslabs/iot-app-kit/commit/85ac6ac4586d560e44cadedbffe5b1a187bd8bb8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 12.0.0
    * @iot-app-kit/core-util bumped from * to 12.0.0
    * @iot-app-kit/source-iottwinmaker bumped from * to 12.0.0
  * devDependencies
    * @iot-app-kit/core bumped from * to 12.0.0
    * @iot-app-kit/jest-config bumped from * to 12.0.0
    * @iot-app-kit/source-iotsitewise bumped from * to 12.0.0
    * @iot-app-kit/testing-util bumped from * to 12.0.0
    * @iot-app-kit/ts-config bumped from * to 12.0.0
    * eslint-config-iot-app-kit bumped from * to 12.0.0
</details>

<details><summary>scene-composer: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v11.0.0...scene-composer-v12.0.0) (2024-11-18)


###   BREAKING CHANGES

* **composer:** remove deprecated and internal interfaces from public

### Features

* adding docker setup for scene-composer ui tests ([3db0c9b](https://github.com/awslabs/iot-app-kit/commit/3db0c9bf11dcba40782241f3886cd79f1912f00f))
* **composer:** createDynamicScene util ([0b3b80c](https://github.com/awslabs/iot-app-kit/commit/0b3b80c0e62176c76411fe07718df7ef6849ef3a))
* **composer:** save scene level data to scene root entity ([6cabfb5](https://github.com/awslabs/iot-app-kit/commit/6cabfb55de10004b1f0314cb7be931ef3969b09e))
* **composer:** show delete confirmation modal for dynamic scene ([fdc9ef1](https://github.com/awslabs/iot-app-kit/commit/fdc9ef16df97d1528b3f28c96470e513bb9722a7))
* **composer:** support showing flash message ([da7281a](https://github.com/awslabs/iot-app-kit/commit/da7281a84e47325c56071850f6ea49a6eed73233))
* **composer:** update convert to attached scene component and load data from it ([86c92ce](https://github.com/awslabs/iot-app-kit/commit/86c92ce5e4361b563be799cc367c0da14a7a0c2c))
* **draco:** setup support for draco compressed files ([cc0d4e4](https://github.com/awslabs/iot-app-kit/commit/cc0d4e4a74232c856100a6781354342a669f5fd0))
* ds ga ([4a07ece](https://github.com/awslabs/iot-app-kit/commit/4a07ece255b189d5d9d9693abe75046d8c0458bd))
* ds ga ([dbc396b](https://github.com/awslabs/iot-app-kit/commit/dbc396b1ade912f7cfa7f25e591afcc6d0e84cf4))
* ds ga ([5b241d0](https://github.com/awslabs/iot-app-kit/commit/5b241d09196aa50a0c8798a7214a338ba7031ec4))
* ds ga ([b503fcf](https://github.com/awslabs/iot-app-kit/commit/b503fcf62367ceff847010c845adafa9154f7c6b))
* **dynamic scene:** reverse query structure for improved query speed ([c91995f](https://github.com/awslabs/iot-app-kit/commit/c91995f3c976b62c613708925693843bfbbada11))
* **DynamicScenes:** upgrade the AWS SDK and use RESET_VALUE for clearing property values ([3c03272](https://github.com/awslabs/iot-app-kit/commit/3c03272ca3d6b32acd6a7a1518ca088300933dcd))
* migrate from awsui to cloudscape ([37802b1](https://github.com/awslabs/iot-app-kit/commit/37802b18f12844dba6876cd7d94c50420cbece66))
* **scene composer:** adding data-testid to improve e2e test ([1e5ab86](https://github.com/awslabs/iot-app-kit/commit/1e5ab863f89fcdf66aa7b4c0e3b0f5c77367411e))
* **scene composer:** setting up 3D test harness ([df62eef](https://github.com/awslabs/iot-app-kit/commit/df62eefd048a66f327070bc8c90b4c9b964de26e))
* **scene-composer:** enable accelerated raycasting for 3D Tiles ([84d2ce4](https://github.com/awslabs/iot-app-kit/commit/84d2ce4783c74a3792c11009f99cfac888cd848d))
* **scene:** add asset type filter option for browser callback ([f65d4f0](https://github.com/awslabs/iot-app-kit/commit/f65d4f0d5429dfa25b90208d924bfe3c3e3640df))
* **scene:** alphabetize camera drop down ([960f195](https://github.com/awslabs/iot-app-kit/commit/960f195e229736bda9e73c17ecda93fa047a56c6))
* **scene:** move add ground plane to settings ([3b0c59b](https://github.com/awslabs/iot-app-kit/commit/3b0c59b13243892a657f8ed975448babe7a6caec))
* **scene:** textures for backgrounds and planes ([0b2104a](https://github.com/awslabs/iot-app-kit/commit/0b2104ae299f899b88ac4d77696b075793ceed1d))
* **Tiles3D:** add Tiles3D AssetType and evaluate model type when adding a 3D model to the scene ([eec0f50](https://github.com/awslabs/iot-app-kit/commit/eec0f508caa4b1f6b2c7a84baa4f45bf4dc7195b))


### Bug Fixes

* **composer:** cannot delete scene node of a child and then its parent ([a2e140a](https://github.com/awslabs/iot-app-kit/commit/a2e140ab0ef05975e2ec1d8e36a4d68ad9087911))
* **composer:** refactor scene modal rendering ([1d797b1](https://github.com/awslabs/iot-app-kit/commit/1d797b1a6aeab60e45f8e11daf8cd97b9b21033b))
* **composer:** remove deprecated and internal interfaces from public ([07e82b4](https://github.com/awslabs/iot-app-kit/commit/07e82b42963931ddce95362f4a6cca9add6a1423))
* **composer:** trigger onSceneLoaded after dynamic scene is loaded ([4c9453a](https://github.com/awslabs/iot-app-kit/commit/4c9453a12211a878a850d71eee7cb8bd3d4a5fe3))
* **composer:** update property string length limit to 2048 ([a3cb800](https://github.com/awslabs/iot-app-kit/commit/a3cb8009d8547351449bac7c121e67d66971a708))
* **draco:** modifying check to ensure globalSettings are ready for evaluation ([80c3295](https://github.com/awslabs/iot-app-kit/commit/80c3295f96609885a043c4cb01d314447a376485))
* **draco:** updating global settings ([9010137](https://github.com/awslabs/iot-app-kit/commit/90101378170004df2de7de511bb0be458ef45842))
* **dynamicscene:** converting empty scene locks ui ([cc8efff](https://github.com/awslabs/iot-app-kit/commit/cc8efffb80eeb17a64b1b8f021f42b7e5f52570f))
* **DynamicScenes:** copySceneNodes should take the new sceneId as an argument ([37f8251](https://github.com/awslabs/iot-app-kit/commit/37f8251db97b6ee6320e9cdf810c1e317717e7ac))
* **DynamicScenes:** fix bug to render empty scenes ([2c25827](https://github.com/awslabs/iot-app-kit/commit/2c25827f4fc2b9bc745eacd81e9b7d875fb3a086))
* **DynamicScenes:** revert detect dynamic scenes missing their root entity ([8593b33](https://github.com/awslabs/iot-app-kit/commit/8593b3304faf9933f9050400201fc0a1c6aae0ef))
* internal pipeline has issues with lfs, reverting ([968f950](https://github.com/awslabs/iot-app-kit/commit/968f95005c51591d7cb99af323808fd232b8d4e9))
* **scene composer:** correcting state logic for tag settings ([f149ac9](https://github.com/awslabs/iot-app-kit/commit/f149ac94f5f78a6798dbefa95435134989859f68))
* **scene composer:** implemented react-hooks linter & converted useStore to accessStore ([d95f684](https://github.com/awslabs/iot-app-kit/commit/d95f684ad6c14405d8c9c1f5b2ac84cb5f3355e1))
* **scene hierarchy:** cleaning up scene hierarchy ui ([b1a11f3](https://github.com/awslabs/iot-app-kit/commit/b1a11f361af37c8cd05db79d964ef1642860e0f1))
* **scene-composer:** 3D model selection broken on first click ([7ee722a](https://github.com/awslabs/iot-app-kit/commit/7ee722ab3cf1aa4a353e7b05c1a9b53f3ac00c88))
* **scene-composer:** fix scene hierarchy in viewer mode ([c8c70fd](https://github.com/awslabs/iot-app-kit/commit/c8c70fdac04d8aab12f5a6a3f19303cb6754d083))
* **scene-composer:** fix sub-model selection ([0a11b9a](https://github.com/awslabs/iot-app-kit/commit/0a11b9a391767fea2d255509ac9377889e812a5c))
* **scene-composer:** reverting zustand upgrade due to Grafana issues related to zustand, react, r3f ([cfbca24](https://github.com/awslabs/iot-app-kit/commit/cfbca24d51de3fb113f79ab0dce2cc96264a8c82))
* **scene:** fix dynamic scene entity binding reload on query ([d8a1b89](https://github.com/awslabs/iot-app-kit/commit/d8a1b89c189dc7694b83b0819199b54711a34109))
* **scene:** fix possible undefined query state ([0511c34](https://github.com/awslabs/iot-app-kit/commit/0511c3429d4c6426851b0dfae91a03d4e3982800))
* **scene:** fix regression in updateSceneNode for reparenting nodes ([016e9f5](https://github.com/awslabs/iot-app-kit/commit/016e9f59ff755ff8d1522117d159df7246aebe22))
* **scene:** fix Scene Hierarchy Tree item for node with no components ([e341fa5](https://github.com/awslabs/iot-app-kit/commit/e341fa511cfec0630ec13b0dba22981b7307c6be))
* **scene:** handle bad texture files gracefully and toggle opacity on selection ([dca5b10](https://github.com/awslabs/iot-app-kit/commit/dca5b10404d9dd1175e16284d9733abe38590175))
* **scene:** round ground plane opacity to whole percent ([760aa8c](https://github.com/awslabs/iot-app-kit/commit/760aa8cac2511717e0fa1f9b1974125ee97c569a))
* **scene:** update dependency for selection change use effect ([623b55b](https://github.com/awslabs/iot-app-kit/commit/623b55b016890a3e537fdae0b1d39ec665603834))
* **scene:** validation scene json on deserialize ([3f2ad73](https://github.com/awslabs/iot-app-kit/commit/3f2ad737c7c85a1d3e14e2fb5a74d7213780e581))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 12.0.0
    * @iot-app-kit/react-components bumped from * to 12.0.0
    * @iot-app-kit/source-iottwinmaker bumped from * to 12.0.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from * to 12.0.0
</details>

<details><summary>source-iotsitewise: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/source-iotsitewise-v11.0.0...source-iotsitewise-v12.0.0) (2024-11-18)


### Features

* add a widget level loading indicator for x-y plot ([9be5617](https://github.com/awslabs/iot-app-kit/commit/9be5617aabe7a1edf88876406aeb1e83f174a288))
* add alarm data source query ([32fe5c7](https://github.com/awslabs/iot-app-kit/commit/32fe5c706fba1c483b98d7baa1d1045eb6cf2ac3))
* add anomaly query ([3c11512](https://github.com/awslabs/iot-app-kit/commit/3c115121db6fc8248bcd6b36989f6ebea3212ba7))
* add dataquality attribute to data-point ([5fb23de](https://github.com/awslabs/iot-app-kit/commit/5fb23de5473fa4f9c2377330b598711209514620))
* async fetchTimeSeriesData ([2b776cc](https://github.com/awslabs/iot-app-kit/commit/2b776ccf73a538abfbcf4a0ba175dca7c2c4aa0c))
* **dashboard:** use new RE components to update dashboard RE for modeled and unmodeled data ([d7db11e](https://github.com/awslabs/iot-app-kit/commit/d7db11ee7c16dd012b7ced86dc52cde9a483e24e))
* display assetname conditionally in legend [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([c4c443f](https://github.com/awslabs/iot-app-kit/commit/c4c443fab77d6e337d32fbecebb308c7f339fab5))
* fetchTimeSeriesData ([1c65191](https://github.com/awslabs/iot-app-kit/commit/1c65191654c726b66cf1e0bcc2df83d620f6d4a5))
* introduce edgeMode in dashboard components ([c168fb4](https://github.com/awslabs/iot-app-kit/commit/c168fb45b68252e25385c38bc20752ce1ffcd4e8))
* introduce edgeMode in source-iotsitewise ([3106695](https://github.com/awslabs/iot-app-kit/commit/31066951a245712a0b7aa94fd3307813390ab8e4))


### Bug Fixes

* add request settings to fetchTimeSeriesData ([d7cbd9d](https://github.com/awslabs/iot-app-kit/commit/d7cbd9d8bb5a5f56804a7ebce2c87e944bcb6f2b))
* aws clients marked as peer dependencies ([d944df4](https://github.com/awslabs/iot-app-kit/commit/d944df4113822671b84737b98dee261cab692421))
* aws clients marked as peer dependencies ([0272167](https://github.com/awslabs/iot-app-kit/commit/027216707ec5fdd77390ef1de132ef744f4f17b8))
* grab asset composite property correctly ([1c57017](https://github.com/awslabs/iot-app-kit/commit/1c57017f3b3c78c62fc3a3cdfc6f4fa01a09f745))
* pass in refresh rate through the query instead of props ([b6df585](https://github.com/awslabs/iot-app-kit/commit/b6df5856b4407c74d4746d12a1781d11976f9948))
* prevent fetching ([85a7b35](https://github.com/awslabs/iot-app-kit/commit/85a7b35f9b5303fe037de5636a75827335ffdaba))
* refresh rate defined in dashboard and on query ([43cc5e4](https://github.com/awslabs/iot-app-kit/commit/43cc5e437543aed60663620655044cba9437a226))
* source-iotsitewise batch API options ([6e4d430](https://github.com/awslabs/iot-app-kit/commit/6e4d430a033bbd54eb403a96f04ecb23a7909e36))


### Performance Improvements

* improve raw batching ([263282d](https://github.com/awslabs/iot-app-kit/commit/263282d751d334745ddc3079d6a8959b5cf1e6d9))
* increase batch entry and result size ([cf5e978](https://github.com/awslabs/iot-app-kit/commit/cf5e9785418c801e89cc2afa2a626e16547a8a7c))
* increase batch size ([1fefe81](https://github.com/awslabs/iot-app-kit/commit/1fefe81cecf8bbeffebb5e89b73cab3494beba21))
* prevent duplication of simultaneous data stream metadata requests ([bfbe7b2](https://github.com/awslabs/iot-app-kit/commit/bfbe7b23c968e367423cf8a81504e2773e5460bc))


### Reverts

* "perf: increase batch size" ([636a539](https://github.com/awslabs/iot-app-kit/commit/636a539fcba8c62871b1b60b117ab2881124ac81))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 12.0.0
    * @iot-app-kit/core-util bumped from * to 12.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from * to 12.0.0
    * @iot-app-kit/testing-util bumped from * to 12.0.0
    * @iot-app-kit/ts-config bumped from * to 12.0.0
    * eslint-config-iot-app-kit bumped from * to 12.0.0
</details>

<details><summary>source-iottwinmaker: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/source-iottwinmaker-v11.0.0...source-iottwinmaker-v12.0.0) (2024-11-18)


### Features

* add a widget level loading indicator for x-y plot ([9be5617](https://github.com/awslabs/iot-app-kit/commit/9be5617aabe7a1edf88876406aeb1e83f174a288))
* **composer:** createDynamicScene util ([0b3b80c](https://github.com/awslabs/iot-app-kit/commit/0b3b80c0e62176c76411fe07718df7ef6849ef3a))
* **composer:** support showing flash message ([da7281a](https://github.com/awslabs/iot-app-kit/commit/da7281a84e47325c56071850f6ea49a6eed73233))
* **composer:** update convert to attached scene component and load data from it ([86c92ce](https://github.com/awslabs/iot-app-kit/commit/86c92ce5e4361b563be799cc367c0da14a7a0c2c))
* **DynamicScenes:** upgrade the AWS SDK and use RESET_VALUE for clearing property values ([3c03272](https://github.com/awslabs/iot-app-kit/commit/3c03272ca3d6b32acd6a7a1518ca088300933dcd))


### Bug Fixes

* pass in refresh rate through the query instead of props ([b6df585](https://github.com/awslabs/iot-app-kit/commit/b6df5856b4407c74d4746d12a1781d11976f9948))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 12.0.0
  * devDependencies
    * @iot-app-kit/jest-config bumped from * to 12.0.0
    * @iot-app-kit/ts-config bumped from * to 12.0.0
    * eslint-config-iot-app-kit bumped from * to 12.0.0
</details>

<details><summary>testing-util: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/testing-util-v11.0.0...testing-util-v12.0.0) (2024-11-18)


### Features

* add gauge component in doc site package ([17a02f5](https://github.com/awslabs/iot-app-kit/commit/17a02f54ac811ab384aa6b8ad2dd4f61e0cc1514))


### Bug Fixes

* pass in refresh rate through the query instead of props ([b6df585](https://github.com/awslabs/iot-app-kit/commit/b6df5856b4407c74d4746d12a1781d11976f9948))
* updated the viewport settings for dynamic input [#2565](https://github.com/awslabs/iot-app-kit/issues/2565) ([0e31d25](https://github.com/awslabs/iot-app-kit/commit/0e31d25b9a7001a6216057681ac5aa7b6ec327ed))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 12.0.0
  * devDependencies
    * @iot-app-kit/ts-config bumped from * to 12.0.0
    * eslint-config-iot-app-kit bumped from * to 12.0.0
</details>

<details><summary>tools-iottwinmaker: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/tools-iottwinmaker-v11.0.0...tools-iottwinmaker-v12.0.0) (2024-11-18)


### Features

* **DynamicScenes:** upgrade the AWS SDK and use RESET_VALUE for clearing property values ([3c03272](https://github.com/awslabs/iot-app-kit/commit/3c03272ca3d6b32acd6a7a1518ca088300933dcd))
* **tmdt:** support endpoint-url parameter and respect S3 bucket name character limit ([b4ea8fb](https://github.com/awslabs/iot-app-kit/commit/b4ea8fbdf3970abfedee4e2465572e20f8f0a707))


### Bug Fixes

* **bucket policy:** switch from ACL to bucket policy for access logs ([2d17a0f](https://github.com/awslabs/iot-app-kit/commit/2d17a0fa53057ddd0a9e5b46ab2b0de6b9163ac2))
* **tmdt:** stream 3D assets from S3 on init ([ee0e11b](https://github.com/awslabs/iot-app-kit/commit/ee0e11b30c331f7ec341e8cf58f155e41011a0bd))
</details>

<details><summary>ts-config: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/ts-config-v11.0.0...ts-config-v12.0.0) (2024-11-18)


### Miscellaneous Chores

* **ts-config:** Synchronize iot-app-kit versions
</details>

<details><summary>eslint-config: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/eslint-config-v11.0.0...eslint-config-v12.0.0) (2024-11-18)


### Miscellaneous Chores

* **eslint-config:** Synchronize iot-app-kit versions
</details>

<details><summary>root: 12.0.0</summary>

## [12.0.0](https://github.com/awslabs/iot-app-kit/compare/root-v11.0.0...root-v12.0.0) (2024-11-18)


###   BREAKING CHANGES

* **composer:** remove deprecated and internal interfaces from public

### Features

* add a widget level loading indicator for x-y plot ([9be5617](https://github.com/awslabs/iot-app-kit/commit/9be5617aabe7a1edf88876406aeb1e83f174a288))
* add alarm data source query ([32fe5c7](https://github.com/awslabs/iot-app-kit/commit/32fe5c706fba1c483b98d7baa1d1045eb6cf2ac3))
* add anomaly query ([3c11512](https://github.com/awslabs/iot-app-kit/commit/3c115121db6fc8248bcd6b36989f6ebea3212ba7))
* add arrow to asset name [#2551](https://github.com/awslabs/iot-app-kit/issues/2551) ([bd12bea](https://github.com/awslabs/iot-app-kit/commit/bd12bea402358d9a641740cb17c8bc9a04e215cc))
* add CSV download button ([d89b1f8](https://github.com/awslabs/iot-app-kit/commit/d89b1f880491615c023ea84d53b0c843d52315b4))
* add data quality to kpi and status ([7248004](https://github.com/awslabs/iot-app-kit/commit/724800417bc8c74f518d6a39044c815848ef431f))
* add dataquality attribute to data-point ([5fb23de](https://github.com/awslabs/iot-app-kit/commit/5fb23de5473fa4f9c2377330b598711209514620))
* add e2e gauge tests to dashboard tests ([188f9d2](https://github.com/awslabs/iot-app-kit/commit/188f9d2cf84d96e5a2bc77803bf8160174fba2b7))
* add gauge component in doc site package ([17a02f5](https://github.com/awslabs/iot-app-kit/commit/17a02f54ac811ab384aa6b8ad2dd4f61e0cc1514))
* add step chart to l4e ([0983438](https://github.com/awslabs/iot-app-kit/commit/0983438c28ad7603e689697b0bd68cc10ce6fb50))
* add threshold settings to KPI ([2fa0429](https://github.com/awslabs/iot-app-kit/commit/2fa0429b6262092b4b3c86c21b8808b90e2d49fe))
* add timezone converter util ([e5d59c4](https://github.com/awslabs/iot-app-kit/commit/e5d59c43803a03413e77556f6ca4179b18ecb3d7))
* add timezone docs ([8995f92](https://github.com/awslabs/iot-app-kit/commit/8995f92959132da6feaace768206070a8c8aae6d))
* added a label time range for viewport picker in dashboard header [#2559](https://github.com/awslabs/iot-app-kit/issues/2559) ([743cb80](https://github.com/awslabs/iot-app-kit/commit/743cb80ec36d116d6ef25e97ec54f2238ddb2ea1))
* added accessible labels to different toolbar container [#2510](https://github.com/awslabs/iot-app-kit/issues/2510) ([ce5af6f](https://github.com/awslabs/iot-app-kit/commit/ce5af6fbc6e6b887f3fade9395bcbf54da386a88))
* added data quality icon and text next to value in table [#2664](https://github.com/awslabs/iot-app-kit/issues/2664) ([91cd12f](https://github.com/awslabs/iot-app-kit/commit/91cd12f9e73fa5c77ab8e7209376116f4307526b))
* added support for border theming options [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([66e6680](https://github.com/awslabs/iot-app-kit/commit/66e6680fbea3f005aba7239c3c47bf13e5184462))
* added validation for decimal places input and moved in section format data [#2599](https://github.com/awslabs/iot-app-kit/issues/2599) ([1cd97c1](https://github.com/awslabs/iot-app-kit/commit/1cd97c14f569df5867e8865151e76a457c8af52d))
* added viewport timestamps in xy plot [#2470](https://github.com/awslabs/iot-app-kit/issues/2470) ([46c1d24](https://github.com/awslabs/iot-app-kit/commit/46c1d24b99ff2ca9fb990ceed341ad6820c21f01))
* added visible labels operator and value for threshold controls for accessibility [#2512](https://github.com/awslabs/iot-app-kit/issues/2512) [#2513](https://github.com/awslabs/iot-app-kit/issues/2513) ([06b5ee5](https://github.com/awslabs/iot-app-kit/commit/06b5ee58a9a823bacb29c60c546b803b89f1cb97))
* adding docker setup for scene-composer ui tests ([3db0c9b](https://github.com/awslabs/iot-app-kit/commit/3db0c9bf11dcba40782241f3886cd79f1912f00f))
* adding feature toggle system implementation ([6df3ea0](https://github.com/awslabs/iot-app-kit/commit/6df3ea053ef27a104424d8cb2b12eb0271d4b2f3))
* adding timezone support to dashboard/widgets ([6435b90](https://github.com/awslabs/iot-app-kit/commit/6435b90d93246e319b939b7c316c6ffbea12ef8d))
* **anomaly-chart:** added `gestures` enablement option ([4c2402c](https://github.com/awslabs/iot-app-kit/commit/4c2402c44a5c3538fdc60fe8210b626670073479))
* async fetchTimeSeriesData ([2b776cc](https://github.com/awslabs/iot-app-kit/commit/2b776ccf73a538abfbcf4a0ba175dca7c2c4aa0c))
* async listAssetPropertiesDescription ([6632db5](https://github.com/awslabs/iot-app-kit/commit/6632db5837e75d8786cb2c2150986d57f4e6ad39))
* automatically selecting previously selected workspace or first workspace from options [#2384](https://github.com/awslabs/iot-app-kit/issues/2384) ([c1424a2](https://github.com/awslabs/iot-app-kit/commit/c1424a2b2ac7d7034c748cb221e565a8967c3da8))
* changed outline for config panel text style buttons on focus initiated by tab [#2547](https://github.com/awslabs/iot-app-kit/issues/2547) ([e94fee7](https://github.com/awslabs/iot-app-kit/commit/e94fee72e095161258d01cbe9777aeca833f5c90))
* changed ui experience of chart legend based on legend position [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([de1f147](https://github.com/awslabs/iot-app-kit/commit/de1f14772b614f67156a34ac64300111a6c55126))
* chart legend support px rem em % unit type ([4e023e6](https://github.com/awslabs/iot-app-kit/commit/4e023e6c4a735189e2db04de886555a0199087b2))
* chat legend enhancement [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([b1ca8ae](https://github.com/awslabs/iot-app-kit/commit/b1ca8aeda126f09f371e23133fa600d5b56c9b21))
* **composer:** createDynamicScene util ([0b3b80c](https://github.com/awslabs/iot-app-kit/commit/0b3b80c0e62176c76411fe07718df7ef6849ef3a))
* **composer:** save scene level data to scene root entity ([6cabfb5](https://github.com/awslabs/iot-app-kit/commit/6cabfb55de10004b1f0314cb7be931ef3969b09e))
* **composer:** show delete confirmation modal for dynamic scene ([fdc9ef1](https://github.com/awslabs/iot-app-kit/commit/fdc9ef16df97d1528b3f28c96470e513bb9722a7))
* **composer:** support showing flash message ([da7281a](https://github.com/awslabs/iot-app-kit/commit/da7281a84e47325c56071850f6ea49a6eed73233))
* **composer:** update convert to attached scene component and load data from it ([86c92ce](https://github.com/awslabs/iot-app-kit/commit/86c92ce5e4361b563be799cc367c0da14a7a0c2c))
* conditionally display latest value in legend table  [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([d3feb29](https://github.com/awslabs/iot-app-kit/commit/d3feb2920f3c63b0b2ce9580fc07a86475fc1ff1))
* customize gauge in dashboard config ([8af089e](https://github.com/awslabs/iot-app-kit/commit/8af089e94a2c11cab1c9473d384ed241da7f6461))
* **dashboard:** add colors to trendcursors ([a890c7d](https://github.com/awslabs/iot-app-kit/commit/a890c7db39df1a836312ac4050c41e2f4fdd9f4a))
* **dashboard:** add logging for custom y-axis ([582fddf](https://github.com/awslabs/iot-app-kit/commit/582fddfa3ccca07e2ffd2b51047d989685a5940c))
* **dashboard:** add logging for query editor ([d115606](https://github.com/awslabs/iot-app-kit/commit/d115606d2e974e1fcdd9111d6c470b97589280cc))
* **dashboard:** add metrics for query editor usage ([e8ac4f9](https://github.com/awslabs/iot-app-kit/commit/e8ac4f9c7a47d9f776ef057cb2c5cf13628b78e9))
* **dashboard:** add new RE components to dynamic assets tab ([c588848](https://github.com/awslabs/iot-app-kit/commit/c5888485c3205c7ee572ec01d6f0b34d1789da23))
* **dashboard:** add on configuration change ([e386353](https://github.com/awslabs/iot-app-kit/commit/e386353f8bc1888e3cc1c9a21b24e9012ae8682a))
* **dashboard:** adding new property panel layout ([617c77c](https://github.com/awslabs/iot-app-kit/commit/617c77c06a5496641cc75df963a12a1a8dda7be6))
* **dashboard:** adding new property panel layout ([39a8271](https://github.com/awslabs/iot-app-kit/commit/39a82711f97cf14494bd0ff6e74338bb41b8ff18))
* **dashboard:** default viewport setting ([0c3f3ef](https://github.com/awslabs/iot-app-kit/commit/0c3f3efa3a48be537d0eed0e6a1a02ecaa7c1f03))
* **dashboard:** make component library keyboard accessible ([164b0ce](https://github.com/awslabs/iot-app-kit/commit/164b0ce2a2ec6b5610d9a5c346cecda914d3bdea))
* **dashboard:** migration logic now supports avoiding collisions that lead to overlap ([c64e184](https://github.com/awslabs/iot-app-kit/commit/c64e184ad883c0515c3f6106e6e58f27b0ff69d3))
* **dashboard:** move dashboard migration utility to app-kit ([99a9aa8](https://github.com/awslabs/iot-app-kit/commit/99a9aa81ea6feb20364fd6305f0e36627c1ae163))
* **dashboard:** support custom toolbar ([c5374b5](https://github.com/awslabs/iot-app-kit/commit/c5374b5f8f3a4b399f83cc5c9a3adad604a64bff))
* **dashboard:** use new RE components to update dashboard RE for modeled and unmodeled data ([d7db11e](https://github.com/awslabs/iot-app-kit/commit/d7db11ee7c16dd012b7ced86dc52cde9a483e24e))
* display assetname conditionally in legend [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([c4c443f](https://github.com/awslabs/iot-app-kit/commit/c4c443fab77d6e337d32fbecebb308c7f339fab5))
* display legend unit conditionally  [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([9f6440e](https://github.com/awslabs/iot-app-kit/commit/9f6440e9e06c9040a6be46eab3a9141ad02a0509))
* **doc-site:** adding doc-site ([743ca50](https://github.com/awslabs/iot-app-kit/commit/743ca509649a31f11334fbbd2785cce1dbb4b735))
* **draco:** setup support for draco compressed files ([cc0d4e4](https://github.com/awslabs/iot-app-kit/commit/cc0d4e4a74232c856100a6781354342a669f5fd0))
* ds ga ([4a07ece](https://github.com/awslabs/iot-app-kit/commit/4a07ece255b189d5d9d9693abe75046d8c0458bd))
* ds ga ([dbc396b](https://github.com/awslabs/iot-app-kit/commit/dbc396b1ade912f7cfa7f25e591afcc6d0e84cf4))
* ds ga ([5b241d0](https://github.com/awslabs/iot-app-kit/commit/5b241d09196aa50a0c8798a7214a338ba7031ec4))
* ds ga ([b503fcf](https://github.com/awslabs/iot-app-kit/commit/b503fcf62367ceff847010c845adafa9154f7c6b))
* **dynamic scene:** reverse query structure for improved query speed ([c91995f](https://github.com/awslabs/iot-app-kit/commit/c91995f3c976b62c613708925693843bfbbada11))
* **DynamicScenes:** upgrade the AWS SDK and use RESET_VALUE for clearing property values ([3c03272](https://github.com/awslabs/iot-app-kit/commit/3c03272ca3d6b32acd6a7a1518ca088300933dcd))
* enable dynamic assets on edge mode ([5b6a9e8](https://github.com/awslabs/iot-app-kit/commit/5b6a9e8d43b45ec0c3d4e60491557542f969ef58))
* fetchTimeSeriesData ([1c65191](https://github.com/awslabs/iot-app-kit/commit/1c65191654c726b66cf1e0bcc2df83d620f6d4a5))
* first click on paginate timeline should move backward from current time duration ([5f9aa42](https://github.com/awslabs/iot-app-kit/commit/5f9aa42aef52d1bade596d0b8cfa1d58d51cce52))
* fix tabs on config panel present that are unusable [#2308](https://github.com/awslabs/iot-app-kit/issues/2308) ([4d3b6d5](https://github.com/awslabs/iot-app-kit/commit/4d3b6d5fea6b271bfdbce13679b0fa4b4d0cdf60))
* gauge widget to dashboard ([17cde64](https://github.com/awslabs/iot-app-kit/commit/17cde64259ab6b69beec2f2de4eaca9750504a5c))
* guage component data quality and error text ([2dca188](https://github.com/awslabs/iot-app-kit/commit/2dca1889462a6002980b105ae5338265c187b502))
* guage component initail commit ([305657a](https://github.com/awslabs/iot-app-kit/commit/305657a7aa761883da7a9839d0ae0a3914751a51))
* introduce edgeMode in dashboard components ([c168fb4](https://github.com/awslabs/iot-app-kit/commit/c168fb45b68252e25385c38bc20752ce1ffcd4e8))
* introduce edgeMode in source-iotsitewise ([3106695](https://github.com/awslabs/iot-app-kit/commit/31066951a245712a0b7aa94fd3307813390ab8e4))
* kpi and status gated config panel ([1f56b4f](https://github.com/awslabs/iot-app-kit/commit/1f56b4f2e7212ddfcc216fb778e0d4db57309ab2))
* l4e table ([5bd6898](https://github.com/awslabs/iot-app-kit/commit/5bd68983268d00ff60bf0434e5b810e52254c16c))
* l4e timeline (mock data only) ([829496c](https://github.com/awslabs/iot-app-kit/commit/829496cd0f51fb4131b5a081c8ecc7d17763b5be))
* legend resize ([792b617](https://github.com/awslabs/iot-app-kit/commit/792b6170cc19402f3c49fbd60e4a07dc0890c434))
* legend table is implemeted using tanstack table ([c92533a](https://github.com/awslabs/iot-app-kit/commit/c92533a342c95618d6dcf7d2a13bdad204bb01de))
* lint accessibility ([0db36ef](https://github.com/awslabs/iot-app-kit/commit/0db36ef6a07fe5e0709d17081dffa7d23669e2fe))
* made widget tooltip dismissable by pressing escape key [#2511](https://github.com/awslabs/iot-app-kit/issues/2511) ([87c81b5](https://github.com/awslabs/iot-app-kit/commit/87c81b5d2302c2656a9dbeacea02bbae9a334ede))
* migrate from awsui to cloudscape ([37802b1](https://github.com/awslabs/iot-app-kit/commit/37802b18f12844dba6876cd7d94c50420cbece66))
* new design status (gated) ([69d6c97](https://github.com/awslabs/iot-app-kit/commit/69d6c979d1baefd4fd486cf0d1402b7357e8506b))
* new KPI and update tests ([328e41a](https://github.com/awslabs/iot-app-kit/commit/328e41ae6f1b25c743a16f03d966a5b97408455a))
* onViewportChange and currentViewport ([d63c9e3](https://github.com/awslabs/iot-app-kit/commit/d63c9e3a416e78a78b3a453755be39a6879eb07c))
* **react-components:** add arrow datasource ([efb0d6d](https://github.com/awslabs/iot-app-kit/commit/efb0d6d01549011e57400c6b48033264a7e122c9))
* **react-components:** add auto resolution and batching ([073029f](https://github.com/awslabs/iot-app-kit/commit/073029f4312c988bf099251284bf63d9515e01fd))
* **react-components:** add axis option to anomaly widget ([d0733e1](https://github.com/awslabs/iot-app-kit/commit/d0733e12863f4ee2db1e29576c8ea6b1d5964f62))
* **react-components:** add data quality to xy-plot ([ed18e0d](https://github.com/awslabs/iot-app-kit/commit/ed18e0d891035803dfc0cc646371ae1e20914d2a))
* **react-components:** add hook for get asset property value history ([c708b4a](https://github.com/awslabs/iot-app-kit/commit/c708b4a6c2c3e9d6e843829692a2046c00ee6950))
* **react-components:** add hook for latest asset property value ([ce9ec7c](https://github.com/awslabs/iot-app-kit/commit/ce9ec7c714e6c600da59af8f4bffaf210f0041c0))
* **react-components:** add intl ([c7c30c3](https://github.com/awslabs/iot-app-kit/commit/c7c30c3f969c71de6856d98d59e1043a6c785a45))
* **react-components:** add l4e datasource ([748f8c1](https://github.com/awslabs/iot-app-kit/commit/748f8c17d56bbef0f2190fde38b5717c29d1d942))
* **react-components:** add l4e queries ([328da8e](https://github.com/awslabs/iot-app-kit/commit/328da8ed9341c68c8c0a3a6b672170f1fa8eeb37))
* **react-components:** add max column to legend ([322c20f](https://github.com/awslabs/iot-app-kit/commit/322c20f0d438ecb45ee02fae186f6a198963c5b6))
* **react-components:** add min column to legend ([69ba923](https://github.com/awslabs/iot-app-kit/commit/69ba92324da42770e267c9a0bce717ebf1ca0dbf))
* **react-components:** add useLatestAlarmPropertyValue hook to fetch alarm prop vals in useAlarms ([18aa854](https://github.com/awslabs/iot-app-kit/commit/18aa8548bbc9aa9d4343a1d85b3cefdb798e1b25))
* **react-components:** adding a fps display ([48cd9ef](https://github.com/awslabs/iot-app-kit/commit/48cd9efa3e5823086f0b7695886e934cc9303216))
* **react-components:** calculate min/max and store value in store for chart to consume ([41b8551](https://github.com/awslabs/iot-app-kit/commit/41b855103e6643dd79e6e0fc9e7350fddefd9101))
* **react-components:** hide/show properties from legend ([e666cf1](https://github.com/awslabs/iot-app-kit/commit/e666cf1cfba8343d1a5bbb0f38a4341969a18575))
* **react-components:** implement request functions and hooks to build clients ([2ca7e6c](https://github.com/awslabs/iot-app-kit/commit/2ca7e6caf771bd929b993d79f91f6e7d3ce21350))
* **react-components:** initiali implementation for useTimeSeriesData ([50db88f](https://github.com/awslabs/iot-app-kit/commit/50db88f309e6470bfc510824f6deb564c949b794))
* **react-components:** l4e anomaly tests ([fbff596](https://github.com/awslabs/iot-app-kit/commit/fbff5968b7ddb406fa0eaaa21b84489010d55591))
* **react-components:** trendcurors using echarts extension ([a7c6bbe](https://github.com/awslabs/iot-app-kit/commit/a7c6bbe064ae746f024b74d885721a70a06716a2))
* **react-components:** useAlarms hook ([7103db6](https://github.com/awslabs/iot-app-kit/commit/7103db640cd1531823a51fe3277691c869b581ed))
* **react-components:** useDescribeAssets and useDescribeAssetModels queries implemented ([bfb07e1](https://github.com/awslabs/iot-app-kit/commit/bfb07e16b1fceabdd676ebdb833c4d85baaafb0d))
* **react-components:** y axis and timestamp options ([bfe2520](https://github.com/awslabs/iot-app-kit/commit/bfe2520a731dc6ea24d0ad928084546d45ed8643))
* resource explorers ([f604b15](https://github.com/awslabs/iot-app-kit/commit/f604b15dd35e014e78e1f56fd666602767e6b5bd))
* **ResourceExplorer:** hide properties table when not needed to be displayed ([0fca5e9](https://github.com/awslabs/iot-app-kit/commit/0fca5e9089ac7af52e1d31b2143acb121cb7869b))
* **ResourceExplorer:** hide properties table when not needed to be displayed ([bcf36b1](https://github.com/awslabs/iot-app-kit/commit/bcf36b1080393ba0d5126d79e38b373ffcbd2442))
* scatter chart is selected the line style dropdown should be disabled for scatter chart [#2427](https://github.com/awslabs/iot-app-kit/issues/2427) ([d407ba3](https://github.com/awslabs/iot-app-kit/commit/d407ba344c41480b5986a8c8eb0ec8e79ade21a8))
* **scene composer:** adding data-testid to improve e2e test ([1e5ab86](https://github.com/awslabs/iot-app-kit/commit/1e5ab863f89fcdf66aa7b4c0e3b0f5c77367411e))
* **scene composer:** setting up 3D test harness ([df62eef](https://github.com/awslabs/iot-app-kit/commit/df62eefd048a66f327070bc8c90b4c9b964de26e))
* **scene-composer:** enable accelerated raycasting for 3D Tiles ([84d2ce4](https://github.com/awslabs/iot-app-kit/commit/84d2ce4783c74a3792c11009f99cfac888cd848d))
* **scene:** add asset type filter option for browser callback ([f65d4f0](https://github.com/awslabs/iot-app-kit/commit/f65d4f0d5429dfa25b90208d924bfe3c3e3640df))
* **scene:** alphabetize camera drop down ([960f195](https://github.com/awslabs/iot-app-kit/commit/960f195e229736bda9e73c17ecda93fa047a56c6))
* **scene:** move add ground plane to settings ([3b0c59b](https://github.com/awslabs/iot-app-kit/commit/3b0c59b13243892a657f8ed975448babe7a6caec))
* **scene:** textures for backgrounds and planes ([0b2104a](https://github.com/awslabs/iot-app-kit/commit/0b2104ae299f899b88ac4d77696b075793ceed1d))
* screen reader and keyboard accessibility for text widget link settings [#2363](https://github.com/awslabs/iot-app-kit/issues/2363) ([f0c0811](https://github.com/awslabs/iot-app-kit/commit/f0c08117f18158f7d2b486ce2ae0f21cfcf0a1f6))
* show/hide aggregation and resolution in KPI ([aef1f14](https://github.com/awslabs/iot-app-kit/commit/aef1f146c6d4db03d759b76896d78e966b1ce1e6))
* **sitewise-alarms:** add useAlarmModels hook to fetch iot events alarm models in useAlarms ([c4c4986](https://github.com/awslabs/iot-app-kit/commit/c4c4986fde3fd65d7ca7e8b1f7a364fcc079ca10))
* support theming using cloudscape mechanism [#2667](https://github.com/awslabs/iot-app-kit/issues/2667) ([c342310](https://github.com/awslabs/iot-app-kit/commit/c3423101f4f60410d2168a2605fadeb3c6c2d5bc))
* tabs on config panel present that are unusable [#2308](https://github.com/awslabs/iot-app-kit/issues/2308) ([9f0b63d](https://github.com/awslabs/iot-app-kit/commit/9f0b63d81446a1fce4a4635804cff9a6c06c9387))
* **Tiles3D:** add Tiles3D AssetType and evaluate model type when adding a 3D model to the scene ([eec0f50](https://github.com/awslabs/iot-app-kit/commit/eec0f508caa4b1f6b2c7a84baa4f45bf4dc7195b))
* **tmdt:** support endpoint-url parameter and respect S3 bucket name character limit ([b4ea8fb](https://github.com/awslabs/iot-app-kit/commit/b4ea8fbdf3970abfedee4e2465572e20f8f0a707))
* updated background color tokens to support theming [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([a21fbe7](https://github.com/awslabs/iot-app-kit/commit/a21fbe7ca1c90dedb1ba024a1cc17682343e0c1f))
* updated KPI style (gated) ([31ea2f3](https://github.com/awslabs/iot-app-kit/commit/31ea2f371676be9b6412073772b9110b01c42786))
* updated the theming support for kpi and tc [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([d32a018](https://github.com/awslabs/iot-app-kit/commit/d32a0184518ef02222ef15359d49bccb68f6ee39))
* user selected dashboard refresh-rate ([1c1256d](https://github.com/awslabs/iot-app-kit/commit/1c1256da83c938037a47e930c127c2bf3bc14e90))
* widget tool box on mouse hover and selection state ([c80d42a](https://github.com/awslabs/iot-app-kit/commit/c80d42a3d10223d0d7edd5b3ee1b23c9ab613399))
* **widgets:** add name style settings for line/table + edit label in config panel ([f5e9b3f](https://github.com/awslabs/iot-app-kit/commit/f5e9b3fc99a176b3d9eb54ef0a387d171791aaf9))
* xy-plot & bar-chart allow only numerical datatypes [#1952](https://github.com/awslabs/iot-app-kit/issues/1952) ([10b057a](https://github.com/awslabs/iot-app-kit/commit/10b057a1e088ad9ecdc710af73dfd947398659f3))
* xy-plot y axis lable changes [#2378](https://github.com/awslabs/iot-app-kit/issues/2378) ([48389c3](https://github.com/awslabs/iot-app-kit/commit/48389c3e59305525b11b63233c3a79d4a8e3a78d))


### Bug Fixes

* add @babel/traverse ^7.23.7 to package.json overrides ([8c32328](https://github.com/awslabs/iot-app-kit/commit/8c32328f213b90e169ea399e98f1efea7918fbb3))
* add default settings to charts ([5917c83](https://github.com/awslabs/iot-app-kit/commit/5917c83674ffe67ced2bc7fe18c226460c115e80))
* add doc-site to release-please config ([08fb141](https://github.com/awslabs/iot-app-kit/commit/08fb141eee84f97d80082317532c3434aa78d55b))
* add doc-site to release-please config ([ccf5086](https://github.com/awslabs/iot-app-kit/commit/ccf5086fc9ef362e7c61c4d02cb3e88aa20b21c5))
* add left border to configuration panel ([7f684d1](https://github.com/awslabs/iot-app-kit/commit/7f684d17b2945f67982474ad9d36beaa966999f0))
* add missing loading indication for widget values ([d90f9a6](https://github.com/awslabs/iot-app-kit/commit/d90f9a68e63b6280c1fb1187b8b34853fc2047ec))
* add range for table significant digits test ([ac53406](https://github.com/awslabs/iot-app-kit/commit/ac53406823e2c359e635720b918bccb1bf9fb0f7))
* add request settings to fetchTimeSeriesData ([d7cbd9d](https://github.com/awslabs/iot-app-kit/commit/d7cbd9d8bb5a5f56804a7ebce2c87e944bcb6f2b))
* add signigicant digits to xy plot ([70a109e](https://github.com/awslabs/iot-app-kit/commit/70a109e8083b6729313f4f0dc362df0f3cf6ea62))
* add timeZone prop to DashboardViewWrapper ([21f9b15](https://github.com/awslabs/iot-app-kit/commit/21f9b15f2c603e17b139de8b0caba99288207ffb))
* add trailing zeros to decimal point rounding, fix rounding function ([9c13177](https://github.com/awslabs/iot-app-kit/commit/9c131779c5a3f5b2ce7c6d1239e54ed82bfbf572))
* added aria label to dashboard threshold delete button ([ff94bb0](https://github.com/awslabs/iot-app-kit/commit/ff94bb0e5c367ec02a572938a08dcf859e4820f5))
* added aria-label to the config panel text link control for accessibility [#2362](https://github.com/awslabs/iot-app-kit/issues/2362) ([a6f9c22](https://github.com/awslabs/iot-app-kit/commit/a6f9c22e40660e8e30f3b1f65f71f968dc4a0cac))
* added the selection list reset in unmodeled section after clicking add [#2659](https://github.com/awslabs/iot-app-kit/issues/2659) ([7288bc7](https://github.com/awslabs/iot-app-kit/commit/7288bc75afe8f7dac66a6588cd1c21d674bac7dc))
* added validation for decimal places input in dashboard settings [#2723](https://github.com/awslabs/iot-app-kit/issues/2723) ([ac39b8d](https://github.com/awslabs/iot-app-kit/commit/ac39b8db8ad71e08e1cea4f612b4806f861ffaec))
* added validation for the decimal places input [#2567](https://github.com/awslabs/iot-app-kit/issues/2567) ([57bcb3d](https://github.com/awslabs/iot-app-kit/commit/57bcb3ddd4d1b0d88d301838f736fbf601ba48d5))
* anomaly chart docs not loading ([8e01a69](https://github.com/awslabs/iot-app-kit/commit/8e01a69f48b0632b80cb432f6a5f0decdf3301d4))
* aws clients marked as peer dependencies ([d944df4](https://github.com/awslabs/iot-app-kit/commit/d944df4113822671b84737b98dee261cab692421))
* aws clients marked as peer dependencies ([0272167](https://github.com/awslabs/iot-app-kit/commit/027216707ec5fdd77390ef1de132ef744f4f17b8))
* babel vulnerable to arbitrary code execution ([8c32328](https://github.com/awslabs/iot-app-kit/commit/8c32328f213b90e169ea399e98f1efea7918fbb3))
* bar chart break due to css property of line chart ([512e48c](https://github.com/awslabs/iot-app-kit/commit/512e48c5f61e7ac8b09a25551702136f0a01c918))
* better handling of light and dark mode w thresholds ([bd70051](https://github.com/awslabs/iot-app-kit/commit/bd70051944a9a21e21479f4793614f85a4716b2b))
* broken search results disabled state ([38ef2be](https://github.com/awslabs/iot-app-kit/commit/38ef2beb9d7673e8cc0438424631343d5a4eb3ca))
* **bucket policy:** switch from ACL to bucket policy for access logs ([2d17a0f](https://github.com/awslabs/iot-app-kit/commit/2d17a0fa53057ddd0a9e5b46ab2b0de6b9163ac2))
* chart gesture icons overlap on mouse hover ([b5e5c0d](https://github.com/awslabs/iot-app-kit/commit/b5e5c0d6115ed8eb9d819a9b4ceef31c7b56db2b))
* check if href is a valid url before rendering ([ab24822](https://github.com/awslabs/iot-app-kit/commit/ab24822d1792b259529f617bef20b54150e54db2))
* clearing the properties table when user navigates using breadcrumbs [#2751](https://github.com/awslabs/iot-app-kit/issues/2751) ([0653565](https://github.com/awslabs/iot-app-kit/commit/065356516252be2d07c84d0c4a8d9d3d6e392d1c))
* **composer:** cannot delete scene node of a child and then its parent ([a2e140a](https://github.com/awslabs/iot-app-kit/commit/a2e140ab0ef05975e2ec1d8e36a4d68ad9087911))
* **composer:** refactor scene modal rendering ([1d797b1](https://github.com/awslabs/iot-app-kit/commit/1d797b1a6aeab60e45f8e11daf8cd97b9b21033b))
* **composer:** remove deprecated and internal interfaces from public ([07e82b4](https://github.com/awslabs/iot-app-kit/commit/07e82b42963931ddce95362f4a6cca9add6a1423))
* **composer:** trigger onSceneLoaded after dynamic scene is loaded ([4c9453a](https://github.com/awslabs/iot-app-kit/commit/4c9453a12211a878a850d71eee7cb8bd3d4a5fe3))
* **composer:** update property string length limit to 2048 ([a3cb800](https://github.com/awslabs/iot-app-kit/commit/a3cb8009d8547351449bac7c121e67d66971a708))
* **core:** increase cache and min request interval to prevent making many requests for near now data ([403fec9](https://github.com/awslabs/iot-app-kit/commit/403fec94c16a68adbae04134dc4ee69bedb4f4d6))
* corrected the spelling in refresh rate error in documentation [#2777](https://github.com/awslabs/iot-app-kit/issues/2777) ([03e58e7](https://github.com/awslabs/iot-app-kit/commit/03e58e7403fbc501e00dd1b216d710a5a4dafcdb))
* dark mode support for expandable sections in config panel and text widget text color [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([89ba559](https://github.com/awslabs/iot-app-kit/commit/89ba5596fb6c185e8c78e73617733c123a7ef1b3))
* dashboard settings to set correct columns and rows [#2313](https://github.com/awslabs/iot-app-kit/issues/2313) ([cd952c5](https://github.com/awslabs/iot-app-kit/commit/cd952c5e6462fa25350ccc28eb261a70bfa29d98))
* **dashboard-dynamic-asset:** asset name should be shown on refresh in dropdown ([d799487](https://github.com/awslabs/iot-app-kit/commit/d799487b5f72e274a89dce39c94438151c6170f2))
* **dashboard-RE-improvements:** add timezone + sig digits to dynamic tab ([8a6b3ed](https://github.com/awslabs/iot-app-kit/commit/8a6b3ed0052eb37f6a8f0aea7739d6ea076466ac))
* **dashboard:** add apply and cancel buttons to settings modal ([81336cf](https://github.com/awslabs/iot-app-kit/commit/81336cf77806292663cafb929d828e6a95e164af))
* **dashboard:** add descriptions to all RE tables ([f7b4f0c](https://github.com/awslabs/iot-app-kit/commit/f7b4f0c89d8b05be988acac54b8edf35ab3b7367))
* **dashboard:** add descriptions to all tables in RE ([c7aff00](https://github.com/awslabs/iot-app-kit/commit/c7aff00ea0d6175186317f06ca7eec4c550de7a0))
* **dashboard:** add timezone support for new RE ([2d4b5dd](https://github.com/awslabs/iot-app-kit/commit/2d4b5ddcbdefe4828168a7864bd679744e5a97eb))
* **dashboard:** adds resolution and aggregation to new proeprty in gauge widget ([5f5af30](https://github.com/awslabs/iot-app-kit/commit/5f5af3068defeb2a609e68ca0d29cc09f9960cfd))
* **dashboard:** assetName displays conditionally in config panel for linechart ([85496ab](https://github.com/awslabs/iot-app-kit/commit/85496abf0ac3bbb6890678f7c647beaa8cbfbb9d))
* **dashboard:** bring dashboard view component up to date ([cf75507](https://github.com/awslabs/iot-app-kit/commit/cf75507b76130f708dba67a61dc14e6ba3dac7ff))
* **dashboard:** color picker has keyboard focus and can be interacted with ([1e4547e](https://github.com/awslabs/iot-app-kit/commit/1e4547e3aa2bc521c315391cabac569beab10508))
* **dashboard:** composite model tests run correctly ([d2cbaaf](https://github.com/awslabs/iot-app-kit/commit/d2cbaafef6639b84a8762dda9fccf3d3e86fbefd))
* **dashboard:** decimal places fixes ([710a6ae](https://github.com/awslabs/iot-app-kit/commit/710a6aeee8e16fbf7f204d9214dbd8c86fce16e2))
* **dashboard:** decrease width of property label in config panel to stop overflow of delete button ([ee027e5](https://github.com/awslabs/iot-app-kit/commit/ee027e5d95946b89bebcd5e3bdc3a82aecd60d0b))
* **dashboard:** ensure there is a current viewport ([dc31ecf](https://github.com/awslabs/iot-app-kit/commit/dc31ecfa29cc1fd809daf992027670ae8cb39519))
* **dashboard:** expand hitbox for widget action buttons ([64b77db](https://github.com/awslabs/iot-app-kit/commit/64b77db50fe224273db58ab38a67fe478e94ccc2))
* **dashboard:** fast follow improvements for new RE ([ea8c93c](https://github.com/awslabs/iot-app-kit/commit/ea8c93ce12aadafcd5c3e1c8794cedb07cc843f1))
* **dashboard:** fast follow to clean up messy code for table cell render ([649f75d](https://github.com/awslabs/iot-app-kit/commit/649f75d91bd4865d94db633ecd3fb865098fc1ff))
* **dashboard:** fix flaky test in dashboard ([6fe3285](https://github.com/awslabs/iot-app-kit/commit/6fe328510bfd4ed36a24935085aa41ac0c83dfa5))
* **dashboard:** fix spacing between widgets without selection box ([7cc590d](https://github.com/awslabs/iot-app-kit/commit/7cc590dd988bf244c430e55e43745a8be344e8d7))
* **dashboard:** fix spacing issues on editable grid ([0529abd](https://github.com/awslabs/iot-app-kit/commit/0529abd18267bf69ea36a2795096d724784ce3bc))
* **dashboard:** for kpi/status disable add of RE when an property is already added ([712c1a7](https://github.com/awslabs/iot-app-kit/commit/712c1a777bc51c69956bfbb855bd0a01a6721e18))
* **dashboard:** for kpi/status disable add of RE when an property is already added ([eff3282](https://github.com/awslabs/iot-app-kit/commit/eff328273955d5e8a4ae815e03855aae6c48e162))
* **dashboard:** gauge bug fixes ([d93a42a](https://github.com/awslabs/iot-app-kit/commit/d93a42a1a62a1cfa31a6c342429a730663b8a591))
* **dashboard:** increase width of property label in config panel to span width of panel ([642f7c6](https://github.com/awslabs/iot-app-kit/commit/642f7c6ad5b50d20009ba21067255aab1e8d4780))
* **dashboard:** kpi/status bug to stop adding more than 1 property ([f68c5eb](https://github.com/awslabs/iot-app-kit/commit/f68c5eb42d34aa3483d3f85fe01dfb5d4e64fb3a))
* **dashboard:** label matches kpi name ([f675d11](https://github.com/awslabs/iot-app-kit/commit/f675d11857c0b0a3869d03d9c1339c405a85d11e))
* **dashboard:** make onSave optional ([1e92359](https://github.com/awslabs/iot-app-kit/commit/1e92359faa2c4ce3e8c169491729187b02e4562e))
* **dashboard:** migration for sitewise component + blackpearl widget types ([c91a0e9](https://github.com/awslabs/iot-app-kit/commit/c91a0e9cda943cad530c722dc6c8097b225a45da))
* **dashboard:** migration migrates custom name for properties ([bd7862b](https://github.com/awslabs/iot-app-kit/commit/bd7862b5faabe379821385e7cfb2f14a647da803))
* **dashboard:** missing dependency for dashboard wrapper ([c6b73db](https://github.com/awslabs/iot-app-kit/commit/c6b73db473948be887e0968864a0f896fdc4d680))
* **dashboard:** modeled datastreams are displayed in msw ([a2833a1](https://github.com/awslabs/iot-app-kit/commit/a2833a174ccb8f66b547451f92ff2b6c6194beca))
* **dashboard:** padding for tabs in config panel + remove scroll in threshold panel ([d3f969c](https://github.com/awslabs/iot-app-kit/commit/d3f969c092a271e7b26289d0160e0c4901282b1e))
* **dashboard:** re reflects significant digits + timezone support for unmodeled ([195be67](https://github.com/awslabs/iot-app-kit/commit/195be67fe0e5b7ef7b262491ff4fec574c62db8c))
* **dashboard:** reenable gestures in edit mode ([16bd88f](https://github.com/awslabs/iot-app-kit/commit/16bd88fad43742488efdfaa433104446ad5b2b08))
* **dashboard:** remove promise client from public API and internally generate it ([b98f5c7](https://github.com/awslabs/iot-app-kit/commit/b98f5c7ad292cee108c744d2ceec0d5117dd90b0))
* **dashboard:** revert the title change for line chart ([88ed63e](https://github.com/awslabs/iot-app-kit/commit/88ed63ebd6e4f4da8c25820891afdc2ce6ac8903))
* **dashboard:** sanitize href input in text widget ([f766a3b](https://github.com/awslabs/iot-app-kit/commit/f766a3bd3cb410d098f3e9606fe24e2f61c4ae0f))
* **dashboard:** selected assets do not deselect on widget selection ([5c717f8](https://github.com/awslabs/iot-app-kit/commit/5c717f8bf57788ae9cac6521807d82622b47ac8a))
* **dashboard:** style fixes to make the dashboard accessible at small screensizes ([dde49e6](https://github.com/awslabs/iot-app-kit/commit/dde49e6bc06f8b7f2472ab36db91196e93ce84aa))
* **dashboard:** style updates to widget title bar ([1b224bf](https://github.com/awslabs/iot-app-kit/commit/1b224bf36768ed628946512be1feab2d0446985f))
* **dashboard:** use more descriptive name for the settings label ([2d0b36c](https://github.com/awslabs/iot-app-kit/commit/2d0b36c29cad264f45f3e7178dcd3c296692c69e))
* datastream not show unit if it's undefined [#2660](https://github.com/awslabs/iot-app-kit/issues/2660) ([7418773](https://github.com/awslabs/iot-app-kit/commit/7418773d7a39ef978ad3663e12fcf87082767f54))
* default Style tab upon widget selection ([5456435](https://github.com/awslabs/iot-app-kit/commit/5456435081da8e77a860c2c3f38b841a728eb4f8))
* disable equals and contains operators in gauge thresholds ([6fd0ab4](https://github.com/awslabs/iot-app-kit/commit/6fd0ab40f0553067a65f5b5a25b0a6b299d3d1ac))
* disable options in legend or yaxis section if visible is false [#2467](https://github.com/awslabs/iot-app-kit/issues/2467) ([b4daa17](https://github.com/awslabs/iot-app-kit/commit/b4daa17735a6ebed582c98d292e7b1c261a65dea))
* **doc-site:** canvas not recognised automatically ([1e42f58](https://github.com/awslabs/iot-app-kit/commit/1e42f5872f863349b51264526d4b74271e811412))
* **draco:** modifying check to ensure globalSettings are ready for evaluation ([80c3295](https://github.com/awslabs/iot-app-kit/commit/80c3295f96609885a043c4cb01d314447a376485))
* **draco:** updating global settings ([9010137](https://github.com/awslabs/iot-app-kit/commit/90101378170004df2de7de511bb0be458ef45842))
* **dynamicscene:** converting empty scene locks ui ([cc8efff](https://github.com/awslabs/iot-app-kit/commit/cc8efffb80eeb17a64b1b8f021f42b7e5f52570f))
* **DynamicScenes:** copySceneNodes should take the new sceneId as an argument ([37f8251](https://github.com/awslabs/iot-app-kit/commit/37f8251db97b6ee6320e9cdf810c1e317717e7ac))
* **DynamicScenes:** fix bug to render empty scenes ([2c25827](https://github.com/awslabs/iot-app-kit/commit/2c25827f4fc2b9bc745eacd81e9b7d875fb3a086))
* **DynamicScenes:** revert detect dynamic scenes missing their root entity ([8593b33](https://github.com/awslabs/iot-app-kit/commit/8593b3304faf9933f9050400201fc0a1c6aae0ef))
* empty state overflow ([3e073f7](https://github.com/awslabs/iot-app-kit/commit/3e073f72cfd0a47c87bf09d8b20c64ef54907430))
* **example:** fix HDR loader in react example ([63afb47](https://github.com/awslabs/iot-app-kit/commit/63afb47e94ad4025045116a9eff9d6ac1afdc823))
* **example:** make sure selection change uses the entity binding component index ([200d0db](https://github.com/awslabs/iot-app-kit/commit/200d0db2171d21d5545a1c7e9d8403ac7bbeae3e))
* filter component models from query editor ([8245b6d](https://github.com/awslabs/iot-app-kit/commit/8245b6d4e8c6f120af0c523c41ee3ccc9d4097fa))
* fix bugs on l4e widget ([17a4896](https://github.com/awslabs/iot-app-kit/commit/17a489631da778b13fcb194b8bd527874e9e2858))
* fix data-zoom behavior for base chart ([0c66a80](https://github.com/awslabs/iot-app-kit/commit/0c66a8016e2aa827ad3093c3ef89d6437e014d18))
* fix filtered data on zooms ([99e2f90](https://github.com/awslabs/iot-app-kit/commit/99e2f90aecdbaaa354e62e76b22c88a8530c1509))
* fix for css style issue in doc site [#2718](https://github.com/awslabs/iot-app-kit/issues/2718) ([e50f2ae](https://github.com/awslabs/iot-app-kit/commit/e50f2aeeee42e337e0a3327f5989f224241bdf74))
* fixed the bug in saving workspace in localstorage [#2566](https://github.com/awslabs/iot-app-kit/issues/2566) ([7a7f619](https://github.com/awslabs/iot-app-kit/commit/7a7f61920438b8d30b8a42a1d71971e4822d56be))
* fixed the issue with no aggregation change [#2605](https://github.com/awslabs/iot-app-kit/issues/2605) ([569854e](https://github.com/awslabs/iot-app-kit/commit/569854e1e0778b569a0dc9ca265e77f1d1508efc))
* fixed the properties tab child key error [#2809](https://github.com/awslabs/iot-app-kit/issues/2809) ([370e1f7](https://github.com/awslabs/iot-app-kit/commit/370e1f7061908d4c1334fca9b8454c2ba0e32e5c))
* fixed the timezone issue in unit test [#2623](https://github.com/awslabs/iot-app-kit/issues/2623) ([a8200dc](https://github.com/awslabs/iot-app-kit/commit/a8200dc6ff783fbfda924ee52080582bd0a1f222))
* fixed the view mode edge mode actions issue [#2650](https://github.com/awslabs/iot-app-kit/issues/2650) ([4298a6b](https://github.com/awslabs/iot-app-kit/commit/4298a6b1981db2e2bd3a9c00947fd90573baed50))
* fixed the workspace required errorin search [#2384](https://github.com/awslabs/iot-app-kit/issues/2384) ([0ff9bc3](https://github.com/awslabs/iot-app-kit/commit/0ff9bc3887cc87441b80df017d964be36727be7f))
* grab asset composite property correctly ([1c57017](https://github.com/awslabs/iot-app-kit/commit/1c57017f3b3c78c62fc3a3cdfc6f4fa01a09f745))
* grouped the style buttons together and associated with style label for screen reader [#2360](https://github.com/awslabs/iot-app-kit/issues/2360) ([da7f0c1](https://github.com/awslabs/iot-app-kit/commit/da7f0c1f5bbdb0735fec4ddfbf53726ba5c319cc))
* hidden and highlighted datastreams persist correctly ([5a85bb7](https://github.com/awslabs/iot-app-kit/commit/5a85bb7d40d07dce439a1bfa15550d8893089cbd))
* **imports:** move luxon dependency to right package ([31235da](https://github.com/awslabs/iot-app-kit/commit/31235da4b31e49ec0fc0f1ec21f649cf7af7e253))
* improve properties panel styling ([f3de67e](https://github.com/awslabs/iot-app-kit/commit/f3de67e73c7197c6bf63254c93476475661738b0))
* improved zoom and default values for y axis ([112e5c5](https://github.com/awslabs/iot-app-kit/commit/112e5c58d7e3478dec03dfbb2eb52ec315b4690d))
* internal pipeline has issues with lfs, reverting ([968f950](https://github.com/awslabs/iot-app-kit/commit/968f95005c51591d7cb99af323808fd232b8d4e9))
* l4e bug fixes ([a71673c](https://github.com/awslabs/iot-app-kit/commit/a71673c9fbc701a5e26ed8d8c9bda191bc9b9285))
* l4e code clean up ([ad19b6c](https://github.com/awslabs/iot-app-kit/commit/ad19b6c68c515182454d9132629f2736f5fa4988))
* l4e widget quick fixes ([286f724](https://github.com/awslabs/iot-app-kit/commit/286f7244ac501ffc877dd0e0d40d76e97ab98bda))
* loads properties panel if some of the assets do not exist [#2808](https://github.com/awslabs/iot-app-kit/issues/2808) ([c4a98a5](https://github.com/awslabs/iot-app-kit/commit/c4a98a5f04143a827aba4176117b049bcacb946c))
* make context menu appear on top of chart tooltip ([e1622c8](https://github.com/awslabs/iot-app-kit/commit/e1622c86bf4ead6856e7e1c9be1d5b8a1d6d4d61))
* make gauge values absolute values in gauge docs ([dbb4901](https://github.com/awslabs/iot-app-kit/commit/dbb490144d14e144636ab02c7e4d4fa7b79188df))
* make gauge widget default size smaller ([937199a](https://github.com/awslabs/iot-app-kit/commit/937199adfdd536681700919ddcea7648860c7052))
* migrated tooltip css to styled component for customizing theming options [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([515ad24](https://github.com/awslabs/iot-app-kit/commit/515ad2478abf20a9490ac725ee80ce7cc6ae111f))
* migrated widget tooltip css to styled-components for theming [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([2ee5eca](https://github.com/awslabs/iot-app-kit/commit/2ee5ecad15ea7aa200693b4922128191e1808106))
* min max is sortable and not present on widget add ([7578a2e](https://github.com/awslabs/iot-app-kit/commit/7578a2e113221b2d3c00c01d2ede253e7ce07081))
* min/max values have correct significant digits ([50e183d](https://github.com/awslabs/iot-app-kit/commit/50e183d240ecf329362e10d21b9864d08cb525ee))
* move data quality widget on gauge to be closer to value ([d20b65f](https://github.com/awslabs/iot-app-kit/commit/d20b65f5704ffd5d56c4f402877be72d59adcadd))
* msw batchGetAssetPropertyValueHandler response timeInSeconds values ([5869a00](https://github.com/awslabs/iot-app-kit/commit/5869a009550399ab73b882e2f253aa9c10ec1179))
* msw batchGetAssetPropertyValueHistoryHandler timestamp ([ccf21a7](https://github.com/awslabs/iot-app-kit/commit/ccf21a73a1391ac9da3ccceb18916897ef51066e))
* pass in refresh rate through the query instead of props ([b6df585](https://github.com/awslabs/iot-app-kit/commit/b6df5856b4407c74d4746d12a1781d11976f9948))
* preserve viewMode onSave ([731756a](https://github.com/awslabs/iot-app-kit/commit/731756a3d89bb5eca611c0bb4d3b576822f108f3))
* prevent creating new chart when iconn is dragged over different chart type ([7feff77](https://github.com/awslabs/iot-app-kit/commit/7feff773d0a06f4029824b02a30371c1993b05bf))
* prevent fetching ([85a7b35](https://github.com/awslabs/iot-app-kit/commit/85a7b35f9b5303fe037de5636a75827335ffdaba))
* programatically linked the color-picker id with color label in configPanelText [#2361](https://github.com/awslabs/iot-app-kit/issues/2361) ([ab05475](https://github.com/awslabs/iot-app-kit/commit/ab0547539bb9b47130c66c0520d7c0bce9cf5aee))
* **react components:** updating import for popper.js ([00c1707](https://github.com/awslabs/iot-app-kit/commit/00c17078163cc2ef48a8eb6e370652ca9823e8e2))
* react-component Chart story book is broken ([c273ad5](https://github.com/awslabs/iot-app-kit/commit/c273ad529a7d78f887a2b8c64b50f76bfc018fc2))
* **react-components:** add error state ([e16671f](https://github.com/awslabs/iot-app-kit/commit/e16671f11bbae4b768220b93b8cae0fe9ffee9c3))
* **react-components:** add snapshot tests ([178f0e7](https://github.com/awslabs/iot-app-kit/commit/178f0e7bbba316c711ff7c8fc18455cdccf939fb))
* **react-components:** add timezone to anomaly chart ([5379bd1](https://github.com/awslabs/iot-app-kit/commit/5379bd19d0d47e62f42a19230e9cf52e2a715d95))
* **react-components:** anomaly chart move loading state ([581a3c5](https://github.com/awslabs/iot-app-kit/commit/581a3c57734ba460ced0e32e232ed38583f232ba))
* **react-components:** anomaly chart timestamp padding ([b376bf4](https://github.com/awslabs/iot-app-kit/commit/b376bf4861f58bd5489c907d2ae72107a2178eb3))
* **react-components:** anomaly chart xaxis formatting ([740ee2a](https://github.com/awslabs/iot-app-kit/commit/740ee2a0ecbbe29c43a02fd04c0193935d79dd0e))
* **react-components:** anomaly widget error and empty states ([2d70b79](https://github.com/awslabs/iot-app-kit/commit/2d70b79467fe94621dd722bb95e7f52c21b477f2))
* **react-components:** center error ([12da428](https://github.com/awslabs/iot-app-kit/commit/12da428c354b999a8dc350e3811cd9f3a44ef782))
* **react-components:** clear ymin and ymax was getting emitted on every loop ([8609a48](https://github.com/awslabs/iot-app-kit/commit/8609a487a1b7ba9d4884750a6e6ee8819873a4b1))
* **react-components:** comment out flaky resource expl tests ([ca1039d](https://github.com/awslabs/iot-app-kit/commit/ca1039dc5c66cd30cc578651184463c889febd83))
* **react-components:** confining tootip to the chart area ([1bff986](https://github.com/awslabs/iot-app-kit/commit/1bff986999dc88a261caed22c3a77aab892219ad))
* **react-components:** do not use decimal places setting in y axis ([f9fbf74](https://github.com/awslabs/iot-app-kit/commit/f9fbf74311af528b89ad34333b36508eeb3d9ae5))
* **react-components:** ensure anomaly chart colors are in order ([3fd8d87](https://github.com/awslabs/iot-app-kit/commit/3fd8d87c2dee6615a7e22962c0d8dbd0cfff97c0))
* **react-components:** ensure chart uses initial passed in viewport ([0b17318](https://github.com/awslabs/iot-app-kit/commit/0b173182adb4180ca0065b4238549cd30a0af3d2))
* **react-components:** ensure enabled flag is never undefined for queries ([eb95ef4](https://github.com/awslabs/iot-app-kit/commit/eb95ef4e8f186f5f969e366321f01d9ab1ea1ab8))
* **react-components:** export anomaly chart ([30ae675](https://github.com/awslabs/iot-app-kit/commit/30ae675d92acd26d0414f6aa2da953bc0b37d5e7))
* **react-components:** filter out non anomalous data ([70f0a1c](https://github.com/awslabs/iot-app-kit/commit/70f0a1cdbada92336d9597c6e2a5f456896a15f5))
* **react-components:** fix chart flickering and bugginess in live mode ([3cc3b41](https://github.com/awslabs/iot-app-kit/commit/3cc3b41d59d5c799b750eb76d809007b30dfe2a8))
* **react-components:** fix error state display ([dead60a](https://github.com/awslabs/iot-app-kit/commit/dead60a175b236b4d74d1ca65a882821c5e49e26))
* **react-components:** fix get value history request ([a701ef4](https://github.com/awslabs/iot-app-kit/commit/a701ef48519807612715eaf2714f3eb6a306de05))
* **react-components:** fix global and chart store persistence ([83f1345](https://github.com/awslabs/iot-app-kit/commit/83f13452cbf350639cc2cc576d47a26138d58832))
* **react-components:** fix passed in viewport for anomaly widget ([f73fafc](https://github.com/awslabs/iot-app-kit/commit/f73fafcd5dfdf7238f69848f1808fbbb0b17f281))
* **react-components:** fix support for anomaly datasource outside of time sync ([d45cc6b](https://github.com/awslabs/iot-app-kit/commit/d45cc6b45adb67b8bc44b975a2a65c5942f0d746))
* **react-components:** fix the mouse events ([7c07a37](https://github.com/awslabs/iot-app-kit/commit/7c07a37eb5e8649a6d967c96b297659caad270a8))
* **react-components:** gauge properly shows property name again ([ddb65c6](https://github.com/awslabs/iot-app-kit/commit/ddb65c6304c473e01e0c7ae3e868eba98923574c))
* **react-components:** gauge thresholds ([8e3bec3](https://github.com/awslabs/iot-app-kit/commit/8e3bec3f6058c9c96ac42439c1b33b90a0d3912e))
* **react-components:** gauge thresholds with negative ranges ([2100221](https://github.com/awslabs/iot-app-kit/commit/21002216dc53230e95762ac3f46734ab90d8d1f6))
* **react-components:** gestures prop works ([6141c32](https://github.com/awslabs/iot-app-kit/commit/6141c3234095c658240e528207cdcbe3ff6e2d62))
* **react-components:** improve axis styling and add labels ([490058f](https://github.com/awslabs/iot-app-kit/commit/490058fbdb9ca102ca85abc2ff5770caafa52a71))
* **react-components:** improve gauge thresholds ([09b352f](https://github.com/awslabs/iot-app-kit/commit/09b352f9a255cf3fb04f8c0382a8013db0f1ae35))
* **react-components:** lowered min/max throttle to match TC throttle ([e972b1b](https://github.com/awslabs/iot-app-kit/commit/e972b1bfe89a25094b9884c38afd2ac7faa35c5c))
* **react-components:** make anomaly chart responsive ([4b31b8c](https://github.com/awslabs/iot-app-kit/commit/4b31b8cece18f1a1e1e91447c31ca79ec0b3867f))
* **react-components:** minor anomaly widget style changes ([19fc67a](https://github.com/awslabs/iot-app-kit/commit/19fc67a7768604d39c728ea4e1df8f318042d8b8))
* **react-components:** performance fixes for chart component ([403f2bf](https://github.com/awslabs/iot-app-kit/commit/403f2bf6beea75e1e1668e33c60a6149ef1b5436))
* **react-components:** refactor chart to use dataset ([b403789](https://github.com/awslabs/iot-app-kit/commit/b4037897cd4e7169958373bbf61d29c7454706ef))
* **react-components:** refactor legend table into modules ([f5eed70](https://github.com/awslabs/iot-app-kit/commit/f5eed7068b70ae9305782f07b08115294b26a3b7))
* **react-components:** remove data points after a threshold ([cd6a189](https://github.com/awslabs/iot-app-kit/commit/cd6a18913d2c0f3fb8b066dffbdf48f38d6955e4))
* **react-components:** remove flaky test in new RE ([9e15637](https://github.com/awslabs/iot-app-kit/commit/9e15637ecced497aec52a7189fc1e0adcf1de361))
* **react-components:** remove padded y axis code ([7e3d365](https://github.com/awslabs/iot-app-kit/commit/7e3d365d07dd4b074c6dda6d2934b7cb05fcde55))
* **react-components:** remove secondary selection state when using TCs or gestures ([3ba4e6a](https://github.com/awslabs/iot-app-kit/commit/3ba4e6a1cc0c2a7fd48eb130f3b72262fcd97ad5))
* **react-components:** skip flaky test in new RE ([e7928d3](https://github.com/awslabs/iot-app-kit/commit/e7928d329edef47871ed9978d820994ad2d76dcc))
* **react-components:** support nanoseconds for datapoints ([34d2dff](https://github.com/awslabs/iot-app-kit/commit/34d2dff489ff77d9eb9226443218b4c7cf725ff2))
* **react-components:** thresholds properly add and remove series ([bb8e451](https://github.com/awslabs/iot-app-kit/commit/bb8e451fbb4ed57a204b9936cf2e1c8853931c60))
* **react-components:** timestamp bar correct date ([2063935](https://github.com/awslabs/iot-app-kit/commit/20639352a433cea9abfceee439f7aa9c36db05b9))
* **react-components:** trendcursor hotkey indicates addition state ([c9d34e0](https://github.com/awslabs/iot-app-kit/commit/c9d34e0ef4ba891522336f05718d1808442949e3))
* **react-components:** update date-fns dependency ([1267b65](https://github.com/awslabs/iot-app-kit/commit/1267b6583034f17b14b8ca1de52125640bfdf3ea))
* **react-components:** updates for x-axis panning performance ([07a7624](https://github.com/awslabs/iot-app-kit/commit/07a7624d77962c38e7457abea1602082ebf2f5a3))
* **react-components:** viewport fixes ([b5846ed](https://github.com/awslabs/iot-app-kit/commit/b5846edf5c795c2bccdfee2a71d6b65f44dd56e5))
* **react-components:** zoom icons ([4da01df](https://github.com/awslabs/iot-app-kit/commit/4da01df378b1d3e2804c4802bd9250c7e180990f))
* realistic dev experience on storybook ([377d64a](https://github.com/awslabs/iot-app-kit/commit/377d64a4ead7b0a68d5df47a5df568da7d188021))
* refresh rate defined in dashboard and on query ([43cc5e4](https://github.com/awslabs/iot-app-kit/commit/43cc5e437543aed60663620655044cba9437a226))
* relative month test ([5c6e262](https://github.com/awslabs/iot-app-kit/commit/5c6e262b16b8a739c4a4d9e823453094242c67d9))
* remove double aggregation picker ([dea30ce](https://github.com/awslabs/iot-app-kit/commit/dea30ce3e50f5bba5931970eaf5e8d233753b1b2))
* remove duplicate constants and types ([45c155b](https://github.com/awslabs/iot-app-kit/commit/45c155b414a29c767e276060f1c60ce8401ea456))
* remove fetchMostRecentBeforeStart from status and kpi ([f9b3183](https://github.com/awslabs/iot-app-kit/commit/f9b3183ce5e52462f5120362a130b4aea6588671))
* removed tanstack table related code ([c8be85d](https://github.com/awslabs/iot-app-kit/commit/c8be85d919faac44441f4b00aa81ac7dbf215599))
* **resource-explorer:** only use alias to query if present ([ca35aee](https://github.com/awslabs/iot-app-kit/commit/ca35aee4cdd31c79302c282d5965911df6d0b6f5))
* **ResourceExplorer:** filter out invalid twinmaker execute query search results ([e616be4](https://github.com/awslabs/iot-app-kit/commit/e616be4c6d8e2d8a01b5ba931a57307ea8b7f307))
* **scene composer:** correcting state logic for tag settings ([f149ac9](https://github.com/awslabs/iot-app-kit/commit/f149ac94f5f78a6798dbefa95435134989859f68))
* **scene composer:** implemented react-hooks linter & converted useStore to accessStore ([d95f684](https://github.com/awslabs/iot-app-kit/commit/d95f684ad6c14405d8c9c1f5b2ac84cb5f3355e1))
* **scene hierarchy:** cleaning up scene hierarchy ui ([b1a11f3](https://github.com/awslabs/iot-app-kit/commit/b1a11f361af37c8cd05db79d964ef1642860e0f1))
* **scene-composer:** 3D model selection broken on first click ([7ee722a](https://github.com/awslabs/iot-app-kit/commit/7ee722ab3cf1aa4a353e7b05c1a9b53f3ac00c88))
* **scene-composer:** fix scene hierarchy in viewer mode ([c8c70fd](https://github.com/awslabs/iot-app-kit/commit/c8c70fdac04d8aab12f5a6a3f19303cb6754d083))
* **scene-composer:** fix sub-model selection ([0a11b9a](https://github.com/awslabs/iot-app-kit/commit/0a11b9a391767fea2d255509ac9377889e812a5c))
* **scene-composer:** reverting zustand upgrade due to Grafana issues related to zustand, react, r3f ([cfbca24](https://github.com/awslabs/iot-app-kit/commit/cfbca24d51de3fb113f79ab0dce2cc96264a8c82))
* **scene:** fix dynamic scene entity binding reload on query ([d8a1b89](https://github.com/awslabs/iot-app-kit/commit/d8a1b89c189dc7694b83b0819199b54711a34109))
* **scene:** fix possible undefined query state ([0511c34](https://github.com/awslabs/iot-app-kit/commit/0511c3429d4c6426851b0dfae91a03d4e3982800))
* **scene:** fix regression in updateSceneNode for reparenting nodes ([016e9f5](https://github.com/awslabs/iot-app-kit/commit/016e9f59ff755ff8d1522117d159df7246aebe22))
* **scene:** fix Scene Hierarchy Tree item for node with no components ([e341fa5](https://github.com/awslabs/iot-app-kit/commit/e341fa511cfec0630ec13b0dba22981b7307c6be))
* **scene:** handle bad texture files gracefully and toggle opacity on selection ([dca5b10](https://github.com/awslabs/iot-app-kit/commit/dca5b10404d9dd1175e16284d9733abe38590175))
* **scene:** round ground plane opacity to whole percent ([760aa8c](https://github.com/awslabs/iot-app-kit/commit/760aa8cac2511717e0fa1f9b1974125ee97c569a))
* **scene:** update dependency for selection change use effect ([623b55b](https://github.com/awslabs/iot-app-kit/commit/623b55b016890a3e537fdae0b1d39ec665603834))
* **scene:** validation scene json on deserialize ([3f2ad73](https://github.com/awslabs/iot-app-kit/commit/3f2ad737c7c85a1d3e14e2fb5a74d7213780e581))
* set npm-publish to node v16 ([057eac9](https://github.com/awslabs/iot-app-kit/commit/057eac9f5629be32bf2415fb3f241f715f8150c1))
* sort and pagination colors ([4dd6bb9](https://github.com/awslabs/iot-app-kit/commit/4dd6bb94198cd4c40fb1bde2d0b350c97d4ec540))
* source-iotsitewise batch API options ([6e4d430](https://github.com/awslabs/iot-app-kit/commit/6e4d430a033bbd54eb403a96f04ecb23a7909e36))
* table resize button aria label ([1618d50](https://github.com/awslabs/iot-app-kit/commit/1618d50a713cb1be8b9a74899144ca92cd9ec5f1))
* template asset table disables invalid dataTypes ([7cacc1c](https://github.com/awslabs/iot-app-kit/commit/7cacc1cee19fa9c9d116435d377e4bf820ba9ff9))
* testing-util as devDependency of doc-site ([3cc2bb0](https://github.com/awslabs/iot-app-kit/commit/3cc2bb08294244c3f6fd15800892d6402894b434))
* text widget enhancement - 2429 ([0d5a367](https://github.com/awslabs/iot-app-kit/commit/0d5a367c074b12d98aa91a5b5c1ea37e3033c047))
* **timeZone:** wrap timezone setState in useEffect ([6cd74a1](https://github.com/awslabs/iot-app-kit/commit/6cd74a1019499b8d6586cac0d26d605cdcd9c928))
* **tmdt:** stream 3D assets from S3 on init ([ee0e11b](https://github.com/awslabs/iot-app-kit/commit/ee0e11b30c331f7ec341e8cf58f155e41011a0bd))
* tooltip styled component issue is fixed ([5af6e22](https://github.com/awslabs/iot-app-kit/commit/5af6e2285cfc2e346e417e13f305f3a0a0c05439))
* update data quality UX to match mocks ([ed62846](https://github.com/awslabs/iot-app-kit/commit/ed628461c0dd582ae2f03f06b81c8d25aab3832c))
* update default cellsize in migration to 20 ([12db8f9](https://github.com/awslabs/iot-app-kit/commit/12db8f91940747b7159c2384057247f61995d1f2))
* update docs for KPI ([84a51f5](https://github.com/awslabs/iot-app-kit/commit/84a51f51c71527a4ffec72fbffb118f6e0b7f67d))
* update react-components public API for status and kpi widgets ([5e7bd49](https://github.com/awslabs/iot-app-kit/commit/5e7bd49fc6ae36fbdbd85e8c02bbb0b4ac082346))
* update timezone docs based on feedback ([17be12d](https://github.com/awslabs/iot-app-kit/commit/17be12d6336a607866a27af31e742b74d712c571))
* updated the new set of design tokens [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([7bdb8b0](https://github.com/awslabs/iot-app-kit/commit/7bdb8b08db1dcdc06153d71eff191a5e5a93a48b))
* updated the ux for widget actions [#2439](https://github.com/awslabs/iot-app-kit/issues/2439) ([c50cd03](https://github.com/awslabs/iot-app-kit/commit/c50cd0381e7e1240b30bbffa1cd4a4c4f5de4987))
* updated the viewport settings for dynamic input [#2565](https://github.com/awslabs/iot-app-kit/issues/2565) ([0e31d25](https://github.com/awslabs/iot-app-kit/commit/0e31d25b9a7001a6216057681ac5aa7b6ec327ed))
* updated the viewport settings for dynamic input [#2565](https://github.com/awslabs/iot-app-kit/issues/2565) ([7589b1d](https://github.com/awslabs/iot-app-kit/commit/7589b1d1c52aa9a9c5e4ce2336afb8b44d251f55))
* updated theming support for buttons [#2668](https://github.com/awslabs/iot-app-kit/issues/2668) ([1ffead0](https://github.com/awslabs/iot-app-kit/commit/1ffead0805048445b677f4cd63a31af7d5912095))
* updates for performance issues ([8863b9a](https://github.com/awslabs/iot-app-kit/commit/8863b9a80d7a8284aa4732ed25298d165a769ea9))
* use datastream id as legend table row key ([b4c11bc](https://github.com/awslabs/iot-app-kit/commit/b4c11bcd40400d4f7eae680d5ab521f00b638f64))
* **V1011333107:** vulnerbility in fast-xml-parser dependabot couldn't resolve ([73d0e79](https://github.com/awslabs/iot-app-kit/commit/73d0e79b8d567d27e32ce947682b47c9885f9deb))
* yAxis label collides with yAxis name [#2471](https://github.com/awslabs/iot-app-kit/issues/2471) ([85ac6ac](https://github.com/awslabs/iot-app-kit/commit/85ac6ac4586d560e44cadedbffe5b1a187bd8bb8))


### Performance Improvements

* improve raw batching ([263282d](https://github.com/awslabs/iot-app-kit/commit/263282d751d334745ddc3079d6a8959b5cf1e6d9))
* increase batch entry and result size ([cf5e978](https://github.com/awslabs/iot-app-kit/commit/cf5e9785418c801e89cc2afa2a626e16547a8a7c))
* increase batch size ([1fefe81](https://github.com/awslabs/iot-app-kit/commit/1fefe81cecf8bbeffebb5e89b73cab3494beba21))
* initial Animator implementation ([3b30cd2](https://github.com/awslabs/iot-app-kit/commit/3b30cd2c236704145ac29b2cf0222a28de9a0959))
* prevent duplication of simultaneous data stream metadata requests ([bfbe7b2](https://github.com/awslabs/iot-app-kit/commit/bfbe7b23c968e367423cf8a81504e2773e5460bc))


### Reverts

* "feat(dashboard): adding new property panel layout" ([880125b](https://github.com/awslabs/iot-app-kit/commit/880125baadbf5ce1b478566154d8f352143e9784))
* "feat(dashboard): adding new property panel layout" ([9f6b707](https://github.com/awslabs/iot-app-kit/commit/9f6b707b0ba78981d6ee65536260acf0e1a3bb38))
* "perf: increase batch size" ([636a539](https://github.com/awslabs/iot-app-kit/commit/636a539fcba8c62871b1b60b117ab2881124ac81))
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).