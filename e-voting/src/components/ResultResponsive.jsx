import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaVoteYea, FaTrophy } from "react-icons/fa";
import Confetti from "react-confetti";

export default function ResultResponsive() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [winnerId, setWinnerId] = useState(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    axios.get("/api/elections").then((res) => {
      setElections(res.data);
    });
  }, []);

  const handleSelectElection = async (e) => {
    const electionId = e.target.value;
    setSelectedElection(electionId);
    if (!electionId) return;
    try {
      const res = await axios.get(`/api/results/${electionId}`);
      const candidatesData = res.data.candidates;
      setCandidates(candidatesData);
      if (candidatesData.length > 0) {
        const winner = candidatesData.reduce((max, c) => (c.votes > max.votes ? c : max), candidatesData[0]);
        setWinnerId(winner._id);
      }
    } catch (err) {
      setCandidates([]);
      setWinnerId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen font-sans">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-[#464e47] text-center">Election Results</h1>
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
        <select
          className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47] w-full md:w-64 mb-4 md:mb-0"
          onChange={handleSelectElection}
          value={selectedElection || ""}
        >
          <option value="">Select Election</option>
          {elections.map((el) => (
            <option key={el._id} value={el._id}>
              {el.title} ({el.status})
            </option>
          ))}
        </select>
      </div>
      {selectedElection && candidates.length === 0 && (
        <p className="text-gray-600 text-center">Results will be available after the election ends.</p>
      )}
      {candidates.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg text-xs md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 md:p-3 border-b text-left">Photo</th>
                <th className="p-2 md:p-3 border-b text-left">Name</th>
                <th className="p-2 md:p-3 border-b text-left">Party</th>
                <th className="p-2 md:p-3 border-b text-left">Votes</th>
                <th className="p-2 md:p-3 border-b text-left">Winner</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate._id} className={`transition ${candidate._id === winnerId ? 'bg-yellow-100 font-bold' : 'hover:bg-gray-50'}`}>
                  <td className="p-2 md:p-3 border-b">
                    <img
                      src={candidate.photo || "/placeholder.png"}
                      alt={candidate.name}
                      className="w-10 h-10 md:w-16 md:h-16 object-cover rounded-full border-2 border-[#464e47] mx-auto"
                    />
                  </td>
                  <td className="p-2 md:p-3 border-b whitespace-nowrap">{candidate.name}</td>
                  <td className="p-2 md:p-3 border-b whitespace-nowrap flex items-center gap-1"><FaUser /> {candidate.party}</td>
                  <td className="p-2 md:p-3 border-b whitespace-nowrap flex items-center gap-1"><FaVoteYea /> {candidate.votes}</td>
                  <td className="p-2 md:p-3 border-b text-center">
                    {candidate._id === winnerId && <FaTrophy className="text-yellow-500 text-lg md:text-2xl inline-block animate-bounce" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {winnerId && <Confetti width={windowDimensions.width} height={windowDimensions.height} recycle={false} />}
    </div>
  );
}
