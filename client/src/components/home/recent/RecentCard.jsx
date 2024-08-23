import React from "react";
import { FaHeart, FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

const RecentCard = ({listings}) => {
 
  return (
    <>
      <div className="content grid3 mtop">
        {listings?.map((val, index) => {
          const { _id, imageUrls, category, address, name, regularPrice, type } =
            val;
          return (
            <div className='box shadow' key={index}>
              <div className='img'>
                <img src={imageUrls[0]} alt='' />
              </div>
              <div className='text'>
                <div className='category flex'>
                  <span style={{ background: type === "For Sale" ? "#25b5791a" : "#ff98001a", color: type === "For Sale" ? "#25b579" : "#ff9800" }}>{type}</span>
                  <i><FaHeart/></i>
                </div>
                <h4>{name}</h4>
                <p>
                 <FaLocationDot/> {address}
                </p>
              </div>
              <div className='button flex'>
                <div>
                  <button className='btn2'>${regularPrice}</button> <label>/sqft</label>
                </div>
                <span>{category}</span>
              </div>
              <Link to={`/listing/${_id}`} className="read-more">read more</Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RecentCard;
