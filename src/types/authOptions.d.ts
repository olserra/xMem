declare module '../app/api/auth/[...nextauth]/auth' {
  import type { NextAuthOptions } from 'next-auth';
  export const authOptions: NextAuthOptions;
}

declare module 'src/app/api/auth/[...nextauth]/auth' {
  import type { NextAuthOptions } from 'next-auth';
  export const authOptions: NextAuthOptions;
} 