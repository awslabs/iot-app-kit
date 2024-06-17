# How To Update Snapshot Tests

### Steps:
Lets use [PR-2870](https://github.com/awslabs/iot-app-kit/pull/2870) as our example. In this PR there were some visual changes made which will break the snapshot tests. 

1. Do NOT update the snapshot tests by using the locally generated snapshots.
2. You will first need to create the PR so you can grab the updated snapshots from a failed testing run. At the bottom of the failed test's Summary page there is a section called Artifacts, which will have a link to download a file called `Playwright failed test-results`.
    * For the above PR, the failed test run can be found [here](https://github.com/awslabs/iot-app-kit/actions/runs/9550517617)
3. Once you download and unzip the file you’ll see `[package-name]/test-results/` with many folders. Each folder will correspond to one failed attempt for one test.
4. Open the folder and copy the file called `*-actual.png`. This file will be the replacement image which will be copied into the test’s snapshots folder. 
5. Paste the image into the correct snapshot folder (the folder should be called something like `packages/[package-name]/e2e/tests/...`). 
    * Note that you will have to replace **two** images, one will be called `[test-name]-chromium-darwin.png` and the other is ``[test-name]-chromium-linux.png`.
6. Push the changes to the PR and the github action should pass!