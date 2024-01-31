# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.15.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.14.0...root-v9.15.0) (2024-01-31)


### Features

* automatically selecting previously selected workspace or first workspace from options [#2384](https://github.com/awslabs/iot-app-kit/issues/2384) ([c1424a2](https://github.com/awslabs/iot-app-kit/commit/c1424a2b2ac7d7034c748cb221e565a8967c3da8))
* display legend unit conditionally  [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([9f6440e](https://github.com/awslabs/iot-app-kit/commit/9f6440e9e06c9040a6be46eab3a9141ad02a0509))
* legend resize ([792b617](https://github.com/awslabs/iot-app-kit/commit/792b6170cc19402f3c49fbd60e4a07dc0890c434))
* **react-components:** trendcurors using echarts extension ([a7c6bbe](https://github.com/awslabs/iot-app-kit/commit/a7c6bbe064ae746f024b74d885721a70a06716a2))
* scatter chart is selected the line style dropdown should be disabled for scatter chart [#2427](https://github.com/awslabs/iot-app-kit/issues/2427) ([d407ba3](https://github.com/awslabs/iot-app-kit/commit/d407ba344c41480b5986a8c8eb0ec8e79ade21a8))
* **scene:** add asset type filter option for browser callback ([f65d4f0](https://github.com/awslabs/iot-app-kit/commit/f65d4f0d5429dfa25b90208d924bfe3c3e3640df))


### Bug Fixes

* add signigicant digits to xy plot ([70a109e](https://github.com/awslabs/iot-app-kit/commit/70a109e8083b6729313f4f0dc362df0f3cf6ea62))
* **composer:** update property string length limit to 2048 ([a3cb800](https://github.com/awslabs/iot-app-kit/commit/a3cb8009d8547351449bac7c121e67d66971a708))
* **dashboard:** fix spacing between widgets without selection box ([7cc590d](https://github.com/awslabs/iot-app-kit/commit/7cc590dd988bf244c430e55e43745a8be344e8d7))
* **dashboard:** fix spacing issues on editable grid ([0529abd](https://github.com/awslabs/iot-app-kit/commit/0529abd18267bf69ea36a2795096d724784ce3bc))
* **dashboard:** kpi/status bug to stop adding more than 1 property ([f68c5eb](https://github.com/awslabs/iot-app-kit/commit/f68c5eb42d34aa3483d3f85fe01dfb5d4e64fb3a))
* **dashboard:** selected assets do not deselect on widget selection ([5c717f8](https://github.com/awslabs/iot-app-kit/commit/5c717f8bf57788ae9cac6521807d82622b47ac8a))
* empty state overflow ([3e073f7](https://github.com/awslabs/iot-app-kit/commit/3e073f72cfd0a47c87bf09d8b20c64ef54907430))
* fix filtered data on zooms ([99e2f90](https://github.com/awslabs/iot-app-kit/commit/99e2f90aecdbaaa354e62e76b22c88a8530c1509))
* hidden and highlighted datastreams persist correctly ([5a85bb7](https://github.com/awslabs/iot-app-kit/commit/5a85bb7d40d07dce439a1bfa15550d8893089cbd))
* improve properties panel styling ([f3de67e](https://github.com/awslabs/iot-app-kit/commit/f3de67e73c7197c6bf63254c93476475661738b0))
* react-component Chart story book is broken ([c273ad5](https://github.com/awslabs/iot-app-kit/commit/c273ad529a7d78f887a2b8c64b50f76bfc018fc2))
* **react-components:** fix global and chart store persistence ([83f1345](https://github.com/awslabs/iot-app-kit/commit/83f13452cbf350639cc2cc576d47a26138d58832))
* **react-components:** refactor legend table into modules ([f5eed70](https://github.com/awslabs/iot-app-kit/commit/f5eed7068b70ae9305782f07b08115294b26a3b7))
* realistic dev experience on storybook ([377d64a](https://github.com/awslabs/iot-app-kit/commit/377d64a4ead7b0a68d5df47a5df568da7d188021))
* **scene-composer:** 3D model selection broken on first click ([7ee722a](https://github.com/awslabs/iot-app-kit/commit/7ee722ab3cf1aa4a353e7b05c1a9b53f3ac00c88))
* **scene-composer:** fix scene hierarchy in viewer mode ([c8c70fd](https://github.com/awslabs/iot-app-kit/commit/c8c70fdac04d8aab12f5a6a3f19303cb6754d083))
* **scene-composer:** fix sub-model selection ([0a11b9a](https://github.com/awslabs/iot-app-kit/commit/0a11b9a391767fea2d255509ac9377889e812a5c))
* template asset table disables invalid dataTypes ([7cacc1c](https://github.com/awslabs/iot-app-kit/commit/7cacc1cee19fa9c9d116435d377e4bf820ba9ff9))
* yAxis label collides with yAxis name [#2471](https://github.com/awslabs/iot-app-kit/issues/2471) ([85ac6ac](https://github.com/awslabs/iot-app-kit/commit/85ac6ac4586d560e44cadedbffe5b1a187bd8bb8))

## [9.14.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.13.0...root-v9.14.0) (2024-01-18)


### Features

* add CSV download button ([d89b1f8](https://github.com/awslabs/iot-app-kit/commit/d89b1f880491615c023ea84d53b0c843d52315b4))
* async fetchTimeSeriesData ([2b776cc](https://github.com/awslabs/iot-app-kit/commit/2b776ccf73a538abfbcf4a0ba175dca7c2c4aa0c))
* async listAssetPropertiesDescription ([6632db5](https://github.com/awslabs/iot-app-kit/commit/6632db5837e75d8786cb2c2150986d57f4e6ad39))
* changed ui experience of chart legend based on legend position [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([de1f147](https://github.com/awslabs/iot-app-kit/commit/de1f14772b614f67156a34ac64300111a6c55126))
* fetchTimeSeriesData ([1c65191](https://github.com/awslabs/iot-app-kit/commit/1c65191654c726b66cf1e0bcc2df83d620f6d4a5))


### Bug Fixes

* add request settings to fetchTimeSeriesData ([d7cbd9d](https://github.com/awslabs/iot-app-kit/commit/d7cbd9d8bb5a5f56804a7ebce2c87e944bcb6f2b))
* **dashboard:** decrease width of property label in config panel to stop overflow of delete button ([ee027e5](https://github.com/awslabs/iot-app-kit/commit/ee027e5d95946b89bebcd5e3bdc3a82aecd60d0b))
* **dashboard:** for kpi/status disable add of RE when an property is already added ([712c1a7](https://github.com/awslabs/iot-app-kit/commit/712c1a777bc51c69956bfbb855bd0a01a6721e18))
* disable options in legend or yaxis section if visible is false [#2467](https://github.com/awslabs/iot-app-kit/issues/2467) ([b4daa17](https://github.com/awslabs/iot-app-kit/commit/b4daa17735a6ebed582c98d292e7b1c261a65dea))
* **doc-site:** canvas not recognised automatically ([1e42f58](https://github.com/awslabs/iot-app-kit/commit/1e42f5872f863349b51264526d4b74271e811412))
* improved zoom and default values for y axis ([112e5c5](https://github.com/awslabs/iot-app-kit/commit/112e5c58d7e3478dec03dfbb2eb52ec315b4690d))
* make context menu appear on top of chart tooltip ([e1622c8](https://github.com/awslabs/iot-app-kit/commit/e1622c86bf4ead6856e7e1c9be1d5b8a1d6d4d61))
* **react-components:** fix the mouse events ([7c07a37](https://github.com/awslabs/iot-app-kit/commit/7c07a37eb5e8649a6d967c96b297659caad270a8))
* **react-components:** refactor chart to use dataset ([b403789](https://github.com/awslabs/iot-app-kit/commit/b4037897cd4e7169958373bbf61d29c7454706ef))
* removed tanstack table related code ([c8be85d](https://github.com/awslabs/iot-app-kit/commit/c8be85d919faac44441f4b00aa81ac7dbf215599))
* source-iotsitewise batch API options ([6e4d430](https://github.com/awslabs/iot-app-kit/commit/6e4d430a033bbd54eb403a96f04ecb23a7909e36))
* text widget enhancement - 2429 ([0d5a367](https://github.com/awslabs/iot-app-kit/commit/0d5a367c074b12d98aa91a5b5c1ea37e3033c047))
* **V1011333107:** vulnerbility in fast-xml-parser dependabot couldn't resolve ([73d0e79](https://github.com/awslabs/iot-app-kit/commit/73d0e79b8d567d27e32ce947682b47c9885f9deb))

## [9.13.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.12.0...root-v9.13.0) (2024-01-05)


### Features

* **doc-site:** adding doc-site ([743ca50](https://github.com/awslabs/iot-app-kit/commit/743ca509649a31f11334fbbd2785cce1dbb4b735))
* legend table is implemeted using tanstack table ([c92533a](https://github.com/awslabs/iot-app-kit/commit/c92533a342c95618d6dcf7d2a13bdad204bb01de))
* **react-components:** adding a fps display ([48cd9ef](https://github.com/awslabs/iot-app-kit/commit/48cd9efa3e5823086f0b7695886e934cc9303216))
* **react-components:** hide/show properties from legend ([e666cf1](https://github.com/awslabs/iot-app-kit/commit/e666cf1cfba8343d1a5bbb0f38a4341969a18575))
* **ResourceExplorer:** hide properties table when not needed to be displayed ([0fca5e9](https://github.com/awslabs/iot-app-kit/commit/0fca5e9089ac7af52e1d31b2143acb121cb7869b))
* xy-plot y axis lable changes [#2378](https://github.com/awslabs/iot-app-kit/issues/2378) ([48389c3](https://github.com/awslabs/iot-app-kit/commit/48389c3e59305525b11b63233c3a79d4a8e3a78d))


### Bug Fixes

* added aria-label to the config panel text link control for accessibility [#2362](https://github.com/awslabs/iot-app-kit/issues/2362) ([a6f9c22](https://github.com/awslabs/iot-app-kit/commit/a6f9c22e40660e8e30f3b1f65f71f968dc4a0cac))
* **dashboard:** composite model tests run correctly ([d2cbaaf](https://github.com/awslabs/iot-app-kit/commit/d2cbaafef6639b84a8762dda9fccf3d3e86fbefd))
* **dashboard:** for kpi/status disable add of RE when an property is already added ([eff3282](https://github.com/awslabs/iot-app-kit/commit/eff328273955d5e8a4ae815e03855aae6c48e162))
* **dashboard:** increase width of property label in config panel to span width of panel ([642f7c6](https://github.com/awslabs/iot-app-kit/commit/642f7c6ad5b50d20009ba21067255aab1e8d4780))
* **dashboard:** padding for tabs in config panel + remove scroll in threshold panel ([d3f969c](https://github.com/awslabs/iot-app-kit/commit/d3f969c092a271e7b26289d0160e0c4901282b1e))
* fix data-zoom behavior for base chart ([0c66a80](https://github.com/awslabs/iot-app-kit/commit/0c66a8016e2aa827ad3093c3ef89d6437e014d18))
* msw batchGetAssetPropertyValueHandler response timeInSeconds values ([5869a00](https://github.com/awslabs/iot-app-kit/commit/5869a009550399ab73b882e2f253aa9c10ec1179))
* msw batchGetAssetPropertyValueHistoryHandler timestamp ([ccf21a7](https://github.com/awslabs/iot-app-kit/commit/ccf21a73a1391ac9da3ccceb18916897ef51066e))
* programatically linked the color-picker id with color label in configPanelText [#2361](https://github.com/awslabs/iot-app-kit/issues/2361) ([ab05475](https://github.com/awslabs/iot-app-kit/commit/ab0547539bb9b47130c66c0520d7c0bce9cf5aee))
* **react-components:** clear ymin and ymax was getting emitted on every loop ([8609a48](https://github.com/awslabs/iot-app-kit/commit/8609a487a1b7ba9d4884750a6e6ee8819873a4b1))
* **react-components:** confining tootip to the chart area ([1bff986](https://github.com/awslabs/iot-app-kit/commit/1bff986999dc88a261caed22c3a77aab892219ad))
* **react-components:** performance fixes for chart component ([403f2bf](https://github.com/awslabs/iot-app-kit/commit/403f2bf6beea75e1e1668e33c60a6149ef1b5436))
* **react-components:** remove data points after a threshold ([cd6a189](https://github.com/awslabs/iot-app-kit/commit/cd6a18913d2c0f3fb8b066dffbdf48f38d6955e4))
* **react-components:** remove padded y axis code ([7e3d365](https://github.com/awslabs/iot-app-kit/commit/7e3d365d07dd4b074c6dda6d2934b7cb05fcde55))
* **react-components:** remove secondary selection state when using TCs or gestures ([3ba4e6a](https://github.com/awslabs/iot-app-kit/commit/3ba4e6a1cc0c2a7fd48eb130f3b72262fcd97ad5))
* **react-components:** updates for x-axis panning performance ([07a7624](https://github.com/awslabs/iot-app-kit/commit/07a7624d77962c38e7457abea1602082ebf2f5a3))
* relative month test ([5c6e262](https://github.com/awslabs/iot-app-kit/commit/5c6e262b16b8a739c4a4d9e823453094242c67d9))


### Performance Improvements

* improve raw batching ([263282d](https://github.com/awslabs/iot-app-kit/commit/263282d751d334745ddc3079d6a8959b5cf1e6d9))
* increase batch entry and result size ([cf5e978](https://github.com/awslabs/iot-app-kit/commit/cf5e9785418c801e89cc2afa2a626e16547a8a7c))

## [9.12.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.11.0...root-v9.12.0) (2023-12-18)


### Features

* chat legend enhancement [#2277](https://github.com/awslabs/iot-app-kit/issues/2277) ([b1ca8ae](https://github.com/awslabs/iot-app-kit/commit/b1ca8aeda126f09f371e23133fa600d5b56c9b21))
* **dashboard:** add colors to trendcursors ([a890c7d](https://github.com/awslabs/iot-app-kit/commit/a890c7db39df1a836312ac4050c41e2f4fdd9f4a))
* **dashboard:** add logging for custom y-axis ([582fddf](https://github.com/awslabs/iot-app-kit/commit/582fddfa3ccca07e2ffd2b51047d989685a5940c))
* **dashboard:** add logging for query editor ([d115606](https://github.com/awslabs/iot-app-kit/commit/d115606d2e974e1fcdd9111d6c470b97589280cc))
* **dashboard:** add metrics for query editor usage ([e8ac4f9](https://github.com/awslabs/iot-app-kit/commit/e8ac4f9c7a47d9f776ef057cb2c5cf13628b78e9))
* first click on paginate timeline should move backward from current time duration ([5f9aa42](https://github.com/awslabs/iot-app-kit/commit/5f9aa42aef52d1bade596d0b8cfa1d58d51cce52))
* fix tabs on config panel present that are unusable [#2308](https://github.com/awslabs/iot-app-kit/issues/2308) ([4d3b6d5](https://github.com/awslabs/iot-app-kit/commit/4d3b6d5fea6b271bfdbce13679b0fa4b4d0cdf60))
* lint accessibility ([0db36ef](https://github.com/awslabs/iot-app-kit/commit/0db36ef6a07fe5e0709d17081dffa7d23669e2fe))
* **ResourceExplorer:** hide properties table when not needed to be displayed ([bcf36b1](https://github.com/awslabs/iot-app-kit/commit/bcf36b1080393ba0d5126d79e38b373ffcbd2442))
* **scene:** move add ground plane to settings ([3b0c59b](https://github.com/awslabs/iot-app-kit/commit/3b0c59b13243892a657f8ed975448babe7a6caec))
* **scene:** textures for backgrounds and planes ([0b2104a](https://github.com/awslabs/iot-app-kit/commit/0b2104ae299f899b88ac4d77696b075793ceed1d))
* xy-plot & bar-chart allow only numerical datatypes [#1952](https://github.com/awslabs/iot-app-kit/issues/1952) ([10b057a](https://github.com/awslabs/iot-app-kit/commit/10b057a1e088ad9ecdc710af73dfd947398659f3))


### Bug Fixes

* add left border to configuration panel ([7f684d1](https://github.com/awslabs/iot-app-kit/commit/7f684d17b2945f67982474ad9d36beaa966999f0))
* added aria label to dashboard threshold delete button ([ff94bb0](https://github.com/awslabs/iot-app-kit/commit/ff94bb0e5c367ec02a572938a08dcf859e4820f5))
* bar chart break due to css property of line chart ([512e48c](https://github.com/awslabs/iot-app-kit/commit/512e48c5f61e7ac8b09a25551702136f0a01c918))
* broken search results disabled state ([38ef2be](https://github.com/awslabs/iot-app-kit/commit/38ef2beb9d7673e8cc0438424631343d5a4eb3ca))
* dashboard settings to set correct columns and rows [#2313](https://github.com/awslabs/iot-app-kit/issues/2313) ([cd952c5](https://github.com/awslabs/iot-app-kit/commit/cd952c5e6462fa25350ccc28eb261a70bfa29d98))
* **dashboard:** modeled datastreams are displayed in msw ([a2833a1](https://github.com/awslabs/iot-app-kit/commit/a2833a174ccb8f66b547451f92ff2b6c6194beca))
* **dashboard:** use more descriptive name for the settings label ([2d0b36c](https://github.com/awslabs/iot-app-kit/commit/2d0b36c29cad264f45f3e7178dcd3c296692c69e))
* **ResourceExplorer:** filter out invalid twinmaker execute query search results ([e616be4](https://github.com/awslabs/iot-app-kit/commit/e616be4c6d8e2d8a01b5ba931a57307ea8b7f307))
* table resize button aria label ([1618d50](https://github.com/awslabs/iot-app-kit/commit/1618d50a713cb1be8b9a74899144ca92cd9ec5f1))


### Performance Improvements

* increase batch size ([1fefe81](https://github.com/awslabs/iot-app-kit/commit/1fefe81cecf8bbeffebb5e89b73cab3494beba21))
* initial Animator implementation ([3b30cd2](https://github.com/awslabs/iot-app-kit/commit/3b30cd2c236704145ac29b2cf0222a28de9a0959))
* prevent duplication of simultaneous data stream metadata requests ([bfbe7b2](https://github.com/awslabs/iot-app-kit/commit/bfbe7b23c968e367423cf8a81504e2773e5460bc))


### Reverts

* "perf: increase batch size" ([636a539](https://github.com/awslabs/iot-app-kit/commit/636a539fcba8c62871b1b60b117ab2881124ac81))

## [9.11.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.10.0...root-v9.11.0) (2023-12-07)


### Features

* adding feature toggle system implementation ([6df3ea0](https://github.com/awslabs/iot-app-kit/commit/6df3ea053ef27a104424d8cb2b12eb0271d4b2f3))


### Bug Fixes

* **core:** increase cache and min request interval to prevent making many requests for near now data ([403fec9](https://github.com/awslabs/iot-app-kit/commit/403fec94c16a68adbae04134dc4ee69bedb4f4d6))
* grab asset composite property correctly ([1c57017](https://github.com/awslabs/iot-app-kit/commit/1c57017f3b3c78c62fc3a3cdfc6f4fa01a09f745))
* prevent fetching ([85a7b35](https://github.com/awslabs/iot-app-kit/commit/85a7b35f9b5303fe037de5636a75827335ffdaba))
* use datastream id as legend table row key ([b4c11bc](https://github.com/awslabs/iot-app-kit/commit/b4c11bcd40400d4f7eae680d5ab521f00b638f64))

## [9.10.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.9.1...root-v9.10.0) (2023-12-07)


### Features

* tabs on config panel present that are unusable [#2308](https://github.com/awslabs/iot-app-kit/issues/2308) ([9f0b63d](https://github.com/awslabs/iot-app-kit/commit/9f0b63d81446a1fce4a4635804cff9a6c06c9387))


### Bug Fixes

* **composer:** trigger onSceneLoaded after dynamic scene is loaded ([4c9453a](https://github.com/awslabs/iot-app-kit/commit/4c9453a12211a878a850d71eee7cb8bd3d4a5fe3))
* **dashboard:** color picker has keyboard focus and can be interacted with ([1e4547e](https://github.com/awslabs/iot-app-kit/commit/1e4547e3aa2bc521c315391cabac569beab10508))
* **react-components:** trendcursor hotkey indicates addition state ([c9d34e0](https://github.com/awslabs/iot-app-kit/commit/c9d34e0ef4ba891522336f05718d1808442949e3))
* updates for performance issues ([8863b9a](https://github.com/awslabs/iot-app-kit/commit/8863b9a80d7a8284aa4732ed25298d165a769ea9))

## [9.9.1](https://github.com/awslabs/iot-app-kit/compare/root-v9.9.0...root-v9.9.1) (2023-12-06)


### Bug Fixes

* bump charts core version ([fba03c6](https://github.com/awslabs/iot-app-kit/commit/fba03c600f2e1dc3c5bd199b658174e5de2dcd95))
* **dashboard:** clear selected properties on asset change ([05f0374](https://github.com/awslabs/iot-app-kit/commit/05f037402d785d9f6d449c88170f2ad91f2735d9))
* **dashboard:** listAssetPropertiesCall for msw + path objects for all assetModels ([b207547](https://github.com/awslabs/iot-app-kit/commit/b20754707774e19e107f1378cecaaba38384e4b3))
* **dashboard:** refactor component library to use list elements ([71a0b29](https://github.com/awslabs/iot-app-kit/commit/71a0b29e2b37685c5fcaa861a3c31291018e65ec))
* missed rebase markers ([b9e158a](https://github.com/awslabs/iot-app-kit/commit/b9e158a1c723e5f5bd1438d54841737f742c27c9))
* update dependency to not include styles ([e09651e](https://github.com/awslabs/iot-app-kit/commit/e09651e5c065458a269d8d95d1c9c959c5f95ace))

## [9.9.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.8.0...root-v9.9.0) (2023-12-05)


### Features

* added the error state for resource explorer tables [#2242](https://github.com/awslabs/iot-app-kit/issues/2242) ([351e142](https://github.com/awslabs/iot-app-kit/commit/351e1420508c37dddb37fb2fe9f2225c51365760))
* added title in bar and status timeline [#2312](https://github.com/awslabs/iot-app-kit/issues/2312) ([c6ea993](https://github.com/awslabs/iot-app-kit/commit/c6ea993c9d50bcd5fe75c7a5ec424d158fdf9c85))
* missing empty state for workspaces dropdown [#2305](https://github.com/awslabs/iot-app-kit/issues/2305) ([11edf2d](https://github.com/awslabs/iot-app-kit/commit/11edf2d01a4c6406810efbdc1977f2c10e379506))


### Bug Fixes

* accessibility fixes ([4caa534](https://github.com/awslabs/iot-app-kit/commit/4caa53433d3d9df858ee25d71d3b92b93cdf7617))
* accessible property filter labels ([30554a1](https://github.com/awslabs/iot-app-kit/commit/30554a1f59f2462b1a5334424866f67ee4507455))
* **composer:** improve load sub model latency ([23ad9ad](https://github.com/awslabs/iot-app-kit/commit/23ad9ada3b89295b66738cdfc297dc6e0bf72a03))
* **dashboard:** bold, italics, underline interactable by keyboard ([ccba8c6](https://github.com/awslabs/iot-app-kit/commit/ccba8c6433967e40b07a6ed78568a8d580def221))
* fixed property section tooltip gets cut off if property has longer name [#2293](https://github.com/awslabs/iot-app-kit/issues/2293) ([e496e4d](https://github.com/awslabs/iot-app-kit/commit/e496e4d52c566cab3e17e332ef3b587cd9fcc094))
* missing pagination handling for searched model data [#1994](https://github.com/awslabs/iot-app-kit/issues/1994) ([81d5269](https://github.com/awslabs/iot-app-kit/commit/81d5269a0bd0349d95b2495330401623afd5b5b0))
* panning on chart widget moving [#2294](https://github.com/awslabs/iot-app-kit/issues/2294) ([9cefd9a](https://github.com/awslabs/iot-app-kit/commit/9cefd9a2107465ccde1468f1e0e2a271b0d30381))
* **react-components:** add echarts extension for handling custom-y-axis ([b481beb](https://github.com/awslabs/iot-app-kit/commit/b481beb1e5a9a014a688d264aa3cb3addc4f51c7))
* **react-components:** add fallback for property name to id ([a1024d4](https://github.com/awslabs/iot-app-kit/commit/a1024d459fd24d8c7056326706b41ff505eb41ec))
* **react-components:** mock date in viewport adapter date tests ([06200dd](https://github.com/awslabs/iot-app-kit/commit/06200dda24e5956c6db0a2b4bfe750cdf53c8592))
* remove line chart tweening animation ([d9e894b](https://github.com/awslabs/iot-app-kit/commit/d9e894b0f651ad24dce87d7f7c4dbe28f43f43e0))
* resolved delete button invisible issue [#2164](https://github.com/awslabs/iot-app-kit/issues/2164) ([3ec8743](https://github.com/awslabs/iot-app-kit/commit/3ec8743115848175682e5a8c80bf605d6a2669a7))
* time machine enable in edit and preview mode ([c30d68b](https://github.com/awslabs/iot-app-kit/commit/c30d68b65dbf4003bc19220fa97a0b9b4b4dac40))
* updated the resource explorer default width [#2292](https://github.com/awslabs/iot-app-kit/issues/2292) ([149ec60](https://github.com/awslabs/iot-app-kit/commit/149ec60e9055851ca8d7abdd787f2762cdcfc8ea))

## [9.8.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.7.0...root-v9.8.0) (2023-11-25)


### Features

* **dashboard:** composite model api calls and updated SDK ([9c23a38](https://github.com/awslabs/iot-app-kit/commit/9c23a383a46895bab05eccc265dc61318c767b49))


### Bug Fixes

* added experimental plugin exports ([4e44dbd](https://github.com/awslabs/iot-app-kit/commit/4e44dbd83c5734facfe342162ebac8a3fc3a1575))

## [9.7.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.6.0...root-v9.7.0) (2023-11-21)


### Features

* added date time formatter in resource explorer table [#2140](https://github.com/awslabs/iot-app-kit/issues/2140) ([10137b7](https://github.com/awslabs/iot-app-kit/commit/10137b780ec3ac1fb3f1dc5d120493345ce20e1a))
* added delete option for empty widget [#2139](https://github.com/awslabs/iot-app-kit/issues/2139) ([bbab890](https://github.com/awslabs/iot-app-kit/commit/bbab89048dc5b43fd92670c7df98bd38043bbe40))
* charts legend resize drag-handle improvements [#2055](https://github.com/awslabs/iot-app-kit/issues/2055) ([9e9db52](https://github.com/awslabs/iot-app-kit/commit/9e9db524cf1b403c9a64c631751ff862349b7ad2))
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
* experimental plugins registry; logger and metrics recorder plugins ([95b904f](https://github.com/awslabs/iot-app-kit/commit/95b904f281a860b04e145229c7c70fe4be08cba5))
* fake sitewise ([5fc9557](https://github.com/awslabs/iot-app-kit/commit/5fc9557d46fc3ed193862940ee058fd0e49f33e4))
* fixed the add and reset buttons to bottom right [#2114](https://github.com/awslabs/iot-app-kit/issues/2114) ([15108b0](https://github.com/awslabs/iot-app-kit/commit/15108b058302a775b0b9a332d0ff901f81f2e676))
* format latest value time in resource explorer [#2140](https://github.com/awslabs/iot-app-kit/issues/2140) ([51be7da](https://github.com/awslabs/iot-app-kit/commit/51be7da3db56e4641526bb4333a622ae8c93e5df))
* header design update ([700a913](https://github.com/awslabs/iot-app-kit/commit/700a91366ba57d7f6ca4b2058ee308a7317db9eb))
* **react-components:** adding significant digits to trendcursors ([ef4c987](https://github.com/awslabs/iot-app-kit/commit/ef4c987f5142a7be0ec22aae49a31397999b45e2))
* **react-components:** brush zoom ([bddb7e1](https://github.com/awslabs/iot-app-kit/commit/bddb7e1e7b18a2179678fd6bee6a50d0a978d26d))
* remove stretch to fit from dashboard [#2255](https://github.com/awslabs/iot-app-kit/issues/2255) ([e8d7778](https://github.com/awslabs/iot-app-kit/commit/e8d77786719cb30c462f1cf67f2fbfc388189490))
* updated the chart legend ux [#1930](https://github.com/awslabs/iot-app-kit/issues/1930) ([68b8618](https://github.com/awslabs/iot-app-kit/commit/68b8618226c5f9ab0c5da64f7ad9210459809232))
* widget configuration improvements, per property, and general UX [#2243](https://github.com/awslabs/iot-app-kit/issues/2243) ([94f0490](https://github.com/awslabs/iot-app-kit/commit/94f04906d35b814ce6393e2873f9ffd9c905e0b9))


### Bug Fixes

* add tests for CSV ([28c6ca9](https://github.com/awslabs/iot-app-kit/commit/28c6ca94b6efe55b33a30cd2106f4d5536f8a556))
* better disabled states and error handling CSV ([3bae192](https://github.com/awslabs/iot-app-kit/commit/3bae19293b7bedd0dcbfafc999cd6ed1e611dccc))
* bugfix for overlapping colors in color palette ([7b4c95b](https://github.com/awslabs/iot-app-kit/commit/7b4c95b45866548f85b10fee3167a35354d73cfb))
* change test id for download button ([88c16b9](https://github.com/awslabs/iot-app-kit/commit/88c16b9b1ca12dca37a910b0ce4d226838fd261c))
* chart gesture performance ([cdd52c6](https://github.com/awslabs/iot-app-kit/commit/cdd52c627e99f4e712475b90d2869b16a5684038))
* **composer:** cannot delete node entity with child ([a7976bb](https://github.com/awslabs/iot-app-kit/commit/a7976bb55afbc83d0fd3848ef1eb1fd6a81dedbc))
* copy paste issue on macos [#2136](https://github.com/awslabs/iot-app-kit/issues/2136) ([b7e8574](https://github.com/awslabs/iot-app-kit/commit/b7e8574d1f3d627694f0b0962565266d2b6ab8dc))
* **dashboard:** bugfix for barchart positioning ([16babf6](https://github.com/awslabs/iot-app-kit/commit/16babf6667c886597d527534ddd7e9b355e2f988))
* **dashboard:** conditionally start msw for mocked data stories ([b9fb349](https://github.com/awslabs/iot-app-kit/commit/b9fb349546ddc1bca9b2dbc0d934f5769836ae91))
* **dashboard:** csv  will download if viewport has no data ([b0cbbad](https://github.com/awslabs/iot-app-kit/commit/b0cbbad5348d4000674cf0e2b1d20e2782428b41))
* **dashboard:** remove hide/show from dashboard definition and config panel ([1919341](https://github.com/awslabs/iot-app-kit/commit/191934129f1c64ca52bb5333d882421aeeab91b0))
* **dashboard:** toggle from hide to show for unmodeled datastreams ([cea7c30](https://github.com/awslabs/iot-app-kit/commit/cea7c30cce8fa685cd9a0a9a8077c4e1d6b9ec4f))
* **dashboard:** update styling for model based query editor ([cb0d969](https://github.com/awslabs/iot-app-kit/commit/cb0d969e528b74c3c7d429a7b4a3335e004af9d0))
* download button and zoom undo button ([a60a81b](https://github.com/awslabs/iot-app-kit/commit/a60a81b6f6e64b3113b14edcf6efe9fe82ef47f7))
* immediately change the line chart viewport when updating relative time range ([5ebb2f1](https://github.com/awslabs/iot-app-kit/commit/5ebb2f1597595bf66c63850835e2a64752e4ef9b))
* immediately change the line chart viewport when updating relative time range ([95b5b7d](https://github.com/awslabs/iot-app-kit/commit/95b5b7d80914a757613c3263f7bf0218acb355b4))
* increase the text widget initial size ([7d7918d](https://github.com/awslabs/iot-app-kit/commit/7d7918d50b10b04f75e0d9265da111a06c482600))
* missing raect key internal space between ([9cbb214](https://github.com/awslabs/iot-app-kit/commit/9cbb214035f1434719cbbb94ac0360103fb232c6))
* pagination default pagesize is set to 250 and error message update [#2242](https://github.com/awslabs/iot-app-kit/issues/2242) ([3a2d632](https://github.com/awslabs/iot-app-kit/commit/3a2d632e8430fb837656a43b030ef6eb35468417))
* panel resizing issue fix [#2256](https://github.com/awslabs/iot-app-kit/issues/2256) ([21dcb51](https://github.com/awslabs/iot-app-kit/commit/21dcb51fd8b05f4df4b5a8c4d6097ac97073d922))
* pasting at the edge of dashboard should paste widget within the grid [#2141](https://github.com/awslabs/iot-app-kit/issues/2141) ([ad1dde7](https://github.com/awslabs/iot-app-kit/commit/ad1dde7282983d7d6710c25b2399851c0ad03df7))
* **react-components:** adding handling of Yminmax for TC and fixing styling issues ([1581b9f](https://github.com/awslabs/iot-app-kit/commit/1581b9fb7cb77037fa830eaba07155aa253cfa33))
* **react-components:** echarts grab on canvas update cursor and tooltip ([bfef4e8](https://github.com/awslabs/iot-app-kit/commit/bfef4e878e9a47a9ed1f578767a04b03e6bc8a5e))
* **react-components:** pagination can move forward on first click from relative range ([fcb04f7](https://github.com/awslabs/iot-app-kit/commit/fcb04f73c3bf3af8a467169a3e9cbd6a6743d462))
* **react-components:** removing animation for series lines ([b245995](https://github.com/awslabs/iot-app-kit/commit/b245995766c4f2b83bca219e9d8e6f806912cd6c))
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

## [9.6.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.5.0...root-v9.6.0) (2023-11-16)


### Features

* **composer:** enable auto query feature ([661af11](https://github.com/awslabs/iot-app-kit/commit/661af1188f690d6b2a33f26a6105b5fecdc539b9))
* **scene:** add ground plane button ([c282c41](https://github.com/awslabs/iot-app-kit/commit/c282c41e5f96c403a7cbbea95dc5a759ab2d4193))


### Bug Fixes

* **composer:** bug fixes for dynamic scene ([10046da](https://github.com/awslabs/iot-app-kit/commit/10046daf2ef3ea2d161321a7794d019db3ccd76f))
* full UI test suite CI ([72fc3bd](https://github.com/awslabs/iot-app-kit/commit/72fc3bd3c1b4ba62ccda842c0f918d51ec9f4feb))
* restrict [@iot-app-kit](https://github.com/iot-app-kit) imports ([780f404](https://github.com/awslabs/iot-app-kit/commit/780f404f20475dab7d0e21af271b5f3f98defee5))
* update test run command for ui tests ([a5d0433](https://github.com/awslabs/iot-app-kit/commit/a5d043316bf32e0a97897af7d5c3c06ff33e8299))
* **video-player:** toggle playback mode and update time range ([a033cb0](https://github.com/awslabs/iot-app-kit/commit/a033cb01824ccff6a63eb4e62d019b691b085a0a))

## [9.5.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.4.0...root-v9.5.0) (2023-11-08)


### Features

* **scene-composer:** support tag occlusion ([3764013](https://github.com/awslabs/iot-app-kit/commit/376401335e6c4d4646bfc49260e35a41a9a43646))


### Bug Fixes

* **composer:** get entityBinding in different query ([b4e4a22](https://github.com/awslabs/iot-app-kit/commit/b4e4a22cebeeb39027052c47bb8647bae836d3c2))
* **composer:** persist new dynamic node world transform ([cb6704f](https://github.com/awslabs/iot-app-kit/commit/cb6704f5b8767bfacad8244415daa2283efd6250))
* **composer:** tag style field is empty when creating a new tag instead of info ([595147b](https://github.com/awslabs/iot-app-kit/commit/595147bc564b9599598c93059bc6ccf62b2c2b7e))
* **example:** roll back unneeded package json changes ([39f8324](https://github.com/awslabs/iot-app-kit/commit/39f8324495faba3717d29c6076cf5da97649b56c))
* **react-components:** update viewportAdapter tests for month and minutes ([a269626](https://github.com/awslabs/iot-app-kit/commit/a269626bd3e78a8b5f515b8f3d590848e9f70725))
* **scene-composer:** sync tag icon from Matterport ([e0aa7a7](https://github.com/awslabs/iot-app-kit/commit/e0aa7a72db0dc1bcbc3a9c7c7ae87e4b5c061b84))
* **scene:** add overlay close button back ([24f0d94](https://github.com/awslabs/iot-app-kit/commit/24f0d9427a62ea7174983e10af75fe6f6dcb363a))
* **Scene:** animation components added at correct time behind flag ([da149cc](https://github.com/awslabs/iot-app-kit/commit/da149cc5456f841a98581be82b792f52f062b85a))
* **scene:** comment tweak ([234b703](https://github.com/awslabs/iot-app-kit/commit/234b703f8991166e831b385c2cdf6bfd8685fe2a))
* **scene:** ensure the selected overlay is always the one at front ([7a15943](https://github.com/awslabs/iot-app-kit/commit/7a15943accdbae27059e043cf8a55dda525531c1))
* **scene:** only show selected tags overlay ([20b7c57](https://github.com/awslabs/iot-app-kit/commit/20b7c578bd6b4e44bf11109e0f55f9212328b812))
* **scene:** stop scene composer from forcing dark mode on page ([40ef97b](https://github.com/awslabs/iot-app-kit/commit/40ef97b4a6b2baa376fd129991b4672369631323))
* **TMDT:** change role name to match console, revert GLB code to fix bug, add error handling for IAM ([66f5d83](https://github.com/awslabs/iot-app-kit/commit/66f5d83d3800e07efd3e54b912dbfbbda4ea7f25))

## [9.4.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.3.0...root-v9.4.0) (2023-10-26)


### Features

* **component:** allow disable/enable layer auto refresh ([5278b9c](https://github.com/awslabs/iot-app-kit/commit/5278b9c8eafb01510484b75cebd10e05bb921421))


### Bug Fixes

* broken tooltip imports ([8a25332](https://github.com/awslabs/iot-app-kit/commit/8a25332379e647911504cd75ff913f6b911a43c4))

## [9.3.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.2.0...root-v9.3.0) (2023-10-26)


### Features

* add line style thickness per property ([fb19652](https://github.com/awslabs/iot-app-kit/commit/fb196521ba7b35019828e1c9f2c4383841e4620b))
* added line style customization per property ([abe942f](https://github.com/awslabs/iot-app-kit/commit/abe942f7a95458087cd1f7075091ee3acca41ada))
* added widget text in the widget panel [#2036](https://github.com/awslabs/iot-app-kit/issues/2036) ([a46da1d](https://github.com/awslabs/iot-app-kit/commit/a46da1dc2166913bfc9ba81d5eec4388d17399d8))
* charts legend resize drag handle improvements [#2055](https://github.com/awslabs/iot-app-kit/issues/2055) ([0c69b75](https://github.com/awslabs/iot-app-kit/commit/0c69b755e8b1200238dcaac90a44ad07ab222b23))
* **component:** utils to handle light component in entity ([26a1494](https://github.com/awslabs/iot-app-kit/commit/26a1494e5787a54f1292408f69ecac514100704e))
* **composer:** append scene node action creates entity for dynamic scene ([4ebe88a](https://github.com/awslabs/iot-app-kit/commit/4ebe88a6db092e4943db702c90961cf57fb100a3))
* **composer:** support tag custom icon in entity ([dc07a1d](https://github.com/awslabs/iot-app-kit/commit/dc07a1dc3a2634b4d62de334b42499cd2e6f3060))
* **composer:** utils to handle subModelRef component in entity ([d425c57](https://github.com/awslabs/iot-app-kit/commit/d425c5706790575dda50be733fd5a618cbafff0e))
* decimal round of in resource table ([a5da972](https://github.com/awslabs/iot-app-kit/commit/a5da9726649ca81a578efd365ba05d0dbe302b55))
* handle long properties name in properties section in config panel [#1984](https://github.com/awslabs/iot-app-kit/issues/1984) ([fda011f](https://github.com/awslabs/iot-app-kit/commit/fda011f83e610a14cd6115ebf6aaf88b32589091))
* **react-components:** refactoring echarts ([83e505f](https://github.com/awslabs/iot-app-kit/commit/83e505ffaa9d31fe476be4d7f8029b5ae7c5a3ea))
* **scene:** add fog settings to scene ([78c6e75](https://github.com/awslabs/iot-app-kit/commit/78c6e756ff7acfeace2be2473ae6c4defcb94af6))
* **scene:** enable scene backgrounds ([e630ff2](https://github.com/awslabs/iot-app-kit/commit/e630ff21ef69010e1ac1cac705460e581c0310eb))


### Bug Fixes

* added proper error handling for S3 Bucket ACL issues found by customer, updated README ([bbc0aa3](https://github.com/awslabs/iot-app-kit/commit/bbc0aa388041a76b0c79e6202c44431eeae4a9af))
* cloudscape dependency resolution failure ([7b13ed4](https://github.com/awslabs/iot-app-kit/commit/7b13ed40026182e900f654688dfa696111fd5944))
* **composer:** custom tag rendered slightly off the center ([0cecac1](https://github.com/awslabs/iot-app-kit/commit/0cecac14f2ff201f3f5eb16446b7aab43acf10ce))
* **composer:** update Polaris package version ([592c435](https://github.com/awslabs/iot-app-kit/commit/592c4359e325eb4149a0f872b30f87a0305feb5b))
* **dashboard:** tc sync is broken in prod ([c357902](https://github.com/awslabs/iot-app-kit/commit/c3579027e3bb3e38af4042bc6749ffb648a62e71))
* do not override selected data stream preferences ([02b80fe](https://github.com/awslabs/iot-app-kit/commit/02b80fed798ad859a1e5aa0993ea479aa48e0b38))
* **react-components:** fixing the prod issue of dashboard throwing exception ([7ecd252](https://github.com/awslabs/iot-app-kit/commit/7ecd2526ed5c07f793ec5e97b1d3eb5595e67a7d))
* **react-components:** hitbox spans entire pagination button ([6a5b2f8](https://github.com/awslabs/iot-app-kit/commit/6a5b2f8eaf237edc4aaae414765f5f186ce09c6a))
* **react-components:** pagination over time + tooltip ([ff052c9](https://github.com/awslabs/iot-app-kit/commit/ff052c94fa9f57ac8138d025301a384ab217b258))
* **react-components:** toggle legend hides container ([8d0ae53](https://github.com/awslabs/iot-app-kit/commit/8d0ae53981698bc8121cb0e40831b9d61e693075))
* **react-component:** updating TC to have a drag area instead of just drag on the line ([05068bd](https://github.com/awslabs/iot-app-kit/commit/05068bddfd3a7ff0876550a11263496765b51080))
* **scene composer:** restoring dark mode in stotybook ([94e9ac4](https://github.com/awslabs/iot-app-kit/commit/94e9ac4e48762d5389c1fead82938d5ed90857a3))
* **scene composer:** show correct Icon field for tags with Custom Style ([a2239b8](https://github.com/awslabs/iot-app-kit/commit/a2239b86f31fcfcf138a4e7b2305f80958baa641))
* **scene-composer:** add scroll bar to show all tag icons by default ([15c5dee](https://github.com/awslabs/iot-app-kit/commit/15c5deef876eb6af9d4332f3944aeead31412a59))
* **scene-composer:** restore the grid line colors ([be53320](https://github.com/awslabs/iot-app-kit/commit/be53320c4b553f26d3470dd9bf701fa45b85fd7c))
* synchronize intervals when new intervals are created ([cbc0fa6](https://github.com/awslabs/iot-app-kit/commit/cbc0fa69c0aac46f2e63386568a23c4c485c7beb))
* synchronize requests after switching tabs ([14f89d9](https://github.com/awslabs/iot-app-kit/commit/14f89d982887db3cd61886c32ec2aa27997f8964))

## [9.2.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.1.0...root-v9.2.0) (2023-10-17)


### Features

* set tagStyle flag to true for viewer ([af5357f](https://github.com/awslabs/iot-app-kit/commit/af5357f53e59ed227319c0a37061b4b07b62584e))
* setting the sizes, and sizing behavior of the left and right side panels within the dashboard ([8cec7c0](https://github.com/awslabs/iot-app-kit/commit/8cec7c070ab401d71397676c25037ad28f0168b5))


### Bug Fixes

* **composer:** floating toolbar orientation dependent on screen size ([228037d](https://github.com/awslabs/iot-app-kit/commit/228037da8351499be142b75fc6b62aefc9047ee2))
* **core:** fix for duplicate data per timestamp issue ([9cca8b1](https://github.com/awslabs/iot-app-kit/commit/9cca8b1767584b770fe08d4da24b20c4a0fc7a40))
* **react-components:** echarts grab on canvas update cursor and tooltip ([a29da3a](https://github.com/awslabs/iot-app-kit/commit/a29da3a08a769137610bc37efde5605bf6b62dc2))
* synchronize batching ([dd0c0c6](https://github.com/awslabs/iot-app-kit/commit/dd0c0c6d0b17f4662ef370633ccd300899f9c106))

## [9.1.0](https://github.com/awslabs/iot-app-kit/compare/root-v9.0.0...root-v9.1.0) (2023-10-13)


### Features

* **composer:** convert nodes to entities UI ([43f5e66](https://github.com/awslabs/iot-app-kit/commit/43f5e663efb0e517a2f1e0badb369a43438b0675))
* **composer:** utils to handle model shader component in entity ([95a4be6](https://github.com/awslabs/iot-app-kit/commit/95a4be668b51d413589b16b7edde67fdd40375d1))
* **scene composer:** fix for icon rules and save icon metadata ([0ac8508](https://github.com/awslabs/iot-app-kit/commit/0ac85082391d34731fafa73f826309e66d9f6000))
* side-panels toggle open hit and tooltip on mouseover [#2003](https://github.com/awslabs/iot-app-kit/issues/2003) ([a974964](https://github.com/awslabs/iot-app-kit/commit/a9749645567611a430113071fb2cfcb7bb93b2a3))


### Bug Fixes

* **composer:** split overlay content into parts ([328a33c](https://github.com/awslabs/iot-app-kit/commit/328a33c0fc3ad80666476099d9e49768fca03b2b))
* **dashboard:** fix toggle hide thresholds ([0abb1b2](https://github.com/awslabs/iot-app-kit/commit/0abb1b24d6117ae13e27fe1b1e02ee9684cf0962))
* **dashboard:** improve widget drag and resize ([fcdc586](https://github.com/awslabs/iot-app-kit/commit/fcdc5862fc558f136d510eaa85e241daa61d9988))
* **dashboard:** update unmodeled latest value to timestamp.timeInSeconds ([70bd004](https://github.com/awslabs/iot-app-kit/commit/70bd0048d7e30274c61b41cfc0334362b9f96042))
* **echarts:** improved x+y axis min and max ([38741e2](https://github.com/awslabs/iot-app-kit/commit/38741e245b450c7e547b10305349f9652ae1872f))
* firefox dnd ([5fd8b4f](https://github.com/awslabs/iot-app-kit/commit/5fd8b4f4eed0039852305d4ba8ebec1f453d1fbb))
* latest value filtering and sorting ([6610382](https://github.com/awslabs/iot-app-kit/commit/66103826b0e157a737cdc2661c4c8bfa5edcb56f))
* line charts colors too quickly choose similar colors ([0af5465](https://github.com/awslabs/iot-app-kit/commit/0af5465ffc0a7f587a8e4a53487c8fb56c35d36a))
* **react-components:** fixing the xaxis and viewport dependency ([139bcc1](https://github.com/awslabs/iot-app-kit/commit/139bcc15aa219c1906544086ab6bf3d24e4035da))
* style updates and bugfixes for multi y axis ([e11fd3e](https://github.com/awslabs/iot-app-kit/commit/e11fd3eb6629d75b3b2abdb2ad0466d02e66b8ef))

## [9.0.0](https://github.com/awslabs/iot-app-kit/compare/root-v8.1.1...root-v9.0.0) (2023-10-10)


### ⚠ BREAKING CHANGES

* **dashboard:** widget type change from line-scatter-chart -> xy-plot

### Features

* **composer:** add utils to convert all nodes to entities ([4e305d4](https://github.com/awslabs/iot-app-kit/commit/4e305d4841a10d962c0278f60858297297146570))
* resource explorer table preferences columns visibility [#1980](https://github.com/awslabs/iot-app-kit/issues/1980) ([22d7028](https://github.com/awslabs/iot-app-kit/commit/22d70287dce77ae072e425ccbaa4fc2132b63595))
* updated the chart legend ux(spacing, legend border color, width, tooltip) ([390cbe3](https://github.com/awslabs/iot-app-kit/commit/390cbe3414286bd7cfb1f041a2d21264552e7bd3))


### Bug Fixes

* **dashboard:** bar chart default aggregation+resolution ([44fd991](https://github.com/awslabs/iot-app-kit/commit/44fd99128d13053cd48fae2d8c9562d6d8ab4ef2))
* **dashboard:** minor threshold fixes ([5b5c570](https://github.com/awslabs/iot-app-kit/commit/5b5c570f0ab026144e4009663c02ca3e0c948f3c))
* line chart progresses in time ([15876a8](https://github.com/awslabs/iot-app-kit/commit/15876a86e4d3790e41f917758618b3f11cc948c7))


### Reverts

* updated the chart legend ux(spacing, legend border color, width, tooltip) ([6bbe391](https://github.com/awslabs/iot-app-kit/commit/6bbe39103f286ed6f09bd1f4fdd3353dba833e5a))


### Miscellaneous Chores

* **dashboard:** change line-scatter-chart to xy-plot ([70593da](https://github.com/awslabs/iot-app-kit/commit/70593da0638b689f55396488def2c84fdc7dac19))

## [8.1.1](https://github.com/awslabs/iot-app-kit/compare/root-v8.1.0...root-v8.1.1) (2023-10-05)


### Bug Fixes

* add eslint rule for hooks ([de7cc0d](https://github.com/awslabs/iot-app-kit/commit/de7cc0d94ffdb79d3cb2ce622dd322e6d8497d61))
* aggregation and resolution settings ([06207f9](https://github.com/awslabs/iot-app-kit/commit/06207f9204c1a57d390f189e29858b9c8b862b4f))
* **camera:** stop camera view inspector panel from overwriting changes unexpectedly ([37a8122](https://github.com/awslabs/iot-app-kit/commit/37a8122b54ef95f7dca56ad341a5183fd11a05f8))
* **composer:** add aria labels to buttons in hierarchy panel ([24c8c30](https://github.com/awslabs/iot-app-kit/commit/24c8c30594a0961509079bd942763d22d0d9ccdf))
* **dashboard:** chart respects absolute min and max between data and thresholds ([db16712](https://github.com/awslabs/iot-app-kit/commit/db1671225e300a18765d55a8afd1534640d264de))
* default resolution and aggregation ([e5afdc0](https://github.com/awslabs/iot-app-kit/commit/e5afdc025b83013de26b5c3dbac1e5db5e8aca53))
* fix bug, update test ([24c8c30](https://github.com/awslabs/iot-app-kit/commit/24c8c30594a0961509079bd942763d22d0d9ccdf))
* **scene:** fix transform controls being clickable ([b846730](https://github.com/awslabs/iot-app-kit/commit/b846730c0cb4e605d047f6421b0c28472b911cf7))

## [8.1.0](https://github.com/awslabs/iot-app-kit/compare/root-v8.0.2...root-v8.1.0) (2023-10-04)


### Features

* **composer:** add keyboard nav to floating toolbar ([efd375f](https://github.com/awslabs/iot-app-kit/commit/efd375fc7ba23fd7fe7617783f45a140e464ccdb))
* **composer:** utils to handle camera component in entity ([7ad3bf5](https://github.com/awslabs/iot-app-kit/commit/7ad3bf51a7d548edc242a6d2c9de13167ec2d4bb))
* **composer:** utils to handle motion indicator component in entity ([4a1a8b4](https://github.com/awslabs/iot-app-kit/commit/4a1a8b4a972670e56363f445aed7038253e5192d))
* **dynamic scene:** crud functionalities for model ref ([2314926](https://github.com/awslabs/iot-app-kit/commit/2314926f385c44f76243223839f9d3d4f6325c51))
* **scene composer:** icon picker rule changes ([e126b53](https://github.com/awslabs/iot-app-kit/commit/e126b53371a0c3a03a4e7ff1d48f104c9b99c395))


### Bug Fixes

* **composer:** bug fixes for dynamic scene ([2f3b396](https://github.com/awslabs/iot-app-kit/commit/2f3b396bc9aa41c2e4df17b0d9a47863db97f211))
* **composer:** remove useCallback from menu event handlers ([0a7c133](https://github.com/awslabs/iot-app-kit/commit/0a7c13336760f2f0548e8c902a95086fb4d27be4))
* **dashboard:** correctly update aggregation and resolution configs ([e749d48](https://github.com/awslabs/iot-app-kit/commit/e749d48985f9d9d419a98a299ab933273fb45c85))
* **icon rules:** align icon-picker layout with target editor ([536f391](https://github.com/awslabs/iot-app-kit/commit/536f3910d2f50cfa41a80e98b43a43f59d0a249f))
* remove slashes from property alias when requesting latest in query editor ([fbead83](https://github.com/awslabs/iot-app-kit/commit/fbead83ac6765e4fed27b73925a9c4d460dc5a08))
* remove viewport and query from widget render key ([1587e2a](https://github.com/awslabs/iot-app-kit/commit/1587e2aa05887b1e9b1e486c153e8adc74cfde21))
* **scene:** fix camera returning to last target on mode change ([08e608d](https://github.com/awslabs/iot-app-kit/commit/08e608dfffdbdb990beb421ead3a504da607d50f))
* **scene:** remove transform controls from raycast ([9cd9861](https://github.com/awslabs/iot-app-kit/commit/9cd9861768fb538726f22541aa54ef05c0f4adf9))
* update HistoryItemGroup snap ([ff64273](https://github.com/awslabs/iot-app-kit/commit/ff64273d2ec48609a4edb2156a2ea9e4bb04a1b4))
* **video player:** correcting the VideoPlayer export ([18213d7](https://github.com/awslabs/iot-app-kit/commit/18213d7b254355776900c0e6c735ce6a039ac3f5))

## [8.0.2](https://github.com/awslabs/iot-app-kit/compare/root-v8.0.1...root-v8.0.2) (2023-09-30)


### Bug Fixes

* **Dashboard:** fix breaking build due to invalid import ([6690640](https://github.com/awslabs/iot-app-kit/commit/6690640ddc41797a3e1a3bb724974deb2a963db0))

## [8.0.1](https://github.com/awslabs/iot-app-kit/compare/root-v8.0.0...root-v8.0.1) (2023-09-30)


### Bug Fixes

* toggle working linechar ([9ea6117](https://github.com/awslabs/iot-app-kit/commit/9ea61177710b9ece1be169a0c50e1c19fdefb5e6))

## [8.0.0](https://github.com/awslabs/iot-app-kit/compare/root-v7.5.0...root-v8.0.0) (2023-09-30)


### ⚠ BREAKING CHANGES

* **dashboard:** remove line and scatter widgets

### Features

* ability to toggle property visibility in config panel [#1986](https://github.com/awslabs/iot-app-kit/issues/1986) ([560b776](https://github.com/awslabs/iot-app-kit/commit/560b7765c4a4ae8db6d06e70f69b2276844716a8))
* add delete confirm modal for widgets ([84fb016](https://github.com/awslabs/iot-app-kit/commit/84fb01663e37ac5c1ba84a08baf75d1b1a7668f0))
* add filtering ability ([51933bc](https://github.com/awslabs/iot-app-kit/commit/51933bc6cc1a76071ae1287ee7f79072c8d4dac7))
* added empty state for line and scatter chart widgets ([f2662cc](https://github.com/awslabs/iot-app-kit/commit/f2662cc23860d08f1c8fd3cde69e86df4d3c3b6c))
* **composer:** add a11y color picker ([e768a88](https://github.com/awslabs/iot-app-kit/commit/e768a884118768b5080e745ef8113a344dd0d80e))
* dashboard: re-introduce status widget icon [#1977](https://github.com/awslabs/iot-app-kit/issues/1977) ([0b62042](https://github.com/awslabs/iot-app-kit/commit/0b6204289d3dd1d0d3627cac4c9dcb0d330d2369))
* **dashboard:** add echart line-scatter-widget ([076f151](https://github.com/awslabs/iot-app-kit/commit/076f15129b4a1e61b4ef57467031210365ef58cb))
* empty state within the dashboard to help guide users how to create their dashboard ([f59a069](https://github.com/awslabs/iot-app-kit/commit/f59a0693480832cc3af38b8d9addef88309fecce))
* make session token optional for local development ([1a26b36](https://github.com/awslabs/iot-app-kit/commit/1a26b3622d3e8780cc54b1a66fc83aac96ecf2d9))
* preferences for pagination in table widget [#1890](https://github.com/awslabs/iot-app-kit/issues/1890) ([8072232](https://github.com/awslabs/iot-app-kit/commit/8072232240a17274556d208fc22d32a811866517))
* unmodeled data streams ([71bebef](https://github.com/awslabs/iot-app-kit/commit/71bebefebdaefc235ec2ec505bc5f4dd0d1c7f31))


### Bug Fixes

* add more unique colors ([8641b1f](https://github.com/awslabs/iot-app-kit/commit/8641b1f737919b868da7b309cb7ebc6183ef1918))
* **composer:** add aria labels to rules panel ([ff78ab0](https://github.com/awslabs/iot-app-kit/commit/ff78ab0831170be7c5bad53cba0c903d20034aaf))
* **composer:** debounce component update to reduce UpdateEntity error ([4f13db1](https://github.com/awslabs/iot-app-kit/commit/4f13db18ae134c7a95c50ed1d855e9e977f59539))
* **composer:** lock 3d tiles lib to working version ([f719bc4](https://github.com/awslabs/iot-app-kit/commit/f719bc4964e454db16d6c746548b37c092692ca3))
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
* groupable echarts ([d704292](https://github.com/awslabs/iot-app-kit/commit/d704292964e6434450572154c60863fbdb027dc2))
* **ResourceExplorer:** implement toggling on/off of properties visibility ([8666736](https://github.com/awslabs/iot-app-kit/commit/8666736eb4642cadd7efcedd99fc680b4df17f83))
* update component name ([e768a88](https://github.com/awslabs/iot-app-kit/commit/e768a884118768b5080e745ef8113a344dd0d80e))
* update package-lock.json ([e768a88](https://github.com/awslabs/iot-app-kit/commit/e768a884118768b5080e745ef8113a344dd0d80e))
* update unit test ([2276584](https://github.com/awslabs/iot-app-kit/commit/2276584325c75b8aa823d24588fb589b18876699))

## [7.5.0](https://github.com/awslabs/iot-app-kit/compare/root-v7.4.0...root-v7.5.0) (2023-09-26)


### Features

* integrate query editor ([82c36a1](https://github.com/awslabs/iot-app-kit/commit/82c36a1cf4f7c47b45ba32c1f5e15cdf3e132cb4))


### Bug Fixes

* **dashboard:** set initial viewport to 5m ([f7a5684](https://github.com/awslabs/iot-app-kit/commit/f7a568414a772e98ceb03bdac4978173b36ddb47))
* **echarts:** bugs for demo ([b1e57ee](https://github.com/awslabs/iot-app-kit/commit/b1e57ee4b0d768c0a83be24c55b837a8f0fd950d))

## [7.4.0](https://github.com/awslabs/iot-app-kit/compare/root-v7.3.1...root-v7.4.0) (2023-09-25)


### Features

* add fixed width and height to the table ([7005009](https://github.com/awslabs/iot-app-kit/commit/7005009b1e325a8f333b281113ce1cf4745b0b19))
* auto collapse state for both panels ([fc54b1c](https://github.com/awslabs/iot-app-kit/commit/fc54b1cb71979e48dc5440620577ca8a2adc4be6))
* chart fit and finish - match cloudscape colors for axis and labels [#1929](https://github.com/awslabs/iot-app-kit/issues/1929) ([6fe3424](https://github.com/awslabs/iot-app-kit/commit/6fe3424ec90052d2e63a06a34b874958b9c7bf0c))
* **composer:** render tags from layer ([d9c5191](https://github.com/awslabs/iot-app-kit/commit/d9c519114d3e39c3913eb32b23984f8204b756d8))
* **composer:** support sync matterport tag as entities ([7db178a](https://github.com/awslabs/iot-app-kit/commit/7db178a4aee74cbd299dc115c7cf3786dc376800))
* **dashboard:** add widget tile ([13573c5](https://github.com/awslabs/iot-app-kit/commit/13573c59d560e7192159db8751d6818cfebcf531))
* **dashboard:** break out properties sections into tabs ([fb8b685](https://github.com/awslabs/iot-app-kit/commit/fb8b685f1d6ea8459c40637f12f0cf6ddc75aa55))
* **dashboard:** change dashboard viewport default from 5m to 10m ([803d9a4](https://github.com/awslabs/iot-app-kit/commit/803d9a4944f6a55cb2e0e9691ddc3e537966c501))
* **dashboard:** empty widget configuration panel ([72bc7e3](https://github.com/awslabs/iot-app-kit/commit/72bc7e32a373a724077e1b7ba0d9f671af4495eb))
* **dashboard:** line symbol ([bba8e8d](https://github.com/awslabs/iot-app-kit/commit/bba8e8d392f73b3e52109bad1557cda4ef00221c))
* **dashboard:** new line-scatter-chart ([53768b9](https://github.com/awslabs/iot-app-kit/commit/53768b911a13066b9527c88f0e95a620f0025f7a))
* **dashboard:** update collapsible side panels ([1495451](https://github.com/awslabs/iot-app-kit/commit/149545160551174af83ce3ddb2a61f1a61977c94))
* **dynamic scenes:** save node updates to entities ([0bb2445](https://github.com/awslabs/iot-app-kit/commit/0bb2445fb39659ca970c51319a42cd2d0ff95360))
* **dynamic scenes:** update entities using dynamic scenes ([8eee582](https://github.com/awslabs/iot-app-kit/commit/8eee582e039a5cb2a3e25c81f822a4ecca95672c))
* **echarts:** allow scroll left and right ([5d2341e](https://github.com/awslabs/iot-app-kit/commit/5d2341e71f531556ac8147e1a0742233992ed82d))
* **first Person:** proof of using pointer lock for a first person view ([391eddd](https://github.com/awslabs/iot-app-kit/commit/391edddd5ab3c56be2e394aec06346dfbc29b776))
* **propertyName:** add copy button and textarea ([7c0eaf4](https://github.com/awslabs/iot-app-kit/commit/7c0eaf432e40e25a5319a29e7546442d81e8c3dc))
* **react-components:** adding TrendCursor Sync to dashboard ([d046184](https://github.com/awslabs/iot-app-kit/commit/d046184b836e9cb3670b210eb24c4fd91167b52a))
* **react-components:** sync echarts viewport ([e04e040](https://github.com/awslabs/iot-app-kit/commit/e04e04079630361047e82d8564678cd4e5857cdd))
* remove drag icon in chat widget ([64e1b89](https://github.com/awslabs/iot-app-kit/commit/64e1b897dc9389055cfd9df9fce01b0415b9e170))
* **scene composer:** added icon picker changes ([8ca53b8](https://github.com/awslabs/iot-app-kit/commit/8ca53b8552f9eb09f107ea43d983a6b47f19fa88))
* table widget pagination and sortingdisabled ([b727eae](https://github.com/awslabs/iot-app-kit/commit/b727eae8364f19f2e997fa0c9275e1f0a947f854))
* **TM-source:** add entity APIs to SceneMetadataModule ([1a91084](https://github.com/awslabs/iot-app-kit/commit/1a910844692aa30bbd4b9d1920d415378bcad130))
* update icons for widget library-952 ([5f7f9ee](https://github.com/awslabs/iot-app-kit/commit/5f7f9ee8274f99b88fd464bd4ee434d0f4126594))
* updated chart initial widget size [#1920](https://github.com/awslabs/iot-app-kit/issues/1920)) ([88218af](https://github.com/awslabs/iot-app-kit/commit/88218afb1aed84e63d08fbad3acacab044c2ab8a))
* updated dashboard background color to grey-125 [#1950](https://github.com/awslabs/iot-app-kit/issues/1950) ([0f81bb2](https://github.com/awslabs/iot-app-kit/commit/0f81bb2240086c9222ab0063dac576927fd407c1))


### Bug Fixes

* **camera:** selecting camera view uses raycast to set better target distance for orbit ([76d9272](https://github.com/awslabs/iot-app-kit/commit/76d927214ae02ca2c1c8657afb9f8d01bf396548))
* **composer:** add aria labels to icons ([8a70eb1](https://github.com/awslabs/iot-app-kit/commit/8a70eb13f081b39dae701dfa999e8aa3ce0a8378))
* **composer:** add new translations ([de7249a](https://github.com/awslabs/iot-app-kit/commit/de7249a8a920e1c43faeda4fd94fb57e9d0fc9f3))
* **composer:** associate inputs to labels ([8b64f9a](https://github.com/awslabs/iot-app-kit/commit/8b64f9aa38761ed684be8b9088a8b7edd6bb0681))
* **composer:** autofocus on error, rules panel ([b132e27](https://github.com/awslabs/iot-app-kit/commit/b132e278a00a8729642afeec3382312685877110))
* **composer:** create default entity roots ([4b38ea5](https://github.com/awslabs/iot-app-kit/commit/4b38ea598360fdaa4dd3545273dab888963d7bb7))
* **composer:** create existing matterport tag as entities ([0d1d16e](https://github.com/awslabs/iot-app-kit/commit/0d1d16e17c35af067ef1f5f4f41030bfd3897d9a))
* **composer:** error when switching motion indicator appearance ([c51f135](https://github.com/awslabs/iot-app-kit/commit/c51f13530b36c8a7e1e17d8ea65c4bec515fb16d))
* **composer:** matterport tag sync tag style under flag ([83334ce](https://github.com/awslabs/iot-app-kit/commit/83334ce21a089ecff46c86ddfb320f1bafe6011d))
* **composer:** resize/reposition overlaps on small screens ([64d3855](https://github.com/awslabs/iot-app-kit/commit/64d3855b866ec6f50e7d9891863c1fea801ceabf))
* **composer:** show sync matterport tag status ([2c041c5](https://github.com/awslabs/iot-app-kit/commit/2c041c56d637efd201e615e04f27a6761cc20c4c))
* **CSS-Loader:** updated sass-loader & fixed style ([aee4abc](https://github.com/awslabs/iot-app-kit/commit/aee4abcd22617cd1b28641711a4be2d1bab4e252))
* **dashboard:** removing all props wont crash chart ([bac2fb6](https://github.com/awslabs/iot-app-kit/commit/bac2fb6debc1364d831c2b93e68a7eafd2b45b9c))
* **matterport:** fix zoom to tag ([49a04f8](https://github.com/awslabs/iot-app-kit/commit/49a04f81bc464d20798f219f77f325bde74ad1f6))
* **react-components:** adding debounce to the echarts zoom handler ([b983385](https://github.com/awslabs/iot-app-kit/commit/b98338508da223bab1a99c28641276ff02c537b5))
* **react-components:** echarts resize drag fix ([19ccc7e](https://github.com/awslabs/iot-app-kit/commit/19ccc7ee4569aea891b43883a8ba1dedf3ac4fc9))
* **react-components:** fix TC behaviour when there is a change in query ([50edcc1](https://github.com/awslabs/iot-app-kit/commit/50edcc1b2131c03c9e30621407a3d3d201825a90))
* **react-components:** fixing TCs on data zoom ([379525c](https://github.com/awslabs/iot-app-kit/commit/379525cd1246061398ff8a113963b968466ae11a))
* **react-components:** fixing the duplicate yAxis values ([60073ef](https://github.com/awslabs/iot-app-kit/commit/60073ef7ea4e1167218c8cdecd021bc677d5cc66))
* **react-components:** fixing the viewport and some styling elements ([7d3526e](https://github.com/awslabs/iot-app-kit/commit/7d3526e34c86b55632a4d5aa0c7029fd1499a48b))
* **react-components:** need stop propagation in start and end of resize event ([30e9901](https://github.com/awslabs/iot-app-kit/commit/30e99010bc57e48040ddcac8c41546e745a5a3f9))
* **react-components:** updating echarts ux ([ddfc9c8](https://github.com/awslabs/iot-app-kit/commit/ddfc9c8cc15f32a8c307653daf5d2159918e58b2))
* **react-components:** updating echarts with the fixes founf during bug bash ([9f32c21](https://github.com/awslabs/iot-app-kit/commit/9f32c21ae53d99ddac718caa520d9e852a25f499))
* resolved table widget column resize issue ([8b6b418](https://github.com/awslabs/iot-app-kit/commit/8b6b4189601c594ffef9dd6ed915e6ddbf7fa938))
* resolved table widget column resize issue ([08b1993](https://github.com/awslabs/iot-app-kit/commit/08b19932614978cac915e34a27747f72da78c657))
* **scene composer:** fix for missing grid ([2a4c4c8](https://github.com/awslabs/iot-app-kit/commit/2a4c4c8b194a2eceebe73dc87d24215836be4a99))
* **scene composer:** removing custom grid line colors ([632f7a2](https://github.com/awslabs/iot-app-kit/commit/632f7a210a80281b1d3c53b0a5de168f8cae9d10))
* **scene tags:** fix anchor stems not triggering onWidgetClick ([6945512](https://github.com/awslabs/iot-app-kit/commit/6945512eadbdd8d8bc09977ecce7511fbf136311))
* **tools-iottwinmaker:** update dashboard role to include execute query api ([b63d053](https://github.com/awslabs/iot-app-kit/commit/b63d0537ce247724d0dd73d8d0d1ffba20e0ab5a))
* use one timesync for all of dashboard ([c979995](https://github.com/awslabs/iot-app-kit/commit/c979995ec642d0ac8081056a3d2e83dd42a90d18))
* x-axis toggle will toggle both x and y axis [#1925](https://github.com/awslabs/iot-app-kit/issues/1925) ([58b0dbb](https://github.com/awslabs/iot-app-kit/commit/58b0dbbc72a9dbfd13648a454ea36ac570efd0eb))

## [7.3.1](https://github.com/awslabs/iot-app-kit/compare/root-v7.3.0...root-v7.3.1) (2023-08-24)


### Bug Fixes

* **dashboard:** adding a ts module file for supporting svg files ([61ac00d](https://github.com/awslabs/iot-app-kit/commit/61ac00dba2029a060692fd736616185f07b74bc2))
* **react-component:** updating the calculateTimeStamp method to use ([e0e1f42](https://github.com/awslabs/iot-app-kit/commit/e0e1f428f012b157938eced89efcd30101f2d7f5))
* **TM-source:** fix tanstack query import ([3bc704f](https://github.com/awslabs/iot-app-kit/commit/3bc704fa4ccbf3a74baa8e575e0ac5bc7ff4cf87))

## [7.3.0](https://github.com/awslabs/iot-app-kit/compare/root-v7.2.1...root-v7.3.0) (2023-08-23)


### Features

* **TM-source:** add property value query ([21091d9](https://github.com/awslabs/iot-app-kit/commit/21091d9e3bb19a2c6181f2eeb1354ce2fa31ca45))

## [7.2.1](https://github.com/awslabs/iot-app-kit/compare/root-v7.2.0...root-v7.2.1) (2023-08-18)


### Bug Fixes

* **react-components:** the dependencies were added to dashboard instead of react-components ([8b2f12f](https://github.com/awslabs/iot-app-kit/commit/8b2f12fb67a1705ffdb722e02cf8c1ff1ae2ed97))
* **scene composer:** fix spacing issue between elements ([b65ebdc](https://github.com/awslabs/iot-app-kit/commit/b65ebdc3fecd4911a6e5fbc664d1d0bdf5524ebe))

## [7.2.0](https://github.com/awslabs/iot-app-kit/compare/root-v7.1.0...root-v7.2.0) (2023-08-17)


### Features

* **composer:** auto query for indicator and overlay ([b597c6f](https://github.com/awslabs/iot-app-kit/commit/b597c6f7606ead54749e93e0be2436430155b634))
* **composer:** auto query support for Model Shader ([ff0bbe3](https://github.com/awslabs/iot-app-kit/commit/ff0bbe3a9cb1f6c8a91cf6c4f531b1811eee076c))
* **composer:** implement useBindingData and integrate to Tag ([e694433](https://github.com/awslabs/iot-app-kit/commit/e6944332e8fcc516ecdd3b6978725691a089f1ca))
* **dashboard:** add advanced search using knowledge graph to query editor ([8722b33](https://github.com/awslabs/iot-app-kit/commit/8722b338a919d6fb51b21a861cf7e96e44246dbd))
* **echarts:** threshold support ([2d7ccfe](https://github.com/awslabs/iot-app-kit/commit/2d7ccfe6695070126b60f352733ef1512c966984))
* **react-component:** adding config service to toggle echarts ([96d0351](https://github.com/awslabs/iot-app-kit/commit/96d0351b7e20a728154d3ebfed0efd5205b841bd))
* **react-component:** adding context menu per chart ([a368eb9](https://github.com/awslabs/iot-app-kit/commit/a368eb99b230f2a5a8bb39d7c0bc52e42ae9f5ad))
* **react-component:** adding sorting ability for the chart legends ([ca330eb](https://github.com/awslabs/iot-app-kit/commit/ca330eb711923a32531871b714c2252fe31850ae))
* **react-component:** adding trendcursor sync component ([52d6033](https://github.com/awslabs/iot-app-kit/commit/52d6033337937c5b7b1774d5a5b04907e126df60))
* **react-components:** add a sitewise connected chart story ([b66de3b](https://github.com/awslabs/iot-app-kit/commit/b66de3b4d87ac2a3157c6cae176a216dff1ceb92))
* **react-components:** add multiple y axis legend ([79023c0](https://github.com/awslabs/iot-app-kit/commit/79023c025e09e3ad485c84ad1d54b0ed2e0e0589))
* **react-components:** supporting live mode in echarts ([cdf1caa](https://github.com/awslabs/iot-app-kit/commit/cdf1caab9399cc770c91c3fd40ffde23e7795ab5))
* **scene composer:** add unit test for AnchorWidget onClickWidget event ([07f0987](https://github.com/awslabs/iot-app-kit/commit/07f0987cd5effaafbc20e5936800bb447a244874))
* **scene composer:** color picker bug fixes ([f44b838](https://github.com/awslabs/iot-app-kit/commit/f44b838198165f60722bd83f4e4ae42c185e7146))
* **scene composer:** rule icon using color picker ([f1519c4](https://github.com/awslabs/iot-app-kit/commit/f1519c4ec94c598a83825f85a3dcd00e87747e3f))
* **scene-composer:** added back animation scene model component with changes ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** added comment to explain scene object fetching ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** added internationalization for animation viewstate ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** added knowncomponent type to condition for adding an animation object ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** addressed changes to databinding in the add component menu ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** addressed more changes to databinding in the add component menu ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** fixed tests ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** fixed use effect in animationeditor to prevent extra fire ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** got rid of magic string and replaced it with a const ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** initial implementation of animations ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** minor cleanup ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** refactored addObject menu for animations ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** refactored AnimationComponent test ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** refactored tests and animationComponentEditor ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** refactored to address github feedback ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** removed changes to tag component ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** removed global variable from animationcomponent ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** removed unnecessary dependency ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** removed unnecessary imports ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** renamed animationupdater to animationcomponenteditor for consistency ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** reverted package-lock.json ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))
* **scene-composer:** updated us.json ([39f14cd](https://github.com/awslabs/iot-app-kit/commit/39f14cd0d0f571e9c4bbc04958baecd4530d04f5))


### Bug Fixes

* **3DKG:** fix height flexibility for KG component ([f9943ce](https://github.com/awslabs/iot-app-kit/commit/f9943cee4741da7b5fc2f11f67a429424c2d88b7))
* **composer:** fix issue displaying 0 in overlay ([a0bc01d](https://github.com/awslabs/iot-app-kit/commit/a0bc01dfe327509345ec74a61149a6a2d6e48a6a))
* **composer:** fix warning and cached onChange ([5a2c182](https://github.com/awslabs/iot-app-kit/commit/5a2c1824736bfdd05d1dd1925da8a0408c7ca860))
* **data overlay:** add onWidgetClick and onSelectionChange event support to data overlays ([b3f4f9d](https://github.com/awslabs/iot-app-kit/commit/b3f4f9d33e61190933323f283fe0fe0552ab0384))
* **react-component:** removing the dependency of the yMin and Ymax and ([9360fe4](https://github.com/awslabs/iot-app-kit/commit/9360fe42e081263ccd1896f47fb5d8a7ba6b1d0f))
* **react-component:** removing transition animation for trend cursors ([5e84d15](https://github.com/awslabs/iot-app-kit/commit/5e84d15fcecb7ee0e1f242fd0f1ce47960818696))
* **react-components:** add memoization for chart reactivity and refactor echarts hook ([128f5b0](https://github.com/awslabs/iot-app-kit/commit/128f5b0c2f8a1c164241ef216d5d489d9d69164c))
* **react-component:** updating the sytling and adding some visual ques for the trend cursors ([dc50a2c](https://github.com/awslabs/iot-app-kit/commit/dc50a2c8c04167f1137deec350d735847d6d233a))
* **reactExample:** fix css in Knowledge Graph Component ([7b5a4e4](https://github.com/awslabs/iot-app-kit/commit/7b5a4e452b1e4cee2ec13220b0b2c828906f27db))
* **reactExample:** fix removed css in Scene Viewer Component ([7f38586](https://github.com/awslabs/iot-app-kit/commit/7f38586400dfea06d8e2f986130fceddae719e60))
* **scene composer:** fix for broken rule panel ([c5e071d](https://github.com/awslabs/iot-app-kit/commit/c5e071d6c5c0e73eaec3e47a98e6d3e3f0cc7dc3))
* **scene composer:** fix overlay arrow clickable space ([4cae31f](https://github.com/awslabs/iot-app-kit/commit/4cae31fb04d38852ed667ab5620d4920cfd83769))
* **Tag style:** custom color to support icon rules ([dd3bbee](https://github.com/awslabs/iot-app-kit/commit/dd3bbee9622eb0bda3a29ab28b920b6d798b4cb2))

## [7.1.0](https://github.com/awslabs/iot-app-kit/compare/root-v7.0.0...root-v7.1.0) (2023-07-28)


### Features

* **composer:** add hook to convert data bindings to queries ([1e68022](https://github.com/awslabs/iot-app-kit/commit/1e6802206312926efbbf2e15fd48379afbfc4cd9))


### Bug Fixes

* **scene-composer:** fix ability to click on tags, revert raycaster disable on scroll ([caed238](https://github.com/awslabs/iot-app-kit/commit/caed238ed12da29bd487caf44b895ce7f7f024bf))

## [7.0.0](https://github.com/awslabs/iot-app-kit/compare/root-v6.3.1...root-v7.0.0) (2023-07-25)


### ⚠ BREAKING CHANGES

* **composer:** use binding provider from TM-source

### Features

* **composer:** integrate scene viewer with TimeSync viewport ([6c92201](https://github.com/awslabs/iot-app-kit/commit/6c92201aaa10c453c81cb6bf8ced349c55b47a19))
* **composer:** use binding provider from TM-source ([61f6a54](https://github.com/awslabs/iot-app-kit/commit/61f6a5456aae9cb2ae826e3c2d700e0bba69c6af))
* **react-component:** adding drag and delete to TC ([7c6a017](https://github.com/awslabs/iot-app-kit/commit/7c6a017eaad9fe4c2f6881adb7e807f4b154f93c))
* **react-component:** adding resizability for Charts components ([3ae7f56](https://github.com/awslabs/iot-app-kit/commit/3ae7f568a30947782c2d29ecf72eacf3df31d18b))
* **react-component:** adding TC markers ([4105adb](https://github.com/awslabs/iot-app-kit/commit/4105adb218fbf05b6145348d660fc24b2cec0b66))
* **react-component:** adding the inital implementation of the trend cursors ([ce37fe2](https://github.com/awslabs/iot-app-kit/commit/ce37fe21a36f13fe1438c0653eb47992d774b15e))
* **react-components:** add menu component ([cdd196e](https://github.com/awslabs/iot-app-kit/commit/cdd196ebcf42b5ddbdc34005fe4b54ae24767609))
* **react-components:** add time selection component to react components ([e99f301](https://github.com/awslabs/iot-app-kit/commit/e99f3011a063c861cc22264687a9f3d5d9d56841))
* **react-components:** adding resizing to trend cursors ([400189a](https://github.com/awslabs/iot-app-kit/commit/400189a221f16123ce193222eacd2583ea25360a))
* **react-components:** feature flag context ([d313682](https://github.com/awslabs/iot-app-kit/commit/d31368282b9f5882c6f6cef0a66c2c085ee56aff))
* **scene composer:** color picker changes ([0138b0a](https://github.com/awslabs/iot-app-kit/commit/0138b0adb20039e77dc4ac0f838a50d742d24339))
* **TM-source:** add entity data binding provider ([d1c459d](https://github.com/awslabs/iot-app-kit/commit/d1c459d4e897171922d6821da01dcbae6fd000da))
* **TM-source:** flag static property data binding ([eeeaecd](https://github.com/awslabs/iot-app-kit/commit/eeeaecdadd55977633ae884607e2f4e56e467044))
* **Vite:** migrate example app to vite ([d2e65be](https://github.com/awslabs/iot-app-kit/commit/d2e65bed32dc3c470b52d418dacb61610c16ab5a))


### Bug Fixes

* **actions:** lock release please to version ([aba8511](https://github.com/awslabs/iot-app-kit/commit/aba85114467119d4999f25a3e175c5761ca018f3))
* **composer:** fix infinite storybook component update ([40fab0a](https://github.com/awslabs/iot-app-kit/commit/40fab0a96bf1a0396fa0a36aa67c059ed8570cfc))
* **react-components:** ensure provider is unsubscribed correctly ([2db74d2](https://github.com/awslabs/iot-app-kit/commit/2db74d2d51f1104478540528cb4be982c4afc351))
* **scene-composer:** update raycaster in OrbitControls, ignore undefined faces, disable on scroll ([011464e](https://github.com/awslabs/iot-app-kit/commit/011464e702f46b9237b8df1226fa862c073605c0))
* use REGION env variable in dashboard testing environment ([c62e68b](https://github.com/awslabs/iot-app-kit/commit/c62e68bc9181ad2d6995097fb60638f41dc168ab))

## [6.3.1](https://github.com/awslabs/iot-app-kit/compare/root-v6.3.0...root-v6.3.1) (2023-06-28)

## Fix
* **Emergency revert**

## [6.3.0](https://github.com/awslabs/iot-app-kit/compare/root-v6.2.0...root-v6.3.0) (2023-06-23)


### Features

* **3D knowledge Graph:** selecting entity binding triggers camera movement ([f122f1a](https://github.com/awslabs/iot-app-kit/commit/f122f1a3a7d7af14060099263208801af3738ac3))
* **3D Knowledge Graph:** update DataBinding to EntityBinding ([ca10d1b](https://github.com/awslabs/iot-app-kit/commit/ca10d1b3319f8c10b7239080310e4b0ad4244775))
* **dashboard:** add api for customizing the properties panel ([368ad97](https://github.com/awslabs/iot-app-kit/commit/368ad974a5fa0e22851918b89b8e3a152165dbe8))
* **dashboard:** add significant digits configuration ([bcc5c51](https://github.com/awslabs/iot-app-kit/commit/bcc5c51a1732bc785a45ec939fb111f52ae14421))
* **react-components:** add significant digits configuration for charts ([41cba0e](https://github.com/awslabs/iot-app-kit/commit/41cba0e655ac944889d6f15db56282a30e53997e))
* **react-components:** base echarts ([bc6ee62](https://github.com/awslabs/iot-app-kit/commit/bc6ee6250417a7d71f6aaf0692f1a02d4059b8f6))
* **TM-source:** use Tanstack query to cache requests ([0d87068](https://github.com/awslabs/iot-app-kit/commit/0d870684b8fa61e2e2a6d3afc5d0f4dd70fad9a3))


### Bug Fixes

* **dashboard:** add box sizing reset for dashboard ([712598b](https://github.com/awslabs/iot-app-kit/commit/712598b13f4c3c81a3d4d8b6609d7bd149c16859))
* **dashboard:** fixed the flash of graphs on change in query(s) ([45edc69](https://github.com/awslabs/iot-app-kit/commit/45edc69ae67796ce9566c491a8f39921029ad0a0))
* **KG Component:** ux review changes ([9133094](https://github.com/awslabs/iot-app-kit/commit/9133094b7352676277e951dda2c92cb0db566488))
* **knowledge-graph:** fix node to node selection and layout adjustment ([98df518](https://github.com/awslabs/iot-app-kit/commit/98df518f25cc3a15254917520a1750d013fc2984))
* **scene composer:** reverting breaking changes from dependabot & setting up ignores ([831d1d7](https://github.com/awslabs/iot-app-kit/commit/831d1d76e8f7f36bd8129eaa7491a33516a57b1c))
* **scene-composer:** updating dependabot.yml to properly ignore all [@react-three](https://github.com/react-three) dependencies ([a33d445](https://github.com/awslabs/iot-app-kit/commit/a33d445309f31da54dcc443b3e2ee604014c153a))

## [6.2.0](https://github.com/awslabs/iot-app-kit/compare/root-v6.1.0...root-v6.2.0) (2023-06-07)


### Features

* **Knowledge Graph:** adding clear and render graph results events ([5479a51](https://github.com/awslabs/iot-app-kit/commit/5479a51b85574d4c751c8e0aba40fa54e76d7504))
* **scene composer:** fix autosuggestvalue issues in ValueDataBindingBuilder ([0f32e73](https://github.com/awslabs/iot-app-kit/commit/0f32e7367f01b09d0f81eaf7580e770fcf523a2f))


### Bug Fixes

* **dashboard:** better toolbar ([c0b9cc8](https://github.com/awslabs/iot-app-kit/commit/c0b9cc8bf135caaa8f5722defba87be65ef06f70))
* **scene composer:** sets up refs to track visibility of data overlay & parent ([fad2208](https://github.com/awslabs/iot-app-kit/commit/fad22087312570641809ed4b1662ae053a809f02))

## [6.1.0](https://github.com/awslabs/iot-app-kit/compare/root-v6.0.0...root-v6.1.0) (2023-06-06)


### Features

* **KG Component:** event modeling ([b918237](https://github.com/awslabs/iot-app-kit/commit/b918237e82738cf1dbc61f95c303881b65166abb))
* **scene composer:** fixed entity data binding data format ([64e33fa](https://github.com/awslabs/iot-app-kit/commit/64e33fa582512868a74d1cafad1a0d734065878c))


### Bug Fixes

* **dashboard:** editable link ([1675de6](https://github.com/awslabs/iot-app-kit/commit/1675de6ff50f536b27d6258734fb312f50b40c7b))

## [6.0.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.9.0...root-v6.0.0) (2023-06-05)


### ⚠ BREAKING CHANGES

* aggregation and resolution picker

### Features

* aggregation and resolution picker ([77a53fe](https://github.com/awslabs/iot-app-kit/commit/77a53feffdb1956707dca5d45f43a1f7ea0c5453))
* **composer:** support enhanced editing in Matterport scene ([933deb7](https://github.com/awslabs/iot-app-kit/commit/933deb752d11ab9269b48eccff9348c771f22019))


### Bug Fixes

* **docs:** udpate dataStream docs ([d0dc6ca](https://github.com/awslabs/iot-app-kit/commit/d0dc6cace63508480a76db9e0151532fd387a891))

## [5.9.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.8.1...root-v5.9.0) (2023-06-01)


### Features

* **3D Knowledge Graph:** add scene node highlighting ([ef5c71c](https://github.com/awslabs/iot-app-kit/commit/ef5c71c7d54f81c85b61f4a10847957669c1bdfb))
* **3D Knowledge Graph:** create function for duplicate code ([4c239d8](https://github.com/awslabs/iot-app-kit/commit/4c239d85211f2609fc5f312a3c725c881cd187f5))
* **3D Knowledge Graph:** fix lint after rebase ([e016ff7](https://github.com/awslabs/iot-app-kit/commit/e016ff747a156d48043ec9ed5b1aa2cfbb8b58a2))
* **3D Knowledge Graph:** fix type import ([e1edc38](https://github.com/awslabs/iot-app-kit/commit/e1edc38905c5cc299d207568697b1d099791df6b))
* **3D Knowledge Graph:** improve unit tests ([11cd450](https://github.com/awslabs/iot-app-kit/commit/11cd45022198ed4b1f69623080237617557f2136))
* **3D Knowledge Graph:** improve useStore usage and unit tests ([f10ffb2](https://github.com/awslabs/iot-app-kit/commit/f10ffb2a72a1e5cb3bf1dbf9f1e0bc2e9fdd35d9))
* **3D Knowledge Graph:** use updated entity binding definition ([97d6d91](https://github.com/awslabs/iot-app-kit/commit/97d6d9104fb9e28dc23b1c6850b43f463a0fcb17))
* **dashboard:** refactor asset description sdk calls to use tanstack ([f99bcde](https://github.com/awslabs/iot-app-kit/commit/f99bcde75f3fad7dac82ac657f1a2aca8dbbbc4c))
* fix lint error for scene composer ([924547f](https://github.com/awslabs/iot-app-kit/commit/924547f788f260efa3cd39d36ede79b6c00f4f23))
* **Knowledge Graph:** adding KG parent component, search and explore logic ([95cc307](https://github.com/awslabs/iot-app-kit/commit/95cc307d6fcf2592d376830283069ddce463d0cf))
* **scene composer:** entity data binding UI changes and unit tests ([fc17202](https://github.com/awslabs/iot-app-kit/commit/fc17202c73a28a8670a8e4bc028eee86ac1a4ed1))
* **scene composer:** entity data binding UI changes and unit tests ([f1f81b8](https://github.com/awslabs/iot-app-kit/commit/f1f81b8e9d11734836582071d4583113af5510a2))
* **scene composer:** fixed entity search bug using free text ([7417c15](https://github.com/awslabs/iot-app-kit/commit/7417c15f09b3b7b2c1994d1ee13aeb98e8506779))


### Bug Fixes

* **composer:** unsubscribe to queries when unmounting ([15fe82e](https://github.com/awslabs/iot-app-kit/commit/15fe82edf847cf024ab8e987ff513d4726cb2138))
* **dashboard:** change min widget sizing from 2 to 1 ([d840fc1](https://github.com/awslabs/iot-app-kit/commit/d840fc1ac8efbe9e79ff5937f22cc3545abfdd0d))
* graph css not distributed correctly ([d7b2717](https://github.com/awslabs/iot-app-kit/commit/d7b2717647507533bfeda81774c44a3c5727e15c))

## [5.8.1](https://github.com/awslabs/iot-app-kit/compare/root-v5.8.0...root-v5.8.1) (2023-05-19)


### Bug Fixes

* **composer:** click events for tag and overlay ([2bf7b13](https://github.com/awslabs/iot-app-kit/commit/2bf7b13fc2eccc1206eb9455d372d84c0a886915))
* **composer:** error handling for Matterport scene ([24ca493](https://github.com/awslabs/iot-app-kit/commit/24ca4932457f4605f05af98bb13294143d15371a))
* **scene composer:** modifying auto collapse to only apply to viewer ([aaf6338](https://github.com/awslabs/iot-app-kit/commit/aaf63384b7d24b731a76fec10b8372110173470e))

## [5.8.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.7.0...root-v5.8.0) (2023-05-18)


### Features

* **3dkg:** added 3dkg changes for entity data binding ([4db11a6](https://github.com/awslabs/iot-app-kit/commit/4db11a63a6fb1ef2b3dd1cc5682a64e1417b12da))
* **dashboard:** add grid settings configuration ux ([f5ca885](https://github.com/awslabs/iot-app-kit/commit/f5ca88515992637837db778acb198a83d46a16b6))
* **GraphVisualization:** graph data visualizer ([13e004a](https://github.com/awslabs/iot-app-kit/commit/13e004a3c9256cc20af1e49dd52737b17ae7078b))
* **knowledge graph:** knowledge graph datasource ([600e276](https://github.com/awslabs/iot-app-kit/commit/600e2762029debbde8dc6b46654e58ebdd409b12))
* **SkinVisualization:** enable default style for visualization and allow overrides ([6240195](https://github.com/awslabs/iot-app-kit/commit/624019522a940bc9cf5c69253156db871576302d))


### Bug Fixes

* **build:** drive release of IoT App Kit + minor doc update ([94af09d](https://github.com/awslabs/iot-app-kit/commit/94af09dee029b1824a035908466a0ddf3ae2cbbc))
* **composer:** click on overlay causing camera to follow mouse ([6cbd5f5](https://github.com/awslabs/iot-app-kit/commit/6cbd5f5d53cf8b58ba5d4d7536acd9acd6ac7ad1))
* **composer:** close overlay auto select attached tag ([5a52ae1](https://github.com/awslabs/iot-app-kit/commit/5a52ae18e4d37135570765a12306bbece3655eb8))
* **scene composer:** cleanup for polaris css imports & moving interface to component file ([d244eb5](https://github.com/awslabs/iot-app-kit/commit/d244eb525a3b2ae8862affa0141673351fd850ee))
* **scene composer:** collapse scene panels on scene load ([0841e64](https://github.com/awslabs/iot-app-kit/commit/0841e6409b7bea5c516022c09cc9e1a936bbf81b))
* **scene composer:** refactoring video player to work with react 18 updates ([c177802](https://github.com/awslabs/iot-app-kit/commit/c1778025babf75d89d74c1b355f54e46f2e740be))
* **video-player:** video seek percent calculation ([828e4f1](https://github.com/awslabs/iot-app-kit/commit/828e4f18dfe5f25ddd6f045f921f24ffba35535c))

## [5.7.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.6.0...root-v5.7.0) (2023-05-02)


### Features

* **composer:** add data binding component ([db33d28](https://github.com/awslabs/iot-app-kit/commit/db33d28e3910ea94718dc15c54c8f83648c8cd22))
* **composet:** support partial data binding ([72b561e](https://github.com/awslabs/iot-app-kit/commit/72b561e5594975d01b702f7a7b9e85c413b50534))
* **dashboard:** add utils for e2e testing dashboard ([8a917eb](https://github.com/awslabs/iot-app-kit/commit/8a917eb4b0ed6ed0d52a900c0e643f948d612ecc))
* **TwinMakerTools:** add tools-iottwinmaker to npm publish workflow ([c24909f](https://github.com/awslabs/iot-app-kit/commit/c24909fe96b75aed392f33a0cbb10396ad808fab))
* **TwinMakerTools:** renamed nuke to destroy, added 2 flags, made dry run by default ([3e8b9cd](https://github.com/awslabs/iot-app-kit/commit/3e8b9cd9753a20cae5c10277c09007deddd60f1a))


### Bug Fixes

* **CI:** execute release-please action on all commits ([899cb5b](https://github.com/awslabs/iot-app-kit/commit/899cb5b294f081e5c1383ef1d85b05bc0dd58255))
* **CrashOnRemount:** scene-composer doesn't crash when remounted now ([79f2f77](https://github.com/awslabs/iot-app-kit/commit/79f2f779aa2b0f85492221508fe0579c963167e4))
* **dashboard:** remove box-intersect dependency ([703f1a5](https://github.com/awslabs/iot-app-kit/commit/703f1a5f15bb8c227fb726fc026a6983dc2c5f25))
* no flash of error, remove ghosting ([5a2723b](https://github.com/awslabs/iot-app-kit/commit/5a2723ba9cb78d3b4fbd6ed64e9c1558d6a01c98))

## [5.6.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.5.2...root-v5.6.0) (2023-04-20)


### Features

* **composer:** enable data overlay, tag resize, and matterport features ([908be39](https://github.com/awslabs/iot-app-kit/commit/908be39057a86011b3f3aaa7f82098d2033471be))

## [5.5.2](https://github.com/awslabs/iot-app-kit/compare/root-v5.5.1...root-v5.5.2) (2023-04-19)


### Bug Fixes

* **composer:** adding widget fix for 3d tiles ([989ec4c](https://github.com/awslabs/iot-app-kit/commit/989ec4c09a2194b38566b1a8665582d8cc65c986))
* **composer:** fix viewCursorWidget for 3D tiles and made cursor size dynamic ([0ef2563](https://github.com/awslabs/iot-app-kit/commit/0ef2563dd6da80e06a8f62ce9a64b85db0a10974))
* **composer:** matterport integration bug fixes ([701531f](https://github.com/awslabs/iot-app-kit/commit/701531fc222cc6fa363d5f292d31ee739990f9cb))
* **dashboard:** ensure auto size grid recalculates any time cellSize changes from outside component ([7132c4d](https://github.com/awslabs/iot-app-kit/commit/7132c4df21306c4ad735cdc0818ea5cf22c4afa2))
* **dashboard:** prevent initialState from being shared across dashboard instances ([5403928](https://github.com/awslabs/iot-app-kit/commit/5403928136d5b4babcb32f6060334ec0467e3044))
* **dashboard:** refactor grid component to make it more maintainable ([d84db01](https://github.com/awslabs/iot-app-kit/commit/d84db0110d47107c6b0974cda021dacfdae42e00))

## [5.5.1](https://github.com/awslabs/iot-app-kit/compare/root-v5.5.0...root-v5.5.1) (2023-04-14)


### Bug Fixes

* **react-components:** useTimeSeriesData hook works when number of queries changes ([feb6076](https://github.com/awslabs/iot-app-kit/commit/feb607642299fb90fb9f70f8cd4b76007bd5791e))

## [5.5.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.4.0...root-v5.5.0) (2023-04-13)


### Features

* **dashboard:** add autosizing grid ([fcaca20](https://github.com/awslabs/iot-app-kit/commit/fcaca207862658a0b299cd0f61feb7144a4541b3))


### Bug Fixes

* **754:** tests importing invalid import from ThreeJS and suppressing with lint rules ([876d336](https://github.com/awslabs/iot-app-kit/commit/876d33614d66042d2f6e71ebe0ea740dce79dd86))
* **composer:** update overlay and settings UI ([a213114](https://github.com/awslabs/iot-app-kit/commit/a213114bf758f0146007888fd05ad498c946ed32))

## [5.4.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.3.0...root-v5.4.0) (2023-04-12)


### Features

* **dashboard:** add initial view mode configuration to dashboard ([ddc7316](https://github.com/awslabs/iot-app-kit/commit/ddc73163a06b269de98c30dcf4f1f57bc79a0679))


### Bug Fixes

* **dashboard:** fix tooltip positioning ([cc82474](https://github.com/awslabs/iot-app-kit/commit/cc824747e85a56c35c590020dd185d576f45ee6f))

## [5.3.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.2.0...root-v5.3.0) (2023-04-12)


### Features

* **Composer:** twinMaker-matterport integration ([bcfe40f](https://github.com/awslabs/iot-app-kit/commit/bcfe40fc7f4b26af7510f32b0b4986d62b6ef30b))


### Bug Fixes

* **composer:** convert to inline overlay CSS ([0f5b82a](https://github.com/awslabs/iot-app-kit/commit/0f5b82af6ebf954e6a7fa388c5946b56686b98ab))
* **composer:** fix reparent rotation and add new object issues ([2628c29](https://github.com/awslabs/iot-app-kit/commit/2628c29f285001609840d69c1c81d0d49e84d93c))
* **composer:** gate empty overlay section in inspector ([2726f10](https://github.com/awslabs/iot-app-kit/commit/2726f10d4aa26426c1650daa2852bdedba91678b))
* **composer:** Restores loading indicator for scene composer ([1f81754](https://github.com/awslabs/iot-app-kit/commit/1f817549b2c22d35e6d0d53d415354d3e3ace47f))
* **composer:** update overlay css ([3136571](https://github.com/awslabs/iot-app-kit/commit/31365712bbd7cbfc3b871710b73dc4b348ddc355))
* **composer:** update overlay visibility toggles behavior ([0e90781](https://github.com/awslabs/iot-app-kit/commit/0e907816a79befc94f56e26d501f1f94c8e6902c))
* **dashboard:** update property name for tables when displaying alarms ([d8d5541](https://github.com/awslabs/iot-app-kit/commit/d8d55410c78abf6c8cd7f9d442c311f0e2e9a752))
* increase commitlint body-max-line-length to 250 ([52cab67](https://github.com/awslabs/iot-app-kit/commit/52cab674f56c2f65f2471d34f655264fe105bad8))
* **PeerDependencies:** react-intl should be declared as a peer dependency ([9ea3f75](https://github.com/awslabs/iot-app-kit/commit/9ea3f75ee2c4a294b0ac1f80803a916c7d9b2215))
* **ReactExample:** build issues preventing id generation for react-intl ([4339592](https://github.com/awslabs/iot-app-kit/commit/43395927587fd49852c6775d9e40921631b7bf44))
* **TwinMakerTools:** added a additional condition to prevent saving an s3 folder as a model ([a991335](https://github.com/awslabs/iot-app-kit/commit/a991335d8ccbb476813b4ab092113c01fb80052c))

## [5.2.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.1.1...root-v5.2.0) (2023-04-05)


### Features

* **composer:** update overlay UI and flow ([5bf75aa](https://github.com/awslabs/iot-app-kit/commit/5bf75aa0a9e2128f0e41798f8cc3d94322e18888))
* **TwinMakerTools:** add automatic workspace creation in deploy + misc bug fixes, add unit tests ([503103c](https://github.com/awslabs/iot-app-kit/commit/503103ce1de5a00a0dca64386a0a375697ff2812))


### Bug Fixes

* **dashboard:** add buffer to dependencies so consuming apps don't need to install it ([bb9d48a](https://github.com/awslabs/iot-app-kit/commit/bb9d48a64c18dc925a788c2d8a1528ff3d26db30))
* **dashboard:** add css resets ([7e23bc1](https://github.com/awslabs/iot-app-kit/commit/7e23bc13ff99ff80d769d69558a96a44f138faba))
* **dashboard:** disable user select on drag to prevent text selection ([56b5d09](https://github.com/awslabs/iot-app-kit/commit/56b5d098ebfda31e9c200c5d665b90f158cadebd))
* **dashboard:** update type path in package json ([d4647e1](https://github.com/awslabs/iot-app-kit/commit/d4647e1b85eb8bcc2e343de954f9d51260c62a77))
* **react-components:** add core-util as a dependency ([5c4d420](https://github.com/awslabs/iot-app-kit/commit/5c4d4209d364640aebb78134fc08bc32707795f0))

## [5.1.1](https://github.com/awslabs/iot-app-kit/compare/root-v5.1.0...root-v5.1.1) (2023-04-03)


### Bug Fixes

* **dashboard:** allow gestures when widget is in error state ([7545487](https://github.com/awslabs/iot-app-kit/commit/754548700fdaff1d84db63d29d244fb411898241))
* **dashboard:** better empty thresholds pane ([493b9f2](https://github.com/awslabs/iot-app-kit/commit/493b9f2442f618617eaa6821fe9d89e3cb844f9a))

## [5.1.0](https://github.com/awslabs/iot-app-kit/compare/root-v5.0.0...root-v5.1.0) (2023-04-03)


### Features

* **charts:** add legend to charts ([0abfcf6](https://github.com/awslabs/iot-app-kit/commit/0abfcf6c5a325ee24290d5ac990703e24f6db3f0))

## [5.0.0](https://github.com/awslabs/iot-app-kit/compare/root-v4.0.3...root-v5.0.0) (2023-03-31)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper
* **source-iotsitewise:** support propertyAlias in quries
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* **core, source-iotsitewise:** 
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async
* **core:** Refactored export from `@iot-app-kit/core` IoTAppKitDataModule to be named TimeSeriesDataModule, and removed the concept of multiple data sources per time series data module

### Features

* Add Asset Hierarchy loading & Asset Tree support ([e36380a](https://github.com/awslabs/iot-app-kit/commit/e36380ad011b3e0b10a3b8a2d65245446248f55f))
* add CodeQL workflow ([#64](https://github.com/awslabs/iot-app-kit/issues/64)) ([bfd7c88](https://github.com/awslabs/iot-app-kit/commit/bfd7c88424faac92d2f11eb7fa44910cd1e2872d))
* Add Core SiteWise Asset Module ([a3ffec2](https://github.com/awslabs/iot-app-kit/commit/a3ffec2e490542b9bdd5587316e4ddd72573c109))
* add in styles overrides and refId in query ([#38](https://github.com/awslabs/iot-app-kit/issues/38)) ([76a9d63](https://github.com/awslabs/iot-app-kit/commit/76a9d63e02a13f3229f1ee58a1d35b974fe81ae2))
* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([64e64b8](https://github.com/awslabs/iot-app-kit/commit/64e64b800ad3b6ddbee78cfe84c3750e73dead65))
* Add proposed API changes within types declarations ([#37](https://github.com/awslabs/iot-app-kit/issues/37)) ([629fbeb](https://github.com/awslabs/iot-app-kit/commit/629fbeb46e10cfce699ca2c7906e651cb2a83f7b))
* add support for aggregated data for sitewise data source ([#6](https://github.com/awslabs/iot-app-kit/issues/6)) ([a50b31e](https://github.com/awslabs/iot-app-kit/commit/a50b31e8da30b93aa02ea8e89e44fa686bd71d67))
* add support for resolution mapping ([#16](https://github.com/awslabs/iot-app-kit/issues/16)) ([8dda905](https://github.com/awslabs/iot-app-kit/commit/8dda905ff27d6e5a749a7f90d59dd6cf1dad4ec8))
* Add support for update within subscribeToTimeSeriesData ([#53](https://github.com/awslabs/iot-app-kit/issues/53)) ([83b100f](https://github.com/awslabs/iot-app-kit/commit/83b100f29e7a2d5062597c13946db44af2ae4029))
* add test runner github action ([#8](https://github.com/awslabs/iot-app-kit/issues/8)) ([ef398b9](https://github.com/awslabs/iot-app-kit/commit/ef398b9e9c65c75562d87ec95e3b9c7b90751eaa))
* allow to specify region for data-module ([#4](https://github.com/awslabs/iot-app-kit/issues/4)) ([ae2ef66](https://github.com/awslabs/iot-app-kit/commit/ae2ef662ef98230fa64676e374e0401cbe64cce3))
* **all:** release 4.0.3 ([2b933ba](https://github.com/awslabs/iot-app-kit/commit/2b933ba31e60666323df7bfae0e962698636a4bf))
* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* api simplification of requestSettings ([#27](https://github.com/awslabs/iot-app-kit/issues/27)) ([537b8ca](https://github.com/awslabs/iot-app-kit/commit/537b8ca3a459cb1ea70ec99a10697f34ba343657))
* backfill component integration tests ([#66](https://github.com/awslabs/iot-app-kit/issues/66)) ([4f17201](https://github.com/awslabs/iot-app-kit/commit/4f17201f5990876b67861f091dbdcdb5345a28c2))
* batch API for historical, aggregated, and latest value data ([#137](https://github.com/awslabs/iot-app-kit/issues/137)) ([b7a38e2](https://github.com/awslabs/iot-app-kit/commit/b7a38e225199989524914b88f8da43ca77af2e54))
* bind gestures to components ([#31](https://github.com/awslabs/iot-app-kit/issues/31)) ([799763b](https://github.com/awslabs/iot-app-kit/commit/799763b8dc0adf146704ad56d7814bc3ae88d3e9))
* **components:** support viewport grouping in iot-table using ViewportManager. ([feba985](https://github.com/awslabs/iot-app-kit/commit/feba985487156207fee0ca576ed76d39133d9db0))
* **composer:** add data overaly ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add overlay panel config editor ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add runtime tag settings change support ([eeda501](https://github.com/awslabs/iot-app-kit/commit/eeda501d456c10f61123f9c4f77618bb870816f5))
* **composer:** data binding variable support for data overlay ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data overlay editor & render markdown ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** implement add overlay from menu ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** Implement data overlay container ([#595](https://github.com/awslabs/iot-app-kit/issues/595)) ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** update TagResize feature implementation ([b8dfb46](https://github.com/awslabs/iot-app-kit/commit/b8dfb468043ff6c8b4f154c145f997c6467117ec))
* **composer:** visibility toggles for overlays in settings panel ([4fc0527](https://github.com/awslabs/iot-app-kit/commit/4fc05276aa3f55f19aa8c0792ade3deb58eef7a3))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async ([69a017e](https://github.com/awslabs/iot-app-kit/commit/69a017ea8dfbd99fcd3c155278cac3c241b30527))
* **core:** Add meta field to requestInfos in TimeSeriesDataModule ([5db70c8](https://github.com/awslabs/iot-app-kit/commit/5db70c85e51dd6a44b2ab89049a952da9140c990))
* **core:** Add viewportManager to orchestrate viewport syncing within groups ([8990d13](https://github.com/awslabs/iot-app-kit/commit/8990d135c26cc02619a87312d8b00edc5978a603))
* **core:** Refactor time series data module to  remove unused functionality. Add meta field to data stream. ([7f12267](https://github.com/awslabs/iot-app-kit/commit/7f1226784158bdfff6ab67ab5b0523649a2f7a34))
* **core:** Support caching of dataType, name and other fields describing dataStreams ([542add6](https://github.com/awslabs/iot-app-kit/commit/542add6cac2f40c421687843c3977c9e4cb6e808))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([16451b1](https://github.com/awslabs/iot-app-kit/commit/16451b12e0fe2662069275185b2fea61048d3fab))
* create tree table base component ([#15](https://github.com/awslabs/iot-app-kit/issues/15)) ([4678f80](https://github.com/awslabs/iot-app-kit/commit/4678f80a114958d8fedf51c980fc3c2fbd718d2c))
* customizable resolutions ([#23](https://github.com/awslabs/iot-app-kit/issues/23)) ([0ffd474](https://github.com/awslabs/iot-app-kit/commit/0ffd4748c3be124045def6a404d097aa0d029a7b))
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
* **EnvironmentModel:** Adding support for environment overlay ([#262](https://github.com/awslabs/iot-app-kit/issues/262)) ([0277027](https://github.com/awslabs/iot-app-kit/commit/0277027d59f232c2c8e29fac0bc53399a1eb9c1e))
* error handling/data-module core ([#14](https://github.com/awslabs/iot-app-kit/issues/14)) ([376929f](https://github.com/awslabs/iot-app-kit/commit/376929fda106a808d312b8b92a309c9184857fe1))
* expand children in resource explorer ([#115](https://github.com/awslabs/iot-app-kit/issues/115)) ([8f1c03c](https://github.com/awslabs/iot-app-kit/commit/8f1c03c57f19c30dc04fbad10b5622ad9fc3c5bd))
* explicitly type sitewise query ([#59](https://github.com/awslabs/iot-app-kit/issues/59)) ([e62f44b](https://github.com/awslabs/iot-app-kit/commit/e62f44b6a776d09677786e8978a0c0c2d786c9d1))
* expose ttlDurationMapping as data module configuration ([#20](https://github.com/awslabs/iot-app-kit/issues/20)) ([acb7520](https://github.com/awslabs/iot-app-kit/commit/acb752048840e7de6b087d45ecc999ed13a4b355))
* **github:** add github workflow to publish alpha dashboard ([92eb162](https://github.com/awslabs/iot-app-kit/commit/92eb162288b26a3bdc2297b65108537a7c4ceb9d))
* improve clean script ([#43](https://github.com/awslabs/iot-app-kit/issues/43)) ([38f5f84](https://github.com/awslabs/iot-app-kit/commit/38f5f846b02c3dfc6b8b827f5daaa8ffc5d50199))
* improve documentation ([#90](https://github.com/awslabs/iot-app-kit/issues/90)) ([83c706d](https://github.com/awslabs/iot-app-kit/commit/83c706d74d896db6fd2864af6b26db4718d4fcdc))
* improve documentation and clarity of react-components pkg ([#60](https://github.com/awslabs/iot-app-kit/issues/60)) ([f4239cf](https://github.com/awslabs/iot-app-kit/commit/f4239cf1ca201044095004a2e6c358f3a4c90ebc))
* Improve documentation formatting ([#93](https://github.com/awslabs/iot-app-kit/issues/93)) ([035d8e1](https://github.com/awslabs/iot-app-kit/commit/035d8e13f6e3ce77141ec610ef64abaa435a1a73))
* improve error handling ([#61](https://github.com/awslabs/iot-app-kit/issues/61)) ([5016e41](https://github.com/awslabs/iot-app-kit/commit/5016e4108714edc3e3b2a2465126f48212068ffd))
* Improve resource explorer docs ([#95](https://github.com/awslabs/iot-app-kit/issues/95)) ([0709c08](https://github.com/awslabs/iot-app-kit/commit/0709c0838fc51f100d7de7c4239579073aaf17ea))
* increase sitewise default resolution mapping thresholds ([#46](https://github.com/awslabs/iot-app-kit/issues/46)) ([f2d1011](https://github.com/awslabs/iot-app-kit/commit/f2d10116e512bb4ba799cb09b5227098ea43b688))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* introduce module coordinator ([#47](https://github.com/awslabs/iot-app-kit/issues/47)) ([36684eb](https://github.com/awslabs/iot-app-kit/commit/36684ebf6eb71928c3b66f9bb694a3694a2dbabf))
* **Matterport:** Integrate Matterport Showcase Viewer into TwinMaker SceneComposer ([58236e7](https://github.com/awslabs/iot-app-kit/commit/58236e7eed7f5435480cba6ce214346a4f8d3a86))
* Onboard cypress with component test runner ([#34](https://github.com/awslabs/iot-app-kit/issues/34)) ([b82d682](https://github.com/awslabs/iot-app-kit/commit/b82d682798295547248df2ffa57f0790dd328d96))
* **OpacityFilterZero:** Setting opacity to 0 should effectively hide the object ([#342](https://github.com/awslabs/iot-app-kit/issues/342)) ([91e491b](https://github.com/awslabs/iot-app-kit/commit/91e491b45ad2e31f4e407686fbf40c8c0df9f9d0))
* pass thru annotations ([#65](https://github.com/awslabs/iot-app-kit/issues/65)) ([f9e3d31](https://github.com/awslabs/iot-app-kit/commit/f9e3d31fae6f5b2f905edc6f26875e8b8317cb5a))
* prevent unsupported data types from being rendered ([#426](https://github.com/awslabs/iot-app-kit/issues/426)) ([dec2a86](https://github.com/awslabs/iot-app-kit/commit/dec2a86f0eccfe87ebfc32d89f74fb8695bb552d))
* **props:** adapt props for synchro-charts ([#133](https://github.com/awslabs/iot-app-kit/issues/133)) ([a98bf06](https://github.com/awslabs/iot-app-kit/commit/a98bf064f14979823f51437dbd599259b6bd6d78))
* query provider classes and TimeSeriesData support ([#51](https://github.com/awslabs/iot-app-kit/issues/51)) ([173f46a](https://github.com/awslabs/iot-app-kit/commit/173f46a8951339da412a9e5c3ba282f41a897718))
* **react-comp:** isThresholdBreached checks all comparison ops ([de3fe49](https://github.com/awslabs/iot-app-kit/commit/de3fe495b764d45dd9c364b93f2e5898d2cb661e))
* **react-components:** publish TimeSync component as part of the public API ([#621](https://github.com/awslabs/iot-app-kit/issues/621)) ([a4e2f66](https://github.com/awslabs/iot-app-kit/commit/a4e2f66e6a0a2d58eb1a5316ac3fab4520dd3161))
* **react-components:** release useViewport hook ([#631](https://github.com/awslabs/iot-app-kit/issues/631)) ([794b4a4](https://github.com/awslabs/iot-app-kit/commit/794b4a49c70824836ac0fadf8008d0937059d16d))
* **react-comp:** sync viewports using @iot-app-kit/charts pckg ([08c7eda](https://github.com/awslabs/iot-app-kit/commit/08c7eda38c600120aebe228285c5c1dc311ab8af))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **ReactComponents:** support alarms via thresholds ingested from useTimeSeriesData hook ([4df9ff0](https://github.com/awslabs/iot-app-kit/commit/4df9ff00083239e3eb32b7766ec16396a5f7deb4))
* refactor app kit ([#67](https://github.com/awslabs/iot-app-kit/issues/67)) ([215584d](https://github.com/awslabs/iot-app-kit/commit/215584db25265437117462c579c1d15c2f1e4dca))
* Refactor Asset Tree to use the new Query/Provider system ([#62](https://github.com/awslabs/iot-app-kit/issues/62)) ([cccbe61](https://github.com/awslabs/iot-app-kit/commit/cccbe61cb596b284752cc240b8e95e261b03956b))
* Refactor Site Wise Asset session interface to support Promises ([#40](https://github.com/awslabs/iot-app-kit/issues/40)) ([184ccc6](https://github.com/awslabs/iot-app-kit/commit/184ccc6dc6ce9236048aa6e8595e7d4e61afeed3))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))
* request data in descending order ([#30](https://github.com/awslabs/iot-app-kit/issues/30)) ([29b23a7](https://github.com/awslabs/iot-app-kit/commit/29b23a775acae75c65172e68e4b502e5238f863f))
* Resource Explorer ([#24](https://github.com/awslabs/iot-app-kit/issues/24)) ([2e9d746](https://github.com/awslabs/iot-app-kit/commit/2e9d7467ff3aa4c954f486f89a6693a193821cb2))
* **resource explorer:** allow dashboard to only show asset name ([5df2c5c](https://github.com/awslabs/iot-app-kit/commit/5df2c5cf9f289360ea4a80f3188c7d16307b5e06))
* restructure mocks of sitewise to all be co-located ([#52](https://github.com/awslabs/iot-app-kit/issues/52)) ([557484f](https://github.com/awslabs/iot-app-kit/commit/557484f3182168b6253d653417318dcbd127698e))
* set up table package and add createTableItems method ([#124](https://github.com/awslabs/iot-app-kit/issues/124)) ([d827d21](https://github.com/awslabs/iot-app-kit/commit/d827d216ef69cb6207f6ef6f23b7ddce4ae76b6b))
* sitewise components use query and provider ([#54](https://github.com/awslabs/iot-app-kit/issues/54)) ([80cf5d4](https://github.com/awslabs/iot-app-kit/commit/80cf5d4cf08e78d05b90bb0c84c18323885c32e5))
* Sitewise Resource Explorer ([#21](https://github.com/awslabs/iot-app-kit/issues/21)) ([8f26b58](https://github.com/awslabs/iot-app-kit/commit/8f26b58433ff05bd6709c7659dfb6b015e6a90dd))
* source-iotsitewise useable module ([#63](https://github.com/awslabs/iot-app-kit/issues/63)) ([21a1014](https://github.com/awslabs/iot-app-kit/commit/21a1014b29df70185360d71fdfb963863b1944d9))
* **source-iotsitewise:** support propertyAlias in quries ([bfe32ce](https://github.com/awslabs/iot-app-kit/commit/bfe32ce74ba6008ae6bb15d1b5f60e8546d36135))
* support auto-assigning colors for certain components ([#96](https://github.com/awslabs/iot-app-kit/issues/96)) ([d75e426](https://github.com/awslabs/iot-app-kit/commit/d75e4261088fefab5886a0325818228930c6f363))
* support fetchMostRecentBeforeStart ([#79](https://github.com/awslabs/iot-app-kit/issues/79)) ([c44b7b8](https://github.com/awslabs/iot-app-kit/commit/c44b7b8d3e04d1b7becacd1fe1f7c59de681d517))
* Support multiple queries per subscription ([#39](https://github.com/awslabs/iot-app-kit/issues/39)) ([57772c1](https://github.com/awslabs/iot-app-kit/commit/57772c1b9beb5a0b39d5e1475bd0b0038271f944))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))
* **table:** create new Table component based on AWSUI Table component ([#129](https://github.com/awslabs/iot-app-kit/issues/129)) ([ba18720](https://github.com/awslabs/iot-app-kit/commit/ba18720829be791fd030e4a6cf57f2254b65f09f))
* **table:** support messageOverrides ([#211](https://github.com/awslabs/iot-app-kit/issues/211)) ([ccb7a32](https://github.com/awslabs/iot-app-kit/commit/ccb7a3286962f459386d10d84a923621b5839625))
* **time-sync:** useViewport returns a group ([c12349b](https://github.com/awslabs/iot-app-kit/commit/c12349b17e7ed917babd394a05c7a47f0b8bccc0))
* **TimeSync:** add a lastUsedBy string to the useViewport hook ([526f059](https://github.com/awslabs/iot-app-kit/commit/526f059dcfe74d8590b9ee0add435700d3ed943d))
* **TwinMaker:** Add TwinMaker packages ([#252](https://github.com/awslabs/iot-app-kit/issues/252)) ([fabbe03](https://github.com/awslabs/iot-app-kit/commit/fabbe0399dd37293e99588124404c37c929f4330))
* **TwinMakerTools:** add twin maker tools package ([79cf53b](https://github.com/awslabs/iot-app-kit/commit/79cf53b5a5e278de783e860a360e45867acf1b4d))
* update sitewise component interface ([#58](https://github.com/awslabs/iot-app-kit/issues/58)) ([1927053](https://github.com/awslabs/iot-app-kit/commit/1927053f7c8b3dff25b26d246e632ba2b26a4429))
* update synchro charts to 3.1.0, update docs ([#92](https://github.com/awslabs/iot-app-kit/issues/92)) ([10a55fa](https://github.com/awslabs/iot-app-kit/commit/10a55fad0b2eb1271aa449f0c0ebfc010a40e08b))
* Wrap SiteWise Asset related API calls in a Data Source ([36475b8](https://github.com/awslabs/iot-app-kit/commit/36475b826b11a4ac205312eaee63f7188d1b9ea8))


### Bug Fixes

* **actions:** run publish workflow on change to the workflow ([11c5dfe](https://github.com/awslabs/iot-app-kit/commit/11c5dfe567821e16944f9b5ce1f8ad5d9ac542d7))
* **actions:** update publish action for core-util ([16bf9fc](https://github.com/awslabs/iot-app-kit/commit/16bf9fcacbf4dffd3979402b8451b880e14c6a61))
* **actions:** updating release-please command ([5fb120e](https://github.com/awslabs/iot-app-kit/commit/5fb120e1d88e8193b0cb99b1bb24803518aef2aa))
* Add appropriate default resolution for bar chart ([#76](https://github.com/awslabs/iot-app-kit/issues/76)) ([ddce235](https://github.com/awslabs/iot-app-kit/commit/ddce2355bbb8edefaa246ea1872efef6c24a480a))
* add dashboard package to the npm workspace config ([91ec14e](https://github.com/awslabs/iot-app-kit/commit/91ec14e0bd8747717c9acaf6a63fb2a9aa987753))
* Add dashboard to release-please-config ([35730e7](https://github.com/awslabs/iot-app-kit/commit/35730e7e7f78ae83a51a65dd41f572d96e4e5eb2))
* Allows user to hit Esc key to cancel Enhanced Editing ([#272](https://github.com/awslabs/iot-app-kit/issues/272)) ([6b73fad](https://github.com/awslabs/iot-app-kit/commit/6b73fad6db0bc61a4935bec76ebaecf39da366c5))
* backfill on requestBuffer tests ([#55](https://github.com/awslabs/iot-app-kit/issues/55)) ([416eea1](https://github.com/awslabs/iot-app-kit/commit/416eea108bc9b353ab9da1d98f3f3ceeaf994cdb))
* **BarChart:** prevent bar chart from trying to request raw data by default ([6845d95](https://github.com/awslabs/iot-app-kit/commit/6845d95789861a1d6d97cfb4322f6371983de729))
* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **build:** add missing dev deps in scene-composer ([b128405](https://github.com/awslabs/iot-app-kit/commit/b1284052e7db7247bd1bbe4758cde21ba584f8c5))
* **CameraView:** Minimum FOV check introduced ([#284](https://github.com/awslabs/iot-app-kit/issues/284)) ([6a8d9f1](https://github.com/awslabs/iot-app-kit/commit/6a8d9f1cbc7995efc612a7cac9f551c7c43ba438))
* **charts:** fix live mode viewport scrollingbug ([dbea3ff](https://github.com/awslabs/iot-app-kit/commit/dbea3ff3f1908a6a48b1ca9ee5c654f9b55eb616))
* **ci:** allow releases to be trigged via changes to github workflows ([5265ed0](https://github.com/awslabs/iot-app-kit/commit/5265ed0f30a4524cb5b5f0643f8b079537ffd074))
* **ci:** release as 3.0.1@alpha ([6677a1f](https://github.com/awslabs/iot-app-kit/commit/6677a1f011e72387fcf170e0944a9acb780a239a))
* **components:** fix connector to iot app kit components ([be91864](https://github.com/awslabs/iot-app-kit/commit/be91864aee326c1c3fd5320b30b86d34f9f246d0))
* **components:** import missing CSS style sheets. ([9634ec9](https://github.com/awslabs/iot-app-kit/commit/9634ec92bb471700e5e982bf014b355595cf7f25))
* **components:** move message merge to componentWillRender() ([8e2d260](https://github.com/awslabs/iot-app-kit/commit/8e2d2601a2e7e6808b0c1037cee1dd7957b39af3))
* **composer:** Adding ability to deselect by click radio button ([#351](https://github.com/awslabs/iot-app-kit/issues/351)) ([8c402b7](https://github.com/awslabs/iot-app-kit/commit/8c402b774b9a10ffdcdd13fc0a9f2f89f3eb507b))
* **composer:** Adjusting logic for reparenting scene nodes ([#369](https://github.com/awslabs/iot-app-kit/issues/369)) ([3475ebd](https://github.com/awslabs/iot-app-kit/commit/3475ebd404c728226cc1582667cabfd1420a8afa))
* **composer:** Allows nodes to be dropped at root level ([#390](https://github.com/awslabs/iot-app-kit/issues/390)) ([d9d7978](https://github.com/awslabs/iot-app-kit/commit/d9d79789e67a43b94057ad0ff45c663e186cacf7))
* **composer:** Auto expand hierarchy when selecting node on scene ([#452](https://github.com/awslabs/iot-app-kit/issues/452)) ([9b3e80f](https://github.com/awslabs/iot-app-kit/commit/9b3e80f17f26ef0268eaeb6222d79f077d057c97))
* **composer:** boolean data always converted to false ([#323](https://github.com/awslabs/iot-app-kit/issues/323)) ([254d68f](https://github.com/awslabs/iot-app-kit/commit/254d68f610efd1c75963f91c185bd42a2d649365))
* **composer:** Bug fix for rerenders on name input in inspect panel ([#334](https://github.com/awslabs/iot-app-kit/issues/334)) ([b8a0b4c](https://github.com/awslabs/iot-app-kit/commit/b8a0b4c4e8371637a0f1342f96196ca5b46ed383))
* **composer:** Camera and Light helper visibility toggling ([#294](https://github.com/awslabs/iot-app-kit/issues/294)) ([4f62051](https://github.com/awslabs/iot-app-kit/commit/4f6205157cb30c3a4af28ea6680ebfe39e0a16e4))
* **composer:** CSS Cleanup for Sceneviewer ([#379](https://github.com/awslabs/iot-app-kit/issues/379)) ([890dc4d](https://github.com/awslabs/iot-app-kit/commit/890dc4d57b3b756e90d47884fdf8a275595a1bc5))
* **composer:** drag root node crashes scene ([#372](https://github.com/awslabs/iot-app-kit/issues/372)) ([ca01c40](https://github.com/awslabs/iot-app-kit/commit/ca01c40241cad7f86f1bbb1a9b920795485076b8))
* **composer:** enable new features for SceneViewer ([#355](https://github.com/awslabs/iot-app-kit/issues/355)) ([631953a](https://github.com/awslabs/iot-app-kit/commit/631953a674fd8969e88b64c215ed8cd51b961e8e))
* **composer:** Enhanced Edit now allows for undo operation ([#376](https://github.com/awslabs/iot-app-kit/issues/376)) ([5e73bb8](https://github.com/awslabs/iot-app-kit/commit/5e73bb80d303fda63f81dd543b76add11ca61670))
* **composer:** entityId data binding not rendered ([#389](https://github.com/awslabs/iot-app-kit/issues/389)) ([6ad596f](https://github.com/awslabs/iot-app-kit/commit/6ad596f2d5cf31039b8dd5d0fdd069fb91ffc45d))
* **composer:** fix adding tag always attached to root ([#281](https://github.com/awslabs/iot-app-kit/issues/281)) ([f9ff7b1](https://github.com/awslabs/iot-app-kit/commit/f9ff7b1198fdcf073340bbdd4df89c61752d2b4d))
* **composer:** Fix camera view positioning under sub model ([#341](https://github.com/awslabs/iot-app-kit/issues/341)) ([94dcdda](https://github.com/awslabs/iot-app-kit/commit/94dcdda65a7c44cf449828338bed1ea132f995ea))
* **composer:** Fix e.removeFromParent and camera focus ([#350](https://github.com/awslabs/iot-app-kit/issues/350)) ([8458e50](https://github.com/awslabs/iot-app-kit/commit/8458e50f4ec87aa5e7e4f722017766f447d71b5e))
* **composer:** fix error with rendering 3D tiles ([785d833](https://github.com/awslabs/iot-app-kit/commit/785d8338fbb2908a01a6a40b55cc3d7b3fda1ab4))
* **composer:** Fix for bug on drag/drop introduced in last PR & fix for drag/drop icons: ([#364](https://github.com/awslabs/iot-app-kit/issues/364)) ([6dc40b9](https://github.com/awslabs/iot-app-kit/commit/6dc40b918cdfe6cc0d5447d9cb5ca2267ccd2afa))
* **composer:** Fix for displaying children on search results ([#365](https://github.com/awslabs/iot-app-kit/issues/365)) ([15f75cb](https://github.com/awslabs/iot-app-kit/commit/15f75cb6a9094ec4218a21fca287137d9feb7c88))
* **composer:** Fix for duplicate submodels in tree on adding objects to scene ([#370](https://github.com/awslabs/iot-app-kit/issues/370)) ([6c4bcdf](https://github.com/awslabs/iot-app-kit/commit/6c4bcdfd9c76895c76b487f0dfd323e76770d8b3))
* **composer:** Fix for useEffect error ([#373](https://github.com/awslabs/iot-app-kit/issues/373)) ([d74e45e](https://github.com/awslabs/iot-app-kit/commit/d74e45e3094450679a936e852bd7e2c7a65de678))
* **composer:** fix model shader material color restore ([#290](https://github.com/awslabs/iot-app-kit/issues/290)) ([19ce7f1](https://github.com/awslabs/iot-app-kit/commit/19ce7f196850897aa37873e2710974496ac89ac9))
* **composer:** fix object transforms during reparenting ([#477](https://github.com/awslabs/iot-app-kit/issues/477)) ([7a45bb3](https://github.com/awslabs/iot-app-kit/commit/7a45bb3eb1c2418396b39c7d092a380eb32ba250))
* **composer:** fix show svg ([#279](https://github.com/awslabs/iot-app-kit/issues/279)) ([3b7924d](https://github.com/awslabs/iot-app-kit/commit/3b7924dace7d11c726bb43a3f7a790415a049ed5))
* **composer:** Fix to persist drag/drop actions after refresh ([#367](https://github.com/awslabs/iot-app-kit/issues/367)) ([50f3538](https://github.com/awslabs/iot-app-kit/commit/50f353869e241fc05cc2d7d6122ccc604f7bf081))
* **composer:** Fix to restore drag-&-drop placement after refresh ([#361](https://github.com/awslabs/iot-app-kit/issues/361)) ([bd47478](https://github.com/awslabs/iot-app-kit/commit/bd474787dff3c43bcc9ca1d3711396936066c85f))
* **composer:** Fixes 2nd camera viewing click bug ([#291](https://github.com/awslabs/iot-app-kit/issues/291)) ([7899333](https://github.com/awslabs/iot-app-kit/commit/78993334a60ea16293ed6a53f82f99b29a54c0df))
* **composer:** Fixes expand button on hierarchies ([#371](https://github.com/awslabs/iot-app-kit/issues/371)) ([69fc869](https://github.com/awslabs/iot-app-kit/commit/69fc869f178d90ad8e785948b0aae48b01fea27d))
* **composer:** Fixes for layout in Console, submodel layout updates, bug fix for submodel interactive highlights ([#344](https://github.com/awslabs/iot-app-kit/issues/344)) ([a1ea148](https://github.com/awslabs/iot-app-kit/commit/a1ea148c8de1ddabc713c87b379d9e95901d2e03))
* **composer:** Fixes the Duplication of sub models on scene reload by adding persistant identifier to the sub model ([#356](https://github.com/awslabs/iot-app-kit/issues/356)) ([446a4ca](https://github.com/awslabs/iot-app-kit/commit/446a4caa6fb71b05ffaeadac80839fe9c7fd56af))
* **composer:** Fixes the light helper delete while maintaining visibility link ([#349](https://github.com/awslabs/iot-app-kit/issues/349)) ([2f51263](https://github.com/awslabs/iot-app-kit/commit/2f5126377e8cc40645188487499946e2477418e4))
* **composer:** hdr url is sometimes wrong ([#352](https://github.com/awslabs/iot-app-kit/issues/352)) ([2c2625e](https://github.com/awslabs/iot-app-kit/commit/2c2625e6630cecd64231f2b8a6d7876a75ee3347))
* **composer:** Maintain the position in 3D space regardless of the parent ([#375](https://github.com/awslabs/iot-app-kit/issues/375)) ([a106e77](https://github.com/awslabs/iot-app-kit/commit/a106e774bd0bdb13278cdc978f7fb22df1c01a38))
* **composer:** One instance of sub models allowed per instance of the model ([#366](https://github.com/awslabs/iot-app-kit/issues/366)) ([24f3914](https://github.com/awslabs/iot-app-kit/commit/24f3914ac0954cf411a215dd58d74a9eeb8f05cc))
* **composer:** Removing dashboard package to fix pipeline ([#338](https://github.com/awslabs/iot-app-kit/issues/338)) ([9a2c991](https://github.com/awslabs/iot-app-kit/commit/9a2c9917729a5a8b273920aec91e47bacf8b8251))
* **composer:** reorder doesn't persist after reloading ([#374](https://github.com/awslabs/iot-app-kit/issues/374)) ([8c90889](https://github.com/awslabs/iot-app-kit/commit/8c908898f34c51a9ab05c4ef284db4428b3d4f2e))
* **composer:** reorder to same parent duplicates child ([b76057d](https://github.com/awslabs/iot-app-kit/commit/b76057d17f23ad25d9f48497619bf49e23fcecb3))
* **composer:** Restores drag-&-drop functionality in Scene Hierarchy ([#359](https://github.com/awslabs/iot-app-kit/issues/359)) ([b220501](https://github.com/awslabs/iot-app-kit/commit/b22050101400f102be2a0aed46b5b15c7b6fecc5))
* **Composer:** Safe bounding box and 3D cursor fix ([#327](https://github.com/awslabs/iot-app-kit/issues/327)) ([a31585f](https://github.com/awslabs/iot-app-kit/commit/a31585fe447d0aa6a0bda855ffbdd8a4d756798d))
* **composer:** scene change is sometimes not saved ([#409](https://github.com/awslabs/iot-app-kit/issues/409)) ([7b0c45a](https://github.com/awslabs/iot-app-kit/commit/7b0c45aab025a90827a472afb0efc85077dd7ef9))
* **composer:** Scene Hierarchy radio buttons & bug fix for selection on single click ([#326](https://github.com/awslabs/iot-app-kit/issues/326)) ([1026cb4](https://github.com/awslabs/iot-app-kit/commit/1026cb4d607317a43bb45e0058e9762a3a5430c1))
* **composer:** selectedDataBinding not able to update selected node ([#274](https://github.com/awslabs/iot-app-kit/issues/274)) ([ee68f7e](https://github.com/awslabs/iot-app-kit/commit/ee68f7e6825b438f2f7dfd7927f3ee24d471d3fa))
* **composer:** Set tree hierarchy items to auto-collapsed on load ([#380](https://github.com/awslabs/iot-app-kit/issues/380)) ([dad88a0](https://github.com/awslabs/iot-app-kit/commit/dad88a0925a0dbf5c9c15e9e79cd4f025fb54682))
* **composer:** submodel and hierarchy search fix ([#320](https://github.com/awslabs/iot-app-kit/issues/320)) ([364cefb](https://github.com/awslabs/iot-app-kit/commit/364cefb9d4fb820b04e30e8761409a7ad00a5825))
* **composer:** SubModel child fix ([#363](https://github.com/awslabs/iot-app-kit/issues/363)) ([da574e8](https://github.com/awslabs/iot-app-kit/commit/da574e8cd3b62c1dbe275e38faf8590481fc1f0b))
* **composer:** support Windows dependency file paths in GLTF loader ([#417](https://github.com/awslabs/iot-app-kit/issues/417)) ([9f7c075](https://github.com/awslabs/iot-app-kit/commit/9f7c075f58458c75f7bc04cd8287dd0087281f0c))
* **composer:** update translations ([3e8d391](https://github.com/awslabs/iot-app-kit/commit/3e8d39155ea077f37320890ac57e9505d9a719a2))
* **composer:** update translations ([#302](https://github.com/awslabs/iot-app-kit/issues/302)) ([8b6f7a1](https://github.com/awslabs/iot-app-kit/commit/8b6f7a19fac0a3f1e11f1f722bbe6df3b010042b))
* **composer:** use arrow data as texture to avoid public path issue ([#276](https://github.com/awslabs/iot-app-kit/issues/276)) ([f7cbd96](https://github.com/awslabs/iot-app-kit/commit/f7cbd969f93ae021ebfa6853bd478b43e890c738))
* **core-util:** fix subdomain for clients ([cc0d584](https://github.com/awslabs/iot-app-kit/commit/cc0d58464155d04d30cb433d96003cd43f2a9ee4))
* **core-util:** remove private flag for the core-util packages ([0d86584](https://github.com/awslabs/iot-app-kit/commit/0d86584f9ab15a732ccb7d440a9cbf1f82eccae0))
* **core-util:** update publish config for core-utils ([2a3f22f](https://github.com/awslabs/iot-app-kit/commit/2a3f22f8f3df207f1882fa856f90a10ac40d23fd))
* **core, source-iotsitewise:** Remove unecessary exports ([#620](https://github.com/awslabs/iot-app-kit/issues/620)) ([4bfe6f8](https://github.com/awslabs/iot-app-kit/commit/4bfe6f8724b48e28c7efc668aa7268f39e60385a))
* **core:** add currentTime param to viewportStartDate and `viewportEndDate` ([ea75c74](https://github.com/awslabs/iot-app-kit/commit/ea75c748e48f8490d3fc9dce87ddee9ea4e84222))
* **core:** use Map to avoid prototype pollution ([fa0b7ef](https://github.com/awslabs/iot-app-kit/commit/fa0b7efaf27a62ad155a589d13096529e67fb874))
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
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([164b751](https://github.com/awslabs/iot-app-kit/commit/164b7511ef2d42f1e816d804628440e577f03e43))
* Development Quick Start Docs/Scripts ([#148](https://github.com/awslabs/iot-app-kit/issues/148)) ([aa9dba6](https://github.com/awslabs/iot-app-kit/commit/aa9dba6215dc066cc67a6f3933f9de7321b09507))
* **DragHandleIcon:** Drag Handle icon not showing up without special webpack config ([#345](https://github.com/awslabs/iot-app-kit/issues/345)) ([b8952ce](https://github.com/awslabs/iot-app-kit/commit/b8952ceba6c1e462bc3a45bb06b5c7ef54c5da32))
* **Example:** correct instructions on providing AWS credentials to example react-app ([960067f](https://github.com/awslabs/iot-app-kit/commit/960067f138b3cd6b65735f4b307f7bb8fd5608ba))
* Fix setTimeout error ([#32](https://github.com/awslabs/iot-app-kit/issues/32)) ([e174598](https://github.com/awslabs/iot-app-kit/commit/e174598bd6d323ed48af6feee610dc4312d26462))
* fix syntax not supported in all circumstances for package.json override ([#360](https://github.com/awslabs/iot-app-kit/issues/360)) ([7b97dd1](https://github.com/awslabs/iot-app-kit/commit/7b97dd1ab9064feee1c92ad615ef0a09cc4556a1))
* Fix the tag scaling with parent scale regression ([#282](https://github.com/awslabs/iot-app-kit/issues/282)) ([efd49fc](https://github.com/awslabs/iot-app-kit/commit/efd49fc66fbb1c30ff7e971c0d8e024a778468e8))
* **InternalBuild:** Downgrade cloudscape dependency to support internal build ([b20912b](https://github.com/awslabs/iot-app-kit/commit/b20912b77fa1d594d81364ac26df960754c0bace))
* mock SDK in component tests ([#56](https://github.com/awslabs/iot-app-kit/issues/56)) ([dd4bab5](https://github.com/awslabs/iot-app-kit/commit/dd4bab50d755baad24ec907312d428b9161389ac))
* prevent stream render if dataType unknown ([#448](https://github.com/awslabs/iot-app-kit/issues/448)) ([16999db](https://github.com/awslabs/iot-app-kit/commit/16999dbf8ed18770cccda0c993041a57e1c3d0c0))
* propertyName with multi hyphen not working ([#496](https://github.com/awslabs/iot-app-kit/issues/496)) ([7c7dc2c](https://github.com/awslabs/iot-app-kit/commit/7c7dc2c9ab1d82505b1e30dab98b58e728cf75a0))
* **react-components, videoPlayer:** fix propertiesNotChanged for videoPlayer ([11665c0](https://github.com/awslabs/iot-app-kit/commit/11665c0af13e98dc6602d8bf8aac7733d063633c))
* **react-components:** fix binding styles in `useTimeSeriesData` hook ([c1c0125](https://github.com/awslabs/iot-app-kit/commit/c1c012577448c6e07090b23ad988e39a3d530bb6))
* **react-components:** set timezone for jest to UTC to prevent local test failures ([44c3793](https://github.com/awslabs/iot-app-kit/commit/44c379338a2a9110600a0502e37ae4dceaf0ab09))
* **ReactComponents:** configure table, kpi and status to always fetch raw data ([c02b566](https://github.com/awslabs/iot-app-kit/commit/c02b566cad9aa2b8e700765f7923df2d4a6fbec4))
* related-table eslint and prettier ([#10](https://github.com/awslabs/iot-app-kit/issues/10)) ([67a7149](https://github.com/awslabs/iot-app-kit/commit/67a7149131813b8239079f2b931c78e5b607a708))
* **related-table:** expanded toggling already expanded nodes ([#382](https://github.com/awslabs/iot-app-kit/issues/382)) ([a6d29c8](https://github.com/awslabs/iot-app-kit/commit/a6d29c8b2ea1d74ede87a8db2db6920f3f546958))
* **release:** release as 4.0.0-nightly ([f2967b0](https://github.com/awslabs/iot-app-kit/commit/f2967b0d134b51fa8e7c0c833d8113eceaa79b0d))
* **release:** remove stray table references from release manifest ([83b1a9b](https://github.com/awslabs/iot-app-kit/commit/83b1a9b4c56473b93d75eb8303bcfabd75afe4df))
* remove full file eslint disable. Switch to minimal eslint disable. ([ba18720](https://github.com/awslabs/iot-app-kit/commit/ba18720829be791fd030e4a6cf57f2254b65f09f))
* remove prettier, enforce eslint on build ([#29](https://github.com/awslabs/iot-app-kit/issues/29)) ([1b2e5ca](https://github.com/awslabs/iot-app-kit/commit/1b2e5cad203a561feda89544382e38f453c64124))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* remove unused variables. ([13c7dfe](https://github.com/awslabs/iot-app-kit/commit/13c7dfe10dc4a8c02621d08bc1b959d647c083fb))
* **Reparenting:** Fix reparenting nodes ([#368](https://github.com/awslabs/iot-app-kit/issues/368)) ([8a66f94](https://github.com/awslabs/iot-app-kit/commit/8a66f940e98a31e3ef6937336e0e5114e23ad20c))
* requestBuffer ([#49](https://github.com/awslabs/iot-app-kit/issues/49)) ([b342b32](https://github.com/awslabs/iot-app-kit/commit/b342b32d5701cb9fe48e793628d6f0f89a2248f8))
* require npm &gt;=8.7.0 to fix yarn.lock issue with d3-color-1-fix ([#331](https://github.com/awslabs/iot-app-kit/issues/331)) ([eba59ca](https://github.com/awslabs/iot-app-kit/commit/eba59cac747cb5a359ddb6596f02c8a26d5cd5c0))
* resolve float decimal precision issue on round() function. ([#160](https://github.com/awslabs/iot-app-kit/issues/160)) ([6efeac4](https://github.com/awslabs/iot-app-kit/commit/6efeac47acce17da5f99104aec9d5a70cad366a2))
* resolves [#83](https://github.com/awslabs/iot-app-kit/issues/83) ([#87](https://github.com/awslabs/iot-app-kit/issues/87)) ([364716f](https://github.com/awslabs/iot-app-kit/commit/364716f72857526b93e63146fa378d2464974400))
* **scene-composer:** remove invalid workspace syntax ([#640](https://github.com/awslabs/iot-app-kit/issues/640)) ([ed3b28d](https://github.com/awslabs/iot-app-kit/commit/ed3b28dc86fdae2e70b639ce2774217cd92b6122))
* **SceneHierarchyPerformance:** SceneHierarchy Tree Performance ([#283](https://github.com/awslabs/iot-app-kit/issues/283)) ([5e93adc](https://github.com/awslabs/iot-app-kit/commit/5e93adcc5eb338b98a5c9d90b7873880df1bba1a))
* sitewise source time series module ([#71](https://github.com/awslabs/iot-app-kit/issues/71)) ([6671217](https://github.com/awslabs/iot-app-kit/commit/6671217f3f2b813ecec6e907ee85ba6e0dd347c6))
* **source-iotsitewise:** deduplicate batch requests ([#629](https://github.com/awslabs/iot-app-kit/issues/629)) ([0a5e8a1](https://github.com/awslabs/iot-app-kit/commit/0a5e8a1ec7eeec2c7f214a0f8c7963bb66990678))
* **source-iotsitewise:** move testing util to dev dep ([e10e548](https://github.com/awslabs/iot-app-kit/commit/e10e5487bf3f31e3b107a51cb4fc9da28057efe6))
* **source-iotsitewise:** use alarm model name in data stream instead of alarm state name ([3c3a1ae](https://github.com/awslabs/iot-app-kit/commit/3c3a1ae52df8f32d0217e82c463e624cc4880890))
* **SubModelHidingChildren:** Unnamed children should be skipped not omitted ([#377](https://github.com/awslabs/iot-app-kit/issues/377)) ([46be1c4](https://github.com/awslabs/iot-app-kit/commit/46be1c4ab34551b22cb1638e97025f4ae4b43347))
* Support additional parameters in intercepting calls to table cell renderer ([ce2be51](https://github.com/awslabs/iot-app-kit/commit/ce2be513327e658b5f391f0fbf94f9fe192af530))
* Swaped ternary statement terms ([#22](https://github.com/awslabs/iot-app-kit/issues/22)) ([b7899f1](https://github.com/awslabs/iot-app-kit/commit/b7899f12d88f22a1c5047859ddd3cedee9668915))
* **table:** add missing brackets. ([#183](https://github.com/awslabs/iot-app-kit/issues/183)) ([5c5ec7b](https://github.com/awslabs/iot-app-kit/commit/5c5ec7bb6e7cf636bf90dfe9eecdf6170ce2ea6a))
* **table:** fix an issue when key in columnDefinition doesn't exist in TableItems ([#146](https://github.com/awslabs/iot-app-kit/issues/146)) ([13c7dfe](https://github.com/awslabs/iot-app-kit/commit/13c7dfe10dc4a8c02621d08bc1b959d647c083fb))
* testing ground DataModule parameter ([#17](https://github.com/awslabs/iot-app-kit/issues/17)) ([61632de](https://github.com/awslabs/iot-app-kit/commit/61632de997cc5ced9e21b2625d6e221432649803))
* TilesLoader will now load all visible tiles ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* TilesLoader will now load all visible tiles ([#593](https://github.com/awslabs/iot-app-kit/issues/593)) ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* **typescript:** re-enables typescript for component package tests ([12f60b7](https://github.com/awslabs/iot-app-kit/commit/12f60b7847853e17d398e6346d470606467e2d5c))
* **UITests:** fix dashbaord e2e tests ([dd98c0e](https://github.com/awslabs/iot-app-kit/commit/dd98c0ea9ccd6a7dacc9ee5f994ccce7007f0b21))
* update @testing-library/react to use create root ([#151](https://github.com/awslabs/iot-app-kit/issues/151)) ([380e4cf](https://github.com/awslabs/iot-app-kit/commit/380e4cf60a7612a586d6a86891b78fe14240bff5))
* Updating documentation for Storybook ([#264](https://github.com/awslabs/iot-app-kit/issues/264)) ([83352bd](https://github.com/awslabs/iot-app-kit/commit/83352bdab956c8115dc08937e4acb442c6841a0d))
* use viewport from provider ([#515](https://github.com/awslabs/iot-app-kit/issues/515)) ([eb515a5](https://github.com/awslabs/iot-app-kit/commit/eb515a58cb807f421ca62004bb07cc3bdcb7cc50))
* **video-player:** use static timestamps instead dynamic ones ([1e434a6](https://github.com/awslabs/iot-app-kit/commit/1e434a6632c6dd797f9d0dacd3ed3547622d93c9))


### Miscellaneous Chores

* release 4.0.0-nightly ([c4d2c1b](https://github.com/awslabs/iot-app-kit/commit/c4d2c1b9201890be3b4d112079269b2207d3fd7c))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))

## [4.0.3](https://github.com/awslabs/iot-app-kit/compare/root-v4.0.2...root-v4.0.3) (2023-03-31)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper
* **source-iotsitewise:** support propertyAlias in quries
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* **core, source-iotsitewise:** 
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async
* **core:** Refactored export from `@iot-app-kit/core` IoTAppKitDataModule to be named TimeSeriesDataModule, and removed the concept of multiple data sources per time series data module

### Features

* Add Asset Hierarchy loading & Asset Tree support ([e36380a](https://github.com/awslabs/iot-app-kit/commit/e36380ad011b3e0b10a3b8a2d65245446248f55f))
* add CodeQL workflow ([#64](https://github.com/awslabs/iot-app-kit/issues/64)) ([bfd7c88](https://github.com/awslabs/iot-app-kit/commit/bfd7c88424faac92d2f11eb7fa44910cd1e2872d))
* Add Core SiteWise Asset Module ([a3ffec2](https://github.com/awslabs/iot-app-kit/commit/a3ffec2e490542b9bdd5587316e4ddd72573c109))
* add in styles overrides and refId in query ([#38](https://github.com/awslabs/iot-app-kit/issues/38)) ([76a9d63](https://github.com/awslabs/iot-app-kit/commit/76a9d63e02a13f3229f1ee58a1d35b974fe81ae2))
* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([64e64b8](https://github.com/awslabs/iot-app-kit/commit/64e64b800ad3b6ddbee78cfe84c3750e73dead65))
* Add proposed API changes within types declarations ([#37](https://github.com/awslabs/iot-app-kit/issues/37)) ([629fbeb](https://github.com/awslabs/iot-app-kit/commit/629fbeb46e10cfce699ca2c7906e651cb2a83f7b))
* add support for aggregated data for sitewise data source ([#6](https://github.com/awslabs/iot-app-kit/issues/6)) ([a50b31e](https://github.com/awslabs/iot-app-kit/commit/a50b31e8da30b93aa02ea8e89e44fa686bd71d67))
* add support for resolution mapping ([#16](https://github.com/awslabs/iot-app-kit/issues/16)) ([8dda905](https://github.com/awslabs/iot-app-kit/commit/8dda905ff27d6e5a749a7f90d59dd6cf1dad4ec8))
* Add support for update within subscribeToTimeSeriesData ([#53](https://github.com/awslabs/iot-app-kit/issues/53)) ([83b100f](https://github.com/awslabs/iot-app-kit/commit/83b100f29e7a2d5062597c13946db44af2ae4029))
* add test runner github action ([#8](https://github.com/awslabs/iot-app-kit/issues/8)) ([ef398b9](https://github.com/awslabs/iot-app-kit/commit/ef398b9e9c65c75562d87ec95e3b9c7b90751eaa))
* allow to specify region for data-module ([#4](https://github.com/awslabs/iot-app-kit/issues/4)) ([ae2ef66](https://github.com/awslabs/iot-app-kit/commit/ae2ef662ef98230fa64676e374e0401cbe64cce3))
* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* api simplification of requestSettings ([#27](https://github.com/awslabs/iot-app-kit/issues/27)) ([537b8ca](https://github.com/awslabs/iot-app-kit/commit/537b8ca3a459cb1ea70ec99a10697f34ba343657))
* backfill component integration tests ([#66](https://github.com/awslabs/iot-app-kit/issues/66)) ([4f17201](https://github.com/awslabs/iot-app-kit/commit/4f17201f5990876b67861f091dbdcdb5345a28c2))
* batch API for historical, aggregated, and latest value data ([#137](https://github.com/awslabs/iot-app-kit/issues/137)) ([b7a38e2](https://github.com/awslabs/iot-app-kit/commit/b7a38e225199989524914b88f8da43ca77af2e54))
* bind gestures to components ([#31](https://github.com/awslabs/iot-app-kit/issues/31)) ([799763b](https://github.com/awslabs/iot-app-kit/commit/799763b8dc0adf146704ad56d7814bc3ae88d3e9))
* **components:** support viewport grouping in iot-table using ViewportManager. ([feba985](https://github.com/awslabs/iot-app-kit/commit/feba985487156207fee0ca576ed76d39133d9db0))
* **composer:** add data overaly ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add overlay panel config editor ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add runtime tag settings change support ([eeda501](https://github.com/awslabs/iot-app-kit/commit/eeda501d456c10f61123f9c4f77618bb870816f5))
* **composer:** data binding variable support for data overlay ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data overlay editor & render markdown ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** implement add overlay from menu ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** Implement data overlay container ([#595](https://github.com/awslabs/iot-app-kit/issues/595)) ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** update TagResize feature implementation ([b8dfb46](https://github.com/awslabs/iot-app-kit/commit/b8dfb468043ff6c8b4f154c145f997c6467117ec))
* **composer:** visibility toggles for overlays in settings panel ([4fc0527](https://github.com/awslabs/iot-app-kit/commit/4fc05276aa3f55f19aa8c0792ade3deb58eef7a3))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async ([69a017e](https://github.com/awslabs/iot-app-kit/commit/69a017ea8dfbd99fcd3c155278cac3c241b30527))
* **core:** Add meta field to requestInfos in TimeSeriesDataModule ([5db70c8](https://github.com/awslabs/iot-app-kit/commit/5db70c85e51dd6a44b2ab89049a952da9140c990))
* **core:** Add viewportManager to orchestrate viewport syncing within groups ([8990d13](https://github.com/awslabs/iot-app-kit/commit/8990d135c26cc02619a87312d8b00edc5978a603))
* **core:** Refactor time series data module to  remove unused functionality. Add meta field to data stream. ([7f12267](https://github.com/awslabs/iot-app-kit/commit/7f1226784158bdfff6ab67ab5b0523649a2f7a34))
* **core:** Support caching of dataType, name and other fields describing dataStreams ([542add6](https://github.com/awslabs/iot-app-kit/commit/542add6cac2f40c421687843c3977c9e4cb6e808))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([16451b1](https://github.com/awslabs/iot-app-kit/commit/16451b12e0fe2662069275185b2fea61048d3fab))
* create tree table base component ([#15](https://github.com/awslabs/iot-app-kit/issues/15)) ([4678f80](https://github.com/awslabs/iot-app-kit/commit/4678f80a114958d8fedf51c980fc3c2fbd718d2c))
* customizable resolutions ([#23](https://github.com/awslabs/iot-app-kit/issues/23)) ([0ffd474](https://github.com/awslabs/iot-app-kit/commit/0ffd4748c3be124045def6a404d097aa0d029a7b))
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
* **EnvironmentModel:** Adding support for environment overlay ([#262](https://github.com/awslabs/iot-app-kit/issues/262)) ([0277027](https://github.com/awslabs/iot-app-kit/commit/0277027d59f232c2c8e29fac0bc53399a1eb9c1e))
* error handling/data-module core ([#14](https://github.com/awslabs/iot-app-kit/issues/14)) ([376929f](https://github.com/awslabs/iot-app-kit/commit/376929fda106a808d312b8b92a309c9184857fe1))
* expand children in resource explorer ([#115](https://github.com/awslabs/iot-app-kit/issues/115)) ([8f1c03c](https://github.com/awslabs/iot-app-kit/commit/8f1c03c57f19c30dc04fbad10b5622ad9fc3c5bd))
* explicitly type sitewise query ([#59](https://github.com/awslabs/iot-app-kit/issues/59)) ([e62f44b](https://github.com/awslabs/iot-app-kit/commit/e62f44b6a776d09677786e8978a0c0c2d786c9d1))
* expose ttlDurationMapping as data module configuration ([#20](https://github.com/awslabs/iot-app-kit/issues/20)) ([acb7520](https://github.com/awslabs/iot-app-kit/commit/acb752048840e7de6b087d45ecc999ed13a4b355))
* **github:** add github workflow to publish alpha dashboard ([92eb162](https://github.com/awslabs/iot-app-kit/commit/92eb162288b26a3bdc2297b65108537a7c4ceb9d))
* improve clean script ([#43](https://github.com/awslabs/iot-app-kit/issues/43)) ([38f5f84](https://github.com/awslabs/iot-app-kit/commit/38f5f846b02c3dfc6b8b827f5daaa8ffc5d50199))
* improve documentation ([#90](https://github.com/awslabs/iot-app-kit/issues/90)) ([83c706d](https://github.com/awslabs/iot-app-kit/commit/83c706d74d896db6fd2864af6b26db4718d4fcdc))
* improve documentation and clarity of react-components pkg ([#60](https://github.com/awslabs/iot-app-kit/issues/60)) ([f4239cf](https://github.com/awslabs/iot-app-kit/commit/f4239cf1ca201044095004a2e6c358f3a4c90ebc))
* Improve documentation formatting ([#93](https://github.com/awslabs/iot-app-kit/issues/93)) ([035d8e1](https://github.com/awslabs/iot-app-kit/commit/035d8e13f6e3ce77141ec610ef64abaa435a1a73))
* improve error handling ([#61](https://github.com/awslabs/iot-app-kit/issues/61)) ([5016e41](https://github.com/awslabs/iot-app-kit/commit/5016e4108714edc3e3b2a2465126f48212068ffd))
* Improve resource explorer docs ([#95](https://github.com/awslabs/iot-app-kit/issues/95)) ([0709c08](https://github.com/awslabs/iot-app-kit/commit/0709c0838fc51f100d7de7c4239579073aaf17ea))
* increase sitewise default resolution mapping thresholds ([#46](https://github.com/awslabs/iot-app-kit/issues/46)) ([f2d1011](https://github.com/awslabs/iot-app-kit/commit/f2d10116e512bb4ba799cb09b5227098ea43b688))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* introduce module coordinator ([#47](https://github.com/awslabs/iot-app-kit/issues/47)) ([36684eb](https://github.com/awslabs/iot-app-kit/commit/36684ebf6eb71928c3b66f9bb694a3694a2dbabf))
* **Matterport:** Integrate Matterport Showcase Viewer into TwinMaker SceneComposer ([58236e7](https://github.com/awslabs/iot-app-kit/commit/58236e7eed7f5435480cba6ce214346a4f8d3a86))
* Onboard cypress with component test runner ([#34](https://github.com/awslabs/iot-app-kit/issues/34)) ([b82d682](https://github.com/awslabs/iot-app-kit/commit/b82d682798295547248df2ffa57f0790dd328d96))
* **OpacityFilterZero:** Setting opacity to 0 should effectively hide the object ([#342](https://github.com/awslabs/iot-app-kit/issues/342)) ([91e491b](https://github.com/awslabs/iot-app-kit/commit/91e491b45ad2e31f4e407686fbf40c8c0df9f9d0))
* pass thru annotations ([#65](https://github.com/awslabs/iot-app-kit/issues/65)) ([f9e3d31](https://github.com/awslabs/iot-app-kit/commit/f9e3d31fae6f5b2f905edc6f26875e8b8317cb5a))
* prevent unsupported data types from being rendered ([#426](https://github.com/awslabs/iot-app-kit/issues/426)) ([dec2a86](https://github.com/awslabs/iot-app-kit/commit/dec2a86f0eccfe87ebfc32d89f74fb8695bb552d))
* **props:** adapt props for synchro-charts ([#133](https://github.com/awslabs/iot-app-kit/issues/133)) ([a98bf06](https://github.com/awslabs/iot-app-kit/commit/a98bf064f14979823f51437dbd599259b6bd6d78))
* query provider classes and TimeSeriesData support ([#51](https://github.com/awslabs/iot-app-kit/issues/51)) ([173f46a](https://github.com/awslabs/iot-app-kit/commit/173f46a8951339da412a9e5c3ba282f41a897718))
* **react-comp:** isThresholdBreached checks all comparison ops ([de3fe49](https://github.com/awslabs/iot-app-kit/commit/de3fe495b764d45dd9c364b93f2e5898d2cb661e))
* **react-components:** publish TimeSync component as part of the public API ([#621](https://github.com/awslabs/iot-app-kit/issues/621)) ([a4e2f66](https://github.com/awslabs/iot-app-kit/commit/a4e2f66e6a0a2d58eb1a5316ac3fab4520dd3161))
* **react-components:** release useViewport hook ([#631](https://github.com/awslabs/iot-app-kit/issues/631)) ([794b4a4](https://github.com/awslabs/iot-app-kit/commit/794b4a49c70824836ac0fadf8008d0937059d16d))
* **react-comp:** sync viewports using @iot-app-kit/charts pckg ([08c7eda](https://github.com/awslabs/iot-app-kit/commit/08c7eda38c600120aebe228285c5c1dc311ab8af))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **ReactComponents:** support alarms via thresholds ingested from useTimeSeriesData hook ([4df9ff0](https://github.com/awslabs/iot-app-kit/commit/4df9ff00083239e3eb32b7766ec16396a5f7deb4))
* refactor app kit ([#67](https://github.com/awslabs/iot-app-kit/issues/67)) ([215584d](https://github.com/awslabs/iot-app-kit/commit/215584db25265437117462c579c1d15c2f1e4dca))
* Refactor Asset Tree to use the new Query/Provider system ([#62](https://github.com/awslabs/iot-app-kit/issues/62)) ([cccbe61](https://github.com/awslabs/iot-app-kit/commit/cccbe61cb596b284752cc240b8e95e261b03956b))
* Refactor Site Wise Asset session interface to support Promises ([#40](https://github.com/awslabs/iot-app-kit/issues/40)) ([184ccc6](https://github.com/awslabs/iot-app-kit/commit/184ccc6dc6ce9236048aa6e8595e7d4e61afeed3))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))
* request data in descending order ([#30](https://github.com/awslabs/iot-app-kit/issues/30)) ([29b23a7](https://github.com/awslabs/iot-app-kit/commit/29b23a775acae75c65172e68e4b502e5238f863f))
* Resource Explorer ([#24](https://github.com/awslabs/iot-app-kit/issues/24)) ([2e9d746](https://github.com/awslabs/iot-app-kit/commit/2e9d7467ff3aa4c954f486f89a6693a193821cb2))
* **resource explorer:** allow dashboard to only show asset name ([5df2c5c](https://github.com/awslabs/iot-app-kit/commit/5df2c5cf9f289360ea4a80f3188c7d16307b5e06))
* restructure mocks of sitewise to all be co-located ([#52](https://github.com/awslabs/iot-app-kit/issues/52)) ([557484f](https://github.com/awslabs/iot-app-kit/commit/557484f3182168b6253d653417318dcbd127698e))
* set up table package and add createTableItems method ([#124](https://github.com/awslabs/iot-app-kit/issues/124)) ([d827d21](https://github.com/awslabs/iot-app-kit/commit/d827d216ef69cb6207f6ef6f23b7ddce4ae76b6b))
* sitewise components use query and provider ([#54](https://github.com/awslabs/iot-app-kit/issues/54)) ([80cf5d4](https://github.com/awslabs/iot-app-kit/commit/80cf5d4cf08e78d05b90bb0c84c18323885c32e5))
* Sitewise Resource Explorer ([#21](https://github.com/awslabs/iot-app-kit/issues/21)) ([8f26b58](https://github.com/awslabs/iot-app-kit/commit/8f26b58433ff05bd6709c7659dfb6b015e6a90dd))
* source-iotsitewise useable module ([#63](https://github.com/awslabs/iot-app-kit/issues/63)) ([21a1014](https://github.com/awslabs/iot-app-kit/commit/21a1014b29df70185360d71fdfb963863b1944d9))
* **source-iotsitewise:** support propertyAlias in quries ([bfe32ce](https://github.com/awslabs/iot-app-kit/commit/bfe32ce74ba6008ae6bb15d1b5f60e8546d36135))
* support auto-assigning colors for certain components ([#96](https://github.com/awslabs/iot-app-kit/issues/96)) ([d75e426](https://github.com/awslabs/iot-app-kit/commit/d75e4261088fefab5886a0325818228930c6f363))
* support fetchMostRecentBeforeStart ([#79](https://github.com/awslabs/iot-app-kit/issues/79)) ([c44b7b8](https://github.com/awslabs/iot-app-kit/commit/c44b7b8d3e04d1b7becacd1fe1f7c59de681d517))
* Support multiple queries per subscription ([#39](https://github.com/awslabs/iot-app-kit/issues/39)) ([57772c1](https://github.com/awslabs/iot-app-kit/commit/57772c1b9beb5a0b39d5e1475bd0b0038271f944))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))
* **table:** create new Table component based on AWSUI Table component ([#129](https://github.com/awslabs/iot-app-kit/issues/129)) ([ba18720](https://github.com/awslabs/iot-app-kit/commit/ba18720829be791fd030e4a6cf57f2254b65f09f))
* **table:** support messageOverrides ([#211](https://github.com/awslabs/iot-app-kit/issues/211)) ([ccb7a32](https://github.com/awslabs/iot-app-kit/commit/ccb7a3286962f459386d10d84a923621b5839625))
* **time-sync:** useViewport returns a group ([c12349b](https://github.com/awslabs/iot-app-kit/commit/c12349b17e7ed917babd394a05c7a47f0b8bccc0))
* **TimeSync:** add a lastUsedBy string to the useViewport hook ([526f059](https://github.com/awslabs/iot-app-kit/commit/526f059dcfe74d8590b9ee0add435700d3ed943d))
* **TwinMaker:** Add TwinMaker packages ([#252](https://github.com/awslabs/iot-app-kit/issues/252)) ([fabbe03](https://github.com/awslabs/iot-app-kit/commit/fabbe0399dd37293e99588124404c37c929f4330))
* **TwinMakerTools:** add twin maker tools package ([79cf53b](https://github.com/awslabs/iot-app-kit/commit/79cf53b5a5e278de783e860a360e45867acf1b4d))
* update sitewise component interface ([#58](https://github.com/awslabs/iot-app-kit/issues/58)) ([1927053](https://github.com/awslabs/iot-app-kit/commit/1927053f7c8b3dff25b26d246e632ba2b26a4429))
* update synchro charts to 3.1.0, update docs ([#92](https://github.com/awslabs/iot-app-kit/issues/92)) ([10a55fa](https://github.com/awslabs/iot-app-kit/commit/10a55fad0b2eb1271aa449f0c0ebfc010a40e08b))
* Wrap SiteWise Asset related API calls in a Data Source ([36475b8](https://github.com/awslabs/iot-app-kit/commit/36475b826b11a4ac205312eaee63f7188d1b9ea8))


### Bug Fixes

* **actions:** run publish workflow on change to the workflow ([11c5dfe](https://github.com/awslabs/iot-app-kit/commit/11c5dfe567821e16944f9b5ce1f8ad5d9ac542d7))
* **actions:** update publish action for core-util ([16bf9fc](https://github.com/awslabs/iot-app-kit/commit/16bf9fcacbf4dffd3979402b8451b880e14c6a61))
* **actions:** updating release-please command ([5fb120e](https://github.com/awslabs/iot-app-kit/commit/5fb120e1d88e8193b0cb99b1bb24803518aef2aa))
* Add appropriate default resolution for bar chart ([#76](https://github.com/awslabs/iot-app-kit/issues/76)) ([ddce235](https://github.com/awslabs/iot-app-kit/commit/ddce2355bbb8edefaa246ea1872efef6c24a480a))
* add dashboard package to the npm workspace config ([91ec14e](https://github.com/awslabs/iot-app-kit/commit/91ec14e0bd8747717c9acaf6a63fb2a9aa987753))
* Add dashboard to release-please-config ([35730e7](https://github.com/awslabs/iot-app-kit/commit/35730e7e7f78ae83a51a65dd41f572d96e4e5eb2))
* Allows user to hit Esc key to cancel Enhanced Editing ([#272](https://github.com/awslabs/iot-app-kit/issues/272)) ([6b73fad](https://github.com/awslabs/iot-app-kit/commit/6b73fad6db0bc61a4935bec76ebaecf39da366c5))
* backfill on requestBuffer tests ([#55](https://github.com/awslabs/iot-app-kit/issues/55)) ([416eea1](https://github.com/awslabs/iot-app-kit/commit/416eea108bc9b353ab9da1d98f3f3ceeaf994cdb))
* **BarChart:** prevent bar chart from trying to request raw data by default ([6845d95](https://github.com/awslabs/iot-app-kit/commit/6845d95789861a1d6d97cfb4322f6371983de729))
* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **build:** add missing dev deps in scene-composer ([b128405](https://github.com/awslabs/iot-app-kit/commit/b1284052e7db7247bd1bbe4758cde21ba584f8c5))
* **CameraView:** Minimum FOV check introduced ([#284](https://github.com/awslabs/iot-app-kit/issues/284)) ([6a8d9f1](https://github.com/awslabs/iot-app-kit/commit/6a8d9f1cbc7995efc612a7cac9f551c7c43ba438))
* **charts:** fix live mode viewport scrollingbug ([dbea3ff](https://github.com/awslabs/iot-app-kit/commit/dbea3ff3f1908a6a48b1ca9ee5c654f9b55eb616))
* **ci:** allow releases to be trigged via changes to github workflows ([5265ed0](https://github.com/awslabs/iot-app-kit/commit/5265ed0f30a4524cb5b5f0643f8b079537ffd074))
* **ci:** release as 3.0.1@alpha ([6677a1f](https://github.com/awslabs/iot-app-kit/commit/6677a1f011e72387fcf170e0944a9acb780a239a))
* **components:** fix connector to iot app kit components ([be91864](https://github.com/awslabs/iot-app-kit/commit/be91864aee326c1c3fd5320b30b86d34f9f246d0))
* **components:** import missing CSS style sheets. ([9634ec9](https://github.com/awslabs/iot-app-kit/commit/9634ec92bb471700e5e982bf014b355595cf7f25))
* **components:** move message merge to componentWillRender() ([8e2d260](https://github.com/awslabs/iot-app-kit/commit/8e2d2601a2e7e6808b0c1037cee1dd7957b39af3))
* **composer:** Adding ability to deselect by click radio button ([#351](https://github.com/awslabs/iot-app-kit/issues/351)) ([8c402b7](https://github.com/awslabs/iot-app-kit/commit/8c402b774b9a10ffdcdd13fc0a9f2f89f3eb507b))
* **composer:** Adjusting logic for reparenting scene nodes ([#369](https://github.com/awslabs/iot-app-kit/issues/369)) ([3475ebd](https://github.com/awslabs/iot-app-kit/commit/3475ebd404c728226cc1582667cabfd1420a8afa))
* **composer:** Allows nodes to be dropped at root level ([#390](https://github.com/awslabs/iot-app-kit/issues/390)) ([d9d7978](https://github.com/awslabs/iot-app-kit/commit/d9d79789e67a43b94057ad0ff45c663e186cacf7))
* **composer:** Auto expand hierarchy when selecting node on scene ([#452](https://github.com/awslabs/iot-app-kit/issues/452)) ([9b3e80f](https://github.com/awslabs/iot-app-kit/commit/9b3e80f17f26ef0268eaeb6222d79f077d057c97))
* **composer:** boolean data always converted to false ([#323](https://github.com/awslabs/iot-app-kit/issues/323)) ([254d68f](https://github.com/awslabs/iot-app-kit/commit/254d68f610efd1c75963f91c185bd42a2d649365))
* **composer:** Bug fix for rerenders on name input in inspect panel ([#334](https://github.com/awslabs/iot-app-kit/issues/334)) ([b8a0b4c](https://github.com/awslabs/iot-app-kit/commit/b8a0b4c4e8371637a0f1342f96196ca5b46ed383))
* **composer:** Camera and Light helper visibility toggling ([#294](https://github.com/awslabs/iot-app-kit/issues/294)) ([4f62051](https://github.com/awslabs/iot-app-kit/commit/4f6205157cb30c3a4af28ea6680ebfe39e0a16e4))
* **composer:** CSS Cleanup for Sceneviewer ([#379](https://github.com/awslabs/iot-app-kit/issues/379)) ([890dc4d](https://github.com/awslabs/iot-app-kit/commit/890dc4d57b3b756e90d47884fdf8a275595a1bc5))
* **composer:** drag root node crashes scene ([#372](https://github.com/awslabs/iot-app-kit/issues/372)) ([ca01c40](https://github.com/awslabs/iot-app-kit/commit/ca01c40241cad7f86f1bbb1a9b920795485076b8))
* **composer:** enable new features for SceneViewer ([#355](https://github.com/awslabs/iot-app-kit/issues/355)) ([631953a](https://github.com/awslabs/iot-app-kit/commit/631953a674fd8969e88b64c215ed8cd51b961e8e))
* **composer:** Enhanced Edit now allows for undo operation ([#376](https://github.com/awslabs/iot-app-kit/issues/376)) ([5e73bb8](https://github.com/awslabs/iot-app-kit/commit/5e73bb80d303fda63f81dd543b76add11ca61670))
* **composer:** entityId data binding not rendered ([#389](https://github.com/awslabs/iot-app-kit/issues/389)) ([6ad596f](https://github.com/awslabs/iot-app-kit/commit/6ad596f2d5cf31039b8dd5d0fdd069fb91ffc45d))
* **composer:** fix adding tag always attached to root ([#281](https://github.com/awslabs/iot-app-kit/issues/281)) ([f9ff7b1](https://github.com/awslabs/iot-app-kit/commit/f9ff7b1198fdcf073340bbdd4df89c61752d2b4d))
* **composer:** Fix camera view positioning under sub model ([#341](https://github.com/awslabs/iot-app-kit/issues/341)) ([94dcdda](https://github.com/awslabs/iot-app-kit/commit/94dcdda65a7c44cf449828338bed1ea132f995ea))
* **composer:** Fix e.removeFromParent and camera focus ([#350](https://github.com/awslabs/iot-app-kit/issues/350)) ([8458e50](https://github.com/awslabs/iot-app-kit/commit/8458e50f4ec87aa5e7e4f722017766f447d71b5e))
* **composer:** fix error with rendering 3D tiles ([785d833](https://github.com/awslabs/iot-app-kit/commit/785d8338fbb2908a01a6a40b55cc3d7b3fda1ab4))
* **composer:** Fix for bug on drag/drop introduced in last PR & fix for drag/drop icons: ([#364](https://github.com/awslabs/iot-app-kit/issues/364)) ([6dc40b9](https://github.com/awslabs/iot-app-kit/commit/6dc40b918cdfe6cc0d5447d9cb5ca2267ccd2afa))
* **composer:** Fix for displaying children on search results ([#365](https://github.com/awslabs/iot-app-kit/issues/365)) ([15f75cb](https://github.com/awslabs/iot-app-kit/commit/15f75cb6a9094ec4218a21fca287137d9feb7c88))
* **composer:** Fix for duplicate submodels in tree on adding objects to scene ([#370](https://github.com/awslabs/iot-app-kit/issues/370)) ([6c4bcdf](https://github.com/awslabs/iot-app-kit/commit/6c4bcdfd9c76895c76b487f0dfd323e76770d8b3))
* **composer:** Fix for useEffect error ([#373](https://github.com/awslabs/iot-app-kit/issues/373)) ([d74e45e](https://github.com/awslabs/iot-app-kit/commit/d74e45e3094450679a936e852bd7e2c7a65de678))
* **composer:** fix model shader material color restore ([#290](https://github.com/awslabs/iot-app-kit/issues/290)) ([19ce7f1](https://github.com/awslabs/iot-app-kit/commit/19ce7f196850897aa37873e2710974496ac89ac9))
* **composer:** fix object transforms during reparenting ([#477](https://github.com/awslabs/iot-app-kit/issues/477)) ([7a45bb3](https://github.com/awslabs/iot-app-kit/commit/7a45bb3eb1c2418396b39c7d092a380eb32ba250))
* **composer:** fix show svg ([#279](https://github.com/awslabs/iot-app-kit/issues/279)) ([3b7924d](https://github.com/awslabs/iot-app-kit/commit/3b7924dace7d11c726bb43a3f7a790415a049ed5))
* **composer:** Fix to persist drag/drop actions after refresh ([#367](https://github.com/awslabs/iot-app-kit/issues/367)) ([50f3538](https://github.com/awslabs/iot-app-kit/commit/50f353869e241fc05cc2d7d6122ccc604f7bf081))
* **composer:** Fix to restore drag-&-drop placement after refresh ([#361](https://github.com/awslabs/iot-app-kit/issues/361)) ([bd47478](https://github.com/awslabs/iot-app-kit/commit/bd474787dff3c43bcc9ca1d3711396936066c85f))
* **composer:** Fixes 2nd camera viewing click bug ([#291](https://github.com/awslabs/iot-app-kit/issues/291)) ([7899333](https://github.com/awslabs/iot-app-kit/commit/78993334a60ea16293ed6a53f82f99b29a54c0df))
* **composer:** Fixes expand button on hierarchies ([#371](https://github.com/awslabs/iot-app-kit/issues/371)) ([69fc869](https://github.com/awslabs/iot-app-kit/commit/69fc869f178d90ad8e785948b0aae48b01fea27d))
* **composer:** Fixes for layout in Console, submodel layout updates, bug fix for submodel interactive highlights ([#344](https://github.com/awslabs/iot-app-kit/issues/344)) ([a1ea148](https://github.com/awslabs/iot-app-kit/commit/a1ea148c8de1ddabc713c87b379d9e95901d2e03))
* **composer:** Fixes the Duplication of sub models on scene reload by adding persistant identifier to the sub model ([#356](https://github.com/awslabs/iot-app-kit/issues/356)) ([446a4ca](https://github.com/awslabs/iot-app-kit/commit/446a4caa6fb71b05ffaeadac80839fe9c7fd56af))
* **composer:** Fixes the light helper delete while maintaining visibility link ([#349](https://github.com/awslabs/iot-app-kit/issues/349)) ([2f51263](https://github.com/awslabs/iot-app-kit/commit/2f5126377e8cc40645188487499946e2477418e4))
* **composer:** hdr url is sometimes wrong ([#352](https://github.com/awslabs/iot-app-kit/issues/352)) ([2c2625e](https://github.com/awslabs/iot-app-kit/commit/2c2625e6630cecd64231f2b8a6d7876a75ee3347))
* **composer:** Maintain the position in 3D space regardless of the parent ([#375](https://github.com/awslabs/iot-app-kit/issues/375)) ([a106e77](https://github.com/awslabs/iot-app-kit/commit/a106e774bd0bdb13278cdc978f7fb22df1c01a38))
* **composer:** One instance of sub models allowed per instance of the model ([#366](https://github.com/awslabs/iot-app-kit/issues/366)) ([24f3914](https://github.com/awslabs/iot-app-kit/commit/24f3914ac0954cf411a215dd58d74a9eeb8f05cc))
* **composer:** Removing dashboard package to fix pipeline ([#338](https://github.com/awslabs/iot-app-kit/issues/338)) ([9a2c991](https://github.com/awslabs/iot-app-kit/commit/9a2c9917729a5a8b273920aec91e47bacf8b8251))
* **composer:** reorder doesn't persist after reloading ([#374](https://github.com/awslabs/iot-app-kit/issues/374)) ([8c90889](https://github.com/awslabs/iot-app-kit/commit/8c908898f34c51a9ab05c4ef284db4428b3d4f2e))
* **composer:** reorder to same parent duplicates child ([b76057d](https://github.com/awslabs/iot-app-kit/commit/b76057d17f23ad25d9f48497619bf49e23fcecb3))
* **composer:** Restores drag-&-drop functionality in Scene Hierarchy ([#359](https://github.com/awslabs/iot-app-kit/issues/359)) ([b220501](https://github.com/awslabs/iot-app-kit/commit/b22050101400f102be2a0aed46b5b15c7b6fecc5))
* **Composer:** Safe bounding box and 3D cursor fix ([#327](https://github.com/awslabs/iot-app-kit/issues/327)) ([a31585f](https://github.com/awslabs/iot-app-kit/commit/a31585fe447d0aa6a0bda855ffbdd8a4d756798d))
* **composer:** scene change is sometimes not saved ([#409](https://github.com/awslabs/iot-app-kit/issues/409)) ([7b0c45a](https://github.com/awslabs/iot-app-kit/commit/7b0c45aab025a90827a472afb0efc85077dd7ef9))
* **composer:** Scene Hierarchy radio buttons & bug fix for selection on single click ([#326](https://github.com/awslabs/iot-app-kit/issues/326)) ([1026cb4](https://github.com/awslabs/iot-app-kit/commit/1026cb4d607317a43bb45e0058e9762a3a5430c1))
* **composer:** selectedDataBinding not able to update selected node ([#274](https://github.com/awslabs/iot-app-kit/issues/274)) ([ee68f7e](https://github.com/awslabs/iot-app-kit/commit/ee68f7e6825b438f2f7dfd7927f3ee24d471d3fa))
* **composer:** Set tree hierarchy items to auto-collapsed on load ([#380](https://github.com/awslabs/iot-app-kit/issues/380)) ([dad88a0](https://github.com/awslabs/iot-app-kit/commit/dad88a0925a0dbf5c9c15e9e79cd4f025fb54682))
* **composer:** submodel and hierarchy search fix ([#320](https://github.com/awslabs/iot-app-kit/issues/320)) ([364cefb](https://github.com/awslabs/iot-app-kit/commit/364cefb9d4fb820b04e30e8761409a7ad00a5825))
* **composer:** SubModel child fix ([#363](https://github.com/awslabs/iot-app-kit/issues/363)) ([da574e8](https://github.com/awslabs/iot-app-kit/commit/da574e8cd3b62c1dbe275e38faf8590481fc1f0b))
* **composer:** support Windows dependency file paths in GLTF loader ([#417](https://github.com/awslabs/iot-app-kit/issues/417)) ([9f7c075](https://github.com/awslabs/iot-app-kit/commit/9f7c075f58458c75f7bc04cd8287dd0087281f0c))
* **composer:** update translations ([3e8d391](https://github.com/awslabs/iot-app-kit/commit/3e8d39155ea077f37320890ac57e9505d9a719a2))
* **composer:** update translations ([#302](https://github.com/awslabs/iot-app-kit/issues/302)) ([8b6f7a1](https://github.com/awslabs/iot-app-kit/commit/8b6f7a19fac0a3f1e11f1f722bbe6df3b010042b))
* **composer:** use arrow data as texture to avoid public path issue ([#276](https://github.com/awslabs/iot-app-kit/issues/276)) ([f7cbd96](https://github.com/awslabs/iot-app-kit/commit/f7cbd969f93ae021ebfa6853bd478b43e890c738))
* **core-util:** fix subdomain for clients ([cc0d584](https://github.com/awslabs/iot-app-kit/commit/cc0d58464155d04d30cb433d96003cd43f2a9ee4))
* **core-util:** remove private flag for the core-util packages ([0d86584](https://github.com/awslabs/iot-app-kit/commit/0d86584f9ab15a732ccb7d440a9cbf1f82eccae0))
* **core-util:** update publish config for core-utils ([2a3f22f](https://github.com/awslabs/iot-app-kit/commit/2a3f22f8f3df207f1882fa856f90a10ac40d23fd))
* **core, source-iotsitewise:** Remove unecessary exports ([#620](https://github.com/awslabs/iot-app-kit/issues/620)) ([4bfe6f8](https://github.com/awslabs/iot-app-kit/commit/4bfe6f8724b48e28c7efc668aa7268f39e60385a))
* **core:** add currentTime param to viewportStartDate and `viewportEndDate` ([ea75c74](https://github.com/awslabs/iot-app-kit/commit/ea75c748e48f8490d3fc9dce87ddee9ea4e84222))
* **core:** use Map to avoid prototype pollution ([fa0b7ef](https://github.com/awslabs/iot-app-kit/commit/fa0b7efaf27a62ad155a589d13096529e67fb874))
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
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([164b751](https://github.com/awslabs/iot-app-kit/commit/164b7511ef2d42f1e816d804628440e577f03e43))
* Development Quick Start Docs/Scripts ([#148](https://github.com/awslabs/iot-app-kit/issues/148)) ([aa9dba6](https://github.com/awslabs/iot-app-kit/commit/aa9dba6215dc066cc67a6f3933f9de7321b09507))
* **DragHandleIcon:** Drag Handle icon not showing up without special webpack config ([#345](https://github.com/awslabs/iot-app-kit/issues/345)) ([b8952ce](https://github.com/awslabs/iot-app-kit/commit/b8952ceba6c1e462bc3a45bb06b5c7ef54c5da32))
* **Example:** correct instructions on providing AWS credentials to example react-app ([960067f](https://github.com/awslabs/iot-app-kit/commit/960067f138b3cd6b65735f4b307f7bb8fd5608ba))
* Fix setTimeout error ([#32](https://github.com/awslabs/iot-app-kit/issues/32)) ([e174598](https://github.com/awslabs/iot-app-kit/commit/e174598bd6d323ed48af6feee610dc4312d26462))
* fix syntax not supported in all circumstances for package.json override ([#360](https://github.com/awslabs/iot-app-kit/issues/360)) ([7b97dd1](https://github.com/awslabs/iot-app-kit/commit/7b97dd1ab9064feee1c92ad615ef0a09cc4556a1))
* Fix the tag scaling with parent scale regression ([#282](https://github.com/awslabs/iot-app-kit/issues/282)) ([efd49fc](https://github.com/awslabs/iot-app-kit/commit/efd49fc66fbb1c30ff7e971c0d8e024a778468e8))
* **InternalBuild:** Downgrade cloudscape dependency to support internal build ([b20912b](https://github.com/awslabs/iot-app-kit/commit/b20912b77fa1d594d81364ac26df960754c0bace))
* mock SDK in component tests ([#56](https://github.com/awslabs/iot-app-kit/issues/56)) ([dd4bab5](https://github.com/awslabs/iot-app-kit/commit/dd4bab50d755baad24ec907312d428b9161389ac))
* prevent stream render if dataType unknown ([#448](https://github.com/awslabs/iot-app-kit/issues/448)) ([16999db](https://github.com/awslabs/iot-app-kit/commit/16999dbf8ed18770cccda0c993041a57e1c3d0c0))
* propertyName with multi hyphen not working ([#496](https://github.com/awslabs/iot-app-kit/issues/496)) ([7c7dc2c](https://github.com/awslabs/iot-app-kit/commit/7c7dc2c9ab1d82505b1e30dab98b58e728cf75a0))
* **react-components, videoPlayer:** fix propertiesNotChanged for videoPlayer ([11665c0](https://github.com/awslabs/iot-app-kit/commit/11665c0af13e98dc6602d8bf8aac7733d063633c))
* **react-components:** fix binding styles in `useTimeSeriesData` hook ([c1c0125](https://github.com/awslabs/iot-app-kit/commit/c1c012577448c6e07090b23ad988e39a3d530bb6))
* **react-components:** set timezone for jest to UTC to prevent local test failures ([44c3793](https://github.com/awslabs/iot-app-kit/commit/44c379338a2a9110600a0502e37ae4dceaf0ab09))
* **ReactComponents:** configure table, kpi and status to always fetch raw data ([c02b566](https://github.com/awslabs/iot-app-kit/commit/c02b566cad9aa2b8e700765f7923df2d4a6fbec4))
* related-table eslint and prettier ([#10](https://github.com/awslabs/iot-app-kit/issues/10)) ([67a7149](https://github.com/awslabs/iot-app-kit/commit/67a7149131813b8239079f2b931c78e5b607a708))
* **related-table:** expanded toggling already expanded nodes ([#382](https://github.com/awslabs/iot-app-kit/issues/382)) ([a6d29c8](https://github.com/awslabs/iot-app-kit/commit/a6d29c8b2ea1d74ede87a8db2db6920f3f546958))
* **release:** release as 4.0.0-nightly ([f2967b0](https://github.com/awslabs/iot-app-kit/commit/f2967b0d134b51fa8e7c0c833d8113eceaa79b0d))
* **release:** remove stray table references from release manifest ([83b1a9b](https://github.com/awslabs/iot-app-kit/commit/83b1a9b4c56473b93d75eb8303bcfabd75afe4df))
* remove full file eslint disable. Switch to minimal eslint disable. ([ba18720](https://github.com/awslabs/iot-app-kit/commit/ba18720829be791fd030e4a6cf57f2254b65f09f))
* remove prettier, enforce eslint on build ([#29](https://github.com/awslabs/iot-app-kit/issues/29)) ([1b2e5ca](https://github.com/awslabs/iot-app-kit/commit/1b2e5cad203a561feda89544382e38f453c64124))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* remove unused variables. ([13c7dfe](https://github.com/awslabs/iot-app-kit/commit/13c7dfe10dc4a8c02621d08bc1b959d647c083fb))
* **Reparenting:** Fix reparenting nodes ([#368](https://github.com/awslabs/iot-app-kit/issues/368)) ([8a66f94](https://github.com/awslabs/iot-app-kit/commit/8a66f940e98a31e3ef6937336e0e5114e23ad20c))
* requestBuffer ([#49](https://github.com/awslabs/iot-app-kit/issues/49)) ([b342b32](https://github.com/awslabs/iot-app-kit/commit/b342b32d5701cb9fe48e793628d6f0f89a2248f8))
* require npm &gt;=8.7.0 to fix yarn.lock issue with d3-color-1-fix ([#331](https://github.com/awslabs/iot-app-kit/issues/331)) ([eba59ca](https://github.com/awslabs/iot-app-kit/commit/eba59cac747cb5a359ddb6596f02c8a26d5cd5c0))
* resolve float decimal precision issue on round() function. ([#160](https://github.com/awslabs/iot-app-kit/issues/160)) ([6efeac4](https://github.com/awslabs/iot-app-kit/commit/6efeac47acce17da5f99104aec9d5a70cad366a2))
* resolves [#83](https://github.com/awslabs/iot-app-kit/issues/83) ([#87](https://github.com/awslabs/iot-app-kit/issues/87)) ([364716f](https://github.com/awslabs/iot-app-kit/commit/364716f72857526b93e63146fa378d2464974400))
* **scene-composer:** remove invalid workspace syntax ([#640](https://github.com/awslabs/iot-app-kit/issues/640)) ([ed3b28d](https://github.com/awslabs/iot-app-kit/commit/ed3b28dc86fdae2e70b639ce2774217cd92b6122))
* **SceneHierarchyPerformance:** SceneHierarchy Tree Performance ([#283](https://github.com/awslabs/iot-app-kit/issues/283)) ([5e93adc](https://github.com/awslabs/iot-app-kit/commit/5e93adcc5eb338b98a5c9d90b7873880df1bba1a))
* sitewise source time series module ([#71](https://github.com/awslabs/iot-app-kit/issues/71)) ([6671217](https://github.com/awslabs/iot-app-kit/commit/6671217f3f2b813ecec6e907ee85ba6e0dd347c6))
* **source-iotsitewise:** deduplicate batch requests ([#629](https://github.com/awslabs/iot-app-kit/issues/629)) ([0a5e8a1](https://github.com/awslabs/iot-app-kit/commit/0a5e8a1ec7eeec2c7f214a0f8c7963bb66990678))
* **source-iotsitewise:** move testing util to dev dep ([e10e548](https://github.com/awslabs/iot-app-kit/commit/e10e5487bf3f31e3b107a51cb4fc9da28057efe6))
* **source-iotsitewise:** use alarm model name in data stream instead of alarm state name ([3c3a1ae](https://github.com/awslabs/iot-app-kit/commit/3c3a1ae52df8f32d0217e82c463e624cc4880890))
* **SubModelHidingChildren:** Unnamed children should be skipped not omitted ([#377](https://github.com/awslabs/iot-app-kit/issues/377)) ([46be1c4](https://github.com/awslabs/iot-app-kit/commit/46be1c4ab34551b22cb1638e97025f4ae4b43347))
* Support additional parameters in intercepting calls to table cell renderer ([ce2be51](https://github.com/awslabs/iot-app-kit/commit/ce2be513327e658b5f391f0fbf94f9fe192af530))
* Swaped ternary statement terms ([#22](https://github.com/awslabs/iot-app-kit/issues/22)) ([b7899f1](https://github.com/awslabs/iot-app-kit/commit/b7899f12d88f22a1c5047859ddd3cedee9668915))
* **table:** add missing brackets. ([#183](https://github.com/awslabs/iot-app-kit/issues/183)) ([5c5ec7b](https://github.com/awslabs/iot-app-kit/commit/5c5ec7bb6e7cf636bf90dfe9eecdf6170ce2ea6a))
* **table:** fix an issue when key in columnDefinition doesn't exist in TableItems ([#146](https://github.com/awslabs/iot-app-kit/issues/146)) ([13c7dfe](https://github.com/awslabs/iot-app-kit/commit/13c7dfe10dc4a8c02621d08bc1b959d647c083fb))
* testing ground DataModule parameter ([#17](https://github.com/awslabs/iot-app-kit/issues/17)) ([61632de](https://github.com/awslabs/iot-app-kit/commit/61632de997cc5ced9e21b2625d6e221432649803))
* TilesLoader will now load all visible tiles ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* TilesLoader will now load all visible tiles ([#593](https://github.com/awslabs/iot-app-kit/issues/593)) ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* **typescript:** re-enables typescript for component package tests ([12f60b7](https://github.com/awslabs/iot-app-kit/commit/12f60b7847853e17d398e6346d470606467e2d5c))
* **UITests:** fix dashbaord e2e tests ([dd98c0e](https://github.com/awslabs/iot-app-kit/commit/dd98c0ea9ccd6a7dacc9ee5f994ccce7007f0b21))
* update @testing-library/react to use create root ([#151](https://github.com/awslabs/iot-app-kit/issues/151)) ([380e4cf](https://github.com/awslabs/iot-app-kit/commit/380e4cf60a7612a586d6a86891b78fe14240bff5))
* Updating documentation for Storybook ([#264](https://github.com/awslabs/iot-app-kit/issues/264)) ([83352bd](https://github.com/awslabs/iot-app-kit/commit/83352bdab956c8115dc08937e4acb442c6841a0d))
* use viewport from provider ([#515](https://github.com/awslabs/iot-app-kit/issues/515)) ([eb515a5](https://github.com/awslabs/iot-app-kit/commit/eb515a58cb807f421ca62004bb07cc3bdcb7cc50))
* **video-player:** use static timestamps instead dynamic ones ([1e434a6](https://github.com/awslabs/iot-app-kit/commit/1e434a6632c6dd797f9d0dacd3ed3547622d93c9))


### Miscellaneous Chores

* release 4.0.0-nightly ([c4d2c1b](https://github.com/awslabs/iot-app-kit/commit/c4d2c1b9201890be3b4d112079269b2207d3fd7c))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))

## [4.0.2](https://github.com/awslabs/iot-app-kit/compare/root-v4.0.1...root-v4.0.2) (2023-03-30)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper
* **source-iotsitewise:** support propertyAlias in quries
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* **core, source-iotsitewise:** 
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async
* **core:** Refactored export from `@iot-app-kit/core` IoTAppKitDataModule to be named TimeSeriesDataModule, and removed the concept of multiple data sources per time series data module

### Features

* Add Asset Hierarchy loading & Asset Tree support ([e36380a](https://github.com/awslabs/iot-app-kit/commit/e36380ad011b3e0b10a3b8a2d65245446248f55f))
* add CodeQL workflow ([#64](https://github.com/awslabs/iot-app-kit/issues/64)) ([bfd7c88](https://github.com/awslabs/iot-app-kit/commit/bfd7c88424faac92d2f11eb7fa44910cd1e2872d))
* Add Core SiteWise Asset Module ([a3ffec2](https://github.com/awslabs/iot-app-kit/commit/a3ffec2e490542b9bdd5587316e4ddd72573c109))
* add in styles overrides and refId in query ([#38](https://github.com/awslabs/iot-app-kit/issues/38)) ([76a9d63](https://github.com/awslabs/iot-app-kit/commit/76a9d63e02a13f3229f1ee58a1d35b974fe81ae2))
* add npm-publish github workflow ([#68](https://github.com/awslabs/iot-app-kit/issues/68)) ([64e64b8](https://github.com/awslabs/iot-app-kit/commit/64e64b800ad3b6ddbee78cfe84c3750e73dead65))
* Add proposed API changes within types declarations ([#37](https://github.com/awslabs/iot-app-kit/issues/37)) ([629fbeb](https://github.com/awslabs/iot-app-kit/commit/629fbeb46e10cfce699ca2c7906e651cb2a83f7b))
* add support for aggregated data for sitewise data source ([#6](https://github.com/awslabs/iot-app-kit/issues/6)) ([a50b31e](https://github.com/awslabs/iot-app-kit/commit/a50b31e8da30b93aa02ea8e89e44fa686bd71d67))
* add support for resolution mapping ([#16](https://github.com/awslabs/iot-app-kit/issues/16)) ([8dda905](https://github.com/awslabs/iot-app-kit/commit/8dda905ff27d6e5a749a7f90d59dd6cf1dad4ec8))
* Add support for update within subscribeToTimeSeriesData ([#53](https://github.com/awslabs/iot-app-kit/issues/53)) ([83b100f](https://github.com/awslabs/iot-app-kit/commit/83b100f29e7a2d5062597c13946db44af2ae4029))
* add test runner github action ([#8](https://github.com/awslabs/iot-app-kit/issues/8)) ([ef398b9](https://github.com/awslabs/iot-app-kit/commit/ef398b9e9c65c75562d87ec95e3b9c7b90751eaa))
* allow to specify region for data-module ([#4](https://github.com/awslabs/iot-app-kit/issues/4)) ([ae2ef66](https://github.com/awslabs/iot-app-kit/commit/ae2ef662ef98230fa64676e374e0401cbe64cce3))
* api simplification of requestSettings ([#27](https://github.com/awslabs/iot-app-kit/issues/27)) ([537b8ca](https://github.com/awslabs/iot-app-kit/commit/537b8ca3a459cb1ea70ec99a10697f34ba343657))
* backfill component integration tests ([#66](https://github.com/awslabs/iot-app-kit/issues/66)) ([4f17201](https://github.com/awslabs/iot-app-kit/commit/4f17201f5990876b67861f091dbdcdb5345a28c2))
* batch API for historical, aggregated, and latest value data ([#137](https://github.com/awslabs/iot-app-kit/issues/137)) ([b7a38e2](https://github.com/awslabs/iot-app-kit/commit/b7a38e225199989524914b88f8da43ca77af2e54))
* bind gestures to components ([#31](https://github.com/awslabs/iot-app-kit/issues/31)) ([799763b](https://github.com/awslabs/iot-app-kit/commit/799763b8dc0adf146704ad56d7814bc3ae88d3e9))
* **components:** support viewport grouping in iot-table using ViewportManager. ([feba985](https://github.com/awslabs/iot-app-kit/commit/feba985487156207fee0ca576ed76d39133d9db0))
* **composer:** add data overaly ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add overlay panel config editor ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add runtime tag settings change support ([eeda501](https://github.com/awslabs/iot-app-kit/commit/eeda501d456c10f61123f9c4f77618bb870816f5))
* **composer:** data binding variable support for data overlay ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data overlay editor & render markdown ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** implement add overlay from menu ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** Implement data overlay container ([#595](https://github.com/awslabs/iot-app-kit/issues/595)) ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** update TagResize feature implementation ([b8dfb46](https://github.com/awslabs/iot-app-kit/commit/b8dfb468043ff6c8b4f154c145f997c6467117ec))
* **composer:** visibility toggles for overlays in settings panel ([4fc0527](https://github.com/awslabs/iot-app-kit/commit/4fc05276aa3f55f19aa8c0792ade3deb58eef7a3))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* **core,source-iotsitewise:** Change time series data modules getRequestsFromQueries to be async ([69a017e](https://github.com/awslabs/iot-app-kit/commit/69a017ea8dfbd99fcd3c155278cac3c241b30527))
* **core:** Add meta field to requestInfos in TimeSeriesDataModule ([5db70c8](https://github.com/awslabs/iot-app-kit/commit/5db70c85e51dd6a44b2ab89049a952da9140c990))
* **core:** Add viewportManager to orchestrate viewport syncing within groups ([8990d13](https://github.com/awslabs/iot-app-kit/commit/8990d135c26cc02619a87312d8b00edc5978a603))
* **core:** Refactor time series data module to  remove unused functionality. Add meta field to data stream. ([7f12267](https://github.com/awslabs/iot-app-kit/commit/7f1226784158bdfff6ab67ab5b0523649a2f7a34))
* **core:** Support caching of dataType, name and other fields describing dataStreams ([542add6](https://github.com/awslabs/iot-app-kit/commit/542add6cac2f40c421687843c3977c9e4cb6e808))
* create react-components and source-iotsitewise pkgs ([#57](https://github.com/awslabs/iot-app-kit/issues/57)) ([16451b1](https://github.com/awslabs/iot-app-kit/commit/16451b12e0fe2662069275185b2fea61048d3fab))
* create tree table base component ([#15](https://github.com/awslabs/iot-app-kit/issues/15)) ([4678f80](https://github.com/awslabs/iot-app-kit/commit/4678f80a114958d8fedf51c980fc3c2fbd718d2c))
* customizable resolutions ([#23](https://github.com/awslabs/iot-app-kit/issues/23)) ([0ffd474](https://github.com/awslabs/iot-app-kit/commit/0ffd4748c3be124045def6a404d097aa0d029a7b))
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
* **EnvironmentModel:** Adding support for environment overlay ([#262](https://github.com/awslabs/iot-app-kit/issues/262)) ([0277027](https://github.com/awslabs/iot-app-kit/commit/0277027d59f232c2c8e29fac0bc53399a1eb9c1e))
* error handling/data-module core ([#14](https://github.com/awslabs/iot-app-kit/issues/14)) ([376929f](https://github.com/awslabs/iot-app-kit/commit/376929fda106a808d312b8b92a309c9184857fe1))
* expand children in resource explorer ([#115](https://github.com/awslabs/iot-app-kit/issues/115)) ([8f1c03c](https://github.com/awslabs/iot-app-kit/commit/8f1c03c57f19c30dc04fbad10b5622ad9fc3c5bd))
* explicitly type sitewise query ([#59](https://github.com/awslabs/iot-app-kit/issues/59)) ([e62f44b](https://github.com/awslabs/iot-app-kit/commit/e62f44b6a776d09677786e8978a0c0c2d786c9d1))
* expose ttlDurationMapping as data module configuration ([#20](https://github.com/awslabs/iot-app-kit/issues/20)) ([acb7520](https://github.com/awslabs/iot-app-kit/commit/acb752048840e7de6b087d45ecc999ed13a4b355))
* **github:** add github workflow to publish alpha dashboard ([92eb162](https://github.com/awslabs/iot-app-kit/commit/92eb162288b26a3bdc2297b65108537a7c4ceb9d))
* improve clean script ([#43](https://github.com/awslabs/iot-app-kit/issues/43)) ([38f5f84](https://github.com/awslabs/iot-app-kit/commit/38f5f846b02c3dfc6b8b827f5daaa8ffc5d50199))
* improve documentation ([#90](https://github.com/awslabs/iot-app-kit/issues/90)) ([83c706d](https://github.com/awslabs/iot-app-kit/commit/83c706d74d896db6fd2864af6b26db4718d4fcdc))
* improve documentation and clarity of react-components pkg ([#60](https://github.com/awslabs/iot-app-kit/issues/60)) ([f4239cf](https://github.com/awslabs/iot-app-kit/commit/f4239cf1ca201044095004a2e6c358f3a4c90ebc))
* Improve documentation formatting ([#93](https://github.com/awslabs/iot-app-kit/issues/93)) ([035d8e1](https://github.com/awslabs/iot-app-kit/commit/035d8e13f6e3ce77141ec610ef64abaa435a1a73))
* improve error handling ([#61](https://github.com/awslabs/iot-app-kit/issues/61)) ([5016e41](https://github.com/awslabs/iot-app-kit/commit/5016e4108714edc3e3b2a2465126f48212068ffd))
* Improve resource explorer docs ([#95](https://github.com/awslabs/iot-app-kit/issues/95)) ([0709c08](https://github.com/awslabs/iot-app-kit/commit/0709c0838fc51f100d7de7c4239579073aaf17ea))
* increase sitewise default resolution mapping thresholds ([#46](https://github.com/awslabs/iot-app-kit/issues/46)) ([f2d1011](https://github.com/awslabs/iot-app-kit/commit/f2d10116e512bb4ba799cb09b5227098ea43b688))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* introduce module coordinator ([#47](https://github.com/awslabs/iot-app-kit/issues/47)) ([36684eb](https://github.com/awslabs/iot-app-kit/commit/36684ebf6eb71928c3b66f9bb694a3694a2dbabf))
* **Matterport:** Integrate Matterport Showcase Viewer into TwinMaker SceneComposer ([58236e7](https://github.com/awslabs/iot-app-kit/commit/58236e7eed7f5435480cba6ce214346a4f8d3a86))
* Onboard cypress with component test runner ([#34](https://github.com/awslabs/iot-app-kit/issues/34)) ([b82d682](https://github.com/awslabs/iot-app-kit/commit/b82d682798295547248df2ffa57f0790dd328d96))
* **OpacityFilterZero:** Setting opacity to 0 should effectively hide the object ([#342](https://github.com/awslabs/iot-app-kit/issues/342)) ([91e491b](https://github.com/awslabs/iot-app-kit/commit/91e491b45ad2e31f4e407686fbf40c8c0df9f9d0))
* pass thru annotations ([#65](https://github.com/awslabs/iot-app-kit/issues/65)) ([f9e3d31](https://github.com/awslabs/iot-app-kit/commit/f9e3d31fae6f5b2f905edc6f26875e8b8317cb5a))
* prevent unsupported data types from being rendered ([#426](https://github.com/awslabs/iot-app-kit/issues/426)) ([dec2a86](https://github.com/awslabs/iot-app-kit/commit/dec2a86f0eccfe87ebfc32d89f74fb8695bb552d))
* **props:** adapt props for synchro-charts ([#133](https://github.com/awslabs/iot-app-kit/issues/133)) ([a98bf06](https://github.com/awslabs/iot-app-kit/commit/a98bf064f14979823f51437dbd599259b6bd6d78))
* query provider classes and TimeSeriesData support ([#51](https://github.com/awslabs/iot-app-kit/issues/51)) ([173f46a](https://github.com/awslabs/iot-app-kit/commit/173f46a8951339da412a9e5c3ba282f41a897718))
* **react-comp:** isThresholdBreached checks all comparison ops ([de3fe49](https://github.com/awslabs/iot-app-kit/commit/de3fe495b764d45dd9c364b93f2e5898d2cb661e))
* **react-components:** publish TimeSync component as part of the public API ([#621](https://github.com/awslabs/iot-app-kit/issues/621)) ([a4e2f66](https://github.com/awslabs/iot-app-kit/commit/a4e2f66e6a0a2d58eb1a5316ac3fab4520dd3161))
* **react-components:** release useViewport hook ([#631](https://github.com/awslabs/iot-app-kit/issues/631)) ([794b4a4](https://github.com/awslabs/iot-app-kit/commit/794b4a49c70824836ac0fadf8008d0937059d16d))
* **react-comp:** sync viewports using @iot-app-kit/charts pckg ([08c7eda](https://github.com/awslabs/iot-app-kit/commit/08c7eda38c600120aebe228285c5c1dc311ab8af))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **ReactComponents:** support alarms via thresholds ingested from useTimeSeriesData hook ([4df9ff0](https://github.com/awslabs/iot-app-kit/commit/4df9ff00083239e3eb32b7766ec16396a5f7deb4))
* refactor app kit ([#67](https://github.com/awslabs/iot-app-kit/issues/67)) ([215584d](https://github.com/awslabs/iot-app-kit/commit/215584db25265437117462c579c1d15c2f1e4dca))
* Refactor Asset Tree to use the new Query/Provider system ([#62](https://github.com/awslabs/iot-app-kit/issues/62)) ([cccbe61](https://github.com/awslabs/iot-app-kit/commit/cccbe61cb596b284752cc240b8e95e261b03956b))
* Refactor Site Wise Asset session interface to support Promises ([#40](https://github.com/awslabs/iot-app-kit/issues/40)) ([184ccc6](https://github.com/awslabs/iot-app-kit/commit/184ccc6dc6ce9236048aa6e8595e7d4e61afeed3))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))
* request data in descending order ([#30](https://github.com/awslabs/iot-app-kit/issues/30)) ([29b23a7](https://github.com/awslabs/iot-app-kit/commit/29b23a775acae75c65172e68e4b502e5238f863f))
* Resource Explorer ([#24](https://github.com/awslabs/iot-app-kit/issues/24)) ([2e9d746](https://github.com/awslabs/iot-app-kit/commit/2e9d7467ff3aa4c954f486f89a6693a193821cb2))
* **resource explorer:** allow dashboard to only show asset name ([5df2c5c](https://github.com/awslabs/iot-app-kit/commit/5df2c5cf9f289360ea4a80f3188c7d16307b5e06))
* restructure mocks of sitewise to all be co-located ([#52](https://github.com/awslabs/iot-app-kit/issues/52)) ([557484f](https://github.com/awslabs/iot-app-kit/commit/557484f3182168b6253d653417318dcbd127698e))
* set up table package and add createTableItems method ([#124](https://github.com/awslabs/iot-app-kit/issues/124)) ([d827d21](https://github.com/awslabs/iot-app-kit/commit/d827d216ef69cb6207f6ef6f23b7ddce4ae76b6b))
* sitewise components use query and provider ([#54](https://github.com/awslabs/iot-app-kit/issues/54)) ([80cf5d4](https://github.com/awslabs/iot-app-kit/commit/80cf5d4cf08e78d05b90bb0c84c18323885c32e5))
* Sitewise Resource Explorer ([#21](https://github.com/awslabs/iot-app-kit/issues/21)) ([8f26b58](https://github.com/awslabs/iot-app-kit/commit/8f26b58433ff05bd6709c7659dfb6b015e6a90dd))
* source-iotsitewise useable module ([#63](https://github.com/awslabs/iot-app-kit/issues/63)) ([21a1014](https://github.com/awslabs/iot-app-kit/commit/21a1014b29df70185360d71fdfb963863b1944d9))
* **source-iotsitewise:** support propertyAlias in quries ([bfe32ce](https://github.com/awslabs/iot-app-kit/commit/bfe32ce74ba6008ae6bb15d1b5f60e8546d36135))
* support auto-assigning colors for certain components ([#96](https://github.com/awslabs/iot-app-kit/issues/96)) ([d75e426](https://github.com/awslabs/iot-app-kit/commit/d75e4261088fefab5886a0325818228930c6f363))
* support fetchMostRecentBeforeStart ([#79](https://github.com/awslabs/iot-app-kit/issues/79)) ([c44b7b8](https://github.com/awslabs/iot-app-kit/commit/c44b7b8d3e04d1b7becacd1fe1f7c59de681d517))
* Support multiple queries per subscription ([#39](https://github.com/awslabs/iot-app-kit/issues/39)) ([57772c1](https://github.com/awslabs/iot-app-kit/commit/57772c1b9beb5a0b39d5e1475bd0b0038271f944))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))
* **table:** create new Table component based on AWSUI Table component ([#129](https://github.com/awslabs/iot-app-kit/issues/129)) ([ba18720](https://github.com/awslabs/iot-app-kit/commit/ba18720829be791fd030e4a6cf57f2254b65f09f))
* **table:** support messageOverrides ([#211](https://github.com/awslabs/iot-app-kit/issues/211)) ([ccb7a32](https://github.com/awslabs/iot-app-kit/commit/ccb7a3286962f459386d10d84a923621b5839625))
* **time-sync:** useViewport returns a group ([c12349b](https://github.com/awslabs/iot-app-kit/commit/c12349b17e7ed917babd394a05c7a47f0b8bccc0))
* **TimeSync:** add a lastUsedBy string to the useViewport hook ([526f059](https://github.com/awslabs/iot-app-kit/commit/526f059dcfe74d8590b9ee0add435700d3ed943d))
* **TwinMaker:** Add TwinMaker packages ([#252](https://github.com/awslabs/iot-app-kit/issues/252)) ([fabbe03](https://github.com/awslabs/iot-app-kit/commit/fabbe0399dd37293e99588124404c37c929f4330))
* **TwinMakerTools:** add twin maker tools package ([79cf53b](https://github.com/awslabs/iot-app-kit/commit/79cf53b5a5e278de783e860a360e45867acf1b4d))
* update sitewise component interface ([#58](https://github.com/awslabs/iot-app-kit/issues/58)) ([1927053](https://github.com/awslabs/iot-app-kit/commit/1927053f7c8b3dff25b26d246e632ba2b26a4429))
* update synchro charts to 3.1.0, update docs ([#92](https://github.com/awslabs/iot-app-kit/issues/92)) ([10a55fa](https://github.com/awslabs/iot-app-kit/commit/10a55fad0b2eb1271aa449f0c0ebfc010a40e08b))
* Wrap SiteWise Asset related API calls in a Data Source ([36475b8](https://github.com/awslabs/iot-app-kit/commit/36475b826b11a4ac205312eaee63f7188d1b9ea8))


### Bug Fixes

* **actions:** run publish workflow on change to the workflow ([11c5dfe](https://github.com/awslabs/iot-app-kit/commit/11c5dfe567821e16944f9b5ce1f8ad5d9ac542d7))
* **actions:** update publish action for core-util ([16bf9fc](https://github.com/awslabs/iot-app-kit/commit/16bf9fcacbf4dffd3979402b8451b880e14c6a61))
* **actions:** updating release-please command ([5fb120e](https://github.com/awslabs/iot-app-kit/commit/5fb120e1d88e8193b0cb99b1bb24803518aef2aa))
* Add appropriate default resolution for bar chart ([#76](https://github.com/awslabs/iot-app-kit/issues/76)) ([ddce235](https://github.com/awslabs/iot-app-kit/commit/ddce2355bbb8edefaa246ea1872efef6c24a480a))
* add dashboard package to the npm workspace config ([91ec14e](https://github.com/awslabs/iot-app-kit/commit/91ec14e0bd8747717c9acaf6a63fb2a9aa987753))
* Add dashboard to release-please-config ([35730e7](https://github.com/awslabs/iot-app-kit/commit/35730e7e7f78ae83a51a65dd41f572d96e4e5eb2))
* Allows user to hit Esc key to cancel Enhanced Editing ([#272](https://github.com/awslabs/iot-app-kit/issues/272)) ([6b73fad](https://github.com/awslabs/iot-app-kit/commit/6b73fad6db0bc61a4935bec76ebaecf39da366c5))
* backfill on requestBuffer tests ([#55](https://github.com/awslabs/iot-app-kit/issues/55)) ([416eea1](https://github.com/awslabs/iot-app-kit/commit/416eea108bc9b353ab9da1d98f3f3ceeaf994cdb))
* **BarChart:** prevent bar chart from trying to request raw data by default ([6845d95](https://github.com/awslabs/iot-app-kit/commit/6845d95789861a1d6d97cfb4322f6371983de729))
* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **build:** add missing dev deps in scene-composer ([b128405](https://github.com/awslabs/iot-app-kit/commit/b1284052e7db7247bd1bbe4758cde21ba584f8c5))
* **CameraView:** Minimum FOV check introduced ([#284](https://github.com/awslabs/iot-app-kit/issues/284)) ([6a8d9f1](https://github.com/awslabs/iot-app-kit/commit/6a8d9f1cbc7995efc612a7cac9f551c7c43ba438))
* **charts:** fix live mode viewport scrollingbug ([dbea3ff](https://github.com/awslabs/iot-app-kit/commit/dbea3ff3f1908a6a48b1ca9ee5c654f9b55eb616))
* **ci:** allow releases to be trigged via changes to github workflows ([5265ed0](https://github.com/awslabs/iot-app-kit/commit/5265ed0f30a4524cb5b5f0643f8b079537ffd074))
* **ci:** release as 3.0.1@alpha ([6677a1f](https://github.com/awslabs/iot-app-kit/commit/6677a1f011e72387fcf170e0944a9acb780a239a))
* **components:** fix connector to iot app kit components ([be91864](https://github.com/awslabs/iot-app-kit/commit/be91864aee326c1c3fd5320b30b86d34f9f246d0))
* **components:** import missing CSS style sheets. ([9634ec9](https://github.com/awslabs/iot-app-kit/commit/9634ec92bb471700e5e982bf014b355595cf7f25))
* **components:** move message merge to componentWillRender() ([8e2d260](https://github.com/awslabs/iot-app-kit/commit/8e2d2601a2e7e6808b0c1037cee1dd7957b39af3))
* **composer:** Adding ability to deselect by click radio button ([#351](https://github.com/awslabs/iot-app-kit/issues/351)) ([8c402b7](https://github.com/awslabs/iot-app-kit/commit/8c402b774b9a10ffdcdd13fc0a9f2f89f3eb507b))
* **composer:** Adjusting logic for reparenting scene nodes ([#369](https://github.com/awslabs/iot-app-kit/issues/369)) ([3475ebd](https://github.com/awslabs/iot-app-kit/commit/3475ebd404c728226cc1582667cabfd1420a8afa))
* **composer:** Allows nodes to be dropped at root level ([#390](https://github.com/awslabs/iot-app-kit/issues/390)) ([d9d7978](https://github.com/awslabs/iot-app-kit/commit/d9d79789e67a43b94057ad0ff45c663e186cacf7))
* **composer:** Auto expand hierarchy when selecting node on scene ([#452](https://github.com/awslabs/iot-app-kit/issues/452)) ([9b3e80f](https://github.com/awslabs/iot-app-kit/commit/9b3e80f17f26ef0268eaeb6222d79f077d057c97))
* **composer:** boolean data always converted to false ([#323](https://github.com/awslabs/iot-app-kit/issues/323)) ([254d68f](https://github.com/awslabs/iot-app-kit/commit/254d68f610efd1c75963f91c185bd42a2d649365))
* **composer:** Bug fix for rerenders on name input in inspect panel ([#334](https://github.com/awslabs/iot-app-kit/issues/334)) ([b8a0b4c](https://github.com/awslabs/iot-app-kit/commit/b8a0b4c4e8371637a0f1342f96196ca5b46ed383))
* **composer:** Camera and Light helper visibility toggling ([#294](https://github.com/awslabs/iot-app-kit/issues/294)) ([4f62051](https://github.com/awslabs/iot-app-kit/commit/4f6205157cb30c3a4af28ea6680ebfe39e0a16e4))
* **composer:** CSS Cleanup for Sceneviewer ([#379](https://github.com/awslabs/iot-app-kit/issues/379)) ([890dc4d](https://github.com/awslabs/iot-app-kit/commit/890dc4d57b3b756e90d47884fdf8a275595a1bc5))
* **composer:** drag root node crashes scene ([#372](https://github.com/awslabs/iot-app-kit/issues/372)) ([ca01c40](https://github.com/awslabs/iot-app-kit/commit/ca01c40241cad7f86f1bbb1a9b920795485076b8))
* **composer:** enable new features for SceneViewer ([#355](https://github.com/awslabs/iot-app-kit/issues/355)) ([631953a](https://github.com/awslabs/iot-app-kit/commit/631953a674fd8969e88b64c215ed8cd51b961e8e))
* **composer:** Enhanced Edit now allows for undo operation ([#376](https://github.com/awslabs/iot-app-kit/issues/376)) ([5e73bb8](https://github.com/awslabs/iot-app-kit/commit/5e73bb80d303fda63f81dd543b76add11ca61670))
* **composer:** entityId data binding not rendered ([#389](https://github.com/awslabs/iot-app-kit/issues/389)) ([6ad596f](https://github.com/awslabs/iot-app-kit/commit/6ad596f2d5cf31039b8dd5d0fdd069fb91ffc45d))
* **composer:** fix adding tag always attached to root ([#281](https://github.com/awslabs/iot-app-kit/issues/281)) ([f9ff7b1](https://github.com/awslabs/iot-app-kit/commit/f9ff7b1198fdcf073340bbdd4df89c61752d2b4d))
* **composer:** Fix camera view positioning under sub model ([#341](https://github.com/awslabs/iot-app-kit/issues/341)) ([94dcdda](https://github.com/awslabs/iot-app-kit/commit/94dcdda65a7c44cf449828338bed1ea132f995ea))
* **composer:** Fix e.removeFromParent and camera focus ([#350](https://github.com/awslabs/iot-app-kit/issues/350)) ([8458e50](https://github.com/awslabs/iot-app-kit/commit/8458e50f4ec87aa5e7e4f722017766f447d71b5e))
* **composer:** fix error with rendering 3D tiles ([785d833](https://github.com/awslabs/iot-app-kit/commit/785d8338fbb2908a01a6a40b55cc3d7b3fda1ab4))
* **composer:** Fix for bug on drag/drop introduced in last PR & fix for drag/drop icons: ([#364](https://github.com/awslabs/iot-app-kit/issues/364)) ([6dc40b9](https://github.com/awslabs/iot-app-kit/commit/6dc40b918cdfe6cc0d5447d9cb5ca2267ccd2afa))
* **composer:** Fix for displaying children on search results ([#365](https://github.com/awslabs/iot-app-kit/issues/365)) ([15f75cb](https://github.com/awslabs/iot-app-kit/commit/15f75cb6a9094ec4218a21fca287137d9feb7c88))
* **composer:** Fix for duplicate submodels in tree on adding objects to scene ([#370](https://github.com/awslabs/iot-app-kit/issues/370)) ([6c4bcdf](https://github.com/awslabs/iot-app-kit/commit/6c4bcdfd9c76895c76b487f0dfd323e76770d8b3))
* **composer:** Fix for useEffect error ([#373](https://github.com/awslabs/iot-app-kit/issues/373)) ([d74e45e](https://github.com/awslabs/iot-app-kit/commit/d74e45e3094450679a936e852bd7e2c7a65de678))
* **composer:** fix model shader material color restore ([#290](https://github.com/awslabs/iot-app-kit/issues/290)) ([19ce7f1](https://github.com/awslabs/iot-app-kit/commit/19ce7f196850897aa37873e2710974496ac89ac9))
* **composer:** fix object transforms during reparenting ([#477](https://github.com/awslabs/iot-app-kit/issues/477)) ([7a45bb3](https://github.com/awslabs/iot-app-kit/commit/7a45bb3eb1c2418396b39c7d092a380eb32ba250))
* **composer:** fix show svg ([#279](https://github.com/awslabs/iot-app-kit/issues/279)) ([3b7924d](https://github.com/awslabs/iot-app-kit/commit/3b7924dace7d11c726bb43a3f7a790415a049ed5))
* **composer:** Fix to persist drag/drop actions after refresh ([#367](https://github.com/awslabs/iot-app-kit/issues/367)) ([50f3538](https://github.com/awslabs/iot-app-kit/commit/50f353869e241fc05cc2d7d6122ccc604f7bf081))
* **composer:** Fix to restore drag-&-drop placement after refresh ([#361](https://github.com/awslabs/iot-app-kit/issues/361)) ([bd47478](https://github.com/awslabs/iot-app-kit/commit/bd474787dff3c43bcc9ca1d3711396936066c85f))
* **composer:** Fixes 2nd camera viewing click bug ([#291](https://github.com/awslabs/iot-app-kit/issues/291)) ([7899333](https://github.com/awslabs/iot-app-kit/commit/78993334a60ea16293ed6a53f82f99b29a54c0df))
* **composer:** Fixes expand button on hierarchies ([#371](https://github.com/awslabs/iot-app-kit/issues/371)) ([69fc869](https://github.com/awslabs/iot-app-kit/commit/69fc869f178d90ad8e785948b0aae48b01fea27d))
* **composer:** Fixes for layout in Console, submodel layout updates, bug fix for submodel interactive highlights ([#344](https://github.com/awslabs/iot-app-kit/issues/344)) ([a1ea148](https://github.com/awslabs/iot-app-kit/commit/a1ea148c8de1ddabc713c87b379d9e95901d2e03))
* **composer:** Fixes the Duplication of sub models on scene reload by adding persistant identifier to the sub model ([#356](https://github.com/awslabs/iot-app-kit/issues/356)) ([446a4ca](https://github.com/awslabs/iot-app-kit/commit/446a4caa6fb71b05ffaeadac80839fe9c7fd56af))
* **composer:** Fixes the light helper delete while maintaining visibility link ([#349](https://github.com/awslabs/iot-app-kit/issues/349)) ([2f51263](https://github.com/awslabs/iot-app-kit/commit/2f5126377e8cc40645188487499946e2477418e4))
* **composer:** hdr url is sometimes wrong ([#352](https://github.com/awslabs/iot-app-kit/issues/352)) ([2c2625e](https://github.com/awslabs/iot-app-kit/commit/2c2625e6630cecd64231f2b8a6d7876a75ee3347))
* **composer:** Maintain the position in 3D space regardless of the parent ([#375](https://github.com/awslabs/iot-app-kit/issues/375)) ([a106e77](https://github.com/awslabs/iot-app-kit/commit/a106e774bd0bdb13278cdc978f7fb22df1c01a38))
* **composer:** One instance of sub models allowed per instance of the model ([#366](https://github.com/awslabs/iot-app-kit/issues/366)) ([24f3914](https://github.com/awslabs/iot-app-kit/commit/24f3914ac0954cf411a215dd58d74a9eeb8f05cc))
* **composer:** Removing dashboard package to fix pipeline ([#338](https://github.com/awslabs/iot-app-kit/issues/338)) ([9a2c991](https://github.com/awslabs/iot-app-kit/commit/9a2c9917729a5a8b273920aec91e47bacf8b8251))
* **composer:** reorder doesn't persist after reloading ([#374](https://github.com/awslabs/iot-app-kit/issues/374)) ([8c90889](https://github.com/awslabs/iot-app-kit/commit/8c908898f34c51a9ab05c4ef284db4428b3d4f2e))
* **composer:** reorder to same parent duplicates child ([b76057d](https://github.com/awslabs/iot-app-kit/commit/b76057d17f23ad25d9f48497619bf49e23fcecb3))
* **composer:** Restores drag-&-drop functionality in Scene Hierarchy ([#359](https://github.com/awslabs/iot-app-kit/issues/359)) ([b220501](https://github.com/awslabs/iot-app-kit/commit/b22050101400f102be2a0aed46b5b15c7b6fecc5))
* **Composer:** Safe bounding box and 3D cursor fix ([#327](https://github.com/awslabs/iot-app-kit/issues/327)) ([a31585f](https://github.com/awslabs/iot-app-kit/commit/a31585fe447d0aa6a0bda855ffbdd8a4d756798d))
* **composer:** scene change is sometimes not saved ([#409](https://github.com/awslabs/iot-app-kit/issues/409)) ([7b0c45a](https://github.com/awslabs/iot-app-kit/commit/7b0c45aab025a90827a472afb0efc85077dd7ef9))
* **composer:** Scene Hierarchy radio buttons & bug fix for selection on single click ([#326](https://github.com/awslabs/iot-app-kit/issues/326)) ([1026cb4](https://github.com/awslabs/iot-app-kit/commit/1026cb4d607317a43bb45e0058e9762a3a5430c1))
* **composer:** selectedDataBinding not able to update selected node ([#274](https://github.com/awslabs/iot-app-kit/issues/274)) ([ee68f7e](https://github.com/awslabs/iot-app-kit/commit/ee68f7e6825b438f2f7dfd7927f3ee24d471d3fa))
* **composer:** Set tree hierarchy items to auto-collapsed on load ([#380](https://github.com/awslabs/iot-app-kit/issues/380)) ([dad88a0](https://github.com/awslabs/iot-app-kit/commit/dad88a0925a0dbf5c9c15e9e79cd4f025fb54682))
* **composer:** submodel and hierarchy search fix ([#320](https://github.com/awslabs/iot-app-kit/issues/320)) ([364cefb](https://github.com/awslabs/iot-app-kit/commit/364cefb9d4fb820b04e30e8761409a7ad00a5825))
* **composer:** SubModel child fix ([#363](https://github.com/awslabs/iot-app-kit/issues/363)) ([da574e8](https://github.com/awslabs/iot-app-kit/commit/da574e8cd3b62c1dbe275e38faf8590481fc1f0b))
* **composer:** support Windows dependency file paths in GLTF loader ([#417](https://github.com/awslabs/iot-app-kit/issues/417)) ([9f7c075](https://github.com/awslabs/iot-app-kit/commit/9f7c075f58458c75f7bc04cd8287dd0087281f0c))
* **composer:** update translations ([3e8d391](https://github.com/awslabs/iot-app-kit/commit/3e8d39155ea077f37320890ac57e9505d9a719a2))
* **composer:** update translations ([#302](https://github.com/awslabs/iot-app-kit/issues/302)) ([8b6f7a1](https://github.com/awslabs/iot-app-kit/commit/8b6f7a19fac0a3f1e11f1f722bbe6df3b010042b))
* **composer:** use arrow data as texture to avoid public path issue ([#276](https://github.com/awslabs/iot-app-kit/issues/276)) ([f7cbd96](https://github.com/awslabs/iot-app-kit/commit/f7cbd969f93ae021ebfa6853bd478b43e890c738))
* **core-util:** fix subdomain for clients ([cc0d584](https://github.com/awslabs/iot-app-kit/commit/cc0d58464155d04d30cb433d96003cd43f2a9ee4))
* **core-util:** remove private flag for the core-util packages ([0d86584](https://github.com/awslabs/iot-app-kit/commit/0d86584f9ab15a732ccb7d440a9cbf1f82eccae0))
* **core-util:** update publish config for core-utils ([2a3f22f](https://github.com/awslabs/iot-app-kit/commit/2a3f22f8f3df207f1882fa856f90a10ac40d23fd))
* **core, source-iotsitewise:** Remove unecessary exports ([#620](https://github.com/awslabs/iot-app-kit/issues/620)) ([4bfe6f8](https://github.com/awslabs/iot-app-kit/commit/4bfe6f8724b48e28c7efc668aa7268f39e60385a))
* **core:** add currentTime param to viewportStartDate and `viewportEndDate` ([ea75c74](https://github.com/awslabs/iot-app-kit/commit/ea75c748e48f8490d3fc9dce87ddee9ea4e84222))
* **core:** use Map to avoid prototype pollution ([fa0b7ef](https://github.com/awslabs/iot-app-kit/commit/fa0b7efaf27a62ad155a589d13096529e67fb874))
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
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([164b751](https://github.com/awslabs/iot-app-kit/commit/164b7511ef2d42f1e816d804628440e577f03e43))
* Development Quick Start Docs/Scripts ([#148](https://github.com/awslabs/iot-app-kit/issues/148)) ([aa9dba6](https://github.com/awslabs/iot-app-kit/commit/aa9dba6215dc066cc67a6f3933f9de7321b09507))
* **DragHandleIcon:** Drag Handle icon not showing up without special webpack config ([#345](https://github.com/awslabs/iot-app-kit/issues/345)) ([b8952ce](https://github.com/awslabs/iot-app-kit/commit/b8952ceba6c1e462bc3a45bb06b5c7ef54c5da32))
* **Example:** correct instructions on providing AWS credentials to example react-app ([960067f](https://github.com/awslabs/iot-app-kit/commit/960067f138b3cd6b65735f4b307f7bb8fd5608ba))
* Fix setTimeout error ([#32](https://github.com/awslabs/iot-app-kit/issues/32)) ([e174598](https://github.com/awslabs/iot-app-kit/commit/e174598bd6d323ed48af6feee610dc4312d26462))
* fix syntax not supported in all circumstances for package.json override ([#360](https://github.com/awslabs/iot-app-kit/issues/360)) ([7b97dd1](https://github.com/awslabs/iot-app-kit/commit/7b97dd1ab9064feee1c92ad615ef0a09cc4556a1))
* Fix the tag scaling with parent scale regression ([#282](https://github.com/awslabs/iot-app-kit/issues/282)) ([efd49fc](https://github.com/awslabs/iot-app-kit/commit/efd49fc66fbb1c30ff7e971c0d8e024a778468e8))
* **InternalBuild:** Downgrade cloudscape dependency to support internal build ([b20912b](https://github.com/awslabs/iot-app-kit/commit/b20912b77fa1d594d81364ac26df960754c0bace))
* mock SDK in component tests ([#56](https://github.com/awslabs/iot-app-kit/issues/56)) ([dd4bab5](https://github.com/awslabs/iot-app-kit/commit/dd4bab50d755baad24ec907312d428b9161389ac))
* prevent stream render if dataType unknown ([#448](https://github.com/awslabs/iot-app-kit/issues/448)) ([16999db](https://github.com/awslabs/iot-app-kit/commit/16999dbf8ed18770cccda0c993041a57e1c3d0c0))
* propertyName with multi hyphen not working ([#496](https://github.com/awslabs/iot-app-kit/issues/496)) ([7c7dc2c](https://github.com/awslabs/iot-app-kit/commit/7c7dc2c9ab1d82505b1e30dab98b58e728cf75a0))
* **react-components, videoPlayer:** fix propertiesNotChanged for videoPlayer ([11665c0](https://github.com/awslabs/iot-app-kit/commit/11665c0af13e98dc6602d8bf8aac7733d063633c))
* **react-components:** fix binding styles in `useTimeSeriesData` hook ([c1c0125](https://github.com/awslabs/iot-app-kit/commit/c1c012577448c6e07090b23ad988e39a3d530bb6))
* **react-components:** set timezone for jest to UTC to prevent local test failures ([44c3793](https://github.com/awslabs/iot-app-kit/commit/44c379338a2a9110600a0502e37ae4dceaf0ab09))
* **ReactComponents:** configure table, kpi and status to always fetch raw data ([c02b566](https://github.com/awslabs/iot-app-kit/commit/c02b566cad9aa2b8e700765f7923df2d4a6fbec4))
* related-table eslint and prettier ([#10](https://github.com/awslabs/iot-app-kit/issues/10)) ([67a7149](https://github.com/awslabs/iot-app-kit/commit/67a7149131813b8239079f2b931c78e5b607a708))
* **related-table:** expanded toggling already expanded nodes ([#382](https://github.com/awslabs/iot-app-kit/issues/382)) ([a6d29c8](https://github.com/awslabs/iot-app-kit/commit/a6d29c8b2ea1d74ede87a8db2db6920f3f546958))
* **release:** release as 4.0.0-nightly ([f2967b0](https://github.com/awslabs/iot-app-kit/commit/f2967b0d134b51fa8e7c0c833d8113eceaa79b0d))
* **release:** remove stray table references from release manifest ([83b1a9b](https://github.com/awslabs/iot-app-kit/commit/83b1a9b4c56473b93d75eb8303bcfabd75afe4df))
* remove full file eslint disable. Switch to minimal eslint disable. ([ba18720](https://github.com/awslabs/iot-app-kit/commit/ba18720829be791fd030e4a6cf57f2254b65f09f))
* remove prettier, enforce eslint on build ([#29](https://github.com/awslabs/iot-app-kit/issues/29)) ([1b2e5ca](https://github.com/awslabs/iot-app-kit/commit/1b2e5cad203a561feda89544382e38f453c64124))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* remove unused variables. ([13c7dfe](https://github.com/awslabs/iot-app-kit/commit/13c7dfe10dc4a8c02621d08bc1b959d647c083fb))
* **Reparenting:** Fix reparenting nodes ([#368](https://github.com/awslabs/iot-app-kit/issues/368)) ([8a66f94](https://github.com/awslabs/iot-app-kit/commit/8a66f940e98a31e3ef6937336e0e5114e23ad20c))
* requestBuffer ([#49](https://github.com/awslabs/iot-app-kit/issues/49)) ([b342b32](https://github.com/awslabs/iot-app-kit/commit/b342b32d5701cb9fe48e793628d6f0f89a2248f8))
* require npm &gt;=8.7.0 to fix yarn.lock issue with d3-color-1-fix ([#331](https://github.com/awslabs/iot-app-kit/issues/331)) ([eba59ca](https://github.com/awslabs/iot-app-kit/commit/eba59cac747cb5a359ddb6596f02c8a26d5cd5c0))
* resolve float decimal precision issue on round() function. ([#160](https://github.com/awslabs/iot-app-kit/issues/160)) ([6efeac4](https://github.com/awslabs/iot-app-kit/commit/6efeac47acce17da5f99104aec9d5a70cad366a2))
* resolves [#83](https://github.com/awslabs/iot-app-kit/issues/83) ([#87](https://github.com/awslabs/iot-app-kit/issues/87)) ([364716f](https://github.com/awslabs/iot-app-kit/commit/364716f72857526b93e63146fa378d2464974400))
* **scene-composer:** remove invalid workspace syntax ([#640](https://github.com/awslabs/iot-app-kit/issues/640)) ([ed3b28d](https://github.com/awslabs/iot-app-kit/commit/ed3b28dc86fdae2e70b639ce2774217cd92b6122))
* **SceneHierarchyPerformance:** SceneHierarchy Tree Performance ([#283](https://github.com/awslabs/iot-app-kit/issues/283)) ([5e93adc](https://github.com/awslabs/iot-app-kit/commit/5e93adcc5eb338b98a5c9d90b7873880df1bba1a))
* sitewise source time series module ([#71](https://github.com/awslabs/iot-app-kit/issues/71)) ([6671217](https://github.com/awslabs/iot-app-kit/commit/6671217f3f2b813ecec6e907ee85ba6e0dd347c6))
* **source-iotsitewise:** deduplicate batch requests ([#629](https://github.com/awslabs/iot-app-kit/issues/629)) ([0a5e8a1](https://github.com/awslabs/iot-app-kit/commit/0a5e8a1ec7eeec2c7f214a0f8c7963bb66990678))
* **source-iotsitewise:** use alarm model name in data stream instead of alarm state name ([3c3a1ae](https://github.com/awslabs/iot-app-kit/commit/3c3a1ae52df8f32d0217e82c463e624cc4880890))
* **SubModelHidingChildren:** Unnamed children should be skipped not omitted ([#377](https://github.com/awslabs/iot-app-kit/issues/377)) ([46be1c4](https://github.com/awslabs/iot-app-kit/commit/46be1c4ab34551b22cb1638e97025f4ae4b43347))
* Support additional parameters in intercepting calls to table cell renderer ([ce2be51](https://github.com/awslabs/iot-app-kit/commit/ce2be513327e658b5f391f0fbf94f9fe192af530))
* Swaped ternary statement terms ([#22](https://github.com/awslabs/iot-app-kit/issues/22)) ([b7899f1](https://github.com/awslabs/iot-app-kit/commit/b7899f12d88f22a1c5047859ddd3cedee9668915))
* **table:** add missing brackets. ([#183](https://github.com/awslabs/iot-app-kit/issues/183)) ([5c5ec7b](https://github.com/awslabs/iot-app-kit/commit/5c5ec7bb6e7cf636bf90dfe9eecdf6170ce2ea6a))
* **table:** fix an issue when key in columnDefinition doesn't exist in TableItems ([#146](https://github.com/awslabs/iot-app-kit/issues/146)) ([13c7dfe](https://github.com/awslabs/iot-app-kit/commit/13c7dfe10dc4a8c02621d08bc1b959d647c083fb))
* testing ground DataModule parameter ([#17](https://github.com/awslabs/iot-app-kit/issues/17)) ([61632de](https://github.com/awslabs/iot-app-kit/commit/61632de997cc5ced9e21b2625d6e221432649803))
* TilesLoader will now load all visible tiles ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* TilesLoader will now load all visible tiles ([#593](https://github.com/awslabs/iot-app-kit/issues/593)) ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* **typescript:** re-enables typescript for component package tests ([12f60b7](https://github.com/awslabs/iot-app-kit/commit/12f60b7847853e17d398e6346d470606467e2d5c))
* **UITests:** fix dashbaord e2e tests ([dd98c0e](https://github.com/awslabs/iot-app-kit/commit/dd98c0ea9ccd6a7dacc9ee5f994ccce7007f0b21))
* update @testing-library/react to use create root ([#151](https://github.com/awslabs/iot-app-kit/issues/151)) ([380e4cf](https://github.com/awslabs/iot-app-kit/commit/380e4cf60a7612a586d6a86891b78fe14240bff5))
* Updating documentation for Storybook ([#264](https://github.com/awslabs/iot-app-kit/issues/264)) ([83352bd](https://github.com/awslabs/iot-app-kit/commit/83352bdab956c8115dc08937e4acb442c6841a0d))
* use viewport from provider ([#515](https://github.com/awslabs/iot-app-kit/issues/515)) ([eb515a5](https://github.com/awslabs/iot-app-kit/commit/eb515a58cb807f421ca62004bb07cc3bdcb7cc50))
* **video-player:** use static timestamps instead dynamic ones ([1e434a6](https://github.com/awslabs/iot-app-kit/commit/1e434a6632c6dd797f9d0dacd3ed3547622d93c9))


### Miscellaneous Chores

* release 4.0.0-nightly ([c4d2c1b](https://github.com/awslabs/iot-app-kit/commit/c4d2c1b9201890be3b4d112079269b2207d3fd7c))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))

## [4.0.1](https://github.com/awslabs/iot-app-kit/compare/root-v4.0.0...root-v4.0.1) (2023-03-28)


### ⚠ BREAKING CHANGES

* **ReactComponents:** remove web-component iot app kit visualizations

### Features

* **composer:** add data overaly ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add overlay panel config editor ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data binding variable support for data overlay ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data overlay editor & render markdown ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** implement add overlay from menu ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** Implement data overlay container ([#595](https://github.com/awslabs/iot-app-kit/issues/595)) ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **dashboard/components:** memoize components to prevent unnecessary re-renders ([50050ca](https://github.com/awslabs/iot-app-kit/commit/50050ca206efa320256b848f187854c11de85d73))
* **dashboard:** kpi and status widget empty states ([9dea96d](https://github.com/awslabs/iot-app-kit/commit/9dea96d8b6fb1f59ba2173510ebeb749ebe6233c))
* **dashboard:** refactor sitewise clients ([ddac5b2](https://github.com/awslabs/iot-app-kit/commit/ddac5b2626d24bf8bfacb840611b8b880b2c99af))
* **ReactComponents:** support alarms via thresholds ingested from useTimeSeriesData hook ([4df9ff0](https://github.com/awslabs/iot-app-kit/commit/4df9ff00083239e3eb32b7766ec16396a5f7deb4))
* **resource explorer:** allow dashboard to only show asset name ([5df2c5c](https://github.com/awslabs/iot-app-kit/commit/5df2c5cf9f289360ea4a80f3188c7d16307b5e06))
* **time-sync:** useViewport returns a group ([c12349b](https://github.com/awslabs/iot-app-kit/commit/c12349b17e7ed917babd394a05c7a47f0b8bccc0))
* **TimeSync:** add a lastUsedBy string to the useViewport hook ([526f059](https://github.com/awslabs/iot-app-kit/commit/526f059dcfe74d8590b9ee0add435700d3ed943d))
* **TwinMakerTools:** add twin maker tools package ([79cf53b](https://github.com/awslabs/iot-app-kit/commit/79cf53b5a5e278de783e860a360e45867acf1b4d))


### Bug Fixes

* **actions:** updating release-please command ([5fb120e](https://github.com/awslabs/iot-app-kit/commit/5fb120e1d88e8193b0cb99b1bb24803518aef2aa))
* **BarChart:** prevent bar chart from trying to request raw data by default ([6845d95](https://github.com/awslabs/iot-app-kit/commit/6845d95789861a1d6d97cfb4322f6371983de729))
* **composer:** update translations ([3e8d391](https://github.com/awslabs/iot-app-kit/commit/3e8d39155ea077f37320890ac57e9505d9a719a2))
* **core-util:** fix subdomain for clients ([cc0d584](https://github.com/awslabs/iot-app-kit/commit/cc0d58464155d04d30cb433d96003cd43f2a9ee4))
* **core:** use Map to avoid prototype pollution ([fa0b7ef](https://github.com/awslabs/iot-app-kit/commit/fa0b7efaf27a62ad155a589d13096529e67fb874))
* **dashboard:** constrain drag start and endpoint in grid ([ea2b875](https://github.com/awslabs/iot-app-kit/commit/ea2b8757adcf26f9cd6afc0db36031159d2e0142))
* **dashboard:** fix resizing issue ([024feb9](https://github.com/awslabs/iot-app-kit/commit/024feb923500f9e798c4a84b94aa5667ce1ce3b4))
* **dashboard:** remove chart suffix from empty states ([28e4c09](https://github.com/awslabs/iot-app-kit/commit/28e4c09b56896f0083d501b2f0f1fe9d536deb7e))
* **dashboard:** support decimals for thresholds ([3cfd8a4](https://github.com/awslabs/iot-app-kit/commit/3cfd8a44d6028486a9f7b6cb4694a828d23bbb56))
* **DashboardToolbar:** remove scrollbar from toolbar ([8a18a25](https://github.com/awslabs/iot-app-kit/commit/8a18a250106d16bcad2f8bda63f0fc2a42c9f47b))
* **Example:** correct instructions on providing AWS credentials to example react-app ([960067f](https://github.com/awslabs/iot-app-kit/commit/960067f138b3cd6b65735f4b307f7bb8fd5608ba))
* **react-components:** fix binding styles in `useTimeSeriesData` hook ([c1c0125](https://github.com/awslabs/iot-app-kit/commit/c1c012577448c6e07090b23ad988e39a3d530bb6))


### Code Refactoring

* **ReactComponents:** remove web-component iot app kit visualizations ([e0cb301](https://github.com/awslabs/iot-app-kit/commit/e0cb301d1dc204f55684cbd61d4d5c2b66276556))

## [4.0.0](https://github.com/awslabs/iot-app-kit/compare/root-v3.0.0...root-v4.0.0) (2023-03-15)


### ⚠ BREAKING CHANGES

* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper
* **source-iotsitewise:** support propertyAlias in quries

### Features

* **composer:** add runtime tag settings change support ([eeda501](https://github.com/awslabs/iot-app-kit/commit/eeda501d456c10f61123f9c4f77618bb870816f5))
* **dashboard:** add alarm support for widgets ([bf7964a](https://github.com/awslabs/iot-app-kit/commit/bf7964ac18c66c3bcc979425f62a13a705bfae7c))
* **dashboard:** add table support to dashboard ([1d8d44e](https://github.com/awslabs/iot-app-kit/commit/1d8d44e2a7bb67811de9702efa23dbdd5653f572))
* **dashboard:** complete table support ([29bbb4c](https://github.com/awslabs/iot-app-kit/commit/29bbb4cb3297ed739390e349af9069ad6601c368))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **source-iotsitewise:** support propertyAlias in quries ([bfe32ce](https://github.com/awslabs/iot-app-kit/commit/bfe32ce74ba6008ae6bb15d1b5f60e8546d36135))
* **TableComponent:** replace table annotations API with thresholds, remove stencilJS wrapper ([74880c4](https://github.com/awslabs/iot-app-kit/commit/74880c44117c12a494f6c6591f0c6df21cd7d00f))


### Bug Fixes

* **build:** add missing dev deps in scene-composer ([b128405](https://github.com/awslabs/iot-app-kit/commit/b1284052e7db7247bd1bbe4758cde21ba584f8c5))
* **ci:** allow releases to be trigged via changes to github workflows ([5265ed0](https://github.com/awslabs/iot-app-kit/commit/5265ed0f30a4524cb5b5f0643f8b079537ffd074))
* **ci:** release as 3.0.1@alpha ([6677a1f](https://github.com/awslabs/iot-app-kit/commit/6677a1f011e72387fcf170e0944a9acb780a239a))
* **components:** fix connector to iot app kit components ([be91864](https://github.com/awslabs/iot-app-kit/commit/be91864aee326c1c3fd5320b30b86d34f9f246d0))
* **composer:** fix error with rendering 3D tiles ([785d833](https://github.com/awslabs/iot-app-kit/commit/785d8338fbb2908a01a6a40b55cc3d7b3fda1ab4))
* **dashboard:** add guard on widget sizes & positions and dispatch relative actions from side panel ([12044ec](https://github.com/awslabs/iot-app-kit/commit/12044ec65af159b4f65ba41af8134271536c3dda))
* **dashboard:** fix edit mode bugs ([2e88abf](https://github.com/awslabs/iot-app-kit/commit/2e88abf6c7ec72f192ec272b13c3d66101646734))
* **dashboard:** fix styling for component palette and add tests for drag and drop ([41fd944](https://github.com/awslabs/iot-app-kit/commit/41fd944edcfdd0159aec29dd86b5f0b3dc17ff23))
* **dashboard:** fix the build ([c160031](https://github.com/awslabs/iot-app-kit/commit/c16003156ed22e85b1569a7b3e5024c53b8a4be4))
* **dashboard:** remove widget background color ([7392aad](https://github.com/awslabs/iot-app-kit/commit/7392aad1d6800a3c932f196788e9fe9085c9beee))
* **dashboard:** update side panel styling to remove sass variable references ([36d8648](https://github.com/awslabs/iot-app-kit/commit/36d8648818edba3b83f8a36912290ef641cacd9a))
* **InternalBuild:** Downgrade cloudscape dependency to support internal build ([b20912b](https://github.com/awslabs/iot-app-kit/commit/b20912b77fa1d594d81364ac26df960754c0bace))
* **react-components:** set timezone for jest to UTC to prevent local test failures ([44c3793](https://github.com/awslabs/iot-app-kit/commit/44c379338a2a9110600a0502e37ae4dceaf0ab09))
* **release:** release as 4.0.0-nightly ([f2967b0](https://github.com/awslabs/iot-app-kit/commit/f2967b0d134b51fa8e7c0c833d8113eceaa79b0d))
* **release:** remove stray table references from release manifest ([83b1a9b](https://github.com/awslabs/iot-app-kit/commit/83b1a9b4c56473b93d75eb8303bcfabd75afe4df))
* **scene-composer:** remove invalid workspace syntax ([#640](https://github.com/awslabs/iot-app-kit/issues/640)) ([ed3b28d](https://github.com/awslabs/iot-app-kit/commit/ed3b28dc86fdae2e70b639ce2774217cd92b6122))
* Support additional parameters in intercepting calls to table cell renderer ([ce2be51](https://github.com/awslabs/iot-app-kit/commit/ce2be513327e658b5f391f0fbf94f9fe192af530))
* **typescript:** re-enables typescript for component package tests ([12f60b7](https://github.com/awslabs/iot-app-kit/commit/12f60b7847853e17d398e6346d470606467e2d5c))


### Miscellaneous Chores

* release 4.0.0-nightly ([c4d2c1b](https://github.com/awslabs/iot-app-kit/commit/c4d2c1b9201890be3b4d112079269b2207d3fd7c))

## [3.0.0](https://github.com/awslabs/iot-app-kit/compare/root-v2.6.5...root-v3.0.0) (2023-03-04)


### ⚠ BREAKING CHANGES

* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634))
* **core, source-iotsitewise:** 
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600))

### Features

* **composer:** update TagResize feature implementation ([b8dfb46](https://github.com/awslabs/iot-app-kit/commit/b8dfb468043ff6c8b4f154c145f997c6467117ec))
* **core, source-iotsitewise, source-iottwinmaker, react-components:** Add toQueryString method on Query type, implement in iotsitewise and iottwinmaker ([#634](https://github.com/awslabs/iot-app-kit/issues/634)) ([38a4b98](https://github.com/awslabs/iot-app-kit/commit/38a4b9833ba45eb54585581d661badd93162540c))
* **dashboard:** add input widet configuration ([#581](https://github.com/awslabs/iot-app-kit/issues/581)) ([a1bf180](https://github.com/awslabs/iot-app-kit/commit/a1bf18084aed3126dac0540a848a0e3b35492e32))
* **dashboard:** initial dashboard work ([06cc210](https://github.com/awslabs/iot-app-kit/commit/06cc21079dc0446a06c72db676dba27f05a1606f))
* **dashboard:** initial scaffolding for input widget ([#566](https://github.com/awslabs/iot-app-kit/issues/566)) ([e6bbb46](https://github.com/awslabs/iot-app-kit/commit/e6bbb46cf738dceeb7a9a3a8873f0d148f182db8))
* **dashboard:** update resource explorer ([#613](https://github.com/awslabs/iot-app-kit/issues/613)) ([b75a33b](https://github.com/awslabs/iot-app-kit/commit/b75a33be0106ff341e66c219e7090f7f0c8f791b))
* **Matterport:** Integrate Matterport Showcase Viewer into TwinMaker SceneComposer ([58236e7](https://github.com/awslabs/iot-app-kit/commit/58236e7eed7f5435480cba6ce214346a4f8d3a86))
* **react-components:** publish TimeSync component as part of the public API ([#621](https://github.com/awslabs/iot-app-kit/issues/621)) ([a4e2f66](https://github.com/awslabs/iot-app-kit/commit/a4e2f66e6a0a2d58eb1a5316ac3fab4520dd3161))
* **react-components:** release useViewport hook ([#631](https://github.com/awslabs/iot-app-kit/issues/631)) ([794b4a4](https://github.com/awslabs/iot-app-kit/commit/794b4a49c70824836ac0fadf8008d0937059d16d))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))


### Bug Fixes

* build to pass when publishing package ([#635](https://github.com/awslabs/iot-app-kit/issues/635)) ([82c3c42](https://github.com/awslabs/iot-app-kit/commit/82c3c42f1f59b42024f3a25a6dc4283b507d6a64))
* **core, source-iotsitewise:** Remove unecessary exports ([#620](https://github.com/awslabs/iot-app-kit/issues/620)) ([4bfe6f8](https://github.com/awslabs/iot-app-kit/commit/4bfe6f8724b48e28c7efc668aa7268f39e60385a))
* **dashboard/components:** add missing prop to webgl component and refactor in dashboard to fix overlay problem ([59738ac](https://github.com/awslabs/iot-app-kit/commit/59738ac9551aa5b55448281a82fa88d1edc700d0))
* **dashboard:** fix layering of widgets with selection and context menu ([f98d5e7](https://github.com/awslabs/iot-app-kit/commit/f98d5e7642d6c73ad88206391e418347b840b69b))
* **dashboard:** grow asset properties panel ([#628](https://github.com/awslabs/iot-app-kit/issues/628)) ([89fb6b6](https://github.com/awslabs/iot-app-kit/commit/89fb6b6e0c8b76068febb7810e0425080b436d27))
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **dashboard:** remove tailing digits on widget dragging. ([b89c5f7](https://github.com/awslabs/iot-app-kit/commit/b89c5f794adc782b51090d13e6bd47b6169e5c0a))
* **dashboard:** resolve pretty paths in storybook ([#588](https://github.com/awslabs/iot-app-kit/issues/588)) ([a82178e](https://github.com/awslabs/iot-app-kit/commit/a82178ebc7f05375b1108aad98cb4cfd966dd20e))
* Remove unecessary exports, utilize core types instead of SynchroChart types ([#600](https://github.com/awslabs/iot-app-kit/issues/600)) ([15d6740](https://github.com/awslabs/iot-app-kit/commit/15d67401b7e152eeba1e550efc75faf79cefbf7e))
* **source-iotsitewise:** deduplicate batch requests ([#629](https://github.com/awslabs/iot-app-kit/issues/629)) ([0a5e8a1](https://github.com/awslabs/iot-app-kit/commit/0a5e8a1ec7eeec2c7f214a0f8c7963bb66990678))
* TilesLoader will now load all visible tiles ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* TilesLoader will now load all visible tiles ([#593](https://github.com/awslabs/iot-app-kit/issues/593)) ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))

## [2.6.5](https://github.com/awslabs/iot-app-kit/compare/root-v2.6.4...root-v2.6.5) (2023-01-25)


### Bug Fixes

* use viewport from provider ([#515](https://github.com/awslabs/iot-app-kit/issues/515)) ([eb515a5](https://github.com/awslabs/iot-app-kit/commit/eb515a58cb807f421ca62004bb07cc3bdcb7cc50))

## [2.6.4](https://github.com/awslabs/iot-app-kit/compare/root-v2.6.3...root-v2.6.4) (2023-01-23)


### Bug Fixes

* propertyName with multi hyphen not working ([#496](https://github.com/awslabs/iot-app-kit/issues/496)) ([7c7dc2c](https://github.com/awslabs/iot-app-kit/commit/7c7dc2c9ab1d82505b1e30dab98b58e728cf75a0))

## [2.6.3](https://github.com/awslabs/iot-app-kit/compare/root-v2.6.2...root-v2.6.3) (2023-01-13)


### Bug Fixes

* **composer:** Auto expand hierarchy when selecting node on scene ([#452](https://github.com/awslabs/iot-app-kit/issues/452)) ([9b3e80f](https://github.com/awslabs/iot-app-kit/commit/9b3e80f17f26ef0268eaeb6222d79f077d057c97))
* **composer:** fix object transforms during reparenting ([#477](https://github.com/awslabs/iot-app-kit/issues/477)) ([7a45bb3](https://github.com/awslabs/iot-app-kit/commit/7a45bb3eb1c2418396b39c7d092a380eb32ba250))

## [2.6.2](https://github.com/awslabs/iot-app-kit/compare/root-v2.6.1...root-v2.6.2) (2023-01-09)


### Bug Fixes

* prevent stream render if dataType unknown ([#448](https://github.com/awslabs/iot-app-kit/issues/448)) ([16999db](https://github.com/awslabs/iot-app-kit/commit/16999dbf8ed18770cccda0c993041a57e1c3d0c0))

## [2.6.1](https://github.com/awslabs/iot-app-kit/compare/root-v2.6.0...root-v2.6.1) (2023-01-09)


### Bug Fixes

* **composer:** Allows nodes to be dropped at root level ([#390](https://github.com/awslabs/iot-app-kit/issues/390)) ([d9d7978](https://github.com/awslabs/iot-app-kit/commit/d9d79789e67a43b94057ad0ff45c663e186cacf7))
* **composer:** hdr url is sometimes wrong ([#352](https://github.com/awslabs/iot-app-kit/issues/352)) ([2c2625e](https://github.com/awslabs/iot-app-kit/commit/2c2625e6630cecd64231f2b8a6d7876a75ee3347))
* **composer:** support Windows dependency file paths in GLTF loader ([#417](https://github.com/awslabs/iot-app-kit/issues/417)) ([9f7c075](https://github.com/awslabs/iot-app-kit/commit/9f7c075f58458c75f7bc04cd8287dd0087281f0c))

## [2.6.0](https://github.com/awslabs/iot-app-kit/compare/root-v2.5.1...root-v2.6.0) (2022-12-19)


### Features

* prevent unsupported data types from being rendered ([#426](https://github.com/awslabs/iot-app-kit/issues/426)) ([dec2a86](https://github.com/awslabs/iot-app-kit/commit/dec2a86f0eccfe87ebfc32d89f74fb8695bb552d))


### Bug Fixes

* **composer:** CSS Cleanup for Sceneviewer ([#379](https://github.com/awslabs/iot-app-kit/issues/379)) ([890dc4d](https://github.com/awslabs/iot-app-kit/commit/890dc4d57b3b756e90d47884fdf8a275595a1bc5))
* **composer:** entityId data binding not rendered ([#389](https://github.com/awslabs/iot-app-kit/issues/389)) ([6ad596f](https://github.com/awslabs/iot-app-kit/commit/6ad596f2d5cf31039b8dd5d0fdd069fb91ffc45d))
* **composer:** reorder to same parent duplicates child ([b76057d](https://github.com/awslabs/iot-app-kit/commit/b76057d17f23ad25d9f48497619bf49e23fcecb3))
* **composer:** scene change is sometimes not saved ([#409](https://github.com/awslabs/iot-app-kit/issues/409)) ([7b0c45a](https://github.com/awslabs/iot-app-kit/commit/7b0c45aab025a90827a472afb0efc85077dd7ef9))
* **composer:** Set tree hierarchy items to auto-collapsed on load ([#380](https://github.com/awslabs/iot-app-kit/issues/380)) ([dad88a0](https://github.com/awslabs/iot-app-kit/commit/dad88a0925a0dbf5c9c15e9e79cd4f025fb54682))
* **related-table:** expanded toggling already expanded nodes ([#382](https://github.com/awslabs/iot-app-kit/issues/382)) ([a6d29c8](https://github.com/awslabs/iot-app-kit/commit/a6d29c8b2ea1d74ede87a8db2db6920f3f546958))
* **SubModelHidingChildren:** Unnamed children should be skipped not omitted ([#377](https://github.com/awslabs/iot-app-kit/issues/377)) ([46be1c4](https://github.com/awslabs/iot-app-kit/commit/46be1c4ab34551b22cb1638e97025f4ae4b43347))
* **video-player:** use static timestamps instead dynamic ones ([1e434a6](https://github.com/awslabs/iot-app-kit/commit/1e434a6632c6dd797f9d0dacd3ed3547622d93c9))

## [2.5.1](https://github.com/awslabs/iot-app-kit/compare/root-v2.5.0...root-v2.5.1) (2022-11-16)


### Bug Fixes

* **composer:** Adjusting logic for reparenting scene nodes ([#369](https://github.com/awslabs/iot-app-kit/issues/369)) ([3475ebd](https://github.com/awslabs/iot-app-kit/commit/3475ebd404c728226cc1582667cabfd1420a8afa))
* **composer:** drag root node crashes scene ([#372](https://github.com/awslabs/iot-app-kit/issues/372)) ([ca01c40](https://github.com/awslabs/iot-app-kit/commit/ca01c40241cad7f86f1bbb1a9b920795485076b8))
* **composer:** enable new features for SceneViewer ([#355](https://github.com/awslabs/iot-app-kit/issues/355)) ([631953a](https://github.com/awslabs/iot-app-kit/commit/631953a674fd8969e88b64c215ed8cd51b961e8e))
* **composer:** Enhanced Edit now allows for undo operation ([#376](https://github.com/awslabs/iot-app-kit/issues/376)) ([5e73bb8](https://github.com/awslabs/iot-app-kit/commit/5e73bb80d303fda63f81dd543b76add11ca61670))
* **composer:** Fix for bug on drag/drop introduced in last PR & fix for drag/drop icons: ([#364](https://github.com/awslabs/iot-app-kit/issues/364)) ([6dc40b9](https://github.com/awslabs/iot-app-kit/commit/6dc40b918cdfe6cc0d5447d9cb5ca2267ccd2afa))
* **composer:** Fix for displaying children on search results ([#365](https://github.com/awslabs/iot-app-kit/issues/365)) ([15f75cb](https://github.com/awslabs/iot-app-kit/commit/15f75cb6a9094ec4218a21fca287137d9feb7c88))
* **composer:** Fix for duplicate submodels in tree on adding objects to scene ([#370](https://github.com/awslabs/iot-app-kit/issues/370)) ([6c4bcdf](https://github.com/awslabs/iot-app-kit/commit/6c4bcdfd9c76895c76b487f0dfd323e76770d8b3))
* **composer:** Fix for useEffect error ([#373](https://github.com/awslabs/iot-app-kit/issues/373)) ([d74e45e](https://github.com/awslabs/iot-app-kit/commit/d74e45e3094450679a936e852bd7e2c7a65de678))
* **composer:** Fix to persist drag/drop actions after refresh ([#367](https://github.com/awslabs/iot-app-kit/issues/367)) ([50f3538](https://github.com/awslabs/iot-app-kit/commit/50f353869e241fc05cc2d7d6122ccc604f7bf081))
* **composer:** Fix to restore drag-&-drop placement after refresh ([#361](https://github.com/awslabs/iot-app-kit/issues/361)) ([bd47478](https://github.com/awslabs/iot-app-kit/commit/bd474787dff3c43bcc9ca1d3711396936066c85f))
* **composer:** Fixes expand button on hierarchies ([#371](https://github.com/awslabs/iot-app-kit/issues/371)) ([69fc869](https://github.com/awslabs/iot-app-kit/commit/69fc869f178d90ad8e785948b0aae48b01fea27d))
* **composer:** Fixes the Duplication of sub models on scene reload by adding persistant identifier to the sub model ([#356](https://github.com/awslabs/iot-app-kit/issues/356)) ([446a4ca](https://github.com/awslabs/iot-app-kit/commit/446a4caa6fb71b05ffaeadac80839fe9c7fd56af))
* **composer:** Maintain the position in 3D space regardless of the parent ([#375](https://github.com/awslabs/iot-app-kit/issues/375)) ([a106e77](https://github.com/awslabs/iot-app-kit/commit/a106e774bd0bdb13278cdc978f7fb22df1c01a38))
* **composer:** One instance of sub models allowed per instance of the model ([#366](https://github.com/awslabs/iot-app-kit/issues/366)) ([24f3914](https://github.com/awslabs/iot-app-kit/commit/24f3914ac0954cf411a215dd58d74a9eeb8f05cc))
* **composer:** reorder doesn't persist after reloading ([#374](https://github.com/awslabs/iot-app-kit/issues/374)) ([8c90889](https://github.com/awslabs/iot-app-kit/commit/8c908898f34c51a9ab05c4ef284db4428b3d4f2e))
* **composer:** Restores drag-&-drop functionality in Scene Hierarchy ([#359](https://github.com/awslabs/iot-app-kit/issues/359)) ([b220501](https://github.com/awslabs/iot-app-kit/commit/b22050101400f102be2a0aed46b5b15c7b6fecc5))
* **composer:** SubModel child fix ([#363](https://github.com/awslabs/iot-app-kit/issues/363)) ([da574e8](https://github.com/awslabs/iot-app-kit/commit/da574e8cd3b62c1dbe275e38faf8590481fc1f0b))
* fix syntax not supported in all circumstances for package.json override ([#360](https://github.com/awslabs/iot-app-kit/issues/360)) ([7b97dd1](https://github.com/awslabs/iot-app-kit/commit/7b97dd1ab9064feee1c92ad615ef0a09cc4556a1))
* **Reparenting:** Fix reparenting nodes ([#368](https://github.com/awslabs/iot-app-kit/issues/368)) ([8a66f94](https://github.com/awslabs/iot-app-kit/commit/8a66f940e98a31e3ef6937336e0e5114e23ad20c))

## [2.5.0](https://github.com/awslabs/iot-app-kit/compare/root-v2.4.2...root-v2.5.0) (2022-11-11)


### Features

* **github:** add github workflow to publish alpha dashboard ([92eb162](https://github.com/awslabs/iot-app-kit/commit/92eb162288b26a3bdc2297b65108537a7c4ceb9d))
* **OpacityFilterZero:** Setting opacity to 0 should effectively hide the object ([#342](https://github.com/awslabs/iot-app-kit/issues/342)) ([91e491b](https://github.com/awslabs/iot-app-kit/commit/91e491b45ad2e31f4e407686fbf40c8c0df9f9d0))


### Bug Fixes

* **composer:** Adding ability to deselect by click radio button ([#351](https://github.com/awslabs/iot-app-kit/issues/351)) ([8c402b7](https://github.com/awslabs/iot-app-kit/commit/8c402b774b9a10ffdcdd13fc0a9f2f89f3eb507b))
* **composer:** Bug fix for rerenders on name input in inspect panel ([#334](https://github.com/awslabs/iot-app-kit/issues/334)) ([b8a0b4c](https://github.com/awslabs/iot-app-kit/commit/b8a0b4c4e8371637a0f1342f96196ca5b46ed383))
* **composer:** Fix camera view positioning under sub model ([#341](https://github.com/awslabs/iot-app-kit/issues/341)) ([94dcdda](https://github.com/awslabs/iot-app-kit/commit/94dcdda65a7c44cf449828338bed1ea132f995ea))
* **composer:** Fix e.removeFromParent and camera focus ([#350](https://github.com/awslabs/iot-app-kit/issues/350)) ([8458e50](https://github.com/awslabs/iot-app-kit/commit/8458e50f4ec87aa5e7e4f722017766f447d71b5e))
* **composer:** Fixes for layout in Console, submodel layout updates, bug fix for submodel interactive highlights ([#344](https://github.com/awslabs/iot-app-kit/issues/344)) ([a1ea148](https://github.com/awslabs/iot-app-kit/commit/a1ea148c8de1ddabc713c87b379d9e95901d2e03))
* **composer:** Fixes the light helper delete while maintaining visibility link ([#349](https://github.com/awslabs/iot-app-kit/issues/349)) ([2f51263](https://github.com/awslabs/iot-app-kit/commit/2f5126377e8cc40645188487499946e2477418e4))
* **composer:** Removing dashboard package to fix pipeline ([#338](https://github.com/awslabs/iot-app-kit/issues/338)) ([9a2c991](https://github.com/awslabs/iot-app-kit/commit/9a2c9917729a5a8b273920aec91e47bacf8b8251))
* **Composer:** Safe bounding box and 3D cursor fix ([#327](https://github.com/awslabs/iot-app-kit/issues/327)) ([a31585f](https://github.com/awslabs/iot-app-kit/commit/a31585fe447d0aa6a0bda855ffbdd8a4d756798d))
* **dashboard:** add node polyfill and svg plugin ([08ca02d](https://github.com/awslabs/iot-app-kit/commit/08ca02de6c475978334a629bf0995dd803333a29))
* **DragHandleIcon:** Drag Handle icon not showing up without special webpack config ([#345](https://github.com/awslabs/iot-app-kit/issues/345)) ([b8952ce](https://github.com/awslabs/iot-app-kit/commit/b8952ceba6c1e462bc3a45bb06b5c7ef54c5da32))

## [2.4.2](https://github.com/awslabs/iot-app-kit/compare/root-v2.4.1...root-v2.4.2) (2022-11-08)


### Bug Fixes

* **composer:** Scene Hierarchy radio buttons & bug fix for selection on single click ([#326](https://github.com/awslabs/iot-app-kit/issues/326)) ([1026cb4](https://github.com/awslabs/iot-app-kit/commit/1026cb4d607317a43bb45e0058e9762a3a5430c1))
* require npm &gt;=8.7.0 to fix yarn.lock issue with d3-color-1-fix ([#331](https://github.com/awslabs/iot-app-kit/issues/331)) ([eba59ca](https://github.com/awslabs/iot-app-kit/commit/eba59cac747cb5a359ddb6596f02c8a26d5cd5c0))

## [2.4.1](https://github.com/awslabs/iot-app-kit/compare/root-v2.4.0...root-v2.4.1) (2022-11-07)


### Bug Fixes

* **composer:** boolean data always converted to false ([#323](https://github.com/awslabs/iot-app-kit/issues/323)) ([254d68f](https://github.com/awslabs/iot-app-kit/commit/254d68f610efd1c75963f91c185bd42a2d649365))

## [2.4.0](https://github.com/awslabs/iot-app-kit/compare/root-v2.3.0...root-v2.4.0) (2022-11-04)


### Features

* **dashboard:** add selection and move components and actions ([13aa08e](https://github.com/awslabs/iot-app-kit/commit/13aa08e26c1a6fee6b791851fdd1a233ccc62e81))


### Bug Fixes

* **composer:** submodel and hierarchy search fix ([#320](https://github.com/awslabs/iot-app-kit/issues/320)) ([364cefb](https://github.com/awslabs/iot-app-kit/commit/364cefb9d4fb820b04e30e8761409a7ad00a5825))

## [2.3.0](https://github.com/awslabs/iot-app-kit/compare/root-v2.2.0...root-v2.3.0) (2022-11-02)


### Features

* **dashboard:** alpha release of dashboard component ([f13002e](https://github.com/awslabs/iot-app-kit/commit/f13002e9df6e683de4fd88bbde1c55d36630830c))


### Bug Fixes

* add dashboard package to the npm workspace config ([61780a4](https://github.com/awslabs/iot-app-kit/commit/61780a48208161d52cf3b16973b49b73606de36d))
* Add dashboard to release-please-config ([5c7419c](https://github.com/awslabs/iot-app-kit/commit/5c7419caf94c6f70473721723c5702ee7db848e1))
* **composer:** Camera and Light helper visibility toggling ([#294](https://github.com/awslabs/iot-app-kit/issues/294)) ([f6bae7c](https://github.com/awslabs/iot-app-kit/commit/f6bae7c118dd7a68e0dd414cb90df95457c06b7c))
* **composer:** Fixes 2nd camera viewing click bug ([#291](https://github.com/awslabs/iot-app-kit/issues/291)) ([ed04d13](https://github.com/awslabs/iot-app-kit/commit/ed04d130269840af40b3a383ed9dd43f04bcd804))
* **composer:** update translations ([#302](https://github.com/awslabs/iot-app-kit/issues/302)) ([95c2bda](https://github.com/awslabs/iot-app-kit/commit/95c2bdae2db263f20432a1f9ccf214cb26a001bf))
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([016c216](https://github.com/awslabs/iot-app-kit/commit/016c216c2934d150f94e595d3ebb34aaafa69e27))

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
* core:
  * Refactor time series data module to   remove unused functionality. Add meta field to data stream.([c063d5c](https://github.com/awslabs/iot-app-kit/commit/c063d5c9f9dddcdff2b3d29a0b1f7b67b04c75a4))
  * (also in source-iotsitewise) Change time series data modules getRequestsFromQueries to be async ([11f7fb0](https://github.com/awslabs/iot-app-kit/commit/11f7fb0442045d20c1ff9cce1567d3126380b29b))
* components:
  * `@iot-app-kit/components/iot-table` now uses AWS-UI's table components (wrapped as a separated [table package](https://github.com/awslabs/iot-app-kit/blob/main/packages/table)) instead of Synchro-chart's table component.
    Because of this change, we have new APIs for `iot-table` component. Check this [documentation](https://github.com/awslabs/iot-app-kit/blob/main/docs/Table.md) for more information about new APIs and migration from old APIs.
  * At current version (v2.0.0), `iot-table` does **NOT** support viewport groups. It will be added in a later version.

### Features
* core:
  * Support caching of dataType, name and other fields describing dataStreams ([355f57e](https://github.com/awslabs/iot-app-kit/commit/355f57e41d40216e0f859b7f5a2b546fb3cba498))
  * Add meta field to requestInfos in TimeSeriesDataModule ([d059dbd](https://github.com/awslabs/iot-app-kit/commit/d059dbdf6585d5e8b89e21020dede63355dfa48c))
  * Add viewportManager to orchestrate viewport syncing within groups ([9afdf26](https://github.com/awslabs/iot-app-kit/commit/9afdf265077d5b237c5523e93c211456caa99279))
* components:
  * introduce new table component supporting filtering and sorting. ([c75d4f0](https://github.com/awslabs/iot-app-kit/commit/c75d4f05b64c801c06ba45acd3b5df2fb7d2e30a))

### Bug fixes
* core:
  * resolve float decimal precision issue on round() function. (#160) ([d95f69e](https://github.com/awslabs/iot-app-kit/commit/d95f69ee8c06143e338f373d7fd23b3f4f669415))

### Miscellaneous
* bump synchro-charts/core version from v5 to v6 (#199) ([ad1e3e6](https://github.com/awslabs/iot-app-kit/commit/ad1e3e6108cc02d58060365ab4bad950f0e991cc))
* Add coding guidelines ([7d0204f](https://github.com/awslabs/iot-app-kit/commit/7d0204f1a57b5d6e0ae86bf9af294ad63e00c4b8))
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


### Bug Fixes

* backfill on requestBuffer tests ([#55](https://github.com/awslabs/iot-app-kit/issues/55)) ([772877e](https://github.com/awslabs/iot-app-kit/commit/772877eb994d77747fcbe5b2089140860c630beb))
* Fix setTimeout error ([#32](https://github.com/awslabs/iot-app-kit/issues/32)) ([4f5f389](https://github.com/awslabs/iot-app-kit/commit/4f5f389a9ed8794c22040aaa97ffa1abf51cebfe))
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
* add support for aggregated data for sitewise data source ([#6](https://github.com/awslabs/iot-app-kit/issues/6)) ([eb1e7f4](https://github.com/awslabs/iot-app-kit/commit/eb1e7f4d2e598ede7217923c83aad204dc7ab4ee))
* add support for resolution mapping ([#16](https://github.com/awslabs/iot-app-kit/issues/16)) ([1dad2b6](https://github.com/awslabs/iot-app-kit/commit/1dad2b663a60ef939e48b58dae5d9c3f07bc68a4))
* Add support for update within subscribeToTimeSeriesData ([#53](https://github.com/awslabs/iot-app-kit/issues/53)) ([21d597c](https://github.com/awslabs/iot-app-kit/commit/21d597c437807d9ca801a096994353cc4f1a9058))
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
* expose ttlDurationMapping as data module configuration ([#20](https://github.com/awslabs/iot-app-kit/issues/20)) ([88c0fcb](https://github.com/awslabs/iot-app-kit/commit/88c0fcb76629ce21aae7002ff6c4ec2a112a3d63))
* improve clean script ([#43](https://github.com/awslabs/iot-app-kit/issues/43)) ([4501670](https://github.com/awslabs/iot-app-kit/commit/45016707a064db18571372270eb3d59ba617c677))
* improve documentation and clarity of react-components pkg ([#60](https://github.com/awslabs/iot-app-kit/issues/60)) ([a1615f9](https://github.com/awslabs/iot-app-kit/commit/a1615f958371b14e75550df97e56e0deca3c34e3))
* improve error handling ([#61](https://github.com/awslabs/iot-app-kit/issues/61)) ([183c01d](https://github.com/awslabs/iot-app-kit/commit/183c01d8f255c3e528aee79b58fbbc89f1567b31))
* increase sitewise default resolution mapping thresholds ([#46](https://github.com/awslabs/iot-app-kit/issues/46)) ([b296883](https://github.com/awslabs/iot-app-kit/commit/b2968832297961aa7121d6420b264c6bdaab6ee2))
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
* Wrap SiteWise Asset related API calls in a Data Source ([b9eabc2](https://github.com/awslabs/iot-app-kit/commit/b9eabc24bb70a3057cd719c58917d5e096cb0c1e))
