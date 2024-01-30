export enum AssetType {
  BIN = 'BIN',
  GLB = 'GLB',
  GLTF = 'GLTF',
  JPG = 'JPG',
  JPEG = 'JPEG',
  MP3 = 'MP3',
  MP4 = 'MP4',
  PDF = 'PDF',
  PNG = 'PNG',
  TILES_3D = 'Tiles3D',
}

export const ModelFileTypeList: AssetType[] = [AssetType.GLB, AssetType.GLTF, AssetType.TILES_3D];
export const TextureFileTypeList: AssetType[] = [AssetType.JPG, AssetType.JPEG, AssetType.PNG];
