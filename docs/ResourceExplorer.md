## Resource explorer

The resource explorer allows you to navigate and select AWS IoT SiteWise assets in an expandable tree structure.


## Examples

###  React component example

```
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { ResourceExplorer } from '@iot-app-kit/react-components';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotSiteWiseClient });

// jsx
<ResourceExplorer
  query={query.assetTree.fromRoot()}
  onSelectionChange={({ detail: { selectedItems } }) => console.log('my selected items', selectedItems)}
/>
```

#### Web component example

```
import { initialize } from '@iot-app-kit/source-iotsitewise';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const { defineCustomElements } = require('@iot-app-kit/components/loader');

defineCustomElements();
const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotSiteWiseClient });


// jsx
<iot-resource-explorer
  query={query.assetTree.fromRoot()}
  onSelectionChange={({ detail: { selectedItems } }) => console.log('my selected items', selectedItems)}
/>
```


## Properties

### `query`

Selects what resources to display. Learn more about queries, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md).

The resource explorer currently only supports queries for SiteWise assets, to see the available queries you can pass in, see the [AWS IoT SiteWise Source documentation](https://github.com/awslabs/iot-app-kit/blob/main/docs/AWSIoTSiteWiseSource.md#assettree)

Type: Object

### `onSelectionChange`

A function which is called upon selecting one or more rows on the resource explorer. 

Type: Function

The function is called with an input parameter with the field:

- `selectedItems`

  The array of items selected within the resource explorer

  Type: Array

  Each item in the array will contain the following fields:
  
  - `hasChildren`
    
    Whether the given item has more nested children below it.

  - `parentId`

    (Optional) The ID of the parent for the given item. If no ID is present, then the item has no parent.


  When the resource is used with the AWS IoT SiteWise source, each item will also contain the fields present in an [asset summary](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetSummary.html).

### `columnDefinitions`

(Optional) The columns defined in the table. By default, the resource explorer table contains the following column ids: 
 - `name`
 - `status`
 - `creationDate`
 - `lastUpdateDate`

Type: Array

Each column definition contains the following fields:

* `id`

  The ID of the column. The property is used as a [key](https://reactjs.org/docs/lists-and-keys.html#keys) source for rendering.

  Type: String

* `header`

  Header label for the column.

  Type: String

* `cell` 

  A function which determines the content of a cell, which recieves the current row as an input.

  For example, if each row has a name, age and location, the cell for the name could be as follows: `({ name, age, location }) => name`

  Type: Function

* `width`

  (Optional) The column width, similar to the `width` css-property. If not specified, the browser automatically adjusts the column width based on the content. The last visible column always fills the remaining space of the table.

  Type: String or number

* `minWidth`

  (Optional) The minimum column width, similar to the `min-width` css-property. When you adjust the column size, its width can’t be less than `minWidth`. Defaults to `"120px"`.

  Type: Number or string
  
* `maxWidth`

  (Optional) The maximum column width, similar to the `max-width` css-property. When you adjust the column size, its width can’t be greater than `maxWidth`.

  Type: Number or string

* `ariaLabel`  

  (Optional) A function to specify the aria-label for the cell header. It receives the current sorting state of this column, the direction it's sorted in, and an indication of whether the sorting is disabled, as three Boolean values: `sorted`, `descending` and `disabled`. We recommend that you use this for sortable columns to provide more meaningful labels based on the current sorting direction.

  Type: Function

  The input to the function contains the following fields:

  - `sorted`
  
    Specifies whether the column is sorted. If `sorted` is true, while `disabled` is also true, it means the column is not sorted.
 
    Type: Boolean

  - `descending`
  
    If `sorted` is true, `descending` specifies whether the sort is in descending order. If the value is false, then the column is sorted in ascending order if `sorted` is also true.

    Type: Boolean

  - `disabled`

    Specifies whether sorting is disabled for the table

    Type: Boolean

### `selectionType`

(Optional) The type of selection. Defaults to the value "single".

Type: String

`selectionType` must be one of the following:

- "single"

  Can only select one row at a time.
 
- "multi"

  Can select one or more rows at a time.

### `loadingText`

(Optional) The loading message appears when the table enters the loading state. Defaults to "loading..."

Type: String

### `filterEnabled`

(Optional) Specifies whether to enable filtering. Defaults to the value `true`

Type: Boolean

### `sortingEnabled`

(Optional) Specifies whether to enable sorting. Defaults to the value `true`

Type: Boolean

### `paginationEnabled`

Specifies whether to enable pagination. If `false`, the table displays all rows on a single page at once. If `true`, the table displays 20 rows for each page.

(Optional) Specifies whether to enable pagination. Defaults to the value `true` with a default page size of 20.

Type: Boolean

### `filterTexts`

(Optional) The text that appears for each filter state. Make sure you pass an object that's present in the following `FilterTexts` type.

If no `filterTexts` is provided, then default labels are provided as described below.

Type: Object

`filterTexts` contains the following fields:

  - `placeholder`
   
    Placeholder text for the filter text box.

    If no `filterTexts` is provided, then the `placeHolder` label defaults to `"Filter by name"`.

    Type: String
 
  - `empty`
    
    Label when no resources exist.

    If no `filterTexts` is provided at all, then the `empty` label defaults to `"No assets found."`

    Type: String

  - `noMatch`

    Text displayed if there is a filter condition which no matches are found.
    
    If no `filterTexts` is provided, then `noMatch` defaults to `"We can't find a match."`.

    Type: String

### `empty`

Specifies the header and description for an empty table. 

Type: Object

The `empty` object contains the following fields:

- `header`

  (Optional) The header for the empty display. Defaults to `"No assets"`.

  Type: String

- `description`

  (Optional) The description for the empty display. Defaults to `"You don't have any assets"`.

### `wrapLines`

(Optional) Specifies whether to wrap text within table cells. If true, long text will wrap onto multiple lines rather than being truncated. Defaults to the value `false`.

Type: Boolean

### `expanded`

(Optional) If set to `true` will expand all children. Defaults to the value `false`.

Type: Boolean

