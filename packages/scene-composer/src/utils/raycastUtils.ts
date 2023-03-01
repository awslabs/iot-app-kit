/**
 * Gets the position and normal to the surface of an intersection based on a parent's local coordinates
 * @param intersection
 * @returns the position and normal of the given intersection.
 */
export function getIntersectionTransform(intersection): {
  position: THREE.Vector3;
  normal?: THREE.Vector3;
} {
  const position = intersection.point.clone();
  const normal = intersection.face?.normal.clone();

  if (normal) {
    normal.transformDirection(intersection.object.matrixWorld);
    normal.multiplyScalar(1);
    normal.add(intersection.point.clone());
  }

  return { position, normal };
}
