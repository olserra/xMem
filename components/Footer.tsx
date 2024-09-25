import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-semibold">OpenSkills</span>
          </Link>
          <Link href="/privacy-policy">
            <span className="cursor-pointer underline">Privacy Policy</span>
          </Link>
        </div>
        <hr className="my-2 text-muted-foreground sm:mx-auto" />
        <span className="block text-sm text-muted-foreground sm:text-center">
          © {new Date().getFullYear()}{" "}
          <a
            target="_blank"
            href="https://tryconvo.vercel.app/"
            className="hover:underline"
          >
            OpenSkills
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
