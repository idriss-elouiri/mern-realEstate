import React from "react";
import "./Search.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../BASE_URL";

const SearchComp = () => {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: "none",
    address: "",
    price: "",
    category: "none",
    furnished: "",
    offer: "",
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const categoryFromUrl = urlParams.get("category");
    const addressFromUrl = urlParams.get("address");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      categoryFromUrl ||
      addressFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl || "none",
        address: addressFromUrl || "",
        furnished: furnishedFromUrl || "",
        category: categoryFromUrl || "none",
        offer: offerFromUrl || "",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listing/get?${searchQuery}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (
      e.target.id === "searchTerm" ||
      e.target.id === "address" ||
      e.target.id === "price"
    ) {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "category" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("address", sidebardata.address);
    urlParams.set("category", sidebardata.category);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  console.log(sidebardata);
  return (
    <div className="search-page">
      <div className="search-form">
        <h2>Search Properties</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Search Term:
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              id="address"
              onChange={handleChange}
              value={sidebardata.address}
            />
          </label>
          <div className="form-group">
            <label>Type:</label>
            <div className="toggle-buttons">
              <button
                type="button"
                className={`toggle-button ${
                  sidebardata.type === "all" ? "active" : ""
                }`}
                onClick={handleChange}
                id="all"
              >
                All
              </button>
              <button
                type="button"
                className={`toggle-button ${
                  sidebardata.type === "rent" ? "active" : ""
                }`}
                onClick={handleChange}
                id="rent"
              >
                Rent
              </button>
              <button
                type="button"
                className={`toggle-button ${
                  sidebardata.type === "sale" ? "active" : ""
                }`}
                onClick={handleChange}
                id="sale"
              >
                Sale
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="Category">Category:</label>
            <select
              id="category"
              name="category"
              onChange={handleChange}
              value={sidebardata.category}
            >
              <option value="none">None</option>
              <option value="apartment">Apartment</option>
              <option value="condos">Condos</option>
              <option value="offices">Offices</option>
              <option value="homes & villas">Homes & Villas</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <label>
            Parking:
            <select
              id="parking"
              value={setSidebardata.parking}
              onChange={handleChange}
            >
              <option value="">Any</option>
              <option value="garage">Garage</option>
              <option value="street">Street</option>
            </select>
          </label>
          <label>
            Furnished:
            <select
              id="furnished"
              onChange={handleChange}
              checked={sidebardata.furnished}
            >
              <option value="">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          <label>
            Offer:
            <select
              id="offer"
              onChange={handleChange}
              checked={sidebardata.offer}
            >
              <option value="">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          <label>
            Sort Order:
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </label>
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="property-list">
        {/* Replace this with your property data and rendering logic */}
        {listings?.map((val, index) => (
          <div className="property-card">
            <Link to={`/listing/${val._id}`}>
              <img src={val.imageUrls[0]} alt={val.name} />
            </Link>
            <Link to={`/listing/${val._id}`}>
              <h3>{val.name}</h3>
            </Link>
            <p>Address: {val.address}</p>
            <p>Type: House: {val.type}</p>
            <p>Furnished: {val.furnished}</p>
            <p>Parking: {val.parking}</p>
            <p>Category: {val.category}</p>
            <p>Price: {val.regularPrice}</p>
            <p>Bathrooms: {val.bathrooms}</p>
            <p>Bedrooms: {val.bedrooms}</p>
          </div>
        ))}
        {/* Add more property cards as needed */}
      </div>
    </div>
  );
};

export default SearchComp;
