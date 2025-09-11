export type TUser = {
  id: number;
  ip_address: string;
  is_guest: boolean;
  email: string;
  password: string;
  username: string;
  fullname: string;
  status: string;
  avatar: string;
  provider?: string; // "account", "google", "facebook", etc.
  created_at: Date;
  updated_at: Date;
};
