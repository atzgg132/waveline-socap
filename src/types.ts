export type Confidence = "high" | "medium" | "low";

export type Metrics = {
  views?: number | null;
  likes?: number | null;
  replies?: number | null;
  reposts?: number | null;
  bookmarks?: number | null;
  comments?: number | null;
};

export type LaunchRow = {
  id: string;
  launch_key: string;
  client: string;
  date: string;
  datetime_utc: string;
  asset_type: string;
  platform: string;
  author_handle: string;
  author_name: string;
  author_type: string;
  followers_approx: number | null;
  is_video: boolean;
  hook_type: string;
  hook_text: string;
  posted_offset_hours: number | null;
  metrics: Metrics;
  url: string;
  source_note: string;
  confidence: Confidence;
  wave?: string | null;
  socap_claimed: boolean;
  attribution_note: string;
  media_preview_url?: string | null;
};

export type WorkSnapshot = {
  source_url: string;
  fetched_at_utc: string | null;
  ok: boolean;
  http_status: number | null;
  title: string | null;
  heading: string | null;
  note: string;
};

export type LaunchesFetchNote = {
  source_url: string;
  fetched_at_utc: string | null;
  ok: boolean;
  http_status: number | null;
  row_count: number | null;
  used_for_ledger: boolean;
  note: string;
};

export type LedgerFilters = {
  launch_key: string;
  platform: string;
  author_type: string;
  asset_type: string;
  is_video: string;
  wave: string;
  socap_claimed: string;
};
