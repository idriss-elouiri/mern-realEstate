import React from "react"
import Heading from "../../common/Heading"
import "./Awards.css"
import { FaBriefcase, FaHeart, FaLightbulb, FaTrophy } from "react-icons/fa"

const Awards = () => {
   const awards = [
    {
      icon:<i class='fa-solid'><FaTrophy/></i>,
      num: "32 M	",
      name: "Blue Burmin Award",
    },
    {
      icon: <i class='fa-solid'><FaBriefcase/></i>,
      num: "43 M",
      name: "Mimo X11 Award",
    },
    {
      icon: <i class='fa-solid'><FaLightbulb/></i>,
      num: "51 M",
      name: "Australian UGC Award",
    },
    {
      icon: <i class='fa-solid'><FaHeart/></i>,
      num: "42 M",  
      name: "IITCA Green Award",
    },
  ]
  return (
    <>
      <section className='awards padding'>
        <div className='container'>
          <Heading title='Over 1,24,000+ Happy User Bieng With Us Still They Love Our Services' subtitle='Our Awards' />

          <div className='content grid4 mtop'>
            {awards.map((val, index) => (
              <div className='box' key={index}>
                <div className='icon'>
                  <span>{val.icon}</span>
                </div>
                <h1>{val.num}</h1>
                <p>{val.name} </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Awards