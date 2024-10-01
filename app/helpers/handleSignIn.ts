import { signIn } from "next-auth/react";

export const handleSignIn = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  signIn("google", {
    callbackUrl: "https://www.openskills.online/api/auth/callback/google",
  });
};