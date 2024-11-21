import mockComponent from '../__mocks__/mockComponent';

const ButtonDropdown = ({ items = [], onItemClick, ...props }: any) => {
  return (
    <ul data-mocked='ButtonDropdown' {...props}>
      {items.map(({ id, text, iconSvg, ...itemProps }) => {
        return (
          <li id={id} {...itemProps} onClick={() => onItemClick({ detail: { id } })}>
            {iconSvg}
            {text}
          </li>
        );
      })}
    </ul>
  );
};

vi.mock('@cloudscape-design/components', async (importActual) => {
  const cloudscape = await importActual<Record<string, unknown>>();
  const mockedCloudscape = Object.keys(cloudscape).reduce((acc, comp) => {
    if (!comp.startsWith('_')) {
      acc[comp] = mockComponent(comp);
    } else {
      acc[comp] = cloudscape[comp];
    }
    return acc;
  }, {});

  return {
    ...mockedCloudscape,
    ButtonDropdown,
  };
});
