import { AssetModelQuery, AssetPropertyValueQuery, AssetSummaryQuery } from './types';
import { Subscriber } from 'rxjs';
import {
  AssetPropertyValue,
  AssetSummary,
  DescribeAssetCommand,
  DescribeAssetModelCommand,
  DescribeAssetModelResponse,
  GetAssetPropertyValueCommand,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetCache } from './cache';
import { SiteWiseAssetSession } from './session';

export class RequestProcessor {
  private readonly api: IoTSiteWiseClient;
  private readonly cache: SiteWiseAssetCache;

  constructor(api: IoTSiteWiseClient, cache: SiteWiseAssetCache) {
    this.api = api;
    this.cache = cache;
  }

  getAssetSummary(assetSummaryRequest: AssetSummaryQuery, observer: Subscriber<AssetSummary>) {
    let assetSummary = this.cache.getAssetSummary(assetSummaryRequest.assetId);
    if (assetSummary != undefined) {
      observer.next(assetSummary);
      observer.complete();
      return;
    }

    this.api.send(new DescribeAssetCommand({ assetId: assetSummaryRequest.assetId })).then((assetSummary) => {
      this.cache.storeAssetSummary(assetSummary);
      observer.next(this.cache.getAssetSummary(assetSummaryRequest.assetId));
      observer.complete();
    });
  }

  getAssetPropertyValue(assetPropertyValueRequest: AssetPropertyValueQuery, observer: Subscriber<AssetPropertyValue>) {
    let propertyValue = this.cache.getPropertyValue(
      assetPropertyValueRequest.assetId,
      assetPropertyValueRequest.propertyId
    );
    if (propertyValue != undefined) {
      observer.next(propertyValue);
      observer.complete();
      return;
    }

    this.api
      .send(
        new GetAssetPropertyValueCommand({
          assetId: assetPropertyValueRequest.assetId,
          propertyId: assetPropertyValueRequest.propertyId,
        })
      )
      .then((propertyValue) => {
        if (propertyValue.propertyValue != undefined) {
          this.cache.storePropertyValue(
            assetPropertyValueRequest.assetId,
            assetPropertyValueRequest.propertyId,
            propertyValue.propertyValue
          );
          observer.next(
            this.cache.getPropertyValue(assetPropertyValueRequest.assetId, assetPropertyValueRequest.propertyId)
          );
          observer.complete();
        }
        // TODO: if it is undefined, perform error handling
      });
  }

  getAssetModel(assetModelRequest: AssetModelQuery, observer: Subscriber<DescribeAssetModelResponse>) {
    let model = this.cache.getAssetModel(assetModelRequest.assetModelId);
    if (model != undefined) {
      observer.next(model);
      observer.complete();
      return;
    }

    this.api.send(new DescribeAssetModelCommand({ assetModelId: assetModelRequest.assetModelId })).then((model) => {
      this.cache.storeAssetModel(model);
      observer.next(this.cache.getAssetModel(assetModelRequest.assetModelId));
      observer.complete();
    });
  }

  startSession() {
    return new SiteWiseAssetSession(this);
  }
}
