// import { test, expect } from '@playwright/test';
import { test, expect } from '@playwright/experimental-ct-react';
import R3FTestHarness from '../utils/testUtils';
import { useStore } from '../../../src/store';
// const { useStore } = require('../../../src/store/Store');

const TEST_IFRAME = '#root';
const LOCAL_SCENE = '/iframe.html?args=&id=developer-scene-composer--local-scene';
const CANVAS = '#tm-scene-unselectable-canvas';

test('load scene', async ({ page }) => {
  const scenePage = await page.goto(LOCAL_SCENE);
  expect(scenePage).toBeDefined()
});

test('visual regression', async({page}) => {
  await page.goto(LOCAL_SCENE);
  const frame = page.locator(TEST_IFRAME);
  expect(await frame.locator(CANVAS).screenshot()).toMatchSnapshot('local-scene-canvas.png'); 
}); 

test.describe('scene composer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOCAL_SCENE);
    const testStore = useStore('test1'); // current problem
    console.log('something: ', testStore)
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


