import React, { useEffect, useState } from "react";
import "./Listing.css";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaTag,
  FaHome,
  FaParking,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import Notification from "../notification/Notification";

const ListingDetailsComp = ({ listingId }) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/listing/get/${listingId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();

        console.log("Fetched data:", data); // Check the data structure

        // Assuming the response is directly the listing object
        setListing(data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  useEffect(() => {
    console.log("Updated listing state:", listing);
  }, [listing]);

  const renderListingDetails = () => (
    <>
      <h1 className="listing-title">{listing?.name}</h1>
      <p className="listing-description">{listing?.description}</p>
      {/* Other details rendering */}
    </>
  );

  return (
    <div className="listing-details-page">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <Notification type="error" message={error} />
      ) : (
        <>
          {listing?.imageUrls.length > 0 ? (
            <div className="image-slider">
              <Slider {...settings}>
                {listing.imageUrls.map((img, index) => (
                  <div key={index} className="slider-item">
                    <img
                      src={img}
                      alt={`${listing?.name} ${index}`}
                      className="slider-image"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <p>No images available.</p>
          )}
          <div className="details-container">{renderListingDetails()}</div>
        </>
      )}
    </div>
  );
};

export default ListingDetailsComp;
