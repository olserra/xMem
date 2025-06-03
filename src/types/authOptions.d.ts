declare module '../app/api/auth/[...nextauth]/auth' {
  import type { NextAuthOptions } from 'next-auth';
  export const authOptions: NextAuthOptions;
} 