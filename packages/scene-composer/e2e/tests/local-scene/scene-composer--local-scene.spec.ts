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
    const palletJack = await state.getObjectByName('PalletJack');

    // assert expected values on object
    expect(palletJack.isObject3D).toBeTruthy();
    expect(palletJack.type).toEqual('Group');
    expect(palletJack.visible).toBeTruthy();
  });

  test('validate hierarchy interaction', async ({ page }) => {
    const state = new PlaywrightHelper(page, localScene);
    const palletJack = await state.getObjectByName('PalletJack');
    // select object in hierarchy
    await page.getByTestId(palletJack.userData.componentRef).click();

    // assert that the correct obj is displayed in the Inspector Panel
    expect(page.getByTestId(`ip-${palletJack.userData.componentRef}`)).toBeDefined();
  });
});
