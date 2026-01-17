import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaClipboardList,
  FaUser,
  FaChartBar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBars,
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Admin() {
  // Add missing editVoterId state
  const [editVoterId, setEditVoterId] = useState(null);
  // Add missing voters state
  const [voters, setVoters] = useState([]);
  // Add missing results state
  const [results, setResults] = useState([]);
  const [active, setActive] = useState("Dashboard");
  const [showElectionModal, setShowElectionModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showVoterModal, setShowVoterModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Candidate form states
  const [candidateName, setCandidateName] = useState("");
  const [candidateParty, setCandidateParty] = useState("");
  const [candidateBio, setCandidateBio] = useState("");
  const [candidateElection, setCandidateElection] = useState("");
  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [partyLogo, setPartyLogo] = useState(null);

  // Candidates states
  const [candidates, setCandidates] = useState([]);
  const [editCandidateId, setEditCandidateId] = useState(null);
  const [editCandidate, setEditCandidate] = useState({ name: "", party: "", election: "", candidatePhoto: null, partyLogo: null });

  // Dashboard states
  const [dashboardStats, setDashboardStats] = useState({
    electionsCount: 0,
    votersCount: 0,
    votesCount: 0,
    chartData: [],
  });
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Votes",
        data: [],
        backgroundColor: ["#464e47", "#5a635c", "#7a807a", "#b0b7b1", "#7a807a"],
      },
    ],
  });

  // Elections states
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({ title: "", startDate: "", endDate: "", status: "upcoming" });
  const [editElectionId, setEditElectionId] = useState(null);
  const [editElection, setEditElection] = useState({ title: "", startDate: "", endDate: "", status: "upcoming" });

  useEffect(() => {
    // Always fetch elections for dropdown
    fetch("/api/admin/elections")
      .then((res) => res.json())
      .then((data) => setElections(data))
      .catch(() => {});
    if (active === "Dashboard") {
      fetch("/api/admin/dashboard")
        .then((res) => res.json())
        .then((data) => {
          setDashboardStats(data);
          setBarData({
            labels: data.chartData.map((c) => c.name),
            datasets: [
              {
                label: "Votes",
                data: data.chartData.map((c) => c.votes),
                backgroundColor: ["#464e47", "#5a635c", "#7a807a", "#b0b7b1", "#7a807a"],
              },
            ],
          });
        })
        .catch(() => {});
    }
    if (active === "Candidates") {
      fetch("/api/admin/candidates")
        .then((res) => res.json())
        .then((data) => setCandidates(data))
        .catch(() => {});
    }
    if (active === "Results") {
      fetch("/api/admin/results")
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch(() => {});
    }
  }, [active]);
        {/* Results */}
        {active === "Results" && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 border-b">Name</th>
                  <th className="text-left p-3 border-b">Party</th>
                  <th className="text-left p-3 border-b">Election</th>
                  <th className="text-left p-3 border-b">Votes</th>
                  <th className="text-left p-3 border-b">Candidate Photo</th>
                  <th className="text-left p-3 border-b">Party Logo</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50 transition cursor-pointer">
                    <td className="p-3 border-b">{result.name}</td>
                    <td className="p-3 border-b">{result.party}</td>
                    <td className="p-3 border-b">{result.election?.title || result.election}</td>
                    <td className="p-3 border-b">{result.votes}</td>
                    <td className="p-3 border-b">
                      <img src={result.candidatePhoto || "#"} alt="Candidate" className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="p-3 border-b">
                      <img src={result.partyLogo || "#"} alt="Party Logo" className="w-12 h-12 object-cover rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  // Add Voter
  const handleAddVoter = () => {
    fetch("/api/admin/voters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVoter),
    })
      .then((res) => res.json())
      .then((data) => {
        setVoters((prev) => [...prev, data]);
        setShowVoterModal(false);
        setNewVoter({ name: "", email: "" });
      });
  };

  // Edit Voter
  const handleEditVoter = () => {
    fetch(`/api/admin/voters/${editVoterId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editVoter),
    })
      .then((res) => res.json())
      .then((data) => {
        setVoters((prev) => prev.map((v) => (v._id === editVoterId ? data : v)));
        setEditVoterId(null);
        setEditVoter({ name: "", email: "", hasVoted: false });
      });
  };

  // Delete Voter
  const handleDeleteVoter = (id) => {
    fetch(`/api/admin/voters/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setVoters((prev) => prev.filter((v) => v._id !== id)));
  };
        {/* Voters */}
        {active === "Voters" && (
          <div className="overflow-x-auto">
            <button
              className="bg-[#464e47] text-white px-4 py-2 rounded mb-4 hover:bg-[#5a635c] flex items-center transition"
              onClick={() => setShowVoterModal(true)}
            >
              <FaPlus className="mr-2" /> Add Voter
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 border-b">Name</th>
                    <th className="text-left p-3 border-b">Email</th>
                    <th className="text-left p-3 border-b">Has Voted</th>
                    <th className="text-left p-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {voters.map((voter) => (
                    <tr key={voter._id} className="hover:bg-gray-50 transition cursor-pointer">
                      <td className="p-3 border-b">{voter.name}</td>
                      <td className="p-3 border-b">{voter.email}</td>
                      <td className="p-3 border-b">{voter.hasVoted ? "Yes" : "No"}</td>
                      <td className="p-3 border-b flex gap-2 flex-wrap">
                        <button
                          className="text-blue-500 hover:underline flex items-center"
                          onClick={() => {
                            setEditVoterId(voter._id);
                            setEditVoter({
                              name: voter.name,
                              email: voter.email,
                              hasVoted: voter.hasVoted,
                            });
                          }}
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          className="text-red-500 hover:underline flex items-center"
                          onClick={() => handleDeleteVoter(voter._id)}
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Voter Modal */}
            {editVoterId && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Edit Voter</h2>
                  <input
                    type="text"
                    placeholder="Voter Name"
                    className="w-full border p-2 mb-3 rounded"
                    value={editVoter.name}
                    onChange={(e) => setEditVoter({ ...editVoter, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Voter Email"
                    className="w-full border p-2 mb-3 rounded"
                    value={editVoter.email}
                    onChange={(e) => setEditVoter({ ...editVoter, email: e.target.value })}
                  />
                  <label className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={editVoter.hasVoted}
                      onChange={(e) => setEditVoter({ ...editVoter, hasVoted: e.target.checked })}
                      className="mr-2"
                    />
                    Has Voted
                  </label>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                      onClick={() => setEditVoterId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-[#464e47] text-white hover:bg-[#5a635c] transition"
                      onClick={handleEditVoter}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      {showVoterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Voter</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Voter Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]"
                  value={newVoter.name}
                  onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Voter Email</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]"
                  value={newVoter.email}
                  onChange={(e) => setNewVoter({ ...newVoter, email: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-6 py-2 rounded-lg bg-[#464e47] text-white hover:bg-[#5a635c] transition"
                onClick={handleAddVoter}
              >
                Add Voter
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                onClick={() => setShowVoterModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

  // Add Election
  const handleAddElection = () => {
    fetch("/api/admin/elections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newElection),
    })
      .then((res) => res.json())
      .then((data) => {
        setElections((prev) => [...prev, data]);
        setShowElectionModal(false);
        setNewElection({ title: "", startDate: "", endDate: "", status: "upcoming" });
      });
  };

  // Edit Election
  const handleEditElection = () => {
    fetch(`/api/admin/elections/${editElectionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editElection),
    })
      .then((res) => res.json())
      .then((data) => {
        setElections((prev) => prev.map((e) => (e._id === editElectionId ? data : e)));
        setEditElectionId(null);
        setEditElection({ title: "", startDate: "", endDate: "", status: "upcoming" });
      });
  };

  // Delete Election
  const handleDeleteElection = (id) => {
    fetch(`/api/admin/elections/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setElections((prev) => prev.filter((e) => e._id !== id)));
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Elections", icon: <FaClipboardList /> },
    { name: "Candidates", icon: <FaUser /> },
    { name: "Results", icon: <FaChartBar /> },
  ];

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Votes per Candidate" },
    },
  };

  // Add Candidate
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddCandidate = async () => {
    if (!candidateElection) {
      alert("Please select an election.");
      return;
    }
    const candidatePhotoBase64 = await toBase64(candidatePhoto);
    const partyLogoBase64 = await toBase64(partyLogo);
    fetch("/api/admin/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: candidateName,
        party: candidateParty,
        bio: candidateBio,
        election: candidateElection,
        candidatePhoto: candidatePhotoBase64,
        partyLogo: partyLogoBase64
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCandidates((prev) => [...prev, data]);
        setShowCandidateModal(false);
        setCandidateName("");
        setCandidateParty("");
        setCandidateBio("");
        setCandidateElection("");
        setCandidatePhoto(null);
        setPartyLogo(null);
      });
  };

  // Edit Candidate
  const handleEditCandidate = () => {
    if (!editCandidateId) {
      alert("No candidate selected for edit.");
      return;
    }
    fetch(`/api/admin/candidates/${editCandidateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editCandidate,
        candidatePhoto: editCandidate.candidatePhoto && typeof editCandidate.candidatePhoto === "string" ? editCandidate.candidatePhoto : "",
        partyLogo: editCandidate.partyLogo && typeof editCandidate.partyLogo === "string" ? editCandidate.partyLogo : ""
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCandidates((prev) => prev.map((c) => (c._id === editCandidateId ? data : c)));
        setEditCandidateId(null);
        setEditCandidate({ name: "", party: "", election: "", candidatePhoto: null, partyLogo: null });
      });
  };

  // Delete Candidate
  const handleDeleteCandidate = (id) => {
    fetch(`/api/admin/candidates/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setCandidates((prev) => prev.filter((c) => c._id !== id)));
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl text-[#464e47]"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 w-64 h-full bg-[#464e47] text-white flex flex-col transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold p-6 border-b border-gray-600">
          Admin Panel
        </h2>
        <ul className="flex-1">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center p-4 cursor-pointer hover:bg-[#5a635c] transition ${
                active === item.name ? "bg-[#5a635c]" : ""
              }`}
              onClick={() => {
                setActive(item.name);
                setSidebarOpen(false);
              }}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-white p-6 overflow-y-auto md:ml-64">
        <h1 className="text-3xl font-bold mb-6">{active}</h1>

        {/* Dashboard */}
        {active === "Dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-[#e6e8e4] p-6 rounded-lg shadow hover:shadow-lg transition">
              <h2 className="font-bold text-xl mb-2">Upcoming Elections</h2>
              <p className="text-gray-700">{dashboardStats.electionsCount} Elections</p>
            </div>
            <div className="bg-[#e6e8e4] p-6 rounded-lg shadow hover:shadow-lg transition">
              <h2 className="font-bold text-xl mb-2">Total Voters</h2>
              <p className="text-gray-700">{dashboardStats.votersCount}</p>
            </div>
            <div className="bg-[#e6e8e4] p-6 rounded-lg shadow hover:shadow-lg transition">
              <h2 className="font-bold text-xl mb-2">Votes Cast</h2>
              <p className="text-gray-700">{dashboardStats.votesCount}</p>
            </div>
            <div className="col-span-1 sm:col-span-2 md:col-span-3 bg-[#e6e8e4] p-6 rounded-lg shadow hover:shadow-lg transition mt-4">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        )}

        {/* Elections */}
        {active === "Elections" && (
          <div className="overflow-x-auto">
            <button
              className="bg-[#464e47] text-white px-4 py-2 rounded mb-4 hover:bg-[#5a635c] flex items-center transition"
              onClick={() => setShowElectionModal(true)}
            >
              <FaPlus className="mr-2" /> Add Election
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 border-b">Title</th>
                    <th className="text-left p-3 border-b">Start Date</th>
                    <th className="text-left p-3 border-b">End Date</th>
                    <th className="text-left p-3 border-b">Status</th>
                    <th className="text-left p-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {elections.map((election) => (
                    <tr key={election._id} className="hover:bg-gray-50 transition cursor-pointer">
                      <td className="p-3 border-b">{election.title}</td>
                      <td className="p-3 border-b">{election.startDate?.slice(0, 10)}</td>
                      <td className="p-3 border-b">{election.endDate?.slice(0, 10)}</td>
                      <td className="p-3 border-b">
                        <span className="bg-yellow-300 text-black px-2 py-1 rounded-full">
                          {election.status}
                        </span>
                      </td>
                      <td className="p-3 border-b flex gap-2 flex-wrap">
                        <button
                          className="text-blue-500 hover:underline flex items-center"
                          onClick={() => {
                            setEditElectionId(election._id);
                            setEditElection({
                              title: election.title,
                              startDate: election.startDate?.slice(0, 10),
                              endDate: election.endDate?.slice(0, 10),
                              status: election.status,
                            });
                          }}
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          className="text-red-500 hover:underline flex items-center"
                          onClick={() => handleDeleteElection(election._id)}
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Election Modal */}
            {editElectionId && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Edit Election</h2>
                  <input
                    type="text"
                    placeholder="Election Title"
                    className="w-full border p-2 mb-3 rounded"
                    value={editElection.title}
                    onChange={(e) => setEditElection({ ...editElection, title: e.target.value })}
                  />
                  <input
                    type="date"
                    className="w-full border p-2 mb-3 rounded"
                    value={editElection.startDate}
                    onChange={(e) => setEditElection({ ...editElection, startDate: e.target.value })}
                  />
                  <input
                    type="date"
                    className="w-full border p-2 mb-3 rounded"
                    value={editElection.endDate}
                    onChange={(e) => setEditElection({ ...editElection, endDate: e.target.value })}
                  />
                  <select
                    className="w-full border p-2 mb-3 rounded"
                    value={editElection.status}
                    onChange={(e) => setEditElection({ ...editElection, status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="ended">Ended</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                      onClick={() => setEditElectionId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-[#464e47] text-white hover:bg-[#5a635c] transition"
                      onClick={handleEditElection}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Candidates */}
        {active === "Candidates" && (
          <div className="overflow-x-auto">
            <button
              className="bg-[#464e47] text-white px-4 py-2 rounded mb-4 hover:bg-[#5a635c] flex items-center transition"
              onClick={() => setShowCandidateModal(true)}
            >
              <FaPlus className="mr-2" /> Add Candidate
            </button>
            <div className="overflow-x-auto">
              <div className="flex flex-row flex-wrap gap-6 justify-start items-stretch">
                {candidates.map((candidate) => (
                  <div key={candidate._id || candidate.id || Math.random()} className="bg-white rounded-xl shadow-lg flex flex-row w-full md:w-[600px] min-h-[220px] border border-[#464e47]/20 animate-card cursor-pointer relative transition-all duration-300 hover:scale-[1.01] hover:shadow-[#464e47]/40 overflow-hidden">
                    {/* Candidate Image */}
                    <div className="flex-shrink-0 w-48 h-full flex items-center justify-center bg-[#e6e8e4]">
                      <img
                        src={candidate.candidatePhoto && candidate.candidatePhoto !== "" ? candidate.candidatePhoto : "https://placehold.co/160x160?text=No+Image"}
                        alt={candidate.name || "Candidate"}
                        className="w-36 h-36 object-cover rounded-full border-4 border-[#464e47]/30 shadow-lg"
                      />
                    </div>
                    {/* Candidate Info */}
                    <div className="flex flex-col flex-1 px-6 py-4 justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-[#464e47] mb-1 drop-shadow text-left">
                          {candidate.name || "N/A"}
                        </h3>
                        <p className="text-base text-[#464e47] mb-1 font-semibold flex items-center">
                          <span className="inline-block w-6 h-6 mr-2">
                            <img src={candidate.partyLogo && candidate.partyLogo !== "" ? candidate.partyLogo : "https://placehold.co/32x32?text=No+Logo"} alt="Party Logo" className="w-6 h-6 object-cover rounded-full border-2 border-white shadow bg-white/80" />
                          </span>
                          {candidate.party || "N/A"}
                        </p>
                        <p className="text-[#464e47]/80 text-sm italic mb-1 text-left">
                          {candidate.bio || "No bio available"}
                        </p>
                        <p className="text-xs text-gray-500 mb-1 text-left">
                          <span className="font-semibold">Election:</span> {candidate.election?.title || (elections.find(e => e._id === candidate.election)?.title || candidate.election)}
                        </p>
                        <p className="text-base font-bold text-[#464e47] mt-1 text-left">
                          Votes: {candidate.votes || 0}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4 justify-end">
                        <button
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 font-bold shadow hover:from-blue-200 hover:to-blue-400 flex items-center gap-2 transition text-xs"
                          onClick={() => {
                            setEditCandidateId(candidate._id);
                            setEditCandidate({
                              name: candidate.name,
                              party: candidate.party,
                              election: candidate.election?._id || candidate.election,
                              candidatePhoto: candidate.candidatePhoto,
                              partyLogo: candidate.partyLogo,
                              bio: candidate.bio || ""
                            });
                          }}
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-100 to-red-300 text-red-900 font-bold shadow hover:from-red-200 hover:to-red-400 flex items-center gap-2 transition"
                          onClick={() => handleDeleteCandidate(candidate._id)}
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Candidate Modal */}
            {editCandidateId && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white p-0 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
                  {/* Left: Image Preview & Party Logo */}
                  <div className="bg-[#e6e8e4] flex flex-col items-center justify-center p-8 md:w-1/3 w-full border-r border-[#464e47]/10">
                    <div className="mb-6">
                      <span className="block text-sm font-semibold mb-2 text-[#464e47]">Candidate Photo</span>
                      {editCandidate.candidatePhoto && typeof editCandidate.candidatePhoto !== "string" ? (
                        <img src={URL.createObjectURL(editCandidate.candidatePhoto)} alt="Candidate" className="w-32 h-32 object-cover rounded-full border-4 border-[#464e47]/30 shadow-lg" />
                      ) : editCandidate.candidatePhoto && typeof editCandidate.candidatePhoto === "string" ? (
                        <img src={editCandidate.candidatePhoto} alt="Candidate" className="w-32 h-32 object-cover rounded-full border-4 border-[#464e47]/30 shadow-lg" />
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full border-4 border-[#464e47]/10 text-gray-400">No Image</div>
                      )}
                      <input type="file" accept="image/*" className="mt-3 w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]" onChange={(e) => setEditCandidate({ ...editCandidate, candidatePhoto: e.target.files[0] })} />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold mb-2 text-[#464e47]">Party Logo</span>
                      {editCandidate.partyLogo && typeof editCandidate.partyLogo !== "string" ? (
                        <img src={URL.createObjectURL(editCandidate.partyLogo)} alt="Party Logo" className="w-20 h-20 object-cover rounded-full border-2 border-[#464e47]/30 shadow" />
                      ) : editCandidate.partyLogo && typeof editCandidate.partyLogo === "string" ? (
                        <img src={editCandidate.partyLogo} alt="Party Logo" className="w-20 h-20 object-cover rounded-full border-2 border-[#464e47]/30 shadow" />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full border-2 border-[#464e47]/10 text-gray-400">No Logo</div>
                      )}
                      <input type="file" accept="image/*" className="mt-3 w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]" onChange={(e) => setEditCandidate({ ...editCandidate, partyLogo: e.target.files[0] })} />
                    </div>
                  </div>
                  {/* Right: Form Fields */}
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#464e47]">Edit Candidate</h2>
                    <div className="grid grid-cols-1 gap-5">
                      <div>
                        <label className="font-semibold">Candidate Name</label>
                        <input type="text" placeholder="John Doe" className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47] w-full" value={editCandidate.name} onChange={(e) => setEditCandidate({ ...editCandidate, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="font-semibold">Party Name</label>
                        <input type="text" placeholder="Democratic" className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47] w-full" value={editCandidate.party} onChange={(e) => setEditCandidate({ ...editCandidate, party: e.target.value })} />
                      </div>
                      <div>
                        <label className="font-semibold">Short Bio</label>
                        <textarea placeholder="Short bio about the candidate" className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47] w-full" value={editCandidate.bio} onChange={(e) => setEditCandidate({ ...editCandidate, bio: e.target.value })} rows={3} />
                      </div>
                      <div>
                        <label className="font-semibold">Election</label>
                        <select className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47] w-full" value={editCandidate.election} onChange={(e) => setEditCandidate({ ...editCandidate, election: e.target.value })}>
                          <option value="">Select Election</option>
                          {elections.map((election) => (
                            <option key={election._id} value={election._id}>{election.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                      <button className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition" onClick={() => setEditCandidateId(null)}>Cancel</button>
                      <button className="px-6 py-2 rounded-lg bg-[#464e47] text-white hover:bg-[#5a635c] transition font-bold" onClick={handleEditCandidate}>Save Changes</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        {showElectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Election</h2>
              <input
                type="text"
                placeholder="Election Title"
                className="w-full border p-2 mb-3 rounded"
                value={newElection.title}
                onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
              />
              <input
                type="date"
                className="w-full border p-2 mb-3 rounded"
                value={newElection.startDate}
                onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })}
              />
              <input
                type="date"
                className="w-full border p-2 mb-3 rounded"
                value={newElection.endDate}
                onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
              />
              <select
                className="w-full border p-2 mb-3 rounded"
                value={newElection.status}
                onChange={(e) => setNewElection({ ...newElection, status: e.target.value })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="ended">Ended</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                  onClick={() => setShowElectionModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-[#464e47] text-white hover:bg-[#5a635c] transition"
                  onClick={handleAddElection}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

      {showCandidateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Candidate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Candidate Name */}
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Candidate Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>

              {/* Party Name */}
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Party Name</label>
                <input
                  type="text"
                  placeholder="Democratic"
                  className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]"
                  value={candidateParty}
                  onChange={(e) => setCandidateParty(e.target.value)}
                />
              </div>

              {/* Short Bio */}
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Short Bio</label>
                <textarea
                  placeholder="Short bio about the candidate"
                  className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]"
                  value={candidateBio}
                  onChange={(e) => setCandidateBio(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Election Selection */}
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Election</label>
                <select
                  className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]"
                  value={candidateElection}
                  onChange={(e) => setCandidateElection(e.target.value)}
                >
                  <option value="">Select Election</option>
                  {elections.map((election) => (
                    <option key={election._id} value={election._id}>{election.title}</option>
                  ))}
                </select>
              </div>

              {/* Candidate Photo */}
              <div className="flex flex-col ">
                <label className="mb-1 font-semibold ">Candidate Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]"
                  onChange={(e) => setCandidatePhoto(e.target.files[0])}
                />
                {candidatePhoto && (
                  <img
                    src={URL.createObjectURL(candidatePhoto)}
                    alt="Candidate"
                    className="mt-2 w-24 h-24 object-cover rounded-lg border"
                  />
                )}
              </div>

              {/* Party Logo */}
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Party Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border p-2 rounded-lg focus:ring-2 focus:ring-[#464e47]"
                  onChange={(e) => setPartyLogo(e.target.files[0])}
                />
                {partyLogo && (
                  <img
                    src={URL.createObjectURL(partyLogo)}
                    alt="Party Logo"
                    className="mt-2 w-24 h-24 object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-6 py-2 rounded-lg bg-[#464e47] text-white hover:bg-[#5a635c] transition"
                onClick={handleAddCandidate}
              >
                Add Candidate
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                onClick={() => setShowCandidateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

