/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Annotations, TableColumn } from "@synchro-charts/core";
import { Provider, StyleSettingsMap, TimeQuery, TimeSeriesData, TimeSeriesDataRequest, TimeSeriesDataRequestSettings, TreeQuery, Viewport } from "@iot-app-kit/core";
import { BranchReference, SiteWiseAssetTreeNode } from "@iot-app-kit/source-iotsitewise";
import { ColumnDefinition, FilterTexts } from "./components/iot-resource-explorer/types";
import { TableProps } from "@awsui/components-react/table";
import { EmptyStateProps, ITreeNode, UseTreeCollection } from "@iot-app-kit/related-table";
import { NonCancelableCustomEvent } from "@awsui/components-react";
export namespace Components {
    interface IotBarChart {
        "annotations": Annotations;
        "isEditing": boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "styleSettings": StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotKpi {
        "annotations": Annotations;
        "isEditing": boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "styleSettings": StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotLineChart {
        "annotations": Annotations;
        "isEditing": boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "styleSettings": StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotResourceExplorer {
        "columnDefinitions": ColumnDefinition<any>[];
        "empty"?: EmptyStateProps;
        "expand"?: boolean;
        "filterEnabled": boolean;
        "filterTexts"?: FilterTexts;
        "loadingText"?: string;
        "onSelectionChange": (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => void;
        "paginationEnabled": boolean;
        "query": TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
        "selectionType"?: TableProps.SelectionType;
        "sortingEnabled": boolean;
        "widgetId": string;
        "wrapLines": boolean;
    }
    interface IotResourceExplorerDemo {
    }
    interface IotScatterChart {
        "annotations": Annotations;
        "isEditing": boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "styleSettings": StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotStatusGrid {
        "annotations": Annotations;
        "isEditing": boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "styleSettings": StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotStatusTimeline {
        "annotations": Annotations;
        "isEditing": boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "styleSettings": StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotTable {
        "annotations": Annotations;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "styleSettings": StyleSettingsMap | undefined;
        "tableColumns": TableColumn[];
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotTestRoutes {
    }
    interface IotTimeSeriesConnector {
        "assignDefaultColors": boolean | undefined;
        "initialViewport": Viewport;
        "provider": Provider<TimeSeriesData[]>;
        "renderFunc": (data: TimeSeriesData) => void;
        "styleSettings": StyleSettingsMap | undefined;
    }
    interface IotTreeTable {
        "ariaLabels": TableProps.AriaLabels<unknown>;
        "collectionOptions": UseTreeCollection<unknown>;
        "columnDefinitions": TableProps.ColumnDefinition<any>[];
        "empty": EmptyStateProps;
        "expand": boolean;
        "filterPlaceholder": string;
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
    interface IotWebglContext {
    }
    interface TestingGround {
    }
}
declare global {
    interface HTMLIotBarChartElement extends Components.IotBarChart, HTMLStencilElement {
    }
    var HTMLIotBarChartElement: {
        prototype: HTMLIotBarChartElement;
        new (): HTMLIotBarChartElement;
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
    interface HTMLIotResourceExplorerElement extends Components.IotResourceExplorer, HTMLStencilElement {
    }
    var HTMLIotResourceExplorerElement: {
        prototype: HTMLIotResourceExplorerElement;
        new (): HTMLIotResourceExplorerElement;
    };
    interface HTMLIotResourceExplorerDemoElement extends Components.IotResourceExplorerDemo, HTMLStencilElement {
    }
    var HTMLIotResourceExplorerDemoElement: {
        prototype: HTMLIotResourceExplorerDemoElement;
        new (): HTMLIotResourceExplorerDemoElement;
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
    interface HTMLIotTimeSeriesConnectorElement extends Components.IotTimeSeriesConnector, HTMLStencilElement {
    }
    var HTMLIotTimeSeriesConnectorElement: {
        prototype: HTMLIotTimeSeriesConnectorElement;
        new (): HTMLIotTimeSeriesConnectorElement;
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
    interface HTMLIotWebglContextElement extends Components.IotWebglContext, HTMLStencilElement {
    }
    var HTMLIotWebglContextElement: {
        prototype: HTMLIotWebglContextElement;
        new (): HTMLIotWebglContextElement;
    };
    interface HTMLTestingGroundElement extends Components.TestingGround, HTMLStencilElement {
    }
    var HTMLTestingGroundElement: {
        prototype: HTMLTestingGroundElement;
        new (): HTMLTestingGroundElement;
    };
    interface HTMLElementTagNameMap {
        "iot-bar-chart": HTMLIotBarChartElement;
        "iot-kpi": HTMLIotKpiElement;
        "iot-line-chart": HTMLIotLineChartElement;
        "iot-resource-explorer": HTMLIotResourceExplorerElement;
        "iot-resource-explorer-demo": HTMLIotResourceExplorerDemoElement;
        "iot-scatter-chart": HTMLIotScatterChartElement;
        "iot-status-grid": HTMLIotStatusGridElement;
        "iot-status-timeline": HTMLIotStatusTimelineElement;
        "iot-table": HTMLIotTableElement;
        "iot-test-routes": HTMLIotTestRoutesElement;
        "iot-time-series-connector": HTMLIotTimeSeriesConnectorElement;
        "iot-tree-table": HTMLIotTreeTableElement;
        "iot-tree-table-demo": HTMLIotTreeTableDemoElement;
        "iot-webgl-context": HTMLIotWebglContextElement;
        "testing-ground": HTMLTestingGroundElement;
    }
}
declare namespace LocalJSX {
    interface IotBarChart {
        "annotations"?: Annotations;
        "isEditing"?: boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "styleSettings"?: StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotKpi {
        "annotations"?: Annotations;
        "isEditing"?: boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "styleSettings"?: StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotLineChart {
        "annotations"?: Annotations;
        "isEditing"?: boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "styleSettings"?: StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotResourceExplorer {
        "columnDefinitions"?: ColumnDefinition<any>[];
        "empty"?: EmptyStateProps;
        "expand"?: boolean;
        "filterEnabled"?: boolean;
        "filterTexts"?: FilterTexts;
        "loadingText"?: string;
        "onSelectionChange"?: (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => void;
        "paginationEnabled"?: boolean;
        "query"?: TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
        "selectionType"?: TableProps.SelectionType;
        "sortingEnabled"?: boolean;
        "widgetId"?: string;
        "wrapLines"?: boolean;
    }
    interface IotResourceExplorerDemo {
    }
    interface IotScatterChart {
        "annotations"?: Annotations;
        "isEditing"?: boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "styleSettings"?: StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotStatusGrid {
        "annotations"?: Annotations;
        "isEditing"?: boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "styleSettings"?: StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotStatusTimeline {
        "annotations"?: Annotations;
        "isEditing"?: boolean | undefined;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "styleSettings"?: StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotTable {
        "annotations"?: Annotations;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "styleSettings"?: StyleSettingsMap | undefined;
        "tableColumns"?: TableColumn[];
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotTestRoutes {
    }
    interface IotTimeSeriesConnector {
        "assignDefaultColors"?: boolean | undefined;
        "initialViewport"?: Viewport;
        "provider"?: Provider<TimeSeriesData[]>;
        "renderFunc"?: (data: TimeSeriesData) => void;
        "styleSettings"?: StyleSettingsMap | undefined;
    }
    interface IotTreeTable {
        "ariaLabels"?: TableProps.AriaLabels<unknown>;
        "collectionOptions": UseTreeCollection<unknown>;
        "columnDefinitions": TableProps.ColumnDefinition<any>[];
        "empty"?: EmptyStateProps;
        "expand"?: boolean;
        "filterPlaceholder"?: string;
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
    interface IotWebglContext {
    }
    interface TestingGround {
    }
    interface IntrinsicElements {
        "iot-bar-chart": IotBarChart;
        "iot-kpi": IotKpi;
        "iot-line-chart": IotLineChart;
        "iot-resource-explorer": IotResourceExplorer;
        "iot-resource-explorer-demo": IotResourceExplorerDemo;
        "iot-scatter-chart": IotScatterChart;
        "iot-status-grid": IotStatusGrid;
        "iot-status-timeline": IotStatusTimeline;
        "iot-table": IotTable;
        "iot-test-routes": IotTestRoutes;
        "iot-time-series-connector": IotTimeSeriesConnector;
        "iot-tree-table": IotTreeTable;
        "iot-tree-table-demo": IotTreeTableDemo;
        "iot-webgl-context": IotWebglContext;
        "testing-ground": TestingGround;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "iot-bar-chart": LocalJSX.IotBarChart & JSXBase.HTMLAttributes<HTMLIotBarChartElement>;
            "iot-kpi": LocalJSX.IotKpi & JSXBase.HTMLAttributes<HTMLIotKpiElement>;
            "iot-line-chart": LocalJSX.IotLineChart & JSXBase.HTMLAttributes<HTMLIotLineChartElement>;
            "iot-resource-explorer": LocalJSX.IotResourceExplorer & JSXBase.HTMLAttributes<HTMLIotResourceExplorerElement>;
            "iot-resource-explorer-demo": LocalJSX.IotResourceExplorerDemo & JSXBase.HTMLAttributes<HTMLIotResourceExplorerDemoElement>;
            "iot-scatter-chart": LocalJSX.IotScatterChart & JSXBase.HTMLAttributes<HTMLIotScatterChartElement>;
            "iot-status-grid": LocalJSX.IotStatusGrid & JSXBase.HTMLAttributes<HTMLIotStatusGridElement>;
            "iot-status-timeline": LocalJSX.IotStatusTimeline & JSXBase.HTMLAttributes<HTMLIotStatusTimelineElement>;
            "iot-table": LocalJSX.IotTable & JSXBase.HTMLAttributes<HTMLIotTableElement>;
            "iot-test-routes": LocalJSX.IotTestRoutes & JSXBase.HTMLAttributes<HTMLIotTestRoutesElement>;
            "iot-time-series-connector": LocalJSX.IotTimeSeriesConnector & JSXBase.HTMLAttributes<HTMLIotTimeSeriesConnectorElement>;
            "iot-tree-table": LocalJSX.IotTreeTable & JSXBase.HTMLAttributes<HTMLIotTreeTableElement>;
            "iot-tree-table-demo": LocalJSX.IotTreeTableDemo & JSXBase.HTMLAttributes<HTMLIotTreeTableDemoElement>;
            "iot-webgl-context": LocalJSX.IotWebglContext & JSXBase.HTMLAttributes<HTMLIotWebglContextElement>;
            "testing-ground": LocalJSX.TestingGround & JSXBase.HTMLAttributes<HTMLTestingGroundElement>;
        }
    }
}
