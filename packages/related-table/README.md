# Related Table

Related Table is a tree view table component written in React and built over `@awsui/components-react` `table` component providing client side filtering, sorting and pagination with high performant and optimistic rendering.

Presents data in a two-dimensional table format with hierarchical view, arranged in columns and rows in a rectangular form.

## Stack
- React and React Hooks >= 16.8.0
- Typescript >= 4.3.0
- AWSUI open source dependencies:
  - `@awsui/components-react: ^3.0.0`
  - `@awsui/collection-hooks: ^1.0.0`
  - `@awsui/design-tokens: ^3.0.0`

## Install - Peer dependencies

Add to your package.json:

```bash
npm i --save @iot-app-kit/related-table @awsui/collection-hooks @awsui/components-react @awsui/design-tokens react react-dom styled-components
```

## Development

### Local Setup

```bash
npm install
```

### Storybook

```bash
npm run storybook
```

### Jest

Jest tests are set up to run with `npm test`.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Including Styles

For this package we use CSS-in-JS with styled-components, so please refer to `src/RelatedTable/Common/StyledComponents.tsx` file
