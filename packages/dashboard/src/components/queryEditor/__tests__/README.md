# Testing

`<QueryEditor />` is tested using unit tests with a mock implementation of the AWS SDK v3 IoT SiteWise client. The client's `send` method is mocked and resolved with SDK command output stubs.

## Tips

To know what requests the component is making, use `expect(subject).toHaveBeenNthCalledWith(1)` in the test and read the test runner output. 
