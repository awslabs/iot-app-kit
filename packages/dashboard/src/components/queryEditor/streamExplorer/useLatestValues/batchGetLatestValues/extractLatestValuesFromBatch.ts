import type {
  BatchGetLatestValuesEntry,
  BatchGetLatestValuesSuccessEntry,
  BatchGetLatestValuesSkippedEntry,
  BatchGetLatestValuesErrorEntry,
  SuccessValue,
  SkippedValue,
  ErrorValue,
} from './types';

export function extractLatestValuesFromBatch({
  entries,
  successEntries,
  skippedEntries,
  errorEntries,
}: {
  entries: BatchGetLatestValuesEntry[];
  successEntries: BatchGetLatestValuesSuccessEntry[];
  skippedEntries: BatchGetLatestValuesSkippedEntry[];
  errorEntries: BatchGetLatestValuesErrorEntry[];
}) {
  const successValues = extractSuccessValues({ entries, successEntries });
  const skippedValues = extractSkippedValues({ entries, skippedEntries });
  const errorValues = extractErrorValues({ entries, errorEntries });

  return {
    successValues,
    skippedValues,
    errorValues,
  };
}

function extractSuccessValues({
  entries,
  successEntries,
}: {
  entries: BatchGetLatestValuesEntry[];
  successEntries: BatchGetLatestValuesSuccessEntry[];
}): SuccessValue[] {
  const successValues = successEntries.map(({ entryId, assetPropertyValue: { timestamp, value = {} } = {} }) => {
    const { assetId, propertyId } = entries.find(({ entryId: id }) => id === entryId) ?? {};
    const latestValue: string | number | boolean | undefined = Object.values(value).find((v) => v != null);

    return {
      value: latestValue,
      timestamp,
      assetId,
      propertyId,
    };
  });

  return successValues;
}

function extractSkippedValues({
  entries,
  skippedEntries,
}: {
  entries: BatchGetLatestValuesEntry[];
  skippedEntries: BatchGetLatestValuesSkippedEntry[];
}): SkippedValue[] {
  const skippedValues = skippedEntries.map(({ entryId: skippedEntryId, completionStatus }) => {
    const { assetId, propertyId } = entries.find(({ entryId: id }) => id === skippedEntryId) ?? {};

    return {
      assetId,
      propertyId,
      completionStatus,
    };
  });

  return skippedValues;
}

function extractErrorValues({
  entries,
  errorEntries,
}: {
  entries: BatchGetLatestValuesEntry[];
  errorEntries: BatchGetLatestValuesErrorEntry[];
}): ErrorValue[] {
  const errorValues = errorEntries.map(({ entryId: errorEntryId, errorCode, errorMessage }) => {
    const { assetId, propertyId } = entries.find(({ entryId: id }) => id === errorEntryId) ?? {};

    return {
      assetId,
      propertyId,
      errorCode,
      errorMessage,
    };
  });

  return errorValues;
}
