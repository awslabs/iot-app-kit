type Parameters = readonly unknown[];

export type QueryKey = readonly [
  {
    resourceId: string;
    allParameters: Parameters;
    currentParameters: Parameters[number];
  }
];
