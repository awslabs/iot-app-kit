import isAbsoluteUrl from 'is-absolute-url';

import { URIModifier } from '../interfaces';

import { getContainingDir } from './pathUtils';

/**
 * Creates a uri modifier that uses the baseUrl to resolve relative Urls and falls back to the sceneContent location
 * if no baseUrl is provided.
 *
 * @param sceneContentUri the sceneContentUri of the current loaded scene. It will be used to resolve relative urls
 * if no baseUrl is provided.
 * @param baseUrl override the baseUrl to resolve relative urls.
 * @returns a uriModifier that resolves relative url based on the standard url resolution algorithm.
 */
export function createStandardUriModifier(sceneContentUri: string, baseUrl: string | undefined): URIModifier {
  baseUrl = baseUrl ?? getContainingDir(sceneContentUri);
  return (uri: string) => (isAbsoluteUrl(uri) ? uri : baseUrl + uri);
}
