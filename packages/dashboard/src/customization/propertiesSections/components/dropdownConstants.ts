export const dropdownConsts = {
  lineThickness: {
    defaultValue: { label: 'Normal', value: '2' },
    lineThicknessOptions: [
      { label: 'Thin', value: '1' },
      { label: 'Normal', value: '2' },
      { label: 'Thick', value: '5' },
    ],
  },
  lineType: {
    defaultValue: { label: 'Linear', value: 'linear', description: 'Points are joined as straight lines.' },
    lineTypeOptions: [
      { label: 'None', value: 'none', description: 'Scatter plot with no line between the points.' },
      { label: 'Linear', value: 'linear', description: 'Points are joined as straight lines.' },
      { label: 'Step before', value: 'step-start', description: 'Step points rendered at the end of the step.' },
      { label: 'Step middle', value: 'step-middle', description: 'Step points rendered in the middle of the step.' },
      { label: 'Step after', value: 'step-end', description: 'Step points rendered at the beginning of the step.' },
    ],
  },
  lineStyle: {
    defaultValue: { label: 'Solid', value: 'solid' },
    lineTypeOptions: [
      { label: 'Solid', value: 'solid' },
      { label: 'Dashed', value: 'dashed' },
      { label: 'Dotted', value: 'dotted' },
    ],
  },
  dataPointStyle: {
    defaultValue: { label: 'Filled circle', value: 'filled-circle' },
    dataPointStyleOptions: [
      { label: 'Filled circle', value: 'filled-circle' },
      { label: 'Empty circle', value: 'circle' },
      { label: 'Rectangle', value: 'rectangle' },
      { label: 'Triangle', value: 'triangle' },
      { label: 'Diamond', value: 'diamond' },
      { label: 'Pin', value: 'pin' },
      { label: 'Arrow', value: 'arrow' },
    ],
  },
};
