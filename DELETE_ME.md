# One Time Instructions

These are instructions for just after creating a repository from this template. Please follow these
instructions to make sure that you have working code for your purposes and then delete this file as part
of the initial git commit.

# package.json

- [] Add a correct package name using the @janusHealth scope
- [] Update the description field
- [] Set the repository url to the .git url of your repository
- [] Change the author
- [] Change the license (if applicable)
- [] Update the README with any chagne to config
- [] Update the publish config to point to:
  - Our private npm registry (TBD)
  - The public npm registry (ONLY if janushealth has a public scope)

# typescript

The current default tsconfig will compile all of the src/ folder to dist/ and will use index.ts as the entry point.

# linting/prettier

The default config makes eslint and prettier work together to enforce both formatting and linting.

You can customize prettier via prettier.config.js and the prettier docs

You can customize the eslint rules via .eslintrc.js and the eslint docs

## Run linting:

```
yarn lint
```

## Fix all auto-fixable items

```
yarn lint --fix
```

# Commit format

In order to allow for things like auto-versioning and changelog, we need to standardize on a commit format.
We make use of husky and commitlint to do so.

This repo uses the (angular commit convention)[https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit].

If you would like to change the allowed format, keep in mind that you will need to change it for our auto-versioning as well.

Please see commitlint.config.js

# Auto-versioning and CHANGELOG

As part of our deployment for this repository, we use semantic-release to do auto-versioning, changelog, and in the event of a non-private package, publishing to a registry.

## Preparing your repository for semantic release

### Release Branches

Currently, the release is configured to allow for calls to `yarn release` on main (prod release), develop (develop), and rc (release candidate).

You will need to set up these branches with PR privleges of:

develop -> rc -> main

You may also review (workflow configuration)[https://github.com/semantic-release/semantic-release/blob/master/docs/usage/workflow-configuration.md#workflow-configuration] to suit your needs.

If you change this, please update the README as well.

### Git auto-tagging and committing

The first portion of semantic-release intends to add tags and a commit to the target branch.  Since these target
branches should ALL have branch protections on them, you will need to work with DevOps to provision a semantic-release
user that has "bypass branch protection" permissions.

(Git Authentication)[https://github.com/semantic-release/git#git-authentication]

You will need to store the semantic-release user information in your CI for:

* GIT_AUTHOR_NAME
* GIT_AUTHOR_EMAIL
* GIT_COMMITTER_NAME
* GIT_COMMITTER_EMAIL

### Github auto-release

In order to allow the current config to add releases on github, you will need to work with DevOps to provision
an access token for the repository and store it in the CI environment under GH_TOKEN.

When provisioning the token, you will need to have these permissions:

- Content - Read and Write
- Issues - Read-only
- Metadata - Read-only
- Pull Requests - Read-only

### Npm auto-versioning

If your repo is private, you will automatically get your package.json version incremented with the current build.

### Npm auto-publishing

If you repo is meant to be published (you set up publishConfig and made the package non-private) then you will
want to work with DevOps to generate an access token to either our public or private NPM registry and put it on
the CI environment under NPM_TOKEN

If your library is not meant to be published, please feel free to remove: 

* "types" field from package.json
* "declaration": true from tsconfig.json

## Release Logic testing

If everything if done correctly, you should be able to call this command for a dry-run:

```
yarn release
```

If there is a failure, please review the messaging.

The release command will (when not in dry-run):

1. auto-generate a new semantic version based off of angular commit syntax
2. update the CHANGELOG.md, package.json and commit them
3. tag the branch and commit with the version tag
4. push the commit to github for you
5. publish to the npm repo if that is enabled

# Testing

As a standard, we just Jest for testing. Unlike the simplest jest unit test
set up though, we provide 2 separate jest configurations for:

- unit
- integration

Depending on your project needs, you may remove the integration test. This
configuration is provided by default though in order to prevent developers from
mixing integration tests into unit tests.

Each configuration can be changed separately in their respective files or jointly
by editing the jest.config.base.js.

We also provide an environment variable trigger to automatically open an html report
in a chrome browser for faster review of testing on your local.

```
HTML_REPORT=true yarn int-test

HTML_REPORT=true yarn unit-test
```
