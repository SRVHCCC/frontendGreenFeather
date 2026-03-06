import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import {
  SiVisa,
  SiMastercard,
  SiPaypal,
  SiAmericanexpress,
  SiGooglepay,
  SiApplepay,
} from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-200 via-green-100 to-green-200 text-gray-700 border-t border-green-200/60">

      {/* LINKS SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">

          {/* Shop */}
          <div>
            <h4 className="text-green-900 font-semibold mb-3 text-sm">Shop</h4>
            <ul className="space-y-1.5 text-sm">
              <li><a href="#" className="hover:text-green-700 transition">New Arrivals</a></li>
              <li><a href="#" className="hover:text-green-700 transition">Best Sellers</a></li>
              <li><a href="#" className="hover:text-green-700 transition">Eco Essentials</a></li>
              <li><a href="#" className="hover:text-green-700 transition">Gift Cards</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-green-900 font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-1.5 text-sm">
              <li><a href="#" className="hover:text-green-700 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-green-700 transition">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-green-700 transition">Order Tracking</a></li>
              <li><a href="#" className="hover:text-green-700 transition">Size Guide</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-green-900 font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-1.5 text-sm">
              <li><a href="/about" className="hover:text-green-700 transition">About Us</a></li>
              <li><a href="#" className="hover:text-green-700 transition">Sustainability</a></li>
              <li><a href="#" className="hover:text-green-700 transition">Careers</a></li>
              <li><a href="#" className="hover:text-green-700 transition">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-green-900 font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-1.5 text-sm">
              <li className="break-all">greenfeather.in@gmail.com</li>
              <li>+91 9898989898</li>
              <li>Mon–Fri, 9am–6pm</li>
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-green-300">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Copyright */}
          <p className="text-sm text-green-800 font-semibold text-center lg:text-left">
            © {new Date().getFullYear()} GreenFeather. All rights reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex flex-wrap justify-center items-center gap-3">
            <SiVisa className="h-6 w-10 text-[#1A1F71]" />
            <SiMastercard className="h-6 w-10 text-[#EB001B]" />
            <SiAmericanexpress className="h-6 w-10 text-[#2E77BC]" />
            <SiPaypal className="h-6 w-10 text-[#003087]" />
            <SiApplepay className="h-6 w-10 text-black" />
            <SiGooglepay className="h-6 w-10 text-[#4285F4]" />
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a href="#" className="text-2xl text-[#1877F2] hover:scale-110 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="text-2xl text-[#1DA1F2] hover:scale-110 transition">
              <FaTwitter />
            </a>
            <a href="#" className="text-2xl text-[#E4405F] hover:scale-110 transition">
              <FaInstagram />
            </a>
            <a href="#" className="text-2xl text-[#0A66C2] hover:scale-110 transition">
              <FaLinkedinIn />
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;