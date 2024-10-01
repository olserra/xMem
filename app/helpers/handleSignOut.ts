import { signOut } from "next-auth/react";

export const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  signOut();
};