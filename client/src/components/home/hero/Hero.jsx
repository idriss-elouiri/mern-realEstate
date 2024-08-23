import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Heading from "../../common/Heading";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    type: "all",
    address: "",
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const typeFromUrl = urlParams.get("type");
    const addressFromUrl = urlParams.get("address");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (typeFromUrl || addressFromUrl || sortFromUrl || orderFromUrl) {
      setSidebardata({
        type: typeFromUrl || "all",
        address: addressFromUrl || "",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "type" || e.target.id === "address") {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.value });
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
    urlParams.set("type", sidebardata.type);
    urlParams.set("address", sidebardata.address);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  console.log(sidebardata);
  return (
    <>
      <section className="hero">
        <div className="container">
          <Heading
            title="Search Your Next Home "
            subtitle="Find new & featured property located in your local city."
          />

          <form className="flex" onSubmit={handleSubmit}>
            <div className="box">
              <span>City/Street</span>
              <input
                type="text"
                onChange={handleChange}
                value={sidebardata.address}
                id="address"
                placeholder="Address"
              />
            </div>
            <div className="box">
              <span>Property Type</span>
              <input
                type="text"
                id="type"
                onChange={handleChange}
                value={sidebardata.type}
                placeholder="Property Type"
              />
            </div>
            <div className="box">

            <label>
              Sort Order:
              <select
                defaultValue={"created_at_desc"}
                id="sort_order"
                onChange={handleChange}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to hight</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </label>
            </div>
            <div className="box">
              <h4>Advance Filter</h4>
            </div>
            <button type="submit" className="btn1">
              <i>
                <FaSearch />
              </i>
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Hero;
