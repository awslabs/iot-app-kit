import { useMeasure } from 'react-use';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import {
  colorBackgroundContainerContent,
  colorBorderDividerDefault,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import './index.css';

export interface ResourceExplorerFooterProps {
  addDisabled?: boolean;
  resetDisabled?: boolean;
  onReset?: VoidFunction;
  onAdd?: VoidFunction;
}

export const ResourceExplorerFooter = ({
  addDisabled,
  resetDisabled,
  onAdd,
  onReset,
}: ResourceExplorerFooterProps) => {
  const [componentRef, { width }] = useMeasure<HTMLDivElement>();
  const stickyFooter = {
    backgroundColor: colorBackgroundContainerContent,
    bottom: spaceStaticXxxs,
    width: width,
    borderTop: `${spaceStaticXxxs} solid ${colorBorderDividerDefault}`,
  };

  return (
    <div ref={componentRef}>
      <div className='queryeditor-button-sticky' style={stickyFooter}>
        <Box float='right' padding='xs'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button disabled={resetDisabled} onClick={onReset}>
              Reset
            </Button>
            <Button variant='primary' disabled={addDisabled} onClick={onAdd}>
              Add
            </Button>
          </SpaceBetween>
        </Box>
      </div>
    </div>
  );
};
