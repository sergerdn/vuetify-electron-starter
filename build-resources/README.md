# Build Resources

This directory contains resources needed for building the Windows Electron application.

## Configuration

The project is configured for **Windows-only** builds without installers:

- Target: Directory output (unpacked application)
- Architecture: x64
- No installer packages (NSIS, MSI, etc.)
- Portable application format
- **Icon integration**: Automatically uses `icon.ico` for the Windows executable

## Application Icon

### Current Icon

- `v-logo.ico` - Official Vuetify logo converted to Windows ICO format (active)
- `v-logo.svg` - Original Vuetify logo source file (for reference)

### Icon Requirements

For optimal results, your Windows icon should:

- **Format**: ICO file format
- **Size**: Multiple sizes embedded (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
- **Color depth**: 32-bit with an alpha channel for transparency
- **File size**: Typically 50–200 KB for multi-size ICO files

### Creating Professional Icons

#### Option 1: Online Converters (Quick)

1. Create a high-resolution PNG (1024x1024 pixels)
2. Use online converters:

- [icoconvert.com](https://icoconvert.com/)
- [convertio.co](https://convertio.co/png-ico/)
- [favicon.io](https://favicon.io/favicon-converter/)

3. Download the ICO file and replace `build-resources/icon.ico`

#### Option 2: Professional Tools

- **Adobe Photoshop**: Export as ICO with multiple sizes
- **GIMP**: Free alternative with ICO export plugin
- **IcoFX**: Dedicated icon editor for Windows

#### Option 3: Command Line Tools

```bash
# Using ImageMagick (if installed)
magick convert icon-source.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# Using electron-icon-builder
npm install -g electron-icon-builder
electron-icon-builder --input=icon-source.png --output=build-resources --flatten
```

### Icon Integration

The icon is automatically integrated into the build process:

- **Windows executable**: Uses the icon for the .exe file
- **File explorer**: Shows the icon in Windows Explorer
- **Taskbar**: Displays the icon in the Windows taskbar
- **Alt+Tab**: Shows the icon in the application switcher

### Testing Your Icon

After replacing the icon file:

```bash
# Build the application
npm run electron:build

# Check the executable in dist-electron/win-unpacked/
# The .exe file should display your custom icon
```

### Quick Setup (Development)

For immediate development with a basic icon:

```bash
# Copy the existing favicon as a placeholder
copy public\favicon.ico build-resources\icon.ico

# Build to see the icon in action
npm run electron:build
```

## Code Signing (Optional)

For production builds with code signing, set these environment variables:

```bash
set CSC_LINK=path-to-certificate.p12
set CSC_KEY_PASSWORD=certificate-password
```

## Auto-Updater (Optional)

Auto-updater functionality can be added later if needed:

- Install `electron-updater` package
- Configure GitHub releases for update distribution
- Add update checking logic to the main process
- Implement update UI in renderer process

## Build Output

The build process creates:

- `dist-electron/{version}/win-unpacked/` - Unpacked Windows application (e.g., `dist-electron/0.0.1/win-unpacked/`)
- `dist-electron/{version}/builder-effective-config.yaml` - Build configuration used
