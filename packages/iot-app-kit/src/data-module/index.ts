import { IotAppKitDataModule } from './IotAppKitDataModule';
import { DataModule } from './types.d';
import { createDataSource } from '../data-sources/site-wise/data-source';
import { sitewiseSdk } from '../data-sources/site-wise/sitewise-sdk';

export * from './IotAppKitDataModule';
export * from './types.d';

/**
 * register data sources
 */
let dataModule = new IotAppKitDataModule();
dataModule.registerDataSource(createDataSource(sitewiseSdk()));

export const resetDataModule = () => {
  dataModule = new IotAppKitDataModule();
  dataModule.registerDataSource(createDataSource(sitewiseSdk()));
};

export const getDataModule = (): DataModule => dataModule;

//
