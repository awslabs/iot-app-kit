/**
 * This file is copied directly from:
 *   https://github.com/NASA-AMMOS/3DTilesRendererJS
 *
 * All amazon changes will be start with "// + Amazon --------" and end with "// - Amazon --------"
 */

import { LRUCache } from '3d-tiles-renderer/src/utilities/LRUCache';
import { PriorityQueue } from '3d-tiles-renderer/src/utilities/PriorityQueue';

export type TwinMakerFetch = (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;

export class TilesRendererBase {

	readonly rootTileset : Object | null;
	readonly root : Object | null;

	errorTarget : Number;
	errorThreshold : Number;
	loadSiblings : Boolean;
	displayActiveTiles : Boolean;
	maxDepth : Number;
	stopAtEmptyTiles : Boolean;

	fetchOptions : Object;
	/** function to preprocess the url for each individual tile */
	preprocessURL : ((uri: string | URL) => string) | null;

	lruCache : LRUCache;
	parseQueue : PriorityQueue;
	downloadQueue : PriorityQueue;

	// + Amazon --------
	constructor( url : String, twinMakerFetch?: TwinMakerFetch );
	// - Amazon --------

	update() : void;
	traverse(
		beforeCb : ( ( tile : Object, parent : Object, depth : Number ) => Boolean ) | null,
		afterCb : ( ( tile : Object, parent : Object, depth : Number ) => Boolean ) | null
	) : void;
	dispose() : void;

}
