import { TwinMakerDataStreamIdComponent } from '../types';

export const toDataStreamId = (values: TwinMakerDataStreamIdComponent): string => {
  const sortedValues: Record<string, string> = {};
  Object.keys(values)
    .sort()
    .forEach((key) => (sortedValues[key] = values[key as keyof TwinMakerDataStreamIdComponent]));
  return JSON.stringify(sortedValues);
};

export const fromDataStreamId = (dataStreamId: string): TwinMakerDataStreamIdComponent => {
  try {
    const parsed = JSON.parse(dataStreamId);

    return {
      ...parsed,
      workspaceId: parsed['workspaceId'] || '',
      entityId: parsed['entityId'] || '',
      componentName: parsed['componentName'] || '',
      propertyName: parsed['propertyName'] || '',
    };
  } catch {
    return {
      workspaceId: '',
      entityId: '',
      componentName: '',
      propertyName: '',
    };
  }
};
