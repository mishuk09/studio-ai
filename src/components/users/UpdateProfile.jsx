import axios from "axios";
import { useEffect, useState } from "react";

// Professional Input Component
const ProfessionalInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon = null,
  name,
}) => (
  <label className="flex flex-col text-gray-800">
    <span className="text-sm font-semibold mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          {icon}
        </span>
      )}
      <input
        type={type}
        name={name}
        className={`w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 text-base`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  </label>
);

// Professional Dropdown Component
const ProfessionalDropdown = ({
  label,
  value,
  onChange,
  options,
  required = false,
  icon = null,
  name,
}) => (
  <label className="flex flex-col text-gray-800">
    <span className="text-sm font-semibold mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
          {icon}
        </span>
      )}
      <select
        name={name}
        className={`w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 font-medium appearance-none cursor-pointer`}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">-- Select an option --</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </label>
);

// Option Pill Component for Radio/Checkbox
const OptionPill = ({ label, value, isChecked, isRadio, onChange, name }) => (
  <label
    className={`
      px-5 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-150 ease-in-out whitespace-nowrap inline-flex items-center gap-2 border
      ${
        isChecked
          ? "bg-blue-600 text-white shadow-lg transform"
          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-blue-400"
      }
    `}
  >
    <input
      type={isRadio ? "radio" : "checkbox"}
      name={name}
      value={value}
      checked={isChecked}
      onChange={onChange}
      className="hidden"
    />
    {isChecked && <span className="text-lg">✓</span>}
    {label}
  </label>
);

// Question Block Component
const QuestionBlock = ({ questionNumber, title, children, isMulti = false, note = null }) => (
  <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-lg border border-blue-100 shadow-sm">
    <div className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
      <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-lg text-sm">
        {questionNumber}
      </span>
      {title}
    </div>
    <div className="space-y-3">{children}</div>
    {isMulti && <p className="text-xs text-gray-600 mt-3 italic">✓ Select all that apply.</p>}
    {note && <p className="text-xs text-gray-600 mt-3 italic">{note}</p>}
  </div>
);

