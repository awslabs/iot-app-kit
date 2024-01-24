# Pull request best practices

The following are list of recommended practices which we strive to meet. There
are always exceptions, yet exceptions are exceptional. We follow these practices
to ensure a high quality and rapid development lifecycle.

## Authoring

- Create PRs early and often.
  - PRs should contain a single commit. 
  - PRs should be small (~100-500 lines is reaching the limit, depending on
change). 
    - Long PRs cannot be effectively reviewed. 
    - If you’re writing a lot of code, it should be possible to create one or
    more PRs within a day.

- Don’t waste someone’s time.
    - Leave the PR in draft state until the CI checks have passed. 
    - If the work is not finished, it should be a draft state. 
    - Review your PR before submitting or removing from draft state.
    
- Structural changes should be separated from behavioral changes. 
  - Don’t change behavior and structure at the same time. 
  - Give the PR and commit the “tidy” tag to signify the lack of behavioral
  changes. 
  
- Behavioral changes should includes effective tests which prevent regressions.
  - Test at the appropriate level, considering the cost and effectiveness of the
  test. 
  - Ask yourself: “will my tests ensure my change still works in 3 years?”
  
- Effectively describe the PR. 
  - Write a summary to describe the change at a high level. 
  - Include screenshots, GIFs, and videos when appropriate. 
  - If there are particular areas you want the reviewer to pay attention to,
  call them out. If there are risks, call them out. 
  
- Consider having a specific person(s) review the work if they have valuable
  expertise.

## Reviewing

- Focus on what matters:
  - Is the overall solution a good approach?
  - Are there any obvious bugs in the code?
  - Has the change been effectively tested?
  - Is the PR safe to merge?
  - Is the overall quality good?

- Don’t focus on what doesn’t matter. 
  - Nits don’t block PRs. Opinions don’t block PRs. If it’s a nit or an opinion
   and its not covered in the [coding guidelines](https://github.com/awslabs/iot-app-kit/blob/main/docs/CodingGuidelines.md)
   or caught by the linter, it’s not a blocker. Add it to the coding guidelines
   or the linter and align with the team.

- Prioritize reviewing. It’s your job. It helps the team move quickly. It helps
  us write more frequent and smaller changes.
  - Similarly, don’t leave feedback and disappear. If you start a review, you
    finish the review. Every PR author has the right to a speedy review.
  - It should be possible to review multiple small PRs a day.

- PRs with only structural changes (i.e., refactoring or tidying) should be
  quickly rubber-stamped.
  - This only works if we truly have no behavioral changes in the PR.
  - Reduced overhead on structural changes incentivizes improving the codebase.
