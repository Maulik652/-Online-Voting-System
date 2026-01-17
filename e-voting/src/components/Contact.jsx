// src/pages/Contact.jsx
import React from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaLifeRing,
  FaGlobe,
  FaUser,
  FaRegEnvelope,
  FaComment,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";

import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required.");
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        setForm({ name: "", email: "", message: "" });
      } else {
        setError(data.message || "Failed to submit. Try again.");
      }
    } catch {
      setError("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#464e47] mb-4 animate-fadeIn">
            Get in Touch
          </h1>
          <p className="text-[#464e47]/90 text-lg sm:text-xl max-w-2xl mx-auto animate-fadeIn delay-200">
            Have questions or need assistance? Reach out to us using the form below or via our other contact platforms.
          </p>
        </div>
      </section>

      {/* Two-Column Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Contact Info */}
        <div className="bg-white p-10 rounded-xl shadow-lg flex flex-col justify-center space-y-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-[#464e47] mb-6 text-center md:text-left">
            Contact Information
          </h2>

          {[
            { icon: FaMapMarkerAlt, title: "Address", text: "123 Democracy St, Voting City, Country" },
            { icon: FaEnvelope, title: "Email", text: "support@evote.com" },
            { icon: FaPhone, title: "Phone", text: "+123 456 7890" },
            { icon: FaClock, title: "Office Hours", text: "Mon-Fri: 9:00 AM - 6:00 PM" },
            { icon: FaLifeRing, title: "Support Email", text: "help@evote.com" },
            { icon: FaGlobe, title: "Website", text: "www.evote.com" },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <item.icon className="text-[#464e47] text-3xl mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-[#464e47]">{item.title}</h3>
                <p className="text-[#464e47]/80">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Contact Form */}
        <div className="bg-white p-10 rounded-xl shadow-lg flex flex-col justify-center hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-[#464e47] mb-6 text-center md:text-left">
            Send a Message
          </h2>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label className="text-[#464e47] font-medium mb-1 block">Your Name</label>
              <FaUser className="absolute top-12 left-3 text-[#464e47]/70" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-10 py-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#464e47] transition duration-300 hover:shadow-md"
              />
            </div>
            <div className="relative">
              <label className="text-[#464e47] font-medium mb-1 block">Your Email</label>
              <FaRegEnvelope className="absolute top-12 left-3 text-[#464e47]/70" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-10 py-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#464e47] transition duration-300 hover:shadow-md"
              />
            </div>
            <div className="relative">
              <label className="text-[#464e47] font-medium mb-1 block">Your Message</label>
              <FaComment className="absolute top-12 left-3 text-[#464e47]/70" />
              <textarea
                rows="5"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full px-10 py-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#464e47] transition duration-300 hover:shadow-md"
              />
            </div>
            {success && <div className="text-green-600 font-bold text-center">{success}</div>}
            {error && <div className="text-red-600 font-bold text-center">{error}</div>}
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-[#464e47] text-white font-semibold rounded-xl shadow-md hover:bg-[#3b433e] hover:scale-105 transition transform duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Other Contact Platforms */}
      <section className="bg-gray-100 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#464e47] animate-fadeIn">Other Contact Platforms</h2>
          <p className="text-[#464e47]/80 mt-2 animate-fadeIn delay-200">Connect with us on social media or messaging apps</p>
        </div>

        <div className="flex justify-center gap-8">
          {[{ icon: FaWhatsapp, url: "https://wa.me/1234567890" },
            { icon: FaFacebookF, url: "https://facebook.com" },
            { icon: FaTwitter, url: "https://twitter.com" }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#464e47] text-white p-5 rounded-full hover:bg-[#3b433e] hover:scale-110 transition transform duration-300 shadow-md text-3xl flex items-center justify-center"
            >
              <item.icon />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
