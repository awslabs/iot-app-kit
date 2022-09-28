import * as THREE from 'three';
import { TilesRenderer } from '3d-tiles-renderer';

/**
 * With the problem in NASA code for 3D Tiles Renderer, they can't handle unknown protocol like s3, it'll turn "s3://domain-name/file.ext" to "s3:/domain-name/file.ext"
 * We will fix it by searching ":/" and "://", if the string has ":/" but not "://", change ":/" to "://"
 * -- we also need to prepare when NASA fixed this bug, they return s3:// properly, our code shouldn't break
 * @param uri string or URL
 * @returns fixed uri
 */
export function fixNasaUriBug(uri: string | URL): string {
  let uriString = uri.toString();
  const singleSlash = ':/';
  const doubleSlash = '://';
  const singleSlashIndex = uriString.indexOf(singleSlash);
  const doubleSlashIndex = uriString.indexOf(doubleSlash);
  if (singleSlashIndex >= 0 && doubleSlashIndex < 0) {
    uriString =
      uriString.slice(0, singleSlashIndex) + doubleSlash + uriString.slice(singleSlashIndex + singleSlash.length);
  }
  return uriString;
}

function rotationBetweenDirections(dir1, dir2) {
  const rotation = new THREE.Quaternion();
  const a = new THREE.Vector3().crossVectors(dir1, dir2);
  rotation.x = a.x;
  rotation.y = a.y;
  rotation.z = a.z;
  rotation.w = 1 + dir1.clone().dot(dir2);
  rotation.normalize();

  return rotation;
}

export function setupTilesRenderer(tilesRenderer: TilesRenderer) {
  const box = new THREE.Box3();
  const sphere = new THREE.Sphere();
  const matrix = new THREE.Matrix4();

  let position = new THREE.Vector3();
  let distanceToEllipsoidCenter = 0;

  // @ts-ignore
  if (tilesRenderer.getOrientedBounds(box, matrix)) {
    position = new THREE.Vector3().setFromMatrixPosition(matrix);
    distanceToEllipsoidCenter = position.length();
    // @ts-ignore
  } else if (tilesRenderer.getBoundingSphere(sphere)) {
    position = sphere.center.clone();
    distanceToEllipsoidCenter = position.length();
  }

  const surfaceDirection = position.normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const rotationToNorthPole = rotationBetweenDirections(surfaceDirection, up);

  tilesRenderer.group.quaternion.x = rotationToNorthPole.x;
  tilesRenderer.group.quaternion.y = rotationToNorthPole.y;
  tilesRenderer.group.quaternion.z = rotationToNorthPole.z;
  tilesRenderer.group.quaternion.w = rotationToNorthPole.w;

  tilesRenderer.group.position.y = -distanceToEllipsoidCenter;
}
