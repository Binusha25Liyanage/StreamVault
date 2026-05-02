# StreamVault Setup Guide

## Quick Start

### 1. Initial Setup

```bash
# Navigate to project
cd StreamVault

# Install dependencies (already done, but for reference)
npm install --legacy-peer-deps

# Verify TypeScript configuration
# Already configured in tsconfig.json
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at `http://localhost:8000`
- API docs: `http://localhost:8000/docs` (Swagger UI)
- Health check: `http://localhost:8000/health`

### 3. Running the Mobile App

#### Android
```bash
npx react-native run-android
```

#### iOS
```bash
npx react-native run-ios
```

### 4. Configuration

1. **Get your PC's local IP:**
   - Windows: `ipconfig` → IPv4 Address
   - Mac/Linux: `ifconfig` → inet address

2. **Configure in App:**
   - Open Settings screen
   - Update "Server URL" to `http://<your-ip>:8000`
   - Click "TEST CONNECTION" to verify

## Architecture Overview

### Frontend (React Native)
- **Navigation**: React Navigation (Stack + Tabs)
- **State**: Zustand + MMKV
- **Download**: react-native-blob-util
- **Video**: react-native-video
- **UI**: React Native + react-native-svg

### Backend (FastAPI)
- **Video Extraction**: yt-dlp
- **API**: FastAPI with CORS
- **Rate Limiting**: slowapi
- **Video Format Detection**: Automatic

### Data Flow

```
User Input (URLInputBar)
    ↓
API Call (youtubeApi.fetchVideoInfo)
    ↓
Format Selection (VideoPreviewScreen)
    ↓
Download Queue (useDownload hook)
    ↓
File Saved (FileManager)
    ↓
Gallery Access (Camera Roll)
```

## File Organization

### Key Files to Know

- `App.tsx` - Entry point
- `src/navigation/RootNavigator.tsx` - App navigation structure
- `src/store/downloadStore.ts` - Download state management
- `src/store/settingsStore.ts` - Settings & preferences
- `src/api/youtubeApi.ts` - Backend API client
- `src/hooks/useDownload.ts` - Download engine logic
- `src/theme/` - Design system (colors, typography, spacing)

### Component Structure

```
components/
├── common/          # Reusable across app
├── home/           # HomeScreen specific
├── downloads/      # DownloadsScreen specific
├── preview/        # VideoPreviewScreen specific
└── player/         # VideoPlayerScreen specific
```

## Environment Variables

No .env file needed. All configuration is in-app:
- Server URL → Settings screen
- Download quality → Settings screen
- Download location → FileManager utility

## Troubleshooting Common Issues

### App won't start
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install --legacy-peer-deps
npx react-native start --reset-cache
npx react-native run-android  # or run-ios
```

### Backend connection fails
- Verify backend is running: `curl http://<your-ip>:8000/health`
- Check firewall settings
- Ensure both devices on same network
- Try restarting backend

### Video download fails
- Check server URL in Settings
- Verify YouTube URL is valid
- Ensure app has storage permissions
- Check available disk space

### Permission issues
```bash
# Android - grant permissions manually:
adb shell pm grant com.streamvault android.permission.READ_MEDIA_VIDEO
adb shell pm grant com.streamvault android.permission.WRITE_EXTERNAL_STORAGE
```

## Building for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk
```

### iOS App
```bash
cd ios
xcodebuild -scheme StreamVault -configuration Release -derivedDataPath build
```

## Performance Tips

1. Limit concurrent downloads (default: 2)
2. Use WiFi-only mode for large files
3. Clear completed downloads periodically
4. Restart app if memory usage increases

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:8000/health

# Get video info
curl -X POST http://localhost:8000/video-info \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Get stream URL
curl -X POST http://localhost:8000/stream-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "format_id": "22"}'
```

### Using Python

```python
import requests

api = "http://localhost:8000"

# Get video info
r = requests.post(f"{api}/video-info", 
                  json={"url": "https://www.youtube.com/watch?v=..."})
print(r.json())

# Get stream URL
r = requests.post(f"{api}/stream-url",
                  json={"url": "...", "format_id": "22"})
print(r.json())
```

## Next Steps

1. ✅ Install and run the app
2. ✅ Configure backend URL
3. ✅ Test video downloading
4. ✅ Try offline playback
5. ✅ Explore settings and personalization

## Support

- Check the main `README.md` for detailed documentation
- Review `backend/README.md` for API details
- Check console logs for debugging: `npx react-native log-android` or `npx react-native log-ios`

## Remember

- **Internet Required**: Only for fetching video metadata and streaming initially
- **Offline Playback**: Videos play completely offline once downloaded
- **Storage**: Downloaded files stored in app-specific directory
- **Privacy**: No data sent except to your backend server
