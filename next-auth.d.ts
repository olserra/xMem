import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User {
    organizationId?: string;
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      organizationId?: string;
      role?: string;
    } & DefaultSession['user'];
  }
}
declare module 'next-auth/adapters' {
  interface AdapterUser extends DefaultUser {
    organizationId?: string;
    role?: string;
  }
} 