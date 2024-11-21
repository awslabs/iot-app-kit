import { expect, test } from '@playwright/test';

import { PlaywrightHelper } from '../utils/sceneHelpers';

const localScene = '/iframe.html?args=&id=developer-scene-composer--local-scene';
const canvas = '#tm-scene-unselectable-canvas';

test.describe('scene-composer--local-scene', () => {
  test.skip('visual regression', async ({ page }) => {
    await page.goto(localScene);
    await page.evaluate(() => document.body.classList.add('awsui-dark-mode')); // TODO: Make this a utility, and tie it to the browser preferences so it just works with playwright's default colorScheme toggle
    await page.waitForTimeout(500); // Wait for scene to load.
    const screenshot = await page.locator(canvas).screenshot();

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
