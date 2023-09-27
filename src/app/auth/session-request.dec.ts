export type SessionRequest = Request & {
  user: { sub: number; refreshToken: string };
};
