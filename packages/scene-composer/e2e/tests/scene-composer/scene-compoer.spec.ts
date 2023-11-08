import { test, expect } from '@playwright/test';

// import { test, expect } from '@playwright/experimental-ct-react';
import { Scene, WebGLRenderer } from 'three';

import R3FTestHarness from '../utils/testUtils';
// import { useStore } from '../../../dist/src/store';
// const { useStore } = require('../../../src/store/Store');

const TEST_IFRAME = '#root';
const LOCAL_SCENE = '/iframe.html?args=&id=tests-scene-viewer--motion-indicator';
const CANVAS = '#tm-scene-unselectable-canvas';

type SceneLoadedEventDetail = { sceneComposerId: string; scene: Scene; gl: WebGLRenderer };

interface SceneLoadedEvent extends Event {
  detail: SceneLoadedEventDetail;
}

test('load scene', async ({ page }) => {
  const scenePage = await page.goto(LOCAL_SCENE);
  expect(scenePage).toBeDefined();
});

test('visual regression', async ({ page }) => {
  await page.goto(LOCAL_SCENE);
  const frame = page.locator(TEST_IFRAME);
  expect(await frame.locator(CANVAS).screenshot()).toMatchSnapshot('local-scene-canvas.png');
});

test.describe('scene composer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOCAL_SCENE);
  });

  test('accessing the scene', async ({ page }) => {
    await page.goto(LOCAL_SCENE);
    const frame = page.locator(TEST_IFRAME);

    const sceneId = await frame.evaluate<string>(async () => {
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
          console.log('[BROWSER] results', (window as any)['__twinmaker_tests']);
          clearTimeout(timer);
          res(sceneComposerId);
        });
      });
    });

    console.log('sceneId:', sceneId);
    const scene = await frame.evaluate<Scene, string, HTMLElement>((_element: HTMLElement, sceneId: string) => {
      console.log('[BROWSER] sceneId:', sceneId);
      return Promise.resolve<Scene>((window as any)['__twinmaker_tests'][sceneId].scene);
    }, sceneId);

    expect(scene.type).toEqual('Scene');
  });

  // test('get scene', async({page}) => {
  //   // const scene = useStore('10'); // fails tests
  //   // await expect(scene).toBeDefined()
  // });

  // test('get object', async({page}) => {

  // });

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
