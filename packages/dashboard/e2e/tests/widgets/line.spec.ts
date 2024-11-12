import { NEW_PROPERTY_NAME } from '../constants';
import { test, expect } from '@playwright/test';
import { getTrendCursorText } from './LineWidget';
import { type Locator } from '@playwright/test';
import { createNewDashboardWithWidget } from '../createDashboardWidget';
import { ResourceExplorer } from '../resourceExplorer/ResourceExplorer';
import { ConfigPanel } from '../configPanel/ConfigPanel';

const NEW_Y_LABEL = 'This is new Y-axis Label';
const Y_MIN = '1';
const Y_MAX = '99';

const getComputedStyles = async (locator: Locator) => {
  return await locator.evaluate((el) => {
    const computedStyle = window.getComputedStyle(el);
    return {
      strokeWidth: computedStyle.getPropertyValue('stroke-width'),
      strokeDashArray: computedStyle.getPropertyValue('stroke-dasharray'),
    };
  });
};

//  -----------------------------FOR TEST FAILURES --------------------------------------
// 1. check if the ECHARTS is rendering the svg in a different fashion, check its version number and the rendered svg
// 2. if it's in the following fashion, check further in the test case, else you may have to update wherever we are
//    testing the svg of the rendered chart
//  ---------------------------ECHARTS SVG STRUCTURE-------------------------------------
// parent <g> holds all the elements rendered
// <text>[0] --> this holds the yaxis label value (else the first of Yaxis marker i.e. Ymin
// <text>[5] --> holds the Ymax when the Ylabel is not set , else 6th text will hold the Ymax value
//  first child <g> has <path> --> holds the styling of the series lines
//  second child  <g> --> series line 2, so on so forth
// <text>[n-th] --> when a trend cursor is added , this is timestamp rendered on a trend cursor

