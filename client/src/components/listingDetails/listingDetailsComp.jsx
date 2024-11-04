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

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch listing.");
        }

        setListing(data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const renderListingDetails = () => (
    <>
      <h1 className="listing-title">{listing?.name}</h1>
      <p className="listing-description">{listing?.description}</p>
      <div className="listing-detail">
        <FaMapMarkerAlt className="icon" /> Address: {listing?.address}
      </div>
      <div className="listing-detail">
        <FaHome className="icon" /> Type: {listing?.type}
      </div>
      <div className="listing-detail">
        <FaBed className="icon" /> Bedrooms: {listing?.bedrooms}
      </div>
      <div className="listing-detail">
        <BiCategory className="icon" /> Category: {listing?.category}
      </div>
      <div className="listing-detail">
        <FaBath className="icon" /> Bathrooms: {listing?.bathrooms}
      </div>
      <div className="listing-detail">
        <span className="icon">
          {listing?.offer ? <FaCheckCircle /> : <FaTimesCircle />}
        </span>{" "}
        Offer: {listing?.offer ? "Yes" : "No"}
      </div>
      <div className="listing-detail">
        <span className="icon">
          {listing?.furnished ? <FaCheckCircle /> : <FaTimesCircle />}
        </span>{" "}
        Furnished: {listing?.furnished ? "Yes" : "No"}
      </div>
      <div className="listing-detail">
        {listing?.parking && <FaParking className="icon" />}
        Parking: {listing?.parking === "garage" ? "Garage" : listing?.parking || "None"}
      </div>
      <p className="listing-regular-price">
        Regular Price: ${listing?.regularPrice}
      </p>
      <p className="listing-discount-price">
        Discount Price: ${listing?.discountPrice}
      </p>
      <button className="contact-button" onClick={() => alert(`Contact: ${currentUser?.email}`)}>
        Contact
      </button>
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
