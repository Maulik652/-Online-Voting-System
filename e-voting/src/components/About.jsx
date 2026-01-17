// src/pages/About.jsx
import React from "react";
import { FaShieldAlt, FaUsers, FaChartLine, FaLightbulb } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#464e47] mb-6">
              About eVote
            </h1>
            <p className="text-[#464e47]/90 text-lg sm:text-xl mb-6">
              eVote is a secure and transparent online voting platform designed to simplify elections and improve voter participation. Our mission is to provide a trustworthy, accessible, and efficient system for everyone.
            </p>
            <p className="text-[#464e47]/90 text-lg sm:text-xl">
              With eVote, voters can cast their ballots safely from anywhere, while administrators can monitor and verify results in real-time, ensuring full transparency.
            </p>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=600&q=80"
              alt="About eVote"
              className="rounded-xl shadow-lg w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-[#464e47] text-center mb-12">
          Our Mission
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaShieldAlt className="text-[#464e47] text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#464e47]">Secure</h3>
            <p className="text-[#464e47]/80">
              Ensure every vote is protected with end-to-end encryption.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaUsers className="text-[#464e47] text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#464e47]">Accessible</h3>
            <p className="text-[#464e47]/80">
              Easy-to-use interface for voters of all ages and locations.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaChartLine className="text-[#464e47] text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#464e47]">Transparent</h3>
            <p className="text-[#464e47]/80">
              Real-time monitoring and verifiable results for total trust.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaLightbulb className="text-[#464e47] text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#464e47]">Innovative</h3>
            <p className="text-[#464e47]/80">
              Leveraging modern technology to improve the voting experience.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#464e47] mb-6">Our Vision</h2>
          <p className="text-[#464e47]/90 text-lg sm:text-xl">
            To create a world where voting is simple, secure, and accessible to everyone, ensuring fair and transparent elections globally. eVote aims to empower voters and administrators with technology they can trust.
          </p>
        </div>
      </section>
    </div>
  );
}
