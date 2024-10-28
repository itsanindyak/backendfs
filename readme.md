# backendfs

**Easily initialize a backend project structure with dependencies and Git setup using `npx backendfs`**


## Overview

[`backendfs`](https://www.npmjs.com/package/backendfs)is a CLI tool designed to set up a standard backend project structure in Node.js, install essential dependencies, and optionally initialize a Git repository. With this tool, you can quickly get started with a well-organized project structure and install any additional dependencies or devDependencies based on your project's requirements.

  

## Installation 

  

Since [`backendfs`](https://www.npmjs.com/package/backendfs) is an executable CLI tool, you can run it directly using `npx` without needing to install it globally.

  

### Using `npx`


To create your backend project structure, simply run:

`npx backendfs` 

> **Note**: The command on the npm website (`npm i backendfs`) will only install the package but won't execute it directly. For execution, use `npx backendfs`.

### Global Installation

Install globally to use `backendfs` as a persistent command:

First

`npm install -g backendfs`

then

`backendfs` 

> **Note**: The command (`npm i -g backendfs`) only installs the package in globally but won’t execute it directly. For direct execution, use command `backendfs` .

### Features

-   **Automatic Project Setup**: Initializes `package.json` and sets up a structured backend project folder layout.
-   **Customizable Folders**: Prompts you to add additional folders and exclude any default folders if needed.
-   **Dependency Installation**: Choose and install any dependencies or devDependencies as part of the setup process.
- **Nodemon Integration**: Automatically installs Nodemon as a devDependency and sets up a script to run your project, allowing for easy restarts during development.
-   **Git Initialization**: Optionally initializes a Git repository if you pass the `-g` or `--git` flag.
-   **Run Script**: Automatically adds a development script for easy startup with Nodemon.

## Project Structure

Here’s the structure `backendfs` will create for your project:

```
your-project-root
├── package.json
├── .gitignore
├── .env
├── .env.local
└── src
    ├── controllers
    ├── models
    ├── routes
    ├── database
    ├── app.js
    └── index.js
```

## Configuration and Prompts

-   **Folder Creation**: You will be prompted to specify additional folders to create under `src/`.
-   **Dependencies**: The CLI will ask if you'd like to install any additional dependencies and devDependencies. It uses npm's package registry to let you search and select multiple dependencies.
-   **Git Setup**: To initialize a Git repository in the project root, use the `-g` or `--git` flag:

    `npx backendfs -g` 
    

## Example Commands

To set up your project with custom dependencies and Git initialization:

`npx backendfs --git` 

## Contributing

If you'd like to contribute to `backendfs`, feel free to fork this repo and submit a pull request! Issues and suggestions are also very welcome.



