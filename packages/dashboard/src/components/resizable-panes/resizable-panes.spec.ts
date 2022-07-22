import { newSpecPage, jestSetupTestFramework } from '@stencil/core/testing';
jestSetupTestFramework();
import { ResizablePanes } from './resizable-panes';

const leftSlotContent = `Warp core monitor`;
const centerSlotContent = `Forward viewscreen`;
const rightSlotContent = `Phaser controls`;

const components = [ResizablePanes];
const html = `
  <resizable-panes>
    <div slot="left">
      <p>${leftSlotContent}</p>
    </div>
    <div slot="center">
      <p>${centerSlotContent}</p>
    </div>
    <div slot="right">
      <p>${rightSlotContent}</p>
    </div>
  </resizable-panes>
`;

describe('resizable-panes', () => {
  it('should render slots with shadow dom', async () => {
    const page = await newSpecPage({
      components,
      html,
    });
    const { root } = page;

    expect(root).toBeTruthy();
    if (!root) return;
    const paraEls = root.querySelectorAll('p');
    expect(paraEls[0].textContent).toEqual(leftSlotContent);
    expect(paraEls[1].textContent).toEqual(centerSlotContent);
    expect(paraEls[2].textContent).toEqual(rightSlotContent);
  });

  it('should render slots without shadow dom', async () => {
    const page = await newSpecPage({
      components,
      html,
      supportsShadowDom: false,
    });
    const { root } = page;

    expect(root).toBeTruthy();
    if (!root) return;
    const paraEls = root.querySelectorAll('p');
    expect(paraEls[0].textContent).toEqual(leftSlotContent);
    expect(paraEls[1].textContent).toEqual(centerSlotContent);
    expect(paraEls[2].textContent).toEqual(rightSlotContent);
  });
});
