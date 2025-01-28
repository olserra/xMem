import { MouseEvent } from "react";
import { signIn } from "next-auth/react";

export const handleSignIn = async (e: MouseEvent<HTMLElement>, setLoading?: (loading: boolean) => void) => {
  e.preventDefault();
  if (setLoading) setLoading(true);

  try {
    await signIn("google", {
      callbackUrl: "/dashboard/projects", // Redirect to /dashboard/projects after login
    });
  } catch (error) {
    console.error("SignIn Error:", error);
  } finally {
    if (setLoading) setLoading(false);
  }
};