import {
  AssetModelPropertySummary,
  AssetPropertySummary,
  AssetSummary,
  IoTSiteWise,
  ListAssetModelPropertiesResponse,
  ListAssetPropertiesResponse,
  ListAssetsResponse,
} from '@aws-sdk/client-iotsitewise';
import { resourceExplorerQueryClient } from '@iot-app-kit/react-components';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { IoTSiteWiseQueryEditor } from './iotSiteWiseQueryEditor';

export async function waitForLoadingToFinish() {
  await waitFor(() => {
    expect(screen.getByText(/Loading/)).toBeVisible();
  });

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });
}

export function createListAssetsPage(
  pageSize: number,
  startIndex = 0,
  nextToken?: string
) {
  const assetSummaries = new Array(pageSize).fill(null).map((_, index) => {
    const uniqueId = index + startIndex;

    return {
      arn: 'arn',
      id: `asset-${uniqueId}`,
      name: `Asset ${uniqueId}`,
      assetModelId: `asset-model-${uniqueId}`,
      description: `Description ${uniqueId}`,
      hierarchies: [],
      creationDate: new Date(0),
      lastUpdateDate: new Date(1),
      status: {
        state: 'ACTIVE',
      },
    };
  }) satisfies AssetSummary[];

  return {
    assetSummaries,
    nextToken,
  } satisfies Awaited<PromiseLike<ListAssetsResponse>>;
}

export function createListAssetPropertiesPage(
  pageSize: number,
  startIndex = 0,
  nextToken?: string
) {
  const assetPropertySummaries = new Array(pageSize)
    .fill(null)
    .map((_, index) => {
      const uniqueId = index + startIndex;

      return {
        id: `asset-property-${uniqueId}`,
      };
    }) satisfies AssetPropertySummary[];

  return {
    assetPropertySummaries,
    nextToken,
  } satisfies Awaited<PromiseLike<ListAssetPropertiesResponse>>;
}

export function createListAssetModelPropertiesPage(
  pageSize: number,
  startIndex = 0,
  nextToken?: string
) {
  const assetModelPropertySummaries = new Array(pageSize)
    .fill(null)
    .map((_, index) => {
      const uniqueId = index + startIndex;

      return {
        id: `asset-property-${uniqueId}`,
        name: `Asset Property ${uniqueId}`,
        dataType: 'STRING',
        type: {
          measurement: {},
        },
      };
    }) satisfies AssetModelPropertySummary[];

  return {
    assetModelPropertySummaries,
    nextToken,
  } satisfies Awaited<PromiseLike<ListAssetModelPropertiesResponse>>;
}

const {
  assetSummaries: [asset1, asset2, asset3],
} = createListAssetsPage(3);
const asset1WithHierarchy = {
  ...asset1,
  hierarchies: [{ id: 'hierachy-id', name: 'Hierarchy' }],
};

const listAssetPropertiesResponse = createListAssetPropertiesPage(3);
const listAssetModelPropertiesResponse = createListAssetModelPropertiesPage(3);
const assetProperty1 = {
  ...listAssetPropertiesResponse.assetPropertySummaries[0],
  unit: 'm/s',
};
const assetModelProperty1 = {
  ...listAssetModelPropertiesResponse.assetModelPropertySummaries[0],
  dataType: 'STRING',
};
const assetProperty2 = {
  ...listAssetPropertiesResponse.assetPropertySummaries[1],
  unit: 'km/s',
};
const assetModelProperty2 = {
  ...listAssetModelPropertiesResponse.assetModelPropertySummaries[1],
  dataType: 'DOUBLE',
};
const assetProperty3 = {
  ...listAssetPropertiesResponse.assetPropertySummaries[2],
  unit: 'cm/s',
};
const assetModelProperty3 = {
  ...listAssetModelPropertiesResponse.assetModelPropertySummaries[2],
  dataType: 'INTEGER',
};

