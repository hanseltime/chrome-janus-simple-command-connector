# Developing

## OS's

Currenlty, given the use of bash and suggested use of things like nvm, we recommend that you 
develop for this project on a Unix machine.

## Package manager

This repository expects (yarn 1)[https://classic.yarnpkg.com/en/] as it's package management tool.

## Minimum Node Development Version

We require that you keep the specified Node version for your development tools in this repo.
Please check the "engines" field in package.json

It is highly recommended that you manage node versions using (nvm)[https://github.com/nvm-sh/nvm]

## Development Branching strategy

This repo follows a git-flow style of feature development.  With wemantic-release as our release tool,
we can take advantage of 3 main branches:

* main - source of truth for prod
* develop - aggregate location where final and locally tested features go to be aggregated
* rc - This is synced with develop during release cycles and represents a release candidate

Some of the nuances of git-flow that you should remember are:

* If you are going into develop, pull from develop and merge to develop
* If you are fixing a bug in the rc, pull from rc so you don't get new features from develop
* If you are hot-fixing a bug in main, pull from main for the same reason

## Commit Messages

This project uses (Angular Commit Linting)[https://www.npmjs.com/package/@commitlint/config-angular]

In order to facillitate auto-changelog and auto-versioning, we enforce that you have
to write valid commits. If you are failing to commit, please refer to the console errors
to better understand what is allowed.

### Example:

```
feat: a bread machine
```

## Linting

This project uses prettier and eslint together to enforce formatting and javascript rules. If you have an
IDE that can auto-format off of prettier, it is recommended that you configure it, or at the very least
enable eslint for your IDE. All prettier formatting errors will show then and you can auto-format in most
IDES.

## Testing

This project uses Jest for it's testing. To avoid any combined concerns, we provide separate files for
integration tests and unit tests.

- myFile.spec.unit.ts

  - **Priority** - These are much more important to write if pressing up against scope

  - Unit tests should mock ALL interfaces for the file under test. Expect that there will be no connection
    to any external system.

- myFile.spec.int.ts

  - Integration tests that need to be connected to an integrated system. These will be much more custom
    and will involve updating the jest.int.config.js and related start-up files to ensure that the integration
    is set up safely.

## Running Locally

For faster local running of scripts, we use ts-node due to it's 1 step process to running data.

```sh
yarn dev-run <your file location in .ts>
```

### For Production

In production, there is an efficiency case to be made for compiling to the dist/ folder with .js files.
This will containerize much better as well. In this instance, we provide a command for running any
node scripts with just node.

```sh
yarn build # build the typescript
yarn prod-run <your file location in .ts>
```

# Locally developing this repository AND another local library

If you have the need to locally develop and test one library that is imported into another,
you can make use of the (janus-develop-registry)[https://github.com/JanusHealthInc/janus-develop-registry].

By pulling this repo and running the server start command, you can then switch to a local npm registry that
will allow all @janushealth/ scoped packages to be published to the local registry.  It will also proxy all other packages from the npm registry.

## Commands for local registry

### set the local registry for all yarn installs/npm pulls
```sh
yarn use-local-registry
```

__IMPORTANT:__ You cannot commit your yarn.lock if you install packages through this.  It will reference the
localhost registry. We have a commit hook that will stop you.  When you find it, please do:

```sh
# revert the yarn.lock file
yarn use-normal-registry
yarn
```

This will update the lock file for all regular registry packages.

### publish to the local registry after connecting to the local registry
```sh
yarn publish-local
```

### Change back to the normal registry
```sh
yarn use-normal-registry
```

## Develop Tools

- commitlint
  - For enforcing commit message format
- husky
  - For applying git hooks to guard against commits that would cause problems
- semantic-release
  - For auto-versioning, change-log, commit, and package publish
- jest (with ts-jest)
  - For running integration and unit tests
- eslint
  - For enforcing best practices with EcmaScript syntax
- prettier
  - For enforcing standard formatting across all commits in this repo
- source-map-support
  - Used for standardized stack trace outputs
