import React from "react";
import "./Listing.css";
import { useEffect, useState } from "react";
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
import { BASE_URL } from "../../BASE_URL";

const ListingDetailsComp = ({ listingId }) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
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
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/listing/get/${listingId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  return (
    <div className="listing-details-page">
      {loading && <p>Loading...</p>}
      <Notification type={"error"} message={error} />
      <div className="image-slider">
        <Slider {...settings}>
          {listing?.imageUrls.map((img, index) => (
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
      <div className="details-container">
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
          Offer: {listing?.offer}
        </div>
        <div className="listing-detail">
          {listing?.furnished ? (
            <FaCheckCircle className="icon" />
          ) : (
            <FaTimesCircle className="icon" />
          )}{" "}
          Furnished: {listing?.furnished}
        </div>
        <div className="listing-detail">
          {listing?.parking === "garage" ? (
            <FaParking className="icon" />
          ) : listing?.parking ? (
            <FaParking className="icon" />
          ) : null}{" "}
          Parking:{" "}
          {listing?.parking === "garage"
            ? "Garage"
            : listing?.parking
            ? "Parking"
            : "None"}
        </div>
        <p className="listing-regular-price">
          Regular Price: ${listing?.regularPrice}
        </p>
        <p className="listing-discount-price">
          Discount Price: ${listing?.discountPrice}
        </p>
        <button
          className="contact-button"
          onClick={() => alert(`Contact: ${contact}`)}
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default ListingDetailsComp;
