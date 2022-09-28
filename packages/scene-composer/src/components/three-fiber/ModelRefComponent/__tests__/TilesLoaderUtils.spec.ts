import * as THREE from 'three';
import { TilesRenderer } from '3d-tiles-renderer';

import { fixNasaUriBug, setupTilesRenderer } from '../TilesLoaderUtils';

describe('fixNasaUriBug', () => {
  it('should return the fixed URI', async () => {
    const result1 = fixNasaUriBug('s3:/my-bucket-name/mypath1/mypath2/filename.ext');
    expect(result1).toBe('s3://my-bucket-name/mypath1/mypath2/filename.ext');

    const result2 = fixNasaUriBug('https:/domain-name/mypath1/mypath2/filename.ext');
    expect(result2).toBe('https://domain-name/mypath1/mypath2/filename.ext');
  });

  it('should return the same URI if the input URI is correct', async () => {
    const result1 = fixNasaUriBug('s3://my-bucket-name/mypath1/mypath2/filename.ext');
    expect(result1).toBe('s3://my-bucket-name/mypath1/mypath2/filename.ext');

    const result2 = fixNasaUriBug('https://domain-name/mypath1/mypath2/filename.ext');
    expect(result2).toBe('https://domain-name/mypath1/mypath2/filename.ext');
  });
});

describe('setupTilesRenderer', () => {
  it('should rotate correctly for oriented bounds', async () => {
    const tilesRenderer: TilesRenderer = {
      getOrientedBounds: (box: THREE.Box3, matrix: THREE.Matrix4) => {
        matrix.elements[12] = 1;
        matrix.elements[13] = 2;
        matrix.elements[14] = 3;
        return true;
      },
      group: {
        position: new THREE.Vector3(),
        quaternion: new THREE.Quaternion(),
      },
    } as any;
    setupTilesRenderer(tilesRenderer);
    expect(tilesRenderer.group.position.y).toBe(-Math.sqrt(1 * 1 + 2 * 2 + 3 * 3));
  });

  it('should rotate correctly for bounding sphere', async () => {
    const tilesRenderer: TilesRenderer = {
      getOrientedBounds: (box: THREE.Box3, matrix: THREE.Matrix4) => false,
      getBoundingSphere: (sphere: THREE.Sphere) => {
        sphere.center = new THREE.Vector3(1, 2, 3);
        return true;
      },
      group: {
        position: new THREE.Vector3(),
        quaternion: new THREE.Quaternion(),
      },
    } as any;
    setupTilesRenderer(tilesRenderer);
    expect(tilesRenderer.group.position.y).toBe(-Math.sqrt(1 * 1 + 2 * 2 + 3 * 3));
  });
});
