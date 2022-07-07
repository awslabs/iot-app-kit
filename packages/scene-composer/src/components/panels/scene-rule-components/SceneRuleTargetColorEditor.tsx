import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import styled from 'styled-components';
import { Input, Grid } from '@awsui/components-react';

import { colors } from '../../../utils/styleUtils';

export const ColorSwatch = styled.div<{ backgroundColor: string; borderColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  width: 100%;
  height: 30px;
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) => props.borderColor};
  cursor: pointer;
`;

interface ISceneRuleTargetColorEditorProps {
  targetValue: string;
  onChange: (target: string) => void;
}

export const SceneRuleTargetColorEditor: React.FC<ISceneRuleTargetColorEditorProps> = ({
  targetValue,
  onChange,
}: ISceneRuleTargetColorEditorProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleColorPicker = () => setShowColorPicker(!showColorPicker);

  return (
    <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
      <Input disabled={true} value={targetValue} />
      <ColorSwatch
        data-testid={'color-swatch'}
        onClick={toggleColorPicker}
        backgroundColor={targetValue}
        borderColor={colors.containerBorderWhite}
      />
      {showColorPicker && (
        <ChromePicker
          disableAlpha
          color={targetValue}
          onChangeComplete={(newColor: any) => {
            onChange(newColor.hex);
          }}
        />
      )}
    </Grid>
  );
};
