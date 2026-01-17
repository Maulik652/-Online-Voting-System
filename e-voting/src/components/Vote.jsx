import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Confetti from "react-confetti";
import { FaVoteYea, FaUserTie } from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

dayjs.extend(duration);

const API = "http://localhost:5000/api";
const BASE_URL = "http://localhost:5000";

/* ===============================
   SAFE STATUS FUNCTION (FIXED)
================================ */
function getStatus(election) {
  if (!election || !election.startDate || !election.endDate) {
    return "Upcoming";
  }

  const now = new Date();
  const start = new Date(election.startDate);
  const end = new Date(election.endDate);

  if (now < start) return "Upcoming";
  if (now > end) return "Ended";
  return "Ongoing";
}

export default function Vote() {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [voteStatus, setVoteStatus] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    fetchElections();
    fetchCandidates();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await fetch(`${API}/elections`);
      const data = await res.json();
      setElections(Array.isArray(data) ? data : []);
    } catch {
      setElections([]);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${API}/candidates`);
      const data = await res.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch {
      setCandidates([]);
    }
  };

  /* ===============================
     COUNTDOWN TIMER
  ================================ */
  useEffect(() => {
    if (!selectedElection || getStatus(selectedElection) !== "Ongoing") {
      setCountdown("");
      return;
    }

    const interval = setInterval(() => {
      const diff = new Date(selectedElection.endDate) - new Date();
      if (diff <= 0) {
        setCountdown("Ended");
        clearInterval(interval);
        return;
      }
      const d = dayjs.duration(diff);
      setCountdown(
        `${d.days()}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s left`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedElection]);

  /* ===============================
     VOTE STATUS CHECK
  ================================ */
  useEffect(() => {
    if (!selectedElection) {
      setVoteStatus(null);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API}/votes/status?electionId=${selectedElection._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setVoteStatus(data.voted ? "Voted" : "Not Voted"))
      .catch(() => setVoteStatus(null));
  }, [selectedElection]);

  /* ===============================
     FILTER CANDIDATES
  ================================ */
  const filteredCandidates = candidates.filter(
    (c) =>
      c.election === selectedElection?._id ||
      c.election?._id === selectedElection?._id
  );

  const winner =
    selectedElection &&
    getStatus(selectedElection) === "Ended" &&
    filteredCandidates.length > 0
      ? filteredCandidates.reduce((a, b) => (b.votes > a.votes ? b : a))
      : null;

  /* ===============================
     HANDLE VOTE
  ================================ */
  const handleVote = async (candidateId) => {
    if (!selectedElection) return;
    if (getStatus(selectedElection) !== "Ongoing") {
      toast.error("Voting is not active.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to vote.");
      return;
    }

    setIsVoting(true);

    try {
      const res = await fetch(`${API}/votes/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          candidateId,
          electionId: selectedElection._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Vote cast successfully!");
      setVoteStatus("Voted");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      toast.error(err.message || "Voting failed");
    }

    setIsVoting(false);
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      {showConfetti && typeof window !== "undefined" && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
      )}

      <ToastContainer />

      <h1 className="text-5xl font-extrabold text-[#464e47] mb-8 text-center">
        <FaVoteYea className="inline mr-2" />
        Cast Your Vote
      </h1>

      {/* Election Selector */}
      <select
        className="w-full max-w-md px-4 py-3 border rounded-lg shadow mb-8"
        onChange={(e) =>
          setSelectedElection(elections.find((x) => x._id === e.target.value))
        }
      >
        <option value="">-- Select Election --</option>
        {elections.map((e) => (
          <option key={e._id} value={e._id}>
            {e.title}
          </option>
        ))}
      </select>

      {/* Candidates */}
      {selectedElection && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
          {filteredCandidates.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-xl shadow-lg p-5 text-center relative"
            >
              {winner?._id === c._id && (
                <span className="absolute top-3 right-3 bg-yellow-400 px-2 py-1 rounded text-xs font-bold">
                  🏆 Winner
                </span>
              )}

              {c.candidatePhoto ? (
                <img
                  src={
                    c.candidatePhoto.startsWith("/")
                      ? `${BASE_URL}${c.candidatePhoto}`
                      : c.candidatePhoto
                  }
                  className="w-24 h-24 rounded-full mx-auto mb-3"
                />
              ) : (
                <FaUserTie className="text-6xl text-gray-400 mx-auto mb-3" />
              )}

              <h3 className="font-bold text-lg text-[#464e47]">{c.name}</h3>
              <p className="text-sm text-gray-600 flex justify-center gap-1">
                <AiOutlineCheckCircle /> {c.party}
              </p>

              <button
                onClick={() => handleVote(c._id)}
                disabled={voteStatus === "Voted" || isVoting}
                className={`mt-4 px-6 py-2 rounded-full font-bold transition ${
                  voteStatus === "Voted"
                    ? "bg-gray-300 text-gray-500"
                    : "bg-[#464e47] text-white hover:bg-[#2f3430]"
                }`}
              >
                <MdHowToVote className="inline mr-1" />
                {voteStatus === "Voted" ? "Voted" : "Vote"}
              </button>

              {countdown && (
                <p className="text-xs mt-2 text-blue-600 font-semibold">
                  {countdown}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
