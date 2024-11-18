import { type FC, useCallback } from 'react';
import { Button, type ButtonProps } from '@cloudscape-design/components';
import { useIntl } from 'react-intl';

import { Show } from '../../assets/auto-gen/icons';

import './visibility-toggle.scss';

interface VisibilityToggleProps extends ButtonProps {
  visible?: boolean;
  onToggle?: (visible: boolean) => void;
}

const VisibilityToggle: FC<VisibilityToggleProps> = ({ visible = true, onToggle = () => {}, ...props }) => {
  const { formatMessage } = useIntl();

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
      ariaLabel={formatMessage({
        defaultMessage: 'Toggle visibility',
        description: 'Label for button that toggles visibility of nodes in the scene',
      })}
    />
  );
};

VisibilityToggle.displayName = 'ShowHideButton';

export default VisibilityToggle;
