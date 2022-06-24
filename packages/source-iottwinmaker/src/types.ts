export interface SceneLoader {
  getSceneUrl: () => Promise<string | null>;
  getSceneObject: (uri: string) => Promise<ArrayBuffer> | null;
}
