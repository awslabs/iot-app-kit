# IoT Application Kit

## Quick start for development

1. Environment setup

We must have node version 16 and the latest verison of yarn installed.


To do this, execute the following commands:
```
# Install `n`, a node package manager, globally to help switch between node versions.
npm i n -g

# Update to node version 16
sudo n 16

# Install the latest version of yarn
npm i yarn@latest -g

# Optionally, install lerna
npm i lerna -g
```

2. Build project

```
# Without installing lerna locally...
npx lerna bootstrap 

# With lerna installed locally
lerna bootstrap
```

4. Provide credentials
Copy a set of AWS JSON formatted credentials to the account with the access to the SiteWise resources you are requesting, at `<rootDir>/packages/components/creds.json`.
   
These credentials should not be uploaded to the repository.

5. Point to valid SiteWise resources

Alter the file `siteWiseQueries` within `@iot-app-kit/components` to point to valid SiteWise asset properties for the accounts credentials from the prior step. 

3. Test locally
run `yarn run start` at the project root, and then view `localhost:3333`. Here yohu should see example IoT App Kit components requesting data from SiteWise.


## Packages

The IoT Application Kit mono-repo containing the following packages:

### @iot-app-kit/core
`@iot-app-kit/core` is the core library which exposes the iot-app-kit framework, and is what iot-app-kit components are built upon

[Learn more here](packages/core/README.md).

### @iot-app-kit/components
`@iot-app-kit/components` is a collection of components which are connected to iot-app-kit, exposed as web components

[Learn more here](packages/components/README.md).

### @iot-app-kit/related-table
`@iot-app-kit/related-table` is a tree view table component built over `@awsui/components-react` components providing client side filtering, sorting and pagination with high performant and optimistic rendering

[Learn more here](packages/related-table/README.md).

## Security
See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License
This project is licensed under the Apache-2.0 License.

