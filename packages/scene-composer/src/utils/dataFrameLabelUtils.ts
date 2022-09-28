import { isEmpty, isEqual } from 'lodash';

export namespace DataFrameLabelSymbols {
  export const labelSeparator = ',';
  export const partsSeparator = '&';
  export const partKeyValueConnector = '=';
}

// Create a part of the label
// e.g. { entityId: 'mixer', componentName: 'timestream', propertyName: 'alarm' }
//      to: componentName=timestream&entityId=mixer&propertyName=alarm
export const createDataFrameLabelPart = (map: Record<string, string>) => {
  return Object.keys(map)
    .sort()
    .map(
      (key) =>
        `${encodeURIComponent(key)}${DataFrameLabelSymbols.partKeyValueConnector}${encodeURIComponent(map[key])}`,
    )
    .join(DataFrameLabelSymbols.partsSeparator);
};

// Create the label
// e.g. [part1, part2] to: part1,part2
export const createDataFrameLabel = (parts: Record<string, string>[]) => {
  return parts
    .map((part) => encodeURIComponent(createDataFrameLabelPart(part)))
    .join(DataFrameLabelSymbols.labelSeparator);
};

// Decode the label which is encoded by the createDataFrameLabel function above.
// returned value is the same as the input of createDataFrameLabel
export const decodeDataFrameLabel = (encodedLabel: string): Record<string, string>[] => {
  const result: Record<string, string>[] = [];
  const labelParts = encodedLabel.split(DataFrameLabelSymbols.labelSeparator).map((part) => decodeURIComponent(part));
  labelParts.forEach((part) => {
    const splitPart = part.split(DataFrameLabelSymbols.partsSeparator);
    const valueMap = {};
    splitPart.forEach((valuePair) => {
      const decodedPair = valuePair
        .split(DataFrameLabelSymbols.partKeyValueConnector)
        .map((value) => decodeURIComponent(value));
      if (decodedPair.length === 2) {
        valueMap[decodedPair[0]] = decodedPair[1];
      } else {
        console.warn('Cannot parse label part: ', part);
      }
    });
    if (!isEmpty(valueMap)) {
      result.push(valueMap);
    }
  });
  return result;
};

/**
 * Returns true if the two label parts are equal, false otherwise
 */
export const compareDataFrameLabelPart = (partA?: string, partB?: string): boolean => {
  if (!partA || !partB) {
    // empty parts are not considered as matching parts
    return false;
  }

  const componentsA = decodeDataFrameLabel(partA);
  const componentsB = decodeDataFrameLabel(partB);

  return isEqual(componentsA, componentsB);
};

// Compare the 2 data frame labels. Either label has mutliple parts
export const compareDataFrameLabel = (label1?: string, label2?: string): boolean => {
  if (!label1 || !label2) {
    // empty labels are not considered as matching labels
    return false;
  }

  const parts1 = label1.split(DataFrameLabelSymbols.labelSeparator).filter((part) => part && part.length > 0);
  const parts2 = label2.split(DataFrameLabelSymbols.labelSeparator).filter((part) => part && part.length > 0);

  if (parts1.length === 0 || parts2.length === 0) {
    // empty parts are not considered as matching parts
    return false;
  } else {
    return (
      parts1.find((part1) => {
        return parts2.find((part2) => compareDataFrameLabelPart(part1, part2)) !== undefined;
      }) !== undefined
    );
  }
};
