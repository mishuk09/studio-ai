import { useEffect, useState } from "react";

export default function useUserData() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user profile
      // const res = await fetch("https://pressai.info/api/user-profile", {
        const res = await fetch("https://pressai.info/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUserData(data.user);
      } else {
        throw new Error(data.error || "Failed to fetch profile");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("No token found");
      return;
    }

    fetchData();
  }, [token]);

  const refetch = () => {
    if (token) {
      fetchData();
    }
  };

  return { userData, loading, error, refetch };
}
