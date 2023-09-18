export const JWT = {
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '60s' },
};
