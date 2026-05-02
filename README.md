# StreamVault - YouTube Offline Video Downloader

A complete React Native mobile application for downloading YouTube videos for personal offline use with a premium design system and full-featured video player.

## 🎯 Features

- **YouTube Video Search & Download**: Paste any YouTube URL to fetch and download videos
- **Quality Selection**: Choose from multiple quality options (4K, 1080p, 720p, 480p)
- **Built-in Video Player**: Watch downloaded videos with full controls including skip, playback rate, and landscape orientation
- **Download Management**: Track active, completed, and failed downloads with progress indicators
- **Offline Playback**: Play videos without internet connection
- **Dark Mode UI**: Premium dark theme optimized for low light viewing
- **Server Configuration**: Set custom backend server address in settings
- **Persistent Storage**: All downloads and settings are saved to device storage and survive app restarts

## 📁 Project Structure

```
StreamVault/
├── src/
│   ├── api/                 # API client (youtubeApi.ts)
│   ├── components/
│   │   ├── common/         # Shared UI components
│   │   ├── home/           # Home screen components
│   │   ├── downloads/      # Downloads screen components
│   │   ├── preview/        # Video preview components
│   │   └── player/         # Player components
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # React Navigation setup
│   ├── screens/            # App screens
│   ├── store/             # Zustand stores + MMKV
│   ├── theme/             # Design system
│   └── utils/             # Utilities
├── backend/               # FastAPI server
├── android/              # Android native code
├── ios/                  # iOS native code
└── App.tsx              # Main entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Android SDK (for Android builds)
- Xcode (for iOS builds, macOS only)
- Python 3.8+ (for backend)

### Installation

1. **Clone and setup React Native app:**
   ```bash
   cd StreamVault
   npm install
   ```

2. **Install Python backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the App

**Start the backend:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Run on Android:**
```bash
npx react-native run-android
```

**Run on iOS:**
```bash
npx react-native run-ios
```

**Configuration:**
1. Find your local PC IP address (`ipconfig` on Windows, `ifconfig` on Mac/Linux)
2. In the app Settings screen, update the Server URL to `http://<your-ip>:8000`
3. Test the connection using the "TEST CONNECTION" button

## 🏗️ Architecture

### State Management
- **Zustand** for app state (downloads, settings)
- **MMKV** for persistent storage
- Stores auto-hydrate on app startup

### Download Engine
- **react-native-blob-util** for file downloads
- **@react-native-camera-roll/camera-roll** for saving to gallery
- Concurrent download support with configurable limits

### Video Player
- **react-native-video** for playback
- Full gesture controls (skip, brightness, volume)
- Landscape orientation support

### API Layer
- Axios-based client
- Automatic server URL configuration from settings
- Error handling with retries

## 📱 Screens

1. **SplashScreen**: Animated splash with app branding
2. **HomeScreen**: URL input, download queue, and recent downloads
3. **VideoPreviewScreen**: Video details and format selection before download
4. **DownloadsScreen**: View all downloads with filters and status tracking
5. **VideoPlayerScreen**: Full-featured video player
6. **SettingsScreen**: Server configuration, download preferences, app info

## 🎨 Design System

- **Color Palette**: Dark theme with Cherry Alloy accents (#C0392B)
- **Typography**: Configurable font sizes and weights
- **Spacing**: Consistent spacing scale (xs-xxl)
- **Components**: Reusable UI components (buttons, cards, loaders)

## 🔧 Backend API

### Endpoints

- `GET /health` - Health check
- `POST /video-info` - Get video information and formats
- `POST /stream-url` - Get streaming URL for a format

### Requirements
- FastAPI
- yt-dlp (YouTube extraction)
- uvicorn
- slowapi (rate limiting)

## 📋 Key Dependencies

```json
{
  "@react-navigation/native": "Stack & Tab navigation",
  "react-native-video": "Video playback",
  "react-native-blob-util": "File downloads",
  "zustand": "State management",
  "axios": "HTTP client",
  "react-native-mmkv": "Persistent storage",
  "@shopify/flash-list": "High-performance lists",
  "react-native-permissions": "Permission handling",
  "react-native-orientation-locker": "Landscape orientation",
  "react-native-fast-image": "Image caching",
  "react-native-linear-gradient": "Gradients",
  "react-native-haptic-feedback": "Haptic feedback"
}
```

## 🔐 Permissions

### Android
- `INTERNET`
- `READ_MEDIA_VIDEO` (Android 13+)
- `READ_EXTERNAL_STORAGE` (Android < 13)
- `WRITE_EXTERNAL_STORAGE` (Android < 13)
- `FOREGROUND_SERVICE`

### iOS
- `NSPhotoLibraryAddUsageDescription` - Save videos to library
- `NSPhotoLibraryUsageDescription` - Access photo library

## 📝 Development Notes

- Use TypeScript for type safety
- Theme values defined in `src/theme/` - never hardcode colors/spacing
- Components are organized by feature (screens use specific component folders)
- Stores use MMKV for persistence and auto-hydrate on startup
- Error boundaries wrap the entire app for better error handling

## 🐛 Troubleshooting

**Backend Connection Failed**
- Ensure backend is running: `uvicorn main:app --host 0.0.0.0 --port 8000`
- Check server URL in Settings matches your PC IP
- Ensure phone and PC are on same WiFi network

**Permissions Denied**
- Grant permissions when prompted
- Check device settings if problems persist
- iOS: Settings > StreamVault > Photos

**Video Won't Play**
- Ensure file downloaded successfully (check Downloads screen)
- Verify video format is compatible
- Try a different video format in settings

## 📦 Building for Production

**Android:**
```bash
cd android
./gradlew bundleRelease
```

**iOS:**
```bash
cd ios
xcodebuild -scheme StreamVault -archivePath build/StreamVault.xcarchive archive
```

## 📄 License

Created for personal use only. YouTube videos should only be downloaded for personal offline viewing in accordance with YouTube's terms of service.

## ✨ Built with Premium High Fidelity

StreamVault combines a sleek dark UI, efficient video handling, and offline-first design for the ultimate offline video viewing experience.
