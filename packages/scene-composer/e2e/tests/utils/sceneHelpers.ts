import { Scene, WebGLRenderer } from 'three';
import type { Page, Locator } from '@playwright/test';

import R3FTestHarness from './r3fTestHarness';

declare global {
  interface Window {
    __twinmaker_tests: {
      [key: string]: {
        scene: Scene;
        gl: WebGLRenderer;
      };
    };
  }
}

type SceneLoadedEventDetail = { sceneComposerId: string; scene: Scene; gl: WebGLRenderer };

interface SceneLoadedEvent extends Event {
  detail: SceneLoadedEventDetail;
}

type evaluateProps = {
  sceneId: string;
  arg?: string;
  callback?: string;
  callbackString?: string;
  TMHarnessClass: string;
};
export class PlaywrightHelper {
  localScene: string;

  constructor(public readonly page: Page, localScene: string) {
    this.page = page;
    this.localScene = localScene;
  }

  async goto(localScene: string): Promise<void> {
    await this.page.goto(localScene);
  }

  async getFrame(localFrame: string): Promise<Locator> {
    return this.page.locator(localFrame);
  }

  async getSceneId(frame: Locator): Promise<string> {
    const sceneId: string = await frame.evaluate(async () => {
      return await new Promise((res, rej) => {
        const timer = setTimeout(
          () => rej(new Error('Timeout, twinmaker:scene-loaded was not reached in reasonable time.')),
          30000,
        );

        window.addEventListener('twinmaker:scene-loaded', (evt: Event) => {
          const { detail } = evt as SceneLoadedEvent;
          const { sceneComposerId, scene, gl } = detail;
          window['__twinmaker_tests'] = window['__twinmaker_tests'] || {};
          window['__twinmaker_tests'][sceneComposerId] = { scene, gl };
          clearTimeout(timer);
          res(sceneComposerId);
        });
      });
    });
    return sceneId;
  }

  async tmScene(frame: Locator, sceneId: string): Promise<Scene> {
    const sceneResult = await frame.evaluate((_element: HTMLElement, sceneId: string) => {
      return Promise.resolve<Scene>(window['__twinmaker_tests'][sceneId].scene);
    }, sceneId);
    return sceneResult;
  }

  async getScene(): Promise<{ frame: Locator; sceneId: string; scene: Scene }> {
    await this.page.goto(this.localScene);
    const frame = this.page.locator('#root');
    const sceneId = await this.getSceneId(frame);
    const scene = await this.tmScene(frame, sceneId);
    return {
      frame,
      sceneId,
      scene,
    };
  }

  async playwrightState(...props) {
    const result = await this.getScene();
    const sceneId = result.sceneId;
    return await this.page.evaluate(
      async ({ arg, callback, sceneId, TMHarnessClass }: evaluateProps) => {
        const { scene } = window['__twinmaker_tests'][sceneId];
        if (!scene) throw new Error('Scene is not loaded');
        const HarnessClass = await eval('window.TMHarnessClass = ' + TMHarnessClass);
        const harness = await new HarnessClass(scene);

        if (callback) {
          return await Promise.resolve(harness[callback](arg));
        }
      },
      {
        sceneId: sceneId,
        arg: props[1],
        callback: props[0],
        TMHarnessClass: R3FTestHarness.toString(),
      },
    );
  }

  // map harness functions here
  async getObjectByName(name: string) {
    return await this.playwrightState('getObjecByName', name);
  }
}
