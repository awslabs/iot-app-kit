import { test, expect, Locator } from '@playwright/test';
import { Scene, WebGLRenderer } from 'three';
import R3FTestHarness from '../utils/testUtils';

const TEST_IFRAME = '#root';
const LOCAL_SCENE = '/iframe.html?args=&id=tests-scene-viewer--motion-indicator';
const LOCAL_SCENE_2 = '/iframe.html?args=&id=developer-scene-composer--local-scene';
const CANVAS = '#tm-scene-unselectable-canvas';

declare global {
  interface Window { 
    __twinmaker_tests: {
      [key: string]: {
        scene: Scene, 
        gl: WebGLRenderer
      }
    }
  }
}

type SceneLoadedEventDetail = { sceneComposerId: string; scene: Scene; gl: WebGLRenderer };

interface SceneLoadedEvent extends Event {
  detail: SceneLoadedEventDetail;
}

const sceneLoaded = async (host: Locator): Promise<string> => {
  const sceneId: string = await host.evaluate(async () => {
    return await new Promise((res, rej) => {
      const timer = setTimeout(
        () => rej(new Error('Timeout, twinmaker:scene-loaded was not reached in reasonable time.')),
        20000,
      );

      window.addEventListener('twinmaker:scene-loaded', (evt: Event) => {
        const { detail } = evt as SceneLoadedEvent;
        const { sceneComposerId, scene, gl } = detail;
        (window)['__twinmaker_tests'] = (window)['__twinmaker_tests'] || {};
        (window)['__twinmaker_tests'][(sceneComposerId)] = { scene, gl };
        clearTimeout(timer);
        res(sceneComposerId);
      });
    });
  });
  return sceneId;
};

const getScene = async (frame: Locator, sceneId: string ) => {
  const scene = await frame.evaluate((_element: HTMLElement, sceneId: string) => {
    return Promise.resolve<Scene>((window)['__twinmaker_tests'][sceneId].scene);
  }, sceneId);
  return scene;
};

type evaluateProps = {
  sceneId: string, 
  callbackString: string, 
  TMHarnessClass: string
}
const playwrightHelper = async ({...props}) => {
  const {page, sceneId, callback} = props;  
  return await page.evaluate(async ({ sceneId, callbackString, TMHarnessClass }: evaluateProps) => {
    const { scene } = (window)['__twinmaker_tests'][sceneId];
    if (!scene) {
      throw new Error('Scene is not loaded')
    }
    const HarnessClass = eval('window.TMHarnessClass = ' + TMHarnessClass);
    const harness = await new HarnessClass(scene);
    const cb = new Function(`return (${callbackString}).apply(null, arguments)`);
    return await cb(harness);
  }, { sceneId: sceneId, callbackString: callback.toString(), TMHarnessClass: R3FTestHarness.toString() });
}

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
    const sceneId = await sceneLoaded(frame);
    const scene = await getScene(frame, sceneId);
    expect(sceneId).toEqual('motion-indicator-view-options');
    expect(scene.type).toEqual('Scene');
  });

  test('get object by name', async ({ page }) => {
    await page.goto(LOCAL_SCENE_2);
    const frame = page.locator(TEST_IFRAME);
    const sceneId = await sceneLoaded(frame);
    await getScene(frame, sceneId); 
    const callback = async (harness: R3FTestHarness) => { return await harness.getObjecByName('PalletJack')};
    const palletJack = await playwrightHelper({page, sceneId, callback})

    expect(palletJack.isObject3D).toBeTruthy();
    expect(palletJack.type).toEqual('Group');
    expect(palletJack.visible).toBeTruthy();
  });

  test('delete object', async({page}) => {
    await page.goto(LOCAL_SCENE_2);
    const frame = page.locator(TEST_IFRAME);
    const sceneId = await sceneLoaded(frame);
    await getScene(frame, sceneId); 
    const callback = async (harness: R3FTestHarness) => { return await harness.getObjecByName('PalletJack')};
    const palletJack = await playwrightHelper({page, sceneId, callback})

    expect(palletJack.isObject3D).toBeTruthy();

    // const callback2 = async (harness: R3FTestHarness) => { return await harness.deleteObject(palletJack)};
    // await playwrightHelper({page, sceneId, callback2})

    // await getScene(frame, sceneId);    
    // const palletJackDeleted = await playwrightHelper({page, sceneId, callback})
    // console.log('palletJackDeleted: ', palletJackDeleted)
    // expect(palletJackDeleted).toBeFalsy();
  });

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
