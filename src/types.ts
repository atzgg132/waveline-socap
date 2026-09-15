export type Metrics = {
  views: number | null;
  likes: number | null;
  reposts: number | null;
  comments: number | null;
};

export type LaunchRow = {
  id: string;
  launch_key: string;
  client: string;
  date: string;
  datetime_utc: string;
  asset_type: string;
  platform: string;
  author_handle: string | null;
  author_name: string | null;
  author_type: string;
  followers_approx: number | null;
  is_video: boolean;
  hook_type: string;
  hook_text: string;
  posted_offset_hours: number | null;
  metrics: Metrics;
  url: string;
  source_note: string;
  confidence: string;
  wave: string | null;
};
