export type BaseQueryKey<ResourceName> = readonly [{ resource: ResourceName }];

export type Paginated<T extends { [Key in keyof T]: T[Key] }> = T & {
  nextToken?: string;
};
