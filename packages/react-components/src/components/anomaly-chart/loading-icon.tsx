import {
  colorTextBodyDefault,
  fontFamilyBase,
} from '@cloudscape-design/design-tokens';
import './anomalyChartStyles.css';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Popover from '@cloudscape-design/components/popover';

export const LoadingIcon = ({ loading }: { loading?: boolean }) => {
  if (!loading) return null;

  return (
    <div
      className='anomaly-chart-loading-icon'
      style={{
        fontFamily: `${fontFamilyBase}`,
        color: colorTextBodyDefault,
      }}
    >
      <Box color='text-label'>
        <Popover
          size='small'
          content='Data may be inaccurate until loading completes.'
          dismissButton={false}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Spinner />
            <span style={{ marginLeft: '5px' }}>Loading</span>
          </div>
        </Popover>
      </Box>
    </div>
  );
};
