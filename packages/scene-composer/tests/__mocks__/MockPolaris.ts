/**
 * Mock implementation of Polaris components with the string name for a clean snapshot test.
 *
 * All custom components should at least use a subset of the following Polaris components,
 * so add new ones to mock if necessary.
 */
export const mockPolaris = () => {
  jest.doMock('@awsui/components-react', () => ({
    Alert: 'Alert',
    AppLayout: 'AppLayout',
    AttributeEditor: 'AttributeEditor',
    Box: 'Box',
    BreadcrumbGroup: 'BreadcrumbGroup',
    Button: 'Button',
    ColumnLayout: 'ColumnLayout',
    Container: 'Container',
    CodeEditor: 'CodeEditor',
    CollectionPreferences: 'CollectionPreferences',
    Checkbox: 'Checkbox',
    DateRangePicker: 'DateRangePicker',
    ExpandableSection: 'ExpandableSection',
    Flashbar: 'Flashbar',
    Form: 'Form',
    FormField: 'FormField',
    Grid: 'Grid',

    Header: 'Header',
    HelpPanel: 'HelpPanel',
    Icon: 'Icon',
    Input: 'Input',
    Link: 'Link',
    Modal: 'Modal',
    Pagination: 'Pagination',
    Popover: 'Popover',
    RadioGroup: 'RadioGroup',
    Select: 'Select',
    SideNavigation: 'SideNavigation',
    SpaceBetween: 'SpaceBetween',
    Spinner: 'Spinner',
    StatusIndicator: 'StatusIndicator',
    Table: 'Table',
    Tabs: 'Tabs',
    TagEditor: 'TagEditor',
    Textarea: 'Textarea',
    TextContent: 'TextContent',
    TextFilter: 'TextFilter',
    Tiles: 'Tiles',
    Wizard: 'Wizard',
  }));
  jest.doMock('@iot-app-kit/related-table', () => ({
    LeftPad: 'LeftPad',
    Wrapper: 'Wrapper',
    EmptySpace: 'EmptySpace',
  }));
};

// needs the item, title, and subtitle fieldsset to your mock data
export const mockCollectionResponse = {
  items: [{}],
  actions: {
    setFiltering: jest.fn(),
    setSorting: jest.fn(),
    setCurrentPage: jest.fn(),
    setSelectedItems: jest.fn(),
  },
  filteredItemsCount: 1,
  collectionProps: {
    empty: {
      type: null,
      key: null,
      ref: null,
      props: {
        title: '',
        subtitle: '',
        action: [Object],
      },
      _store: {},
    },
    onSortingChange: jest.fn(),
    sortingColumn: undefined,
    sortingDescending: undefined,
    onSelectionChange: jest.fn(),
    selectedItems: [],
    trackBy: undefined,
    ref: { current: null },
  },
  filterProps: { filteringText: '', onChange: jest.fn() },
  paginationProps: { currentPageIndex: 1, pagesCount: 1, onChange: jest.fn() },
};
