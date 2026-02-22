# crDroid Redbull Device Portal

A static site to display the latest crDroid releases for the Google Pixel Redbull device tree:
- Pixel 4a 5G (bramble)
- Pixel 5 (redfin)
- Pixel 5a (barbet)

## Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the \`main\` branch.

## Data Source

The site dynamically fetches release data directly from the official [crDroid OTA repository](https://github.com/crdroidandroid/android_vendor_crDroidOTA) using the GitHub raw content API.
