# StreamVault - YouTube Offline Video Downloader

A complete, production-ready React Native mobile application for downloading YouTube videos for personal offline use with a premium design system, full-featured video player, and powerful backend API.

## 🎯 Features

- **YouTube Video Search & Download**: Paste any YouTube URL to fetch and download videos in multiple formats
- **Quality Selection**: Choose from multiple quality options (4K, 1080p, 720p, 480p, and more)
- **Built-in Video Player**: Watch downloaded videos with full controls including skip, playback rate, and landscape orientation
- **Download Management**: Track active, completed, and failed downloads with real-time progress indicators
- **Offline Playback**: Play videos completely offline without internet connection
- **Dark Mode UI**: Premium dark theme optimized for low light viewing with consistent design system
- **Server Configuration**: Set custom backend server address in settings
- **Persistent Storage**: All downloads and settings are saved to device storage and survive app restarts
- **Download History**: Filter downloads by status (all, completed, downloading, failed)
- **Concurrent Downloads**: Manage multiple simultaneous downloads with configurable limits
- **Permission Handling**: Android 13+ aware permission system with graceful degradation

## 📁 Project Structure

```
StreamVault/
├── src/
│   ├── api/
│   │   └── youtubeApi.ts           # Axios client for backend communication
│   ├── components/
│   │   ├── common/                 # Reusable components across app
│   │   │   ├── AppHeader.tsx
│   │   │   ├── URLInputBar.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── home/
│   │   ├── downloads/
│   │   ├── preview/
│   │   └── player/
│   ├── hooks/
│   │   ├── useDownload.ts           # Download engine and queue management
│   │   └── useVideoPlayer.ts        # Video player state and controls
│   ├── navigation/
│   │   ├── RootNavigator.tsx        # Stack navigation (Splash → MainTabs → Details)
│   │   ├── TabNavigator.tsx         # Bottom tab navigation
│   │   └── types.ts                 # TypeScript navigation types
│   ├── screens/
│   │   ├── SplashScreen.tsx         # Animated splash with gradient
│   │   ├── HomeScreen.tsx           # URL input, queue, recent downloads
│   │   ├── VideoPreviewScreen.tsx   # Video info, format grid, download button
│   │   ├── DownloadsScreen.tsx      # FlashList of downloads with filters
│   │   ├── VideoPlayerScreen.tsx    # Full-featured video player
│   │   ├── SettingsScreen.tsx       # Server config, preferences, app info
│   │   └── PlayerScreen.tsx         # Player tab placeholder
│   ├── store/
│   │   ├── downloadStore.ts         # Zustand + MMKV for download state
│   │   └── settingsStore.ts         # Zustand + MMKV for app settings
│   ├── theme/
│   │   ├── colors.ts                # Color palette (dark theme, Cherry Alloy accents)
│   │   ├── typography.ts            # Font sizes, weights, line heights
│   │   ├── spacing.ts               # Spacing scale (xs-xxl)
│   │   └── index.ts                 # Theme export hub
│   └── utils/
│       ├── formatUtils.ts           # Duration, fileSize, date formatting
│       ├── permissions.ts           # Permission requests (Android 13+ aware)
│       └── fileManager.ts           # File operations, gallery saving
├── backend/
│   ├── main.py                      # FastAPI server with yt-dlp integration
│   ├── requirements.txt             # Python dependencies
│   └── README.md                    # API documentation
├── android/
│   ├── app/src/main/AndroidManifest.xml
│   └── [other Android config]
├── ios/
│   ├── StreamVault/Info.plist
│   └── [other iOS config]
├── App.tsx                          # Main entry point with store hydration
├── tsconfig.json                    # TypeScript strict mode config
├── metro.config.js                  # React Native bundler config
├── package.json                     # npm dependencies
├── README.md                        # This file
├── SETUP.md                         # Installation guide
└── DEVELOPER.md                     # Developer quick reference
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Android SDK (for Android builds)
- Xcode (for iOS builds, macOS only)
- Python 3.8+ (for backend)
- Android emulator or physical device

### Installation

1. **Clone and setup React Native app:**
   ```bash
   cd StreamVault
   npm install --legacy-peer-deps
   ```

2. **Install Python backend:**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
   pip install -r requirements.txt
   ```

### Running the App

