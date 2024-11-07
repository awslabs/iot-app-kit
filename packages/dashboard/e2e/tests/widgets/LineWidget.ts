import { type DashboardPage } from '../dashboard/DashboardPage';

// refer to the line.spec.ts for details regarding structure of TC text
export const getAllLineChartText = async (dashboard: DashboardPage) => {
  return await dashboard.gridArea
    .locator('[data-gesture=widget]')
    .locator('text[dominant-baseline="central"]')
    .all();
};

// refer to the line.spec.ts for details regarding structure of TC text
export const getTrendCursorText = async (dashboard: DashboardPage) => {
  const allText = await getAllLineChartText(dashboard);
  const tcText = await allText[allText.length - 1].textContent();
  return tcText;
};
