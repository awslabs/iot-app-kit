# Change Log


All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.2.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v10.1.0...scene-composer-v10.2.0) (2024-03-29)


### Features

* migrate from awsui to cloudscape ([37802b1](https://github.com/awslabs/iot-app-kit/commit/37802b18f12844dba6876cd7d94c50420cbece66))


### Bug Fixes

* **scene:** handle bad texture files gracefully and toggle opacity on selection ([dca5b10](https://github.com/awslabs/iot-app-kit/commit/dca5b10404d9dd1175e16284d9733abe38590175))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/react-components bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/related-table bumped from 10.1.0 to 10.2.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.1.0 to 10.2.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 10.1.0 to 10.2.0

## [10.1.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v10.0.0...scene-composer-v10.1.0) (2024-03-21)


### Bug Fixes

* **scene:** fix Scene Hierarchy Tree item for node with no components ([e341fa5](https://github.com/awslabs/iot-app-kit/commit/e341fa511cfec0630ec13b0dba22981b7307c6be))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/react-components bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/related-table bumped from 10.0.0 to 10.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 10.0.0 to 10.1.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 10.0.0 to 10.1.0

## [10.0.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.15.0...scene-composer-v10.0.0) (2024-02-28)


### ⚠ BREAKING CHANGES

* **composer:** remove deprecated and internal interfaces from public

### Features

* adding docker setup for scene-composer ui tests ([3db0c9b](https://github.com/awslabs/iot-app-kit/commit/3db0c9bf11dcba40782241f3886cd79f1912f00f))
* **composer:** createDynamicScene util ([0b3b80c](https://github.com/awslabs/iot-app-kit/commit/0b3b80c0e62176c76411fe07718df7ef6849ef3a))
* **composer:** save scene level data to scene root entity ([6cabfb5](https://github.com/awslabs/iot-app-kit/commit/6cabfb55de10004b1f0314cb7be931ef3969b09e))
* **composer:** show delete confirmation modal for dynamic scene ([fdc9ef1](https://github.com/awslabs/iot-app-kit/commit/fdc9ef16df97d1528b3f28c96470e513bb9722a7))
* **composer:** support showing flash message ([da7281a](https://github.com/awslabs/iot-app-kit/commit/da7281a84e47325c56071850f6ea49a6eed73233))
* **scene composer:** adding data-testid to improve e2e test ([1e5ab86](https://github.com/awslabs/iot-app-kit/commit/1e5ab863f89fcdf66aa7b4c0e3b0f5c77367411e))
* **scene composer:** setting up 3D test harness ([df62eef](https://github.com/awslabs/iot-app-kit/commit/df62eefd048a66f327070bc8c90b4c9b964de26e))
* **scene-composer:** enable accelerated raycasting for 3D Tiles ([84d2ce4](https://github.com/awslabs/iot-app-kit/commit/84d2ce4783c74a3792c11009f99cfac888cd848d))
* **Tiles3D:** add Tiles3D AssetType and evaluate model type when adding a 3D model to the scene ([eec0f50](https://github.com/awslabs/iot-app-kit/commit/eec0f508caa4b1f6b2c7a84baa4f45bf4dc7195b))


### Bug Fixes

* **composer:** cannot delete scene node of a child and then its parent ([a2e140a](https://github.com/awslabs/iot-app-kit/commit/a2e140ab0ef05975e2ec1d8e36a4d68ad9087911))
* **composer:** refactor scene modal rendering ([1d797b1](https://github.com/awslabs/iot-app-kit/commit/1d797b1a6aeab60e45f8e11daf8cd97b9b21033b))
* **composer:** remove deprecated and internal interfaces from public ([07e82b4](https://github.com/awslabs/iot-app-kit/commit/07e82b42963931ddce95362f4a6cca9add6a1423))
* internal pipeline has issues with lfs, reverting ([968f950](https://github.com/awslabs/iot-app-kit/commit/968f95005c51591d7cb99af323808fd232b8d4e9))
* **scene:** update dependency for selection change use effect ([623b55b](https://github.com/awslabs/iot-app-kit/commit/623b55b016890a3e537fdae0b1d39ec665603834))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/react-components bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/related-table bumped from 9.15.0 to 10.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.15.0 to 10.0.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.15.0 to 10.0.0

## [9.15.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.14.0...scene-composer-v9.15.0) (2024-02-01)


### Features

* **scene:** add asset type filter option for browser callback ([f65d4f0](https://github.com/awslabs/iot-app-kit/commit/f65d4f0d5429dfa25b90208d924bfe3c3e3640df))


### Bug Fixes

* **composer:** update property string length limit to 2048 ([a3cb800](https://github.com/awslabs/iot-app-kit/commit/a3cb8009d8547351449bac7c121e67d66971a708))
* **scene-composer:** 3D model selection broken on first click ([7ee722a](https://github.com/awslabs/iot-app-kit/commit/7ee722ab3cf1aa4a353e7b05c1a9b53f3ac00c88))
* **scene-composer:** fix scene hierarchy in viewer mode ([c8c70fd](https://github.com/awslabs/iot-app-kit/commit/c8c70fdac04d8aab12f5a6a3f19303cb6754d083))
* **scene-composer:** fix sub-model selection ([0a11b9a](https://github.com/awslabs/iot-app-kit/commit/0a11b9a391767fea2d255509ac9377889e812a5c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/react-components bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/related-table bumped from 9.14.0 to 9.15.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.14.0 to 9.15.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.14.0 to 9.15.0

## [9.14.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.13.0...scene-composer-v9.14.0) (2024-01-18)


### Miscellaneous Chores

* **scene-composer:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/react-components bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/related-table bumped from 9.13.0 to 9.14.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.13.0 to 9.14.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.13.0 to 9.14.0

## [9.13.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.12.0...scene-composer-v9.13.0) (2024-01-05)


### Miscellaneous Chores

* **scene-composer:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/react-components bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/related-table bumped from 9.12.0 to 9.13.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.12.0 to 9.13.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.12.0 to 9.13.0

## [9.12.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.11.0...scene-composer-v9.12.0) (2023-12-18)


### Features

* **scene:** move add ground plane to settings ([3b0c59b](https://github.com/awslabs/iot-app-kit/commit/3b0c59b13243892a657f8ed975448babe7a6caec))
* **scene:** textures for backgrounds and planes ([0b2104a](https://github.com/awslabs/iot-app-kit/commit/0b2104ae299f899b88ac4d77696b075793ceed1d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/react-components bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/related-table bumped from 9.11.0 to 9.12.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.11.0 to 9.12.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.11.0 to 9.12.0

## [9.11.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.10.0...scene-composer-v9.11.0) (2023-12-07)


### Miscellaneous Chores

* **scene-composer:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/react-components bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/related-table bumped from 9.10.0 to 9.11.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.10.0 to 9.11.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.10.0 to 9.11.0

## [9.10.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.9.1...scene-composer-v9.10.0) (2023-12-07)


### Bug Fixes

* **composer:** trigger onSceneLoaded after dynamic scene is loaded ([4c9453a](https://github.com/awslabs/iot-app-kit/commit/4c9453a12211a878a850d71eee7cb8bd3d4a5fe3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/react-components bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/related-table bumped from 9.9.1 to 9.10.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.9.1 to 9.10.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.9.1 to 9.10.0

## [9.9.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.9.0...scene-composer-v9.9.1) (2023-12-06)


### Miscellaneous Chores

* **scene-composer:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/react-components bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/related-table bumped from 9.9.0 to 9.9.1
    * @iot-app-kit/source-iottwinmaker bumped from 9.9.0 to 9.9.1
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.9.0 to 9.9.1

## [9.9.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.8.0...scene-composer-v9.9.0) (2023-12-05)


### Bug Fixes

* **composer:** improve load sub model latency ([23ad9ad](https://github.com/awslabs/iot-app-kit/commit/23ad9ada3b89295b66738cdfc297dc6e0bf72a03))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/react-components bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/related-table bumped from 9.8.0 to 9.9.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.8.0 to 9.9.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.8.0 to 9.9.0

## [9.8.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.7.0...scene-composer-v9.8.0) (2023-11-25)


### Miscellaneous Chores

* **scene-composer:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/react-components bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/related-table bumped from 9.7.0 to 9.8.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.7.0 to 9.8.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.7.0 to 9.8.0

## [9.7.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.6.0...scene-composer-v9.7.0) (2023-11-21)


### Bug Fixes

* **composer:** cannot delete node entity with child ([a7976bb](https://github.com/awslabs/iot-app-kit/commit/a7976bb55afbc83d0fd3848ef1eb1fd6a81dedbc))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/react-components bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/related-table bumped from 9.6.0 to 9.7.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.6.0 to 9.7.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.6.0 to 9.7.0

## [9.6.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.5.0...scene-composer-v9.6.0) (2023-11-16)


### Features

* **composer:** enable auto query feature ([661af11](https://github.com/awslabs/iot-app-kit/commit/661af1188f690d6b2a33f26a6105b5fecdc539b9))
* **scene:** add ground plane button ([c282c41](https://github.com/awslabs/iot-app-kit/commit/c282c41e5f96c403a7cbbea95dc5a759ab2d4193))


### Bug Fixes

* **composer:** bug fixes for dynamic scene ([10046da](https://github.com/awslabs/iot-app-kit/commit/10046daf2ef3ea2d161321a7794d019db3ccd76f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/react-components bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/related-table bumped from 9.5.0 to 9.6.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.5.0 to 9.6.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.5.0 to 9.6.0

## [9.5.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.4.0...scene-composer-v9.5.0) (2023-11-08)


### Features

* **scene-composer:** support tag occlusion ([3764013](https://github.com/awslabs/iot-app-kit/commit/376401335e6c4d4646bfc49260e35a41a9a43646))


### Bug Fixes

* **composer:** get entityBinding in different query ([b4e4a22](https://github.com/awslabs/iot-app-kit/commit/b4e4a22cebeeb39027052c47bb8647bae836d3c2))
* **composer:** persist new dynamic node world transform ([cb6704f](https://github.com/awslabs/iot-app-kit/commit/cb6704f5b8767bfacad8244415daa2283efd6250))
* **composer:** tag style field is empty when creating a new tag instead of info ([595147b](https://github.com/awslabs/iot-app-kit/commit/595147bc564b9599598c93059bc6ccf62b2c2b7e))
* **scene-composer:** sync tag icon from Matterport ([e0aa7a7](https://github.com/awslabs/iot-app-kit/commit/e0aa7a72db0dc1bcbc3a9c7c7ae87e4b5c061b84))
* **scene:** add overlay close button back ([24f0d94](https://github.com/awslabs/iot-app-kit/commit/24f0d9427a62ea7174983e10af75fe6f6dcb363a))
* **Scene:** animation components added at correct time behind flag ([da149cc](https://github.com/awslabs/iot-app-kit/commit/da149cc5456f841a98581be82b792f52f062b85a))
* **scene:** comment tweak ([234b703](https://github.com/awslabs/iot-app-kit/commit/234b703f8991166e831b385c2cdf6bfd8685fe2a))
* **scene:** ensure the selected overlay is always the one at front ([7a15943](https://github.com/awslabs/iot-app-kit/commit/7a15943accdbae27059e043cf8a55dda525531c1))
* **scene:** only show selected tags overlay ([20b7c57](https://github.com/awslabs/iot-app-kit/commit/20b7c578bd6b4e44bf11109e0f55f9212328b812))
* **scene:** stop scene composer from forcing dark mode on page ([40ef97b](https://github.com/awslabs/iot-app-kit/commit/40ef97b4a6b2baa376fd129991b4672369631323))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/react-components bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/related-table bumped from 9.4.0 to 9.5.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.4.0 to 9.5.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.4.0 to 9.5.0

## [9.4.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.3.0...scene-composer-v9.4.0) (2023-10-26)


### Features

* **component:** allow disable/enable layer auto refresh ([5278b9c](https://github.com/awslabs/iot-app-kit/commit/5278b9c8eafb01510484b75cebd10e05bb921421))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/react-components bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/related-table bumped from 9.3.0 to 9.4.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.3.0 to 9.4.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.3.0 to 9.4.0

## [9.3.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.2.0...scene-composer-v9.3.0) (2023-10-26)


### Features

* **component:** utils to handle light component in entity ([26a1494](https://github.com/awslabs/iot-app-kit/commit/26a1494e5787a54f1292408f69ecac514100704e))
* **composer:** append scene node action creates entity for dynamic scene ([4ebe88a](https://github.com/awslabs/iot-app-kit/commit/4ebe88a6db092e4943db702c90961cf57fb100a3))
* **composer:** support tag custom icon in entity ([dc07a1d](https://github.com/awslabs/iot-app-kit/commit/dc07a1dc3a2634b4d62de334b42499cd2e6f3060))
* **composer:** utils to handle subModelRef component in entity ([d425c57](https://github.com/awslabs/iot-app-kit/commit/d425c5706790575dda50be733fd5a618cbafff0e))
* **scene:** add fog settings to scene ([78c6e75](https://github.com/awslabs/iot-app-kit/commit/78c6e756ff7acfeace2be2473ae6c4defcb94af6))
* **scene:** enable scene backgrounds ([e630ff2](https://github.com/awslabs/iot-app-kit/commit/e630ff21ef69010e1ac1cac705460e581c0310eb))


### Bug Fixes

* **composer:** custom tag rendered slightly off the center ([0cecac1](https://github.com/awslabs/iot-app-kit/commit/0cecac14f2ff201f3f5eb16446b7aab43acf10ce))
* **composer:** update Polaris package version ([592c435](https://github.com/awslabs/iot-app-kit/commit/592c4359e325eb4149a0f872b30f87a0305feb5b))
* **scene composer:** restoring dark mode in stotybook ([94e9ac4](https://github.com/awslabs/iot-app-kit/commit/94e9ac4e48762d5389c1fead82938d5ed90857a3))
* **scene composer:** show correct Icon field for tags with Custom Style ([a2239b8](https://github.com/awslabs/iot-app-kit/commit/a2239b86f31fcfcf138a4e7b2305f80958baa641))
* **scene-composer:** add scroll bar to show all tag icons by default ([15c5dee](https://github.com/awslabs/iot-app-kit/commit/15c5deef876eb6af9d4332f3944aeead31412a59))
* **scene-composer:** restore the grid line colors ([be53320](https://github.com/awslabs/iot-app-kit/commit/be53320c4b553f26d3470dd9bf701fa45b85fd7c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/react-components bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/related-table bumped from 9.2.0 to 9.3.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.2.0 to 9.3.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.2.0 to 9.3.0

## [9.2.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.1.0...scene-composer-v9.2.0) (2023-10-17)


### Features

* set tagStyle flag to true for viewer ([af5357f](https://github.com/awslabs/iot-app-kit/commit/af5357f53e59ed227319c0a37061b4b07b62584e))


### Bug Fixes

* **composer:** floating toolbar orientation dependent on screen size ([228037d](https://github.com/awslabs/iot-app-kit/commit/228037da8351499be142b75fc6b62aefc9047ee2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/react-components bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/related-table bumped from 9.1.0 to 9.2.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.1.0 to 9.2.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.1.0 to 9.2.0

## [9.1.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v9.0.0...scene-composer-v9.1.0) (2023-10-13)


### Features

* **composer:** convert nodes to entities UI ([43f5e66](https://github.com/awslabs/iot-app-kit/commit/43f5e663efb0e517a2f1e0badb369a43438b0675))
* **composer:** utils to handle model shader component in entity ([95a4be6](https://github.com/awslabs/iot-app-kit/commit/95a4be668b51d413589b16b7edde67fdd40375d1))
* **scene composer:** fix for icon rules and save icon metadata ([0ac8508](https://github.com/awslabs/iot-app-kit/commit/0ac85082391d34731fafa73f826309e66d9f6000))


### Bug Fixes

* **composer:** split overlay content into parts ([328a33c](https://github.com/awslabs/iot-app-kit/commit/328a33c0fc3ad80666476099d9e49768fca03b2b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/react-components bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/related-table bumped from 9.0.0 to 9.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 9.0.0 to 9.1.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 9.0.0 to 9.1.0

## [9.0.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v8.1.1...scene-composer-v9.0.0) (2023-10-10)


### Features

* **composer:** add utils to convert all nodes to entities ([4e305d4](https://github.com/awslabs/iot-app-kit/commit/4e305d4841a10d962c0278f60858297297146570))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/react-components bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/related-table bumped from 8.1.1 to 9.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 8.1.1 to 9.0.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 8.1.1 to 9.0.0

## [8.1.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v8.1.0...scene-composer-v8.1.1) (2023-10-05)


### Bug Fixes

* **camera:** stop camera view inspector panel from overwriting changes unexpectedly ([37a8122](https://github.com/awslabs/iot-app-kit/commit/37a8122b54ef95f7dca56ad341a5183fd11a05f8))
* **composer:** add aria labels to buttons in hierarchy panel ([24c8c30](https://github.com/awslabs/iot-app-kit/commit/24c8c30594a0961509079bd942763d22d0d9ccdf))
* fix bug, update test ([24c8c30](https://github.com/awslabs/iot-app-kit/commit/24c8c30594a0961509079bd942763d22d0d9ccdf))
* **scene:** fix transform controls being clickable ([b846730](https://github.com/awslabs/iot-app-kit/commit/b846730c0cb4e605d047f6421b0c28472b911cf7))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/react-components bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/related-table bumped from 8.1.0 to 8.1.1
    * @iot-app-kit/source-iottwinmaker bumped from 8.1.0 to 8.1.1
  * devDependencies
    * eslint-config-iot-app-kit bumped from 8.1.0 to 8.1.1

## [8.1.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v8.0.2...scene-composer-v8.1.0) (2023-10-04)


### Features

* **composer:** add keyboard nav to floating toolbar ([efd375f](https://github.com/awslabs/iot-app-kit/commit/efd375fc7ba23fd7fe7617783f45a140e464ccdb))
* **composer:** utils to handle camera component in entity ([7ad3bf5](https://github.com/awslabs/iot-app-kit/commit/7ad3bf51a7d548edc242a6d2c9de13167ec2d4bb))
* **composer:** utils to handle motion indicator component in entity ([4a1a8b4](https://github.com/awslabs/iot-app-kit/commit/4a1a8b4a972670e56363f445aed7038253e5192d))
* **dynamic scene:** crud functionalities for model ref ([2314926](https://github.com/awslabs/iot-app-kit/commit/2314926f385c44f76243223839f9d3d4f6325c51))
* **scene composer:** icon picker rule changes ([e126b53](https://github.com/awslabs/iot-app-kit/commit/e126b53371a0c3a03a4e7ff1d48f104c9b99c395))


### Bug Fixes

* **composer:** bug fixes for dynamic scene ([2f3b396](https://github.com/awslabs/iot-app-kit/commit/2f3b396bc9aa41c2e4df17b0d9a47863db97f211))
* **composer:** remove useCallback from menu event handlers ([0a7c133](https://github.com/awslabs/iot-app-kit/commit/0a7c13336760f2f0548e8c902a95086fb4d27be4))
* **icon rules:** align icon-picker layout with target editor ([536f391](https://github.com/awslabs/iot-app-kit/commit/536f3910d2f50cfa41a80e98b43a43f59d0a249f))
* **scene:** fix camera returning to last target on mode change ([08e608d](https://github.com/awslabs/iot-app-kit/commit/08e608dfffdbdb990beb421ead3a504da607d50f))
* **scene:** remove transform controls from raycast ([9cd9861](https://github.com/awslabs/iot-app-kit/commit/9cd9861768fb538726f22541aa54ef05c0f4adf9))
* update HistoryItemGroup snap ([ff64273](https://github.com/awslabs/iot-app-kit/commit/ff64273d2ec48609a4edb2156a2ea9e4bb04a1b4))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/react-components bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/related-table bumped from 8.0.2 to 8.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 8.0.2 to 8.1.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 8.0.2 to 8.1.0

## [8.0.2](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v8.0.1...scene-composer-v8.0.2) (2023-09-30)


### Miscellaneous Chores

* **scene-composer:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/react-components bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/related-table bumped from 8.0.1 to 8.0.2
    * @iot-app-kit/source-iottwinmaker bumped from 8.0.1 to 8.0.2
  * devDependencies
    * eslint-config-iot-app-kit bumped from 8.0.1 to 8.0.2

## [8.0.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v8.0.0...scene-composer-v8.0.1) (2023-09-30)


### Miscellaneous Chores

* **scene-composer:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/react-components bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/related-table bumped from 8.0.0 to 8.0.1
    * @iot-app-kit/source-iottwinmaker bumped from 8.0.0 to 8.0.1
  * devDependencies
    * eslint-config-iot-app-kit bumped from 8.0.0 to 8.0.1

## [8.0.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v7.5.0...scene-composer-v8.0.0) (2023-09-30)


### Features

* **composer:** add a11y color picker ([e768a88](https://github.com/awslabs/iot-app-kit/commit/e768a884118768b5080e745ef8113a344dd0d80e))


### Bug Fixes

* **composer:** add aria labels to rules panel ([ff78ab0](https://github.com/awslabs/iot-app-kit/commit/ff78ab0831170be7c5bad53cba0c903d20034aaf))
* **composer:** debounce component update to reduce UpdateEntity error ([4f13db1](https://github.com/awslabs/iot-app-kit/commit/4f13db18ae134c7a95c50ed1d855e9e977f59539))
* **composer:** lock 3d tiles lib to working version ([f719bc4](https://github.com/awslabs/iot-app-kit/commit/f719bc4964e454db16d6c746548b37c092692ca3))
* update component name ([e768a88](https://github.com/awslabs/iot-app-kit/commit/e768a884118768b5080e745ef8113a344dd0d80e))
* update package-lock.json ([e768a88](https://github.com/awslabs/iot-app-kit/commit/e768a884118768b5080e745ef8113a344dd0d80e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/react-components bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/related-table bumped from 7.5.0 to 8.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.5.0 to 8.0.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 7.5.0 to 8.0.0

## [7.5.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v7.4.0...scene-composer-v7.5.0) (2023-09-26)


### Miscellaneous Chores

* **scene-composer:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/react-components bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/related-table bumped from 7.4.0 to 7.5.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.4.0 to 7.5.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 7.4.0 to 7.5.0

## [7.4.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v7.3.1...scene-composer-v7.4.0) (2023-09-25)


### Features

* **composer:** render tags from layer ([d9c5191](https://github.com/awslabs/iot-app-kit/commit/d9c519114d3e39c3913eb32b23984f8204b756d8))
* **composer:** support sync matterport tag as entities ([7db178a](https://github.com/awslabs/iot-app-kit/commit/7db178a4aee74cbd299dc115c7cf3786dc376800))
* **dynamic scenes:** save node updates to entities ([0bb2445](https://github.com/awslabs/iot-app-kit/commit/0bb2445fb39659ca970c51319a42cd2d0ff95360))
* **dynamic scenes:** update entities using dynamic scenes ([8eee582](https://github.com/awslabs/iot-app-kit/commit/8eee582e039a5cb2a3e25c81f822a4ecca95672c))
* **first Person:** proof of using pointer lock for a first person view ([391eddd](https://github.com/awslabs/iot-app-kit/commit/391edddd5ab3c56be2e394aec06346dfbc29b776))
* **propertyName:** add copy button and textarea ([7c0eaf4](https://github.com/awslabs/iot-app-kit/commit/7c0eaf432e40e25a5319a29e7546442d81e8c3dc))
* **scene composer:** added icon picker changes ([8ca53b8](https://github.com/awslabs/iot-app-kit/commit/8ca53b8552f9eb09f107ea43d983a6b47f19fa88))
* **TM-source:** add entity APIs to SceneMetadataModule ([1a91084](https://github.com/awslabs/iot-app-kit/commit/1a910844692aa30bbd4b9d1920d415378bcad130))


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
* **matterport:** fix zoom to tag ([49a04f8](https://github.com/awslabs/iot-app-kit/commit/49a04f81bc464d20798f219f77f325bde74ad1f6))
* **scene composer:** fix for missing grid ([2a4c4c8](https://github.com/awslabs/iot-app-kit/commit/2a4c4c8b194a2eceebe73dc87d24215836be4a99))
* **scene composer:** removing custom grid line colors ([632f7a2](https://github.com/awslabs/iot-app-kit/commit/632f7a210a80281b1d3c53b0a5de168f8cae9d10))
* **scene tags:** fix anchor stems not triggering onWidgetClick ([6945512](https://github.com/awslabs/iot-app-kit/commit/6945512eadbdd8d8bc09977ecce7511fbf136311))
* **tools-iottwinmaker:** update dashboard role to include execute query api ([b63d053](https://github.com/awslabs/iot-app-kit/commit/b63d0537ce247724d0dd73d8d0d1ffba20e0ab5a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/react-components bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/related-table bumped from 7.3.1 to 7.4.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.3.1 to 7.4.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 7.3.1 to 7.4.0

## [7.3.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v7.3.0...scene-composer-v7.3.1) (2023-08-24)


### Miscellaneous Chores

* **scene-composer:** Synchronize iot-app-kit versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/react-components bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/related-table bumped from 7.3.0 to 7.3.1
    * @iot-app-kit/source-iottwinmaker bumped from 7.3.0 to 7.3.1
  * devDependencies
    * eslint-config-iot-app-kit bumped from 7.3.0 to 7.3.1

## [7.3.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v7.2.1...scene-composer-v7.3.0) (2023-08-23)


### Features

* **TM-source:** add property value query ([21091d9](https://github.com/awslabs/iot-app-kit/commit/21091d9e3bb19a2c6181f2eeb1354ce2fa31ca45))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/react-components bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/related-table bumped from 7.2.1 to 7.3.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.2.1 to 7.3.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 7.2.1 to 7.3.0

## [7.2.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v7.2.0...scene-composer-v7.2.1) (2023-08-18)


### Bug Fixes

* **scene composer:** fix spacing issue between elements ([b65ebdc](https://github.com/awslabs/iot-app-kit/commit/b65ebdc3fecd4911a6e5fbc664d1d0bdf5524ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/react-components bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/related-table bumped from 7.2.0 to 7.2.1
    * @iot-app-kit/source-iottwinmaker bumped from 7.2.0 to 7.2.1
  * devDependencies
    * eslint-config-iot-app-kit bumped from 7.2.0 to 7.2.1

## [7.2.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v7.1.0...scene-composer-v7.2.0) (2023-08-17)


### Features

* **composer:** auto query for indicator and overlay ([b597c6f](https://github.com/awslabs/iot-app-kit/commit/b597c6f7606ead54749e93e0be2436430155b634))
* **composer:** auto query support for Model Shader ([ff0bbe3](https://github.com/awslabs/iot-app-kit/commit/ff0bbe3a9cb1f6c8a91cf6c4f531b1811eee076c))
* **composer:** implement useBindingData and integrate to Tag ([e694433](https://github.com/awslabs/iot-app-kit/commit/e6944332e8fcc516ecdd3b6978725691a089f1ca))
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

* **composer:** fix issue displaying 0 in overlay ([a0bc01d](https://github.com/awslabs/iot-app-kit/commit/a0bc01dfe327509345ec74a61149a6a2d6e48a6a))
* **composer:** fix warning and cached onChange ([5a2c182](https://github.com/awslabs/iot-app-kit/commit/5a2c1824736bfdd05d1dd1925da8a0408c7ca860))
* **data overlay:** add onWidgetClick and onSelectionChange event support to data overlays ([b3f4f9d](https://github.com/awslabs/iot-app-kit/commit/b3f4f9d33e61190933323f283fe0fe0552ab0384))
* **scene composer:** fix for broken rule panel ([c5e071d](https://github.com/awslabs/iot-app-kit/commit/c5e071d6c5c0e73eaec3e47a98e6d3e3f0cc7dc3))
* **scene composer:** fix overlay arrow clickable space ([4cae31f](https://github.com/awslabs/iot-app-kit/commit/4cae31fb04d38852ed667ab5620d4920cfd83769))
* **Tag style:** custom color to support icon rules ([dd3bbee](https://github.com/awslabs/iot-app-kit/commit/dd3bbee9622eb0bda3a29ab28b920b6d798b4cb2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/react-components bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/related-table bumped from 7.1.0 to 7.2.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.1.0 to 7.2.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 7.1.0 to 7.2.0

## [7.1.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v7.0.0...scene-composer-v7.1.0) (2023-07-28)


### Features

* **composer:** add hook to convert data bindings to queries ([1e68022](https://github.com/awslabs/iot-app-kit/commit/1e6802206312926efbbf2e15fd48379afbfc4cd9))


### Bug Fixes

* **scene-composer:** fix ability to click on tags, revert raycaster disable on scroll ([caed238](https://github.com/awslabs/iot-app-kit/commit/caed238ed12da29bd487caf44b895ce7f7f024bf))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/react-components bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/related-table bumped from 7.0.0 to 7.1.0
    * @iot-app-kit/source-iottwinmaker bumped from 7.0.0 to 7.1.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 7.0.0 to 7.1.0

## [7.0.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v6.3.1...scene-composer-v7.0.0) (2023-07-25)


### ⚠ BREAKING CHANGES

* **composer:** use binding provider from TM-source

### Features

* **composer:** integrate scene viewer with TimeSync viewport ([6c92201](https://github.com/awslabs/iot-app-kit/commit/6c92201aaa10c453c81cb6bf8ced349c55b47a19))
* **composer:** use binding provider from TM-source ([61f6a54](https://github.com/awslabs/iot-app-kit/commit/61f6a5456aae9cb2ae826e3c2d700e0bba69c6af))
* **scene composer:** color picker changes ([0138b0a](https://github.com/awslabs/iot-app-kit/commit/0138b0adb20039e77dc4ac0f838a50d742d24339))
* **TM-source:** add entity data binding provider ([d1c459d](https://github.com/awslabs/iot-app-kit/commit/d1c459d4e897171922d6821da01dcbae6fd000da))
* **TM-source:** flag static property data binding ([eeeaecd](https://github.com/awslabs/iot-app-kit/commit/eeeaecdadd55977633ae884607e2f4e56e467044))


### Bug Fixes

* **composer:** fix infinite storybook component update ([40fab0a](https://github.com/awslabs/iot-app-kit/commit/40fab0a96bf1a0396fa0a36aa67c059ed8570cfc))
* **scene-composer:** update raycaster in OrbitControls, ignore undefined faces, disable on scroll ([011464e](https://github.com/awslabs/iot-app-kit/commit/011464e702f46b9237b8df1226fa862c073605c0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/react-components bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/related-table bumped from 6.3.1 to 7.0.0
    * @iot-app-kit/source-iottwinmaker bumped from 6.3.1 to 7.0.0
  * devDependencies
    * eslint-config-iot-app-kit bumped from 6.3.1 to 7.0.0

## [6.3.1](https://github.com/awslabs/iot-app-kit/compare/root-v6.3.0...root-v6.3.1) (2023-06-28)

## Fix
* **Emergency revert**
## [6.3.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v6.2.0...scene-composer-v6.3.0) (2023-06-23)


### Features

* **3D knowledge Graph:** selecting entity binding triggers camera movement ([f122f1a](https://github.com/awslabs/iot-app-kit/commit/f122f1a3a7d7af14060099263208801af3738ac3))
* **3D Knowledge Graph:** update DataBinding to EntityBinding ([ca10d1b](https://github.com/awslabs/iot-app-kit/commit/ca10d1b3319f8c10b7239080310e4b0ad4244775))


### Bug Fixes

* **scene composer:** reverting breaking changes from dependabot & setting up ignores ([831d1d7](https://github.com/awslabs/iot-app-kit/commit/831d1d76e8f7f36bd8129eaa7491a33516a57b1c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 6.2.0 to 6.3.0
    * @iot-app-kit/related-table bumped from 6.2.0 to 6.3.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 6.2.0 to 6.3.0
    * eslint-config-iot-app-kit bumped from 6.2.0 to 6.3.0

## [6.2.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v6.1.0...scene-composer-v6.2.0) (2023-06-07)


### Features

* **scene composer:** fix autosuggestvalue issues in ValueDataBindingBuilder ([0f32e73](https://github.com/awslabs/iot-app-kit/commit/0f32e7367f01b09d0f81eaf7580e770fcf523a2f))


### Bug Fixes

* **scene composer:** sets up refs to track visibility of data overlay & parent ([fad2208](https://github.com/awslabs/iot-app-kit/commit/fad22087312570641809ed4b1662ae053a809f02))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 6.1.0 to 6.2.0
    * @iot-app-kit/related-table bumped from 6.1.0 to 6.2.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 6.1.0 to 6.2.0
    * eslint-config-iot-app-kit bumped from 6.1.0 to 6.2.0

## [6.1.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v6.0.0...scene-composer-v6.1.0) (2023-06-06)


### Features

* **scene composer:** fixed entity data binding data format ([64e33fa](https://github.com/awslabs/iot-app-kit/commit/64e33fa582512868a74d1cafad1a0d734065878c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 6.0.0 to 6.1.0
    * @iot-app-kit/related-table bumped from 6.0.0 to 6.1.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 6.0.0 to 6.1.0
    * eslint-config-iot-app-kit bumped from 6.0.0 to 6.1.0

## [6.0.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.9.0...scene-composer-v6.0.0) (2023-06-05)


### Features

* **composer:** support enhanced editing in Matterport scene ([933deb7](https://github.com/awslabs/iot-app-kit/commit/933deb752d11ab9269b48eccff9348c771f22019))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.9.0 to 6.0.0
    * @iot-app-kit/related-table bumped from 5.9.0 to 6.0.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.9.0 to 6.0.0
    * eslint-config-iot-app-kit bumped from 5.9.0 to 6.0.0

## [5.9.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.8.1...scene-composer-v5.9.0) (2023-06-01)


### Features

* **3D Knowledge Graph:** add scene node highlighting ([ef5c71c](https://github.com/awslabs/iot-app-kit/commit/ef5c71c7d54f81c85b61f4a10847957669c1bdfb))
* **3D Knowledge Graph:** create function for duplicate code ([4c239d8](https://github.com/awslabs/iot-app-kit/commit/4c239d85211f2609fc5f312a3c725c881cd187f5))
* **3D Knowledge Graph:** fix lint after rebase ([e016ff7](https://github.com/awslabs/iot-app-kit/commit/e016ff747a156d48043ec9ed5b1aa2cfbb8b58a2))
* **3D Knowledge Graph:** fix type import ([e1edc38](https://github.com/awslabs/iot-app-kit/commit/e1edc38905c5cc299d207568697b1d099791df6b))
* **3D Knowledge Graph:** improve unit tests ([11cd450](https://github.com/awslabs/iot-app-kit/commit/11cd45022198ed4b1f69623080237617557f2136))
* **3D Knowledge Graph:** improve useStore usage and unit tests ([f10ffb2](https://github.com/awslabs/iot-app-kit/commit/f10ffb2a72a1e5cb3bf1dbf9f1e0bc2e9fdd35d9))
* **3D Knowledge Graph:** use updated entity binding definition ([97d6d91](https://github.com/awslabs/iot-app-kit/commit/97d6d9104fb9e28dc23b1c6850b43f463a0fcb17))
* fix lint error for scene composer ([924547f](https://github.com/awslabs/iot-app-kit/commit/924547f788f260efa3cd39d36ede79b6c00f4f23))
* **scene composer:** entity data binding UI changes and unit tests ([fc17202](https://github.com/awslabs/iot-app-kit/commit/fc17202c73a28a8670a8e4bc028eee86ac1a4ed1))
* **scene composer:** entity data binding UI changes and unit tests ([f1f81b8](https://github.com/awslabs/iot-app-kit/commit/f1f81b8e9d11734836582071d4583113af5510a2))
* **scene composer:** fixed entity search bug using free text ([7417c15](https://github.com/awslabs/iot-app-kit/commit/7417c15f09b3b7b2c1994d1ee13aeb98e8506779))


### Bug Fixes

* **composer:** unsubscribe to queries when unmounting ([15fe82e](https://github.com/awslabs/iot-app-kit/commit/15fe82edf847cf024ab8e987ff513d4726cb2138))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.8.1 to 5.9.0
    * @iot-app-kit/related-table bumped from 5.8.1 to 5.9.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.8.1 to 5.9.0
    * eslint-config-iot-app-kit bumped from 5.8.1 to 5.9.0

## [5.8.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.8.0...scene-composer-v5.8.1) (2023-05-19)


### Bug Fixes

* **composer:** click events for tag and overlay ([2bf7b13](https://github.com/awslabs/iot-app-kit/commit/2bf7b13fc2eccc1206eb9455d372d84c0a886915))
* **composer:** error handling for Matterport scene ([24ca493](https://github.com/awslabs/iot-app-kit/commit/24ca4932457f4605f05af98bb13294143d15371a))
* **scene composer:** modifying auto collapse to only apply to viewer ([aaf6338](https://github.com/awslabs/iot-app-kit/commit/aaf63384b7d24b731a76fec10b8372110173470e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.8.0 to 5.8.1
    * @iot-app-kit/related-table bumped from 5.8.0 to 5.8.1
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.8.0 to 5.8.1
    * eslint-config-iot-app-kit bumped from 5.8.0 to 5.8.1

## [5.8.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.7.0...scene-composer-v5.8.0) (2023-05-18)


### Features

* **3dkg:** added 3dkg changes for entity data binding ([4db11a6](https://github.com/awslabs/iot-app-kit/commit/4db11a63a6fb1ef2b3dd1cc5682a64e1417b12da))
* **GraphVisualization:** graph data visualizer ([13e004a](https://github.com/awslabs/iot-app-kit/commit/13e004a3c9256cc20af1e49dd52737b17ae7078b))


### Bug Fixes

* **composer:** click on overlay causing camera to follow mouse ([6cbd5f5](https://github.com/awslabs/iot-app-kit/commit/6cbd5f5d53cf8b58ba5d4d7536acd9acd6ac7ad1))
* **composer:** close overlay auto select attached tag ([5a52ae1](https://github.com/awslabs/iot-app-kit/commit/5a52ae18e4d37135570765a12306bbece3655eb8))
* **scene composer:** cleanup for polaris css imports & moving interface to component file ([d244eb5](https://github.com/awslabs/iot-app-kit/commit/d244eb525a3b2ae8862affa0141673351fd850ee))
* **scene composer:** collapse scene panels on scene load ([0841e64](https://github.com/awslabs/iot-app-kit/commit/0841e6409b7bea5c516022c09cc9e1a936bbf81b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.7.0 to 5.8.0
    * @iot-app-kit/related-table bumped from 5.7.0 to 5.8.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.7.0 to 5.8.0
    * eslint-config-iot-app-kit bumped from 5.7.0 to 5.8.0

## [5.7.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.6.0...scene-composer-v5.7.0) (2023-05-02)


### Features

* **composer:** add data binding component ([db33d28](https://github.com/awslabs/iot-app-kit/commit/db33d28e3910ea94718dc15c54c8f83648c8cd22))
* **composet:** support partial data binding ([72b561e](https://github.com/awslabs/iot-app-kit/commit/72b561e5594975d01b702f7a7b9e85c413b50534))


### Bug Fixes

* **CrashOnRemount:** scene-composer doesn't crash when remounted now ([79f2f77](https://github.com/awslabs/iot-app-kit/commit/79f2f779aa2b0f85492221508fe0579c963167e4))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.6.0 to 5.7.0
    * @iot-app-kit/related-table bumped from 5.6.0 to 5.7.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.6.0 to 5.7.0
    * eslint-config-iot-app-kit bumped from 5.6.0 to 5.7.0

## [5.6.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.5.2...scene-composer-v5.6.0) (2023-04-20)


### Features

* **composer:** enable data overlay, tag resize, and matterport features ([908be39](https://github.com/awslabs/iot-app-kit/commit/908be39057a86011b3f3aaa7f82098d2033471be))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.5.2 to 5.6.0
    * @iot-app-kit/related-table bumped from 5.5.2 to 5.6.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.5.2 to 5.6.0
    * eslint-config-iot-app-kit bumped from 5.5.2 to 5.6.0

## [5.5.2](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.5.1...scene-composer-v5.5.2) (2023-04-19)


### Bug Fixes

* **composer:** adding widget fix for 3d tiles ([989ec4c](https://github.com/awslabs/iot-app-kit/commit/989ec4c09a2194b38566b1a8665582d8cc65c986))
* **composer:** fix viewCursorWidget for 3D tiles and made cursor size dynamic ([0ef2563](https://github.com/awslabs/iot-app-kit/commit/0ef2563dd6da80e06a8f62ce9a64b85db0a10974))
* **composer:** matterport integration bug fixes ([701531f](https://github.com/awslabs/iot-app-kit/commit/701531fc222cc6fa363d5f292d31ee739990f9cb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.5.1 to 5.5.2
    * @iot-app-kit/related-table bumped from 5.5.1 to 5.5.2
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.5.1 to 5.5.2
    * eslint-config-iot-app-kit bumped from 5.5.1 to 5.5.2

## [5.5.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.5.0...scene-composer-v5.5.1) (2023-04-14)


### Miscellaneous Chores

* **scene-composer:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.5.0 to 5.5.1
    * @iot-app-kit/related-table bumped from 5.5.0 to 5.5.1
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.5.0 to 5.5.1
    * eslint-config-iot-app-kit bumped from 5.5.0 to 5.5.1

## [5.5.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.4.0...scene-composer-v5.5.0) (2023-04-13)


### Bug Fixes

* **754:** tests importing invalid import from ThreeJS and suppressing with lint rules ([876d336](https://github.com/awslabs/iot-app-kit/commit/876d33614d66042d2f6e71ebe0ea740dce79dd86))
* **composer:** update overlay and settings UI ([a213114](https://github.com/awslabs/iot-app-kit/commit/a213114bf758f0146007888fd05ad498c946ed32))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.4.0 to 5.5.0
    * @iot-app-kit/related-table bumped from 5.4.0 to 5.5.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.4.0 to 5.5.0
    * eslint-config-iot-app-kit bumped from 5.4.0 to 5.5.0

## [5.4.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.3.0...scene-composer-v5.4.0) (2023-04-12)


### Miscellaneous Chores

* **scene-composer:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.3.0 to 5.4.0
    * @iot-app-kit/related-table bumped from 5.3.0 to 5.4.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.3.0 to 5.4.0
    * eslint-config-iot-app-kit bumped from 5.3.0 to 5.4.0

## [5.3.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.2.0...scene-composer-v5.3.0) (2023-04-12)


### Features

* **Composer:** twinMaker-matterport integration ([bcfe40f](https://github.com/awslabs/iot-app-kit/commit/bcfe40fc7f4b26af7510f32b0b4986d62b6ef30b))


### Bug Fixes

* **composer:** convert to inline overlay CSS ([0f5b82a](https://github.com/awslabs/iot-app-kit/commit/0f5b82af6ebf954e6a7fa388c5946b56686b98ab))
* **composer:** fix reparent rotation and add new object issues ([2628c29](https://github.com/awslabs/iot-app-kit/commit/2628c29f285001609840d69c1c81d0d49e84d93c))
* **composer:** gate empty overlay section in inspector ([2726f10](https://github.com/awslabs/iot-app-kit/commit/2726f10d4aa26426c1650daa2852bdedba91678b))
* **composer:** Restores loading indicator for scene composer ([1f81754](https://github.com/awslabs/iot-app-kit/commit/1f817549b2c22d35e6d0d53d415354d3e3ace47f))
* **composer:** update overlay css ([3136571](https://github.com/awslabs/iot-app-kit/commit/31365712bbd7cbfc3b871710b73dc4b348ddc355))
* **composer:** update overlay visibility toggles behavior ([0e90781](https://github.com/awslabs/iot-app-kit/commit/0e907816a79befc94f56e26d501f1f94c8e6902c))
* **PeerDependencies:** react-intl should be declared as a peer dependency ([9ea3f75](https://github.com/awslabs/iot-app-kit/commit/9ea3f75ee2c4a294b0ac1f80803a916c7d9b2215))
* **ReactExample:** build issues preventing id generation for react-intl ([4339592](https://github.com/awslabs/iot-app-kit/commit/43395927587fd49852c6775d9e40921631b7bf44))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.2.0 to 5.3.0
    * @iot-app-kit/related-table bumped from 5.2.0 to 5.3.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.2.0 to 5.3.0
    * eslint-config-iot-app-kit bumped from 5.2.0 to 5.3.0

## [5.2.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.1.1...scene-composer-v5.2.0) (2023-04-05)


### Features

* **composer:** update overlay UI and flow ([5bf75aa](https://github.com/awslabs/iot-app-kit/commit/5bf75aa0a9e2128f0e41798f8cc3d94322e18888))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.1.1 to 5.2.0
    * @iot-app-kit/related-table bumped from 5.1.1 to 5.2.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.1.1 to 5.2.0
    * eslint-config-iot-app-kit bumped from 5.1.1 to 5.2.0

## [5.1.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.1.0...scene-composer-v5.1.1) (2023-04-03)


### Miscellaneous Chores

* **scene-composer:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.1.0 to 5.1.1
    * @iot-app-kit/related-table bumped from 5.1.0 to 5.1.1
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.1.0 to 5.1.1
    * eslint-config-iot-app-kit bumped from 5.1.0 to 5.1.1

## [5.1.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v5.0.0...scene-composer-v5.1.0) (2023-04-03)


### Miscellaneous Chores

* **scene-composer:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 5.0.0 to 5.1.0
    * @iot-app-kit/related-table bumped from 5.0.0 to 5.1.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 5.0.0 to 5.1.0
    * eslint-config-iot-app-kit bumped from 5.0.0 to 5.1.0

## [5.0.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v4.0.3...scene-composer-v5.0.0) (2023-03-31)


### Features

* **all:** release 4.0.3 ([2b933ba](https://github.com/awslabs/iot-app-kit/commit/2b933ba31e60666323df7bfae0e962698636a4bf))
* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* **composer:** add data overaly ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add overlay panel config editor ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add runtime tag settings change support ([eeda501](https://github.com/awslabs/iot-app-kit/commit/eeda501d456c10f61123f9c4f77618bb870816f5))
* **composer:** data binding variable support for data overlay ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data overlay editor & render markdown ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** implement add overlay from menu ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** Implement data overlay container ([#595](https://github.com/awslabs/iot-app-kit/issues/595)) ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** update TagResize feature implementation ([b8dfb46](https://github.com/awslabs/iot-app-kit/commit/b8dfb468043ff6c8b4f154c145f997c6467117ec))
* **composer:** visibility toggles for overlays in settings panel ([4fc0527](https://github.com/awslabs/iot-app-kit/commit/4fc05276aa3f55f19aa8c0792ade3deb58eef7a3))
* **EnvironmentModel:** Adding support for environment overlay ([#262](https://github.com/awslabs/iot-app-kit/issues/262)) ([0277027](https://github.com/awslabs/iot-app-kit/commit/0277027d59f232c2c8e29fac0bc53399a1eb9c1e))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* **Matterport:** Integrate Matterport Showcase Viewer into TwinMaker SceneComposer ([58236e7](https://github.com/awslabs/iot-app-kit/commit/58236e7eed7f5435480cba6ce214346a4f8d3a86))
* **OpacityFilterZero:** Setting opacity to 0 should effectively hide the object ([#342](https://github.com/awslabs/iot-app-kit/issues/342)) ([91e491b](https://github.com/awslabs/iot-app-kit/commit/91e491b45ad2e31f4e407686fbf40c8c0df9f9d0))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))
* **TwinMaker:** Add TwinMaker packages ([#252](https://github.com/awslabs/iot-app-kit/issues/252)) ([fabbe03](https://github.com/awslabs/iot-app-kit/commit/fabbe0399dd37293e99588124404c37c929f4330))


### Bug Fixes

* Allows user to hit Esc key to cancel Enhanced Editing ([#272](https://github.com/awslabs/iot-app-kit/issues/272)) ([6b73fad](https://github.com/awslabs/iot-app-kit/commit/6b73fad6db0bc61a4935bec76ebaecf39da366c5))
* **build:** add missing dev deps in scene-composer ([b128405](https://github.com/awslabs/iot-app-kit/commit/b1284052e7db7247bd1bbe4758cde21ba584f8c5))
* **CameraView:** Minimum FOV check introduced ([#284](https://github.com/awslabs/iot-app-kit/issues/284)) ([6a8d9f1](https://github.com/awslabs/iot-app-kit/commit/6a8d9f1cbc7995efc612a7cac9f551c7c43ba438))
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
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([164b751](https://github.com/awslabs/iot-app-kit/commit/164b7511ef2d42f1e816d804628440e577f03e43))
* **DragHandleIcon:** Drag Handle icon not showing up without special webpack config ([#345](https://github.com/awslabs/iot-app-kit/issues/345)) ([b8952ce](https://github.com/awslabs/iot-app-kit/commit/b8952ceba6c1e462bc3a45bb06b5c7ef54c5da32))
* Fix the tag scaling with parent scale regression ([#282](https://github.com/awslabs/iot-app-kit/issues/282)) ([efd49fc](https://github.com/awslabs/iot-app-kit/commit/efd49fc66fbb1c30ff7e971c0d8e024a778468e8))
* propertyName with multi hyphen not working ([#496](https://github.com/awslabs/iot-app-kit/issues/496)) ([7c7dc2c](https://github.com/awslabs/iot-app-kit/commit/7c7dc2c9ab1d82505b1e30dab98b58e728cf75a0))
* **Reparenting:** Fix reparenting nodes ([#368](https://github.com/awslabs/iot-app-kit/issues/368)) ([8a66f94](https://github.com/awslabs/iot-app-kit/commit/8a66f940e98a31e3ef6937336e0e5114e23ad20c))
* **scene-composer:** remove invalid workspace syntax ([#640](https://github.com/awslabs/iot-app-kit/issues/640)) ([ed3b28d](https://github.com/awslabs/iot-app-kit/commit/ed3b28dc86fdae2e70b639ce2774217cd92b6122))
* **SceneHierarchyPerformance:** SceneHierarchy Tree Performance ([#283](https://github.com/awslabs/iot-app-kit/issues/283)) ([5e93adc](https://github.com/awslabs/iot-app-kit/commit/5e93adcc5eb338b98a5c9d90b7873880df1bba1a))
* **SubModelHidingChildren:** Unnamed children should be skipped not omitted ([#377](https://github.com/awslabs/iot-app-kit/issues/377)) ([46be1c4](https://github.com/awslabs/iot-app-kit/commit/46be1c4ab34551b22cb1638e97025f4ae4b43347))
* TilesLoader will now load all visible tiles ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* TilesLoader will now load all visible tiles ([#593](https://github.com/awslabs/iot-app-kit/issues/593)) ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* Updating documentation for Storybook ([#264](https://github.com/awslabs/iot-app-kit/issues/264)) ([83352bd](https://github.com/awslabs/iot-app-kit/commit/83352bdab956c8115dc08937e4acb442c6841a0d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 4.0.3 to 5.0.0
    * @iot-app-kit/related-table bumped from 4.0.3 to 5.0.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 4.0.3 to 5.0.0
    * eslint-config-iot-app-kit bumped from 4.0.3 to 5.0.0

## [4.0.3](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v4.0.2...scene-composer-v4.0.3) (2023-03-31)


### Features

* **all:** release version 4.0.2 ([72ca893](https://github.com/awslabs/iot-app-kit/commit/72ca8930db4de95e56381c7f79c9d934230c2283))
* **composer:** add data overaly ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add overlay panel config editor ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add runtime tag settings change support ([eeda501](https://github.com/awslabs/iot-app-kit/commit/eeda501d456c10f61123f9c4f77618bb870816f5))
* **composer:** data binding variable support for data overlay ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data overlay editor & render markdown ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** implement add overlay from menu ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** Implement data overlay container ([#595](https://github.com/awslabs/iot-app-kit/issues/595)) ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** update TagResize feature implementation ([b8dfb46](https://github.com/awslabs/iot-app-kit/commit/b8dfb468043ff6c8b4f154c145f997c6467117ec))
* **composer:** visibility toggles for overlays in settings panel ([4fc0527](https://github.com/awslabs/iot-app-kit/commit/4fc05276aa3f55f19aa8c0792ade3deb58eef7a3))
* **EnvironmentModel:** Adding support for environment overlay ([#262](https://github.com/awslabs/iot-app-kit/issues/262)) ([0277027](https://github.com/awslabs/iot-app-kit/commit/0277027d59f232c2c8e29fac0bc53399a1eb9c1e))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* **Matterport:** Integrate Matterport Showcase Viewer into TwinMaker SceneComposer ([58236e7](https://github.com/awslabs/iot-app-kit/commit/58236e7eed7f5435480cba6ce214346a4f8d3a86))
* **OpacityFilterZero:** Setting opacity to 0 should effectively hide the object ([#342](https://github.com/awslabs/iot-app-kit/issues/342)) ([91e491b](https://github.com/awslabs/iot-app-kit/commit/91e491b45ad2e31f4e407686fbf40c8c0df9f9d0))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))
* **TwinMaker:** Add TwinMaker packages ([#252](https://github.com/awslabs/iot-app-kit/issues/252)) ([fabbe03](https://github.com/awslabs/iot-app-kit/commit/fabbe0399dd37293e99588124404c37c929f4330))


### Bug Fixes

* Allows user to hit Esc key to cancel Enhanced Editing ([#272](https://github.com/awslabs/iot-app-kit/issues/272)) ([6b73fad](https://github.com/awslabs/iot-app-kit/commit/6b73fad6db0bc61a4935bec76ebaecf39da366c5))
* **build:** add missing dev deps in scene-composer ([b128405](https://github.com/awslabs/iot-app-kit/commit/b1284052e7db7247bd1bbe4758cde21ba584f8c5))
* **CameraView:** Minimum FOV check introduced ([#284](https://github.com/awslabs/iot-app-kit/issues/284)) ([6a8d9f1](https://github.com/awslabs/iot-app-kit/commit/6a8d9f1cbc7995efc612a7cac9f551c7c43ba438))
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
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([164b751](https://github.com/awslabs/iot-app-kit/commit/164b7511ef2d42f1e816d804628440e577f03e43))
* **DragHandleIcon:** Drag Handle icon not showing up without special webpack config ([#345](https://github.com/awslabs/iot-app-kit/issues/345)) ([b8952ce](https://github.com/awslabs/iot-app-kit/commit/b8952ceba6c1e462bc3a45bb06b5c7ef54c5da32))
* Fix the tag scaling with parent scale regression ([#282](https://github.com/awslabs/iot-app-kit/issues/282)) ([efd49fc](https://github.com/awslabs/iot-app-kit/commit/efd49fc66fbb1c30ff7e971c0d8e024a778468e8))
* propertyName with multi hyphen not working ([#496](https://github.com/awslabs/iot-app-kit/issues/496)) ([7c7dc2c](https://github.com/awslabs/iot-app-kit/commit/7c7dc2c9ab1d82505b1e30dab98b58e728cf75a0))
* **Reparenting:** Fix reparenting nodes ([#368](https://github.com/awslabs/iot-app-kit/issues/368)) ([8a66f94](https://github.com/awslabs/iot-app-kit/commit/8a66f940e98a31e3ef6937336e0e5114e23ad20c))
* **scene-composer:** remove invalid workspace syntax ([#640](https://github.com/awslabs/iot-app-kit/issues/640)) ([ed3b28d](https://github.com/awslabs/iot-app-kit/commit/ed3b28dc86fdae2e70b639ce2774217cd92b6122))
* **SceneHierarchyPerformance:** SceneHierarchy Tree Performance ([#283](https://github.com/awslabs/iot-app-kit/issues/283)) ([5e93adc](https://github.com/awslabs/iot-app-kit/commit/5e93adcc5eb338b98a5c9d90b7873880df1bba1a))
* **SubModelHidingChildren:** Unnamed children should be skipped not omitted ([#377](https://github.com/awslabs/iot-app-kit/issues/377)) ([46be1c4](https://github.com/awslabs/iot-app-kit/commit/46be1c4ab34551b22cb1638e97025f4ae4b43347))
* TilesLoader will now load all visible tiles ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* TilesLoader will now load all visible tiles ([#593](https://github.com/awslabs/iot-app-kit/issues/593)) ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* Updating documentation for Storybook ([#264](https://github.com/awslabs/iot-app-kit/issues/264)) ([83352bd](https://github.com/awslabs/iot-app-kit/commit/83352bdab956c8115dc08937e4acb442c6841a0d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 4.0.2 to 4.0.3
    * @iot-app-kit/related-table bumped from 4.0.2 to 4.0.3
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 4.0.2 to 4.0.3
    * eslint-config-iot-app-kit bumped from 4.0.2 to 4.0.3

## [4.0.2](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v4.0.1...scene-composer-v4.0.2) (2023-03-30)


### Features

* **composer:** add data overaly ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add overlay panel config editor ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add runtime tag settings change support ([eeda501](https://github.com/awslabs/iot-app-kit/commit/eeda501d456c10f61123f9c4f77618bb870816f5))
* **composer:** data binding variable support for data overlay ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data overlay editor & render markdown ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** implement add overlay from menu ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** Implement data overlay container ([#595](https://github.com/awslabs/iot-app-kit/issues/595)) ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** update TagResize feature implementation ([b8dfb46](https://github.com/awslabs/iot-app-kit/commit/b8dfb468043ff6c8b4f154c145f997c6467117ec))
* **composer:** visibility toggles for overlays in settings panel ([4fc0527](https://github.com/awslabs/iot-app-kit/commit/4fc05276aa3f55f19aa8c0792ade3deb58eef7a3))
* **EnvironmentModel:** Adding support for environment overlay ([#262](https://github.com/awslabs/iot-app-kit/issues/262)) ([0277027](https://github.com/awslabs/iot-app-kit/commit/0277027d59f232c2c8e29fac0bc53399a1eb9c1e))
* Introduce alarms ([#135](https://github.com/awslabs/iot-app-kit/issues/135)) ([5c19b99](https://github.com/awslabs/iot-app-kit/commit/5c19b9957c05fbc8df15545ae9847d39030b686b))
* **Matterport:** Integrate Matterport Showcase Viewer into TwinMaker SceneComposer ([58236e7](https://github.com/awslabs/iot-app-kit/commit/58236e7eed7f5435480cba6ce214346a4f8d3a86))
* **OpacityFilterZero:** Setting opacity to 0 should effectively hide the object ([#342](https://github.com/awslabs/iot-app-kit/issues/342)) ([91e491b](https://github.com/awslabs/iot-app-kit/commit/91e491b45ad2e31f4e407686fbf40c8c0df9f9d0))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))
* **TwinMaker:** Add TwinMaker packages ([#252](https://github.com/awslabs/iot-app-kit/issues/252)) ([fabbe03](https://github.com/awslabs/iot-app-kit/commit/fabbe0399dd37293e99588124404c37c929f4330))


### Bug Fixes

* Allows user to hit Esc key to cancel Enhanced Editing ([#272](https://github.com/awslabs/iot-app-kit/issues/272)) ([6b73fad](https://github.com/awslabs/iot-app-kit/commit/6b73fad6db0bc61a4935bec76ebaecf39da366c5))
* **build:** add missing dev deps in scene-composer ([b128405](https://github.com/awslabs/iot-app-kit/commit/b1284052e7db7247bd1bbe4758cde21ba584f8c5))
* **CameraView:** Minimum FOV check introduced ([#284](https://github.com/awslabs/iot-app-kit/issues/284)) ([6a8d9f1](https://github.com/awslabs/iot-app-kit/commit/6a8d9f1cbc7995efc612a7cac9f551c7c43ba438))
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
* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([164b751](https://github.com/awslabs/iot-app-kit/commit/164b7511ef2d42f1e816d804628440e577f03e43))
* **DragHandleIcon:** Drag Handle icon not showing up without special webpack config ([#345](https://github.com/awslabs/iot-app-kit/issues/345)) ([b8952ce](https://github.com/awslabs/iot-app-kit/commit/b8952ceba6c1e462bc3a45bb06b5c7ef54c5da32))
* Fix the tag scaling with parent scale regression ([#282](https://github.com/awslabs/iot-app-kit/issues/282)) ([efd49fc](https://github.com/awslabs/iot-app-kit/commit/efd49fc66fbb1c30ff7e971c0d8e024a778468e8))
* propertyName with multi hyphen not working ([#496](https://github.com/awslabs/iot-app-kit/issues/496)) ([7c7dc2c](https://github.com/awslabs/iot-app-kit/commit/7c7dc2c9ab1d82505b1e30dab98b58e728cf75a0))
* **Reparenting:** Fix reparenting nodes ([#368](https://github.com/awslabs/iot-app-kit/issues/368)) ([8a66f94](https://github.com/awslabs/iot-app-kit/commit/8a66f940e98a31e3ef6937336e0e5114e23ad20c))
* **scene-composer:** remove invalid workspace syntax ([#640](https://github.com/awslabs/iot-app-kit/issues/640)) ([ed3b28d](https://github.com/awslabs/iot-app-kit/commit/ed3b28dc86fdae2e70b639ce2774217cd92b6122))
* **SceneHierarchyPerformance:** SceneHierarchy Tree Performance ([#283](https://github.com/awslabs/iot-app-kit/issues/283)) ([5e93adc](https://github.com/awslabs/iot-app-kit/commit/5e93adcc5eb338b98a5c9d90b7873880df1bba1a))
* **SubModelHidingChildren:** Unnamed children should be skipped not omitted ([#377](https://github.com/awslabs/iot-app-kit/issues/377)) ([46be1c4](https://github.com/awslabs/iot-app-kit/commit/46be1c4ab34551b22cb1638e97025f4ae4b43347))
* TilesLoader will now load all visible tiles ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* TilesLoader will now load all visible tiles ([#593](https://github.com/awslabs/iot-app-kit/issues/593)) ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* Updating documentation for Storybook ([#264](https://github.com/awslabs/iot-app-kit/issues/264)) ([83352bd](https://github.com/awslabs/iot-app-kit/commit/83352bdab956c8115dc08937e4acb442c6841a0d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 4.0.1 to 4.0.2
    * @iot-app-kit/related-table bumped from 4.0.1 to 4.0.2
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 4.0.1 to 4.0.2
    * eslint-config-iot-app-kit bumped from * to 4.0.2

## [4.0.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v4.0.0...scene-composer-v4.0.1) (2023-03-28)


### Features

* **composer:** add data overaly ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** add overlay panel config editor ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data binding variable support for data overlay ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** data overlay editor & render markdown ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** implement add overlay from menu ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))
* **composer:** Implement data overlay container ([#595](https://github.com/awslabs/iot-app-kit/issues/595)) ([42f8896](https://github.com/awslabs/iot-app-kit/commit/42f889620c01d02250c6856ab4a56a446bc3f556))


### Bug Fixes

* **composer:** update translations ([3e8d391](https://github.com/awslabs/iot-app-kit/commit/3e8d39155ea077f37320890ac57e9505d9a719a2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 4.0.0 to 4.0.1
    * @iot-app-kit/related-table bumped from 4.0.0 to 4.0.1
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 4.0.0 to 4.0.1

## [4.0.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v3.0.0...scene-composer-v4.0.0) (2023-03-15)


### Features

* **composer:** add runtime tag settings change support ([eeda501](https://github.com/awslabs/iot-app-kit/commit/eeda501d456c10f61123f9c4f77618bb870816f5))
* **React18:** Adds support for react 18 ([596c6b0](https://github.com/awslabs/iot-app-kit/commit/596c6b0ca2757baf445e4b203c3546e2d041e559))


### Bug Fixes

* **build:** add missing dev deps in scene-composer ([b128405](https://github.com/awslabs/iot-app-kit/commit/b1284052e7db7247bd1bbe4758cde21ba584f8c5))
* **composer:** fix error with rendering 3D tiles ([785d833](https://github.com/awslabs/iot-app-kit/commit/785d8338fbb2908a01a6a40b55cc3d7b3fda1ab4))
* **scene-composer:** remove invalid workspace syntax ([#640](https://github.com/awslabs/iot-app-kit/issues/640)) ([ed3b28d](https://github.com/awslabs/iot-app-kit/commit/ed3b28dc86fdae2e70b639ce2774217cd92b6122))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from 3.0.0 to 4.0.0
    * @iot-app-kit/related-table bumped from 3.0.0 to 4.0.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from 3.0.0 to 4.0.0

## [3.0.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.6.5...scene-composer-v3.0.0) (2023-03-04)


### Features

* **composer:** update TagResize feature implementation ([b8dfb46](https://github.com/awslabs/iot-app-kit/commit/b8dfb468043ff6c8b4f154c145f997c6467117ec))
* **Matterport:** Integrate Matterport Showcase Viewer into TwinMaker SceneComposer ([58236e7](https://github.com/awslabs/iot-app-kit/commit/58236e7eed7f5435480cba6ce214346a4f8d3a86))
* **RemoveNodeSass:** Replace node-sass dependency with a native javascript implementation ([f5ca005](https://github.com/awslabs/iot-app-kit/commit/f5ca005094d6c0164845d573a7dd89eb75bfca5f))


### Bug Fixes

* **dashboard:** refactor widget type ([fc3e41e](https://github.com/awslabs/iot-app-kit/commit/fc3e41e3e4c1cececd49f34d6d9aaa6821b21ae7))
* TilesLoader will now load all visible tiles ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))
* TilesLoader will now load all visible tiles ([#593](https://github.com/awslabs/iot-app-kit/issues/593)) ([5d59509](https://github.com/awslabs/iot-app-kit/commit/5d5950944a0b0c9d832d2d14621dcc53fed28868))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from * to 3.0.0
    * @iot-app-kit/related-table bumped from * to 3.0.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from * to 3.0.0

## [2.6.5](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.6.4...scene-composer-v2.6.5) (2023-01-25)


### Miscellaneous Chores

* **scene-composer:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.4 to ^2.6.5
    * @iot-app-kit/related-table bumped from ^2.6.4 to ^2.6.5
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.4 to ^2.6.5

## [2.6.4](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.6.3...scene-composer-v2.6.4) (2023-01-23)


### Bug Fixes

* propertyName with multi hyphen not working ([#496](https://github.com/awslabs/iot-app-kit/issues/496)) ([7c7dc2c](https://github.com/awslabs/iot-app-kit/commit/7c7dc2c9ab1d82505b1e30dab98b58e728cf75a0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.3 to ^2.6.4
    * @iot-app-kit/related-table bumped from ^2.6.3 to ^2.6.4
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.3 to ^2.6.4

## [2.6.3](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.6.2...scene-composer-v2.6.3) (2023-01-13)


### Bug Fixes

* **composer:** Auto expand hierarchy when selecting node on scene ([#452](https://github.com/awslabs/iot-app-kit/issues/452)) ([9b3e80f](https://github.com/awslabs/iot-app-kit/commit/9b3e80f17f26ef0268eaeb6222d79f077d057c97))
* **composer:** fix object transforms during reparenting ([#477](https://github.com/awslabs/iot-app-kit/issues/477)) ([7a45bb3](https://github.com/awslabs/iot-app-kit/commit/7a45bb3eb1c2418396b39c7d092a380eb32ba250))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.2 to ^2.6.3
    * @iot-app-kit/related-table bumped from ^2.6.2 to ^2.6.3
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.2 to ^2.6.3

## [2.6.2](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.6.1...scene-composer-v2.6.2) (2023-01-09)


### Miscellaneous Chores

* **scene-composer:** Synchronize undefined versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.1 to ^2.6.2
    * @iot-app-kit/related-table bumped from ^2.6.1 to ^2.6.2
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.1 to ^2.6.2

## [2.6.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.6.0...scene-composer-v2.6.1) (2023-01-09)


### Bug Fixes

* **composer:** Allows nodes to be dropped at root level ([#390](https://github.com/awslabs/iot-app-kit/issues/390)) ([d9d7978](https://github.com/awslabs/iot-app-kit/commit/d9d79789e67a43b94057ad0ff45c663e186cacf7))
* **composer:** hdr url is sometimes wrong ([#352](https://github.com/awslabs/iot-app-kit/issues/352)) ([2c2625e](https://github.com/awslabs/iot-app-kit/commit/2c2625e6630cecd64231f2b8a6d7876a75ee3347))
* **composer:** support Windows dependency file paths in GLTF loader ([#417](https://github.com/awslabs/iot-app-kit/issues/417)) ([9f7c075](https://github.com/awslabs/iot-app-kit/commit/9f7c075f58458c75f7bc04cd8287dd0087281f0c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.6.0 to ^2.6.1
    * @iot-app-kit/related-table bumped from ^2.6.0 to ^2.6.1
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.6.0 to ^2.6.1

## [2.6.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.5.1...scene-composer-v2.6.0) (2022-12-19)


### Bug Fixes

* **composer:** CSS Cleanup for Sceneviewer ([#379](https://github.com/awslabs/iot-app-kit/issues/379)) ([890dc4d](https://github.com/awslabs/iot-app-kit/commit/890dc4d57b3b756e90d47884fdf8a275595a1bc5))
* **composer:** entityId data binding not rendered ([#389](https://github.com/awslabs/iot-app-kit/issues/389)) ([6ad596f](https://github.com/awslabs/iot-app-kit/commit/6ad596f2d5cf31039b8dd5d0fdd069fb91ffc45d))
* **composer:** reorder to same parent duplicates child ([b76057d](https://github.com/awslabs/iot-app-kit/commit/b76057d17f23ad25d9f48497619bf49e23fcecb3))
* **composer:** scene change is sometimes not saved ([#409](https://github.com/awslabs/iot-app-kit/issues/409)) ([7b0c45a](https://github.com/awslabs/iot-app-kit/commit/7b0c45aab025a90827a472afb0efc85077dd7ef9))
* **composer:** Set tree hierarchy items to auto-collapsed on load ([#380](https://github.com/awslabs/iot-app-kit/issues/380)) ([dad88a0](https://github.com/awslabs/iot-app-kit/commit/dad88a0925a0dbf5c9c15e9e79cd4f025fb54682))
* **SubModelHidingChildren:** Unnamed children should be skipped not omitted ([#377](https://github.com/awslabs/iot-app-kit/issues/377)) ([46be1c4](https://github.com/awslabs/iot-app-kit/commit/46be1c4ab34551b22cb1638e97025f4ae4b43347))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.5.1 to ^2.6.0
    * @iot-app-kit/related-table bumped from ^2.5.1 to ^2.6.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.5.1 to ^2.6.0

## [2.5.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.5.0...scene-composer-v2.5.1) (2022-11-16)


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
* **Reparenting:** Fix reparenting nodes ([#368](https://github.com/awslabs/iot-app-kit/issues/368)) ([8a66f94](https://github.com/awslabs/iot-app-kit/commit/8a66f940e98a31e3ef6937336e0e5114e23ad20c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.5.0 to ^2.5.1
    * @iot-app-kit/related-table bumped from ^2.5.0 to ^2.5.1
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.5.0 to ^2.5.1

## [2.5.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.4.2...scene-composer-v2.5.0) (2022-11-11)


### Features

* **OpacityFilterZero:** Setting opacity to 0 should effectively hide the object ([#342](https://github.com/awslabs/iot-app-kit/issues/342)) ([91e491b](https://github.com/awslabs/iot-app-kit/commit/91e491b45ad2e31f4e407686fbf40c8c0df9f9d0))


### Bug Fixes

* **composer:** Adding ability to deselect by click radio button ([#351](https://github.com/awslabs/iot-app-kit/issues/351)) ([8c402b7](https://github.com/awslabs/iot-app-kit/commit/8c402b774b9a10ffdcdd13fc0a9f2f89f3eb507b))
* **composer:** Bug fix for rerenders on name input in inspect panel ([#334](https://github.com/awslabs/iot-app-kit/issues/334)) ([b8a0b4c](https://github.com/awslabs/iot-app-kit/commit/b8a0b4c4e8371637a0f1342f96196ca5b46ed383))
* **composer:** Fix camera view positioning under sub model ([#341](https://github.com/awslabs/iot-app-kit/issues/341)) ([94dcdda](https://github.com/awslabs/iot-app-kit/commit/94dcdda65a7c44cf449828338bed1ea132f995ea))
* **composer:** Fix e.removeFromParent and camera focus ([#350](https://github.com/awslabs/iot-app-kit/issues/350)) ([8458e50](https://github.com/awslabs/iot-app-kit/commit/8458e50f4ec87aa5e7e4f722017766f447d71b5e))
* **composer:** Fixes for layout in Console, submodel layout updates, bug fix for submodel interactive highlights ([#344](https://github.com/awslabs/iot-app-kit/issues/344)) ([a1ea148](https://github.com/awslabs/iot-app-kit/commit/a1ea148c8de1ddabc713c87b379d9e95901d2e03))
* **composer:** Fixes the light helper delete while maintaining visibility link ([#349](https://github.com/awslabs/iot-app-kit/issues/349)) ([2f51263](https://github.com/awslabs/iot-app-kit/commit/2f5126377e8cc40645188487499946e2477418e4))
* **Composer:** Safe bounding box and 3D cursor fix ([#327](https://github.com/awslabs/iot-app-kit/issues/327)) ([a31585f](https://github.com/awslabs/iot-app-kit/commit/a31585fe447d0aa6a0bda855ffbdd8a4d756798d))
* **DragHandleIcon:** Drag Handle icon not showing up without special webpack config ([#345](https://github.com/awslabs/iot-app-kit/issues/345)) ([b8952ce](https://github.com/awslabs/iot-app-kit/commit/b8952ceba6c1e462bc3a45bb06b5c7ef54c5da32))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.2 to ^2.5.0
    * @iot-app-kit/related-table bumped from ^2.4.2 to ^2.5.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.4.2 to ^2.5.0

## [2.4.2](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.4.1...scene-composer-v2.4.2) (2022-11-08)


### Bug Fixes

* **composer:** Scene Hierarchy radio buttons & bug fix for selection on single click ([#326](https://github.com/awslabs/iot-app-kit/issues/326)) ([1026cb4](https://github.com/awslabs/iot-app-kit/commit/1026cb4d607317a43bb45e0058e9762a3a5430c1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.1 to ^2.4.2
    * @iot-app-kit/related-table bumped from ^2.4.1 to ^2.4.2
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.4.1 to ^2.4.2

## [2.4.1](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.4.0...scene-composer-v2.4.1) (2022-11-07)


### Bug Fixes

* **composer:** boolean data always converted to false ([#323](https://github.com/awslabs/iot-app-kit/issues/323)) ([254d68f](https://github.com/awslabs/iot-app-kit/commit/254d68f610efd1c75963f91c185bd42a2d649365))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.4.0 to ^2.4.1
    * @iot-app-kit/related-table bumped from ^2.4.0 to ^2.4.1
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.4.0 to ^2.4.1

## [2.4.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.3.0...scene-composer-v2.4.0) (2022-11-04)


### Bug Fixes

* **composer:** submodel and hierarchy search fix ([#320](https://github.com/awslabs/iot-app-kit/issues/320)) ([364cefb](https://github.com/awslabs/iot-app-kit/commit/364cefb9d4fb820b04e30e8761409a7ad00a5825))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.3.0 to ^2.4.0
    * @iot-app-kit/related-table bumped from ^2.3.0 to ^2.4.0
  * devDependencies
    * @iot-app-kit/source-iottwinmaker bumped from ^2.3.0 to ^2.4.0

## [2.3.0](https://github.com/awslabs/iot-app-kit/compare/scene-composer-v2.2.0...scene-composer-v2.3.0) (2022-11-02)


### Bug Fixes

* **composer:** Camera and Light helper visibility toggling ([#294](https://github.com/awslabs/iot-app-kit/issues/294)) ([f6bae7c](https://github.com/awslabs/iot-app-kit/commit/f6bae7c118dd7a68e0dd414cb90df95457c06b7c))
* **composer:** Fixes 2nd camera viewing click bug ([#291](https://github.com/awslabs/iot-app-kit/issues/291)) ([ed04d13](https://github.com/awslabs/iot-app-kit/commit/ed04d130269840af40b3a383ed9dd43f04bcd804))
* **composer:** update translations ([#302](https://github.com/awslabs/iot-app-kit/issues/302)) ([95c2bda](https://github.com/awslabs/iot-app-kit/commit/95c2bdae2db263f20432a1f9ccf214cb26a001bf))
* **deps:** update synchro-charts, node-sass, nth-check ([#295](https://github.com/awslabs/iot-app-kit/issues/295)) ([016c216](https://github.com/awslabs/iot-app-kit/commit/016c216c2934d150f94e595d3ebb34aaafa69e27))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @iot-app-kit/core bumped from ^2.2.0 to ^2.3.0
    * @iot-app-kit/related-table bumped from ^2.2.0 to ^2.3.0
  * devDependencies
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
