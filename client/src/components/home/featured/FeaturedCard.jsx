import React from "react"
import hero2 from "../../images/hero/h2.png"
import hero1 from "../../images/hero/h1.png"
import hero3 from "../../images/hero/h3.png"
import hero4 from "../../images/hero/h4.png"
import hero6 from "../../images/hero/h6.png"
const FeaturedCard = () => {
   const featured = [
    {
      cover: hero1,
      name: "Family House",
      total: "122 Property",
    },
    {
      cover: hero2,
      name: "House & Villa",
      total: "155 Property",
    },
    {
      cover: hero3,
      name: "Apartment",
      total: "300 Property",
    },
    {
      cover: hero4,
      name: "Office & Studio",
      total: "80 Property",
    },
    {
      cover: hero6,
      name: "Villa & Condo",
      total: "80 Property",
    },
  ]
  return (
    <>
      <div className='content grid5 mtop'>
        {featured.map((items, index) => (
          <div className='box' key={index}>
            <img src={items.cover} alt='' />
            <h4>{items.name}</h4>
            <label>{items.total}</label>
          </div>
        ))}
      </div>
    </>
  )
}

export default FeaturedCard