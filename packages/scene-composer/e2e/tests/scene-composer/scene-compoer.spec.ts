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

const setupScene = async (pageToLoad: any, pageScene: string, callback)=> {
  await pageToLoad.goto(pageScene);
  const frame = pageToLoad.locator(TEST_IFRAME);

  const sceneId = await frame.evaluate(async () => {
    return await new Promise((res, rej) => {
      const timer = setTimeout(
        () => rej(new Error('Timeout, twinmaker:scene-loaded was not reached in reasonable time.')),
        20000,
      );

      window.addEventListener('twinmaker:scene-loaded', (evt: Event) => {
        const { detail } = evt as SceneLoadedEvent;
        const { sceneComposerId, scene, gl } = detail;
        (window as any)['__twinmaker_tests'] = (window as any)['__twinmaker_tests'] || {};
        (window as any)['__twinmaker_tests'][sceneComposerId] = { scene, gl };

        clearTimeout(timer);
        res(sceneComposerId);
      });
    });
  });

  const scene = await frame.evaluate((_element: HTMLElement, sceneId: string) => {
    return Promise.resolve<Scene>((window as any)['__twinmaker_tests'][sceneId].scene);
  }, sceneId);

  const getByName = await frame.evaluate((_element: HTMLElement, sceneId: string) => {
    // return Promise.resolve<Scene>((window as any)['__twinmaker_tests'][sceneId].scene.getObjecByName);
    const test = (window as any)['__twinmaker_tests'][sceneId].scene.id;
    console.log('playwright getByName: ', test)
  }, sceneId);

  // return scene;
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
    const scene: Scene = await setupScene(page, LOCAL_SCENE);
    expect(scene.type).toEqual('Scene');
  });

  // TODO: setup get object by some other means
  test('get object by name', async ({ page }) => {
    // wrap in frame.evaluate with awaits like in setup()
    const test = (scene) => {
      const harness = new R3FTestHarness(scene);
      const object3D = !!harness.testScene.getObjectByName;
      console.log('playwright: ', object3D)
    // expect(harness).toBeTruthy();
    };
    // const result = harness.getObjecByName('MainEditorCamera')

    // const scene: Scene = await setupScene(page, LOCAL_SCENE_2, test);
    await setupScene(page, LOCAL_SCENE_2, test);
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
