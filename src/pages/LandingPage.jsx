import { Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import Home from "./home";

const tabs = [
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
  },
  {
    id: "video",
    label: "Facebook",
    icon: Facebook,
  },
  // {
  //   id: "audio",
  //   label: "Audio",
  //   icon: Headphones,
  // },
  // {
  //   id: "files",
  //   label: "PDF, Image & More Files",
  //   icon: FileText,
  // },
  // {
  //   id: "webpage",
  //   label: "Webpage",
  //   icon: Globe,
  // },
  // {
  //   id: "text",
  //   label: "Long Text",
  //   icon: Type,
  // },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("youtube");

  return (
    <section className=" pt-10 min-h-screen items-center   bg-[var(--primary-color)] px-6  ">
      <div className="mx-auto w-full max-w-6xl">
        {/* Heading */}
        <div className="text-center">
          {/* <h1 className="text-4xl font-bold   text-white  ">Welcome to Studio AI NewsDesk 👋</h1> */}
          <h1 className="text-4xl font-bold   text-white  ">Welcome to AI Video Intelligence 👋</h1>

          <p className="mt-5 text-lg text-slate-300  ">
            Extract transcripts from YouTube videos, review the result, then copy or save it for
            later.{" "}
          </p>
          {/* <p className="mt-5 text-lg text-slate-300 md:text-xl">
            Convert, organize, and review your content from one workspace.{" "}
          </p> */}
        </div>

        {/* Tabs */}
        {/* <div className="mt-12 rounded-lg border border-slate-700/60 bg-slate-900/70 p-2 backdrop-blur"> */}
        <div className="mt-12 rounded-lg border border-[var(--border-color)] bg-slate-900/70 p-2 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2  ">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[var(--primary-color)] text-white shadow-lg ring-1 ring-blue-600 shadow-blue-600/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-10 rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-white">
          {activeTab === "youtube" && (
            <div>
              <Home />
            </div>
          )}

          {activeTab === "video" && (
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Facebook Video to Text</h2>
              <p className="text-slate-400">Upcoming.........</p>
            </div>
          )}

          {activeTab === "audio" && (
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Audio Notes</h2>
              <p className="text-slate-400">Upload an audio file and summarize it.</p>
            </div>
          )}

          {activeTab === "files" && (
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Documents</h2>
              <p className="text-slate-400">Upload PDF, DOCX, Images and more.</p>
            </div>
          )}

          {activeTab === "webpage" && (
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Webpage Notes</h2>
              <p className="text-slate-400">Paste any webpage URL for instant notes.</p>
            </div>
          )}

          {activeTab === "text" && (
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Long Text</h2>
              <p className="text-slate-400">
                Paste long content and convert it into structured notes.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
