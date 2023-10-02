# Getting Started with Sample App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup AWS credentials

1. Make a copy of the `.env.local.example` as `.env.local`, which will be loaded by the app to get the credentials for testing. 

2. Update the `.env.local` file with the AWS credentials you get. Make sure they include the `VITE`!

## Note

1. The `react-app/src/config.ts` file contains placeholder & example ids that will be used to load data when the app is running. Make sure to update them to real values.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
