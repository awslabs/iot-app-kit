import type {
  ListAssetModelProperties,
  ListAssetProperties,
} from '@iot-app-kit/core';
import { render, screen, waitFor } from '@testing-library/react';
import ue from '@testing-library/user-event';
import { useState } from 'react';
import { AssetPropertyExplorer } from '../../explorers';
import { resourceExplorerQueryClient } from '../../requests/resource-explorer-query-client';
import type { SelectionMode } from '../../types/common';
import type { AssetPropertyResource } from '../../types/resources';
import * as dropDown from '../helpers/drop-down';
import {
  createListAssetModelPropertiesPage,
  createListAssetPropertiesPage,
} from '../helpers/responses';

function SelectableAssetPropertyDropDown({
  selectionMode,
  listAssetProperties,
  listAssetModelProperties,
}: {
  selectionMode?: SelectionMode;
  listAssetProperties: ListAssetProperties;
  listAssetModelProperties: ListAssetModelProperties;
}) {
  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    AssetPropertyResource[]
  >([]);

  return (
    <AssetPropertyExplorer
      variant='drop-down'
      iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
      parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
      selectionMode={selectionMode}
      selectedAssetProperties={selectedAssetProperties}
      onSelectAssetProperty={setSelectedAssetProperties}
    />
  );
}

