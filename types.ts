
export interface NASAData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
}

export interface SearchHistory {
  id: string;
  date: string;
  title: string;
  thumbnail: string;
}
