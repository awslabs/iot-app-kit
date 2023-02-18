import { AssetQuery } from '@iot-app-kit/core';

// For now we will only support one SiteWise Asset Property
const isValidQuery = (assets: AssetQuery[]) =>
  assets?.length === 1 && assets?.[0]?.properties?.length && assets?.[0]?.properties?.length === 1;

export default isValidQuery;
