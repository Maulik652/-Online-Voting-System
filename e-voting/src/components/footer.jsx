import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaHome,
  FaVoteYea,
  FaChartBar,
  FaInfoCircle,
  FaAddressBook,
} from "react-icons/fa";

const Footer = () => {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.pageYOffset > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const quickLinks = [
    { name: "Home", icon: <FaHome /> },
    { name: "Voting", icon: <FaVoteYea /> },
    { name: "Results", icon: <FaChartBar /> },
    { name: "About", icon: <FaInfoCircle /> },
    { name: "Contact", icon: <FaAddressBook /> },
  ];

  return (
    <footer className="bg-[#0f172a] text-[#e5e7eb] relative">
      {/* Accent Line */}
      <div className="h-[3px] bg-gradient-to-r from-[#22c55e] via-[#3b82f6] to-[#22c55e]" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand & Contact */}
          <div className="space-y-5">
            <img
              src="./public/images/footer.jpg"
              alt="E-Voting"
              className="h-24 w-auto rounded-md shadow-lg"
            />

            <div className="space-y-3 text-[#9ca3af]">
              <p className="flex items-center gap-3">
                <FaMapMarkerAlt /> Democracy City, India
              </p>
              <p className="flex items-center gap-3">
                <FaEnvelope /> support@evoting.com
              </p>
              <p className="flex items-center gap-3">
                <FaPhone /> +91 98765 43210
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold mb-5 text-[#22c55e]">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li
                  key={link.name}
                  className="flex items-center gap-3 text-[#9ca3af] hover:text-white transition cursor-pointer"
                >
                  {link.icon} {link.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Trust */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-[#22c55e]">
                Stay Updated
              </h2>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded-md bg-[#1e293b] 
                             text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  className="bg-[#22c55e] hover:bg-[#16a34a] 
                             px-6 py-3 rounded-md font-semibold transition"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[#22c55e]">
              <FaShieldAlt size={20} />
              <span className="font-medium">Secure & Verified Platform</span>
            </div>

            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                <div
                  key={i}
                  className="p-3 rounded-full bg-[#1e293b] 
                             hover:bg-[#334155] transition cursor-pointer"
                >
                  <Icon size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote */}
        <p className="mt-12 text-center italic text-[#9ca3af] text-xl">
          “Empowering citizens through secure and transparent voting.”
        </p>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[#334155] 
                        flex flex-col md:flex-row justify-between text-sm text-[#9ca3af]">
          <span>
            © {new Date().getFullYear()} E-Voting System
          </span>
          <span>Fair • Secure • Transparent</span>
        </div>
      </div>

      {/* Back to Top */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#22c55e] 
                     text-white p-4 rounded-full shadow-xl 
                     hover:bg-[#16a34a] transition"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;
