import React, { FC, useCallback } from 'react';
import { Button, ButtonProps } from '@awsui/components-react';

import { ReactComponent as ShowIcon } from '../../assets/icons/show.svg';

import './visibility-toggle.scss';

interface VisibilityToggleProps extends ButtonProps {
  visible?: boolean;
  onToggle?: (visible: boolean) => void;
}

const VisibilityToggle: FC<VisibilityToggleProps> = ({ visible = true, onToggle = () => {}, ...props }) => {
  const onToggleHandler = useCallback(() => {
    onToggle(!visible);
  }, [visible]);

  return (
    <Button
      {...props}
      onClick={onToggleHandler}
      variant={'inline-icon'}
      className={`tm-visibility-toggle ${visible ? 'visible' : ''}`.trim()}
      iconSvg={<ShowIcon />}
    />
  );
};

VisibilityToggle.displayName = 'ShowHideButton';

export default VisibilityToggle;