describe('Query editor tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    resourceExplorerQueryClient.clear();
  });

  test('Renders query', async () => {
    const listAssets = jest.fn().mockResolvedValue({
      assetSummaries: [asset1WithHierarchy, asset2, asset3],
    });
    const listAssetProperties = jest.fn().mockResolvedValue({
      assetPropertySummaries: [assetProperty1, assetProperty2, assetProperty3],
    });
    const listAssetModelProperties = jest.fn().mockResolvedValue({
      assetModelPropertySummaries: [
        assetModelProperty1,
        assetModelProperty2,
        assetModelProperty3,
      ],
    });
    render(
      <Provider store={configureDashboardStore()}>
        <IoTSiteWiseQueryEditor
          onUpdateQuery={() => {}}
          iotSiteWiseClient={
            {
              ...new IoTSiteWise({
                credentials: {
                  accessKeyId: '',
                  secretAccessKey: '',
                  sessionToken: '',
                },
                region: 'us-east-1',
              }),
              listAssets,
              listAssetProperties,
              listAssetModelProperties,
            } as unknown as IoTSiteWise
          }
          selectedWidgets={[]}
          addButtonDisabled={false}
          correctSelectionMode='single'
        />
      </Provider>
    );

    await waitForLoadingToFinish();

    const asset = screen.getByText('Asset 0');
    expect(asset).toBeInTheDocument();
  });

  test('Single select calls update query one time', async () => {
    const listAssets = jest.fn().mockResolvedValue({
      assetSummaries: [asset1WithHierarchy, asset2, asset3],
    });
    const listAssetProperties = jest.fn().mockResolvedValue({
      assetPropertySummaries: [assetProperty1, assetProperty2, assetProperty3],
    });
    const listAssetModelProperties = jest.fn().mockResolvedValue({
      assetModelPropertySummaries: [
        assetModelProperty1,
        assetModelProperty2,
        assetModelProperty3,
      ],
    });
    const user = userEvent.setup();
    const onUpdateQuery = jest.fn();
    render(
      <Provider store={configureDashboardStore()}>
        <IoTSiteWiseQueryEditor
          onUpdateQuery={onUpdateQuery}
          iotSiteWiseClient={
            {
              ...new IoTSiteWise({
                credentials: {
                  accessKeyId: '',
                  secretAccessKey: '',
                  sessionToken: '',
                },
                region: 'us-east-1',
              }),
              listAssets,
              listAssetProperties,
              listAssetModelProperties,
            } as unknown as IoTSiteWise
          }
          selectedWidgets={[]}
          addButtonDisabled={false}
          correctSelectionMode='single'
        />
      </Provider>
    );

    await waitForLoadingToFinish();

    const asset = screen.getByText('Asset 0');
    expect(asset).toBeInTheDocument();

    await user.click(screen.getByLabelText('Select asset Asset 0'));

    const tableTitle = screen.getByText('Asset properties');
    expect(tableTitle).toBeInTheDocument();

    await user.click(
      screen.getByLabelText('Select modeled data stream Asset Property 0')
    );
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onUpdateQuery).toBeCalledTimes(1);
  });

  test('Adding multiselected properties at once calls update query one time', async () => {
    const listAssets = jest.fn().mockResolvedValue({
      assetSummaries: [asset1WithHierarchy, asset2, asset3],
    });
    const listAssetProperties = jest.fn().mockResolvedValue({
      assetPropertySummaries: [assetProperty1, assetProperty2, assetProperty3],
    });
    const listAssetModelProperties = jest.fn().mockResolvedValue({
      assetModelPropertySummaries: [
        assetModelProperty1,
        assetModelProperty2,
        assetModelProperty3,
      ],
    });
    const user = userEvent.setup();
    const onUpdateQuery = jest.fn();
    render(
      <Provider store={configureDashboardStore()}>
        <IoTSiteWiseQueryEditor
          onUpdateQuery={onUpdateQuery}
          iotSiteWiseClient={
            {
              ...new IoTSiteWise({
                credentials: {
                  accessKeyId: '',
                  secretAccessKey: '',
                  sessionToken: '',
                },
                region: 'us-east-1',
              }),
              listAssets,
              listAssetProperties,
              listAssetModelProperties,
            } as unknown as IoTSiteWise
          }
          selectedWidgets={[]}
          addButtonDisabled={false}
          correctSelectionMode='single'
        />
      </Provider>
    );

    await waitForLoadingToFinish();

    const asset = screen.getByText('Asset 0');
    expect(asset).toBeInTheDocument();

    await user.click(screen.getByLabelText('Select asset Asset 0'));

    const tableTitle = screen.getByText('Asset properties');
    expect(tableTitle).toBeInTheDocument();

    await user.click(
      screen.getByLabelText('Select modeled data stream Asset Property 0')
    );
    await user.click(
      screen.getByLabelText('Select modeled data stream Asset Property 1')
    );

    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onUpdateQuery).toBeCalledTimes(1);
  });

  test('Adding multiselected properties mulitiple times calls update query multiple times', async () => {
    const listAssets = jest.fn().mockResolvedValue({
      assetSummaries: [asset1WithHierarchy, asset2, asset3],
    });
    const listAssetProperties = jest.fn().mockResolvedValue({
      assetPropertySummaries: [assetProperty1, assetProperty2, assetProperty3],
    });
    const listAssetModelProperties = jest.fn().mockResolvedValue({
      assetModelPropertySummaries: [
        assetModelProperty1,
        assetModelProperty2,
        assetModelProperty3,
      ],
    });
    const user = userEvent.setup();
    const onUpdateQuery = jest.fn();
    render(
      <Provider store={configureDashboardStore()}>
        <IoTSiteWiseQueryEditor
          onUpdateQuery={onUpdateQuery}
          iotSiteWiseClient={
            {
              ...new IoTSiteWise({
                credentials: {
                  accessKeyId: '',
                  secretAccessKey: '',
                  sessionToken: '',
                },
                region: 'us-east-1',
              }),
              listAssets,
              listAssetProperties,
              listAssetModelProperties,
            } as unknown as IoTSiteWise
          }
          selectedWidgets={[]}
          addButtonDisabled={false}
          correctSelectionMode='single'
        />
      </Provider>
    );

    await waitForLoadingToFinish();

    const asset = screen.getByText('Asset 0');
    expect(asset).toBeInTheDocument();

    await user.click(screen.getByLabelText('Select asset Asset 0'));

    const tableTitle = screen.getByText('Asset properties');
    expect(tableTitle).toBeInTheDocument();

    await user.click(
      screen.getByLabelText('Select modeled data stream Asset Property 0')
    );

    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onUpdateQuery).toBeCalledTimes(1);

    await user.click(
      screen.getByLabelText('Select modeled data stream Asset Property 1')
    );

    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onUpdateQuery).toBeCalledTimes(2);
  });

  // test('Adding multiselected properties mulitiple times calls update query multiple times', async () => {
  //   const listAssets = jest.fn().mockResolvedValue({
  //     assetSummaries: [asset1WithHierarchy, asset2, asset3],
  //   });
  //   const listAssetProperties = jest.fn().mockResolvedValue({
  //     assetPropertySummaries: [assetProperty1, assetProperty2, assetProperty3],
  //   });
  //   const listAssetModelProperties = jest.fn().mockResolvedValue({
  //     assetModelPropertySummaries: [
  //       assetModelProperty1,
  //       assetModelProperty2,
  //       assetModelProperty3,
  //     ],
  //   });
  //   const onUpdateQuery = jest.fn();
  //   render(
  //     <Provider store={configureDashboardStore()}>
  //       <IoTSiteWiseQueryEditor
  //         onUpdateQuery={onUpdateQuery}
  //         iotSiteWise={
  //           {
  //             listAssets,
  //             listAssetProperties,
  //             listAssetModelProperties,
  //           } as unknown as IoTSiteWise
  //         }
  //         selectedWidgets={[]}
  //         addButtonDisabled={false}
  //         correctSelectionMode='multi'
  //       />
  //     </Provider>
  //   );

  //   await waitForLoadingToFinish();

  //   const asset = screen.getByText('Asset 0');
  //   expect(asset).toBeInTheDocument();

  //   screen.getByLabelText('Select asset Asset 0').click();

  //   const tableTitle = screen.getByText('Asset properties');
  //   expect(tableTitle).toBeInTheDocument();

  //   await waitForLoadingToFinish();

  //   const addButton = screen.getByRole('button', { name: 'Add' });

  //   screen
  //     .getByLabelText('Select modeled data stream Asset Property 0')
  //     .click();
  //   addButton.click();
  //   expect(onUpdateQuery).toBeCalledTimes(1);

  //   screen
  //     .getByLabelText('Select modeled data stream Asset Property 1')
  //     .click();
  //   addButton.click();
  //   expect(onUpdateQuery).toBeCalledTimes(2);
  // });
});
