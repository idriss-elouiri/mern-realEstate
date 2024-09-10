import React, { useEffect, useState } from "react";
import Heading from "../../common/Heading";
import "./Recent.css";
import RecentCard from "./RecentCard";

const Recent = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/get?limit=8`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListings(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchListing();
  }, []);
  console.log(listings);
  return (
    <>
      <section className="recent padding">
        <div className="container">
          <Heading
            title="Recent Property Listed"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
          />
          <RecentCard listings={listings} />
        </div>
      </section>
    </>
  );
};

export default Recent;
