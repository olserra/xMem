import Link from "next/link";
import Image from 'next/image';
import MaxWidthWrapper from "./MaxWidthWrapper";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/75 backdrop-blur-lg">
      <MaxWidthWrapper>
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="xmem logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-semibold">xmem</span>
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black">Terms of Service</Link>
            <Link href="/contact" className="hover:text-black">Contact</Link>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} xmem. All rights reserved.
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
