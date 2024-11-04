import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Search.css";

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
    const params = Object.fromEntries(urlParams.entries());
    setSidebardata(prevState => ({
      ...prevState,
      ...params,
      type: params.type || "all",
      category: params.category || "none",
      sort: params.sort || "created_at",
      order: params.order || "desc"
    }));
    
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/get?${urlParams.toString()}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data);
        setShowMore(data.length > 8);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebardata(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebardata);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/get?${urlParams.toString()}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch more listings");
      const data = await res.json();
      setListings(prevListings => [...prevListings, ...data]);
      setShowMore(data.length >= 9); // Show more if we received enough results
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="search-page">
      <div className="search-form">
        <h2>Search Properties</h2>
        <form onSubmit={handleSubmit}>
          <InputField id="searchTerm" label="Search Term" value={sidebardata.searchTerm} onChange={handleChange} />
          <InputField id="address" label="Address" value={sidebardata.address} onChange={handleChange} />
          <TypeSelector type={sidebardata.type} onChange={handleChange} />
          <SelectField id="category" label="Category" value={sidebardata.category} onChange={handleChange} options={[
            { value: "none", label: "None" },
            { value: "apartment", label: "Apartment" },
            { value: "condos", label: "Condos" },
            { value: "offices", label: "Offices" },
            { value: "homes & villas", label: "Homes & Villas" },
            { value: "commercial", label: "Commercial" },
          ]} />
          <SelectField id="parking" label="Parking" value={sidebardata.parking} onChange={handleChange} options={[
            { value: "", label: "Any" },
            { value: "garage", label: "Garage" },
            { value: "street", label: "Street" },
          ]} />
          <SelectField id="furnished" label="Furnished" value={sidebardata.furnished} onChange={handleChange} options={[
            { value: "", label: "Any" },
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]} />
          <SelectField id="offer" label="Offer" value={sidebardata.offer} onChange={handleChange} options={[
            { value: "", label: "Any" },
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]} />
          <SortOrderField value={`${sidebardata.sort}_${sidebardata.order}`} onChange={handleChange} />
          <button type="submit">Search</button>
        </form>
        {loading && <p>Loading...</p>}
      </div>
      <div className="property-list">
        {listings.map(val => (
          <PropertyCard key={val._id} property={val} />
        ))}
        {showMore && <button onClick={onShowMoreClick}>Show More</button>}
      </div>
    </div>
  );
};

const InputField = ({ id, label, value, onChange }) => (
  <label>
    {label}:
    <input type="text" id={id} placeholder={`Enter ${label.toLowerCase()}...`} value={value} onChange={onChange} />
  </label>
);

const SelectField = ({ id, label, value, onChange, options }) => (
  <label>
    {label}:
    <select id={id} value={value} onChange={onChange}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const TypeSelector = ({ type, onChange }) => (
  <div className="form-group">
    <label>Type:</label>
    <div className="toggle-buttons">
      {["all", "rent", "sale"].map((typeOption) => (
        <button
          key={typeOption}
          type="button"
          className={`toggle-button ${type === typeOption ? "active" : ""}`}
          onClick={onChange}
          id={typeOption}
        >
          {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

const SortOrderField = ({ value, onChange }) => (
  <label>
    Sort Order:
    <select id="sort_order" value={value} onChange={onChange}>
      <option value="regularPrice_desc">Price high to low</option>
      <option value="regularPrice_asc">Price low to high</option>
      <option value="createdAt_desc">Latest</option>
      <option value="createdAt_asc">Oldest</option>
    </select>
  </label>
);

const PropertyCard = ({ property }) => (
  <div className="property-card">
    <Link to={`/listing/${property._id}`}>
      <img src={property.imageUrls[0]} alt={property.name} />
      <h3>{property.name}</h3>
    </Link>
    <p>Address: {property.address}</p>
    <p>Type: {property.type}</p>
    <p>Furnished: {property.furnished}</p>
    <p>Parking: {property.parking}</p>
    <p>Category: {property.category}</p>
    <p>Price: {property.regularPrice}</p>
    <p>Bathrooms: {property.bathrooms}</p>
    <p>Bedrooms: {property.bedrooms}</p>
  </div>
);

export default SearchComp;
