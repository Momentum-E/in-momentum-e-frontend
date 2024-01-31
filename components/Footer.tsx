import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-500 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p>&copy; 2024 Momentum-E</p>
          <p>All rights reserved</p>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/">
                Terms of Service
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
