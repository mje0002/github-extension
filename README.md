# Github Chrome Extension App

![build](https://github.com/mje0002/github-extension/workflows/build/badge.svg)

Chrome Extension, TypeScript and Visual Studio Code

This extension was created to simplify the process of finding pull requests within repositories you actively contribute to. While GitHub's Notification page is available, it can be cumbersome to navigate, especially when involved in multiple repositories. This extension streamlines the experience by removing unnecessary clutter and transforming it into a more user-friendly Chrome extension.

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Option

* [Visual Studio Code](https://code.visualstudio.com/)

## Includes the following

* TypeScript
* Webpack
* React
* Jest
* Example Code
    * Chrome Storage
    * Options Version 2
    * content script
    * background

## Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```
npm install
```

## Import as Visual Studio Code project

...

## Build

```
npm run build
```

## Build in watch mode

### terminal

```
npm run watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

1. Clone Repo
2. npm install
3. npm run build
4. Access Chrome Extensions Settings
> Open your Google Chrome browser and click on the three vertical dots in the top-right corner to access the Chrome menu. From the menu, select “Settings.”
5. Navigate to Extensions
> In the Chrome settings, scroll down and click on the “Extensions” option located in the left-hand sidebar. Alternatively, you can directly enter the following URL in the address bar: chrome://extensions/
6. Enable Developer Mode
> Once you are on the Extensions page, toggle on the “Developer mode” switch located in the top-right corner. This will enable advanced options for testing and loading unpacked extensions.
7. Load the Unpacked Extension
> After enabling Developer mode, three new buttons will appear at the top of the Extensions page. Click on the “LOAD UNPACKED” button.
8. Select /dist Folder
> A file browser window will open. Navigate to the /dist build folder of the extension that you downloaded in Step 1. Select the folder and click “OK” or “Open” to proceed.

## Test
`npx jest` or `npm run test`

## License  
[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)  

