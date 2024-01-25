import { Button, Header, SpaceBetween } from '@cloudscape-design/components';
import CustomOrangeButton from '~/components/customOrangeButton';
import React from 'react';
import {
  CancelableEventHandler,
  ClickDetail,
} from '@cloudscape-design/components/internal/events';

export const PropertyPanelTableHeader = ({
  selectedItems,
  allItemsCount,
  onAddDataStreams,
  selectedWidgetsCount,
  clearItems,
}: {
  selectedItems?: readonly unknown[];
  allItemsCount: number;
  onAddDataStreams: CancelableEventHandler<ClickDetail>;
  selectedWidgetsCount: number;
  clearItems: () => void;
}) => {
  const selectedItemsCount = selectedItems?.length;
  return (
    <Header
      counter={
        selectedItemsCount
          ? '(' + selectedItemsCount + `/${allItemsCount})`
          : `(${allItemsCount})`
      }
      actions={
        <SpaceBetween direction='horizontal' size='xs'>
          <Button
            ariaLabel='reset-selected-items'
            disabled={selectedItemsCount === 0}
            onClick={clearItems}
          >
            Reset
          </Button>
          {/*TODO: add these back when we have the edit modal*/}
          {/*<Button*/}
          {/*  ariaLabel='remove-selected-items'*/}
          {/*  disabled={selectedItemsCount === 0}*/}
          {/*>*/}
          {/*  Remove*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  ariaLabel='edit-selected-items'*/}
          {/*  disabled={selectedItemsCount === 0}*/}
          {/*>*/}
          {/*  Edit*/}
          {/*</Button>*/}
          <CustomOrangeButton
            ariaLabel='add-datastreams'
            title='+ Add data streams'
            onClick={onAddDataStreams}
            disabled={selectedWidgetsCount !== 1}
          />
        </SpaceBetween>
      }
    >
      Selected data streams
    </Header>
  );
};
