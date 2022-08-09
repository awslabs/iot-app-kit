import React, { FC, useCallback } from 'react';

import { KnownComponentType } from '../../../../../interfaces';
import useLogger from '../../../../../logger/react-logger/hooks/useLogger';
import { ReactComponent as ShowIcon } from '../../../../../assets/icons/show.svg';

import './SceneNodeLabel.scss';

interface SceneNodeLabelProps {
  labelText: string;
  componentTypes?: string[];
  visible?: boolean;
  onVisibilityChange?: (newVisibility: boolean) => void;
}

const SceneNodeLabel: FC<SceneNodeLabelProps> = ({
  labelText,
  componentTypes,
  visible,
  onVisibilityChange = () => {},
}) => {
  const log = useLogger('SceneNodeLabel');

  const toggleVisibility = useCallback(() => {
    onVisibilityChange(!visible);
  }, [visible, onVisibilityChange]);

  const componentTypeIcons = componentTypes
    ?.filter((type) => !!type && Object.keys(KnownComponentType).includes(type))
    .map(
      /* istanbul ignore next */ (type) => {
        try {
          const {
            ReactComponent: Icon,
            // eslint-disable-next-line @typescript-eslint/no-var-requires
          } = require(`@svgr/webpack!../../../../../assets/icons/${type.toLowerCase()}.svg`); // We specify the loader here, because we don't want calling webpack config to override this behavior by accident.
          return <Icon key={type} data-testid={`scene-node-type-${type}`} className='tm-icon-component-type' />;
        } catch (e) {
          // if we're missing an icon, or there's just some issue, swallow it, because it's really not that important.
          log?.error(`Failed to load "${type}" icon appears to be missing`, e);
          return <React.Fragment />;
        }
      },
    ) || <React.Fragment />;

  return (
    <span className={'tm-scene-node-label'}>
      {componentTypeIcons} {labelText}{' '}
      <span className='actions'>
        <ShowIcon className={visible ? 'visible' : 'hidden'} onClick={toggleVisibility} />
      </span>
    </span>
  );
};

SceneNodeLabel.displayName = 'SceneNodeLabel';

export default SceneNodeLabel;
