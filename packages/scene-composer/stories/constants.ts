import { FIELD_NAME } from './types';

export const entityIds = Object.seal(['room1', 'room2']);
export const entityNames = Object.seal(['room1Name', 'room2Name']);
export const componentNames = Object.seal(['temperatureSensor1', 'temperatureSensor2']);
export const propertyNames = Object.seal(['temperature']);

export const FIELDS: FIELD_NAME[] = ['entityId', 'componentName', 'propertyName'];
export const ENTITY_ID_INDEX = 0;
export const COMPONENT_NAME_INDEX = 1;
export const PROPERTY_NAME_INDEX = 2;

export const MOCK_DELAY = 300;
