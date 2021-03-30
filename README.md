# n2p-template-repo

This is basic template for net2phone repo.

## Contents

1. [Project Settings](#project-settings)
2. [Code style](#code-style)
    * [.editorconfig](#editorconfig)
        * [Managing rules](#managing-rules)
        * [How to apply](#how-to-apply)
    * [tests](#tests)

## Project Settings

Settings are not copied by github.

Go and set this settings according the following steps.

Protect your branches

* `dev`
* `rc`
* `master` (if applicable)

Protection you must use:
  
* Require pull request reviews before merging
  * Dismiss stale pull request approvals when new commits are pushed
  * Require review from Code Owners
  * Restrict who can dismiss pull request reviews
* Require status checks to pass before merging
  * Require branches to be up to date before merging
  * continuous-integration/jenkins/branch
* Include administrators

Set correct permission:

* automation team: `Admin`
* n2p admins team: `Admin`
* your scrum team: `Write`

Tune settings:

* turn off wiki
* turn off issues
* turn off projects
* allow github to perform read-only analysis
* turn on automatically delete head branches (recommended)

## Code style

### .editorconfig

To handle code style in project `.editorconfig` is used

This project has [`.editorconfig`](.editorconfig) file with styling rules.

_It is source of truth for all `net2phone` projects._

#### Managing rules

To add new rule we use team member's grooming and PR approach:

* Notice something you want to change
* Find related rule in [standard EditorConfig properties](https://www.jetbrains.com/help/resharper/Using_EditorConfig.html#standard) or in most frequently used [.NET-coding-convention EditorConfig properties](https://www.jetbrains.com/help/resharper/Using_EditorConfig.html#roslyn)
* Fork this project `n2p-template-repo`
* Create new branch: `style/NEW_RULE`
* Extend `.editorconfig` with new rule
* Open new pull request `style: NEW_RULE`
* In PR description provide example of your suggestion (code before / code after styling by new rule)
* Ask your team to vote For / Against
* If new suggestion wasn't got team approval, just close PR
* If your team approved changes, merge PR

#### How to apply

To apply code style rules in `Rider` from `.editorconfig` to old code:

* Open menu `Code`\\`Code cleanup`
* Select `Code cleanup scope`
* Pick `Code cleanup profile`: `Build-in: Reformat & Apply Code Style`

It's great to apply this option for `Uncommitted files` before commit.
That way you can control style in files changed by you.

### Tests

All projects (except projects with Contracts/Models) should be coverted with Unit tests.

Name of test project could have `.Tests` suffix, like
`AccountService.Logic.Tests` for project `AccountService.Logic`.
Also if you have several types of tests, you can use suffixes to separate tests per type: `.UnitTests`, `.IntegrationTests`.

Name of test method should show what test does. Pattern:

```csharp
MethodName_StateUnderTest_ExpectedBehavior
```

Examples: `UpdateUser_ShoudReturnId_WhenUpdatedSuccessfully`, `UpdateUser_ThrowsAgrumentException_WhenIdLess1`.

Each test method should have sections `Arrange`, `Act`, `Assert` (could be united/omitted).
These comment words could be provided:

```csharp
public async Task UpdateUser_ShoudReturnId_WhenUpdatedSuccessfully()
{
    // Arrange
    var model = { id = 1, userName = "Bob" };

    // Act
    var result = await _userService.Update(model);

    // Assert
    Assert.Equal(1, result);
}
```

```csharp
public async Task UpdateUser_ThrowsAgrumentException_WhenIdLess1()
{
    // Arrange
    var model = { id = -9, userName = "Bob" };

    // Act + Assert
    await Assert.ThrowsAsync<ArgumentException>(async () =>
    {
        await _userService.Update(model);
    });
}
```
