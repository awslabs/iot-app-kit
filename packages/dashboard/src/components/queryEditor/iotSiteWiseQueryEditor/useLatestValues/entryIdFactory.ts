import invariant from 'tiny-invariant';

import type { ModeledDataStream } from '../modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import type { UnmodeledDataStream } from '../unmodeledDataStreamExplorer/types';

export class EntryIdFactory {
  readonly #dataStream: ModeledDataStream | UnmodeledDataStream;
  readonly #MAXIMUM_ENTRY_ID_LENGTH = 64;

  constructor(dataStream: ModeledDataStream | UnmodeledDataStream) {
    this.#dataStream = dataStream;
  }

  public create() {
    const entryId = this.#createEntryId();

    // post-condition check
    invariant(
      entryId.length <= this.#MAXIMUM_ENTRY_ID_LENGTH,
      `Entry ID must be less than or equal to ${
        this.#MAXIMUM_ENTRY_ID_LENGTH
      } characters. Got ${entryId.length} characters.`
    );

    return entryId;
  }

  #createEntryId(): string {
    // Remove dashes from any UUIDs
    const { assetId, propertyId, alias } =
      this.#extractIdentifiersFromDataStream();
    const entryId = this.#formatIdentifiers({
      assetId,
      propertyId,
      alias,
    });

    return entryId;
  }

  #extractIdentifiersFromDataStream() {
    const assetId =
      'assetId' in this.#dataStream ? this.#dataStream.assetId : undefined;
    const propertyId =
      'propertyId' in this.#dataStream
        ? this.#dataStream.propertyId
        : undefined;
    const alias =
      'alias' in this.#dataStream ? this.#dataStream.alias : undefined;

    return { assetId, propertyId, alias };
  }

  #formatIdentifiers({
    assetId,
    propertyId,
    alias,
  }: {
    assetId?: string;
    propertyId?: string;
    alias?: string;
  }) {
    const trimmedAlias = this.#trimPropertyAlias(alias);
    const aliasWithoutSlashes =
      this.#removeSlashesFromPropertyAlias(trimmedAlias);
    const joinedIdentifiers = Object.values({
      assetId,
      propertyId,
      propertyAlias: aliasWithoutSlashes,
    }).join('');
    const identifiersWithoutDashes = this.#removeDashes(joinedIdentifiers);

    return identifiersWithoutDashes;
  }

  // property aliases can be longer than the maximum entry ID length, so we trim them
  #trimPropertyAlias(propertyAlias?: string): string | undefined {
    const trimmedPropertyAlias = propertyAlias?.substring(
      0,
      this.#MAXIMUM_ENTRY_ID_LENGTH
    );

    return trimmedPropertyAlias;
  }

  #removeSlashesFromPropertyAlias(propertyAlias?: string): string | undefined {
    const propertyAliasWithoutSlashes = propertyAlias?.split('/').join('');

    return propertyAliasWithoutSlashes;
  }

  #removeDashes(joinedIdentifiers: string) {
    const identifiersWithoutDashes = joinedIdentifiers.split('-').join('');

    return identifiersWithoutDashes;
  }
}
