import { disableAdd } from '~/components/queryEditor/iotSiteWiseQueryEditor/footer/disableAdd';
import { type SiteWiseQueryConfig } from '~/customization/widgets/types';

const commonTests = ({
  objectWithoutProperties,
  objectWithProperties,
}: {
  objectWithoutProperties: { queryConfig: SiteWiseQueryConfig };
  objectWithProperties: { queryConfig: SiteWiseQueryConfig };
}) => {
  it('should return true if no results, with or without properties', () => {
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'status',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithoutProperties,
            height: 500,
            width: 800,
          },
        ],
        0
      )
    ).toBeTruthy();
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'status',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithProperties,
            height: 500,
            width: 800,
          },
        ],
        0
      )
    ).toBeTruthy();
  });

  it('should return true if status/kpi is selected and has a property already added', () => {
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'status',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithProperties,
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeTruthy();
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'kpi',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithProperties,
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeTruthy();
  });

  it('should return false if status/kpi is selected and has NO property already added', () => {
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'status',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithoutProperties,
            height: 500,
            width: 800,
          },
        ],
        1
      )
    ).toBeFalsy();

    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'kpi',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithoutProperties,
            height: 500,
            width: 800,
          },
        ],
        1
      )
    ).toBeFalsy();
  });

  it('should return false if x-y-plot is selected and has property already added', () => {
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'x-y-plot',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithoutProperties,
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeFalsy();
  });

  it('should return true if KPI(with or without property) is selected and more than 1 property selected', () => {
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'kpi',
            x: 0,
            y: 0,
            z: 0,
            properties: {},
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeTruthy();
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'kpi',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithProperties,
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeTruthy();
  });

  it('should return false if x-y-plot(with or without properties) is selected and more than 1 property selected', () => {
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'x-y-plot',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithoutProperties,
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeFalsy();

    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'x-y-plot',
            x: 0,
            y: 0,
            z: 0,
            properties: objectWithProperties,
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeFalsy();
  });
};
describe(disableAdd, () => {
  it('should return true if no selected widgets', () => {
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
