export type Language = 'zmt' | 'lt';

export interface Word {
  id: string;
  title: string;
  meaning: string;
}

export type RootTabParamList = {
  Word: undefined;
  Dictionary: undefined;
  Settings: undefined;
};
