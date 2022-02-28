## Resource explorer

You can use the ResourceExplorer component to create two-dimensional tree tables. The resource explorer helps understand the relationship between IoT resources (hierarchies). This component also provides filtering, sorting, and pagination with high performant and optimistic rendering. 

## Properties

### query

The query configuration object. Each IoT App Kit source provides a specific configuration to fetch IoT Resources.

Query Type: `TreeQuery<SiteWiseAssetTreeNode[], BranchReference>`

**Required: Yes**

```
export interface Query<Result, Params = void> {
  build(sessionId: string, params?: Params): Provider<Result>;
}

export interface TreeProvider<Result, Branch> extends Provider<Result> {
  expand(branch: Branch): void;
  collapse(branch: Branch): void;
}

export interface TreeQuery<Result, Branch, Params = void> extends Query<Result, Params> {
  build(sessionId: string, params?: Params): TreeProvider<Result, Branch>;
}
```

### columnDefinitions

The columns defined in the table. By default, the resource explorer table contains the following column names: `Name`, `Status`, `Creation Date`, and `Last Update Date`.

* `id` (string) - The ID of the column. The property is used as a [keys](https://reactjs.org/docs/lists-and-keys.html#keys) source for rendering.
* `header` (string) - The column header.
* `cell` ((item) => string) - Accepts a function that determines the text to display in each cell. You receive the current table row item as an argument.
* `width` (string | number) - The column width, similar to the `width` css-property. If not specified, the browser automatically adjusts the column width based on the content. The last visible column always fills the remaining space of the table.
* `minWidth` (string | number) - The minimum column width, similar to the `min-width` css-property. When you adjust the column size, its width can’t be less than `minWidth`. Defaults to `"120px"`.
* `maxWidth` (string | number) - The maximum column width, similar to the `max-width` css-property. When you adjust the column size, its width can’t be greater than `maxWidth`.
* `ariaLabel` (LabelData => string) - You can optionally specify an `aria-label` for the cell header. It receives the current sorting state of this column, the direction it's sorted in, and an indication of whether the sorting is disabled, as three Boolean values: `sorted`, `descending` and `disabled`. We recommend that you use this for sortable columns to provide more meaningful labels based on the current sorting direction.

Type: ReadonlyArray<ColumnDefinition>
Required: No

```
`ColumnDefinition<T> ``{`
`  id``?:`` ``string``;`
`  header``:`` ``string``;`
`  cell``:`` ``(``item``:`` T``)`` ``=>`` ``string`` ``|`` ``undefined``;`
`  ariaLabel``?(``data``:`` ``LabelData``):`` ``string``;`
`  width``?:`` number ``|`` ``string``;`
`  minWidth``?:`` number ``|`` ``string``;`
`  maxWidth``?:`` number ``|`` ``string``;`
`}`
```

### selectionType

The selection type.
Type: Enum string
Valid values:  `single | multi`
Default: `single`
Required: No

### loadingText

The loading message appears when the table enters the loading state.
Type: String
Required: No

### filterEnabled

Whether or not to enable the filter. If `false`, the filter box won’t appear.
Type: Boolean
Default: `true`
Valid values: `true | false`
Required: No

### sortingEnabled

Whether or not to enable the sorting. If `false`, the sorting buttons won’t appear. 
Type: Boolean
Default: `true`
Valid values: `true | false`
Required: No

### paginationEnabled

Whether or not to enable the pagination. If `false`, the table displays all rows on a single page at once. If `true` , the table displays 20 rows for each page. 
Type: Boolean
Default: `true`
Valid values: `true | false`
Required: No

### filterTexts

The text that appears for each filter state. Make sure you pass an object that's present in the following `FilterTexts` type.

Type:

```
FilterTexts {
  placeholder: string;
  empty: string;
  noMatch: string;
}
```

### empty

Specifies the header and description for an empty table. Make sure you pass an object that's present in the following `EmptyStateProps` type.

Type:

```
EmptyStateProps {
  header?: string;
  description?: string;
}
```

### wrapLines

Whether or not to wrap text within table cells. If `true`, long text within cells may wrap onto multiple lines instead of being truncated with an ellipsis (...).
Type: Boolean
Default: `false`
Valid values: `true | false`
Required: No


### onSelectionChange

Fired when a user interaction triggers a change in the list of selected items. The event `detail` contains the current list of `selectedItems`.

Detail type:

```
`SelectionChangeDetail {
  selectedItems: Array<T>
}`
```

Cancelable: No

