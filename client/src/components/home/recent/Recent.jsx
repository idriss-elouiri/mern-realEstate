import React, { useEffect, useState } from "react";
import Heading from "../../common/Heading";
import "./Recent.css";
import RecentCard from "./RecentCard";

const Recent = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/get?limit=8`);
        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch listings.");
          return;
        }

        setListings(data.listings || []);
      } catch (error) {
        setError(error.message || "An error occurred while fetching listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <section className="recent padding">
      <div className="container">
        <Heading
          title="Recent Properties Listed"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
        />
        <RecentCard listings={listings} />
      </div>
    </section>
  );
};

export default Recent;
