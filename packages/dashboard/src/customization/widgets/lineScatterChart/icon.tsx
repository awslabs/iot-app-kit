import { default as lineSvg } from './line.svg';
import { default as lineSvgDark } from './line-dark.svg';
import WidgetIcon from '../components/widgetIcon';

const LineIcon = () => {
  return (
    <WidgetIcon widget='Line' defaultIcon={lineSvg} darkIcon={lineSvgDark} />
  );
};

export default LineIcon;
