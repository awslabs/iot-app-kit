export interface SceneLoader {
  // TODO: remove getSceneUrl once switched internal code to getSceneUri
  getSceneUrl: () => Promise<string | null>;

  getSceneUri: () => Promise<string | null>;
  getSceneObject: (uri: string) => Promise<ArrayBuffer> | null;
}
