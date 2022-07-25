/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Anchor, CopyActionInput, DashboardConfiguration, DeleteActionInput, MoveActionInput, OnResize, ResizeActionInput, Widget } from "./types";
import { AlarmsConfig, Annotations, Axis, LabelsConfig, LayoutConfig, LegendConfig, MessageOverrides, MinimalSizeConfig, MinimalViewPortConfig, MovementConfig, ScaleConfig, Trend } from "@synchro-charts/core";
import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest } from "@iot-app-kit/core";
export namespace Components {
    interface IotDashboard {
        /**
          * Width and height of the cell, in pixels
         */
        "addWidget": () => void;
        /**
          * The configurations which determines which widgets render where with what settings.
         */
        "dashboardConfiguration": DashboardConfiguration;
        /**
          * Callback that is fired every time the dashboard configuration has been altered.  When a widget is moved, resized, deleted, appended, or altered, then this method is called
         */
        "onDashboardConfigurationChange": (config: DashboardConfiguration) => void;
    }
    interface IotDashboardDynamicWidget {
        "alarms"?: AlarmsConfig;
        "annotations"?: Annotations;
        "axis"?: Axis.Options;
        "componentTag": string;
        "gestures"?: boolean;
        /**
          * Error Messaging
         */
        "invalidTagErrorHeader": string;
        "invalidTagErrorSubheader": string;
        "isEditing"?: boolean;
        "labelsConfig"?: LabelsConfig;
        "layout"?: LayoutConfig;
        "legend"?: LegendConfig;
        "messageOverrides"?: MessageOverrides;
        "movement"?: MovementConfig;
        "queries": TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "readOnly"?: boolean;
        "scale"?: ScaleConfig;
        "size"?: MinimalSizeConfig;
        "trends"?: Trend[];
        "viewport": MinimalViewPortConfig;
        "widgetId": string;
    }
    interface IotDashboardInternal {
        /**
          * Width and height of the cell, in pixels
         */
        "cellSize": number;
        "copyWidgets": (copyInput: CopyActionInput) => void;
        /**
          * The configurations which determines which widgets render where with what settings.
         */
        "dashboardConfiguration": DashboardConfiguration;
        "deleteWidgets": (deleteInput: DeleteActionInput) => void;
        "midResize": (resizeInput: ResizeActionInput) => void;
        "move": (moveInput: MoveActionInput) => void;
        "moveWidgets": (moveInput: MoveActionInput) => void;
        /**
          * Callback that is fired every time the dashboard configuration has been altered.  When a widget is moved, resized, deleted, appended, or altered, then this method is called
         */
        "onDashboardConfigurationChange"?: (config: DashboardConfiguration) => void;
        "pasteWidgets": () => void;
        "redo": () => void;
        "resizeWidgets": (resizeInput: ResizeActionInput) => void;
        /**
          * Whether the dashboard grid will stretch to fit.  If stretch to fit is false, the dashboard grid will be the width in pixels. If not enough room is present, it will utilize scrollbars to allow access to the entire grid.  If stretch to fit is true, the entire grid will scale proportionally to scale to the available space for the grid.
         */
        "stretchToFit": boolean;
        "undo": () => void;
        /**
          * Width of the dashboard, in pixels
         */
        "width": number;
    }
    interface IotDashboardWidget {
        "cellSize": number;
        "isMoving": boolean;
        "isSelected": boolean;
        "viewport": MinimalViewPortConfig;
        "widget": Widget;
        "width": number;
    }
    interface IotSelectionBox {
        "cellSize": number;
        "height": number;
        "onResize": OnResize;
        "width": number;
        "x": number;
        "y": number;
    }
    interface IotSelectionBoxAnchor {
        "anchor": Anchor;
        "onResize": OnResize;
    }
    interface TestingGround {
    }
}
declare global {
    interface HTMLIotDashboardElement extends Components.IotDashboard, HTMLStencilElement {
    }
    var HTMLIotDashboardElement: {
        prototype: HTMLIotDashboardElement;
        new (): HTMLIotDashboardElement;
    };
    interface HTMLIotDashboardDynamicWidgetElement extends Components.IotDashboardDynamicWidget, HTMLStencilElement {
    }
    var HTMLIotDashboardDynamicWidgetElement: {
        prototype: HTMLIotDashboardDynamicWidgetElement;
        new (): HTMLIotDashboardDynamicWidgetElement;
    };
    interface HTMLIotDashboardInternalElement extends Components.IotDashboardInternal, HTMLStencilElement {
    }
    var HTMLIotDashboardInternalElement: {
        prototype: HTMLIotDashboardInternalElement;
        new (): HTMLIotDashboardInternalElement;
    };
    interface HTMLIotDashboardWidgetElement extends Components.IotDashboardWidget, HTMLStencilElement {
    }
    var HTMLIotDashboardWidgetElement: {
        prototype: HTMLIotDashboardWidgetElement;
        new (): HTMLIotDashboardWidgetElement;
    };
    interface HTMLIotSelectionBoxElement extends Components.IotSelectionBox, HTMLStencilElement {
    }
    var HTMLIotSelectionBoxElement: {
        prototype: HTMLIotSelectionBoxElement;
        new (): HTMLIotSelectionBoxElement;
    };
    interface HTMLIotSelectionBoxAnchorElement extends Components.IotSelectionBoxAnchor, HTMLStencilElement {
    }
    var HTMLIotSelectionBoxAnchorElement: {
        prototype: HTMLIotSelectionBoxAnchorElement;
        new (): HTMLIotSelectionBoxAnchorElement;
    };
    interface HTMLTestingGroundElement extends Components.TestingGround, HTMLStencilElement {
    }
    var HTMLTestingGroundElement: {
        prototype: HTMLTestingGroundElement;
        new (): HTMLTestingGroundElement;
    };
    interface HTMLElementTagNameMap {
        "iot-dashboard": HTMLIotDashboardElement;
        "iot-dashboard-dynamic-widget": HTMLIotDashboardDynamicWidgetElement;
        "iot-dashboard-internal": HTMLIotDashboardInternalElement;
        "iot-dashboard-widget": HTMLIotDashboardWidgetElement;
        "iot-selection-box": HTMLIotSelectionBoxElement;
        "iot-selection-box-anchor": HTMLIotSelectionBoxAnchorElement;
        "testing-ground": HTMLTestingGroundElement;
    }
}
declare namespace LocalJSX {
    interface IotDashboard {
        /**
          * Width and height of the cell, in pixels
         */
        "addWidget"?: () => void;
        /**
          * The configurations which determines which widgets render where with what settings.
         */
        "dashboardConfiguration"?: DashboardConfiguration;
        /**
          * Callback that is fired every time the dashboard configuration has been altered.  When a widget is moved, resized, deleted, appended, or altered, then this method is called
         */
        "onDashboardConfigurationChange"?: (config: DashboardConfiguration) => void;
    }
    interface IotDashboardDynamicWidget {
        "alarms"?: AlarmsConfig;
        "annotations"?: Annotations;
        "axis"?: Axis.Options;
        "componentTag": string;
        "gestures"?: boolean;
        /**
          * Error Messaging
         */
        "invalidTagErrorHeader": string;
        "invalidTagErrorSubheader": string;
        "isEditing"?: boolean;
        "labelsConfig"?: LabelsConfig;
        "layout"?: LayoutConfig;
        "legend"?: LegendConfig;
        "messageOverrides"?: MessageOverrides;
        "movement"?: MovementConfig;
        "queries"?: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
        "readOnly"?: boolean;
        "scale"?: ScaleConfig;
        "size"?: MinimalSizeConfig;
        "trends"?: Trend[];
        "viewport"?: MinimalViewPortConfig;
        "widgetId": string;
    }
    interface IotDashboardInternal {
        /**
          * Width and height of the cell, in pixels
         */
        "cellSize"?: number;
        "copyWidgets"?: (copyInput: CopyActionInput) => void;
        /**
          * The configurations which determines which widgets render where with what settings.
         */
        "dashboardConfiguration"?: DashboardConfiguration;
        "deleteWidgets"?: (deleteInput: DeleteActionInput) => void;
        "midResize"?: (resizeInput: ResizeActionInput) => void;
        "move"?: (moveInput: MoveActionInput) => void;
        "moveWidgets"?: (moveInput: MoveActionInput) => void;
        /**
          * Callback that is fired every time the dashboard configuration has been altered.  When a widget is moved, resized, deleted, appended, or altered, then this method is called
         */
        "onDashboardConfigurationChange"?: (config: DashboardConfiguration) => void;
        "pasteWidgets"?: () => void;
        "redo"?: () => void;
        "resizeWidgets"?: (resizeInput: ResizeActionInput) => void;
        /**
          * Whether the dashboard grid will stretch to fit.  If stretch to fit is false, the dashboard grid will be the width in pixels. If not enough room is present, it will utilize scrollbars to allow access to the entire grid.  If stretch to fit is true, the entire grid will scale proportionally to scale to the available space for the grid.
         */
        "stretchToFit"?: boolean;
        "undo"?: () => void;
        /**
          * Width of the dashboard, in pixels
         */
        "width"?: number;
    }
    interface IotDashboardWidget {
        "cellSize"?: number;
        "isMoving"?: boolean;
        "isSelected"?: boolean;
        "viewport"?: MinimalViewPortConfig;
        "widget"?: Widget;
        "width"?: number;
    }
    interface IotSelectionBox {
        "cellSize"?: number;
        "height"?: number;
        "onResize"?: OnResize;
        "width"?: number;
        "x"?: number;
        "y"?: number;
    }
    interface IotSelectionBoxAnchor {
        "anchor"?: Anchor;
        "onResize"?: OnResize;
    }
    interface TestingGround {
    }
    interface IntrinsicElements {
        "iot-dashboard": IotDashboard;
        "iot-dashboard-dynamic-widget": IotDashboardDynamicWidget;
        "iot-dashboard-internal": IotDashboardInternal;
        "iot-dashboard-widget": IotDashboardWidget;
        "iot-selection-box": IotSelectionBox;
        "iot-selection-box-anchor": IotSelectionBoxAnchor;
        "testing-ground": TestingGround;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "iot-dashboard": LocalJSX.IotDashboard & JSXBase.HTMLAttributes<HTMLIotDashboardElement>;
            "iot-dashboard-dynamic-widget": LocalJSX.IotDashboardDynamicWidget & JSXBase.HTMLAttributes<HTMLIotDashboardDynamicWidgetElement>;
            "iot-dashboard-internal": LocalJSX.IotDashboardInternal & JSXBase.HTMLAttributes<HTMLIotDashboardInternalElement>;
            "iot-dashboard-widget": LocalJSX.IotDashboardWidget & JSXBase.HTMLAttributes<HTMLIotDashboardWidgetElement>;
            "iot-selection-box": LocalJSX.IotSelectionBox & JSXBase.HTMLAttributes<HTMLIotSelectionBoxElement>;
            "iot-selection-box-anchor": LocalJSX.IotSelectionBoxAnchor & JSXBase.HTMLAttributes<HTMLIotSelectionBoxAnchorElement>;
            "testing-ground": LocalJSX.TestingGround & JSXBase.HTMLAttributes<HTMLTestingGroundElement>;
        }
    }
}
