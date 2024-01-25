import { Box, Button, SpaceBetween } from '@cloudscape-design/components';
import React from 'react';
import {
  CancelableEventHandler,
  ClickDetail,
} from '@cloudscape-design/components/internal/events';

export const PropertyPanelEmptyTable = ({
  selectedWidgetsLength,
  allItemsLength,
  onAddDataStreams,
}: {
  selectedWidgetsLength: number;
  allItemsLength: number;
  onAddDataStreams: CancelableEventHandler<ClickDetail>;
}) => {
  return selectedWidgetsLength === 1 && allItemsLength === 0 ? (
    <Box margin={{ vertical: 'xxxl' }} textAlign='center' color='inherit'>
      <SpaceBetween size='m'>
        <b>No data streams added to the widget</b>
        <Button onClick={onAddDataStreams}>Add data stream</Button>
      </SpaceBetween>
    </Box>
  ) : (
    <Box margin={{ vertical: 'xxxl' }} textAlign='center' color='inherit'>
      <SpaceBetween size='xxl'>
        {selectedWidgetsLength == 0 ? (
          <b> Please select a widget above</b>
        ) : (
          <b> Please select only ONE widget above</b>
        )}
      </SpaceBetween>
    </Box>
  );
};
