## Installing packages

### Best practices

- Please only install dependencies using npm workspaces commands (see [useful commands](#useful-commands)) from the root of the project. Failure to do so may result in package versioning issues across the project.
- Only install dependencies at the mono-repo level (i.e., root level) if they act on the entire project. Otherwise, install the dependencies directly to the packages using them. The root package.json should not be used to share common dependencies.
- Ensure all depedency versions match across the project (i.e., don't have Typescript 5.5 in package-1 and 5.4 in package-2). If versions do not match, dependency resolution issues may occur.
- Read the documentation on npm workspaces and turbo repo.

### Useful commands

#### Install all dependencies

```sh
npm run install-ws
```

#### Install dependencies in the root package.json

```sh
npm install <dependency>
```

#### Install dependencies in every package except the root

```sh
npm install <dependency> --workspaces
```

#### Install dependencies in single package

```sh
npm install <dependency> --workspace=@iot-app-kit/<package>
```

#### Install dependencies in multiple packages

```sh
npm install <dependency> --workspace=@iot-app-kit/<package-1> --workspace=@iot-app-kit/<package-2> --workspace=@iot-app-kit/<package-3>
```
