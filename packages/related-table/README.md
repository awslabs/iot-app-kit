## Licensing
Amazon is planning to release this code under an open source license to the general public in the future.  As a condition of accessing and using this code prior to its public open source release, you agree that until such public open source release (i) this code is considered as Amazon’s Confidential Information under your MNDA with Amazon and you may not disclose any information about this code or redistribute any portion of this code to any third party, and (ii) your rights to use, copy, and prepare Derivative Works of the code are limited to internal uses only.  If you do not agree with these terms, you may not access or use the code.  These terms must accompany all copies of the code that you distribute internally until the public open source release.  Subject to your compliance with the above terms, this code is provided to you under the terms of the Apache 2.0 license.
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
