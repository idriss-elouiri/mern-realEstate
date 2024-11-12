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
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/listing/get?limit=8`
        );
        const data = await response.json();
        console.log("API Response:", data); // Check the entire response structure

        // If the response is an array, set listings directly
        if (Array.isArray(data)) {
          setListings(data); // Set the listings directly from the array
        } else if (data.success) {
          setListings(data.listings); // Adjust based on the actual structure if necessary
        } else {
          setError(data.message || "Failed to fetch listings.");
        }
      } catch (error) {
        console.error("Fetch error:", error); // Log full error for debugging
        setError(error.message || "An error occurred while fetching listings.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchListings();
  }, []);

  console.log("Current Listings State:", listings); // Log the state of listings

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (listings.length === 0) {
    return <div className="no-listings">No recent listings available.</div>;
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
