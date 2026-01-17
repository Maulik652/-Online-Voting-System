import React from "react";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaUsers,
  FaVoteYea,
  FaLaptop,
  FaLock,
  FaPoll,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8f7] via-white to-[#eef2ef] text-[#2f3a32]">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#464e4715,transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center relative z-10">

          {/* Hero Text */}
          <div>
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-[#464e4715] text-sm font-semibold">
              Trusted Digital Democracy
            </span>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
              The Future of <br />
              <span className="text-[#464e47]">Secure Online Voting</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mb-10">
              Experience transparent, encrypted, and accessible elections built
              for institutions, universities, and organizations.
            </p>

            <div className="flex gap-4">
              <Link
                to="/vote"
                className="inline-flex items-center gap-3 px-8 py-3 bg-[#464e47] text-white rounded-full font-semibold shadow-xl hover:scale-105 hover:bg-[#3b433e] transition"
              >
                <FaVoteYea />
                Cast Your Vote
              </Link>

              <Link
                to="/about"
                className="px-8 py-3 rounded-full border border-[#464e47]/40 font-semibold hover:bg-[#464e4710] transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#464e4720] to-transparent rounded-3xl blur-xl" />
              <img
                src="./public/images/hero.png"
                alt="Online Voting Platform"
                className="relative w-full max-w-md rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">
          Why Organizations Choose <span className="text-[#464e47]">eVote</span>
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            {
              icon: <FaShieldAlt />,
              title: "Military-Grade Security",
              desc: "End-to-end encryption with tamper-proof vote storage.",
            },
            {
              icon: <FaCheckCircle />,
              title: "Complete Transparency",
              desc: "Auditable, real-time election integrity for trust.",
            },
            {
              icon: <FaUsers />,
              title: "Universal Access",
              desc: "Vote from any device with a seamless experience.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all"
            >
              <div className="text-5xl text-[#464e47] mb-6 group-hover:scale-110 transition">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-to-b from-[#f4f6f5] to-white py-24">
        <h2 className="text-3xl font-bold text-center mb-16">
          Simple. Secure. Reliable.
        </h2>

        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            {
              icon: <FaLaptop />,
              title: "Register",
              desc: "Verify your identity with secure authentication.",
            },
            {
              icon: <FaLock />,
              title: "Vote Securely",
              desc: "Encrypted voting ensures anonymity and integrity.",
            },
            {
              icon: <FaPoll />,
              title: "View Results",
              desc: "Instant and transparent result publishing.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
            >
              <div className="text-5xl text-[#464e47] mb-6">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3">
                {i + 1}. {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-12 text-center">
          {[
            { value: "10,000+", label: "Verified Voters" },
            { value: "500+", label: "Elections Hosted" },
            { value: "100%", label: "Audit Transparency" },
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-5xl font-extrabold text-[#464e47]">
                {stat.value}
              </h3>
              <p className="text-gray-600 mt-3">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
