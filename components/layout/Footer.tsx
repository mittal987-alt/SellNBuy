import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-neutral-900 dark:border-neutral-800 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">

        {/* Column 1 */}
        <div>
          <h4 className="font-semibold mb-3">Popular Categories</h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>Cars</li>
            <li>Flats for Rent</li>
            <li>Mobile Phones</li>
            <li>Jobs</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-semibold mb-3">Trending Searches</h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>Bikes</li>
            <li>Watches</li>
            <li>Books</li>
            <li>Furniture</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-semibold mb-3">About Us</h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>About OLX Clone</li>
            <li>Contact Us</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>Help Center</li>
            <li>Safety Tips</li>
            <li>Report a Problem</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t dark:border-neutral-800 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} OLX Clone. All rights reserved.
      </div>
    </footer>
  );
}
