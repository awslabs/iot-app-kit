import { default as textSvg } from './text.svg';
import { default as textSvgDark } from './text-dark.svg';
import WidgetIcon from '../components/widgetIcon';

const TextIcon = () => {
  return (
    <WidgetIcon widget='Text' defaultIcon={textSvg} darkIcon={textSvgDark} />
  );
};

export default TextIcon;