const UpdateProfile = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Option lists matching RegisterForm
  const programNames = [
    "University of Malaya (UM)",
    "Universiti Kebangsaan Malaysia (UKM)",
    "Universiti Putra Malaysia (UPM)",
    "Universiti Sains Malaysia (USM)",
    "Universiti Teknologi Malaysia (UTM)",
    "Taylors University",
    "Monash University Malaysia",
    "University of Nottingham Malaysia",
    "Sunway University",
    "Asia Pacific University (APU)",
    "Universiti Teknologi MARA (UiTM)",
    "International Islamic University Malaysia (IIUM)",
    "Multimedia University (MMU)",
    "UCSI University",
    "INTI International University",
    "Management & Science University (MSU)",
    "Universiti Utara Malaysia (UUM)",
    "Universiti Malaysia Sabah (UMS)",
    "Universiti Malaysia Sarawak (UNIMAS)",
    "Universiti Pendidikan Sultan Idris (UPSI)",
    "Universiti Kuala Lumpur (UniKL)",
    "Universiti Tenaga Nasional (UNITEN)",
    "Universiti Tunku Abdul Rahman (UTAR)",
    "HELP University",
    "SEGi University",
    "IMU University",
    "Curtin University Malaysia",
    "Heriot-Watt University Malaysia",
    "Xiamen University Malaysia",
    "Wawasan Open University (WOU)",
  ];

  const ageGroups = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"];
  const genderOptions = ["Male", "Female", "Prefer not to say", "Other"];
  const educationLevels = [
    "Primary school",
    "Secondary school",
    "Diploma/Certificate",
    "Bachelor's degree",
    "Master's degree or higher",
  ];
  const employmentStatuses = [
    "Student",
    "Employed full-time",
    "Employed part-time",
    "Self-employed",
    "Unemployed",
    "Retired",
  ];
  const locationOptions = ["Urban area", "Suburban area", "Rural area"];
  const languageOptions = ["English", "Malay", "Mandarin", "Tamil", "Other"];
  const skillOptions = [
    "Marketing",
    "Design",
    "Finance",
    "Customer service",
    "Tech/IT",
    "Product development",
  ];
  const workingStyleOptions = [
    "I prefer working independently",
    "I enjoy collaborating with others",
    "I like leading and managing teams",
    "I prefer flexible and spontaneous work environments",
  ];
  const areasConfidentOptions = [
    "Marketing and branding",
    "Financial planning",
    "Product development",
    "Customer service",
    "Technology and innovation",
    "Operations and logistics",
  ];
  const learningStyleOptions = [
    "Hands-on experience",
    "Workshops or courses",
    "Reading and researching",
    "Mentorship and networking",
  ];
  const traitOptions = [
    "Creative",
    "Analytical",
    "Detail-oriented",
    "Visionary",
    "Resilient",
    "Empathetic",
  ];
  const businessTypes = [
    "Product-based",
    "Service-based",
    "Online business",
    "Brick-and-mortar store",
    "Other",
  ];
  const entrepreneurshipLevels = [
    "Beginner (no experience)",
    "Intermediate (some experience or training)",
    "Advanced (actively running or have run a business)",
  ];
  const exposureAreas = [
    "Business planning",
    "Marketing and branding",
    "Financial management",
    "Product development",
    "Customer engagement",
    "Legal and regulatory compliance",
  ];
  const whyStartOptions = [
    "To solve a problem",
    "To pursue a passion",
    "To earn extra income",
    "To be my own boss",
    "Other",
  ];
  const commitmentOptions = ["Less than 1 year", "1–3 years", "3–5 years", "Long-term (5+ years)"];
  const interestedBusinessTypes = [
    "Product-based (e.g., food, fashion)",
    "Service-based (e.g., consulting, wellness)",
    "Experience-based (e.g., tourism, events)",
    "Tech/digital solutions",
  ];
  const preferCreateImprove = ["Creating something new", "Improving existing ideas"];
  const businessModelOptions = [
    "Online only",
    "Physical store",
    "Hybrid (online + offline)",
    "Pop-up or seasonal",
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cohortinformation: { programName: "", programDates: "", programVenue: "" },
    demographics: {
      ageGroup: "",
      gender: "",
      genderOther: "",
      educationLevels: [],
      employmentStatus: "",
      priorBusinessExperience: "",
      currentLocation: "",
      preferredLanguages: [],
      preferredLanguageOther: "",
      hobbiesInfluence: "",
      hobbiesDetails: "",
      skills: [],
      workingStyle: [],
      enjoysCreativeProblemSolving: "",
      areasConfident: [],
      preferredLearningStyle: [],
      comfortableTakingRisks: "",
      traits: [],
      everStartedBusiness: "",
      businessType: [],
      businessTypeOther: "",
      entrepreneurshipLevel: "",
      attendedTraining: "",
      followEntrepreneurContent: "",
      hasMentor: "",
      exposureAreas: [],
      familiarWithDigitalTools: "",
      whyStartBusiness: [],
      whyStartBusinessOther: "",
      hasClearVision: "",
      plannedCommitment: "",
      interestedBusinessTypes: [],
      preferCreateOrImprove: "",
      preferredBusinessModel: [],
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://qalib.cloud/api/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { user } = res.data;

        const arr = (val) => (Array.isArray(val) ? val : []);

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          cohortinformation: {
            programName: user.cohortinformation?.programName || "",
            programDates: user.cohortinformation?.programDates || "",
            programVenue: user.cohortinformation?.programVenue || "",
          },
          demographics: {
            ageGroup: user.demographics?.ageGroup || "",
            gender: user.demographics?.gender || "",
            genderOther: user.demographics?.genderOther || "",
            educationLevels: arr(user.demographics?.educationLevels),
            employmentStatus: user.demographics?.employmentStatus || "",
            priorBusinessExperience: user.demographics?.priorBusinessExperience || "",
            currentLocation: user.demographics?.currentLocation || "",
            preferredLanguages: arr(user.demographics?.preferredLanguages),
            preferredLanguageOther: user.demographics?.preferredLanguageOther || "",
            hobbiesInfluence: user.demographics?.hobbiesInfluence || "",
            hobbiesDetails: user.demographics?.hobbiesDetails || "",
            skills: arr(user.demographics?.skills),
            workingStyle: arr(user.demographics?.workingStyle),
            enjoysCreativeProblemSolving: user.demographics?.enjoysCreativeProblemSolving || "",
            areasConfident: arr(user.demographics?.areasConfident),
            preferredLearningStyle: arr(user.demographics?.preferredLearningStyle),
            comfortableTakingRisks: user.demographics?.comfortableTakingRisks || "",
            traits: arr(user.demographics?.traits),
            everStartedBusiness: user.demographics?.everStartedBusiness || "",
            businessType: arr(user.demographics?.businessType),
            businessTypeOther: user.demographics?.businessTypeOther || "",
            entrepreneurshipLevel: user.demographics?.entrepreneurshipLevel || "",
            attendedTraining: user.demographics?.attendedTraining || "",
            followEntrepreneurContent: user.demographics?.followEntrepreneurContent || "",
            hasMentor: user.demographics?.hasMentor || "",
            exposureAreas: arr(user.demographics?.exposureAreas),
            familiarWithDigitalTools: user.demographics?.familiarWithDigitalTools || "",
            whyStartBusiness: arr(user.demographics?.whyStartBusiness),
            whyStartBusinessOther: user.demographics?.whyStartBusinessOther || "",
            hasClearVision: user.demographics?.hasClearVision || "",
            plannedCommitment: user.demographics?.plannedCommitment || "",
            interestedBusinessTypes: arr(user.demographics?.interestedBusinessTypes),
            preferCreateOrImprove: user.demographics?.preferCreateOrImprove || "",
            preferredBusinessModel: arr(user.demographics?.preferredBusinessModel),
          },
        });
      } catch (error) {
        setMessage({ type: "error", text: "Error fetching profile data." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section === "cohortinformation") {
      setFormData((prev) => ({
        ...prev,
        cohortinformation: { ...prev.cohortinformation, [name]: value },
      }));
    } else if (section === "demographics") {
      setFormData((prev) => ({ ...prev, demographics: { ...prev.demographics, [name]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiToggle = (value, field) => {
    setFormData((prev) => {
      const currentList = prev.demographics[field] || [];
      const newList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...prev, demographics: { ...prev.demographics, [field]: newList } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // Prepare payload to match backend expectations
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        cohortinformation: formData.cohortinformation,
        demographics: formData.demographics,
      };

      console.log("Sending update payload:", payload);

      const res = await axios.put("https://qalib.cloud/api/update-profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Backend response:", res.data);
      console.log("Response status:", res.status);

      setMessage({ type: "success", text: "Profile updated successfully!" });

      // If email changed, backend returns a new token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Refetch profile to verify database update
      setTimeout(async () => {
        try {
          const newToken = res.data.token || token;
          const verifyRes = await axios.get("https://qalib.cloud/api/user-profile", {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          console.log("Verified data from DB:", verifyRes.data);

          // Check if data actually saved
          const dbUser = verifyRes.data.user;
          if (dbUser.fullName !== payload.fullName) {
            console.error("DB mismatch: fullName not saved!");
            setMessage({
              type: "error",
              text: "Data saved but verification failed. Please refresh.",
            });
          }
        } catch (err) {
          console.error("Verification error:", err);
        }
      }, 500);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("❌ Update error FULL:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Response headers:", error.response?.headers);
      const errorMsg =
        error.response?.data?.error || `Update failed. Status: ${error.response?.status}`;
      setMessage({ type: "error", text: errorMsg });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading your profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            📝 Update Your Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Keep your information up to date for a personalized experience.
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
            ✨ All your information in one place
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`fixed top-20 right-5 z-50 p-4 rounded-xl text-sm font-semibold border shadow-lg transition-all animate-in fade-in slide-in-from-top-4 ${
              message.type === "success"
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-red-50 border-red-300 text-red-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{message.type === "success" ? "✅" : "⚠️"}</span>
              <p>{message.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. ACCOUNT DETAILS */}
          <section className="pb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 pb-3 border-b-2 border-blue-200 flex items-center gap-2">
              <span className="text-2xl">👤</span> 1. Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfessionalInput
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                name="fullName"
                placeholder="Enter your full name"
              />
              <ProfessionalInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                placeholder="your.email@example.com"
              />
            </div>
          </section>

          {/* 2. COHORT DETAILS */}
          <section className="pb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 pb-3 border-b-2 border-blue-200 flex items-center gap-2">
              <span className="text-2xl">🎓</span> 2. Cohort Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProfessionalDropdown
                label="Program Name"
                value={formData.cohortinformation.programName}
                onChange={(e) => handleChange(e, "cohortinformation")}
                name="programName"
                options={programNames}
              />
              <ProfessionalInput
                label="Program Dates"
                type="date"
                value={formData.cohortinformation.programDates}
                onChange={(e) => handleChange(e, "cohortinformation")}
                name="programDates"
                placeholder="e.g., 2025-01-10"
              />
              <ProfessionalInput
                label="Program Venue"
                value={formData.cohortinformation.programVenue}
                onChange={(e) => handleChange(e, "cohortinformation")}
                name="programVenue"
                placeholder="e.g., Virtual / City Hall"
              />
            </div>
          </section>

          {/* 3. DEMOGRAPHIC & BACKGROUND */}
          <section className="pb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 pb-3 border-b-2 border-blue-200 flex items-center gap-2">
              <span className="text-2xl">📊</span> 3. Demographic & Background
            </h3>
            <div className="space-y-6">
              {/* Q1: Age Group */}
              <QuestionBlock questionNumber={1} title="Age Group">
                <div className="flex flex-wrap gap-2">
                  {ageGroups.map((g) => (
                    <OptionPill
                      key={g}
                      label={g}
                      value={g}
                      isRadio={true}
                      isChecked={formData.demographics.ageGroup === g}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, ageGroup: g },
                        }))
                      }
                      name="ageGroup"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q2: Gender */}
              <QuestionBlock questionNumber={2} title="Gender">
                <div className="flex flex-wrap gap-2 items-center">
                  {genderOptions.map((g) => (
                    <OptionPill
                      key={g}
                      label={g}
                      value={g}
                      isRadio={true}
                      isChecked={formData.demographics.gender === g}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          demographics: {
                            ...prev.demographics,
                            gender: g,
                            genderOther: g !== "Other" ? "" : prev.demographics.genderOther,
                          },
                        }));
                      }}
                      name="gender"
                    />
                  ))}
                  {formData.demographics.gender === "Other" && (
                    <input
                      className="p-3 border border-gray-300 rounded-lg shadow-sm"
                      placeholder="Please specify"
                      value={formData.demographics.genderOther}
                      onChange={(e) => handleChange(e, "demographics")}
                      name="genderOther"
                    />
                  )}
                </div>
              </QuestionBlock>

              {/* Q3: Education */}
              <QuestionBlock questionNumber={3} title="Highest Level of Education" isMulti={true}>
                <div className="flex flex-wrap gap-2">
                  {educationLevels.map((ed) => (
                    <OptionPill
                      key={ed}
                      label={ed}
                      value={ed}
                      isRadio={false}
                      isChecked={(formData.demographics.educationLevels || []).includes(ed)}
                      onChange={() => handleMultiToggle(ed, "educationLevels")}
                      name="educationLevels"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q4: Employment Status */}
              <QuestionBlock questionNumber={4} title="Current Employment Status">
                <div className="flex flex-wrap gap-2">
                  {employmentStatuses.map((s) => (
                    <OptionPill
                      key={s}
                      label={s}
                      value={s}
                      isRadio={true}
                      isChecked={formData.demographics.employmentStatus === s}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, employmentStatus: s },
                        }))
                      }
                      name="employmentStatus"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q5: Prior business experience */}
              <QuestionBlock questionNumber={5} title="Prior business experience">
                <div className="flex gap-2">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.priorBusinessExperience === choice}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, priorBusinessExperience: choice },
                        }))
                      }
                      name="priorBusinessExperience"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q6: Current Location */}
              <QuestionBlock questionNumber={6} title="Current Location">
                <div className="flex flex-wrap gap-2">
                  {locationOptions.map((loc) => (
                    <OptionPill
                      key={loc}
                      label={loc}
                      value={loc}
                      isRadio={true}
                      isChecked={formData.demographics.currentLocation === loc}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, currentLocation: loc },
                        }))
                      }
                      name="currentLocation"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q7: Preferred Language */}
              <QuestionBlock
                questionNumber={7}
                title="Preferred Language for Business"
                isMulti={true}
              >
                <div className="flex flex-wrap gap-2 items-center">
                  {languageOptions.map((lang) => (
                    <OptionPill
                      key={lang}
                      label={lang}
                      value={lang}
                      isRadio={false}
                      isChecked={(formData.demographics.preferredLanguages || []).includes(lang)}
                      onChange={() => handleMultiToggle(lang, "preferredLanguages")}
                      name="preferredLanguages"
                    />
                  ))}
                  {formData.demographics.preferredLanguages?.includes("Other") && (
                    <input
                      className="p-3 border border-gray-300 rounded-lg shadow-sm"
                      placeholder="Other language"
                      value={formData.demographics.preferredLanguageOther}
                      onChange={(e) => handleChange(e, "demographics")}
                      name="preferredLanguageOther"
                    />
                  )}
                </div>
              </QuestionBlock>

              {/* Section Header: Personal Interests & Strengths */}
              <h4 className="text-xl font-semibold text-blue-600 border-b-2 border-blue-300 pb-3 pt-6">
                Personal Interests & Strengths
              </h4>

              {/* Q8: Hobbies Influence */}
              <QuestionBlock questionNumber={8} title="Hobbies that could influence business idea">
                <div className="flex gap-2 items-center flex-wrap">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.hobbiesInfluence === choice}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          demographics: {
                            ...prev.demographics,
                            hobbiesInfluence: choice,
                            hobbiesDetails: choice === "No" ? "" : prev.demographics.hobbiesDetails,
                          },
                        }));
                      }}
                      name="hobbiesInfluence"
                    />
                  ))}
                  {formData.demographics.hobbiesInfluence === "Yes" && (
                    <input
                      className="p-3 border border-gray-300 rounded-lg shadow-sm flex-grow ml-4"
                      placeholder="If yes, please specify"
                      value={formData.demographics.hobbiesDetails}
                      onChange={(e) => handleChange(e, "demographics")}
                      name="hobbiesDetails"
                    />
                  )}
                </div>
              </QuestionBlock>

              {/* Q9: Skills */}
              <QuestionBlock questionNumber={9} title="Skills You Possess" isMulti={true}>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((s) => (
                    <OptionPill
                      key={s}
                      label={s}
                      value={s}
                      isRadio={false}
                      isChecked={(formData.demographics.skills || []).includes(s)}
                      onChange={() => handleMultiToggle(s, "skills")}
                      name="skills"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q10: Working Style */}
              <QuestionBlock questionNumber={10} title="Working Style" isMulti={true}>
                <div className="flex flex-wrap gap-2">
                  {workingStyleOptions.map((w) => (
                    <OptionPill
                      key={w}
                      label={w}
                      value={w}
                      isRadio={false}
                      isChecked={(formData.demographics.workingStyle || []).includes(w)}
                      onChange={() => handleMultiToggle(w, "workingStyle")}
                      name="workingStyle"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q11: Creative problem solving */}
              <QuestionBlock questionNumber={11} title="Enjoy solving problems creatively?">
                <div className="flex gap-2">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.enjoysCreativeProblemSolving === choice}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: {
                            ...prev.demographics,
                            enjoysCreativeProblemSolving: choice,
                          },
                        }))
                      }
                      name="enjoysCreativeProblemSolving"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q12: Areas confident */}
              <QuestionBlock
                questionNumber={12}
                title="Areas You Feel Most Confident In"
                isMulti={true}
              >
                <div className="flex flex-wrap gap-2">
                  {areasConfidentOptions.map((a) => (
                    <OptionPill
                      key={a}
                      label={a}
                      value={a}
                      isRadio={false}
                      isChecked={(formData.demographics.areasConfident || []).includes(a)}
                      onChange={() => handleMultiToggle(a, "areasConfident")}
                      name="areasConfident"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q13: Preferred learning style */}
              <QuestionBlock questionNumber={13} title="Preferred Learning Style" isMulti={true}>
                <div className="flex flex-wrap gap-2">
                  {learningStyleOptions.map((l) => (
                    <OptionPill
                      key={l}
                      label={l}
                      value={l}
                      isRadio={false}
                      isChecked={(formData.demographics.preferredLearningStyle || []).includes(l)}
                      onChange={() => handleMultiToggle(l, "preferredLearningStyle")}
                      name="preferredLearningStyle"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q14: Comfortable taking risks */}
              <QuestionBlock questionNumber={14} title="Comfortable taking calculated risks?">
                <div className="flex gap-2">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.comfortableTakingRisks === choice}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, comfortableTakingRisks: choice },
                        }))
                      }
                      name="comfortableTakingRisks"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q15: Traits */}
              <QuestionBlock
                questionNumber={15}
                title="Traits That Best Describe You"
                isMulti={true}
                note="Please choose up to three traits."
              >
                <div className="flex flex-wrap gap-2">
                  {traitOptions.map((t) => (
                    <OptionPill
                      key={t}
                      label={t}
                      value={t}
                      isRadio={false}
                      isChecked={(formData.demographics.traits || []).includes(t)}
                      onChange={() => handleMultiToggle(t, "traits")}
                      name="traits"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Section Header: Entrepreneurship Experience */}
              <h4 className="text-xl font-semibold text-blue-600 border-b-2 border-blue-300 pb-3 pt-6">
                Entrepreneurship Experience
              </h4>

              {/* Q16: Ever Started Business */}
              <QuestionBlock questionNumber={16} title="Ever started or managed a business before?">
                <div className="flex gap-2">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.everStartedBusiness === choice}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, everStartedBusiness: choice },
                        }))
                      }
                      name="everStartedBusiness"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q17: Business Type */}
              <QuestionBlock
                questionNumber={17}
                title="If yes, what type of business was it?"
                isMulti={true}
              >
                <div className="flex flex-wrap gap-2 items-center">
                  {businessTypes.map((b) => (
                    <OptionPill
                      key={b}
                      label={b}
                      value={b}
                      isRadio={false}
                      isChecked={(formData.demographics.businessType || []).includes(b)}
                      onChange={() => handleMultiToggle(b, "businessType")}
                      name="businessType"
                    />
                  ))}
                  {formData.demographics.businessType?.includes("Other") && (
                    <input
                      className="p-3 border border-gray-300 rounded-lg shadow-sm"
                      placeholder="Other business type"
                      value={formData.demographics.businessTypeOther}
                      onChange={(e) => handleChange(e, "demographics")}
                      name="businessTypeOther"
                    />
                  )}
                </div>
              </QuestionBlock>

              {/* Q18: Entrepreneurship Level */}
              <QuestionBlock questionNumber={18} title="Entrepreneurship Experience Level">
                <div className="flex flex-wrap gap-2">
                  {entrepreneurshipLevels.map((l) => (
                    <OptionPill
                      key={l}
                      label={l}
                      value={l}
                      isRadio={true}
                      isChecked={formData.demographics.entrepreneurshipLevel === l}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, entrepreneurshipLevel: l },
                        }))
                      }
                      name="entrepreneurshipLevel"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q19: Attended Training */}
              <QuestionBlock questionNumber={19} title="Attended training/workshops?">
                <div className="flex gap-2">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.attendedTraining === choice}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, attendedTraining: choice },
                        }))
                      }
                      name="attendedTraining"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q20: Follow Entrepreneur Content */}
              <QuestionBlock questionNumber={20} title="Follow entrepreneurship content?">
                <div className="flex gap-2">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.followEntrepreneurContent === choice}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, followEntrepreneurContent: choice },
                        }))
                      }
                      name="followEntrepreneurContent"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q21: Has Mentor */}
              <QuestionBlock questionNumber={21} title="Have a mentor or advisor?">
                <div className="flex gap-2">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.hasMentor === choice}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, hasMentor: choice },
                        }))
                      }
                      name="hasMentor"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q22: Exposure Areas */}
              <QuestionBlock
                questionNumber={22}
                title="Areas You've Been Exposed To"
                isMulti={true}
              >
                <div className="flex flex-wrap gap-2">
                  {exposureAreas.map((ea) => (
                    <OptionPill
                      key={ea}
                      label={ea}
                      value={ea}
                      isRadio={false}
                      isChecked={(formData.demographics.exposureAreas || []).includes(ea)}
                      onChange={() => handleMultiToggle(ea, "exposureAreas")}
                      name="exposureAreas"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q23: Digital Tools */}
              <QuestionBlock questionNumber={23} title="Familiar with digital tools for business?">
                <div className="flex gap-2">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.familiarWithDigitalTools === choice}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, familiarWithDigitalTools: choice },
                        }))
                      }
                      name="familiarWithDigitalTools"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Section Header: Vision & Motivation */}
              <h4 className="text-xl font-semibold text-blue-600 border-b-2 border-blue-300 pb-3 pt-6">
                Vision & Motivation
              </h4>

              {/* Q24: Why Start Business */}
              <QuestionBlock
                questionNumber={24}
                title="Why do you want to start a business?"
                isMulti={true}
              >
                <div className="flex flex-wrap gap-2 items-center">
                  {whyStartOptions.map((w) => (
                    <OptionPill
                      key={w}
                      label={w}
                      value={w}
                      isRadio={false}
                      isChecked={(formData.demographics.whyStartBusiness || []).includes(w)}
                      onChange={() => handleMultiToggle(w, "whyStartBusiness")}
                      name="whyStartBusiness"
                    />
                  ))}
                  {formData.demographics.whyStartBusiness?.includes("Other") && (
                    <input
                      className="p-3 border border-gray-300 rounded-lg shadow-sm"
                      placeholder="Other reason"
                      value={formData.demographics.whyStartBusinessOther}
                      onChange={(e) => handleChange(e, "demographics")}
                      name="whyStartBusinessOther"
                    />
                  )}
                </div>
              </QuestionBlock>

              {/* Q25: Has Clear Vision */}
              <QuestionBlock
                questionNumber={25}
                title="Do you have a clear vision for your business?"
              >
                <div className="flex gap-2">
                  {["Yes", "No"].map((choice) => (
                    <OptionPill
                      key={choice}
                      label={choice}
                      value={choice}
                      isRadio={true}
                      isChecked={formData.demographics.hasClearVision === choice}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, hasClearVision: choice },
                        }))
                      }
                      name="hasClearVision"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q26: Planned Commitment */}
              <QuestionBlock questionNumber={26} title="Planned Commitment">
                <div className="flex flex-wrap gap-2">
                  {commitmentOptions.map((c) => (
                    <OptionPill
                      key={c}
                      label={c}
                      value={c}
                      isRadio={true}
                      isChecked={formData.demographics.plannedCommitment === c}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, plannedCommitment: c },
                        }))
                      }
                      name="plannedCommitment"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q27: Interested Business Types */}
              <QuestionBlock
                questionNumber={27}
                title="Type of Business You're Interested In"
                isMulti={true}
              >
                <div className="flex flex-wrap gap-2">
                  {interestedBusinessTypes.map((b) => (
                    <OptionPill
                      key={b}
                      label={b}
                      value={b}
                      isRadio={false}
                      isChecked={(formData.demographics.interestedBusinessTypes || []).includes(b)}
                      onChange={() => handleMultiToggle(b, "interestedBusinessTypes")}
                      name="interestedBusinessTypes"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q28: Prefer Create or Improve */}
              <QuestionBlock
                questionNumber={28}
                title="Prefer: Creating new or Improving existing ideas?"
              >
                <div className="flex flex-wrap gap-2">
                  {preferCreateImprove.map((p) => (
                    <OptionPill
                      key={p}
                      label={p}
                      value={p}
                      isRadio={true}
                      isChecked={formData.demographics.preferCreateOrImprove === p}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          demographics: { ...prev.demographics, preferCreateOrImprove: p },
                        }))
                      }
                      name="preferCreateOrImprove"
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q29: Preferred Business Model */}
              <QuestionBlock questionNumber={29} title="Preferred Business Model" isMulti={true}>
                <div className="flex flex-wrap gap-2">
                  {businessModelOptions.map((bm) => (
                    <OptionPill
                      key={bm}
                      label={bm}
                      value={bm}
                      isRadio={false}
                      isChecked={(formData.demographics.preferredBusinessModel || []).includes(bm)}
                      onChange={() => handleMultiToggle(bm, "preferredBusinessModel")}
                      name="preferredBusinessModel"
                    />
                  ))}
                </div>
              </QuestionBlock>
            </div>
          </section>

          {/* SUBMIT BUTTON */}
          <div className="flex items-center justify-center pt-8 border-t-2 border-gray-300">
            <button
              type="submit"
              className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              ✓ Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
