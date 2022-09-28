/**
 * This file is copied directly from:
 *   https://github.com/NASA-AMMOS/3DTilesRendererJS
 *
 * All amazon changes will be start with "// + Amazon --------" and end with "// - Amazon --------"
 */

import { Box3, Camera, Vector2, Matrix4, WebGLRenderer, Object3D, LoadingManager } from 'three';
import { Tile } from '3d-tiles-renderer/src/base/Tile';
import { Tileset } from '3d-tiles-renderer/src/base/Tileset';
import { TilesGroup } from '3d-tiles-renderer/src/three/TilesGroup';

import { TilesRendererBase, TwinMakerFetch } from './TilesRendererBase';

export class TilesRenderer extends TilesRendererBase {

	autoDisableRendererCulling : Boolean;
	optimizeRaycast : Boolean;

	manager : LoadingManager;

	group : TilesGroup;

	// + Amazon --------
	constructor( url : String, twinMakerFetch?: TwinMakerFetch );
	// - Amazon --------

	getBoundsTransform( target: Matrix4 ) : Boolean;

	getBounds( box : Box3 ) : Boolean;

	hasCamera( camera : Camera ) : Boolean;
	setCamera( camera : Camera ) : Boolean;
	deleteCamera( camera : Camera ) : Boolean;

	setResolution( camera : Camera, x : Number, y : Number ) : Boolean;
	setResolution( camera : Camera, resolution : Vector2 ) : Boolean;
	setResolutionFromRenderer( camera : Camera, renderer : WebGLRenderer ) : Boolean;

	forEachLoadedModel( callback : ( scene : Object3D, tile : Tile ) => void ) : void;

	onLoadTileSet : ( ( tileSet : Tileset ) => void ) | null;
	onLoadModel : ( ( scene : Object3D, tile : Tile ) => void ) | null;
	onDisposeModel : ( ( scene : Object3D, tile : Tile ) => void ) | null;
	onTileVisibilityChange : ( ( scene : Object3D, tile : Tile, visible : boolean ) => void ) | null;

}
