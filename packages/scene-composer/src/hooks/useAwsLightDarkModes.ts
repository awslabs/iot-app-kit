import { MutableRefObject, useEffect } from 'react';
import { applyMode, Mode } from '@cloudscape-design/global-styles';

const useAwsLightDarkModes = (ref: MutableRefObject<HTMLDivElement | null>, mode: Mode): void => {
  useEffect(() => {
    if (ref.current) {
      applyMode(mode, ref.current);
    }
  }, [ref.current, mode]);
};

export default useAwsLightDarkModes;
