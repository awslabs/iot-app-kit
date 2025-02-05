# `smoke-test`

`smoke-test` is involved in the automated validation of code changes to ensure they will eventually result in publishable package able to be successfully installed and integrated by users.

## Purpose

`npm` allows broken packages to be tarred with `npm pack` or tarred and published with `npm publish`. When `npm` tars the package, the closure includes the `package.json`, a few other standard files, if they exist, and our custom files specified in the `package.json`'s `.files` field, which typically includes `dist`. If the package has not been built and there is no `dist` folder, for example, the tarball will simply not contain the `dist` folder and the published package will contain no build artifacts.

While a package's build may succeed, it does not necessarily mean the build artifacts will be functional at runtime. To function at runtime, a package's `package.json` must correctly describe to the Node.js runtime how to consume the package (i.e., using `.main`, `.type`, `.exports`, `.imports`, and other key fields). If the `package.json` does not describe the build artifacts accurately, the package cannot be utilized by the consumer, even if it installs. Keeping the `package.json` and the build artifacts synchronized is challenging, as any single change to these key fields, the `tsconfig.json` (or other build configuration), or the `package.json`'s build scripts may result in failure if any single common configuration does not receive the corresponding required change.

With `npm` workspaces, during development, when an iot-app-kit package depends on another, it consumes its build artifacts with a symlink in `node_modules` pointing to the consumed package's `dist`. When packages are published, iot-app-kit packages consume other iot-app-kit packages the same as any typical dependency, by downloading and installing the package's tarball from `npm`. The disparity between how packages are consumed in development and in production by real users allows for the utilization of packages during development in ways unsupported in production and undetectable until the package is tarred and consumed outside of the monorepo/`npm` workspaces context.

_Note: It is critical this package is not included in the `npm` workspaces configuration to avoid npm creating symbolic links to and internally consumed iot-app-kit packages._

## Supported scope and validations

The current scope includes explicitly validating the `dashboard` package and implicitly all of its internal package runtime dependencies, including `core`, `core-util`, `react-components`, and `source-iotsitewise`. We expect these packages may be successfully installed, loaded at runtime, and bundled by consumers.

## Desired qualities

- **Correctness/Predictability** - Validations should provide us the confidence to conduct a successful release at any time.
- **Extensibility** - Additional packages and validations, including different types of validations, may be added to the package without requiring significant changes to the package.
- **Performance** - Validations should be quick and not slow down development and release workflows.
- **Scalability** - Performance standards should be maintained as more packages and validations are added.

## Responsibilities

- Provide confidence in our ability to publish packages.
- Reliably validate the ability to install, load at runtime, and bundle published iot-app-kit packages prior to publishing.
- Provide interface to run the validation tests via CI.

## Relationships

- `smoke-test` relies on CI orchestration (see `.github/workflows/validate.yml`) to facilitate package validation.
