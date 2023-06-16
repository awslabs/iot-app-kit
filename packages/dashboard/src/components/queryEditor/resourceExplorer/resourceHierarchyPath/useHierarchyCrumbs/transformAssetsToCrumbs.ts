import { type AssetSummary } from '@aws-sdk/client-iotsitewise';

/** Turn assets into the correct form for rendering breadcrumbs. */
export function transformAssetsToCrumbs(assets: AssetSummary[]): { href: string; text: string }[] {
  const crumbs = assets.map(({ id = '', name = '' }) => ({ href: id, text: name }));

  return crumbs;
}
