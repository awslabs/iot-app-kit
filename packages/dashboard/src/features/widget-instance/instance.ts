import type {
  RegisteredWidgetPlugins,
  RegisteredWidgetType,
} from '~/features/widget-plugins/registry';

/** Instance of a widget on the dashboard. */
export type WidgetInstance<
  WidgetType extends RegisteredWidgetType = RegisteredWidgetType // default to simplify usage
> = WidgetType extends RegisteredWidgetType // force TS to distribute over the union
  ? {
      /**
       * Type of widget (i.e., 'kpi', 'text', 'xy-plot', etc.).
       */
      type: WidgetType;
      /**
       * Custom metadata allowing customization of the widget.
       */
      properties: RegisteredWidgetPlugins[WidgetType]['properties'];
      /**
       * Unique identifier associated with the widget instance (i.e., UUID or nanoid).
       */
      id: string;
      /**
       * Width in number of cells.
       */
      width: number;
      /**
       * Height in number of cells.
       */
      height: number;
      /**
       * Cell position along the dashboard's x-axis.
       */
      x: number;
      /**
       * Cell position along the dashboard's inverted y-axis.
       */
      y: number;
      /**
       * Position along the dashboard's z-axis (i.e., layer index). Each
       * widget is expected to have a unique `z` value.
       */
      z: number;
    }
  : never;
