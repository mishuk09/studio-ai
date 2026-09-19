import { Database, FileText, LogOut, Menu, PenIcon, User, Video, X } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import mainLogo from "../../assets/main-logo.png";
import useUserData from "../../utills/useUserData";

const sections = [
  { id: 1, name: "Video to Text", icon: <Video />, path: "/" },
  { id: 3, name: "Re-Write", icon: <PenIcon />, path: "/rewrite" },
  { id: 4, name: "Saved News", icon: <Database />, path: "/all-news" },
  { id: 5, name: "Your Note", icon: <FileText />, path: "/notes" },
  { id: 6, name: "Logout", icon: <LogOut />, path: "/logout" },
];

export default function Layout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { userData } = useUserData();
  const [profileOpen, setProfileOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfileOpen(false);
    navigate("/signin");
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  return (
    <div className="flex h-auto overflow-x-auto min-h-screen bg-blue-50">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className={`md:hidden p-2 ${
          isOpen
            ? "bg-gray-800 text-white fixed top-2 left-2 z-50 rounded-lg"
            : "bg-gray-100 text-black fixed top-2 left-2 z-50 rounded-lg"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[250px] z-20 transform border-r border-slate-700/60 bg-slate-950 p-4 text-white ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0`}
      >
        <Link className="flex gap-5 mt-14 md:mt-0 mb-6 border-b border-white/10 pb-5" to="/">
          <img src={mainLogo} alt="Main Logo" className="w-10 h-10 " />
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Studio AI </h1>
        </Link>

        <nav className="flex h-[calc(100%-92px)] flex-col justify-between">
          <div className="sidebar-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
            {sections.map((section) =>
              section.name === "Logout" ? null : (
                <button
                  key={section.id}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    location.pathname === section.path
                      ? "border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-fuchsia-500/10 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.12)]"
                      : " text-[var(--text-color)] font-medium hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => {
                    navigate(section.path);
                    setIsOpen(false);
                  }}
                >
                  {section.icon}
                  {section.name}
                </button>
              )
            )}
          </div>

          <div className="relative mt-4 border-t border-white/10 pt-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-white/5"
                  title="Profile"
                >
                  {userData?.profilePhoto?.path ? (
                    <img
                      src={userData.profilePhoto.path}
                      alt="Avatar"
                      className="h-11 w-11 rounded-full border-2 border-white object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-blue-200 bg-white text-2xl text-slate-700">
                      <User />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {userData?.fullName || "My Profile"}
                    </p>
                    <p className="text-xs text-white/60">{userData?.email}</p>
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute bottom-full right-0 mb-3 w-48 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/30">
                    <button
                      onClick={() => {
                        navigate("/");
                        setProfileOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-white/90 hover:bg-white/5"
                    >
                      Home
                    </button>
                    <button
                      onClick={() => {
                        handleProfile();
                        setProfileOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-white/90 hover:bg-white/5"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-300 hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/signin");
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-3 py-3 text-left font-medium text-white transition hover:bg-white/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-slate-700">
                  <User />
                </span>
                <div>
                  <p className="text-sm font-medium">Sign In</p>
                  <p className="text-xs text-white/60">Access your account</p>
                </div>
              </button>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1  md:ml-[250px]">
        <Outlet />
      </main>
    </div>
  );
}
