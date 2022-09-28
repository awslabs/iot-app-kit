import { FIELD_NAME } from './types';

export const entityIds = Object.seal(['room1', 'room2']);
export const entityNames = Object.seal(['room1Name', 'room2Name']);
export const allEntityIds = Object.seal([...entityIds, 'room3', 'room4']);
export const componentNames = Object.seal(['temperatureSensor1', 'temperatureSensor2']);
export const propertyNames = Object.seal(['temperature']);

export const FIELDS: FIELD_NAME[] = ['entityId', 'componentName', 'propertyName'];

export const MOCK_DELAY = 300;
