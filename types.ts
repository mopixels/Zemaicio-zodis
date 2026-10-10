import type { StackScreenProps } from '@react-navigation/stack';

export type Language = 'zmt' | 'lt';

export interface Word {
  id: string;
  title: string;
  meaning: string;
}

export type RootStackParamList = {
  Home: undefined;
  Prenumerata: undefined;
  'Žemaitėšks žuodīnielis': undefined;
  Apie: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;
