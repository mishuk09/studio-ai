"use client";

import axios from "axios";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { BarChart3, Loader2, Plus, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ProfileQue = () => {
  const [chartData, setChartData] = useState(null);
  const [groupInfo, setGroupInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [ieiScore, setIeiScore] = useState(null);
  const navigate = useNavigate();

  const summarizeSurvey = (survey) => {
    const groups = {};

    if (!survey) return { summarized: {}, info: {} };

    Object.keys(survey).forEach((key) => {
      const match = key.match(/[A-Za-z]+/);
      if (!match) return;

      const group = match[0]; // e.g. D, H, Att, PBC, II, etc.
      if (!groups[group]) groups[group] = [];

      const value = parseFloat(survey[key]);
      if (!Number.isNaN(value)) {
        groups[group].push(value);
      }
    });

    const summarized = {};
    const info = {};

    Object.keys(groups).forEach((group) => {
      const values = groups[group];
      if (!values.length) return;

      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      summarized[group] = avg;
      info[group] = {
        average: avg,
        answered: values.length,
      };
    });

    return { summarized, info };
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://qalib.cloud/api/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { summarized, info } = summarizeSurvey(res.data.user?.survey || {});
        setGroupInfo(info);

        // IEI = D + H + Att + PBC + II (keep logic as-is)
        const ieiGroups = ["D", "H", "Att", "PBC", "II"];
        const ieiValues = ieiGroups
          .map((key) => summarized[key])
          .filter((val) => typeof val === "number" && !Number.isNaN(val));

        const totalIei = ieiValues.length > 0 ? ieiValues.reduce((a, b) => a + b, 0) : 0;

        setIeiScore(totalIei.toFixed(2));

        // --- Build chart data for spider web ---
        // 1) Remove "I" and "II" from the radar chart
        // 2) Take only the first 10 groups
        const cleanedEntries = Object.entries(summarized).filter(
          ([key]) => key !== "I" && key !== "II"
        );

        const limitedEntries = cleanedEntries.slice(0, 10);

        const labels = limitedEntries.map(([key]) => key);
        const values = limitedEntries.map(([_, val]) => val);

        if (labels.length === 0) {
          setChartData(null);
        } else {
          setChartData({
            labels,
            datasets: [
              {
                label: "Average Scores",
                data: values,
                backgroundColor: "rgba(34, 202, 236, 0.2)",
                borderColor: "rgba(34, 202, 236, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(34, 202, 236, 1)",
              },
            ],
          });
        }
      } catch (err) {
        console.error(err);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="ml-3 text-gray-600 text-lg">Loading your QEQ Profile...</p>
      </div>
    );

  if (!chartData) return <p className="text-center text-gray-600 mt-6">No survey data found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-10 ">
      {/* <div className="mb-6  ">
        <button
          onClick={() => navigate("/survey-form")}
          className="bg-indigo-600 flex gap-2 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus /> Add QEQ Profile Survey
        </button>
      </div> */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Your Score Section */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <h1 className="text-xl flex font-bold text-gray-800 text-center">
            <Star className="text-yellow-500 w-6 h-6" />
            Qalb Entrepreneurial Quotient Score
          </h1>

          {/* IEI Total */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-indigo-600 flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              {ieiScore}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{/* (IEI = D + H + Att + PBC + II) */}</p>
          </div>

          {/* Individual Scores */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center mt-6">
            {["D", "H", "Att", "PBC", "II"].map((group) => (
              <div
                key={group}
                className="p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-indigo-50 transition-all duration-300"
              >
                <p className="text-sm font-medium text-gray-600">{group}</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {groupInfo[group]?.average ? groupInfo[group].average.toFixed(2) : "N/A"}
                </p>
              </div>
            ))}
          </div> */}
        </div>

        {/* Spider Web Section */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="text-blue-500 w-6 h-6" />
            <h1 className="text-xl font-bold text-gray-800">Your Spider Web</h1>
          </div>

          <Radar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 5,
                  ticks: { stepSize: 1 },
                  grid: { color: "rgba(0,0,0,0.1)" },
                  angleLines: { color: "rgba(0,0,0,0.1)" },
                },
              },
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const labelIndex = tooltipItem.dataIndex;
                      const group = chartData.labels[labelIndex];
                      const avg = groupInfo[group]?.average
                        ? groupInfo[group].average.toFixed(2)
                        : "0.00";
                      const answered = groupInfo[group]?.answered ?? 0;
                      return `${group}: ${avg} (${answered} answered)`;
                    },
                  },
                },
              },
            }}
          />

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-700">
            <span>
              <strong>D:</strong> Darruriyat
            </span>
            <span>
              <strong>H:</strong> Hajiyyat
            </span>
            <span>
              <strong>T:</strong> Tahsiniyyat
            </span>
            <span>
              <strong>Hip:</strong> Hipster
            </span>
            <span>
              <strong>Hac:</strong> Hacker
            </span>
            <span>
              <strong>Hus:</strong> Hustler
            </span>
            <span>
              <strong>Att:</strong> Attitude
            </span>
            <span>
              <strong>SN:</strong> Subjective Norms
            </span>
            <span>
              <strong>PBC:</strong> Perceived Behavioural Control
            </span>
            <span>
              <strong>Y:</strong> Intention
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileQue;
