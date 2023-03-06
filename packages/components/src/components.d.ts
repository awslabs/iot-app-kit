/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { DataType, Provider, StyleSettingsMap, TimeQuery, TimeSeriesData, TimeSeriesDataRequest, TimeSeriesDataRequestSettings, TreeQuery, Viewport } from "@iot-app-kit/core";
import { AlarmsConfig, Annotations, Axis, LabelsConfig, LayoutConfig, LegendConfig, MessageOverrides, MinimalSizeConfig, MovementConfig, ScaleConfig, TableColumn, Trend } from "@synchro-charts/core";
import { Item, RecursivePartial, TableItem, TableMessages, TableProps } from "@iot-app-kit/table";
import { BranchReference, SiteWiseAssetTreeNode } from "@iot-app-kit/source-iotsitewise";
import { ColumnDefinition, FilterTexts } from "./components/iot-resource-explorer/types";
import { TableProps as TableProps1 } from "@awsui/components-react/table";
import { EmptyStateProps, ITreeNode, UseTreeCollection } from "@iot-app-kit/related-table";
import { NonCancelableCustomEvent } from "@awsui/components-react";
export namespace Components {
    interface IotBarChart {
        "alarms"?: AlarmsConfig;
        "annotations": Annotations;
        "axis"?: Axis.Options;
        "gestures"?: boolean;
        "isEditing": boolean | undefined;
        "layout"?: LayoutConfig;
        "legend"?: LegendConfig;
        "messageOverrides"?: MessageOverrides;
        "movement"?: MovementConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "scale"?: ScaleConfig;
        "settings": TimeSeriesDataRequestSettings;
        "size"?: MinimalSizeConfig;
        "styleSettings": StyleSettingsMap | undefined;
        "trends": Trend[];
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotKpi {
        "annotations": Annotations;
        "isEditing": boolean | undefined;
        "messageOverrides"?: MessageOverrides;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "styleSettings": StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotLineChart {
        "annotations": Annotations;
        "axis": Axis.Options;
        "gestures"?: boolean;
        "isEditing": boolean | undefined;
        "layout"?: LayoutConfig;
        "legend"?: LegendConfig;
        "messageOverrides": MessageOverrides;
        "movement"?: MovementConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "scale"?: ScaleConfig;
        "settings": TimeSeriesDataRequestSettings;
        "size"?: MinimalSizeConfig;
        "styleSettings": StyleSettingsMap | undefined;
        "trends": Trend[];
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotReactTable {
        "columnDefinitions": TableProps['columnDefinitions'];
        "items": TableItem[];
        "messageOverrides": TableMessages;
        "propertyFiltering": TableProps['propertyFiltering'];
        "sorting": TableProps['sorting'];
    }
    interface IotResourceExplorer {
        "columnDefinitions": ColumnDefinition<any>[];
        "empty"?: EmptyStateProps;
        "expanded"?: boolean;
        "filterEnabled": boolean;
        "filterTexts"?: FilterTexts;
        "loadingText"?: string;
        "onSelectionChange": (event: NonCancelableCustomEvent<TableProps1.SelectionChangeDetail<unknown>>) => void;
        "paginationEnabled": boolean;
        "query": TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
        "selectionType"?: TableProps1.SelectionType;
        "sortingEnabled": boolean;
        "widgetId": string;
        "wrapLines": boolean;
    }
    interface IotScatterChart {
        "alarms"?: AlarmsConfig;
        "annotations": Annotations;
        "axis"?: Axis.Options;
        "gestures"?: boolean;
        "isEditing": boolean | undefined;
        "layout"?: LayoutConfig;
        "legend"?: LegendConfig;
        "messageOverrides"?: MessageOverrides;
        "movement"?: MovementConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "scale"?: ScaleConfig;
        "settings": TimeSeriesDataRequestSettings;
        "size"?: MinimalSizeConfig;
        "styleSettings": StyleSettingsMap | undefined;
        "trends": Trend[];
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotStatusGrid {
        "annotations": Annotations;
        "isEditing": boolean | undefined;
        "labelsConfig": LabelsConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "styleSettings": StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotStatusTimeline {
        "alarms"?: AlarmsConfig;
        "annotations"?: Annotations;
        "axis"?: Axis.Options;
        "gestures"?: boolean;
        "isEditing": boolean | undefined;
        "layout"?: LayoutConfig;
        "messageOverrides"?: MessageOverrides;
        "movement"?: MovementConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "scale"?: ScaleConfig;
        "settings": TimeSeriesDataRequestSettings;
        "size"?: MinimalSizeConfig;
        "styleSettings": StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotTable {
        "annotations": Annotations;
        "columnDefinitions": TableProps['columnDefinitions'];
        "items": Item[];
        "messageOverrides"?: RecursivePartial<TableMessages>;
        "propertyFiltering": TableProps['propertyFiltering'];
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings": TimeSeriesDataRequestSettings;
        "sorting": TableProps['sorting'];
        "styleSettings": StyleSettingsMap | undefined;
        "tableColumns": TableColumn[];
        "trends": Trend[];
        "viewport": Viewport;
        "widgetId": string;
    }
    interface IotTimeSeriesConnector {
        "annotations": Annotations;
        "assignDefaultColors": boolean | undefined;
        "provider": Provider<TimeSeriesData[]>;
        "renderFunc": (data: TimeSeriesData) => void;
        "styleSettings": StyleSettingsMap | undefined;
        "supportedDataTypes": DataType[];
    }
    interface IotTreeTable {
        "ariaLabels": TableProps1.AriaLabels<unknown>;
        "collectionOptions": UseTreeCollection<unknown>;
        "columnDefinitions": TableProps1.ColumnDefinition<any>[];
        "empty": EmptyStateProps;
        "expanded": boolean;
        "filterPlaceholder": string;
        "isItemDisabled": (item: unknown) => boolean;
        "items": unknown[];
        "loading": boolean;
        "loadingText": string;
        "onExpandChildren": (node: ITreeNode<any>) => void;
        "onSelectionChange": (event: NonCancelableCustomEvent<TableProps1.SelectionChangeDetail<unknown>>) => void;
        "onSortingChange": (event: NonCancelableCustomEvent<TableProps1.SortingState<unknown>>) => void;
        "resizableColumns": boolean;
        "selectionType": TableProps1.SelectionType;
        "sortingDisabled": boolean;
        "wrapLines": boolean;
    }
    interface IotWebglContext {
        "viewFrame": HTMLElement | Window | undefined;
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
    interface HTMLIotReactTableElement extends Components.IotReactTable, HTMLStencilElement {
    }
    var HTMLIotReactTableElement: {
        prototype: HTMLIotReactTableElement;
        new (): HTMLIotReactTableElement;
    };
    interface HTMLIotResourceExplorerElement extends Components.IotResourceExplorer, HTMLStencilElement {
    }
    var HTMLIotResourceExplorerElement: {
        prototype: HTMLIotResourceExplorerElement;
        new (): HTMLIotResourceExplorerElement;
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
    interface HTMLIotWebglContextElement extends Components.IotWebglContext, HTMLStencilElement {
    }
    var HTMLIotWebglContextElement: {
        prototype: HTMLIotWebglContextElement;
        new (): HTMLIotWebglContextElement;
    };
    interface HTMLElementTagNameMap {
        "iot-bar-chart": HTMLIotBarChartElement;
        "iot-kpi": HTMLIotKpiElement;
        "iot-line-chart": HTMLIotLineChartElement;
        "iot-react-table": HTMLIotReactTableElement;
        "iot-resource-explorer": HTMLIotResourceExplorerElement;
        "iot-scatter-chart": HTMLIotScatterChartElement;
        "iot-status-grid": HTMLIotStatusGridElement;
        "iot-status-timeline": HTMLIotStatusTimelineElement;
        "iot-table": HTMLIotTableElement;
        "iot-time-series-connector": HTMLIotTimeSeriesConnectorElement;
        "iot-tree-table": HTMLIotTreeTableElement;
        "iot-webgl-context": HTMLIotWebglContextElement;
    }
}
declare namespace LocalJSX {
    interface IotBarChart {
        "alarms"?: AlarmsConfig;
        "annotations"?: Annotations;
        "axis"?: Axis.Options;
        "gestures"?: boolean;
        "isEditing"?: boolean | undefined;
        "layout"?: LayoutConfig;
        "legend"?: LegendConfig;
        "messageOverrides"?: MessageOverrides;
        "movement"?: MovementConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "scale"?: ScaleConfig;
        "settings"?: TimeSeriesDataRequestSettings;
        "size"?: MinimalSizeConfig;
        "styleSettings"?: StyleSettingsMap | undefined;
        "trends"?: Trend[];
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotKpi {
        "annotations"?: Annotations;
        "isEditing"?: boolean | undefined;
        "messageOverrides"?: MessageOverrides;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "styleSettings"?: StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotLineChart {
        "annotations"?: Annotations;
        "axis"?: Axis.Options;
        "gestures"?: boolean;
        "isEditing"?: boolean | undefined;
        "layout"?: LayoutConfig;
        "legend"?: LegendConfig;
        "messageOverrides"?: MessageOverrides;
        "movement"?: MovementConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "scale"?: ScaleConfig;
        "settings"?: TimeSeriesDataRequestSettings;
        "size"?: MinimalSizeConfig;
        "styleSettings"?: StyleSettingsMap | undefined;
        "trends"?: Trend[];
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotReactTable {
        "columnDefinitions": TableProps['columnDefinitions'];
        "items": TableItem[];
        "messageOverrides"?: TableMessages;
        "propertyFiltering"?: TableProps['propertyFiltering'];
        "sorting"?: TableProps['sorting'];
    }
    interface IotResourceExplorer {
        "columnDefinitions"?: ColumnDefinition<any>[];
        "empty"?: EmptyStateProps;
        "expanded"?: boolean;
        "filterEnabled"?: boolean;
        "filterTexts"?: FilterTexts;
        "loadingText"?: string;
        "onSelectionChange"?: (event: NonCancelableCustomEvent<TableProps1.SelectionChangeDetail<unknown>>) => void;
        "paginationEnabled"?: boolean;
        "query"?: TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
        "selectionType"?: TableProps1.SelectionType;
        "sortingEnabled"?: boolean;
        "widgetId"?: string;
        "wrapLines"?: boolean;
    }
    interface IotScatterChart {
        "alarms"?: AlarmsConfig;
        "annotations"?: Annotations;
        "axis"?: Axis.Options;
        "gestures"?: boolean;
        "isEditing"?: boolean | undefined;
        "layout"?: LayoutConfig;
        "legend"?: LegendConfig;
        "messageOverrides"?: MessageOverrides;
        "movement"?: MovementConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "scale"?: ScaleConfig;
        "settings"?: TimeSeriesDataRequestSettings;
        "size"?: MinimalSizeConfig;
        "styleSettings"?: StyleSettingsMap | undefined;
        "trends"?: Trend[];
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotStatusGrid {
        "annotations"?: Annotations;
        "isEditing"?: boolean | undefined;
        "labelsConfig"?: LabelsConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "styleSettings"?: StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotStatusTimeline {
        "alarms"?: AlarmsConfig;
        "annotations"?: Annotations;
        "axis"?: Axis.Options;
        "gestures"?: boolean;
        "isEditing"?: boolean | undefined;
        "layout"?: LayoutConfig;
        "messageOverrides"?: MessageOverrides;
        "movement"?: MovementConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "scale"?: ScaleConfig;
        "settings"?: TimeSeriesDataRequestSettings;
        "size"?: MinimalSizeConfig;
        "styleSettings"?: StyleSettingsMap | undefined;
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotTable {
        "annotations"?: Annotations;
        "columnDefinitions": TableProps['columnDefinitions'];
        "items": Item[];
        "messageOverrides"?: RecursivePartial<TableMessages>;
        "propertyFiltering"?: TableProps['propertyFiltering'];
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "settings"?: TimeSeriesDataRequestSettings;
        "sorting"?: TableProps['sorting'];
        "styleSettings"?: StyleSettingsMap | undefined;
        "tableColumns"?: TableColumn[];
        "trends"?: Trend[];
        "viewport": Viewport;
        "widgetId"?: string;
    }
    interface IotTimeSeriesConnector {
        "annotations"?: Annotations;
        "assignDefaultColors"?: boolean | undefined;
        "provider"?: Provider<TimeSeriesData[]>;
        "renderFunc"?: (data: TimeSeriesData) => void;
        "styleSettings"?: StyleSettingsMap | undefined;
        "supportedDataTypes"?: DataType[];
    }
    interface IotTreeTable {
        "ariaLabels"?: TableProps1.AriaLabels<unknown>;
        "collectionOptions": UseTreeCollection<unknown>;
        "columnDefinitions": TableProps1.ColumnDefinition<any>[];
        "empty"?: EmptyStateProps;
        "expanded"?: boolean;
        "filterPlaceholder"?: string;
        "isItemDisabled"?: (item: unknown) => boolean;
        "items": unknown[];
        "loading"?: boolean;
        "loadingText"?: string;
        "onExpandChildren"?: (node: ITreeNode<any>) => void;
        "onSelectionChange"?: (event: NonCancelableCustomEvent<TableProps1.SelectionChangeDetail<unknown>>) => void;
        "onSortingChange"?: (event: NonCancelableCustomEvent<TableProps1.SortingState<unknown>>) => void;
        "resizableColumns"?: boolean;
        "selectionType"?: TableProps1.SelectionType;
        "sortingDisabled"?: boolean;
        "wrapLines"?: boolean;
    }
    interface IotWebglContext {
        "viewFrame"?: HTMLElement | Window | undefined;
    }
    interface IntrinsicElements {
        "iot-bar-chart": IotBarChart;
        "iot-kpi": IotKpi;
        "iot-line-chart": IotLineChart;
        "iot-react-table": IotReactTable;
        "iot-resource-explorer": IotResourceExplorer;
        "iot-scatter-chart": IotScatterChart;
        "iot-status-grid": IotStatusGrid;
        "iot-status-timeline": IotStatusTimeline;
        "iot-table": IotTable;
        "iot-time-series-connector": IotTimeSeriesConnector;
        "iot-tree-table": IotTreeTable;
        "iot-webgl-context": IotWebglContext;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "iot-bar-chart": LocalJSX.IotBarChart & JSXBase.HTMLAttributes<HTMLIotBarChartElement>;
            "iot-kpi": LocalJSX.IotKpi & JSXBase.HTMLAttributes<HTMLIotKpiElement>;
            "iot-line-chart": LocalJSX.IotLineChart & JSXBase.HTMLAttributes<HTMLIotLineChartElement>;
            "iot-react-table": LocalJSX.IotReactTable & JSXBase.HTMLAttributes<HTMLIotReactTableElement>;
            "iot-resource-explorer": LocalJSX.IotResourceExplorer & JSXBase.HTMLAttributes<HTMLIotResourceExplorerElement>;
            "iot-scatter-chart": LocalJSX.IotScatterChart & JSXBase.HTMLAttributes<HTMLIotScatterChartElement>;
            "iot-status-grid": LocalJSX.IotStatusGrid & JSXBase.HTMLAttributes<HTMLIotStatusGridElement>;
            "iot-status-timeline": LocalJSX.IotStatusTimeline & JSXBase.HTMLAttributes<HTMLIotStatusTimelineElement>;
            "iot-table": LocalJSX.IotTable & JSXBase.HTMLAttributes<HTMLIotTableElement>;
            "iot-time-series-connector": LocalJSX.IotTimeSeriesConnector & JSXBase.HTMLAttributes<HTMLIotTimeSeriesConnectorElement>;
            "iot-tree-table": LocalJSX.IotTreeTable & JSXBase.HTMLAttributes<HTMLIotTreeTableElement>;
            "iot-webgl-context": LocalJSX.IotWebglContext & JSXBase.HTMLAttributes<HTMLIotWebglContextElement>;
        }
    }
}