test.describe('test Line Widget Styling changes', () => {
  test('verify widget has a property', async ({ page, browser }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithLineWidget = await createNewDashboardWithWidget(
      'line',
      page,
      browser,
      resourceExplorer
    );
    const gridText = await dashboardWithLineWidget.gridArea.textContent();
    expect(gridText).toContain('Max Temperature');
  });

  test('verify update title reflects on the widget', async ({
    page,
    browser,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const configPanel = new ConfigPanel({ page });
    const dashboardWithLineWidget = await createNewDashboardWithWidget(
      'line',
      page,
      browser,
      resourceExplorer
    );
    await configPanel.collapsedButton.click();
    expect(await configPanel.container.isVisible()).toBeTruthy();
    // update name
    await configPanel.titleContainer.fill('New Line Widget');
    const widget = dashboardWithLineWidget.gridArea.locator(
      '[data-gesture=widget]'
    );
    expect(await widget.textContent()).toContain('New Line Widget');
  });

  test.describe('Y Axis', () => {
    test('verify y-axis text change is reflects on the widgets', async ({
      page,
      browser,
    }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const configPanel = new ConfigPanel({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );

      await configPanel.collapsedButton.click();
      await configPanel.yAxisLabelInput.fill(NEW_Y_LABEL);
      // the first of the text inside the g is Y-Axis
      const svgTexts = await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .locator('text')
        .all();

      expect(await svgTexts[0].textContent()).toContain(NEW_Y_LABEL);
    });

    test('verify toggling show Y-axis  hides/un-hides y-axis ', async ({
      page,
      browser,
    }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const configPanel = new ConfigPanel({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );
      await configPanel.collapsedButton.click();
      await configPanel.yAxisLabelInput.fill(NEW_Y_LABEL);
      await configPanel.showYAxisToggle.click();

      const svgTexts = await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .locator('text')
        .all();
      // the first of the text inside the g is Y-Axis
      expect(await svgTexts[0].textContent()).not.toContain(NEW_Y_LABEL);
      await configPanel.showYAxisToggle.click();
      expect(await svgTexts[0].textContent()).toContain(NEW_Y_LABEL);
    });

    test('changing Y Min and Max reflects on the widget', async ({
      page,
      browser,
    }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const configPanel = new ConfigPanel({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );
      await configPanel.collapsedButton.click();

      await configPanel.YMinInput.fill(Y_MIN);
      await configPanel.YMaxInput.fill(Y_MAX);

      // the first of the text inside the g is Y-Axis
      const svgTexts = await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .locator('text')
        .all();

      const textValues: string[] = [];
      for (let i = 0; i < svgTexts.length; i++) {
        const value = await svgTexts[i].textContent();
        value && textValues.push(value);
      }

      // the first 6 (w.o yaxis label) of the <text> inside the g are the Y-Axis markers
      expect(await svgTexts[0].textContent()).toContain(Y_MIN);
      expect(await svgTexts[5].textContent()).toContain(Y_MAX);
    });
  });

  test.describe('test Line styles', () => {
    test('update Line type', async ({ page, browser }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const configPanel = new ConfigPanel({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );
      await configPanel.collapsedButton.click();

      await configPanel.container
        .getByLabel('Line type', { exact: true })
        .click();
      await configPanel.container.getByText('None', { exact: true }).click();
      const div = dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .getByLabel('This is a chart with type Scatter plot', { exact: false });

      await expect(div).toBeVisible();
    });

    test('update Line thickness', async ({ page, browser }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const configPanel = new ConfigPanel({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );
      await configPanel.collapsedButton.click();

      await configPanel.container.getByText('Normal', { exact: true }).click();
      await configPanel.container.getByText('Thick', { exact: true }).click();

      // the child g within the parent g holds the series line information
      // the path is the line drawn and holds the styling info
      const path = dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .locator('g')
        .nth(1)
        .locator('path');

      let strokeWidth = await path.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('stroke-width')
      );
      expect(strokeWidth === '5px').toBeTruthy();

      // change back to normal
      await configPanel.container.getByText('Thick', { exact: true }).click();
      await configPanel.container.getByText('Normal', { exact: true }).click();

      strokeWidth = await path.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('stroke-width')
      );

      expect(strokeWidth === '2px').toBeTruthy();
    });

    test('update line style', async ({ page, browser }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const configPanel = new ConfigPanel({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );
      await configPanel.collapsedButton.click();
      await configPanel.container.getByText('Solid', { exact: true }).click();
      await configPanel.container.getByText('Dashed', { exact: true }).click();
      // refer to the top of the file for details, in short this is checking the rendered svg
      const path = dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .locator('g')
        .nth(1)
        .locator('path');
      let strokeDashArray = await path.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('stroke-dasharray')
      );
      expect(strokeDashArray === '8px, 4px').toBeTruthy();

      // changing to Dotted line style
      await configPanel.container.getByText('Dashed', { exact: true }).click();
      await configPanel.container.getByText('Dotted', { exact: true }).click();
      strokeDashArray = await path.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('stroke-dasharray')
      );
      expect(strokeDashArray === '2px').toBeTruthy();
    });
  });

  test.describe('Legend Section', () => {
    test('Hide/Show Legend', async ({ page, browser }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const configPanel = new ConfigPanel({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );
      await configPanel.collapsedButton.click();

      await configPanel.showLegendToggle.click();

      let legendText = await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .textContent();

      // TODO: update this to check property name, checking data streams because of a bug which hides the table
      expect(legendText).not.toContain('Data Streams');
      await configPanel.showLegendToggle.click();
      legendText = await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .textContent();
      expect(legendText).toContain('Data streams');
    });
  });

  test.describe('Trend Cursors', () => {
    test('add a trend Cursor', async ({ browser, page }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );
      await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .click({ button: 'right' });

      // Add a TC
      await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .getByText('Add Trend Cursor')
        .click();

      await page.waitForTimeout(3000);

      const tcText = await getTrendCursorText(dashboardWithLineWidget);
      expect(tcText).toBeDefined();

      const legend = dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .locator('div[class="base-chart-legend-table-container"]');

      // the table populates the value a bit later
      await page.waitForTimeout(3000);
      const legendText = await legend.textContent();
      const legendTextWoSpace = legendText?.replace(' ', '');
      const tcTextWoSpace = tcText?.replace(' ', '');
      expect(legendTextWoSpace).toContain(tcTextWoSpace);
    });

    test('drag a trend Cursor', async ({ browser, page }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );
      const widget = dashboardWithLineWidget.gridArea.locator(
        '[data-gesture=widget]'
      );

      await widget.click({ button: 'right' });

      await widget.getByText('Add Trend Cursor').click();

      const tcText = (await getTrendCursorText(dashboardWithLineWidget)) ?? '';
      const legend = widget.locator(
        'div[class="base-chart-legend-table-container"]'
      );

      // drag and check if the timestamp changes
      const textEle = widget.getByText(tcText);
      await textEle.hover();
      const textEleBoundingBox = await textEle.boundingBox();

      await page.mouse.down();
      // this is just dragging a bit, bounding box can be used to be more precise if needed
      await page.mouse.move(
        (textEleBoundingBox?.x ?? 0) - 50,
        textEleBoundingBox?.y ?? 0,
        {
          steps: 10,
        }
      );

      await page.waitForTimeout(2000);
      const tcText2 = (await getTrendCursorText(dashboardWithLineWidget)) ?? '';
      expect(tcText2 !== tcText).toBeTruthy();

      // the line break in the legend header makes the equality break, so just removing all spaces
      const legendText = (await legend.textContent()) ?? '';
      const legendTextWoSpace = legendText.replace(' ', '');
      const tcTextWoSpace = tcText2.replace(' ', '');
      expect(legendTextWoSpace).toContain(tcTextWoSpace);
    });

    test('delete a trend Cursor', async ({ browser, page }) => {
      const resourceExplorer = new ResourceExplorer({ page });
      const dashboardWithLineWidget = await createNewDashboardWithWidget(
        'line',
        page,
        browser,
        resourceExplorer
      );
      await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .click({ button: 'right' });
      await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .getByText('Add Trend Cursor')
        .click();

      const tcText = await getTrendCursorText(dashboardWithLineWidget);

      await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .hover();

      await page.waitForTimeout(1000);

      await page.mouse.down({ button: 'right' });
      await dashboardWithLineWidget.gridArea
        .locator('[data-gesture=widget]')
        .getByText('Delete Trend Cursor')
        .click();

      await page.waitForTimeout(1000);
      const tcText2 = await getTrendCursorText(dashboardWithLineWidget);
      expect(tcText2 !== tcText).toBeTruthy();
    });
  });
});

test.describe('Testing Line Widget property changes', () => {
  test('Deleting a property is reflected on the chart', async ({
    browser,
    page,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const configPanel = new ConfigPanel({ page });
    const dashboardWithLineWidget = await createNewDashboardWithWidget(
      'line',
      page,
      browser,
      resourceExplorer
    );
    const widget = dashboardWithLineWidget.gridArea.locator(
      '[data-gesture=widget]'
    );
    await resourceExplorer.addModeledProperties(['Min Temperature']);
    await configPanel.collapsedButton.click();
    await configPanel.container.getByText('Properties').click();

    await configPanel.container.getByLabel('delete property').first().click();

    await page.waitForTimeout(1000);

    const legendText = await widget.textContent();

    expect(legendText).not.toContain('Max Temperature');
    expect(legendText).toContain('Min Temperature');
    await expect(widget).toBeVisible();
  });

  test('changing color of a property, should only change that property color', async ({
    page,
    browser,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const configPanel = new ConfigPanel({ page });
    const dashboardWithLineWidget = await createNewDashboardWithWidget(
      'line',
      page,
      browser,
      resourceExplorer
    );
    await resourceExplorer.addModeledProperties(['Min Temperature']);
    const fillColor = '#bf3636';
    const fillColorRGB = 'rgb(191, 54, 54)';
    await configPanel.collapsedButton.click();
    await configPanel.container.getByText('Properties').click();

    await configPanel.container
      .getByLabel('color picker')
      .first()
      .fill(fillColor);
    const widget = dashboardWithLineWidget.gridArea.locator(
      '[data-gesture=widget]'
    );

    // reading the series line's style properties
    const maxTemperaturePath = widget.locator('g').nth(1).locator('path');
    const maxTemperatureStroke = await maxTemperaturePath.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('stroke')
    );
    const minTemperaturePath = widget.locator('g').nth(2).locator('path');
    const minTemperatureStroke = await minTemperaturePath.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('stroke')
    );
    // should be changed
    expect(maxTemperatureStroke === fillColorRGB).toBeTruthy();
    // should not be changed
    expect(minTemperatureStroke === fillColorRGB).not.toBeTruthy();
  });

  test('changing style on a property , should only reflect on that property', async ({
    page,
    browser,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const configPanel = new ConfigPanel({ page });
    const dashboardWithLineWidget = await createNewDashboardWithWidget(
      'line',
      page,
      browser,
      resourceExplorer
    );
    await resourceExplorer.addModeledProperties(['Min Temperature']);
    const widget = dashboardWithLineWidget.gridArea.locator(
      '[data-gesture=widget]'
    );
    await configPanel.collapsedButton.click();
    await configPanel.container.getByText('Properties').click();
    await configPanel.container.getByText('Max Temperature').click();
    await configPanel.container
      .locator('div[class="property-display-summary"]')
      .getByText('Style', { exact: true })
      .first()
      .click();

    //change styles
    await configPanel.container
      .getByText('Use default style', { exact: true })
      .first()
      .click();

    // change line type
    await configPanel.container
      .getByLabel('Line type', { exact: true })
      .first()
      .click();
    await configPanel.container.getByText('None', { exact: true }).click();
    const chartDiv = widget.getByLabel('0 series is a Scatter plot');
    await expect(chartDiv).toBeVisible();

    // change it back to Line
    await configPanel.container.getByText('None', { exact: true }).click();
    await configPanel.container
      .getByText('Linear', { exact: true })
      .first()
      .click();

    // change line thickness
    await configPanel.container
      .getByText('Normal', { exact: true })
      .first()
      .click();
    await configPanel.container
      .getByText('Thick', { exact: true })
      .first()
      .click();

    await configPanel.container
      .getByText('Solid', { exact: true })
      .first()
      .click();
    await configPanel.container
      .getByText('Dotted', { exact: true })
      .first()
      .click();

    const pathMaxTemp = widget.locator('g').nth(2).locator('path');
    const maxTemp = await getComputedStyles(pathMaxTemp);
    const pathMinTemp = widget.locator('g').nth(1).locator('path');
    const minTemp = await getComputedStyles(pathMinTemp);

    expect(maxTemp.strokeWidth === '5px').toBeTruthy();
    expect(minTemp.strokeWidth === '2px').toBeTruthy();
    expect(maxTemp.strokeDashArray === '5px').toBeTruthy();
    expect(minTemp.strokeDashArray === 'none').toBeTruthy();
  });

  test('changing Y-axis values per property, should be reflected on the chart', async ({
    page,
    browser,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const configPanel = new ConfigPanel({ page });
    const dashboardWithLineWidget = await createNewDashboardWithWidget(
      'line',
      page,
      browser,
      resourceExplorer
    );
    await resourceExplorer.addModeledProperties(['Min Temperature']);
    const widget = dashboardWithLineWidget.gridArea.locator(
      '[data-gesture=widget]'
    );
    await configPanel.collapsedButton.click();
    await configPanel.container.getByText('Properties').click();
    await configPanel.container.getByText('Max Temperature').click();

    await configPanel.container
      .locator('div[class="property-display-summary"]')
      .getByText('Y-axis', { exact: true })
      .first()
      .click();

    // check for the multi y axis drop down
    await configPanel.container
      .getByText('Show Y-axis controls', { exact: true })
      .first()
      .click();
    const multiYAxis = widget.locator('div[class="multi-y-axis-legend"]');
    await expect(multiYAxis).toBeVisible();

    // change y-axis values
    await configPanel.container
      .getByPlaceholder('Auto', { exact: true })
      .first()
      .fill('1');
    await configPanel.container
      .getByPlaceholder('Auto', { exact: true })
      .nth(1)
      .fill('99');

    // check if the multi y-axis is shown in the chart section
    await multiYAxis.getByText('Y-Max').click();
    await multiYAxis.getByText('Y-Min').click();
    const min = multiYAxis.getByText('1');
    const max = multiYAxis.getByText('99');
    await expect(min).toBeVisible();
    await expect(max).toBeVisible();
  });

  test('Line widget can change label', async ({ page, browser }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const configPanel = new ConfigPanel({ page });
    const dashboardWithLineWidget = await createNewDashboardWithWidget(
      'line',
      page,
      browser,
      resourceExplorer
    );
    //add property and open config panel
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    await configPanel.collapsedButton.click();
    await configPanel.propertiesTab.click();

    // wait one second for config panel to load
    await page.waitForTimeout(1000);

    // open up dropdowns
    await configPanel.page
      .getByRole('button', { name: 'Max Temperature (Reactor 1)' })
      .click();
    await configPanel.page.getByRole('button', { name: 'Label' }).click();

    // uncheck default value
    await configPanel.page.getByText('Use default datastream name').click();
    await page.waitForTimeout(1000);

    // click and change input value
    await configPanel.labelInput.fill(NEW_PROPERTY_NAME);

    // check if widget is updated
    const widgetText = await dashboardWithLineWidget.gridArea
      .locator('[data-gesture=widget]')
      .textContent();
    expect(widgetText).toContain(NEW_PROPERTY_NAME);
  });
});

test.describe('Testing Thresholds', () => {
  test('adding Threshold, hiding and then removing threshold ', async ({
    page,
    browser,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const configPanel = new ConfigPanel({ page });
    const dashboardWithLineWidget = await createNewDashboardWithWidget(
      'line',
      page,
      browser,
      resourceExplorer
    );
    await resourceExplorer.collapseLeftIcon.click();
    const widget = dashboardWithLineWidget.gridArea.locator(
      '[data-gesture=widget]'
    );

    // open threshold tab
    await configPanel.collapsedButton.click();
    await configPanel.container
      .getByRole('tab', {
        name: 'Thresholds',
        exact: true,
      })
      .click();

    // add a threshold
    await configPanel.container
      .getByRole('button', {
        name: 'Add a threshold',
        exact: true,
      })
      .click();
    await page.waitForTimeout(1000);
    const thresholdDisplay = configPanel.container.locator(
      'div[class="threshold-display"]'
    );
    await thresholdDisplay
      .locator('div[class="threshold-configuration"]')
      .locator('button')
      .first()
      .click();
    await page.keyboard.down('ArrowDown');
    await page.keyboard.down('ArrowDown');
    await page.keyboard.down('Enter');

    await configPanel.container.getByPlaceholder('Threshold value').fill('50');
    await thresholdDisplay.getByLabel('color picker').fill('#f63804');

    // check if  the threshold elements are added
    const area = widget.locator('g').locator('path[fill="#f63804"]');
    const text = widget.locator('g').locator('text[fill="#f63804"]');

    await expect(area).toBeVisible();
    await expect(text).toBeVisible();

    // hide the thresholds
    await configPanel.container.getByText('Hide all thresholds').click();

    // check if opacity is set to true
    const opacity = await text.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('fill-opacity');
    });
    expect(opacity === '0').toBeTruthy();

    // delete the threshold
    await configPanel.container.getByLabel('delete threshold').click();

    // the threshold elements on the chart should not be visible
    await expect(area).not.toBeVisible();
  });
});
