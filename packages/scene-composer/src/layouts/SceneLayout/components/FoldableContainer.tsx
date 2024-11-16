import { Icon, type IconProps } from '@cloudscape-design/components';
import { useEffect, useState } from 'react';

import './FoldableContainer.scss';
import { type Direction } from './utils';

type FoldableContainerProps = React.PropsWithChildren<{
  direction: Direction;
  open: boolean;
  setIsOpen: (boolean) => void;
}>;

const FoldableContainer: React.FC<FoldableContainerProps> = ({
  direction,
  children,
  open,
  setIsOpen,
}: FoldableContainerProps) => {
  const [fold, setFold] = useState(!open);
  const isLeft = direction === 'Left';
  const isRight = !isLeft;

  const iconName: IconProps.Name = (fold && isLeft) || (!fold && isRight) ? 'angle-right' : 'angle-left';

  const wrapper = `tm-wrapper-${isLeft ? 'left' : 'right'}`;

  useEffect(() => {
    setIsOpen(!fold);
  }, [fold]);

  return (
    <div className={wrapper}>
      {!fold && <div className='tm-content'>{children}</div>}
      <div className='tm-handle' data-testid='handle' onClick={() => setFold(!fold)}>
        <Icon name={iconName} size='small' variant='normal' />
      </div>
    </div>
  );
};

export default FoldableContainer;
