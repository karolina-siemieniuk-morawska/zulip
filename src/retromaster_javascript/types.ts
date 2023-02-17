export interface StreamData {
  result: string;
  msg: string;
  subscribers: number[];
}

export interface User {
  email: string;
  user_id: number;
  full_name: string;
  bot_type: string | null;
  is_bot: boolean;
  is_admin: boolean;
  is_active: boolean;
  avatar_url: string;
}
