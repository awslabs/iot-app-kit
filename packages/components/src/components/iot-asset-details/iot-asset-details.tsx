import { Component, h, Prop, State, Watch } from '@stencil/core';
import {
  getSiteWiseAssetModule,
  SiteWiseAssetSession,
  AssetSummaryQuery,
  AssetModelQuery,
  AssetPropertyValueQuery,
} from '@iot-app-kit/core';
import { AssetPropertyValue, AssetSummary, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';

@Component({
  tag: 'iot-asset-details',
  shadow: false,
})
export class IotAssetDetails {
  @Prop() query: AssetSummaryQuery;
  @State() assetSummary: AssetSummary | null = null;
  @State() assetModel: DescribeAssetModelResponse | null = null;
  @State() assetPropertyValues: Map<string, string> = new Map();

  @State() assetSession: SiteWiseAssetSession;

  componentWillLoad() {
    this.assetSession = getSiteWiseAssetModule().startSession();
    this.assetSession.requestAssetSummary(this.query, (summary: AssetSummary) => {
      this.assetSummary = summary;
      const assetId = this.assetSummary?.id as string;
      const modelQuery: AssetModelQuery = { assetModelId: this.assetSummary.assetModelId as string };
      this.assetSession.requestAssetModel(modelQuery, (assetModel: DescribeAssetModelResponse) => {
        this.assetModel = assetModel;
        assetModel.assetModelProperties?.forEach((prop) => {
          let propQuery: AssetPropertyValueQuery = { assetId: assetId, propertyId: prop.id as string };
          this.assetSession.requestAssetPropertyValue(propQuery, (propValue: AssetPropertyValue) => {
            const copy = new Map(this.assetPropertyValues);
            copy.set(prop.id as string, this.convertToString(propValue));
            this.assetPropertyValues = copy;
          });
        });
      });
    });
  }

  convertToString(propValue: AssetPropertyValue): string {
    if (propValue == undefined) {
      return '';
    }
    const value = propValue.value;
    return (
      value?.stringValue ||
      value?.booleanValue?.toString() ||
      value?.doubleValue?.toString(10) ||
      value?.integerValue?.toString(10) ||
      ''
    );
  }

  componentDidUnmount() {
    this.assetSession.close();
  }

  /**
   * Sync subscription to change in queried data
   */
  @Watch('query')
  onUpdateProp(newProp: unknown, oldProp: unknown) {
    /*  TODO:
    if (!isEqual(newProp, oldProp) && this.update != null) {
      this.update({
        query: this.query,
        requestInfo: this.requestInfo,
      });
    }
    */
  }

  render() {
    return (
      <div>
        <h2>{this.assetSummary?.name}</h2>
        <p>{this.assetSummary?.arn}</p>
        <p>
          <b>Model: </b>
          {this.assetModel?.assetModelName}
        </p>
        <ul>
          {this.assetModel?.assetModelProperties?.map((property) => (
            <li>
              {property.name}: {this.assetPropertyValues.get(property?.id as string)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
