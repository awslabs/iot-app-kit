import { default as statusSvg } from './status.svg';
import { default as statusSvgDark } from './status-dark.svg';
import WidgetIcon from '../components/widgetIcon';

const StatusIcon = () => {
  return (
    <WidgetIcon
      widget='Status'
      defaultIcon={statusSvg}
      darkIcon={statusSvgDark}
    />
  );
};

export default StatusIcon;
