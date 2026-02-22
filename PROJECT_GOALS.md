# crDroid Redbull - Project Goals & Progress

## 🎯 Project Goals
The goal of this project is to create a modern, user-friendly, and highly functional web portal for the crDroid custom ROM targeted at Google Pixel "Redbull" devices:
*   **Pixel 4a 5G (bramble)**
*   **Pixel 5 (redfin)**
*   **Pixel 5a (barbet)**

### Key Objectives:
1.  **Centralized Hub:** Provide a single, visually appealing place for users to find the latest ROM releases, recovery images, and changelogs.
2.  **Dynamic Updates:** Automatically pull the latest release data from the official `android_vendor_crDroidOTA` repository so the site never needs manual updating when a new build drops.
3.  **Web Flasher:** Implement an in-browser flashing tool leveraging the WebUSB API. This allows users to flash recovery images and sideload the ROM directly from their browser (similar to Android Flash Tool or GrapheneOS Web Installer). It is designed to work around SourceForge CORS limitations by allowing local file selection.
4.  **Zero-Maintenance Hosting:** Host the site statically via GitHub Pages with automated CI/CD deployments.

---

## ✅ What We Have Done So Far

### 1. Core Website & UI
*   Created a fully responsive, dark-themed UI using **Tailwind CSS** that matches the crDroid brand aesthetic.
*   Added animated device cards for Bramble, Redfin, and Barbet.
*   Implemented a clean modal popup system to view device-specific details, preventing page reloads.

### 2. Dynamic Data Integration
*   Built JavaScript logic (`script.js`) to fetch JSON data from the `android_vendor_crDroidOTA` GitHub repository.
*   Integrated live changelog fetching (`_changelog.txt`) and display.
*   Automatically parsed and formatted ROM version, build date, file size, maintainer info, and download links.

### 3. Automated Deployment
*   Created a GitHub Actions workflow (`.github/workflows/static.yml`) to automatically build and deploy the site to GitHub Pages on every push to the `main` branch.

### 4. Web Flasher UI & Foundation
*   Designed a clean, step-by-step Web Flasher interface (`flasher.html`).
*   Implemented the WebUSB device request prompt (`navigator.usb.requestDevice`) in `flasher.js` targeting Android devices (Vendor ID `0x18d1`).
*   Created the state machine and UI logic for a direct-download architecture:
    *   Connecting the device via USB after selecting the target model.
    *   Dynamically fetching the OTA JSON for the target device.
    *   Displaying progress bars for the in-browser download and flashing of `boot`, `dtbo`, and `vendor_boot`.
    *   Displaying progress bars for the in-browser streaming and sideloading of the crDroid `.zip`.

---

## 🚧 Next Steps / Pending Work
*   **Web Flasher Core Integration:** Integrate a library like `@yume-chan/adb` (Tango) to replace the simulated flashing steps in `flasher.js` with actual WebUSB ADB and Fastboot binary commands:
    *   Implement `fetch()` streams to download the images and ROM directly from SourceForge (handling any potential CORS errors if they arise by potentially setting up a proxy/mirror).
    *   Command to reboot the device to bootloader via ADB.
    *   Commands to flash `boot`, `dtbo`, and `vendor_boot` partitions via Fastboot.
    *   Command to stream the 1.4GB+ ROM `.zip` via ADB Sideload using JS Streams (to avoid RAM limitations).
