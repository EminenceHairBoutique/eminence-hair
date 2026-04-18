# Favicon Assets

## Overview
This directory contains favicon assets for the Eminence Hair Boutique website.

## Placeholder Files
Currently, the following PNG files are **placeholders** and need to be replaced with properly branded icons:

- `favicon-16.png` - Small favicon (16×16px)
- `favicon-32.png` - Standard favicon (32×32px)
- `android-chrome-192.png` - Android home screen icon (192×192px)
- `android-chrome-512.png` - Android splash screen icon (512×512px)
- `maskable-512.png` - Adaptive icon for Android (512×512px with safe area)

## Branding Guidelines for Replacement Icons

### Design Requirements
- **Monogram**: "E" monogram or "EH" ligature design
- **Colors**: 
  - Primary: Charcoal #111111
  - Background: Ivory #F9F7F4
- **Aspect Ratio**: 1:1 (square)
- **Style**: Elegant, minimalist, professional

### Safe Area
For the `maskable-512.png` variant (adaptive icon support):
- Use a generous safe area (inner circle of at least 66% of the canvas)
- Design assumes the outer 34% may be masked by various device shapes
- Center the monogram within this safe area

### Required Sizes
Prepare icons at the following dimensions:
- **16×16** - favicon-16.png
- **32×32** - favicon-32.png
- **192×192** - android-chrome-192.png
- **512×512** - android-chrome-512.png (standard Android)
- **512×512** - maskable-512.png (adaptive icon)
- **180×180** - apple-touch-icon.png (separate file in assets)

### Export Settings
- **Format**: PNG with transparency
- **Color Profile**: sRGB
- **Anti-aliasing**: Enabled
- **Optimization**: Compressed (but maintain quality)

## Existing Assets
The following pre-made assets are production-ready:
- `favicon.ico` - Multi-resolution icon file for legacy browsers
- `apple-touch-icon.png` - iOS home screen icon (180×180)

## File References
These assets are referenced in:
- `index.html` - Favicon link tags
- `public/site.webmanifest` - Web app manifest
- `public/favicon.svg` - Modern SVG favicon

## Next Steps
1. Create or update the monogram design
2. Generate PNG files at the required sizes
3. Replace the placeholder files
4. Test favicon display across browsers and devices
5. Verify in the web app manifest and on various platforms