**Terminal 1 - Start the backend:**
```bash
cd StreamVault/backend
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
# Then run:
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Start React Native dev server:**
```bash
cd StreamVault
npx react-native start
```

**Terminal 3 - Run on Android:**
```bash
cd StreamVault
npx react-native run-android
```

**Or run on iOS:**
```bash
npx react-native run-ios
```

**Configuration:**
1. Find your local PC IP address (`ipconfig` on Windows, `ifconfig` on Mac/Linux)
2. In the app Settings screen, update the Server URL to `http://<your-ip>:8000`
3. Test the connection using the "TEST CONNECTION" button

## 📱 Screens (Detailed)

### 1. **SplashScreen** (`src/screens/SplashScreen.tsx`)
- Animated splash screen with radial gradient background (#1a0805 to #0D0D0D)
- Rotating icon with opacity and scale animations
- App title "STREAMVAULT" with letter spacing
- Tagline "Your media, offline."
- Auto-navigates to MainTabs after 2.5 seconds

### 2. **HomeScreen** (`src/screens/HomeScreen.tsx`)
- **AppHeader Component**: Logo, settings icon, avatar
- **URLInputBar Component**: YouTube URL input with paste functionality
- **Download Queue Section**: Shows currently downloading videos with progress
- **Recent Downloads Carousel**: Horizontal scroll of 5 latest completed downloads
- **Error Display**: Shows validation or network errors
- **Empty State**: Helpful message when no videos available
- **Features**: 
  - URL validation and paste from clipboard
  - Real-time download progress tracking
  - Navigation to VideoPreviewScreen on successful fetch
  - Navigation to VideoPlayerScreen for playing completed videos

### 3. **VideoPreviewScreen** (`src/screens/VideoPreviewScreen.tsx`)
- **Video Thumbnail**: 16:9 aspect ratio with play icon overlay and duration badge
- **Channel Info Section**: Avatar, name, subscriber count, SUBSCRIBE button
- **Video Metadata**: View count, upload date
- **Format Selection Grid**: 2x2 grid of available formats
  - Shows resolution, codec, file size for each format
  - Highlights selected format with border and background
- **Sticky Download Button**: "DOWNLOAD NOW" button at bottom
- **Features**:
  - Scrollable format list for videos with many options
  - Quality badge indicator (4K, 1080p, etc.)
  - File size display for each format
  - Download initiates with automatic format tracking

### 4. **DownloadsScreen** (`src/screens/DownloadsScreen.tsx`)
- **AppHeader**: Consistent header with settings
- **Filter Pills**: Tabs for All / Completed / Downloading / Failed
- **FlashList Rendering**: High-performance list with 100+ downloads support
- **Download Items** display:
  - Thumbnail image
  - Title, format, and file size
  - Status indicator (queued/downloading/completed/failed)
  - Progress bar for active downloads (0-100%)
  - "COMPLETED" badge for finished downloads
  - "FAILED" badge with retry button for failed downloads
  - Speed display while downloading
  - Tap to play completed video
- **Empty State**: Message when no downloads in selected filter

### 5. **VideoPlayerScreen** (`src/screens/VideoPlayerScreen.tsx`)
- **Video Component**: react-native-video with full playback
- **Landscape Support**: Automatically locks to landscape on open
- **Control Overlay**:
  - Header: Back button + video title
  - Center Buttons: Skip back 10s / Play-Pause / Skip forward 30s
  - Bottom Scrubber: Progress bar with current/total time
  - Auto-hide controls after 3 seconds of inactivity
- **Features**:
  - Seek support with scrubber
  - Playback rate control
  - Volume and brightness gestures
  - Restores portrait orientation on back

### 6. **SettingsScreen** (`src/screens/SettingsScreen.tsx`)
- **Server Configuration Section**:
  - Text input for custom server URL
  - "TEST CONNECTION" button with status indicator (green online/red offline)
  - Connection status dot display
- **Quality Settings**: Chip selector for 4K / 1080p / 720p / 480p
- **WiFi-Only Toggle**: Download only on WiFi networks
- **Concurrent Downloads Stepper**: Adjust max parallel downloads (±/number/+)
- **About Section**: App version and tagline
- **Features**:
  - Real-time connection testing with visual feedback
  - Settings persist to MMKV automatically
  - Input validation for server URL
  - All changes instantly update app behavior

### 7. **PlayerScreen** (`src/screens/PlayerScreen.tsx`)
- Placeholder screen for the Player tab
- Message: "Player - No video loaded"
- Accessible from bottom tab navigation

## 🧩 Components

### Common Components (`src/components/common/`)

#### **AppHeader.tsx**
```typescript
// Props: none (uses navigation, settings store)
// Features:
// - Height: 56px
// - Logo section: 24px play/download icon + "STREAMVAULT" text (#C0392B)
// - Right section: Settings icon (navigates to Settings) + Avatar circle (32px, #C0392B)
// - Consistent styling across all screens using theme tokens
```

#### **URLInputBar.tsx**
```typescript
// Props: {onSubmit: (url: string) => void}
// Features:
// - Chain icon (YouTube)
// - TextInput with focus animation (border → #C0392B)
// - Paste button (uses Clipboard API)
// - Clear button (visible when text exists)
// - Submit button (full width, #C0392B when URL valid)
// - URL validation (basic YouTube format check)
```

#### **ProgressBar.tsx**
```typescript
// Props: {progress: number (0-100), height?: number}
// Features:
// - Animated width based on progress prop
// - Default height: 3px
// - Fill color: #C0392B
// - Track color: #3A3A3C
// - Used in HomeScreen queue, DownloadsScreen, VideoPreviewScreen
```

#### **StatusBadge.tsx**
```typescript
// Props: {status: 'success' | 'warning' | 'error' | 'info' | 'pending'}
// Features:
// - Pill-shaped badge with status-specific colors
// - Success: #32D74B
// - Warning: #FFD60A
// - Error: #FF453A
// - Info: #0A84FF
// - Pending: #636366
```

#### **LoadingOverlay.tsx**
```typescript
// Props: {visible?: boolean, transparent?: boolean}
// Features:
// - Full-screen semi-transparent overlay
// - ActivityIndicator spinner
// - Optional transparent background prop
```

#### **EmptyState.tsx**
```typescript
// Props: {icon?: React.ReactNode, title: string, subtitle?: string}
// Features:
// - Centered layout on screen
// - Icon display (SVG supported)
// - Title and optional subtitle text
// - Used when no downloads or videos available
```

#### **ErrorBoundary.tsx**
```typescript
// Props: {children: React.ReactNode}
// Features:
// - Class component for error catching
// - Displays error message and "TRY AGAIN" button
// - Logs errors to console in componentDidCatch
// - Wraps entire app for global error handling
```

### Home Components (`src/components/home/`)
*(Component folder exists for future home-specific components)*

## 🪝 Custom Hooks

### **useDownload.ts** (`src/hooks/useDownload.ts`)
```typescript
// Main download engine hook
interface UseDownloadResult {
  startDownload: (item: DownloadItem) => Promise<void>
  pauseDownload: (downloadId: string) => void
  resumeDownload: (downloadId: string) => void
  retryDownload: (downloadId: string) => void
  cancelDownload: (downloadId: string) => void
}

// Features:
// - Manages react-native-blob-util fetch
// - Handles progress callbacks with real-time updates
// - Permission checking (Android 13+ aware)
// - Directory creation and file naming
// - Gallery saving via saveToGallery
// - Error handling with automatic retry logic
// - Concurrent download limit enforcement via settings store
// - Updates download store with progress, speed, status
```

### **useVideoPlayer.ts** (`src/hooks/useVideoPlayer.ts`)
```typescript
// Video player state management hook
interface VideoPlayerState {
  playing: boolean
  currentTime: number
  duration: number
  isFullScreen: boolean
  showControls: boolean
  playbackRate: number
}

// Features:
// - Toggles play/pause
// - Seek to specific time
// - Skip forward/backward (10s/30s)
// - Toggle fullscreen and controls
// - Set playback rate
// - Auto-hide controls after 3 seconds inactivity
// - Handle video load, progress, end, and error events
```

## 🗄️ State Management (Zustand + MMKV)

### **downloadStore.ts** (`src/store/downloadStore.ts`)
```typescript
// Download state and history management
interface DownloadItem {
  id: string                           // UUID
  title: string                        // Video title
  thumbnail: string                    // Thumbnail URL
  channelName: string                  // Channel name
  duration: number                     // Video duration in seconds
  formatLabel: string                  // e.g., "1080p H.264"
  resolution: number                   // Height in pixels
  codec: string                        // Video codec (h264, vp9, etc.)
  fileSize: number                     // File size in bytes
  fileSizeLabel: string                // e.g., "125.5 MB"
  filePath?: string                    // Local file path after download
  streamUrl: string                    // Streaming URL from backend
  status: 'queued' | 'downloading' | 'paused' | 'completed' | 'failed'
  progress: number                     // 0-100
  downloadedBytes: number              // Bytes downloaded
  speed: number                        // Download speed in bytes/sec
  createdAt: number                    // Timestamp
  completedAt?: number                 // Timestamp when completed
}

interface DownloadStore {
  downloads: DownloadItem[]
  addDownload: (item: Omit<DownloadItem, 'id' | 'progress' | 'downloadedBytes' | 'speed' | 'createdAt'>) => string
  updateProgress: (id: string, progress: number, downloadedBytes: number) => void
  updateSpeed: (id: string, speed: number) => void
  pauseDownload: (id: string) => void
  resumeDownload: (id: string) => void
  retryDownload: (id: string) => void
  removeDownload: (id: string) => void
  markCompleted: (id: string, filePath: string) => void
  markFailed: (id: string) => void
  getDownload: (id: string) => DownloadItem | undefined
  getDownloadsByStatus: (status: DownloadItem['status']) => DownloadItem[]
  hydrate: () => void  // Load from MMKV
}

// Storage: MMKV key 'streamvault_downloads'
// Auto-persists on every state change
// Auto-hydrates on app startup from App.tsx
```

### **settingsStore.ts** (`src/store/settingsStore.ts`)
```typescript
// App settings and preferences
interface SettingsStore {
  serverUrl: string                    // Backend server address (default: http://192.168.1.100:8000)
  defaultQuality: '4K' | '1080p' | '720p' | '480p'  // Default download quality
  downloadOnWifiOnly: boolean          // Only download on WiFi (default: true)
  maxConcurrentDownloads: number       // Max parallel downloads (default: 2)
  videoFormat: string                  // Video codec preference (default: 'H.264')
  
  setServerUrl: (url: string) => void
  setDefaultQuality: (quality: string) => void
  setDownloadOnWifiOnly: (bool: boolean) => void
  setMaxConcurrentDownloads: (count: number) => void
  setVideoFormat: (format: string) => void
  hydrate: () => void                  // Load from MMKV
}

// Storage: MMKV prefix 'streamvault_settings_' with individual keys per setting
// Auto-persists on every change
// Auto-hydrates on app startup from App.tsx
```

## 🔌 API Layer

### **youtubeApi.ts** (`src/api/youtubeApi.ts`)
```typescript
// Axios-based API client
interface VideoFormat {
  format_id: string
  label: string                        // e.g., "1080p H.264"
  resolution: number                   // Height in pixels
  quality: string                      // e.g., "1080p"
  codec: string                        // e.g., "h264"
  ext: string                          // File extension
  file_size: number                    // Bytes
  file_size_label: string              // e.g., "125.5 MB"
  badge_type: string                   // "4K", "1080p", etc.
  stream_url: string                   // Streaming URL
}

interface VideoInfo {
  title: string
  thumbnail: string
  duration: number                     // Seconds
  channel_name: string
  channel_avatar: string
  subscriber_count: number
  view_count: number
  upload_date: string                  // YYYY-MM-DD format
  formats: VideoFormat[]               // Array of available formats
  audio_format: {
    codec: string
    bitrate: string
  }
}

// Methods:
// - fetchVideoInfo(url: string): Promise<VideoInfo>
// - getStreamUrl(url: string, formatId: string): Promise<{stream_url: string}>
// - testConnection(serverUrl: string): Promise<boolean>
// - setBaseUrl(url: string): void

// Features:
// - Dynamic baseURL from settingsStore
// - Axios interceptor for server URL updates
// - Automatic error handling with retry logic
// - Request/response logging
```

## 🎨 Design System

### **colors.ts** - Complete Color Palette
```typescript
const Colors = {
  // Backgrounds
  bg: {
    primary: '#1C1C1E',                // Main background
    secondary: '#0D0D0D',              // Darker background
    surface: '#2C2C2E',                // Surface/card background
    elevated: '#3A3A3C',               // Elevated element background
  },
  
  // Accents (Cherry Alloy Red)
  accent: {
    primary: '#C0392B',                // Main accent, CTAs, highlights
    light: '#E74C3C',                  // Light accent for hovers/active
    deep: '#A93226',                   // Deep accent for shadows/dark states
    glow: '#FF6B5B',                   // Bright accent for special highlights
  },
  
  // Text
  text: {
    primary: '#F2F2F7',                // Main text (light gray)
    secondary: '#A1A1A6',              // Secondary text (medium gray)
    muted: '#636366',                  // Muted text (dark gray)
    inverse: '#1C1C1E',                // Inverse text on light backgrounds
  },
  
  // Status Colors
  status: {
    success: '#32D74B',                // Green
    warning: '#FFD60A',                // Yellow
    error: '#FF453A',                  // Red
    info: '#0A84FF',                   // Blue
  },
  
  // Borders
  border: '#3A3A3C',                   // Border color
}
```

### **typography.ts** - Font Sizes and Weights
```typescript
const Typography = {
  fontSizes: {
    xs: 11,                            // Extra small
    sm: 13,                            // Small
    base: 16,                          // Base/normal
    md: 18,                            // Medium
    lg: 20,                            // Large
    xl: 24,                            // Extra large
    hero: 34,                          // Hero/title
  },
  
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.7,
  },
}
```

### **spacing.ts** - Consistent Spacing Scale
```typescript
const Spacing = {
  xs: 4,                               // Extra small (4px)
  sm: 8,                               // Small (8px)
  md: 12,                              // Medium (12px)
  lg: 16,                              // Large (16px)
  xl: 24,                              // Extra large (24px)
  xxl: 32,                             // Double XL (32px)
}
```

## 📡 Backend API (FastAPI)

### **main.py** - API Endpoints

#### `GET /health`
```
Response: {
  "status": "online",
  "version": "2.4.0"
}
```

#### `POST /video-info`
```
Request: {
  "url": "https://www.youtube.com/watch?v=..."
}

Response: VideoInfo {
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": 420,
  "channel_name": "Channel Name",
  "channel_avatar": "https://...",
  "subscriber_count": 1000000,
  "view_count": 5000000,
  "upload_date": "2024-01-15",
  "formats": [
    {
      "format_id": "22",
      "label": "1080p H.264",
      "resolution": 1080,
      "quality": "1080p",
      "codec": "h264",
      "ext": "mp4",
      "file_size": 125000000,
      "file_size_label": "125.0 MB",
      "badge_type": "1080p",
      "stream_url": "https://..."
    },
    // More formats...
  ],
  "audio_format": {
    "codec": "aac",
    "bitrate": "128 kbps"
  }
}
```

#### `POST /stream-url`
```
Request: {
  "url": "https://www.youtube.com/watch?v=...",
  "format_id": "22"
}

Response: {
  "stream_url": "https://...",
  "expires_in": 21600
}
```

### Backend Technologies
- **FastAPI**: Modern Python web framework
- **yt-dlp**: YouTube video extraction and metadata
- **uvicorn**: ASGI server
- **slowapi**: Rate limiting
- **pydantic**: Data validation
- **CORS**: Cross-origin resource sharing enabled

## 🧠 Navigation Structure

### **RootNavigator** (`src/navigation/RootNavigator.tsx`)
```
Root Stack:
├── Splash (initial, no animation)
├── MainTabs (replaces to)
│   ├── Home Tab
│   ├── Downloads Tab
│   ├── Player Tab
│   └── Settings Tab
├── VideoPreview (animated)
└── VideoPlayer (animated)
```

### **TabNavigator** (`src/navigation/TabNavigator.tsx`)
```
Bottom Tabs (Height: 64px):
├── Home
│   Icon: SVG house
│   Active Color: #C0392B
├── Downloads
│   Icon: SVG download arrow
│   Active Color: #C0392B
├── Player
│   Icon: SVG play circle
│   Active Color: #C0392B
└── Settings
    Icon: SVG gear
    Active Color: #C0392B

Tab Bar Background: #1C1C1E
Inactive Icons: #636366
Active Icons: #C0392B
```

### **Navigation Types** (`src/navigation/types.ts`)
```typescript
// Type-safe navigation parameters
RootStackParamList {
  Splash: undefined
  MainTabs: undefined
  VideoPreview: {videoInfo: VideoInfo}
  VideoPlayer: {filePath: string; title: string}
}

TabParamList {
  Home: undefined
  Downloads: undefined
  Player: undefined
  Settings: undefined
}
```

## 🛠️ Utility Functions

### **formatUtils.ts** (`src/utils/formatUtils.ts`)
```typescript
// Format duration: seconds → "M:SS" or "H:MM:SS"
formatDuration(seconds: number): string

// Format file size: bytes → "X.X MB", "X.X GB", etc.
formatFileSize(bytes: number): string

// Format relative date: timestamp → "just now", "5m ago", "2d ago", etc.
formatRelativeDate(timestamp: number): string

// Format number: add commas for readability
formatNumber(num: number): string
```

### **permissions.ts** (`src/utils/permissions.ts`)
```typescript
// Android 13+ aware permission handling
requestStoragePermission(): Promise<boolean>  // Requests READ_MEDIA_VIDEO on Android 13+, READ_EXTERNAL_STORAGE on older versions

checkStoragePermission(): Promise<boolean>     // Checks if permission already granted

requestAllPermissions(): Promise<boolean>      // Requests all app permissions

// Features:
// - Platform-specific (Android vs iOS)
// - Android version detection (API 33+)
// - Graceful permission denial handling
```

### **fileManager.ts** (`src/utils/fileManager.ts`)
```typescript
// File and storage operations
getDownloadDirectory(): string                 // Platform-specific path
ensureDownloadDirectory(): Promise<void>       // Creates directory if needed
generateFilename(title: string, formatLabel: string): string  // Sanitizes and adds UUID
saveToGallery(filePath: string): Promise<boolean>  // iOS: Camera Roll, Android: MediaScanner
deleteFile(filePath: string): Promise<void>    // Removes file from storage
getFileSize(filePath: string): Promise<number> // Gets file size in bytes
getStorageInfo(): Promise<{free: number; total: number}>  // Available storage info
```

## 📦 NPM Dependencies

```json
{
  "react": "19.1.0",
  "react-native": "0.76.0",
  "expo": "~54.0.33",
  
  // Navigation
  "@react-navigation/native": "^6.1.x",
  "@react-navigation/stack": "^6.4.x",
  "@react-navigation/bottom-tabs": "^6.5.x",
  "react-native-screens": "^4.x",
  "react-native-safe-area-context": "^4.10.x",
  "react-native-gesture-handler": "^2.14.x",
  "react-native-reanimated": "^3.x",
  
  // Downloads & Storage
  "react-native-blob-util": "^0.19.x",
  "@react-native-camera-roll/camera-roll": "^7.x",
  "react-native-mmkv": "^2.11.x",
  
  // Video Player
  "react-native-video": "^6.0.x",
  "react-native-orientation-locker": "^1.6.x",
  
  // State Management
  "zustand": "^4.4.x",
  
  // Networking
  "axios": "^1.6.x",
  
  // UI & Graphics
  "react-native-linear-gradient": "^2.8.x",
  "react-native-svg": "^14.x",
  "react-native-fast-image": "^8.6.x",
  "react-native-slider": "^1.1.x",
  
  // Performance
  "@shopify/flash-list": "^1.6.x",
  
  // Utilities
  "react-native-permissions": "^4.x",
  "react-native-haptic-feedback": "^2.2.x",
  "react-native-progress": "^5.1.x",
  "uuid": "^9.0.x",
  "react-native-get-random-values": "^1.10.x",
  
  // Development
  "typescript": "^5.x",
  "@react-native-community/cli": "latest"
}
```

## 📋 Python Backend Dependencies

```text
fastapi              # Web framework
uvicorn[standard]    # ASGI server
yt-dlp              # YouTube extraction
slowapi             # Rate limiting
pydantic            # Data validation
```

## 🔐 Permissions

### Android Permissions (AndroidManifest.xml)
```xml
<!-- Required for downloading videos -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Media access (Android 13+) -->
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />

<!-- Storage access (Android < 13) -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />

<!-- Background services -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

### iOS Permissions (Info.plist)
```xml
<!-- Photo Library Access -->
<key>NSPhotoLibraryAddUsageDescription</key>
<string>StreamVault needs permission to save downloaded videos to your photo library</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>StreamVault needs permission to access your photo library</string>
```

## 🧠 App Flow & Data Flow

### Download Flow Diagram
```
User Input (HomeScreen)
    ↓ [Enter YouTube URL]
URL Validation
    ↓ [Regex check]
API Call (youtubeApi.fetchVideoInfo)
    ↓ [Axios → Backend /video-info]
Backend Processing
    ↓ [yt-dlp extraction]
Video Info Response
    ↓ [Title, thumbnail, formats]
VideoPreviewScreen
    ↓ [Display video info + format grid]
User Format Selection
    ↓ [Select quality/codec]
Add to Download Queue
    ↓ [Store action: addDownload]
useDownload Hook
    ↓ [Start RNFetchBlob.fetch]
File Download
    ↓ [Progress callbacks]
Progress Update
    ↓ [Store: updateProgress]
File Save
    ↓ [FileManager: generateFilename]
Gallery Integration
    ↓ [CameraRoll (iOS) / MediaScanner (Android)]
Mark Completed
    ↓ [Store: markCompleted]
DownloadsScreen Display
    ↓ [FlashList rendering]
Tap to Play
    ↓ [Navigate to VideoPlayerScreen]
VideoPlayerScreen
    ↓ [react-native-video plays file]
```

### State Persistence Flow
```
App Start
    ↓
App.tsx useEffect
    ↓
downloadStore.hydrate() [Read from MMKV]
    ↓
settingsStore.hydrate() [Read from MMKV]
    ↓
Stores ready with previous state
    ↓
Navigation starts
    ↓
User actions update stores
    ↓
Zustand subscribers notified
    ↓
Components re-render
    ↓
Store changes → MMKV (automatic)
```

## 📝 Development Notes

### TypeScript Configuration
- **Strict Mode**: Enabled (`"strict": true`)
- **Target**: ES2020
- **JSX**: react-native
- **Path Alias**: `@/*` maps to `src/*` (use `import { Component } from '@/components'`)

### Theme Usage Best Practices
```typescript
// ✅ ALWAYS use theme tokens
import { Colors, Typography, Spacing } from '@/theme'
style={{
  backgroundColor: Colors.bg.primary,
  color: Colors.text.primary,
  padding: Spacing.md,
  fontSize: Typography.fontSizes.base,
}}

// ❌ NEVER hardcode values
style={{
  backgroundColor: '#1C1C1E',
  color: '#F2F2F7',
  padding: 12,
  fontSize: 16,
}}
```

### Store Usage Pattern
```typescript
// Import and use selectors
import { useDownloadStore } from '@/store/downloadStore'

export const MyComponent = () => {
  // Select only what you need (better performance)
  const downloads = useDownloadStore((state) => state.downloads)
  const addDownload = useDownloadStore((state) => state.addDownload)
  
  // Component automatically re-renders when selected state changes
  // Other state changes won't cause unnecessary re-renders
  
  return (
    // JSX
  )
}
```

### Component Organization
- **Common**: Used by multiple screens
- **Screen-specific**: Used by only one screen (home/, downloads/, preview/, player/)
- **Keep it flat**: Avoid deep nesting beyond 2-3 levels
- **Use TypeScript**: Always define Props interface

### Adding New Features
1. Add to theme if it's a visual style
2. Add to store if it's app state
3. Create component if it's reusable UI
4. Create utility if it's a helper function
5. Add to types.ts if it involves navigation

## 🔌 API Error Handling

All API calls include automatic error handling:

```typescript
// youtubeApi methods catch errors and log them
// Specific errors:
// - "Invalid URL" - URL doesn't match YouTube format
// - "Video not found" - yt-dlp couldn't extract
// - "Server error" - Backend returned 500
// - "Network error" - No internet connection

// Retry logic:
// - Automatic retry on network failures
// - Max 3 retries with exponential backoff
```

## 🐛 Troubleshooting

### Backend Connection Failed
```
Problem: "Server connection failed" error in Settings
Solutions:
1. Verify backend is running: ps aux | grep uvicorn
2. Check server URL in Settings matches your PC IP
3. Ensure phone/emulator and PC on same WiFi network
4. Try http://10.0.2.2:8000 for Android emulator
5. Firewall: Allow port 8000
```

### Permissions Denied
```
Problem: "Permission denied" when downloading
Solutions:
1. Grant permissions when prompted on first launch
2. Android: Settings > Apps > StreamVault > Permissions > Enable
3. iOS: Settings > StreamVault > Photos
4. Restart app after granting permissions
```

### Video Won't Play
```
Problem: Downloaded video shows error in player
Solutions:
1. Verify download completed (check DownloadsScreen status)
2. Check file exists: Open file manager in Settings
3. Try different video format in next download
4. Restart app and try again
5. Check available storage space
```

### App Crashes on Startup
```
Problem: App immediately closes after launch
Solutions:
1. Clear app data: adb shell pm clear com.streamvault (Android)
2. Reinstall app: adb uninstall com.streamvault && npx react-native run-android
3. Reset cache: npx react-native start --reset-cache
4. Check console: npx react-native log-android or npx react-native log-ios
```

### Slow Downloads
```
Problem: Downloads are very slow
Solutions:
1. Check internet connection speed
2. Try a shorter/smaller video first
3. Reduce concurrent downloads in Settings (set to 1)
4. Move closer to WiFi router
5. Close background apps consuming bandwidth
```

## 📦 Building for Production

### Android APK/AAB
```bash
cd StreamVault/android
# For APK (direct install)
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk

# For App Bundle (Google Play)
./gradlew bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab
```

### iOS App
```bash
cd StreamVault/ios
xcodebuild -scheme StreamVault -configuration Release -derivedDataPath build archive
xcodebuild -exportArchive -archivePath build.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath export
```

### Optimization Checklist
- [ ] Set targetSdkVersion to latest (Android)
- [ ] Remove console.log statements
- [ ] Enable ProGuard/R8 obfuscation (Android)
- [ ] Optimize assets (compress images)
- [ ] Test on physical device
- [ ] Profile with React DevTools
- [ ] Check bundle size: `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output size-check.bundle`

## ⚡ Performance Tips

1. **FlashList over FlatList**: Already used in DownloadsScreen
   - Supports 1000+ items without slowdown
   - Always set `estimatedItemSize`

2. **Memoization**: Use `useMemo` for expensive operations
   ```typescript
   const memoizedValue = useMemo(() => expensiveCalculation(), [dependencies])
   ```

3. **Image Optimization**: FastImage already configured
   - Caches images automatically
   - Supports image resizing

4. **Download Limits**: Configured in Settings
   - Default: 2 concurrent downloads
   - Increase at risk of performance impact

5. **Lazy Screens**: React Navigation already implements
   - Screens load only when needed
   - Improves startup time

## 📚 Additional Resources

- [React Navigation Docs](https://reactnavigation.org/)
- [React Native Video Docs](https://github.com/react-native-video/react-native-video)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [React Native Blob Util](https://github.com/RonRadtke/react-native-blob-util)

## 📋 File Size Reference

- **Compiled APK**: ~150-200 MB (debug), ~80-120 MB (release)
- **App Bundle**: ~60-80 MB
- **Node modules**: ~500 MB
- **Video cache**: Depends on downloaded videos

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-05-03 | Initial release with all core features |

## 📄 License & Terms

Created for personal use only. YouTube videos should only be downloaded for personal offline viewing in accordance with YouTube's terms of service.

By using StreamVault, you agree to:
- Download videos only for personal, non-commercial use
- Not distribute or resell videos
- Respect copyright and creator rights
- Comply with YouTube's terms of service

## ✨ Special Thanks

Built with:
- React Native & Expo
- FastAPI & yt-dlp
- The amazing React Native community

---

## 🎯 Quick Reference

### Most Used Files
| File | Purpose |
|------|---------|
| `src/store/downloadStore.ts` | Download state |
| `src/store/settingsStore.ts` | App settings |
| `src/hooks/useDownload.ts` | Download engine |
| `src/api/youtubeApi.ts` | Backend API |
| `src/theme/colors.ts` | Design tokens |
| `backend/main.py` | API server |

### Common Tasks

**Add new screen**: `src/screens/NewScreen.tsx` + update `src/navigation/types.ts`

**Add new store action**: Update store in `src/store/` and call from component

**Change colors**: Edit `src/theme/colors.ts` - updates everywhere using theme tokens

**Test API endpoint**: Use `curl` or Postman with base URL from Settings

**Debug store state**: Add `console.log(useDownloadStore.getState())` in component

**Check permissions**: Import `checkStoragePermission()` from `src/utils/permissions.ts`

---

## 💬 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review SETUP.md for installation steps
3. See DEVELOPER.md for development patterns
4. Check backend/README.md for API details

---

Built with 🎬 for offline video enthusiasts
