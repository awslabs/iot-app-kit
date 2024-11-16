import { render, screen } from '@testing-library/react';
import { AlarmExplorer } from '../../explorers';
import { resourceExplorerQueryClient } from '../../requests';
import * as table from '../helpers/table';
import { queryClient } from '../../../../queries';

describe('alarm table', () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
    queryClient.clear();
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders a table without configuration', async () => {
      render(<AlarmExplorer />);

      expect(screen.getByRole('table')).toBeVisible();
      expect(screen.getByText(`No alarms.`));

      // Title
      expect(screen.getByText('Alarms'));
      expect(screen.getByText('(0)')).toBeVisible();

      // Search
      expect(table.querySearchField()).not.toBeInTheDocument();

      // Filter
      expect(screen.queryByLabelText('Filter')).not.toBeInTheDocument();

      // User settings
      expect(
        screen.queryByRole('button', { name: 'Preferences' })
      ).not.toBeInTheDocument();

      // Pagination
      expect(table.getPreviousPageButton()).toBeVisible();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).toBeVisible();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('renders without title disabled', () => {
      render(<AlarmExplorer tableSettings={{ isTitleEnabled: false }} />);

      expect(screen.queryByText('Alarms')).not.toBeInTheDocument();
      expect(screen.queryByText('(0)')).not.toBeInTheDocument();
    });

    it('renders with search enabled', () => {
      render(<AlarmExplorer tableSettings={{ isSearchEnabled: true }} />);

      expect(table.getSearchField()).toBeVisible();
    });

    it('renders with filter enabled', () => {
      render(<AlarmExplorer tableSettings={{ isFilterEnabled: true }} />);

      expect(screen.getByLabelText('Filter')).toBeVisible();
    });

    it('renders with user settings enabled', () => {
      render(<AlarmExplorer tableSettings={{ isUserSettingsEnabled: true }} />);

      expect(screen.getByRole('button', { name: 'Preferences' })).toBeVisible();
    });

    it('renders expected columns', () => {
      render(<AlarmExplorer />);

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.queryByText('ID')).not.toBeInTheDocument();
      expect(screen.queryByText('Latest value')).not.toBeInTheDocument();
      expect(screen.queryByText('Latest value time')).not.toBeInTheDocument();
    });
  });

  /**
   * TODO: Uncomment when loading is fixed
   */
  // describe('requests', () => {
  //   it('requests a alarms correctly', async () => {
  //     mockUseAlarms();

  //     render(
  //       <AlarmExplorer
  //         iotSiteWiseClient={iotSiteWiseClientMock}
  //         parameters={[{ assetId: MOCK_ASSET_ID }]}
  //       />
  //     );

  //     await table.waitForLoadingToFinish();

  //     expect(describeAssetMock).toHaveBeenCalledOnce();
  //     expect(screen.getByText('(2)')).toBeInTheDocument();
  //     expect(table.getPreviousPageButton()).toBeVisible();
  //     expect(table.getPreviousPageButton()).toBeDisabled();
  //     expect(table.getNextPageButton()).toBeVisible();
  //     expect(table.getNextPageButton()).toBeDisabled();
  //   });
  // });

  /**
   * TODO: Uncomment the following tests when loading is fixed
   * in the useAlarms hooks
   */

  // Latest values not implemented in the useAlarms hook yet.
  // describe.skip('latest values', () => {
  //   it('supports displaying the latest values of asset properties', async () => {
  //     mockUseAlarms();

  //     render(
  //       <AlarmExplorer
  //         iotSiteWiseClient={iotSiteWiseClientMock}
  //         parameters={[{ assetId: MOCK_ASSET_ID }]}
  //       />
  //     );

  //     await table.waitForLoadingToFinish();

  //     // expect(batchGetAssetPropertyValue).toHaveBeenCalledOnce();
  //     expect(screen.getByText(MOCK_COMPOSITE_MODEL_NAME)).toBeVisible();
  //     expect(screen.getByText(MOCK_COMPOSITE_MODEL_NAME_2)).toBeVisible();
  //     // expect(
  //     //   screen.getByText(
  //     //     assetProperty1SuccessEntry.assetPropertyValue.value.stringValue
  //     //   )
  //     // ).toBeVisible();
  //     // expect(
  //     //   screen.getByText(
  //     //     assetProperty2SuccessEntry.assetPropertyValue.value.integerValue
  //     //   )
  //     // ).toBeVisible();
  //     // expect(
  //     //   screen.getByText(
  //     //     assetProperty3SuccessEntry.assetPropertyValue.value.doubleValue
  //     //   )
  //     // ).toBeVisible();
  //     // expect(
  //     //   screen.getByText(
  //     //     formatDate(
  //     //       assetProperty1SuccessEntry.assetPropertyValue.timestamp
  //     //         .timeInSeconds * 1000
  //     //     )
  //     //   )
  //     // ).toBeVisible();
  //     // expect(
  //     //   screen.getByText(
  //     //     formatDate(
  //     //       assetProperty2SuccessEntry.assetPropertyValue.timestamp
  //     //         .timeInSeconds * 1000
  //     //     )
  //     //   )
  //     // ).toBeVisible();
  //     // expect(
  //     //   screen.getByText(
  //     //     formatDate(
  //     //       assetProperty3SuccessEntry.assetPropertyValue.timestamp
  //     //         .timeInSeconds * 1000
  //     //     )
  //     //   )
  //     // ).toBeVisible();
  //   });

  //   it('regularly requests latest values', async () => {
  //     jest.useFakeTimers();

  //     const batchGetAssetPropertyValue = jest.fn().mockResolvedValue({
  //       successEntries: [],
  //       skippedEntries: [],
  //       errorEntries: [],
  //     } satisfies Awaited<ReturnType<BatchGetAssetPropertyValue>>);
  //     render(
  //       <AlarmExplorer
  //         iotSiteWiseClient={iotSiteWiseClientMock}
  //         parameters={[{ assetId: MOCK_ASSET_ID }]}
  //       />
  //     );

  //     await table.waitForLoadingToFinish();

  //     expect(batchGetAssetPropertyValue).toHaveBeenCalledOnce();

  //     jest.advanceTimersByTime(DEFAULT_LATEST_VALUE_REQUEST_INTERVAL);
  //     expect(batchGetAssetPropertyValue).toHaveBeenCalledTimes(2);

  //     // Remove mocking
  //     jest.useRealTimers();
  //   });
  // });

  // describe('selection', () => {
  //   it('does not allow selecting asset properties if selectionMode is undefined', async () => {
  //     const mockDescribeAssetResponse = {
  //       assetModelId: MOCK_ASSET_MODEL_ID,
  //       assetId: MOCK_ASSET_ID,
  //       assetArn: 'assetArn',
  //       assetName: 'assetName',
  //       assetProperties: [],
  //       assetHierarchies: [],
  //       assetCreationDate: new Date(),
  //       assetLastUpdateDate: new Date(),
  //       assetStatus: {
  //         state: 'ACTIVE',
  //       },
  //       assetCompositeModels: [mockAlarmCompositeModel, mockAlarmCompositeModel2],
  //     }

  //     describeAssetMock.mockResolvedValue(
  //       mockDescribeAssetResponse
  //     );

  //     render(
  //       <SelectableAlarmTable />
  //     );

  //     await table.waitForLoadingToFinish();

  //     expect(screen.queryAllByRole('radio')).toHaveLength(0);
  //     expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  //   });

  //   describe('single-select', () => {
  //     it('allows selecting a single asset property', async () => {
  //       const mockDescribeAssetResponse = {
  //         assetModelId: MOCK_ASSET_MODEL_ID,
  //         assetId: MOCK_ASSET_ID,
  //         assetArn: 'assetArn',
  //         assetName: 'assetName',
  //         assetProperties: [],
  //         assetHierarchies: [],
  //         assetCreationDate: new Date(),
  //         assetLastUpdateDate: new Date(),
  //         assetStatus: {
  //           state: 'ACTIVE',
  //         },
  //         assetCompositeModels: [mockAlarmCompositeModel, mockAlarmCompositeModel2],
  //       }

  //       describeAssetMock.mockResolvedValue(
  //         mockDescribeAssetResponse
  //       );

  //       const user = userEvent.setup();
  //       render(
  //         <SelectableAlarmTable
  //           selectionMode='single'
  //         />
  //       );

  //       await table.waitForLoadingToFinish();

  //       expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  //       const radios = screen.queryAllByRole('radio');
  //       expect(radios).toHaveLength(2);
  //       const [assetPropertyRadio1, assetPropertyRadio2, assetPropertyRadio3] =
  //         radios;

  //       expect(assetPropertyRadio1).not.toBeChecked();
  //       expect(assetPropertyRadio2).not.toBeChecked();
  //       expect(assetPropertyRadio3).not.toBeChecked();

  //       await user.click(assetPropertyRadio1);

  //       expect(assetPropertyRadio1).toBeChecked();
  //       expect(assetPropertyRadio2).not.toBeChecked();
  //       expect(assetPropertyRadio3).not.toBeChecked();

  //       await user.click(assetPropertyRadio2);

  //       expect(assetPropertyRadio1).not.toBeChecked();
  //       expect(assetPropertyRadio2).toBeChecked();
  //       expect(assetPropertyRadio3).not.toBeChecked();

  //       await user.click(assetPropertyRadio3);

  //       expect(assetPropertyRadio1).not.toBeChecked();
  //       expect(assetPropertyRadio2).not.toBeChecked();
  //       expect(assetPropertyRadio3).toBeChecked();
  //     });
  //   });

  //   describe('multi-select', () => {
  //     it('allows selecting multiple asset properties', async () => {
  //       const mockDescribeAssetResponse = {
  //         assetModelId: MOCK_ASSET_MODEL_ID,
  //         assetId: MOCK_ASSET_ID,
  //         assetArn: 'assetArn',
  //         assetName: 'assetName',
  //         assetProperties: [],
  //         assetHierarchies: [],
  //         assetCreationDate: new Date(),
  //         assetLastUpdateDate: new Date(),
  //         assetStatus: {
  //           state: 'ACTIVE',
  //         },
  //         assetCompositeModels: [mockAlarmCompositeModel, mockAlarmCompositeModel2],
  //       }

  //       describeAssetMock.mockResolvedValue(
  //         mockDescribeAssetResponse
  //       );

  //       const user = userEvent.setup();
  //       render(
  //         <SelectableAlarmTable
  //           selectionMode='multi'
  //         />
  //       );

  //       await table.waitForLoadingToFinish();

  //       expect(screen.queryAllByRole('radio')).toHaveLength(0);
  //       const checkboxes = screen.queryAllByRole('checkbox');
  //       expect(checkboxes).toHaveLength(4);
  //       const [
  //         allAssetPropertiesCheckbox,
  //         assetPropertyCheckbox1,
  //         assetPropertyCheckbox2,
  //         assetPropertyCheckbox3,
  //       ] = checkboxes;

  //       expect(allAssetPropertiesCheckbox).not.toBeChecked();
  //       expect(allAssetPropertiesCheckbox).not.toBePartiallyChecked();
  //       expect(assetPropertyCheckbox1).not.toBeChecked();
  //       expect(assetPropertyCheckbox2).not.toBeChecked();
  //       expect(assetPropertyCheckbox3).not.toBeChecked();

  //       await user.click(assetPropertyCheckbox1);

  //       expect(allAssetPropertiesCheckbox).not.toBeChecked();
  //       expect(allAssetPropertiesCheckbox).toBePartiallyChecked();
  //       expect(assetPropertyCheckbox1).toBeChecked();
  //       expect(assetPropertyCheckbox2).not.toBeChecked();
  //       expect(assetPropertyCheckbox3).not.toBeChecked();

  //       await user.click(assetPropertyCheckbox2);

  //       expect(allAssetPropertiesCheckbox).not.toBeChecked();
  //       expect(allAssetPropertiesCheckbox).toBePartiallyChecked();
  //       expect(assetPropertyCheckbox1).toBeChecked();
  //       expect(assetPropertyCheckbox2).toBeChecked();
  //       expect(assetPropertyCheckbox3).not.toBeChecked();

  //       await user.click(assetPropertyCheckbox3);

  //       expect(allAssetPropertiesCheckbox).toBeChecked();
  //       expect(allAssetPropertiesCheckbox).not.toBePartiallyChecked();
  //       expect(assetPropertyCheckbox1).toBeChecked();
  //       expect(assetPropertyCheckbox2).toBeChecked();
  //       expect(assetPropertyCheckbox3).toBeChecked();

  //       await user.click(assetPropertyCheckbox1);

  //       expect(allAssetPropertiesCheckbox).not.toBeChecked();
  //       expect(allAssetPropertiesCheckbox).toBePartiallyChecked();
  //       expect(assetPropertyCheckbox1).not.toBeChecked();
  //       expect(assetPropertyCheckbox2).toBeChecked();
  //       expect(assetPropertyCheckbox3).toBeChecked();

  //       await user.click(assetPropertyCheckbox2);

  //       expect(allAssetPropertiesCheckbox).not.toBeChecked();
  //       expect(allAssetPropertiesCheckbox).toBePartiallyChecked();
  //       expect(assetPropertyCheckbox1).not.toBeChecked();
  //       expect(assetPropertyCheckbox2).not.toBeChecked();
  //       expect(assetPropertyCheckbox3).toBeChecked();

  //       await user.click(assetPropertyCheckbox3);

  //       expect(allAssetPropertiesCheckbox).not.toBeChecked();
  //       expect(allAssetPropertiesCheckbox).not.toBePartiallyChecked();
  //       expect(assetPropertyCheckbox1).not.toBeChecked();
  //       expect(assetPropertyCheckbox2).not.toBeChecked();
  //       expect(assetPropertyCheckbox3).not.toBeChecked();
  //     });
  //   });
  // });

  // describe('filtering', () => {
  //   it('supports filtering by property', async () => {
  //     mockUseAlarms();

  //     render(
  //       <AlarmExplorer
  //         tableSettings={{ isFilterEnabled: true }}
  //         iotSiteWiseClient={iotSiteWiseClientMock}
  //         parameters={[{ assetId: MOCK_ASSET_ID }]}
  //       />
  //     );

  //     await table.waitForLoadingToFinish();
  //     await table.openFilterControls();

  //     expect(screen.getByRole('option', { name: 'Name' })).toBeVisible();
  //     expect(screen.getByRole('option', { name: 'ID' })).toBeVisible();
  //   });

  //   it('supports filtering by text', async () => {
  //     mockUseAlarms();

  //     const user = userEvent.setup();
  //     render(
  //       <AlarmExplorer
  //         tableSettings={{ isFilterEnabled: true }}
  //         iotSiteWiseClient={iotSiteWiseClientMock}
  //         parameters={[{ assetId: MOCK_ASSET_ID }]}
  //       />
  //     );

  //     await table.waitForLoadingToFinish();

  //     expect(screen.getByText(MOCK_COMPOSITE_MODEL_NAME)).toBeVisible();
  //     expect(screen.getByText(MOCK_COMPOSITE_MODEL_NAME_2)).toBeVisible();

  //     await table.openFilterControls();
  //     await user.keyboard('2');
  //     await user.click(screen.getByText('Use: "2"'));

  //     expect(screen.getByText(MOCK_COMPOSITE_MODEL_NAME_2)).toBeVisible();
  //     expect(
  //       screen.queryByText(MOCK_COMPOSITE_MODEL_NAME)
  //     ).not.toBeInTheDocument();

  //     await user.click(screen.getByRole('button', { name: 'Clear filters' }));

  //     expect(screen.getByText(MOCK_COMPOSITE_MODEL_NAME)).toBeVisible();
  //     expect(screen.getByText(MOCK_COMPOSITE_MODEL_NAME_2)).toBeVisible();
  //   });
  // });

  // describe('user settings', () => {
  //   it('renders user settings as expected', async () => {
  //     const user = userEvent.setup();
  //     render(
  //       <AlarmExplorer
  //         tableSettings={{ isUserSettingsEnabled: true }}
  //       />
  //     );

  //     expect(screen.queryByText('Preferences')).not.toBeInTheDocument();

  //     await user.click(screen.getByRole('button', { name: 'Preferences' }));

  //     expect(screen.getByText('Preferences')).toBeVisible();
  //     expect(screen.getByText('Page size')).toBeVisible();
  //     expect(screen.getByText('Wrap lines')).toBeVisible();
  //     expect(screen.getByText('Striped rows')).toBeVisible();
  //     expect(screen.getByText('Compact mode')).toBeVisible();
  //     expect(screen.getByText('Sticky first columns')).toBeVisible();
  //     expect(screen.getByText('Sticky last columns')).toBeVisible();
  //     expect(screen.getByText('Column preferences')).toBeVisible();
  //   });

  //   it('renders expect column preferences', async () => {
  //     render(
  //       <AlarmExplorer
  //         tableSettings={{ isUserSettingsEnabled: true }}
  //       />
  //     );

  //     await table.openUserSettings();

  //     expect(table.getColumnDisplayCheckbox('Name')).toBeVisible();
  //     expect(table.getColumnDisplayCheckbox('Name')).toBeChecked();
  //     expect(table.getColumnDisplayCheckbox('Name')).toBeEnabled();
  //     expect(table.getColumnDisplayCheckbox('ID')).toBeVisible();
  //     expect(table.getColumnDisplayCheckbox('ID')).not.toBeChecked();
  //     expect(table.getColumnDisplayCheckbox('ID')).toBeEnabled();
  //     expect(
  //       table.queryColumnDisplayCheckbox('Latest value')
  //     ).toBeInTheDocument();
  //     expect(
  //       table.queryColumnDisplayCheckbox('Latest value time')
  //     ).toBeInTheDocument();
  //   });

  //   it('renders expect column preferences with latest values enabled', async () => {
  //     render(
  //       <AlarmExplorer
  //         tableSettings={{ isUserSettingsEnabled: true }}
  //       />
  //     );

  //     await table.openUserSettings();

  //     expect(table.getColumnDisplayCheckbox('Latest value')).toBeVisible();
  //     expect(table.getColumnDisplayCheckbox('Latest value')).toBeChecked();
  //     expect(table.getColumnDisplayCheckbox('Latest value')).toBeEnabled();
  //     expect(table.getColumnDisplayCheckbox('Latest value time')).toBeVisible();
  //     expect(table.getColumnDisplayCheckbox('Latest value time')).toBeChecked();
  //     expect(table.getColumnDisplayCheckbox('Latest value time')).toBeEnabled();
  //   });

  //   it('supports users changing settings', async () => {
  //     const user = userEvent.setup();
  //     render(
  //       <AlarmExplorer
  //         tableSettings={{ isUserSettingsEnabled: true }}
  //       />
  //     );

  //     expect(screen.getByText('Name')).toBeVisible();

  //     await table.openUserSettings();
  //     await user.click(table.getColumnDisplayCheckbox('Name'));
  //     await user.click(screen.getByRole('button', { name: 'Confirm' }));

  //     expect(screen.queryByText('Name')).not.toBeInTheDocument();
  //   });

  //   it('supports users cancelling changing settings', async () => {
  //     const user = userEvent.setup();
  //     render(
  //       <AlarmExplorer
  //         tableSettings={{ isUserSettingsEnabled: true }}
  //       />
  //     );

  //     expect(screen.getByText('Name')).toBeVisible();

  //     await table.openUserSettings();
  //     await user.click(table.getColumnDisplayCheckbox('Name'));
  //     await user.click(screen.getByRole('button', { name: 'Cancel' }));

  //     expect(screen.getByText('Name')).toBeVisible();

  //     await table.openUserSettings();
  //     await user.click(table.getColumnDisplayCheckbox('Name'));
  //     await user.click(screen.getByRole('button', { name: 'Close modal' }));

  //     expect(screen.getByText('Name')).toBeVisible();
  //   });
  // });
});
