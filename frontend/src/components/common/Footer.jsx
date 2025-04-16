import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-10 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} DCloud. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
