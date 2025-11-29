export interface Scenario {
  id: string;
  title: string;
  icon: string;
  promptContext: string;
  color: string;
}

export interface TranscriptItem {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}
