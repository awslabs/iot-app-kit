/** List all of the IDs across hierarchies. */
export function selectHierarchyIds(hierarchies: { id?: string }[]): string[] {
  const hierarchiesWithIds: { id: string }[] = hierarchies.filter((h): h is { id: string } => Boolean(h?.id));
  const hierarchyIds: string[] = hierarchiesWithIds.map(({ id }) => id);

  return hierarchyIds;
}
