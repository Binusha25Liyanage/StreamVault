# StreamVault Developer Quick Reference

## 🎯 Core Concepts

### State Management Pattern
```typescript
// Access store
const downloads = useDownloadStore((state) => state.downloads);
const addDownload = useDownloadStore((state) => state.addDownload);

// Automatic MMKV persistence - no extra code needed
// Just call actions and they auto-persist
```

### Theme Usage
```typescript
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

// Always use tokens, never hardcode colors
style={{ color: Colors.text.primary }} // ✓ Good
style={{ color: '#F2F2F7' }} // ✗ Bad
```

### Navigation
```typescript
// Type-safe navigation
navigation.navigate('VideoPreview', { videoInfo });
navigation.goBack();

// Stack navigator
navigation.replace('MainTabs'); // Replace current screen
```

## 📂 File Locations

| What | Where |
|------|-------|
| Colors/spacing | `src/theme/` |
| API calls | `src/api/youtubeApi.ts` |
| State stores | `src/store/` |
| Permissions | `src/utils/permissions.ts` |
| Downloads | `src/hooks/useDownload.ts` |
| Common UI | `src/components/common/` |

## 🔄 Common Tasks

### Add a New Screen
1. Create `src/screens/NewScreen.tsx`
2. Add to `src/navigation/types.ts` in `RootStackParamList`
3. Add route in `src/navigation/RootNavigator.tsx`
4. Implement screen with TypeScript props

### Add State to Store
```typescript
// In downloadStore.ts or settingsStore.ts
const newAction = useCallback(() => {
  // update state
  storage.set(KEY, JSON.stringify(data));
  set({ /* new state */ });
}, []);
```

### Create New Component
```typescript
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={{ color: Colors.text.primary }}>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Use Zustand Store
```typescript
import { useDownloadStore } from '../store/downloadStore';

export const MyComponent = () => {
  const downloads = useDownloadStore((state) => state.downloads);
  const markCompleted = useDownloadStore((state) => state.markCompleted);
  
  return (
    // Automatically re-renders when relevant state changes
  );
};
```

## 🎨 Component Props Pattern

All components follow this pattern:
```typescript
interface ComponentProps {
  // Required props first
  title: string;
  // Optional props with defaults
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  disabled?: boolean;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  size = 'md',
  color = Colors.text.primary,
  disabled = false,
}) => {
  // Implementation
};
```

## 📡 API Usage

```typescript
import { youtubeApi } from '../api/youtubeApi';

// Fetch video info
try {
  const info = await youtubeApi.fetchVideoInfo(url);
  // Handle success
} catch (error) {
  // Handle error
}

// Test server connection
const isOnline = await youtubeApi.testConnection(serverUrl);
```

## 💾 Download Flow

```
1. User pastes URL → URLInputBar
2. Fetch video info → youtubeApi.fetchVideoInfo()
3. User selects format → VideoPreviewScreen
4. Add to store → useDownloadStore.addDownload()
5. Start download → useDownload.startDownload()
6. Update progress → downloadStore.updateProgress()
7. Mark complete → downloadStore.markCompleted()
8. Save to gallery → fileManager.saveToGallery()
```

## 🔧 Debugging

### View Store State
```typescript
// In component
const allState = useDownloadStore();
console.log('Download store:', allState);
```

### Check Permissions
```typescript
import { checkStoragePermission } from '../utils/permissions';

const hasPermission = await checkStoragePermission();
console.log('Has permission:', hasPermission);
```

### Test API
```bash
# In backend directory
curl http://localhost:8000/health
curl -X POST http://localhost:8000/video-info \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=..."}'
```

## 📋 Checklist for New Features

- [ ] Add TypeScript types
- [ ] Use theme tokens (no hardcoded colors/spacing)
- [ ] Add error handling with try/catch
- [ ] Test on both Android and iOS
- [ ] Update relevant store if state needed
- [ ] Add loading state if async operation
- [ ] Document in JSDoc comments
- [ ] Test with various screen sizes

## 🚨 Common Mistakes to Avoid

❌ **Don't**: Hardcode colors
```typescript
style={{ color: '#F2F2F7' }}
```
✅ **Do**: Use theme tokens
```typescript
style={{ color: Colors.text.primary }}
```

❌ **Don't**: Create new stores without MMKV
✅ **Do**: Persist critical data
```typescript
storage.set(KEY, JSON.stringify(data));
```

❌ **Don't**: Use FlatList for large lists
✅ **Do**: Use FlashList
```typescript
import { FlashList } from '@shopify/flash-list';
```

❌ **Don't**: Ignore TypeScript errors
✅ **Do**: Fix all type issues
```typescript
// Add proper types
const handlePress: (id: string) => void = (id) => {};
```

## 🔌 Important APIs

### Download Store
- `addDownload(item)` → string (id)
- `updateProgress(id, progress, bytes)`
- `markCompleted(id, filePath)`
- `markFailed(id)`
- `pauseDownload(id)`
- `resumeDownload(id)`

### Settings Store
- `setServerUrl(url)`
- `setDefaultQuality(quality)`
- `setDownloadOnWifiOnly(bool)`
- `setMaxConcurrentDownloads(count)`

### Utilities
- `formatDuration(seconds)` → string
- `formatFileSize(bytes)` → string
- `formatRelativeDate(timestamp)` → string
- `requestStoragePermission()` → boolean
- `saveToGallery(filePath)` → boolean

## 📱 Testing Checklist

- [ ] Download video successfully
- [ ] Play downloaded video offline
- [ ] Pause and resume during playback
- [ ] Change server URL and test connection
- [ ] Filter downloads by status
- [ ] Change quality settings
- [ ] Test on landscape orientation
- [ ] Test with slow internet
- [ ] Restart app and verify persistence

## 🎬 Video Player Controls

- **Tap**: Toggle controls
- **Double tap left**: Skip back 10s
- **Double tap right**: Skip forward 30s
- **Swipe left edge**: Control brightness
- **Swipe right edge**: Control volume

## 📊 Performance Tips

- Use `useMemo` for expensive computations
- Lazy load components with React.lazy
- Optimize image with FastImage
- Limit list rendering with FlashList
- Unsubscribe from listeners in useEffect cleanup

## 🔗 Important Imports

```typescript
// Navigation
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';

// Stores
import { useDownloadStore } from '../store/downloadStore';
import { useSettingsStore } from '../store/settingsStore';

// Theme
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

// Utils
import { formatDuration, formatFileSize } from '../utils/formatUtils';
import { useDownload } from '../hooks/useDownload';
```

## 🆘 Quick Fixes

**App won't start?**
```bash
npm install --legacy-peer-deps
npx react-native start --reset-cache
```

**Backend can't connect?**
```bash
# Verify backend running
curl http://localhost:8000/health
# Check your IP
ipconfig (Windows) / ifconfig (Mac)
# Update Settings in app with correct IP
```

**TypeScript errors?**
```bash
# Check tsconfig.json
# Ensure all imports have proper types
# Run: npx tsc --noEmit
```

This is a comprehensive quick reference. Always refer to the full documentation in README.md and SETUP.md for more details.
