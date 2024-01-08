// still under consideration will reevaluate during integration with scene viewer and might be moved to other part of the code
export type EntityData = {
  componentName?: string;
  entityId: string;
  entityName?: string;
};

export type Health =
  | 'ok'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'offline'
  | 'unknown';
