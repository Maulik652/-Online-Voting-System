import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaHome,
  FaVoteYea,
  FaListOl,
  FaInfoCircle,
  FaEnvelope,
  FaUserShield,
  FaUserPlus,
  FaUser,
  FaLock,
  FaEnvelopeOpen,
} from "react-icons/fa";

export default function Navbar() {
  const [active, setActive] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Auth state
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState("");

  // Decode JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  // Calculate Age (18+ validation)
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
      const decoded = parseJwt(token);
      if (decoded) setRole(decoded.role || "");
    }
  }, []);

  const menuItems = [
    { name: "Home", link: "/", icon: <FaHome /> },
    { name: "Vote", link: "/vote", icon: <FaVoteYea /> },
    { name: "Result", link: "/result", icon: <FaListOl /> },
    { name: "About", link: "/about", icon: <FaInfoCircle /> },
    { name: "Contact", link: "/contact", icon: <FaEnvelope /> },
    { name: "Admin", link: "/admin", icon: <FaUserShield />, adminOnly: true },
  ];

  const isAdmin = role === "admin";

  // Handle Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (!dob) {
        return toast.error("Please select your Date of Birth");
      }

      const age = calculateAge(dob);
      if (age < 18) {
        return toast.error("You must be at least 18 years old to register");
      }

      if (password !== confirmPassword) {
        return toast.error("Passwords do not match!");
      }
    }

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin
        ? { email, password }
        : { name, email, password, dob };

      const res = await axios.post(url, payload);

      localStorage.setItem("token", res.data.token);
      setIsAuth(true);

      const decoded = parseJwt(res.data.token);
      if (decoded) setRole(decoded.role || "");

      toast.success(isLogin ? "Login successful!" : "Registration successful!");
      setShowModal(false);

      setName("");
      setEmail("");
      setDob("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setRole("");
    setShowLogoutConfirm(false);
    toast.success("Logged out successfully");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2200} />

      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <img
          src="./public/images/logo1.png"
          alt="Logo"
          className="h-11 w-40"
        />

        <ul className="flex space-x-6">
          {menuItems.map(
            (item) =>
              (!item.adminOnly || isAdmin) && (
                <li key={item.name}>
                  <a
                    href={item.link}
                    onClick={() => setActive(item.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-[#464e47] ${
                      active === item.name
                        ? "border-b-2 border-[#464e47]"
                        : ""
                    } hover:bg-gray-100`}
                  >
                    {item.icon} {item.name}
                  </a>
                </li>
              )
          )}
        </ul>

        {!isAuth ? (
          <button
            onClick={() => {
              setShowModal(true);
              setIsLogin(false);
            }}
            className="flex items-center gap-2 bg-[#464e47] text-white px-4 py-2 rounded-xl hover:bg-[#2f3430]"
          >
            <FaUserPlus /> Register
          </button>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
          >
            <FaUser /> Logout
          </button>
        )}
      </nav>

      {/* REGISTER / LOGIN MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✖
            </button>

            <div className="flex justify-center gap-6 mb-6">
              <button
                onClick={() => setIsLogin(false)}
                className={`font-semibold ${
                  !isLogin && "text-[#464e47] border-b-2 border-[#464e47]"
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setIsLogin(true)}
                className={`font-semibold ${
                  isLogin && "text-[#464e47] border-b-2 border-[#464e47]"
                }`}
              >
                Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <Input icon={<FaUser />} value={name} setValue={setName} placeholder="Full Name" />
                  <Input type="date" value={dob} setValue={setDob} />
                </>
              )}

              <Input icon={<FaEnvelopeOpen />} value={email} setValue={setEmail} placeholder="Email" />
              <Input icon={<FaLock />} type="password" value={password} setValue={setPassword} placeholder="Password" />

              {!isLogin && (
                <Input
                  icon={<FaLock />}
                  type="password"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  placeholder="Confirm Password"
                />
              )}

              <button className="w-full bg-[#464e47] text-white py-2 rounded-md hover:bg-[#2f3430]">
                {isLogin ? "Login" : "Register"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRM */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center">
            <p className="mb-4 font-semibold">Logout?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleLogoutConfirm} className="bg-red-600 text-white px-4 py-2 rounded">
                Yes
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* REUSABLE INPUT */
function Input({ icon, type = "text", value, setValue, placeholder }) {
  return (
    <div className="flex items-center border-b border-gray-300 pb-2">
      {icon && <span className="text-gray-400 mr-3">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none text-sm"
        required
      />
    </div>
  );
}
