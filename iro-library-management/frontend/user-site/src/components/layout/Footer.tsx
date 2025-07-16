export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Library Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">IRO Library</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Your digital gateway to knowledge and literature. Discover, borrow, and enjoy thousands of books from the comfort of your home.
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200">
                Join Library
              </button>
              <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-4 py-2 rounded transition duration-200">
                Contact Us
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  Browse Books
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  My Account
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  Reading History
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  Library Rules
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Library Hours & Contact */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Library Hours</h4>
              <div className="text-gray-300 space-y-1">
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday: 9:00 AM - 6:00 PM</p>
                <p>Sunday: 10:00 AM - 5:00 PM</p>
                <p className="text-sm text-gray-400 mt-2">
                  Digital services available 24/7
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <div className="text-gray-300 space-y-1">
                <p>📧 info@irolibrary.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 123 Library Street, Knowledge City, KC 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 IRO Library. All rights reserved. Built with ❤️ for book lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
