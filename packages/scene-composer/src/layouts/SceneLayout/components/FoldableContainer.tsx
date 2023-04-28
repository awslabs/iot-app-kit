import React, { useEffect, useState, forwardRef } from 'react';
import { Icon, IconProps } from '@awsui/components-react';

import { Direction } from './utils';
import './FoldableContainer.scss';

type FoldableContainerProps = React.PropsWithChildren<{
  direction: Direction;
  open: boolean;
  setIsOpen: (boolean) => void;
  ref: React.ReactFragment | undefined;
}>;

//const FoldableContainer: React.FC<FoldableContainerProps> = ({
const FoldableContainer = forwardRef<HTMLDivElement, FoldableContainerProps>(
  ({ direction, children, open, setIsOpen }: FoldableContainerProps, ref) => {
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
        <div ref={ref} className='tm-handle' data-testid='handle' onClick={() => setFold(!fold)}>
          <Icon name={iconName} size='small' variant='normal' />
        </div>
      </div>
    );
  },
);

export default FoldableContainer;
