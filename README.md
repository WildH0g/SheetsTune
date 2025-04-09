# SheetsTuner

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)

SheetsTuner is a Google Sheets container-bound script that allows you to fine-tune LLMs (Large Language Models) on Vertex AI directly from your spreadsheet.

## Overview

SheetsTuner simplifies the process of creating, managing, and uploading training datasets for fine-tuning language models. It leverages Google Sheets as an intuitive interface for preparing your data and Google Cloud Storage for storing the datasets.

## Features

- Create training and validation datasets directly in Google Sheets
- Automatically split your data into training, validation, and test sets
- Export datasets in JSONL format required for fine-tuning
- Upload datasets to Google Cloud Storage buckets
- Call fine-tuned models directly from your spreadsheet

## Built With

This project is built with [Apps Script Engine](https://github.com/WildH0g/apps-script-engine-template), a modern development environment for Google Apps Script that enables the use of modern JavaScript features, modules, and build tools.

For a detailed explanation of the technique used in this project, check out this blog post: [How Apps Script Became the Ultimate LLM Fine-Tuning Tool](https://medium.com/itnext/how-apps-script-became-the-ultimate-llm-fine-tuning-tool-a8e91de9f2f5?sk=ed5a7b4dab97346629632d9f506af877)

## Getting Started

### Prerequisites

- Google account
- Google Cloud Platform project with enabled APIs:
  - Google Sheets API
  - Google Cloud Storage API
- Service account with appropriate permissions

### Installation

1. Clone this repository
2. Install dependencies:
   ```sh
   npm i && npm run install:husky
   ```

## Development

### Running the local dev server with Vite

Run the Vite server and the Tailwind server in parallel in different terminal windows:

```sh
# Vite server
npm run dev
```

```sh
# Tailwind server
npm run build:css:watch
```

### Formatting

The `npm run format` will run linting and pretty-printing with the `--fix` and `--write` options.

### Managing Environments

This project is set up to be deployable to separate Google Apps Script projects acting as different environments. It works by copying relevant environmental files like `.clasp.json` from `env-mgt/<environment_name>` to the specified path (the root by default). Any number of files can be added to each environment. Configure the environment in the `env-mgt/ENV.js` file.

### Building and deploying

To build the app for production, run:

```sh
npm run build:ui # to build the client-side
npm run build:gas # to build Google Apps Script library code
```

Or, if you want to build then push, run:

```sh
npm run build:push
```

The Apps Script code will be stored in a variable that executes an IIFE `lib` by default. Hence, to call an exported function from the bundled Apps Script code use `lib.<functionName>(args)` syntax.

### Run tests

```sh
npm t
```

### Git hooks

If you ran `npm run install:husky`, you will have configured a `pre-commit` git hook. Every time you commit your code, it will run formatting and testing by executing `npm run format && npm t`.

## Author

👤 **Dmitry Kostyuk**

- Website: https://www.wurkspaces.dev
- Github: [@WildH0g](https://github.com/WildH0g)
- LinkedIn: [@dmitrykostyuk](https://linkedin.com/in/dmitrykostyuk)
- StackOverflow: [Dmitry Kostyuk](https://stackoverflow.com/users/13229211/dmitry-kostyuk)

## Show your support

Give a ⭐️ if this project helped you!

