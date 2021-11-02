import { IotAppKitDataModule } from './IotAppKitDataModule';
import { DataModule } from './types.d';
import { createDataSource } from '../data-sources/site-wise/data-source';
import { sitewiseSdk } from '../data-sources/site-wise/sitewise-sdk';

export * from './IotAppKitDataModule';
export * from './types.d';

const dataModule = new IotAppKitDataModule();
/**
 * register data sources
 */
const siteWiseDataSource = createDataSource(sitewiseSdk());
dataModule.registerDataSource(siteWiseDataSource);

export const getDataModule = (): DataModule => dataModule;
