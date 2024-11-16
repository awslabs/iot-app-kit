import type {
  ComponentRequest,
  DataType,
  GetEntityCommandOutput,
  PropertyDefinitionRequest,
} from '@aws-sdk/client-iottwinmaker';

/**
 * Driver function determines whether componentUpdates contains some fields/values that
 * do not exist in existingBody's components.
 *
 * @remarks This is not a strict equality comparison.
 *
 * @param existingBody - GetEntity response JSON of existing entity
 * @param componentUpdates - imported entity's component body
 * @returns true if existingBody components need update and false otherwise
 */
function componentsNeedUpdates(
  existingBody: GetEntityCommandOutput,
  componentUpdates: { [key: string]: ComponentRequest } | undefined
): boolean {
  const oldComponents = existingBody['components'];
  if (oldComponents != undefined) {
    for (const key in componentUpdates) {
      // check that every ComponentUpdateRequest key exists
      if (oldComponents[key] != undefined) {
        const values = componentUpdates[key];
        const oldValues = oldComponents[key];
        // first check if the ComponentUpdateRequest description or componentTypeId differ
        if (
          values.componentTypeId == oldValues.componentTypeId &&
          values.description == oldValues.description
        ) {
          const newProperties = values.properties;
          const oldProperties = oldValues.properties;
          for (const propertyKey in newProperties) {
            // compare every new PropertyRequest
            const newProperty = newProperties[propertyKey];
            if (oldProperties != undefined) {
              const oldProperty = oldProperties[propertyKey];
              // check if imported entity contains a new property
              if (oldProperty == undefined) {
                return true;
              }
              // compare the PropertyRequest values/Definitions and PropertyResponse values/Definitions
              if (
                JSON.stringify(newProperty.value) !=
                  JSON.stringify(oldProperty.value) ||
                !propertyDefinitionIsEqual(
                  newProperty.definition,
                  oldProperty.definition
                )
              ) {
                // PropertyRequest does not match
                return true;
              }
              // If we get here, 1 component fully matched! Continue looping
            }
            // old properties is undefined
            else return true;
          }
        }
        // if componentTypeId or description does not match
        else return true;
      }
      // if oldComponent does not match the key
      else return true;
    }
    // Passed every single check for all iterations of the component loop
    return false;
  }
  // if the existing body components are undefined
  else return true;
}

/**
 * Helper function compares property definitions and determines if an update is needed.
 *
 * @remarks This is not a strict equality comparison.
 *
 * @param newDefinition - imported entity's component property definition
 * @param oldDefinition - existing entity's component property definition
 * @returns true is ALL newDefinition fields are either undefined or contained within oldDefinition, false otherwise
 */
function propertyDefinitionIsEqual(
  newDefinition: PropertyDefinitionRequest | undefined,
  oldDefinition: PropertyDefinitionRequest | undefined
): boolean {
  if (newDefinition != undefined && oldDefinition != undefined) {
    // Do any of the boolean definitions need updating?
    const keys: (keyof PropertyDefinitionRequest)[] = [
      'isRequiredInEntity',
      'isExternalId',
      'isStoredExternally',
      'isTimeSeries',
    ];
    for (const key of keys) {
      if (
        newDefinition[key] != undefined &&
        newDefinition[key] != oldDefinition[key]
      ) {
        return false;
      }
    }
    // Does defaultValue need update?
    if (
      newDefinition.defaultValue != undefined &&
      JSON.stringify(newDefinition.defaultValue) !=
        JSON.stringify(oldDefinition.defaultValue)
    ) {
      return false;
    }
    // Does configuration need update?
    if (newDefinition.configuration != undefined) {
      // if the old configuration is not defined, we need need update
      if (oldDefinition.configuration == undefined) {
        return false;
      } else {
        for (const key in newDefinition.configuration) {
          // if any key-value pair in the NEW configuration does not match (NOT strict equality)
          if (
            newDefinition.configuration[key] != oldDefinition.configuration[key]
          ) {
            return false;
          }
        }
      }
    }
    // does dataType need update?
    if (
      newDefinition.dataType != undefined &&
      !dataTypeIsEqual(newDefinition.dataType, oldDefinition.dataType)
    ) {
      return false;
    }
  }
  // if we pass every comparison
  return true;
}

/**
 * Helper function compares dataTypes and determines if an update is needed.
 *
 * @remarks This is not a strict equality comparison.
 *
 * @param newDataType - imported entity's data type
 * @param oldDataType - existing entity's data type
 * @returns true if oldDataType does not need update, and false otherwise
 */
function dataTypeIsEqual(
  newDataType: DataType | undefined,
  oldDataType: DataType | undefined
): boolean {
  if (newDataType != undefined && oldDataType != undefined) {
    // Does type need update?
    if (newDataType.type != oldDataType.type) {
      return false;
      // Does unitOfMeasure need update?
    }
    if (
      newDataType.unitOfMeasure != undefined &&
      newDataType.unitOfMeasure != oldDataType.unitOfMeasure
    ) {
      return false;
      // Does allowedValues need update?
    }
    if (newDataType.allowedValues != undefined) {
      for (const [index, value] of newDataType.allowedValues.entries()) {
        // if any new value does not exist in old allowedValue, we need update
        if (oldDataType.allowedValues == undefined) {
          return false;
        }
        // if any new value changed from old allowedValue, we need update
        if (
          JSON.stringify(value) !=
          JSON.stringify(oldDataType.allowedValues[index])
        ) {
          return false;
        }
      }
      // Does relationship need update?
    }
    if (newDataType.relationship != undefined) {
      // If either relationshipType or targetComponentTypeId are defined and different, we need update
      if (
        newDataType.relationship.relationshipType != undefined &&
        newDataType.relationship.relationshipType !=
          oldDataType.relationship?.relationshipType
      ) {
        return false;
      } else if (
        newDataType.relationship.targetComponentTypeId != undefined &&
        newDataType.relationship.targetComponentTypeId !=
          oldDataType.relationship?.targetComponentTypeId
      ) {
        return false;
      }
      // Does nestedType need update?
    }
    if (
      newDataType.nestedType != undefined &&
      !dataTypeIsEqual(newDataType.nestedType, oldDataType.nestedType)
    ) {
      return false;
    }
    // If all of the above checks passed, we do not need update
    return true;
    // if oldDataType is undefined but there exists a new one, we need update
  } else if (newDataType != undefined && oldDataType == undefined) {
    return false;
    // if neither new nor old DataType are defined, we do not need update
  } else {
    return true;
  }
}

export { componentsNeedUpdates };
