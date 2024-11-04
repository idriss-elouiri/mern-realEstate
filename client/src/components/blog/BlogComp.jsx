import React, { useEffect, useState } from "react";
import Back from "../common/Back";
import "../home/recent/Recent.css";
import img from "../images/blog.jpg";
import RecentCard from "../recent/RecentCard";

const BlogComp = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/listing/get`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        if (data.success === false) {
          throw new Error(data.message);
        }

        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="blog-out mb">
      <Back name="Blog" title="Blog Grid - Our Blogs" cover={img} />
      <div className="container recent">
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <p>No listings available.</p>
        )}
        {!loading && !error && listings.length > 0 && (
          <RecentCard listings={listings} />
        )}
      </div>
    </section>
  );
};

export default BlogComp;
