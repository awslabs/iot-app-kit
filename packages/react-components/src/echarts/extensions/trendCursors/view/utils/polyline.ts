import { ECPolyline } from 'echarts/lib/chart/line/poly';

export const createPolyLineFromPoints = (points: Float32Array) => {
  const clonedPolyLine = new ECPolyline({
    shape: {
      points,
    },
    z2: 10,
  });
  clonedPolyLine.createPathProxy();
  clonedPolyLine.buildPath(clonedPolyLine.path, clonedPolyLine.shape);
  return clonedPolyLine;
};

// polyline is a namespace here because of how we are accessing
// it through echarts exports. We can't use it as a type
// eslint-disable-next-line
export const clonePolyLine = (polyline: any) => {
  const points = polyline?.shape?.points ?? [];
  return createPolyLineFromPoints(points);
};
