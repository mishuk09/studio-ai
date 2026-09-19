import axios from "axios";
import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

import { uploadToCloudinary } from "../../utills/cloudinaryUpload";
import MiniLoading from "../../utills/MiniLoading";
import useUserData from "../../utills/useUserData";
import UpdateProfile from "./updateprofile";

const API_URL = "https://pressai.info/api/users";

export default function ProfileCard() {
  const { userData, loading } = useUserData();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [secondModalOpen, setSecondModalOpen] = React.useState(false);
  // const [siteusers, setSiteusers] = useState([]);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("token"); // or however you store JWT

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);

      await axios.post(
        "https://qalib.cloud/api/user/upload-profile-photo",
        { profilePhotoUrl: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Profile photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);

      await axios.post(
        "https://qalib.cloud/api/user/upload-cover-photo",
        { coverPhotoUrl: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Cover photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-20"
          onClick={() => setModalOpen(false)} // click outside closes modal
        >
          {/* Modal Content */}
          <div
            className="bg-white relative p-6 max-w-4xl w-full h-[80vh] rounded-xl shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // prevent close on inside click
          >
            {/* Header with Close */}

            <button
              onClick={() => setModalOpen(false)}
              className="px-2 py-1 absolute top-2 right-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              ✕
            </button>

            {/* Scrollable Content */}
            <UpdateProfile />
          </div>
        </div>
      )}
      {secondModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-20"
          onClick={() => setSecondModalOpen(false)} // click outside closes modal
        >
          {/* Modal Content */}
          <div
            className="bg-white relative p-6 max-w-4xl w-full h-[80vh] rounded-xl shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // prevent close on inside click
          >
            {/* Header with Close */}

            <button
              onClick={() => setSecondModalOpen(false)}
              className="px-2 py-1 absolute top-2 right-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              ✕
            </button>

            {/* Scrollable Content */}
            {/* <BehaviorQuestion /> */}
          </div>
        </div>
      )}

      <div className="bg-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <main className="lg:col-span-9 space-y-6">
            {/* Profile header card */}
            <section className="bg-white rounded-xl shadow p-3 overflow-hidden">
              <div className="relative">
                <div className="relative h-44 rounded-lg overflow-hidden">
                  {userData?.coverPhoto?.path ? (
                    <img
                      src={userData.coverPhoto.path}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-600" />
                  )}

                  {/* Edit icon */}
                  <label className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer">
                    <FaCamera />
                    <input type="file" accept="image/*" hidden onChange={handleCoverUpload} />
                  </label>
                </div>

                {/* Avatar (overlapping) */}
                <div className="absolute left-6 top-26">
                  <div className="relative w-24 h-24">
                    {userData?.profilePhoto?.path ? (
                      <img
                        src={userData.profilePhoto.path}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <span className="w-24 h-24 flex items-center justify-center text-6xl border-2 border-white rounded-full bg-white">
                        {userData?.demographics?.gender?.toLowerCase() === "male" ? "M" : "F"}
                      </span>
                    )}

                    {/* Edit icon */}
                    <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
                      <FaCamera size={14} />
                      <input type="file" accept="image/*" hidden onChange={handleProfileUpload} />
                    </label>
                  </div>
                </div>

                {/* Profile content (moved right to leave room for avatar) */}
                <div className="ml-4  pt-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="mt-3 text-xl lg:text-2xl font-semibold">
                        {loading ? <MiniLoading /> : userData?.fullName}
                      </h2>
                      {/* <p className="text-sm leading-4 text-gray-500">
                        🎓{userData?.demographics?.field_of_study}
                      </p>
                      <p className="text-sm mt-1 text-gray-400">
                        🏠︎ {userData?.demographics?.place_of_residence}
                      </p> */}
                    </div>

                    <div className="mt-4 flex-row  md:mt-0 text-end  items-end  justify-end gap-3">
                      {/* <div>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
                        >
                          Update Profile
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={handleNavigate}
                          className="inline-flex items-center gap-2 px-4 py-2 mt-1 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition"
                        >
                          QEQ Profile
                        </button>
                      </div> */}
                    </div>
                  </div>

                  {/* Socials & contact */}
                  {/* <div className="mt-4 flex items-center gap-3">
                    <a
                      href="https://github.com/mishuk09"
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-600 hover:text-black transition"
                      aria-label="GitHub"
                    >
                      <FaGithub size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin size={20} />
                    </a>
                    <a
                      href="mailto:your.email@example.com"
                      className="text-gray-600 hover:text-indigo-600 transition"
                      aria-label="Email"
                    >
                      <FaEnvelope size={18} />
                    </a>
                  </div> */}

                  {/* About & Skills */}

                  <div className="mt-6 border-t pt-4">
                    <h2 className="font-semibold text-gray-800">User Information</h2>

                    {/* Age Group + Location */}
                    <div className="mt-3 text-sm text-gray-600 space-y-1 mb-10">
                      {userData?.demographics?.ageGroup && (
                        <p>
                          🎯 <span className="font-medium">Age Group:</span>{" "}
                          {userData.demographics.ageGroup}
                        </p>
                      )}

                      {userData?.demographics?.currentLocation && (
                        <p>
                          📍 <span className="font-medium">Location:</span>{" "}
                          {userData.demographics.currentLocation}
                        </p>
                      )}
                    </div>

                    {/* <ProfileQue /> */}
                  </div>
                </div>
              </div>
            </section>
            <h2 className="text-2xl font-semibold">Post</h2>
            <div className="overflow-x-auto overflow-hidden">{/* <Feed /> */}</div>
          </main>

          {/* Right column - 3/12 (25%) on large screens --> use lg:col-span-3 */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow p-4 sticky top-24">
              <div className="mt-4 border-t pt-4 text-sm text-gray-500">© 2025 Qalib Network</div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
