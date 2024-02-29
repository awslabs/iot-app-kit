export const parseValueAndUnit = (
  input: string
): { value: number; unit: string } => {
  const value = parseInt(input);
  const unit = input.replace(/[0-9]/g, '').trim();
  return { value: value || 0, unit: unit || 'px' };
};
