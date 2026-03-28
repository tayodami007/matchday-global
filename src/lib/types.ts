// ============================================================
// MATCHDAYGLOBAL — Type Definitions
// Source: SportMonks Football API v3
// ============================================================

export interface League {
  id: number;
  sport_id: number;
  country_id: number;
  name: string;
  active: boolean;
  short_code: string;
  image_path: string;
  type: string;
  sub_type: string;
  last_played_at: string;
  category: number;
  has_jerseys: boolean;
  country?: Country;
  currentseason?: Season;
}

export interface Country {
  id: number;
  continent_id: number;
  name: string;
  official_name: string;
  fifa_name: string;
  iso2: string;
  iso3: string;
  latitude: string;
  longitude: string;
  image_path: string;
}

export interface Season {
  id: number;
  sport_id: number;
  league_id: number;
  name: string;
  is_current: boolean;
}

export interface Team {
  id: number;
  sport_id: number;
  country_id: number;
  venue_id: number;
  gender: string;
  name: string;
  short_code: string;
  image_path: string;
  founded: number;
  type: string;
  placeholder: boolean;
  last_played_at: string;
}

export interface Participant extends Team {
  meta?: {
    location: "home" | "away";
    winner?: boolean;
    position?: number;
  };
}

export interface Score {
  id: number;
  fixture_id: number;
  type_id: number;
  description: string;
  score: {
    goals: number;
    participant: "home" | "away";
  };
  participant_id: number;
}

export interface FixtureState {
  id: number;
  state: string;
  name: string;
  short_name: string;
  developer_name: string;
}

export interface MatchEvent {
  id: number;
  fixture_id: number;
  period_id: number;
  participant_id: number;
  type_id: number;
  section: string;
  player_id: number;
  related_player_id: number | null;
  player_name: string;
  related_player_name: string | null;
  result: string | null;
  info: string | null;
  addition: string | null;
  minute: number;
  extra_minute: number | null;
  injured: boolean | null;
  on_bench: boolean | null;
  type?: EventType;
  player?: Player;
}

export interface EventType {
  id: number;
  name: string;
  code: string;
  developer_name: string;
  model_type: string;
}

export interface Player {
  id: number;
  sport_id: number;
  country_id: number;
  nationality_id: number;
  name: string;
  common_name: string;
  display_name: string;
  image_path: string;
  position_id: number;
  detailed_position_id: number | null;
}

export interface Fixture {
  id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  group_id: number | null;
  aggregate_id: number | null;
  round_id: number;
  state_id: number;
  venue_id: number;
  name: string;
  starting_at: string;
  result_info: string | null;
  leg: string;
  details: string | null;
  length: number;
  placeholder: boolean;
  has_odds: boolean;
  has_premium_odds: boolean;
  starting_at_timestamp: number;
  state?: FixtureState;
  league?: League;
  participants?: Participant[];
  scores?: Score[];
  events?: MatchEvent[];
  statistics?: FixtureStatistic[];
}

export interface FixtureStatistic {
  id: number;
  fixture_id: number;
  type_id: number;
  participant_id: number;
  data: {
    value: number | string;
  };
  location: string;
  type?: {
    id: number;
    name: string;
    code: string;
    developer_name: string;
  };
}

export interface Standing {
  id: number;
  participant_id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  group_id: number | null;
  round_id: number;
  standing_rule_id: number | null;
  position: number;
  result: string;
  points: number;
  participant?: Team;
  details?: StandingDetail[];
}

export interface StandingDetail {
  id: number;
  standing_id: number;
  type_id: number;
  value: number;
  standing_type?: {
    id: number;
    name: string;
    code: string;
    developer_name: string;
  };
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  pagination?: {
    count: number;
    per_page: number;
    current_page: number;
    next_page: number | null;
    has_more: boolean;
  };
  subscription?: unknown[];
  rate_limit?: {
    resets_in_seconds: number;
    remaining: number;
    requested_entity: string;
  };
  timezone: string;
}

// UI-specific types
export interface ParsedScore {
  home: number;
  away: number;
}

export interface MatchStatus {
  isLive: boolean;
  isFinished: boolean;
  isUpcoming: boolean;
  isHalfTime: boolean;
  displayText: string;
  minute?: number;
}
