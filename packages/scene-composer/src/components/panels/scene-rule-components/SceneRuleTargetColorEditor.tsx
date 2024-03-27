import React, { FC, useCallback, useState } from 'react';
import { Input, Grid } from '@cloudscape-design/components';
import { ColorRepresentation } from 'three';

import { colors } from '../../../utils/styleUtils';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import { hexString } from '../ColorPicker/ColorPickerHelpers';

interface ColorSwatchProps {
  backgroundColor: string;
  borderColor: string;
  onClick: () => void;
}

const ColorSwatch: FC<ColorSwatchProps> = ({ backgroundColor, borderColor, ...props }) => {
  return (
    <div
      style={{
        backgroundColor,
        borderColor,
        width: '100%',
        height: '30px',
        borderStyle: 'solid',
        borderWidth: '1px',
        cursor: 'pointer',
      }}
      {...props}
    />
  );
};

interface ISceneRuleTargetColorEditorProps {
  targetValue: string;
  onChange: (target: string) => void;
}

export const SceneRuleTargetColorEditor: React.FC<ISceneRuleTargetColorEditorProps> = ({
  targetValue,
  onChange,
}: ISceneRuleTargetColorEditorProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleColorPicker = useCallback(() => setShowColorPicker(!showColorPicker), [showColorPicker]);

  return (
    <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
      <Input disabled={true} value={targetValue} />
      <ColorSwatch
        data-testid='color-swatch'
        onClick={toggleColorPicker}
        backgroundColor={targetValue}
        borderColor={colors.containerBorderWhite}
      />
      {showColorPicker && (
        <ColorPicker
          color={targetValue}
          onChange={(newColor: ColorRepresentation) => {
            onChange(hexString(newColor));
          }}
        />
      )}
    </Grid>
  );
};
