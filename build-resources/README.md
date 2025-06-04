# Build Resources

This directory contains resources needed for building the Electron application.

## Required Icons

To properly build the Electron application for different platforms, you need to provide the following icon files:

### Windows
- `icon.ico` - Windows icon file (256x256 pixels recommended)

### macOS
- `icon.icns` - macOS icon file (512x512 pixels recommended)

### Linux
- `icon.png` - PNG icon file (512x512 pixels recommended)

## Icon Generation

You can generate these icons from a single high-resolution PNG file (1024x1024 pixels) using tools like:

- [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
- [electron-builder-icon-generator](https://www.npmjs.com/package/electron-builder-icon-generator)
- Online converters like [icoconvert.com](https://icoconvert.com/)

## Temporary Icons

For development purposes, you can copy the favicon.ico from the public directory:

```bash
# Windows
copy public\favicon.ico build-resources\icon.ico

# macOS/Linux  
cp public/favicon.ico build-resources/icon.ico
```

Note: The favicon.ico may not be the ideal size/format for all platforms, but it will work for initial builds.
