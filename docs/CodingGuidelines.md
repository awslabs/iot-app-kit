
# Coding guidelines

Guidelines that code authors and code reviewers are expected to adhere to in the development of IoT App Kit.

## General guidelines

1. Documentation must be written in a style that is consistent with the rest of the documentation (based on the AWS documentation style)  
   Compare writing to other written examples within https://docs.aws.amazon.com/iot-sitewise/ as a primary source on how to write the documentation, as well as cross-referencing other documentation found within https://github.com/awslabs/iot-app-kit/tree/main/docs.

1. Ensure that all documentation is correctly referenced in the table of contents, which can be found at https://github.com/awslabs/iot-app-kit/blob/main/README.md.

   In-depth guidelines on documentation: https://alpha-docs-aws.amazon.com/awsstyleguide/latest/styleguide/awsstyleguide.pdf#aws-implementation-guides. This can be a useful reference, but you are not expected to read through and be 100% adherent to these guidelines.
1. Components must have high quality testing, including integration tests which utilize the component in the way a user does. An example of a good example integration test can be found in the [@iot-app-kit/source-iotsitewise package](https://github.com/awslabs/iot-app-kit/blob/main/packages/source-iotsitewise/src/time-series-data/data-source.spec.ts#L562-L603)

1. Tests should be written to maximize the chance that the test would actually catch a real issue, i.e. the likelihood of preventing a regression. This is the primary value of a test.  Useful talk on testing: https://www.youtube.com/watch?v=Fha2bVoC8SE3.

1. Tests should be written to minimize the pain they inflict on the development cycle. Every test represents some amount of burden, through the necessity to run it, maintain it, and alter the test as the codebase morphs, however some tests inflict more pain than others.

   *EXAMPLES OF PAIN*:
   
    - tests failing when nothing broke
    - flaky tests
    - snapshot tests that vary on machine
    - tests that require refactoring when irrelevant portions of the codebase are altered

1. Tests should be written to not fail when things are not broken (this helps reduce inflicted pain). This can be achieved through techniques such as not over asserting.

   *GOOD ASSERTION EXAMPLE*:  
   
   ```expect(result).toEqual(expect.objectContaining({ error: null })```

   *BAD ASSERTION EXAMPLE*:  
   
   every test asserting on every property over and over whether or not they are relevant to the purpose of the test

1. Tests names should be descriptive and from a users' perspective:  
 
   *GOOD NAME EXAMPLE*: “it creates new user when new user form is submitted”  
   
   *BAD NAME EXAMPLE*: “button dispatches onClick event”

1. Tests should, at minimum, cover all core feature use-cases and identifiable edge-cases or boundary conditions.

1. Code must be written in a consistent style, utilizing the shared eslint and stylelint configurations https://github.com/awslabs/iot-app-kit/blob/main/.eslintrc.js https://github.com/awslabs/iot-app-kit/blob/main/.stylelintrc
1. Pull requests to feature branches must contain only a single, well formatted commit that adheres to https://www.conventionalcommits.org/en/v1.0.0/
1. Pull requests to main must have correct change logs which properly document migrations, feature changes, and most importantly breaking change. [example commit](https://github.com/awslabs/iot-app-kit/commit/9e09d6229dc5d27309766db4717d5a250e91bdd7)
1. Pull requests to main from a feature branch should maintain the git history as contained in the feature branch
1. Pull requests to main must have the correct versioning updates, following https://semver.org/
1. Pull request descriptions should include a reasonably detailed summary of changes and highlight any architectural decisions introduced.
1. Reviewers are expected to enforce a high standard on:
    1. Consistent code to rest of codebase
    1. High quality tests that are not painful to maintain
    1. Architectural and big picture aspects of how the change fits in
1. It is ok to build out work incrementally within a feature branch, but not in main.

    For example, it is OK to have a PR merged into a feature branch with missing test cases and add those in the next PR. This helps allow people to get code in more frequently rather than having long lived local branch.

    When a pull request to main is made, there will be no “rolling fixes/improvements in next PR”.
12. Avoid long-lived local feature-branches. Make pull requests incrementally, even if not everything is perfect. Explicitly state in the PR overview what aspects are in progress to help reviewers effectively understand what parts to provide feedback on.
13. Customer facing APIs should not require ENUMS. Strings with strict typescript types are preferable and easier for customers to utilize.

    *GOOD EXAMPLE*:
    
     ```
    <iot-line-chart size=“SM” ... /> 
    ```

    *BAD EXAMPLE*:
    
    ```  
    <iot-line-chart size={Size.SM} ... /> 
    ```  

14. Make the code consistent with the existing code base
15. Avoid mutations when possible. Prefer immutability

    *GOOD EXAMPLE*:  

    Returns updated object without mutating the input
    
    ```  
     (myObject) => ({ ...myObject, name: trimName(myObject.name (http://myobject.name/)) }) 
    ```  
    
    *BAD EXAMPLE*:  
    
    Mutates input to method (DO NOT DO THIS)  
    
    ```
    (myObject) => { myObject.name (http://myobject.name/) = trimName(myObject.name) } 
    ```
    
16. Keep it simple

    Code bases tend to only grow in complexity, until no one can understand them or maintain them. It is paramount that reducing complexity is a top concern on every piece of code.

17. Write functions as pure functions where possible.

    A pure function is a function which takes inputs, and returns a result, without modifying the inputs and without any side effects.

    *EXAMPLE OF PURE FUNCTION*:  
    
    ```
    (a, b) => a + b
    ```

    *EXAMPLE OF IMPURE FUNCTION*:  
    
    ```
    () => { globalCounter++; }
    ```
    
    Impure functions are unavoidable, but should be minimized, and should contain the minimal required. Complicated business logic should be separated off into independent pure functions. Pure functions are much easier to test, and utilize.

18. Consider performance where it matters

    In some scenarios, improving the performance will add complexity, while not actually effecting the end performance seen by the users. In this case, always opt for simplicity.

19. Embrace refactoring

    Refactoring is crucial to the health of any code base. Fearlessly refactor where it can help improve simplicity. Often times code when originally written misses the mark. Do not be afraid to refactor code written by other authors.
20. State is the root of complexity

    Minimize the amount of state is required and avoid entangling state management through the entire codebase.  Often times state should be pushed towards the boundary (such as in a reducer).

    The being said there’s nothing wrong with local UI state managed directly in a component. For example, for a collapsable menu, it will probably make sense to just store the open state directly in the component. Do not blindly pull all state into a centralized state manager as a reducer.

    *EXAMPLE OF BAD STATE MANAGEMENT*:

    UI components storing state of multiple async calls, coordinating loading status, and pagination

## IoT App Kit component requirements

1. Components will utilize [Cloudscape](https://cloudscape.design/) for primitive components, unless a good case is made not to. The default is to use Cloudscape.
1. Styling should adhere to https://cloudscape.design/ design principles and guidelines.
1. Web components will be exported within https://github.com/awslabs/iot-app-kit/tree/main/packages/components, with a iot- prefix. i.e. iot-line-chart. Their styles should be contained within `"@iot-app-kit/components/styles.css"`.
1. React components will be exported within https://github.com/awslabs/iot-app-kit/tree/main/packages/react-components with no prefix, i.e. LineChart
1. Components can also be created in other repositories, but must ultimately be exported from either @iot-app-kit/components and @iot-app-kit/react-components (or both)
1. All components prior to release must have public facing documentation within https://github.com/awslabs/iot-app-kit/tree/main/docs, including updating the https://github.com/awslabs/iot-app-kit with the relevant information.
1. Components must work across the commonly used browsers. Any browser that has over 1% of total internet usage as defined by https://caniuse.com/usage-table is considered a commonly used browser. (which does not include IE11.

1. All IoT App Kit components contain a `size` property, which can be "XS", "S", "M", "L", "XL", or "XXL".

   These sizes do not affect the overall width and height of the element, but instead form a guide for sizing widget elements such as font size, line thickness, symbol size, and level of detail. Each size has a standard sizing for various elements, as well as a dimension which the widget should look good at. For example, an XS widget should be displayable at a size of 75px by 75px, but a user could display a XS widget in a larger container if they desired to. However a XXL widget if put in a small container, will not work well.

   | Size | Primary font size | Large font size |Icon size | Looks good at dimension |
   |------|-------------------|-----------------|----------| ------------------------|
   | XS    | 14               | 20              | 16       | 75px by 75px            |
   | S     | 16               | 24              | 20       | 100px by 100px          |
   | M     | 20               | 32              | 32       | 150px by 150px          |
   | L     | 24               | 48              | 48       | 200px by 200px          |
   | XL    | 32               | 60              | 60       | 300px by 300px          |
   | XXL   | 48               | 96              | 96       | 500px by 500px          |

   (Note: this specification is not exhaustive and subject to change. Size-affected elements will vary by component

1. Components must support internationalization via messageOverrides (i.e. avoid hard coded phrases)

   for example,
   
   ```
   <iot-line-chart  
     messageOverrides={{  
       loadingLabel: 'Loading...',  
       invalidDataType: 'your data is not a supported type',  
     }}  
     ...  
   />  
   ```

1. Components should support various data sources, via either a query or queries property.
   for example,
   
     ```
      <iot-line-chart  
      queries={[query.timeSeriesData(...)]}  
      ...  
    />  
    ```
1. It is ok to have data-source specific features. Not all data-source features will be generic in nature, but that shouldn’t prevent us from exposing them to make it easy for customers to utilize the feature.
1. Components should try there best to work with a generic data-source where it makes sense.

   For example, a line chart component is quite generic and should be able to support any time series data.
1. Components that visualize time series data, must support a viewport,
1. If the viewport contains a duration, then the component should properly interpret this as visualizing the last duration ms
1. If the viewport contains a start and an end date, the component should properly interpret this as visualizing the data between start and end.

   for example, the following line chart should display the last 1 seconds of data queried
     ```
      <iot-line-chart  
        viewport={{ duration: 1000 }}  
        queries={...}  
        ...  
      />  
    ```
1. Components must provide a user understandable message when provided unsupported data types
1. Components must properly handle loading states
1. Components must properly handle error states
1. Components must support annotations where they make sense. An example of an annotation can be found at https://synchrocharts.com/#/Features/Annotation
1. Components must visualize trend lines where it makes sense, for example, a line chart should visualize the trend line. An example of a trend line can be found at https://synchrocharts.com/#/Features/Trends  
