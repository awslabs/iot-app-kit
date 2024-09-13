import { BatchGetAssetPropertyValueHistoryEntry } from '@aws-sdk/client-iotsitewise';
import {
  BatchGetAssetPropertyValueHistory,
  GetAssetPropertyValueHistory,
  RequestResponse,
} from '@iot-app-kit/core';
import { take } from 'lodash';

export class BatchResponseProcessor {
  private entry: BatchGetAssetPropertyValueHistoryEntry;
  private valuesTargetNumber: number;

  private assetPropertyValueHistory: NonNullable<
    RequestResponse<GetAssetPropertyValueHistory>['assetPropertyValueHistory']
  > = [];

  private errorEntries: RequestResponse<BatchGetAssetPropertyValueHistory>['errorEntries'] =
    [];

  constructor(
    entry: BatchGetAssetPropertyValueHistoryEntry,
    valuesTargetNumber = Infinity
  ) {
    this.entry = entry;
    this.valuesTargetNumber = valuesTargetNumber;
  }

  processResponse(
    response: RequestResponse<BatchGetAssetPropertyValueHistory>
  ) {
    if (this.isComplete) return;

    const sucessesForEntry = (response.successEntries ?? []).filter(
      ({ entryId }) => entryId === this.entry.entryId
    );
    const errorsForEntry = response.errorEntries?.filter(
      ({ entryId }) => entryId === this.entry.entryId
    );

    const assetPropertyValues = sucessesForEntry.flatMap(
      ({ assetPropertyValueHistory = [] }) => assetPropertyValueHistory
    );

    /**
     * Only take the number of values determined by the target number
     * The target number will be a running count from each paginated
     * resposne.
     */
    const limitedAssetPropertyValues = take(
      assetPropertyValues,
      this.valuesTargetNumber
    );
    this.valuesTargetNumber -= assetPropertyValues.length;

    if (this.entry.timeOrdering === 'ASCENDING') {
      this.assetPropertyValueHistory.push(...limitedAssetPropertyValues);
    } else {
      this.assetPropertyValueHistory.unshift(
        ...limitedAssetPropertyValues.reverse()
      );
    }

    this.errorEntries = [
      ...(this.errorEntries ?? []),
      ...(errorsForEntry ?? []),
    ];
  }

  get isComplete() {
    return this.valuesTargetNumber <= 0;
  }

  get response() {
    return this.assetPropertyValueHistory;
  }

  get error() {
    return this.errorEntries?.at(0);
  }
}
