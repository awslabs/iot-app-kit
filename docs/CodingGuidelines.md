# Coding guidelines

Guidelines that code authors and code reviewers are expected to adhere to in the development of IoT App Kit.

---

## Table of contents

- [Components](#components)
- [Code Style](#code-style)
- [Documentation](#documentation)
- [Pull Requests](#pull-requests)
- [Tests](#tests)

---

## Components

- #### General guidelines
    - All components prior to release must have public facing documentation within https://github.com/awslabs/iot-app-kit/tree/main/docs, including updating the https://github.com/awslabs/iot-app-kit with the relevant information.

    - Components must properly handle both loading and error states.

    - Components must support both [annotations](https://synchrocharts.com/#/Features/Annotation) and [trend lines](https://synchrocharts.com/#/Features/Trends) where they make sense.

    - Components must work across any broswer that has [over 1% of total internet usage](https://caniuse.com/usage-table) - which doesn't include IE11. 

    - Default to [Cloudscape](https://cloudscape.design/) for primitive components unless a good case is made not to.
    
    - Styling should adhere to [Cloudscape](https://cloudscape.design/) design principles and guidelines.

    - All IoT App Kit components contain a `size` property, which can be "XS", "S", "M", "L", "XL", or "XXL". These sizes do not affect the overall width and height of the element, but instead form a guide for sizing widget elements such as font size, line thickness, symbol size, and level of detail. Each size has a standard sizing for various elements, as well as a dimension which the widget should look good at. For example, an XS widget should be displayable at a size of 75px by 75px, but a user could display a XS widget in a larger container if they desired to. However a XXL widget if put in a small container, will not work well. (Note: this specification is not exhaustive and subject to change. Size-affected elements will vary by component.

    | Size | Primary font size | Large font size |Icon size | Looks good at dimension |
    |------|-------------------|-----------------|----------| ------------------------|
    | XS    | 14               | 20              | 16       | 75px by 75px            |
    | S     | 16               | 24              | 20       | 100px by 100px          |
    | M     | 20               | 32              | 32       | 150px by 150px          |
    | L     | 24               | 48              | 48       | 200px by 200px          |
    | XL    | 32               | 60              | 60       | 300px by 300px          |
    | XXL   | 48               | 96              | 96       | 500px by 500px          |
    
    - Components must support internationalization via messageOverrides (i.e. avoid hard coded phrases).
        - Example:
            ```
            <iot-line-chart  
                messageOverrides={{  
                    loadingLabel: 'Loading...',  
                    invalidDataType: 'your data is not a supported type',  
                }}  
                ...  
            />  
            ```

    - Components must have high quality testing, including integration tests which utilize the component in the way a user does. An example of a good example integration test can be found in the [@iot-app-kit/source-iotsitewise package](https://github.com/awslabs/iot-app-kit/blob/main/packages/source-iotsitewise/src/time-series-data/data-source.spec.ts#L562-L603).

- #### Data
    - Components should support various data sources, via either a query or queries property.
        - Example:
            ```
            <iot-line-chart  
                queries={[query.timeSeriesData(...)]}  
                ...  
            />  
            ```
    
    - Data source specific features are allowed. Not all data source features will be generic in nature, but that shouldn't prevent us from exposing them to make it easy for customers to utilize the feature.

    - Components should try to stay data source generic whenever possible.
        - Example: A line chart is quite generic and should support any time series data.

    - Components must provide a user understandable message when provided unsupported data types.

- #### Exports
    - Web components will be exported within https://github.com/awslabs/iot-app-kit/tree/main/packages/components, with a iot- prefix. i.e. iot-line-chart. Their styles should be contained within `"@iot-app-kit/components/styles.css"`.

    - React components will be exported within https://github.com/awslabs/iot-app-kit/tree/main/packages/react-components with no prefix. i.e. LineChart

    - Components can also be created in other repositories, but must ultimately be exported from either @iot-app-kit/components and @iot-app-kit/react-components (or both).

- #### Visualization (Viewport)
    - Components that visualize time series data must support a viewport.
        - If the viewport contains a duration the component should visualize the last duaration ms.

        - If the viewport contains start and end dates the component should visualize data between the start and end.

    - Example:
        ```
        <iot-line-chart  
            viewport={{ duration: 1000 }}  
            queries={...}  
            ...  
        />  
        ```

---

## Code style

-  Code must be written in a consistent style, utilizing the shared [eslint](https://github.com/awslabs/iot-app-kit/blob/main/.eslintrc.js) and [stylelint](https://github.com/awslabs/iot-app-kit/blob/main/.stylelintrc) configurations. 

- Customer facing APIs should not require ENUMS. Strings with strict TypeScript types are preferable because they are easier for customers to utilize.
    
    - *GOOD EXAMPLE*:
    ```
    <iot-line-chart size=“SM” ... /> 
    ```
    - *BAD EXAMPLE*:
    ```  
    <iot-line-chart size={Size.SM} ... /> 
    ```  

- Make the code consistent with the existing code base.

- Avoid mutations when possible. Prefer immutability.

    - *GOOD EXAMPLE*: Returns updated object without mutating the input.
    ```  
     (myObject) => ({ ...myObject, name: trimName(myObject.name (http://myobject.name/)) }) 
    ```  
    
    - *BAD EXAMPLE*: Mutates input to method.
    ```
    (myObject) => { myObject.name (http://myobject.name/) = trimName(myObject.name) } 
    ```
    
- Keep it simple. Code bases tend to only grow in complexity, until no one can understand them or maintain them. It is paramount that reducing complexity is a top concern on every piece of code.

- Write functions as pure functions where possible. A pure function is a function which takes inputs, and returns a result, without modifying the inputs and without any side effects.

    - *EXAMPLE OF PURE FUNCTION*:  
    ```
    (a, b) => a + b
    ```
    - *EXAMPLE OF IMPURE FUNCTION*:  
    ```
    () => { globalCounter++; }
    ```
    
    Impure functions are unavoidable, but should be minimized, and should contain the minimal required. Complicated business logic should be separated off into independent pure functions. Pure functions are much easier to test, and utilize.
    
- Consider performance where it matters. In some scenarios, improving the performance will add complexity, while not actually effecting the end performance seen by the users. In this case, always opt for simplicity.

- Embrace refactoring. Refactoring is crucial to the health of any code base. Fearlessly refactor where it can help improve simplicity. Often times code when originally written misses the mark. Do not be afraid to refactor code written by other authors.

- State is the root of complexity. Minimize the amount of state is required and avoid entangling state management through the entire codebase.  Often times state should be pushed towards the boundary (such as in a reducer). The being said there’s nothing wrong with local UI state managed directly in a component. For example, for a collapsable menu, it will probably make sense to just store the open state directly in the component. Do not blindly pull all state into a centralized state manager as a reducer.

    - *EXAMPLE OF BAD STATE MANAGEMENT*:
    UI components storing state of multiple async calls, coordinating loading status, and pagination.
---

## Documentation

- Documentation must be written in a style that is consistent with the rest of the documentation. Use the [AWS documentation style](https://docs.aws.amazon.com/iot-sitewise/) as a guide, as well as cross-referencing the other [iot-app-kit documentation](https://github.com/awslabs/iot-app-kit/tree/main/docs).

- Ensure that all documentation is correctly referenced in the (table of contents)[https://github.com/awslabs/iot-app-kit/blob/main/README.md].

- Review the [in-depth guidelines](https://alpha-docs-aws.amazon.com/awsstyleguide/latest/styleguide/awsstyleguide.pdf#aws-implementation-guides) on documentation. This can be a useful reference, but you are not expected to read through and be 100% adherent to these guidelines.

---

## Pull requests

- Pull requests to feature branches must contain only a single, well formatted commit that adheres to [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

- Pull requests to main must have correct change logs which properly document migrations, feature changes, and most importantly breaking change. [example commit](https://github.com/awslabs/iot-app-kit/commit/9e09d6229dc5d27309766db4717d5a250e91bdd7)

- Pull requests to main from a feature branch should maintain the git history as contained in the feature branch.

- Pull requests to main must have the correct versioning updates following [semver](https://semver.org/).

- Pull request descriptions should include a reasonably detailed summary of changes and highlight any architectural decisions introduced.

- Reviewers are expected to enforce a high standard on:
    - Consistent code to rest of codebase.
    - High quality tests that are not painful to maintain.
    - Architectural and big picture aspects of how the change fits in.

- It is ok to build out work incrementally within a feature branch, but not in main. For example, it is OK to have a PR merged into a feature branch with missing test cases and add those in the next PR. This helps allow people to get code in more frequently rather than having long lived local branch. When a pull request to main is made, there will be no “rolling fixes/improvements in next PR”.

- Avoid long-lived local feature-branches. Make pull requests incrementally, even if not everything is perfect. Explicitly state in the PR overview what aspects are in progress to help reviewers effectively understand what parts to provide feedback on.
---

## Tests

- Tests should be written to maximize the chance that the test would actually catch a real issue, i.e. the likelihood of preventing a regression. This is the primary value of a test.  Useful talk on testing: https://www.youtube.com/watch?v=Fha2bVoC8SE3.

- Tests should be written to minimize the pain they inflict on the development cycle. Every test represents some amount of burden, through the necessity to run it, maintain it, and alter the test as the codebase morphs, however some tests inflict more pain than others.

   - *EXAMPLES OF PAIN*:
        - tests failing when nothing broke
        - flaky tests
        - snapshot tests that vary on machine
        - tests that require refactoring when irrelevant portions of the codebase are altered

- Tests should be written to not fail when things are not broken (this helps reduce inflicted pain). This can be achieved through techniques such as not over asserting.

   - *GOOD ASSERTION EXAMPLE*:  
   ```
   expect(result).toEqual(expect.objectContaining({ error: null })
   ```

   - *BAD ASSERTION EXAMPLE*: every test asserting on every property over and over whether or not they are relevant to the purpose of the test

- Tests names should be descriptive and from a users' perspective.  

   - *GOOD NAME EXAMPLE*: 
   ```
   it("creates new user when new user form is submitted”)
   ```
   
   - *BAD NAME EXAMPLE*:
   ```
   it(“button dispatches onClick event”)
   ```

- Tests should, at minimum, cover all core feature use-cases and identifiable edge-cases or boundary conditions.