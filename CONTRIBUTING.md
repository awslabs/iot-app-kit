# Contributing Guidelines
Thank you for your interest in contributing to our project. Whether it's a bug report, new feature, correction, or additional
documentation, we greatly value feedback and contributions from our community.

Please read through this document before submitting any issues or pull requests to ensure we have all the necessary
information to effectively respond to your bug report or contribution.


## Reporting Bugs/Feature Requests
We welcome you to use the GitHub issue tracker to report bugs or suggest features.

When filing an issue, please check existing open, or recently closed, issues to make sure somebody else hasn't already
reported the issue. Please try to include as much information as you can. Details like these are incredibly useful:

* A reproducible test case or series of steps
* The version of our code being used
* Any modifications you've made relevant to the bug
* Anything unusual about your environment or deployment


## Contributing via Pull Requests
Contributions via pull requests are much appreciated. Before sending us a pull request, please ensure that:

1. You are working against the latest source on the *main* branch.
2. You check existing open, and recently merged, pull requests to make sure someone else hasn't addressed the problem already.
3. You open an issue to discuss any significant work - we would hate for your time to be wasted.

To send us a pull request, please:

1. Fork the repository.
   1. Github provides information on how to [fork a repository](https://help.github.com/articles/fork-a-repo/) and
      [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).
1. Modify the source; please focus on the specific change you are contributing. If you also reformat all the code, it will be hard for us to focus on your change.
1. Ensure local tests pass.
1. Commit to your fork using clear commit messages.
1. Send us a pull request:
    1. Answer any default questions in the pull request interface.
    1. Within the pull request, include a copy of the link to the passing GitHub Action running the tests
    1. If your pull request adds cypress integration tests which perform a snapshot, the snapshots must be created within the CI process. To achieve this, you
       will need to temporarily alter the GitHub workflow to generate and persist snapshots. Create a pull request within your own forked version of Synchro Charts. Once the tests complete, it will provide you with a file containing
       the generated snapshots. Take these generated snapshots, manually confirm they look correct, and then add them to the repository. Revert any changes made to the GitHub actions, and now you have
       correctly generated new snapshots! [Example of modified GitHub actions to include snapshot](https://github.com/diehbria/aws-synchro-charts/blob/0610b552b284f0f54ae059ee35fb5fa5ad036221/.github/workflows/github-actions.yml).
    1. Stay attentive to any conversation or requested changes, try to have a response within a weeks time. Stale pull requests will automatically be closed.
1. Contributions which are approved by the core contributors of Synchro Charts and pass all tests will then be merged by a core contributor.

## Finding contributions to work on
Looking at the existing issues is a great way to find something to contribute on. As our projects, by default, use the default GitHub issue labels (enhancement/bug/duplicate/help wanted/invalid/question/wontfix), looking at any 'help wanted' issues is a great place to start.

Please feel free to reach out to the core contributors of Synchro Charts to discuss any ideas further.

## Code of Conduct
This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct).
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact
opensource-codeofconduct@amazon.com with any additional questions or comments.

## Security issue notifications
If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public github issue.


## Licensing
See the [LICENSE](LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.
