## Overview
Provide an explanation of what the change is

## Verifying Changes

### Scene Composer
For `scene-composer` package changes specifically, you can preview the component in the published storybook artifact. To do this, wait for the `Publish Storybook` action to complete below.

- Click on the workflow details
- Select the Summary item on the left
- Download the zip file

To run the storybook build locally, you need a local static web server:

```
npm install -g httpserver
cd <Extracted Zip Directory>
httpserver
```

Then open the website http://localhost:8080 to run the doc site.

## Legal
This project is available under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).
