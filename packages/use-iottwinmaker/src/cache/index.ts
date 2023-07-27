import type {
  GetPropertyValueCommandInput,
  GetPropertyValueHistoryCommandInput,
  ListComponentTypesCommandInput,
  ListEntitiesCommandInput,
  ListScenesCommandInput,
  ListWorkspacesCommandInput,
} from '@aws-sdk/client-iottwinmaker';

export const iotTwinMakerKeys = {
  /** Reference to all IoT Twin Maker resources within the application cache. */
  all: [{ service: 'IoT Twin Maker' }] as const,

  /** Reference to all entity resources.  */
  componentTypes: () => [{ ...iotTwinMakerKeys.all[0], scope: 'component types' }] as const,
  /** Reference to all entity summary lists. */
  componentTypeSummaryLists: () =>
    [{ ...iotTwinMakerKeys.componentTypes()[0], resource: 'component type summary' }] as const,
  /** Reference to a single entity summary list. */
  componentTypeSummaryList: (input: Omit<ListComponentTypesCommandInput, 'nextToken'>) =>
    [{ ...iotTwinMakerKeys.componentTypeSummaryLists()[0], ...input }] as const,

  /** Reference to all entity resources.  */
  entities: () => [{ ...iotTwinMakerKeys.all[0], scope: 'entities' }] as const,
  /** Reference to all entity summary lists. */
  entitySummaryLists: () => [{ ...iotTwinMakerKeys.entities()[0], resource: 'entity summary' }] as const,
  /** Reference to a single entity summary list. */
  entitySummaryList: (input: Omit<ListEntitiesCommandInput, 'nextToken'>) =>
    [{ ...iotTwinMakerKeys.entitySummaryLists()[0], ...input }] as const,

  /** Reference to all scene resources.  */
  scenes: () => [{ ...iotTwinMakerKeys.all[0], scope: 'scenes' }] as const,
  /** Reference to all scene summary lists. */
  sceneSummaryLists: () => [{ ...iotTwinMakerKeys.scenes()[0], resource: 'scene summary' }] as const,
  /** Reference to a single scene summary list. */
  sceneSummaryList: (input: Omit<ListScenesCommandInput, 'nextToken'>) =>
    [{ ...iotTwinMakerKeys.sceneSummaryLists()[0], ...input }] as const,

  /** Reference to all workspace resources.  */
  workspaces: () => [{ ...iotTwinMakerKeys.all[0], scope: 'workspaces' }] as const,
  /** Reference to all workspace summary lists. */
  workspaceSummaryLists: () => [{ ...iotTwinMakerKeys.workspaces()[0], resource: 'workspace summary' }] as const,
  /** Reference to a single workspace summary list. */
  workspaceSummaryList: (input: Omit<ListWorkspacesCommandInput, 'nextToken'>) =>
    [{ ...iotTwinMakerKeys.workspaceSummaryLists()[0], ...input }] as const,
} as const;

export const propertyValueKeys = {
  all: [{ service: 'IoT TwinMaker', scope: 'property values' }] as const,
  propertyValues: () => [{ ...propertyValueKeys.all[0], resource: 'property value' }] as const,
  propertyValue: ({ nextToken, ...input }: GetPropertyValueCommandInput) =>
    [
      {
        ...propertyValueKeys.propertyValues()[0],
        ...input,
      },
    ] as const,
  propertyValueHistories: () => [{ ...propertyValueKeys.all[0], resource: 'property value history' }] as const,
  propertyValueHistory: ({ nextToken, ...input }: GetPropertyValueHistoryCommandInput) =>
    [
      {
        ...propertyValueKeys.propertyValueHistories(),
        ...input,
      },
    ] as const,
};
