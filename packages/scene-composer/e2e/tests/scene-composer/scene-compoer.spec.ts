import { test, expect, Locator } from '@playwright/test';
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

const setSceneId = async (frame: Locator): Promise<string> => {
  const sceneId: string = await frame.evaluate(async () => {
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
  return sceneId;
};

const getScene = async (
  frame: { evaluate: (arg0: (_element: HTMLElement, sceneId: string) => Promise<Scene>, arg1: any) => any },
  sceneId: string,
) => {
  const scene = await frame.evaluate((_element: HTMLElement, sceneId: string) => {
    return Promise.resolve<Scene>((window as any)['__twinmaker_tests'][sceneId].scene);
  }, sceneId);
  return scene;
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
    await page.goto(LOCAL_SCENE);
    const frame = page.locator(TEST_IFRAME);
    const sceneId = await setSceneId(frame);
    const scene = await getScene(frame, sceneId);
    expect(sceneId).toEqual('motion-indicator-view-options');
    expect(scene.type).toEqual('Scene');
  });

  test('get object by name', async ({ page }) => {
    await page.goto(LOCAL_SCENE_2);
    const frame = page.locator(TEST_IFRAME);
    const sceneId = await setSceneId(frame);
    const scene = await getScene(frame, sceneId);
    const taco = async (scene?: any) => {
        console.log('TACO TACO TACO: ', scene.getObjectByName('PalletJack').isObject3D);
    };

    await page.evaluate(async ({ sceneId, callbackString }) => {
        const { scene } = (window as any)['__twinmaker_tests'][sceneId];
        // console.log('In callback: ', sceneId, callbackString);
        const cb = new Function(`return (${callbackString}).apply(null, arguments)`);
        // console.log('Callback is: ', cb);
        await cb(scene);
    }, { sceneId, callbackString: taco.toString() });

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
