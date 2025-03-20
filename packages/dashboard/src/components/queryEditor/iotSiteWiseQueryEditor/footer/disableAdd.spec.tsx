import { disableAdd } from '~/components/queryEditor/iotSiteWiseQueryEditor/footer/disableAdd';
import type { SiteWiseQueryConfig } from '~/features/queries/queries';
import type {
  RegisteredWidgetPlugins,
  RegisteredWidgetType,
} from '~/features/widget-plugins/registry';
import type { WidgetInstance } from '~/features/widget-instance/instance';
import { nanoid } from 'nanoid';

function mockWidget<WidgetType extends RegisteredWidgetType>(
  type: WidgetType,
  properties: RegisteredWidgetPlugins[WidgetType]['properties']
): WidgetInstance<WidgetType> {
  return {
    type,
    id: nanoid(),
    x: 0,
    y: 0,
    z: 0,
    properties: properties,
    height: 500,
    width: 800,
  } as WidgetInstance<WidgetType>;
}

const commonTests = ({
  objectWithoutProperties,
  objectWithProperties,
}: {
  objectWithoutProperties: { queryConfig: SiteWiseQueryConfig };
  objectWithProperties: { queryConfig: SiteWiseQueryConfig };
}) => {
  it('should return true if no results, with or without properties', () => {
    expect(
      disableAdd([mockWidget('kpi', objectWithoutProperties)], 0)
    ).toBeTruthy();
    expect(
      disableAdd([mockWidget('kpi', objectWithProperties)], 0)
    ).toBeTruthy();
  });

  it('should return true if kpi is selected and has a property already added', () => {
    expect(
      disableAdd([mockWidget('kpi', objectWithProperties)], 10)
    ).toBeTruthy();
  });

  it('should return false if kpi is selected and has NO property already added', () => {
    expect(
      disableAdd([mockWidget('kpi', objectWithoutProperties)], 1)
    ).toBeFalsy();
  });

  it('should return false if xy-plot is selected and has property already added', () => {
    expect(
      disableAdd([mockWidget('xy-plot', objectWithoutProperties)], 10)
    ).toBeFalsy();
  });

  it('should return true if KPI(with or without property) is selected and more than 1 property selected', () => {
    expect(disableAdd([mockWidget('kpi', {})], 10)).toBeTruthy();
    expect(
      disableAdd([mockWidget('kpi', objectWithProperties)], 10)
    ).toBeTruthy();
  });

  it('should return false if xy-plot(with or without properties) is selected and more than 1 property selected', () => {
    expect(
      disableAdd([mockWidget('xy-plot', objectWithoutProperties)], 10)
    ).toBeFalsy();

    expect(
      disableAdd([mockWidget('xy-plot', objectWithProperties)], 10)
    ).toBeFalsy();
  });
};
describe(disableAdd, () => {
  it('should return true if no selected widget-instance', () => {
    expect(disableAdd([], 0)).toBeTruthy();
  });

  describe('For modeled data', () => {
    const objectWithoutProperties = {
      queryConfig: { query: { assets: [] } },
    } as unknown as { queryConfig: SiteWiseQueryConfig };
    const objectWithProperties = {
      queryConfig: { query: { assets: [{ id: '1' }] } },
    } as unknown as { queryConfig: SiteWiseQueryConfig };

    commonTests({ objectWithoutProperties, objectWithProperties });
  });

  describe('For unmodeled data', () => {
    const objectWithoutProperties = {
      queryConfig: { query: { properties: [] } },
    } as unknown as { queryConfig: SiteWiseQueryConfig };
    const objectWithProperties = {
      queryConfig: { query: { properties: [{ id: '1' }] } },
    } as unknown as { queryConfig: SiteWiseQueryConfig };
    commonTests({ objectWithoutProperties, objectWithProperties });
  });
  describe('For asset model data', () => {
    const objectWithoutProperties = {
      queryConfig: { query: { assetModels: [] } },
    } as unknown as { queryConfig: SiteWiseQueryConfig };
    const objectWithProperties = {
      queryConfig: { query: { assetModels: [{ id: '1' }] } },
    } as unknown as { queryConfig: SiteWiseQueryConfig };
    commonTests({ objectWithoutProperties, objectWithProperties });
  });
});
