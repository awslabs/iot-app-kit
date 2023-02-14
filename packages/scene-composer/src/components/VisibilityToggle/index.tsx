import React, { FC, useCallback } from 'react';
import { Button, ButtonProps } from '@awsui/components-react';

import { Show } from '../../assets/auto-gen/icons';

import './visibility-toggle.scss';

interface VisibilityToggleProps extends ButtonProps {
  visible?: boolean;
  onToggle?: (visible: boolean) => void;
}

const VisibilityToggle: FC<VisibilityToggleProps> = ({ visible = true, onToggle = () => {}, ...props }) => {
  const onToggleHandler = useCallback(
    (e) => {
      onToggle(!visible);
      e.stopPropagation();
    },
    [visible],
  );

  return (
    <Button
      {...props}
      onClick={onToggleHandler}
      variant='inline-icon'
      className={`tm-visibility-toggle ${visible ? 'visible' : ''} tm-icon-button`.trim()}
      iconSvg={
        <span>
          <Show />
        </span>
      }
    />
  );
};

VisibilityToggle.displayName = 'ShowHideButton';

export default VisibilityToggle;
