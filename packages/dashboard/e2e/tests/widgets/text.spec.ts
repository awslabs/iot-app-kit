import { expect, test } from '../test';

const TEXT_WIDGET_CONTENT = 'This is test';
test.describe('Test Text Widget', () => {
  test('text widget should be visible on the dashboard', async ({
    dashboardWithTextWidget,
  }) => {
    const widget = dashboardWithTextWidget.gridArea.locator(
      '[data-gesture=widget]'
    );

    await expect(widget).toBeVisible();
  });

  test('verifying updating text of text widget', async ({
    dashboardWithTextWidget,
    page,
  }) => {
    const widget = dashboardWithTextWidget.gridArea.locator(
      '[data-gesture=widget]'
    );
    // select the widget
    await widget.hover();
    await page.mouse.down();
    await page.mouse.up();

    // edit text
    await dashboardWithTextWidget.gridArea
      .getByRole('textbox')
      .fill(TEXT_WIDGET_CONTENT);
    const text = await dashboardWithTextWidget.gridArea.textContent();
    expect(text).toContain(TEXT_WIDGET_CONTENT);
  });

  test('verifying copying of text widget', async ({
    dashboardWithTextWidget,
    page,
  }) => {
    const widget = dashboardWithTextWidget.gridArea.locator(
      '[data-gesture=widget]'
    );

    // hover on text widget
    await widget.hover();
    await page.mouse.down({ button: 'right' });
    await page.mouse.up({ button: 'right' });
    await dashboardWithTextWidget.gridArea.getByText('Copy').click();
    await dashboardWithTextWidget.gridArea.click({ button: 'right' });
    await dashboardWithTextWidget.gridArea.getByText('Paste').click();

    const widgets = await dashboardWithTextWidget.gridArea
      .locator('[data-gesture=widget]')
      .all();
    expect(widgets.length).toBe(2);
  });

  test('delete text widget', async ({ dashboardWithTextWidget, page }) => {
    let widget = dashboardWithTextWidget.gridArea.locator(
      '[data-gesture=widget]'
    );

    // click delete
    await widget.hover();
    await page.mouse.down({ button: 'right' });
    await page.mouse.up({ button: 'right' });
    await dashboardWithTextWidget.contextMenuDeleteButton.click();

    // confirm delete modal
    await dashboardWithTextWidget.confirmModalDeleteButton.click();

    // verify no widgets
    widget = dashboardWithTextWidget.gridArea.locator('[data-gesture=widget]');
    await expect(widget).not.toBeVisible();
  });

  test.describe('resizing', () => {
    test('verify dragging out bottom right handler increases height and width', async ({
      dashboardWithTextWidget,
      page,
    }) => {
      const widget = dashboardWithTextWidget.gridArea.locator(
        '[data-gesture=widget]'
      );

      const { width, height, x, y } = await widget.boundingBox();
      // the selector is out of the widget
      const bottomRight = dashboardWithTextWidget.gridArea.locator(
        'div[data-anchor="bottom-right"]'
      );

      await bottomRight.hover();
      await page.mouse.down();
      await page.mouse.move(x + 2 * width, y + 2 * height, { steps: 10 });
      await page.mouse.up();
      const newDimension = await widget.boundingBox();
      expect(newDimension.width > width).toBeTruthy();
      expect(newDimension.height > height).toBeTruthy();
    });

    test('verify dragging out bottom left handler increases height and width', async ({
      dashboardWithTextWidget,
      page,
    }) => {
      const widget = dashboardWithTextWidget.gridArea.locator(
        '[data-gesture=widget]'
      );

      const { width, height, x, y } = await widget.boundingBox();
      // the selector is out of the widget
      const bottomRight = dashboardWithTextWidget.gridArea.locator(
        'div[data-anchor="bottom-left"]'
      );

      await bottomRight.hover();
      await page.mouse.down();
      await page.mouse.move(x - 30, y + 1.25 * height, { steps: 10 });
      await page.mouse.up();
      const newDimension = await widget.boundingBox();
      expect(newDimension.width > width).toBeTruthy();
      expect(newDimension.height > height).toBeTruthy();
    });

    test('verify dragging out top left handler increases height and width', async ({
      dashboardWithTextWidget,
      page,
    }) => {
      const widget = dashboardWithTextWidget.gridArea.locator(
        '[data-gesture=widget]'
      );

      const { width, height, x, y } = await widget.boundingBox();
      // the selector is out of the widget
      const bottomRight = dashboardWithTextWidget.gridArea.locator(
        'div[data-anchor="top-left"]'
      );

      await bottomRight.hover();
      await page.mouse.down();
      await page.mouse.move(x - 30, y - 1.25 * height, { steps: 10 });
      await page.mouse.up();
      const newDimension = await widget.boundingBox();
      expect(newDimension.width > width).toBeTruthy();
      expect(newDimension.height > height).toBeTruthy();
    });

    test('verify dragging out top right handler increases height and width', async ({
      dashboardWithTextWidget,
      page,
    }) => {
      const widget = dashboardWithTextWidget.gridArea.locator(
        '[data-gesture=widget]'
      );

      const { width, height, x, y } = await widget.boundingBox();
      // the selector is out of the widget
      const bottomRight = dashboardWithTextWidget.gridArea.locator(
        'div[data-anchor="top-right"]'
      );

      await bottomRight.hover();
      await page.mouse.down();
      await page.mouse.move(x + 1.25 * width, y - 1.25 * height, { steps: 10 });
      await page.mouse.up();
      const newDimension = await widget.boundingBox();
      expect(newDimension.width > width).toBeTruthy();
      expect(newDimension.height > height).toBeTruthy();
    });
  });

  test.describe('Moving', () => {
    test('verify the widget can be moved around', async ({
      dashboardWithTextWidget,
      page,
    }) => {
      const widget = dashboardWithTextWidget.gridArea.locator(
        '[data-gesture=widget]'
      );

      const { width, height, x, y } = await widget.boundingBox();

      await widget.hover();
      await page.mouse.down();
      await page.mouse.move(x + 1.5 * width, y, { steps: 10 });
      await page.mouse.move(x + 1.5 * width, y + 1.5 * height, { steps: 10 });
      await page.mouse.move(x - 1.5 * width, y, { steps: 10 });
      await page.mouse.move(x, y - 1.5 * height, { steps: 10 });
      await page.mouse.up();
      const newDimension = await widget.boundingBox();
      expect(newDimension.x !== x).toBeTruthy();
      expect(newDimension.y !== y).toBeTruthy();
      await expect(widget).toBeVisible();
    });
  });

  test.describe('Config Panel updates', () => {
    test('verify the Text style is configurable', async ({
      dashboardWithTextWidget,
      configPanel,
      page,
    }) => {
      const widget = dashboardWithTextWidget.gridArea.locator(
        '[data-gesture=widget]'
      );

      const fillColor = '#bf3636';
      const fillColorRGB = 'rgb(191, 54, 54)';
      const newFontSize = '24px';
      // open config panel
      await configPanel.collapsedButton.click();
      await configPanel.container.getByLabel('color picker').fill(fillColor);
      await configPanel.container.getByLabel('toggle bold text').click();
      await configPanel.container.getByLabel('toggle italicize text').click();
      await configPanel.container.getByLabel('toggle underline text').click();

      await configPanel.container
        .locator('div[data-test-id="text-widget-setting-font-size"]')
        .click();

      // setting 24 px font size
      await page.keyboard.down('ArrowDown');
      await page.keyboard.down('ArrowDown');
      await page.keyboard.down('Enter');

      await widget.dblclick();
      await widget.getByRole('textbox').fill(TEXT_WIDGET_CONTENT);

      const color = await widget
        .locator('textarea')
        .evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue('color')
        );

      const fontSize = await widget
        .locator('textarea')
        .evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue('font-size')
        );

      expect(color).toBe(fillColorRGB);
      expect(fontSize).toBe(newFontSize);
      await expect(widget.locator('textarea')).toHaveCSS(
        'font-style',
        'italic'
      );
      await expect(widget.locator('textarea')).toHaveCSS(
        'text-decoration',
        `underline solid ${fillColorRGB}`
      );
      await expect(widget.locator('textarea')).toHaveCSS('font-weight', '700');
    });

    test('when link is enabled, it should route to the path specified', async ({
      dashboardWithTextWidget,
      configPanel,
      page,
    }) => {
      const widget = dashboardWithTextWidget.gridArea.locator(
        '[data-gesture=widget]'
      );

      const url = 'https://www.validurl.com/test';
      await configPanel.collapsedButton.click();
      await widget.dblclick();
      await widget.getByRole('textbox').fill(TEXT_WIDGET_CONTENT);
      await configPanel.container
        .getByTestId('text-widget-link-header')
        .click();
      await configPanel.container
        .getByText('Create link', { exact: true })
        // .locator('input')
        .click();
      await configPanel.container
        .getByLabel('text widget link input')
        .fill(url);

      // go to preview
      await page.getByRole('button', { name: 'preview' }).click();

      // clicking on the link
      await page.getByText(TEXT_WIDGET_CONTENT).click();
      await page.waitForURL(`**${url}`);
    });

    test('when link is enabled, it should sanitize href and not link if dangerous', async ({
      dashboardWithTextWidget,
      configPanel,
      page,
    }) => {
      const widget = dashboardWithTextWidget.gridArea.locator(
        '[data-gesture=widget]'
      );

      const url = "javascript://%0aalert('1.com')";
      await configPanel.collapsedButton.click();
      await widget.dblclick();
      await widget.getByRole('textbox').fill(TEXT_WIDGET_CONTENT);
      await configPanel.container
        .getByTestId('text-widget-link-header')
        .click();
      await configPanel.container
        .getByText('Create link', { exact: true })
        .click();
      await configPanel.container
        .getByLabel('text widget link input')
        .fill(url);

      // go to preview
      await page.getByRole('button', { name: 'preview' }).click();

      // clicking on the link
      await page.getByText(TEXT_WIDGET_CONTENT).click();

      await expect(page.getByText(TEXT_WIDGET_CONTENT)).toBeVisible();
      await expect(page.getByText(TEXT_WIDGET_CONTENT)).not.toHaveAttribute(
        'href'
      );
    });
  });
});
