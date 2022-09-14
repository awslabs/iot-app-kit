import React, { useCallback, useState } from 'react';
import { Input, Grid } from '@awsui/components-react';

interface ISceneRuleTargetOpacityEditorProps {
  targetValue: string;
  onChange: (newValue: string) => void;
}

const SceneRuleTargetOpacityEditor: React.FC<ISceneRuleTargetOpacityEditorProps> = ({
  targetValue,
  onChange,
}: ISceneRuleTargetOpacityEditorProps) => {
  const [val, setVal] = useState(targetValue);

  const onInputChange = useCallback(({ detail, target }) => {
    let { value } = detail || target;
    value = value >= 1 ? 1 : value; // disable user from going out of range
    value = value <= 0 ? 0 : value;
    setVal(value);
  }, []);

  const onBlur = useCallback(() => {
    onChange(val);
  }, [val, onChange]);

  return (
    <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
      <Input
        data-testid={'tm-opacity-field'}
        type='number'
        step={0.01}
        value={val}
        onChange={onInputChange}
        onBlur={onBlur}
      />
    </Grid>
  );
};

SceneRuleTargetOpacityEditor.displayName = 'SceneRuleTargetOpacityEditor';

export default SceneRuleTargetOpacityEditor;
