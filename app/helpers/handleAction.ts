import { handleSignIn } from "./handleSignIn";

export const HandleAction = (session: any, e: React.MouseEvent<HTMLElement>, url?: string) => {
  console.log("session", session);

  if (!session) {
    handleSignIn(e); // Pass the event to handleSignIn
  } else {
    if (url) {
      window.location.href = url; // Navigate if logged in
    } else {
      window.open("https://chatgpt.com/g/g-kqRCHmM5H-openskills", "_blank"); // Open chat link if no URL provided
    }
  }
};
