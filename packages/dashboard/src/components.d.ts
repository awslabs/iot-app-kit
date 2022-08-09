/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Anchor, DashboardConfiguration, OnResize, RecursivePartial, Widget } from "./types";
import { DashboardMessages } from "./messages";
import { AlarmsConfig, Annotations, Axis, LabelsConfig, LayoutConfig, LegendConfig, MessageOverrides, MinimalSizeConfig, MinimalViewPortConfig, MovementConfig, ScaleConfig, Trend } from "@synchro-charts/core";
import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest } from "@iot-app-kit/core";
import { BringToFrontActionInput, DeleteActionInput, MoveActionInput, PasteActionInput, ResizeActionInput, SelectActionInput, SendToBackActionInput } from "./dashboard-actions/actions";
export namespace Components {
    interface IotContextMenu {
        "x": number;
        "y": number;
    }
    interface IotContextMenuOption {
        "disabled": boolean;
        "onClick"?: (event: MouseEvent) => void;
    }
    interface IotContextMenuSection {
    }
    interface IotDashboard {
        /**
          * The configurations which determines which widgets render where with what settings.
         */
        "dashboardConfiguration": DashboardConfiguration;
        "messageOverrides"?: RecursivePartial<DashboardMessages>;
    }
    interface IotDashboardContextMenu {
        /**
          * Actions to use for context menu
         */
        "actions": ActionsProp;
        "hasCopiedWidgets": boolean;
        /**
          * Widget selections to be used to determine enabled actions.
         */
        "hasSelectedWidgets": boolean;
        /**
          * Message overrides to be used in the dashboard.
         */
        "messageOverrides": DashboardMessages;
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
        "bringToFront": (input: BringToFrontActionInput) => void;
        /**
          * Width and height of the cell, in pixels
         */
        "cellSize": number;
        /**
          * List of widgets in the current copy group.
         */
        "copyGroup": Widget[];
        "copyWidgets": () => void;
        /**
          * The configurations which determines which widgets render where with what settings.
         */
        "dashboardConfiguration": DashboardConfiguration;
        "deleteWidgets": (deleteInput: DeleteActionInput) => void;
        /**
          * Message overrides to be used in the dashboard.
         */
        "messageOverrides": DashboardMessages;
        "move": (moveInput: MoveActionInput) => void;
        "pasteWidgets": (input: PasteActionInput) => void;
        "redo": () => void;
        "resizeWidgets": (resizeInput: ResizeActionInput) => void;
        "selectWidgets": (selectInput: SelectActionInput) => void;
        /**
          * List of ID's of the currently selected widgets.
         */
        "selectedWidgetIds": string[];
        "sendToBack": (input: SendToBackActionInput) => void;
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
        "isSelected": boolean;
        "viewport": MinimalViewPortConfig;
        "widget": Widget;
        "width": number;
    }
    interface IotResizablePanes {
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
    interface HTMLIotContextMenuElement extends Components.IotContextMenu, HTMLStencilElement {
    }
    var HTMLIotContextMenuElement: {
        prototype: HTMLIotContextMenuElement;
        new (): HTMLIotContextMenuElement;
    };
    interface HTMLIotContextMenuOptionElement extends Components.IotContextMenuOption, HTMLStencilElement {
    }
    var HTMLIotContextMenuOptionElement: {
        prototype: HTMLIotContextMenuOptionElement;
        new (): HTMLIotContextMenuOptionElement;
    };
    interface HTMLIotContextMenuSectionElement extends Components.IotContextMenuSection, HTMLStencilElement {
    }
    var HTMLIotContextMenuSectionElement: {
        prototype: HTMLIotContextMenuSectionElement;
        new (): HTMLIotContextMenuSectionElement;
    };
    interface HTMLIotDashboardElement extends Components.IotDashboard, HTMLStencilElement {
    }
    var HTMLIotDashboardElement: {
        prototype: HTMLIotDashboardElement;
        new (): HTMLIotDashboardElement;
    };
    interface HTMLIotDashboardContextMenuElement extends Components.IotDashboardContextMenu, HTMLStencilElement {
    }
    var HTMLIotDashboardContextMenuElement: {
        prototype: HTMLIotDashboardContextMenuElement;
        new (): HTMLIotDashboardContextMenuElement;
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
    interface HTMLIotResizablePanesElement extends Components.IotResizablePanes, HTMLStencilElement {
    }
    var HTMLIotResizablePanesElement: {
        prototype: HTMLIotResizablePanesElement;
        new (): HTMLIotResizablePanesElement;
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
        "iot-context-menu": HTMLIotContextMenuElement;
        "iot-context-menu-option": HTMLIotContextMenuOptionElement;
        "iot-context-menu-section": HTMLIotContextMenuSectionElement;
        "iot-dashboard": HTMLIotDashboardElement;
        "iot-dashboard-context-menu": HTMLIotDashboardContextMenuElement;
        "iot-dashboard-dynamic-widget": HTMLIotDashboardDynamicWidgetElement;
        "iot-dashboard-internal": HTMLIotDashboardInternalElement;
        "iot-dashboard-widget": HTMLIotDashboardWidgetElement;
        "iot-resizable-panes": HTMLIotResizablePanesElement;
        "iot-selection-box": HTMLIotSelectionBoxElement;
        "iot-selection-box-anchor": HTMLIotSelectionBoxAnchorElement;
        "testing-ground": HTMLTestingGroundElement;
    }
}
declare namespace LocalJSX {
    interface IotContextMenu {
        "x"?: number;
        "y"?: number;
    }
    interface IotContextMenuOption {
        "disabled"?: boolean;
        "onClick"?: (event: MouseEvent) => void;
    }
    interface IotContextMenuSection {
    }
    interface IotDashboard {
        /**
          * The configurations which determines which widgets render where with what settings.
         */
        "dashboardConfiguration"?: DashboardConfiguration;
        "messageOverrides"?: RecursivePartial<DashboardMessages>;
    }
    interface IotDashboardContextMenu {
        /**
          * Actions to use for context menu
         */
        "actions"?: ActionsProp;
        "hasCopiedWidgets"?: boolean;
        /**
          * Widget selections to be used to determine enabled actions.
         */
        "hasSelectedWidgets"?: boolean;
        /**
          * Message overrides to be used in the dashboard.
         */
        "messageOverrides"?: DashboardMessages;
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
        "bringToFront"?: (input: BringToFrontActionInput) => void;
        /**
          * Width and height of the cell, in pixels
         */
        "cellSize"?: number;
        /**
          * List of widgets in the current copy group.
         */
        "copyGroup"?: Widget[];
        "copyWidgets"?: () => void;
        /**
          * The configurations which determines which widgets render where with what settings.
         */
        "dashboardConfiguration"?: DashboardConfiguration;
        "deleteWidgets"?: (deleteInput: DeleteActionInput) => void;
        /**
          * Message overrides to be used in the dashboard.
         */
        "messageOverrides"?: DashboardMessages;
        "move"?: (moveInput: MoveActionInput) => void;
        "pasteWidgets"?: (input: PasteActionInput) => void;
        "redo"?: () => void;
        "resizeWidgets"?: (resizeInput: ResizeActionInput) => void;
        "selectWidgets"?: (selectInput: SelectActionInput) => void;
        /**
          * List of ID's of the currently selected widgets.
         */
        "selectedWidgetIds"?: string[];
        "sendToBack"?: (input: SendToBackActionInput) => void;
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
        "isSelected"?: boolean;
        "viewport"?: MinimalViewPortConfig;
        "widget"?: Widget;
        "width"?: number;
    }
    interface IotResizablePanes {
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
        "iot-context-menu": IotContextMenu;
        "iot-context-menu-option": IotContextMenuOption;
        "iot-context-menu-section": IotContextMenuSection;
        "iot-dashboard": IotDashboard;
        "iot-dashboard-context-menu": IotDashboardContextMenu;
        "iot-dashboard-dynamic-widget": IotDashboardDynamicWidget;
        "iot-dashboard-internal": IotDashboardInternal;
        "iot-dashboard-widget": IotDashboardWidget;
        "iot-resizable-panes": IotResizablePanes;
        "iot-selection-box": IotSelectionBox;
        "iot-selection-box-anchor": IotSelectionBoxAnchor;
        "testing-ground": TestingGround;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "iot-context-menu": LocalJSX.IotContextMenu & JSXBase.HTMLAttributes<HTMLIotContextMenuElement>;
            "iot-context-menu-option": LocalJSX.IotContextMenuOption & JSXBase.HTMLAttributes<HTMLIotContextMenuOptionElement>;
            "iot-context-menu-section": LocalJSX.IotContextMenuSection & JSXBase.HTMLAttributes<HTMLIotContextMenuSectionElement>;
            "iot-dashboard": LocalJSX.IotDashboard & JSXBase.HTMLAttributes<HTMLIotDashboardElement>;
            "iot-dashboard-context-menu": LocalJSX.IotDashboardContextMenu & JSXBase.HTMLAttributes<HTMLIotDashboardContextMenuElement>;
            "iot-dashboard-dynamic-widget": LocalJSX.IotDashboardDynamicWidget & JSXBase.HTMLAttributes<HTMLIotDashboardDynamicWidgetElement>;
            "iot-dashboard-internal": LocalJSX.IotDashboardInternal & JSXBase.HTMLAttributes<HTMLIotDashboardInternalElement>;
            "iot-dashboard-widget": LocalJSX.IotDashboardWidget & JSXBase.HTMLAttributes<HTMLIotDashboardWidgetElement>;
            "iot-resizable-panes": LocalJSX.IotResizablePanes & JSXBase.HTMLAttributes<HTMLIotResizablePanesElement>;
            "iot-selection-box": LocalJSX.IotSelectionBox & JSXBase.HTMLAttributes<HTMLIotSelectionBoxElement>;
            "iot-selection-box-anchor": LocalJSX.IotSelectionBoxAnchor & JSXBase.HTMLAttributes<HTMLIotSelectionBoxAnchorElement>;
            "testing-ground": LocalJSX.TestingGround & JSXBase.HTMLAttributes<HTMLTestingGroundElement>;
        }
    }
}
