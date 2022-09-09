import React, { useCallback } from 'react';
import { Input, Grid } from '@awsui/components-react';

interface ISceneRuleTargetOpacityEditorProps {
  targetValue: string;
  onChange: (newValue: string) => void;
}

const SceneRuleTargetOpacityEditor: React.FC<ISceneRuleTargetOpacityEditorProps> = ({
  targetValue,
  onChange,
}: ISceneRuleTargetOpacityEditorProps) => {
  const onInputChange = useCallback(
    ({ target }) => {
      onChange(target.value);
    },
    [onChange],
  );

  return (
    <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
      <Input data-testid={'tm-opacity-field'} value={targetValue} onChange={onInputChange} />
    </Grid>
  );
};

SceneRuleTargetOpacityEditor.displayName = 'SceneRuleTargetOpacityEditor';

export default SceneRuleTargetOpacityEditor;
