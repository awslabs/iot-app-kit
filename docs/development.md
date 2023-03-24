## Development Quick Start 

### 1. Environment setup

Iot-App-Kit runs on node and uses npm for package management. Specific versions are required in order to keep builds working with the current monorepo tooling.

Ensure you have `node` version 16 and `npm` > 8.0.

- Node: any `v16` or higher
- Npm: `v8.0.0` or higher

If you need to setup node, consult https://nodejs.org/en/download/package-manager

### 2. Initial build

IoT App Kit is a monorepo which manages multiple npm packages within a single git repository. This is achieved utilized [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) 
and [Turborepo](https://turbo.build/).

First, you need to clone the repository,

```
git clone https://github.com/awslabs/iot-app-kit.git
```

then enter the root directory, and run the following command:

```
npm run bootstrap
```

This will install all the dependencies using npm work spaces, and then build all of the packages within the monorepo.

### 3. Adding additional packages

:warning: it is important not to install packages from within the sub-package of the monorepo. Install commands must be ran from the root of the directory.

To add a new package, **from the root of the monorepo**, 

for example, to add a dependency `abbrev` to workspace `a`, run the following command

```
npm install abbrev -w a
```

Learn more at the [npm workspaces documentation](https://docs.npmjs.com/cli/v7/using-npm/workspaces#adding-dependencies-to-a-workspace).

**CAUTION**: Beware of installing packages incorrectly! This can break your build and cause unexpected depdency resolution.

### 4. Testing, linting, and fixing

Every package in IoT App Kit follows a similar structure:

- every package with tests, contains a `test` command that runs jest based tests
- every package contains a `lint` command that executes eslint
- every package contains a `fix` command that fixes eslint errors
- every package contains a `build` command that builds the package

By running one of these shared commands from the root of the directory, you will execute the command across all packages.

Packages that have no changed since the last succesful execute of the task will be cached via [Turborepo](https://turbo.build/repo/docs/core-concepts/caching)
and not re-execute. This enables you to run a full build without re-building things that don't need to be built.

If you would like to force everything to rebuild anyhow, you can leverage the `turbo` CLI as follows:

```
turbo run build --force
```

Learn more about turbo repo at the [official documentation](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks).

### 5. Making commits to contribute

Each pull request to IoT App Kit must contain a single commit ontop of current `main`.

Each commit must follow [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) which is utilized to generate a change log and determine
the correct [semver](https://semver.org/) version for publishing.

Due to the changelog and versioning being determined by the commit messaging, commit messages are considered part of the review process,
so "squash merging" and other techniques that allow changing the commit message after approval right before merging, are not allowed.

**git good tip**: `git rebase -i HEAD~${NUM_COMMITS}` is a useful way to squash together the last `NUM_COMMITS` before making your pull-request. Learn more [here](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History). 

### 6. Additional Coding guidelines and requirements

Utilize the [coding guidelines](https://github.com/awslabs/iot-app-kit/tree/main/docs/CodingGuidelines.md) for the requirements in creating IoT App Kit components, and general coding best practices for this repository.
