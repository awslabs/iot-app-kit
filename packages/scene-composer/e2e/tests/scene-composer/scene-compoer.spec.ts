import { test, expect } from '@playwright/test';
import { Scene, WebGLRenderer } from 'three';
import R3FTestHarness from '../utils/testUtils';

const TEST_IFRAME = '#root';
const LOCAL_SCENE = '/iframe.html?args=&id=tests-scene-viewer--motion-indicator';
const LOCAL_SCENE_2 = '/iframe.html?args=&id=developer-scene-composer--local-scene';
const CANVAS = '#tm-scene-unselectable-canvas';

type SceneLoadedEventDetail = { sceneComposerId: string; scene: Scene; gl: WebGLRenderer };

interface SceneLoadedEvent extends Event {
  detail: SceneLoadedEventDetail;
}

const setupScene = async (pageToLoad: any, pageScene: string, callback: (detail) => any) => {
  await pageToLoad.goto(pageScene);
  await pageToLoad.exposeFunction('callback', callback);
  const frame = pageToLoad.locator(TEST_IFRAME);

  return await frame.evaluate(async () => {
    return await new Promise((res, rej) => {
      const timer = setTimeout(
        () => rej(new Error('Timeout, twinmaker:scene-loaded was not reached in reasonable time.')),
        10000,
      );
      return window.addEventListener('twinmaker:scene-loaded', async (evt: Event) => {
        const { detail } = evt as SceneLoadedEvent;
        clearTimeout(timer);
        res(await callback(detail));
      });
    });
  });
};

test('load scene', async ({ page }) => {
  const scenePage = await page.goto(LOCAL_SCENE);
  expect(scenePage).toBeDefined();
});

test('visual regression', async ({ page }) => {
  await page.goto(LOCAL_SCENE);
  const frame = page.locator(TEST_IFRAME);
  // check to see if github actions has ability to comment that you're setting up screenshots
  expect(await frame.locator(CANVAS).screenshot()).toMatchSnapshot({ name: 'local-scene-canvas.png', threshold: 1 });
});

test.describe('scene composer', () => {
  test('get scene', async ({ page }) => {
    const getSceneType = (detail) => {
      return detail?.scene?.type;
    };
    const sceneType = await setupScene(page, LOCAL_SCENE, getSceneType);
    expect(sceneType).toEqual('Scene');
  });

  test('get object by name', async ({ page }) => {
    const getByName = (detail) => {
      const getObjectByName = !!detail.scene.getObjectByName
      console.log('is there a getObjectByName function? ', !!detail.scene.getObjectByName);
      // console.log('is there a Pallet Jack? ', !!detail.scene.getObjectByName('Pallet Jack'));
      // const result = harness.getObjecByName('MainEditorCamera') // if using LOCAL_SCENE
      // const pallet = scene.getObjectByName('PalletJack') // if using LOCAL_SCENE_2
      return getObjectByName;
    };
    const getObjectByName = await setupScene(page, LOCAL_SCENE_2, getByName);
    expect(getObjectByName).toBeFalsy()
  });

  // test('delete object', async({page}) => {

  // });

  // test('scale object', async({page}) => {

  // });

  // test('rotate object', async({page}) => {

  // });

  // test('move object', async({page}) => {

  // });

  // test('move object', async({page}) => {

  // });

  // test('select object', async({page}) => {

  // });

  // test('click object', async({page}) => {

  // });

  // test('add tag', async({page}) => {

  // });

  // test('place object', async({page}) => {

  // });

  // test('undo edit', async({page}) => {

  // });

  // test('redo edit', async({page}) => {

  // });
});
