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
}

export const ModelFileTypeList: AssetType[] = [AssetType.GLB, AssetType.GLTF];
export const TextureFileTypeList: AssetType[] = [AssetType.JPG, AssetType.JPEG, AssetType.PNG];
