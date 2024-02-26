import * as THREE from 'three';

const getPointAsObject3DFromPositionArray = (array: THREE.BufferAttribute, firstVertexIndex: number, worldMatrix: THREE.Matrix4): THREE.Object3D => {
  const v1 = new THREE.Vector3(array.array[firstVertexIndex*3], array.array[firstVertexIndex*3 + 1], array.array[firstVertexIndex*3 + 2]);
  const o1 = new THREE.Object3D();
  o1.position.set(v1.x, v1.y, v1.z);
  o1.applyMatrix4(worldMatrix);
  return o1;
}

// This algorithm just steals the faces and doesn't offset them, so if you display them at the same time as the original mesh you'll probably get
// z fighting
export const getFaces = (geometry: THREE.BufferGeometry, sphere: THREE.Sphere, worldMatrix: THREE.Matrix4): Float32Array | undefined => {
  if(!geometry.index) {
    console.log('geometry is not indexed');
    return undefined;
  }
  //console.log('using indexed geometry input');
  
  const vertexIndex = geometry.index;
  //console.log('vertex index: ', vertexIndex, geometry.index, geometry.getAttribute('index'));
  const outputVertexPositions: number[] = [];
  //assume buffer attribute for now
  const inputPositions = geometry.getAttribute('position') as THREE.BufferAttribute;
  //console.log('using input positions: ', inputPositions);
  //first try is non-indexed buffer as output

  //doing index would let us prevent duplicate triangles on multiclick with a hashmap of
  //face indexes from the original mesh

  //for each face which is 3 vertex
  //if we had a face interface with proper list of adjacent face we could do
  //a breath first search of in range instead of loop over all the faces
  for(let i = 0; i < vertexIndex.count; i = i + 3) {
    const o1 = getPointAsObject3DFromPositionArray(inputPositions, vertexIndex.array[i], worldMatrix);
    const o2 = getPointAsObject3DFromPositionArray(inputPositions, vertexIndex.array[i+1], worldMatrix);
    const o3 = getPointAsObject3DFromPositionArray(inputPositions, vertexIndex.array[i+2], worldMatrix);

    if (sphere.containsPoint(o1.position) || sphere.containsPoint(o2.position) || sphere.containsPoint(o3.position)) {
      //add face to our non-indexed results
      outputVertexPositions.push(o1.position.x, o1.position.y, o1.position.z, o2.position.x, o2.position.y, o2.position.z, o3.position.x, o3.position.y, o3.position.z); 
    }
  }
  //console.log('finished face checks', outputVertexPositions);
  return new Float32Array(outputVertexPositions);
}