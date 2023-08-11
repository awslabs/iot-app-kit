# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.4.0](https://github.com/awslabs/iot-app-kit/compare/root-v3.3.0...root-v3.4.0) (2023-08-08)


### Features

* **3D Knowledge Graph:** update DataBinding to EntityBinding release 3x ([19ed2e5](https://github.com/awslabs/iot-app-kit/commit/19ed2e59797287489b4aa9778829dab4f6af9a9e))
* **3dkg:** added 3dkg changes for entity data binding ([20f6eac](https://github.com/awslabs/iot-app-kit/commit/20f6eac64bc8628dde1ed8f6bc60e438e07b254c))
* **composer:** support enhanced editing in Matterport scene ([3b164f0](https://github.com/awslabs/iot-app-kit/commit/3b164f0066fdf87ae3d1ad671671714200c276eb))
* **scene composer:** color picker changes ([18a06d8](https://github.com/awslabs/iot-app-kit/commit/18a06d86fcc632a86a7037b1af23da6d4750765b))
* **scene composer:** Rule icon using color picker ([bb96f3b](https://github.com/awslabs/iot-app-kit/commit/bb96f3bc49830171ed76bad042dca1589bae28d9))
* **scene-composer:** entity data binding merge request ([7381f1a](https://github.com/awslabs/iot-app-kit/commit/7381f1a2ec228a5eb4808e409f80027f9b91dd1f))


### Bug Fixes

* **composer:** fix issue displaying 0 in overlay ([b37b926](https://github.com/awslabs/iot-app-kit/commit/b37b926efb512472d7d956e13b2e0e01b57e0d50))
* **composer:** unsubscribe to queries when unmounting ([41167ca](https://github.com/awslabs/iot-app-kit/commit/41167cab5a73b5ebcd3bc3703ed8a32b3a73e258))
* **data overlay:** add onWidgetClick and onSelectionChange event support to data overlays ([33e500d](https://github.com/awslabs/iot-app-kit/commit/33e500d198a751a63f4ac1b35626f9a802847229))
* **scene composer:** sets up refs to track visibility of data overlay & parent ([f7e5933](https://github.com/awslabs/iot-app-kit/commit/f7e593325c1924d426deeb1601de4885034602b6))
* **scene-composer:** fix ability to click on tags, revert disabling raycast on scroll ([1d77752](https://github.com/awslabs/iot-app-kit/commit/1d7775227a13adf9b593e7bef587bea7b2c11946))
* **scene-composer:** update raycaster in OrbitControls to ignore undefined face intersections and disable on scroll ([5f76433](https://github.com/awslabs/iot-app-kit/commit/5f764338bd9e98f40846c646841616974b83a988))

## [3.3.0](https://github.com/awslabs/iot-app-kit/compare/root-v3.2.0...root-v3.3.0) (2023-05-22)


### Features

* **composer:** add data binding component ([8cfe22f](https://github.com/awslabs/iot-app-kit/commit/8cfe22fa77d1bf6de0e4f5858f86efeefc72f962))
* **composer:** support partial data binding ([375620e](https://github.com/awslabs/iot-app-kit/commit/375620e63f5d9804b87d6b3ac6099992642208e4))
* **Knowledge Graph:** Adding queryStatement as a function parameter ([d23a728](https://github.com/awslabs/iot-app-kit/commit/d23a728a2edcc737bacd4a563462146dd4b96355))
* **Knowledge Graph:** Fix maxResults Bug ([d23a728](https://github.com/awslabs/iot-app-kit/commit/d23a728a2edcc737bacd4a563462146dd4b96355))
* **Knowledge Graph:** Knowledge Graph DataSource ([d23a728](https://github.com/awslabs/iot-app-kit/commit/d23a728a2edcc737bacd4a563462146dd4b96355))
* **Knowledge Graph:** Knowledge Graph DataSource ([d23a728](https://github.com/awslabs/iot-app-kit/commit/d23a728a2edcc737bacd4a563462146dd4b96355))
* **Knowledge Graph:** TwinMaker Knowledge Graph DataSource ([d23a728](https://github.com/awslabs/iot-app-kit/commit/d23a728a2edcc737bacd4a563462146dd4b96355))


### Bug Fixes

* **composer:** close overlay auto select attached tag ([ce4e218](https://github.com/awslabs/iot-app-kit/commit/ce4e2184bc517054a9423d4f07e31152dc061182))
* **composer:** error handling for Matterport scene ([e0d7921](https://github.com/awslabs/iot-app-kit/commit/e0d7921b1cd4cf8cb330d20f7a58ee3e0a91c77a))
* **composer:** initial loading of Matterport scene ([71c4f89](https://github.com/awslabs/iot-app-kit/commit/71c4f896733f0fe4152bb840770f67ad5f660ec5))
* **composer:** rendering when switch from MP scene ([2da5e6d](https://github.com/awslabs/iot-app-kit/commit/2da5e6d59c4eb187862eb4046ecabed53a009204))
* **scene composer:** cleanup for polaris css imports & moving interface to component file ([deb0ce2](https://github.com/awslabs/iot-app-kit/commit/deb0ce22126ba9f0672b4bd200211ffeac4286d8))
* **scene composer:** modifying auto collapse to only apply to viewer ([5ac028c](https://github.com/awslabs/iot-app-kit/commit/5ac028cf85256192189d2370c3bbb84edeb958d5))
* **scene composer:** set left and right panels to collapse on scene load ([ac0075b](https://github.com/awslabs/iot-app-kit/commit/ac0075b3759c7def6515374740fcbba1ae4d9762))
* **video-player:** video seek percent calculation ([8c9e5c0](https://github.com/awslabs/iot-app-kit/commit/8c9e5c0cb6d1a4def8219b614b7af49efb7f69d5))

## [3.2.0](https://github.com/awslabs/iot-app-kit/compare/root-v3.1.0...root-v3.2.0) (2023-04-20)


### Features

* **composer:** enable data overlay, tag resize, and matterport features ([815a17b](https://github.com/awslabs/iot-app-kit/commit/815a17bdf7a271bf7d7174319597378e4fec5fa9))


### Bug Fixes

* **composer:** adding widget fix for 3d tiles ([80a4ed6](https://github.com/awslabs/iot-app-kit/commit/80a4ed6720c710ee7c556b434126e935da62768d))
* **composer:** fix ViewCursorWidget for 3D Tiles and made cursor size dynamic based on camera distance ([a023cf7](https://github.com/awslabs/iot-app-kit/commit/a023cf714c187a4d09b765a4fb5a78e526424fc5))
* **composer:** update overlay and settings UI ([e551ba6](https://github.com/awslabs/iot-app-kit/commit/e551ba6e5969512bfa823f88b250f243a59e0983))

## [3.1.0](https://github.com/awslabs/iot-app-kit/compare/root-v3.0.0...root-v3.1.0) (2023-04-12)


### Features

* **composer:** Add data overaly ([4a430bd](https://github.com/awslabs/iot-app-kit/commit/4a430bd606d17d120567199488a738bb5d1ab106))
* **Composer:** Add overlay for mp tags, hide camera view, upgrade SDK ([f589086](https://github.com/awslabs/iot-app-kit/commit/f589086a5ebf3cdfa2b5267ae1d870f99ec0e1e1))
* **composer:** add overlay panel config editor ([4a430bd](https://github.com/awslabs/iot-app-kit/commit/4a430bd606d17d120567199488a738bb5d1ab106))
* **composer:** add runtime tag settings change support ([bedae1a](https://github.com/awslabs/iot-app-kit/commit/bedae1a6edade539daf041ff0a16d4da239b5341))
* **composer:** data binding variable support for data overlay ([4a430bd](https://github.com/awslabs/iot-app-kit/commit/4a430bd606d17d120567199488a738bb5d1ab106))
* **composer:** data overlay editor & render markdown ([4a430bd](https://github.com/awslabs/iot-app-kit/commit/4a430bd606d17d120567199488a738bb5d1ab106))
* **composer:** implement add overlay from menu ([4a430bd](https://github.com/awslabs/iot-app-kit/commit/4a430bd606d17d120567199488a738bb5d1ab106))
* **composer:** Implement data overlay container ([#595](https://github.com/awslabs/iot-app-kit/issues/595)) ([4a430bd](https://github.com/awslabs/iot-app-kit/commit/4a430bd606d17d120567199488a738bb5d1ab106))
* **composer:** update overlay UI and flow ([aa1821d](https://github.com/awslabs/iot-app-kit/commit/aa1821de64da52a78daf82fea8df2b3a0752149a))
* **composer:** visibility toggles for overlays in settings panel ([e0b7dc9](https://github.com/awslabs/iot-app-kit/commit/e0b7dc985efe1a92e2b829bc4a71d73031c96729))
* **dashboard:** complete table support ([29bbb4c](https://github.com/awslabs/iot-app-kit/commit/29bbb4cb3297ed739390e349af9069ad6601c368))
* **Matterport:** add Tag Sync button to settings ([78734e8](https://github.com/awslabs/iot-app-kit/commit/78734e8185f460d2df02fe70af4aa14b461edeb0))
* **Matterport:** added support for 3p connector with Matterport ([0c02cc3](https://github.com/awslabs/iot-app-kit/commit/0c02cc3ea23815fa4c41d88cd7be47d15ff2a83b))
* **Matterport:** update viewer on change and mp sdk upgrade ([4c2c113](https://github.com/awslabs/iot-app-kit/commit/4c2c11376714ebfeda3031f43a89e96843106230))
* **matterport:** upgrade client-iottwinmaker ([069e5d5](https://github.com/awslabs/iot-app-kit/commit/069e5d50d6382824668630349a821d1742e5747a))


### Bug Fixes

* **aws-sdk:** fix the build failure due to internal dependencies ([ab960ad](https://github.com/awslabs/iot-app-kit/commit/ab960ad28e93fa3ce875768537e4fa4b6fdaedfd))
* **composer:** black screen on Matterport scene ([70b4b7c](https://github.com/awslabs/iot-app-kit/commit/70b4b7ccbbab5f86f2c43ccbc16364d079ef1d2a))
* **Composer:** Close button style in overlay ([a091341](https://github.com/awslabs/iot-app-kit/commit/a0913412677d6cda6127b41ca6833b8360039871))
* **composer:** convert to inline overlay CSS ([dd58c0c](https://github.com/awslabs/iot-app-kit/commit/dd58c0ce6402f5692d99a03724c70d4baabd72ba))
* **composer:** fix default loading the mp scene ([96bd3e8](https://github.com/awslabs/iot-app-kit/commit/96bd3e80b4eacea407c33fb87231bc4d191dac1f))
* **composer:** fix error with rendering 3D tiles ([785d833](https://github.com/awslabs/iot-app-kit/commit/785d8338fbb2908a01a6a40b55cc3d7b3fda1ab4))
* **composer:** fix reparent rotation and add new object issues ([b852368](https://github.com/awslabs/iot-app-kit/commit/b852368dda1c16b7bbc29dc93bb2622ee829d10c))
* **composer:** flicker grid lines ([2601a19](https://github.com/awslabs/iot-app-kit/commit/2601a199ebab821d240faf93f608f6c9105fb06b))
* **composer:** gate empty overlay section in inspector ([99ed2a3](https://github.com/awslabs/iot-app-kit/commit/99ed2a30483b9ee8cf5797332148cad64b1b1ac1))
* **Composer:** Handle click event ([bbeecda](https://github.com/awslabs/iot-app-kit/commit/bbeecdae80cd8d0282452c1c5b84fa5293dba928))
* **Composer:** Overlay offset & modelId undo/redo ([35283f2](https://github.com/awslabs/iot-app-kit/commit/35283f2db55792ddb5fa8fc3ce221c306ec63d11))
* **composer:** Set environment preset (lighting) to neutral on scene creation. ([d77f0fa](https://github.com/awslabs/iot-app-kit/commit/d77f0fa17e5de22580a221c09ca4c3e79e4e15d9))
* **composer:** show matterport section in Edit mode only ([70b4b7c](https://github.com/awslabs/iot-app-kit/commit/70b4b7ccbbab5f86f2c43ccbc16364d079ef1d2a))
* **composer:** Sync tags correctly & addded status ([bf7a7f1](https://github.com/awslabs/iot-app-kit/commit/bf7a7f1359e25aca883b11a0fc893850d596d840))
* **composer:** temporarily remove view cursor svg ([637a1e3](https://github.com/awslabs/iot-app-kit/commit/637a1e39d9cf626c3b1efee0ed526b198e5eec4b))
* **composer:** update overlay css ([b3f97b3](https://github.com/awslabs/iot-app-kit/commit/b3f97b3e1effe020689698c579e651365d3378fd))
* **composer:** update overlay visibility toggles behavior ([f117e5e](https://github.com/awslabs/iot-app-kit/commit/f117e5e3b93efafff3f592bd57d012923971b90c))
* **composer:** update translations ([2c6b56d](https://github.com/awslabs/iot-app-kit/commit/2c6b56d3bd7b8f4299c0aeeb7762726f93c27351))
* **dashboard:** fix edit mode bugs ([2e88abf](https://github.com/awslabs/iot-app-kit/commit/2e88abf6c7ec72f192ec272b13c3d66101646734))
* **dashboard:** fix styling for component palette and add tests for drag and drop ([41fd944](https://github.com/awslabs/iot-app-kit/commit/41fd944edcfdd0159aec29dd86b5f0b3dc17ff23))
* **iot-app-kit:** fix internal build failure ([0405bdc](https://github.com/awslabs/iot-app-kit/commit/0405bdcf93dfb490c62cc1dacc6881699bc367b9))
* **iot-app-kit:** fix internal build failure ([35994a9](https://github.com/awslabs/iot-app-kit/commit/35994a932a962eb3bc78e2d224b686b08e3e77df))
* **PeerDependencies:** react-intl should be declared as a peer dependency ([b52dd3f](https://github.com/awslabs/iot-app-kit/commit/b52dd3f7ad854b32d150509ea76f5167b7bf3e5e))
* **react-components:** set timezone for jest to UTC to prevent local test failures ([44c3793](https://github.com/awslabs/iot-app-kit/commit/44c379338a2a9110600a0502e37ae4dceaf0ab09))
* **scene-composer:** remove invalid workspace syntax ([#640](https://github.com/awslabs/iot-app-kit/issues/640)) ([ed3b28d](https://github.com/awslabs/iot-app-kit/commit/ed3b28dc86fdae2e70b639ce2774217cd92b6122))
* **typescript:** re-enables typescript for component package tests ([9b1ef48](https://github.com/awslabs/iot-app-kit/commit/9b1ef48bf53b797c7d0ce1957d72d85fee6c74ed))

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
