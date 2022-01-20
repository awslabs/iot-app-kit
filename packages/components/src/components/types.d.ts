export type StyleSettings = {
  name?: string;
  detailedName?: string;
  color?: string; // CSS color string, i.e. 'red' or '#ffffff'
  unit?: string;
};

export type StyleSettingsMap = { [refId: string]: StyleSettings };
