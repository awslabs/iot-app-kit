import { expect, test } from '@playwright/test';

import { PlaywrightHelper } from '../utils/sceneHelpers';

const localScene = '/iframe.html?args=&id=tests-scene-viewer--motion-indicator';
const canvas = '#tm-scene-unselectable-canvas';

test.describe('scene-viewer--motion-indicator', () => {
  test('visual regression', async ({ page }) => {
    await page.goto(localScene);
    const frame = page.locator('#storybook-root');
    expect(await frame.locator(canvas).screenshot()).toMatchSnapshot({
      name: 'motion-indicator-canvas.png',
      threshold: 1,
    });
  });

  test('get scene', async ({ page }) => {
    const state = new PlaywrightHelper(page, localScene);
    const scene = await state.getScene();
    expect(scene.sceneId).toEqual('motion-indicator-view-options');
    expect(scene.scene.type).toEqual('Scene');
  });
});
