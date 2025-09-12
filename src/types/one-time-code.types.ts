export type OneTimeCode = {
  id: number;
  code: string;
  ref_email: string;
  expired_at: Date | string;
  is_verify: boolean;
};
