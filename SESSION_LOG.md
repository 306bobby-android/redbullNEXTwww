# redbullNEXT Website Development Session Log

## Overview
This document serves as a record of the AI pair programming session used to create the `redbullNEXT` static website, web flasher, and automated deployment pipeline. 

## Features Developed

### 1. Core Framework & UI
*   **Tailwind CSS:** Bootstrapped `index.html` with a modern, dark-themed UI relying on Tailwind for styling and FontAwesome for icons.
*   **Dynamic Data Integration:** Created `script.js` to automatically parse and render ROM updates using the official JSON data from the `android_vendor_crDroidOTA` repository.
*   **Device Cards & Modal:** Designed interactive hover cards for Bramble, Redfin, and Barbet. Clicking a card opens a modal displaying the latest version, size, date, maintainer, raw changelog text, and a direct download button.

### 2. Branding & Asset Pipeline
*   **redbullNEXT Rebrand:** Rebranded the entire visual aesthetic away from standard crDroid towards the "redbullNEXT" identity.
*   **Color Extraction:** Built a Python script to extract dominant colors from the user-provided `logo.jpg`.
*   **Rainbow Gradient:** Implemented a continuous `linear-gradient` (Red -> Yellow -> Green -> Cyan) across typography, progress bars, and primary buttons based on the logo colors.
*   **Vector Art Integration:** 
    *   Moved generic FontAwesome device icons to custom SVG illustrations (`pixel5.svg`, `pixel5a.svg`, `pixel4a5g.svg`).
    *   Created a custom SVG hero illustration (`pixel-crdroid.svg`) featuring a Pixel 5 rendering with a gradient-colored crDroid logo perfectly centered on the screen.

### 3. Web Flasher Architecture
*   **UI Construction:** Built `flasher.html` as a step-by-step wizard.
*   **Browser Validation:** Added logic to check for the `navigator.usb` API and present a prominent warning if the user is not on a Chromium-based browser (blocking interaction).
*   **Device Connection:** Implemented the `navigator.usb.requestDevice({ filters: [{ vendorId: 0x18d1 }] })` prompt to securely request ADB connections.
*   **Direct Download Transition:** Pivoted the architecture from a manual "file picker" approach to an automated "direct-download" approach (simulated pending CORS checks).
*   **State Machine:** Created the JavaScript logic (`flasher.js`) to handle the UI state transitions between connecting, downloading/flashing recovery partitions, and streaming the ROM payload via ADB sideload.

### 4. CI/CD & Deployment
*   **GitHub Actions:** Configured a `.github/workflows/static.yml` pipeline to automatically deploy the application to GitHub Pages upon every commit to the `main` branch.
