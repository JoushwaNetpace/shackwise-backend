export const ROLE_ENUM = {
  HOME_BUYER: 'HOME_BUYER',
  SUPER_ADMIN: 'SUPER_ADMIN',
  HOME_AGENT: 'HOME_AGENT',
} as const;

export const SOCIAL_ACCOUNT_ENUM = {
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
  APPLE: 'APPLE',
} as const;

export type SocialAccountType = keyof typeof SOCIAL_ACCOUNT_ENUM;
export type RoleType = keyof typeof ROLE_ENUM;
