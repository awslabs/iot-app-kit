import { ISceneDocumentSnapshot } from '../interfaces';
import { ISceneDocumentInternal } from '../store/internalInterfaces';
import { RootState } from '../store/Store';
import serializationHelpers from '../store/helpers/serializationHelpers';

/**
 * A SceneDocumentSnapshot should be immutable when the scene state changes.
 * Currently this is achieved by the fact that all state objects are immutable,
 * so that we can simply store the pointer to those objects.
 */
class SceneDocumentSnapshotImpl implements ISceneDocumentSnapshot {
  private readonly document: ISceneDocumentInternal;

  constructor(state: RootState) {
    this.document = state.document;
  }

  serialize(specVersion: string): string {
    return serializationHelpers.document.serialize(this.document, specVersion);
  }
}

export default {
  create(state: RootState): ISceneDocumentSnapshot {
    return new SceneDocumentSnapshotImpl(state);
  },
};
