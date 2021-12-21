/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { AnyDataStreamQuery, AssetSummaryQuery, AssetTreeSubscription, DataModule, Request, RequestConfig, SiteWiseAssetTreeQuery } from "@iot-app-kit/core";
import { DataStream, MinimalViewPortConfig } from "@synchro-charts/core";
import { TableProps } from "@awsui/components-react/table";
import { EmptyStateProps, ITreeNode, UseTreeCollection } from "@iot-app-kit/related-table";
import { FilterTexts } from "./components/iot-resource-explorer/types";
import { NonCancelableCustomEvent } from "@awsui/components-react";
export namespace Components {
    interface IotAssetDetails {
        "query": AssetSummaryQuery;
    }
    interface IotAssetTreeDemo {
        "query": SiteWiseAssetTreeQuery;
        "subscription": AssetTreeSubscription;
    }
    interface IotBarChart {
        "appKit": DataModule;
        "isEditing": boolean | undefined;
        "query": AnyDataStreamQuery;
        "requestConfig": RequestConfig | undefined;
        "viewport": MinimalViewPortConfig;
        "widgetId": string;
    }
    interface IotConnector {
        "appKit": DataModule;
        "query": AnyDataStreamQuery;
        "renderFunc": ({ dataStreams }: { dataStreams: DataStream[] }) => unknown;
        "requestInfo": Request;
    }
    interface IotKpi {
        "appKit": DataModule;
        "isEditing": boolean | undefined;
        "query": AnyDataStreamQuery;
        "requestConfig": RequestConfig | undefined;
        "viewport": MinimalViewPortConfig;
        "widgetId": string;
    }
    interface IotLineChart {
        "appKit": DataModule;
        "isEditing": boolean | undefined;
        "query": AnyDataStreamQuery;
        "requestConfig": RequestConfig | undefined;
        "viewport": MinimalViewPortConfig;
        "widgetId": string;
    }
    interface IotScatterChart {
        "appKit": DataModule;
        "isEditing": boolean | undefined;
        "query": AnyDataStreamQuery;
        "requestConfig": RequestConfig | undefined;
        "viewport": MinimalViewPortConfig;
        "widgetId": string;
    }
    interface IotStatusGrid {
        "appKit": DataModule;
        "isEditing": boolean | undefined;
        "query": AnyDataStreamQuery;
        "requestConfig": RequestConfig | undefined;
        "viewport": MinimalViewPortConfig;
        "widgetId": string;
    }
    interface IotStatusTimeline {
        "appKit": DataModule;
        "isEditing": boolean | undefined;
        "query": AnyDataStreamQuery;
        "requestConfig": RequestConfig | undefined;
        "viewport": MinimalViewPortConfig;
        "widgetId": string;
    }
    interface IotTable {
        "appKit": DataModule;
        "query": AnyDataStreamQuery;
        "requestConfig": RequestConfig | undefined;
        "viewport": MinimalViewPortConfig;
        "widgetId": string;
    }
    interface IotTestRoutes {
    }
    interface IotTreeTable {
        "ariaLabels": TableProps.AriaLabels<unknown>;
        "collectionOptions": UseTreeCollection<unknown>;
        "columnDefinitions": TableProps.ColumnDefinition<unknown>[];
        "empty": EmptyStateProps;
        "filterTexts": FilterTexts;
        "isItemDisabled": (item: unknown) => boolean;
        "items": unknown[];
        "loading": boolean;
        "loadingText": string;
        "onExpandChildren": (node: ITreeNode<any>) => void;
        "onSelectionChange": (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => void;
        "onSortingChange": (event: NonCancelableCustomEvent<TableProps.SortingState<unknown>>) => void;
        "resizableColumns": boolean;
        "selectionType": TableProps.SelectionType;
        "sortingDisabled": boolean;
        "wrapLines": boolean;
    }
    interface IotTreeTableDemo {
    }
    interface SitewiseResourceExplorer {
        "empty"?: EmptyStateProps;
        "filterTexts"?: FilterTexts;
        "loadingText"?: string;
        "query": SiteWiseAssetTreeQuery;
        "selectionType"?: TableProps.SelectionType;
    }
    interface SitewiseResourceExplorerDemo {
    }
    interface TestingGround {
    }
}
declare global {
    interface HTMLIotAssetDetailsElement extends Components.IotAssetDetails, HTMLStencilElement {
    }
    var HTMLIotAssetDetailsElement: {
        prototype: HTMLIotAssetDetailsElement;
        new (): HTMLIotAssetDetailsElement;
    };
    interface HTMLIotAssetTreeDemoElement extends Components.IotAssetTreeDemo, HTMLStencilElement {
    }
    var HTMLIotAssetTreeDemoElement: {
        prototype: HTMLIotAssetTreeDemoElement;
        new (): HTMLIotAssetTreeDemoElement;
    };
    interface HTMLIotBarChartElement extends Components.IotBarChart, HTMLStencilElement {
    }
    var HTMLIotBarChartElement: {
        prototype: HTMLIotBarChartElement;
        new (): HTMLIotBarChartElement;
    };
    interface HTMLIotConnectorElement extends Components.IotConnector, HTMLStencilElement {
    }
    var HTMLIotConnectorElement: {
        prototype: HTMLIotConnectorElement;
        new (): HTMLIotConnectorElement;
    };
    interface HTMLIotKpiElement extends Components.IotKpi, HTMLStencilElement {
    }
    var HTMLIotKpiElement: {
        prototype: HTMLIotKpiElement;
        new (): HTMLIotKpiElement;
    };
    interface HTMLIotLineChartElement extends Components.IotLineChart, HTMLStencilElement {
    }
    var HTMLIotLineChartElement: {
        prototype: HTMLIotLineChartElement;
        new (): HTMLIotLineChartElement;
    };
    interface HTMLIotScatterChartElement extends Components.IotScatterChart, HTMLStencilElement {
    }
    var HTMLIotScatterChartElement: {
        prototype: HTMLIotScatterChartElement;
        new (): HTMLIotScatterChartElement;
    };
    interface HTMLIotStatusGridElement extends Components.IotStatusGrid, HTMLStencilElement {
    }
    var HTMLIotStatusGridElement: {
        prototype: HTMLIotStatusGridElement;
        new (): HTMLIotStatusGridElement;
    };
    interface HTMLIotStatusTimelineElement extends Components.IotStatusTimeline, HTMLStencilElement {
    }
    var HTMLIotStatusTimelineElement: {
        prototype: HTMLIotStatusTimelineElement;
        new (): HTMLIotStatusTimelineElement;
    };
    interface HTMLIotTableElement extends Components.IotTable, HTMLStencilElement {
    }
    var HTMLIotTableElement: {
        prototype: HTMLIotTableElement;
        new (): HTMLIotTableElement;
    };
    interface HTMLIotTestRoutesElement extends Components.IotTestRoutes, HTMLStencilElement {
    }
    var HTMLIotTestRoutesElement: {
        prototype: HTMLIotTestRoutesElement;
        new (): HTMLIotTestRoutesElement;
    };
    interface HTMLIotTreeTableElement extends Components.IotTreeTable, HTMLStencilElement {
    }
    var HTMLIotTreeTableElement: {
        prototype: HTMLIotTreeTableElement;
        new (): HTMLIotTreeTableElement;
    };
    interface HTMLIotTreeTableDemoElement extends Components.IotTreeTableDemo, HTMLStencilElement {
    }
    var HTMLIotTreeTableDemoElement: {
        prototype: HTMLIotTreeTableDemoElement;
        new (): HTMLIotTreeTableDemoElement;
    };
    interface HTMLSitewiseResourceExplorerElement extends Components.SitewiseResourceExplorer, HTMLStencilElement {
    }
    var HTMLSitewiseResourceExplorerElement: {
        prototype: HTMLSitewiseResourceExplorerElement;
        new (): HTMLSitewiseResourceExplorerElement;
    };
    interface HTMLSitewiseResourceExplorerDemoElement extends Components.SitewiseResourceExplorerDemo, HTMLStencilElement {
    }
    var HTMLSitewiseResourceExplorerDemoElement: {
        prototype: HTMLSitewiseResourceExplorerDemoElement;
        new (): HTMLSitewiseResourceExplorerDemoElement;
    };
    interface HTMLTestingGroundElement extends Components.TestingGround, HTMLStencilElement {
    }
    var HTMLTestingGroundElement: {
        prototype: HTMLTestingGroundElement;
        new (): HTMLTestingGroundElement;
    };
    interface HTMLElementTagNameMap {
        "iot-asset-details": HTMLIotAssetDetailsElement;
        "iot-asset-tree-demo": HTMLIotAssetTreeDemoElement;
        "iot-bar-chart": HTMLIotBarChartElement;
        "iot-connector": HTMLIotConnectorElement;
        "iot-kpi": HTMLIotKpiElement;
        "iot-line-chart": HTMLIotLineChartElement;
        "iot-scatter-chart": HTMLIotScatterChartElement;
        "iot-status-grid": HTMLIotStatusGridElement;
        "iot-status-timeline": HTMLIotStatusTimelineElement;
        "iot-table": HTMLIotTableElement;
        "iot-test-routes": HTMLIotTestRoutesElement;
        "iot-tree-table": HTMLIotTreeTableElement;
        "iot-tree-table-demo": HTMLIotTreeTableDemoElement;
        "sitewise-resource-explorer": HTMLSitewiseResourceExplorerElement;
        "sitewise-resource-explorer-demo": HTMLSitewiseResourceExplorerDemoElement;
        "testing-ground": HTMLTestingGroundElement;
    }
}
declare namespace LocalJSX {
    interface IotAssetDetails {
        "query"?: AssetSummaryQuery;
    }
    interface IotAssetTreeDemo {
        "query"?: SiteWiseAssetTreeQuery;
        "subscription"?: AssetTreeSubscription;
    }
    interface IotBarChart {
        "appKit"?: DataModule;
        "isEditing"?: boolean | undefined;
        "query"?: AnyDataStreamQuery;
        "requestConfig"?: RequestConfig | undefined;
        "viewport"?: MinimalViewPortConfig;
        "widgetId"?: string;
    }
    interface IotConnector {
        "appKit"?: DataModule;
        "query"?: AnyDataStreamQuery;
        "renderFunc"?: ({ dataStreams }: { dataStreams: DataStream[] }) => unknown;
        "requestInfo"?: Request;
    }
    interface IotKpi {
        "appKit"?: DataModule;
        "isEditing"?: boolean | undefined;
        "query"?: AnyDataStreamQuery;
        "requestConfig"?: RequestConfig | undefined;
        "viewport"?: MinimalViewPortConfig;
        "widgetId"?: string;
    }
    interface IotLineChart {
        "appKit"?: DataModule;
        "isEditing"?: boolean | undefined;
        "query"?: AnyDataStreamQuery;
        "requestConfig"?: RequestConfig | undefined;
        "viewport"?: MinimalViewPortConfig;
        "widgetId"?: string;
    }
    interface IotScatterChart {
        "appKit"?: DataModule;
        "isEditing"?: boolean | undefined;
        "query"?: AnyDataStreamQuery;
        "requestConfig"?: RequestConfig | undefined;
        "viewport"?: MinimalViewPortConfig;
        "widgetId"?: string;
    }
    interface IotStatusGrid {
        "appKit"?: DataModule;
        "isEditing"?: boolean | undefined;
        "query"?: AnyDataStreamQuery;
        "requestConfig"?: RequestConfig | undefined;
        "viewport"?: MinimalViewPortConfig;
        "widgetId"?: string;
    }
    interface IotStatusTimeline {
        "appKit"?: DataModule;
        "isEditing"?: boolean | undefined;
        "query"?: AnyDataStreamQuery;
        "requestConfig"?: RequestConfig | undefined;
        "viewport"?: MinimalViewPortConfig;
        "widgetId"?: string;
    }
    interface IotTable {
        "appKit"?: DataModule;
        "query"?: AnyDataStreamQuery;
        "requestConfig"?: RequestConfig | undefined;
        "viewport"?: MinimalViewPortConfig;
        "widgetId"?: string;
    }
    interface IotTestRoutes {
    }
    interface IotTreeTable {
        "ariaLabels"?: TableProps.AriaLabels<unknown>;
        "collectionOptions": UseTreeCollection<unknown>;
        "columnDefinitions": TableProps.ColumnDefinition<unknown>[];
        "empty"?: EmptyStateProps;
        "filterTexts"?: FilterTexts;
        "isItemDisabled"?: (item: unknown) => boolean;
        "items": unknown[];
        "loading"?: boolean;
        "loadingText"?: string;
        "onExpandChildren"?: (node: ITreeNode<any>) => void;
        "onSelectionChange"?: (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => void;
        "onSortingChange"?: (event: NonCancelableCustomEvent<TableProps.SortingState<unknown>>) => void;
        "resizableColumns"?: boolean;
        "selectionType"?: TableProps.SelectionType;
        "sortingDisabled"?: boolean;
        "wrapLines"?: boolean;
    }
    interface IotTreeTableDemo {
    }
    interface SitewiseResourceExplorer {
        "empty"?: EmptyStateProps;
        "filterTexts"?: FilterTexts;
        "loadingText"?: string;
        "query"?: SiteWiseAssetTreeQuery;
        "selectionType"?: TableProps.SelectionType;
    }
    interface SitewiseResourceExplorerDemo {
    }
    interface TestingGround {
    }
    interface IntrinsicElements {
        "iot-asset-details": IotAssetDetails;
        "iot-asset-tree-demo": IotAssetTreeDemo;
        "iot-bar-chart": IotBarChart;
        "iot-connector": IotConnector;
        "iot-kpi": IotKpi;
        "iot-line-chart": IotLineChart;
        "iot-scatter-chart": IotScatterChart;
        "iot-status-grid": IotStatusGrid;
        "iot-status-timeline": IotStatusTimeline;
        "iot-table": IotTable;
        "iot-test-routes": IotTestRoutes;
        "iot-tree-table": IotTreeTable;
        "iot-tree-table-demo": IotTreeTableDemo;
        "sitewise-resource-explorer": SitewiseResourceExplorer;
        "sitewise-resource-explorer-demo": SitewiseResourceExplorerDemo;
        "testing-ground": TestingGround;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "iot-asset-details": LocalJSX.IotAssetDetails & JSXBase.HTMLAttributes<HTMLIotAssetDetailsElement>;
            "iot-asset-tree-demo": LocalJSX.IotAssetTreeDemo & JSXBase.HTMLAttributes<HTMLIotAssetTreeDemoElement>;
            "iot-bar-chart": LocalJSX.IotBarChart & JSXBase.HTMLAttributes<HTMLIotBarChartElement>;
            "iot-connector": LocalJSX.IotConnector & JSXBase.HTMLAttributes<HTMLIotConnectorElement>;
            "iot-kpi": LocalJSX.IotKpi & JSXBase.HTMLAttributes<HTMLIotKpiElement>;
            "iot-line-chart": LocalJSX.IotLineChart & JSXBase.HTMLAttributes<HTMLIotLineChartElement>;
            "iot-scatter-chart": LocalJSX.IotScatterChart & JSXBase.HTMLAttributes<HTMLIotScatterChartElement>;
            "iot-status-grid": LocalJSX.IotStatusGrid & JSXBase.HTMLAttributes<HTMLIotStatusGridElement>;
            "iot-status-timeline": LocalJSX.IotStatusTimeline & JSXBase.HTMLAttributes<HTMLIotStatusTimelineElement>;
            "iot-table": LocalJSX.IotTable & JSXBase.HTMLAttributes<HTMLIotTableElement>;
            "iot-test-routes": LocalJSX.IotTestRoutes & JSXBase.HTMLAttributes<HTMLIotTestRoutesElement>;
            "iot-tree-table": LocalJSX.IotTreeTable & JSXBase.HTMLAttributes<HTMLIotTreeTableElement>;
            "iot-tree-table-demo": LocalJSX.IotTreeTableDemo & JSXBase.HTMLAttributes<HTMLIotTreeTableDemoElement>;
            "sitewise-resource-explorer": LocalJSX.SitewiseResourceExplorer & JSXBase.HTMLAttributes<HTMLSitewiseResourceExplorerElement>;
            "sitewise-resource-explorer-demo": LocalJSX.SitewiseResourceExplorerDemo & JSXBase.HTMLAttributes<HTMLSitewiseResourceExplorerDemoElement>;
            "testing-ground": LocalJSX.TestingGround & JSXBase.HTMLAttributes<HTMLTestingGroundElement>;
        }
    }
}
