[![REUSE status](https://api.reuse.software/badge/github.com/SAP/crossplane-provider-docs)](https://api.reuse.software/info/github.com/SAP/crossplane-provider-docs)

# Crossplane Provider Documentation

## About this project

This repository is the **central place for all Crossplane providers documentation** that are related to this project, built and hosted as a static website (powered by [Docusaurus](https://docusaurus.io/)).

**Provider-specific documentation lives in the individual provider repositories** and is pulled into this repo as Git submodules. Shared documentation that is relevant across all providers — such as contribution guidelines, setup instructions, and architectural concepts — lives directly in this repository.

The documentation site is automatically built and deployed via GitHub Actions on every merge to `main`.

## Crossplane Providers

| Provider Name | Description | Repo Link | Backlog Link | Bug? Feature? |
| --- | --- | --- | --- | --- |
| crossplane-provider-btp | Crossplane Provider for SAP BTP | [Repo](https://github.com/SAP/crossplane-provider-btp) | [Backlog](https://github.com/SAP/crossplane-provider-btp/issues) | [Create a new issue](https://github.com/SAP/crossplane-provider-btp/issues/new/choose) |
| crossplane-provider-hana | Crossplane Provider for SAP HANA | [Repo](https://github.com/SAP/crossplane-provider-hana) | [Backlog](https://github.com/SAP/crossplane-provider-hana/issues) | [Create a new issue](https://github.com/SAP/crossplane-provider-hana/issues/new/choose) |
| crossplane-provider-cloudfoundry | Crossplane Provider for Cloud Foundry | [Repo](https://github.com/SAP/crossplane-provider-cloudfoundry) | [Backlog](https://github.com/SAP/crossplane-provider-cloudfoundry/issues) | [Create a new issue](https://github.com/SAP/crossplane-provider-cloudfoundry/issues/new/choose) |

## Powerful Helpers

In addition to the providers, there are also other repositories related to this project. These repositories most often originated from a specific pain point identified during the process of creating and maintaining the providers.

One great example is [xp-clifford](https://github.com/SAP/xp-clifford), a Crossplane Provider Export CLI framework for resource data extraction. It makes it easy to build a CLI tool that can export definitions of external resources in the format of a specific Crossplane Provider's managed resource definitions.

All our powerful helpers that make your life easier can be found in the list below. If you are interested in contributing to one of them, please check out the respective repository and get in touch.

| Helper Name | Description | Repo Link | Backlog Link | Bug? Feature? |
| --- | --- | --- | --- | --- |
| xp-clifford | Crossplane Provider Export CLI framework for resource data extraction | [Repo](https://github.com/SAP/xp-clifford) | [Backlog](https://github.com/SAP/xp-clifford/issues) | [Create a new issue](https://github.com/SAP/xp-clifford/issues/new/choose) |

## Requirements and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### Clone the repository (including submodules)

The provider documentation is included as Git submodules. Use `--recurse-submodules` to fetch all submodule content in one step:

```bash
git clone --recurse-submodules https://github.com/SAP/crossplane-provider-docs.git
```

If you already cloned the repo without submodules, initialize and fetch them with:

```bash
git submodule update --init --recursive
```

To pull the latest changes including all submodules:

```bash
git pull --recurse-submodules
```

### Install dependencies

```bash
npm install
```

### Start local development server

```bash
npm start
```

This starts a local dev server at `http://localhost:3000` and opens the browser automatically. Most changes are reflected live without restarting the server.

### Dark Mode: Images with light background (`:::image-light`)

Some diagrams or screenshots have a transparent or white background and become hard to read in dark mode. Wrap them with the `:::image-light` directive to automatically add a subtle light background behind the image in dark mode.

**Usage in MDX/Markdown:**

```mdx
:::image-light
![Architecture overview](/img/contribution/Picture.png)
:::
```

**What it does:**

- Adds a `rgba(255, 255, 255, 0.9)` background behind the image
- Adds `8px` padding and rounded corners (`border-radius: 8px`)
- Works in both light and dark mode
- Does **not** affect logos, icons, or the Axolotl mascot (these are excluded by default from the global dark-mode image rule)

**When to use it:**

Use `:::image-light` for screenshots, architecture diagrams, or any image that has a transparent or near-white background and looks broken/invisible in dark mode.

### Build

```bash
npm run build
```

Generates the static site into the `build/` directory.

### Serve the built site locally

```bash
npm run serve
```

## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/crossplane-provider-docs/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Security / Disclosure
If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/SAP/crossplane-provider-docs/security/policy) on how to report it. Please do not create GitHub issues for security-related doubts or problems.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2026 SAP SE or an SAP affiliate company and crossplane-provider-docs contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/crossplane-provider-docs).
