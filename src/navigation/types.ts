import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { VideoInfo } from '../api/youtubeApi';

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  VideoPreview: { videoInfo: VideoInfo };
  VideoPlayer: { filePath: string; title: string };
};

export type TabParamList = {
  Home: undefined;
  Downloads: undefined;
  Player: undefined;
  Settings: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
