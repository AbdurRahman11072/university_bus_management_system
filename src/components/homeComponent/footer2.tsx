// components/Footer.tsx
import React from "react";
import Link from "next/link";
import footerImage from "@/assets/footer-1.jpg";

const Footer2: React.FC = () => {
  return (
    <footer className="relative text-white py-10">
      {/* Background Image with Darker Green Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-bottom opacity-90"
        style={{ backgroundImage: `url(${footerImage.src})` }}
      ></div>
      <div
        className="absolute inset-0 bg-green-900 opacity-70"
        style={{ backgroundPosition: "center bottom" }}
      ></div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 relative z-10">
        {/* Branding & About */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">GUB Bus Management</h2>
          <p className="text-white text-sm font-bold">
            Ensuring safe, timely, and comfortable transportation for Green
            University students and faculty.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <Link
            href="/home"
            className="hover:underline hover:text-green-500 transition block px-2 py-1 rounded font-bold"
          >
            Home
          </Link>
          <Link
            href="/schedule"
            className="hover:underline hover:text-green-500 transition block px-2 py-1 rounded font-bold"
          >
            Schedule
          </Link>
          <Link
            href="/about-us"
            className="hover:underline hover:text-green-500 transition block px-2 py-1 rounded font-bold"
          >
            About Us
          </Link>
          <Link
            href="/services"
            className="hover:underline hover:text-green-500 transition block px-2 py-1 rounded font-bold"
          >
            Services
          </Link>
          <Link
            href="/contact-us"
            className="hover:underline hover:text-green-500 transition block px-2 py-1 rounded font-bold"
          >
            Contact Us
          </Link>
          <Link
            href="/faqs"
            className="hover:underline hover:text-green-500 transition block px-2 py-1 rounded font-bold"
          >
            FAQs
          </Link>
        </div>

        {/* Services */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Services</h3>
          <p className="text-white text-sm font-bold">Real-time Bus Tracking</p>
          <p className="text-white text-sm font-bold">Route Optimization</p>
          <p className="text-white text-sm font-bold">Emergency Support</p>
          <p className="text-white text-sm font-bold">
            Student Discount Program
          </p>
        </div>

        {/* Contact Info & Socials */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Get in Touch</h3>
          <p className="text-white text-sm font-bold">
            📧 Email: support@gubbus.com
          </p>
          <p className="text-white text-sm font-bold">
            📞 Phone: +880 1234-567890
          </p>
          <p className="text-white text-sm font-bold">
            📍 Green University of Bangladesh, Dhaka
          </p>

          <div className="flex space-x-4 mt-2">
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.icons8.com/ios-filled/30/ffffff/facebook.png"
                alt="Facebook"
                className="hover:opacity-75 transition"
              />
            </Link>
            <Link
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.icons8.com/ios-filled/30/ffffff/instagram-new.png"
                alt="Instagram"
                className="hover:opacity-75 transition"
              />
            </Link>
            <Link
              href="https://www.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.icons8.com/ios-filled/30/ffffff/whatsapp.png"
                alt="WhatsApp"
                className="hover:opacity-75 transition"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-white font-bold text-sm relative z-10">
        &copy; 2025{" "}
        <span className="text-green-500">Green University Of Bangladesh.</span>{" "}
        All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer2;
