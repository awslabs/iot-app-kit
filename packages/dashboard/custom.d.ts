//https://stackoverflow.com/questions/58726319/typescript-cannot-find-module-when-import-svg-file
declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;

  const src: string;
  export default src;
}

declare module 'echarts/lib/chart/line/poly';
