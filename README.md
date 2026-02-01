# JS Injector Chrome Extension

A premium, modern Chrome extension that allows you to inject custom JavaScript snippets into any website using Regex-based URL matching.

## Features

- ✨ **Modern UI**: Sleek dark-mode dashboard built with React and Tailwind CSS 4.
- 🔍 **Regex Matching**: Flexible URL targeting using regular expressions.
- 🚀 **Main World Injection**: Scripts run in the page's execution context, allowing access to site variables.
- 💾 **Safe Storage**: Automatically syncs your rules across devices.
- 🎨 **Preview & Edit**: Full control over your script collection with easy toggles and editing.

## Installation Instructions

Follow these steps to load the extension into your Chrome browser:

### 1. Build the Project

Open your terminal in the project directory and run:

```bash
npm install
npm run build
```

This will generate a `dist` folder containing the compiled extension files.

### 2. Load into Chrome

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** using the toggle switch in the top-right corner.
3.  Click the **Load unpacked** button.
4.  Select the `dist` folder located at:
    `D:\Gopi\projects\js-injector-ext\dist`

## Configuration & Usage

### Adding a New Rule

1. Click the **JS Injector** icon in your extension bar.
2. Click **Add New Rule** (or click the settings icon to open the full dashboard).
3. Fill in the following details:
    - **Name**: A descriptive name for your script (e.g., "Kite Dark Mode Fix").
    - **URL Pattern**: A Regex pattern to match URLs (e.g., `^https://kite\.zerodha\.com/.*`).
    - **Script Content**: The raw JavaScript you want to inject.
4. Click **Save injected script**.

### Managing Rules

- **Toggle**: Use the switch/circle icon to enable or disable a rule without deleting it.
- **Edit**: Click the pencil icon to modify the name, pattern, or script.
- **Delete**: Click the trash icon to permanently remove a rule.

## Important Notes on CSP

This extension uses a secure message-based injection system via a background worker. This avoids most common Content Security Policy (CSP) errors. If a site still blocks your script, it is likely due to an extremely restrictive `script-src` directive that excludes even Object URLs.

## Tech Stack

- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4 + Lucide Icons
- **Language**: TypeScript
- **API**: Chrome Extension Manifest V3 (Scripting & Storage APIs)
