import { replaceFillAttribute } from './SvgParserHelper';

describe('replaceFillAttribute', () => {
  let element: Element;
  it('should replace the stroke attribute with the selected color for ellipse elements', () => {
    element = document.createElement('ellipse');
    const selectedColor = 'blue';
    const setAttributeMock = vi.spyOn(element, 'setAttribute');
    replaceFillAttribute(element, selectedColor);
    expect(setAttributeMock).toHaveBeenCalledWith('stroke', selectedColor);
  });
  it('should replace the fill attribute with the selected color for circle elements', () => {
    element = document.createElement('circle');
    const selectedColor = 'red';
    const setAttributeMock = vi.spyOn(element, 'setAttribute');
    replaceFillAttribute(element, selectedColor);
    expect(setAttributeMock).toHaveBeenCalledWith('fill', selectedColor);
  });
});
