import axios, { AxiosInstance } from 'axios';
import { useSettingsStore } from '../store/settingsStore';

export interface VideoFormat {
  format_id: string;
  label: string;
  resolution: string;
  quality: string;
  codec: string;
  ext: string;
  file_size: number;
  file_size_label: string;
  badge_type: 'HDR' | 'HD' | 'SD' | 'LQ';
  stream_url: string;
}

export interface AudioFormat {
  format_id: string;
  label: string;
  codec: string;
  file_size_label: string;
  stream_url: string;
}

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  channel_name: string;
  channel_avatar: string;
  subscriber_count: string;
  view_count: string;
  upload_date: string;
  formats: VideoFormat[];
  audio_format: AudioFormat;
}

class YouTubeApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to set base URL from settings
    this.client.interceptors.request.use((config) => {
      const settings = useSettingsStore.getState();
      config.baseURL = settings.serverUrl;
      return config;
    });
  }

  async fetchVideoInfo(url: string): Promise<VideoInfo> {
    try {
      const response = await this.client.post('/video-info', { url });
      return response.data;
    } catch (error) {
      console.error('Error fetching video info:', error);
      throw new Error('Failed to fetch video information');
    }
  }

  async getStreamUrl(url: string, formatId: string): Promise<string> {
    try {
      const response = await this.client.post('/stream-url', { url, format_id: formatId });
      return response.data.stream_url;
    } catch (error) {
      console.error('Error getting stream URL:', error);
      throw new Error('Failed to get stream URL');
    }
  }

  async testConnection(serverUrl: string): Promise<boolean> {
    try {
      const testClient = axios.create({
        baseURL: serverUrl,
        timeout: 5000,
      });
      const response = await testClient.get('/health');
      return response.status === 200 && response.data.status === 'online';
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }

  setBaseUrl(url: string): void {
    this.client.defaults.baseURL = url;
  }
}

export const youtubeApi = new YouTubeApi();
