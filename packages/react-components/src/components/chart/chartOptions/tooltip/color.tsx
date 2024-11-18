export type XYPlotTooltipDatastreamColorOptions = {
  color?: string;
};

export const XYPlotTooltipDatastreamColor = ({
  color,
}: XYPlotTooltipDatastreamColorOptions) => {
  return (
    <div
      style={{ height: 15, width: 15, backgroundColor: color, borderRadius: 3 }}
    ></div>
  );
};