describe('asset property drop-down', () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describe('rendering', () => {
    it('renders a drop-down without configuration', async () => {
      render(<AssetPropertyExplorer variant='drop-down' />);

      expect(screen.getByText('Select asset property')).toBeVisible();

      await dropDown.open();

      expect(screen.getAllByText('No asset properties.')[0]).toBeVisible();
    });

    it('renders a multi-select drop-down without configuration', async () => {
      render(
        <AssetPropertyExplorer variant='drop-down' selectionMode='multi' />
      );

      expect(screen.getByText('Select asset properties')).toBeVisible();

      await dropDown.open();

      expect(screen.getAllByText('No asset properties.')[0]).toBeVisible();
    });

    it('renders drop-down options', async () => {
      const listAssetPropertiesResponse = createListAssetPropertiesPage(3);
      const listAssetModelPropertiesResponse =
        createListAssetModelPropertiesPage(3);
      const {
        assetModelPropertySummaries: [
          assetModelProperty1,
          assetModelProperty2,
          assetModelProperty3,
        ],
      } = listAssetModelPropertiesResponse;
      const listAssetProperties = vi
        .fn()
        .mockResolvedValue(listAssetPropertiesResponse);
      const listAssetModelProperties = vi
        .fn()
        .mockResolvedValue(listAssetModelPropertiesResponse);
      render(
        <AssetPropertyExplorer
          variant='drop-down'
          iotSiteWiseClient={{
            listAssetProperties,
            listAssetModelProperties,
          }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      expect(dropDown.queryOption(assetModelProperty1)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModelProperty2)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModelProperty3)).not.toBeInTheDocument();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      const assetPropertyOption1 = dropDown.getOption(assetModelProperty1);
      const assetPropertyOption2 = dropDown.getOption(assetModelProperty2);
      const assetPropertyOption3 = dropDown.getOption(assetModelProperty3);

      expect(assetPropertyOption1).toBeVisible();
      expect(assetPropertyOption1).toHaveTextContent(assetModelProperty1.name);
      expect(assetPropertyOption2).toBeVisible();
      expect(assetPropertyOption2).toHaveTextContent(assetModelProperty2.name);
      expect(assetPropertyOption3).toBeVisible();
      expect(assetPropertyOption3).toHaveTextContent(assetModelProperty3.name);
    });
  });

  describe('request handling', () => {
    it('requests a single page of asset properties correctly', async () => {
      const listAssetProperties = vi
        .fn()
        .mockResolvedValue(createListAssetPropertiesPage(3));
      const listAssetModelProperties = vi
        .fn()
        .mockResolvedValue(createListAssetModelPropertiesPage(3));
      render(
        <AssetPropertyExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      expect(listAssetProperties).toHaveBeenCalledOnce();
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
    });

    it('requests multiple pages of asset properties correctly', async () => {
      const listAssetProperties = vi
        .fn()
        .mockResolvedValueOnce(
          createListAssetPropertiesPage(1, 0, 'next-token-1')
        )
        .mockResolvedValueOnce(
          createListAssetPropertiesPage(1, 1, 'next-token-2')
        )
        .mockResolvedValueOnce(createListAssetPropertiesPage(1, 2));
      const listAssetModelProperties = vi
        .fn()
        .mockResolvedValue(createListAssetModelPropertiesPage(3));
      render(
        <AssetPropertyExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      expect(listAssetProperties).toHaveBeenCalledTimes(3);
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
    });

    it('requests multiple lists of pages of asset properties correctly', async () => {
      const listAssetProperties = vi
        .fn()
        .mockResolvedValueOnce(
          createListAssetPropertiesPage(1, 0, 'next-token-1')
        )
        .mockResolvedValueOnce(createListAssetPropertiesPage(1, 1))
        .mockResolvedValueOnce(
          createListAssetPropertiesPage(1, 2, 'next-token-2')
        )
        .mockResolvedValueOnce(createListAssetPropertiesPage(1, 3));
      const listAssetModelProperties = vi
        .fn()
        .mockResolvedValue(createListAssetModelPropertiesPage(4, 0));

      render(
        <AssetPropertyExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[
            { assetId: 'asset-id-1', assetModelId: 'asset-model-id-1' },
            { assetId: 'asset-id-2', assetModelId: 'asset-model-id-1' },
          ]}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      await waitFor(() => expect(listAssetProperties).toHaveBeenCalledTimes(4));
      await waitFor(() =>
        expect(listAssetModelProperties).toHaveBeenCalledOnce()
      );
    });
  });

  describe('selection', () => {
    it('does not allow selecting asset properties if selectionMode is undefined', async () => {
      const listAssetPropertiesResponse = createListAssetPropertiesPage(3);
      const listAssetModelPropertiesResponse =
        createListAssetModelPropertiesPage(3);
      const {
        assetModelPropertySummaries: [
          assetModelProperty1,
          assetModelProperty2,
          assetModelProperty3,
        ],
      } = listAssetModelPropertiesResponse;
      const listAssetProperties = vi
        .fn()
        .mockResolvedValue(listAssetPropertiesResponse);
      const listAssetModelProperties = vi
        .fn()
        .mockResolvedValue(listAssetModelPropertiesResponse);
      const user = ue.setup();
      render(
        <SelectableAssetPropertyDropDown
          listAssetProperties={listAssetProperties}
          listAssetModelProperties={listAssetModelProperties}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();
      await user.click(dropDown.getOption(assetModelProperty1));

      expect(
        screen.queryByText(assetModelProperty1.name)
      ).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModelProperty1)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModelProperty2)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModelProperty3)).not.toBeInTheDocument();
    });

    describe('single-select', () => {
      it('allows selecting a single asset property', async () => {
        const listAssetPropertiesResponse = createListAssetPropertiesPage(3);
        const listAssetModelPropertiesResponse =
          createListAssetModelPropertiesPage(3);
        const {
          assetModelPropertySummaries: [
            assetModelProperty1,
            assetModelProperty2,
            assetModelProperty3,
          ],
        } = listAssetModelPropertiesResponse;
        const listAssetProperties = vi
          .fn()
          .mockResolvedValue(listAssetPropertiesResponse);
        const listAssetModelProperties = vi
          .fn()
          .mockResolvedValue(listAssetModelPropertiesResponse);
        const user = ue.setup();
        render(
          <SelectableAssetPropertyDropDown
            selectionMode='single'
            listAssetProperties={listAssetProperties}
            listAssetModelProperties={listAssetModelProperties}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(assetModelProperty1));

        expect(screen.getByText(assetModelProperty1.name)).toBeVisible();
        expect(
          dropDown.queryOption(assetModelProperty1)
        ).not.toBeInTheDocument();
        expect(
          dropDown.queryOption(assetModelProperty2)
        ).not.toBeInTheDocument();
        expect(
          dropDown.queryOption(assetModelProperty3)
        ).not.toBeInTheDocument();
      });

      it('replaces the selection when a new selection is made', async () => {
        const listAssetPropertiesResponse = createListAssetPropertiesPage(3);
        const listAssetModelPropertiesResponse =
          createListAssetModelPropertiesPage(3);
        const {
          assetModelPropertySummaries: [
            assetModelProperty1,
            assetModelProperty2,
          ],
        } = listAssetModelPropertiesResponse;
        const listAssetProperties = vi
          .fn()
          .mockResolvedValue(listAssetPropertiesResponse);
        const listAssetModelProperties = vi
          .fn()
          .mockResolvedValue(listAssetModelPropertiesResponse);
        const user = ue.setup();
        render(
          <SelectableAssetPropertyDropDown
            selectionMode='single'
            listAssetProperties={listAssetProperties}
            listAssetModelProperties={listAssetModelProperties}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(assetModelProperty1));

        expect(screen.getByText(assetModelProperty1.name)).toBeVisible();

        await user.click(screen.getByText(assetModelProperty1.name));
        await user.click(dropDown.getOption(assetModelProperty2));

        expect(screen.getByText(assetModelProperty2.name)).toBeVisible();
        expect(
          screen.queryByText(assetModelProperty1.name)
        ).not.toBeInTheDocument();
      });
    });

    describe('multi-select', () => {
      it('allows selecting multiple asset properties', async () => {
        const listAssetPropertiesResponse = createListAssetPropertiesPage(3);
        const listAssetModelPropertiesResponse =
          createListAssetModelPropertiesPage(3);
        const {
          assetModelPropertySummaries: [
            assetModelProperty1,
            assetModelProperty2,
            assetModelProperty3,
          ],
        } = listAssetModelPropertiesResponse;
        const listAssetProperties = vi
          .fn()
          .mockResolvedValue(listAssetPropertiesResponse);
        const listAssetModelProperties = vi
          .fn()
          .mockResolvedValue(listAssetModelPropertiesResponse);
        const user = ue.setup();
        render(
          <SelectableAssetPropertyDropDown
            selectionMode='multi'
            listAssetProperties={listAssetProperties}
            listAssetModelProperties={listAssetModelProperties}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(assetModelProperty1));
        await user.click(dropDown.getOption(assetModelProperty2));
        await dropDown.close();

        expect(screen.getByText(assetModelProperty1.name)).toBeVisible();
        expect(screen.getByText(assetModelProperty2.name)).toBeVisible();
        expect(
          dropDown.queryOption(assetModelProperty1)
        ).not.toBeInTheDocument();
        expect(
          dropDown.queryOption(assetModelProperty2)
        ).not.toBeInTheDocument();
        expect(
          dropDown.queryOption(assetModelProperty3)
        ).not.toBeInTheDocument();
      });

      it('allows for de-selecting asset properties', async () => {
        const listAssetPropertiesResponse = createListAssetPropertiesPage(2);
        const listAssetModelPropertiesResponse =
          createListAssetModelPropertiesPage(2);
        const {
          assetModelPropertySummaries: [
            assetModelProperty1,
            assetModelProperty2,
          ],
        } = listAssetModelPropertiesResponse;
        const listAssetProperties = vi
          .fn()
          .mockResolvedValue(listAssetPropertiesResponse);
        const listAssetModelProperties = vi
          .fn()
          .mockResolvedValue(listAssetModelPropertiesResponse);
        const user = ue.setup();
        render(
          <SelectableAssetPropertyDropDown
            selectionMode='multi'
            listAssetProperties={listAssetProperties}
            listAssetModelProperties={listAssetModelProperties}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(assetModelProperty1));
        await user.click(dropDown.getOption(assetModelProperty2));
        await dropDown.close();

        expect(screen.getByText(assetModelProperty1.name)).toBeVisible();
        expect(screen.getByText(assetModelProperty2.name)).toBeVisible();

        await user.click(
          screen.getByRole('button', {
            name: `Remove ${assetModelProperty2.name}`,
          })
        );

        expect(screen.getByText(assetModelProperty1.name)).toBeVisible();
        expect(
          screen.queryByText(assetModelProperty2.name)
        ).not.toBeInTheDocument();

        await user.click(
          screen.getByRole('button', {
            name: `Remove ${assetModelProperty1.name}`,
          })
        );

        expect(
          screen.queryByText(assetModelProperty1.name)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('filtering', () => {
    it('filters asset properties', async () => {
      const assetProperty1 = {
        id: 'asset-property-1',
      };
      const assetModelProperty1 = {
        ...assetProperty1,
        name: 'Similar Name 1',
      };
      const assetProperty2 = {
        id: 'asset-property-2',
      };
      const assetModelProperty2 = {
        ...assetProperty2,
        name: 'Similar Name 2',
      };
      const assetProperty3 = {
        id: 'asset-property-3',
      };
      const assetModelProperty3 = {
        ...assetProperty3,
        name: 'Different Name 3',
      };
      const listAssetProperties = vi.fn().mockResolvedValue({
        assetPropertySummaries: [
          assetProperty1,
          assetProperty2,
          assetProperty3,
        ],
      });
      const listAssetModelProperties = vi.fn().mockResolvedValue({
        assetModelPropertySummaries: [
          assetModelProperty1,
          assetModelProperty2,
          assetModelProperty3,
        ],
      });
      const user = ue.setup();
      render(
        <AssetPropertyExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
          dropDownSettings={{
            isFilterEnabled: true,
          }}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      expect(
        screen.getByPlaceholderText('Filter asset properties')
      ).toBeVisible();

      expect(dropDown.getOption(assetModelProperty1)).toBeVisible();
      expect(dropDown.getOption(assetModelProperty2)).toBeVisible();
      expect(dropDown.getOption(assetModelProperty3)).toBeVisible();

      await user.keyboard('Similar Name');

      expect(dropDown.getOption(assetModelProperty1)).toBeVisible();
      expect(dropDown.getOption(assetModelProperty2)).toBeVisible();
      expect(dropDown.queryOption(assetModelProperty3)).not.toBeInTheDocument();
      expect(
        screen.getAllByText('(2/3) asset properties matched')[0]
      ).toBeVisible();

      await dropDown.clearFilter();

      expect(dropDown.getOption(assetModelProperty1)).toBeVisible();
      expect(dropDown.getOption(assetModelProperty2)).toBeVisible();
      expect(dropDown.getOption(assetModelProperty3)).toBeVisible();

      await user.keyboard('Different Name');

      expect(dropDown.queryOption(assetModelProperty1)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModelProperty2)).not.toBeInTheDocument();
      expect(dropDown.getOption(assetModelProperty3)).toBeVisible();
      expect(
        screen.getAllByText('(1/3) asset properties matched')[0]
      ).toBeVisible();
    });
  });
});
