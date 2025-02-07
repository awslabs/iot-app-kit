import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import Button, { type ButtonProps } from '@cloudscape-design/components/button';
import './index.css';

export const CustomOrangeButton = ({
  title,
  handleClick,
  ...rest
}: { title: string; handleClick?: () => void } & ButtonProps) => {
  return (
    <Button
      className='btn-custom-primary'
      onClick={handleClick}
      data-testid='custom-orange-button'
      {...rest}
    >
      <span style={{ color: colorBackgroundHomeHeader }}>{title}</span>
    </Button>
  );
};
