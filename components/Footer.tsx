import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 bg-gray-50">
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          {/* Logo and Navigation */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-6">
            <Link href="/">
              <span className="text-2xl font-semibold text-black">xmem</span>
            </Link>
            <div className="mt-4 flex flex-wrap items-center justify-center space-x-4 sm:mt-0">
              <Link href="#how-it-works" className="text-sm text-gray-700 hover:text-blue-600 transition duration-200">
                How It Works
              </Link>
              <Link href="#key-features" className="text-sm text-gray-700 hover:text-blue-600 transition duration-200">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm text-gray-700 hover:text-blue-600 transition duration-200">
                Testimonials
              </Link>
              <Link href="#contact" className="text-sm text-gray-700 hover:text-blue-600 transition duration-200">
                Contact
              </Link>
              <Link href="/privacy-policy" className="text-sm text-gray-700 hover:text-blue-600 transition duration-200">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Product Hunt Badge */}
          <div className="mt-6 flex flex-col items-center sm:mt-0">
            <a
              href="https://www.producthunt.com/posts/xmem?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-xmem"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=652438&theme=light"
                alt="xmem - Streamline Knowledge Sharing Across Teams | Product Hunt"
                style={{ width: '250px', height: '54px' }}
                width="250"
                height="54"
              />
            </a>
            <Link
              href="https://www.producthunt.com/@your_username" // Replace with your Product Hunt username
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Follow us on Product Hunt
            </Link>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto" />

        <span className="block text-sm text-gray-700 text-center">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://xmem.xyz"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            xmem
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
