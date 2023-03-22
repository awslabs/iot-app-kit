import { MpSdk } from '@matterport/r3f/dist';

export type TagItem = MpSdk.Tag.TagData;
export class TagObserver implements MpSdk.IMapObserver<TagItem> {
  tagCollection: MpSdk.Dictionary<TagItem> | undefined;
  constructor() {
    this.tagCollection = undefined;
  }
  onCollectionUpdated(collection: MpSdk.Dictionary<TagItem>): void {
    this.tagCollection = collection;
  }
  getTags(): MpSdk.Dictionary<TagItem> | undefined {
    return this.tagCollection;
  }
}

export type MattertagItem = MpSdk.Mattertag.ObservableMattertagData;
export class MattertagObserver implements MpSdk.IMapObserver<MattertagItem> {
  tagCollection: MpSdk.Dictionary<MattertagItem> | undefined;
  constructor() {
    this.tagCollection = undefined;
  }
  onCollectionUpdated(collection: MpSdk.Dictionary<MattertagItem>): void {
    this.tagCollection = collection;
  }
  getMattertags(): MpSdk.Dictionary<MattertagItem> | undefined {
    return this.tagCollection;
  }
}
