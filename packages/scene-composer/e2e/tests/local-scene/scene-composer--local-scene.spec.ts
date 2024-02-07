import { test, expect } from '@playwright/test';

import { PlaywrightHelper } from '../utils/sceneHelpers';

const localScene = '/iframe.html?args=&id=developer-scene-composer--local-scene';
const canvas = '#tm-scene-unselectable-canvas';

test.describe('scene-composer--local-scene', () => {
  test('visual regression', async ({ page }, testInfo) => {
    await page.goto(localScene);
    const frame = page.locator('#root');

    // Example on how to make sure the screenshot shows up in the test report
    // TODO: Automate this so every screenshot is attached automatically to it's test.
    const screenshot = await frame.locator(canvas).screenshot();
    await testInfo.attach('local-scene-canvas.png', { body: screenshot, contentType: 'image/png' });

    expect(screenshot).toMatchSnapshot('local-scene-canvas.png');
  });

  test('get object by name', async ({ page }) => {
    const state = new PlaywrightHelper(page, localScene);
    // find object named 'PalletJack'
    const palletJack = await state.getObjecByName('PalletJack');

    // assert expected values on object
    expect(palletJack.isObject3D).toBeTruthy();
    expect(palletJack.type).toEqual('Group');
    expect(palletJack.visible).toBeTruthy();
  });

  test('select object', async ({ page }) => {
    const state = new PlaywrightHelper(page, localScene);
    // find object named 'PalletJack'
    const palletJack = await state.getObjecByName('PalletJack');

    // select object in hierarchy
    const formattedName = palletJack.name.replace(/([A-Z])/g, ' $1').trim();
    const handle = await page.$(`text=${formattedName}`);
    await handle?.hover();
    await handle?.click();

    // assert that the associated selectedSceneNode.ref was selected in the Inspector Panel
    expect(page.getByTestId('cb85148b-00ca-4006-8b0f-600890eaee46')).toBeDefined();
  });
});
