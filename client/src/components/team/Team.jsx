import React from "react"
import {FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt} from "react-icons/fa"
import team1 from "../images/customer/team-1.jpg"
import team3 from "../images/customer/team-3.jpg"
import team5 from "../images/customer/team-5.jpg"
import "./Team.css"
import Heading from "../common/Heading"

const Team = () => {
   const team = [
    {
      list: "50",
      cover: team1,
      address: "Liverpool, Canada",
      name: "Sargam S. Singh",
      icon: [<i class='fa-brands'><FaFacebook/></i>, <i class='fa-brands'><FaLinkedin/></i>, <i class='fa-brands'><FaTwitter/></i>, <i class='fa-brands'><FaInstagram/></i>],
    },
    {
      list: "70",
      cover: team3,
      address: "Montreal, Canada",
      name: "Harijeet M. Siller",
      icon: [<i class='fa-brands'><FaFacebook/></i>, <i class='fa-brands'><FaLinkedin/></i>, <i class='fa-brands'><FaTwitter/></i>, <i class='fa-brands'><FaInstagram/></i>],
    },
    {
      list: "80",
      cover: team5,
      address: "Denever, USA",
      name: "Anna K. Young",
      icon: [<i class='fa-brands'><FaFacebook/></i>, <i class='fa-brands'><FaLinkedin/></i>, <i class='fa-brands'><FaTwitter/></i>, <i class='fa-brands'><FaInstagram/></i>],
    },
    {
      list: "51",
      cover: team5,
      address: "2272 Briarwood Drive",
      name: "Michael P. Grimaldo",
      icon: [<i class='fa-brands'><FaFacebook/></i>, <i class='fa-brands'><FaLinkedin/></i>, <i class='fa-brands'><FaTwitter/></i>, <i class='fa-brands'><FaInstagram/></i>],
    },
    {
      list: "42",
      cover: team1,
      address: "2272 Briarwood Drive",
      name: "Michael P. Grimaldo",
      icon: [<i class='fa-brands'><FaFacebook/></i>, <i class='fa-brands'><FaLinkedin/></i>, <i class='fa-brands'><FaTwitter/></i>, <i class='fa-brands'><FaInstagram/></i>],
    },
    {
      list: "38",
      cover: team3,
      address: "Montreal, USA",
      name: "Adam K. Jollio",
      icon: [<i class='fa-brands fa-facebook-f'></i>, <i class='fa-brands fa-linkedin'></i>, <i class='fa-brands fa-twitter'></i>, <i class='fa-brands fa-instagram'></i>],
    },
  ]
  return (
    <>
      <section className='team background'>
        <div className='container'>
          <Heading title='Our Featured Agents' subtitle='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.' />

          <div className='content mtop grid3'>
            {team.map((val, index) => (
              <div className='box' key={index}>
                <button className='btn3'>{val.list} Listings</button>
                <div className='details'>
                  <div className='img'>
                    <img src={val.cover} alt='' />
                    <i className='fa-solid fa-circle-check'></i>
                  </div>
                  <i className='fa fa-location-dot'></i>
                  <label>{val.address}</label>
                  <h4>{val.name}</h4>

                  <ul>
                    {val.icon.map((icon, index) => (
                      <li key={index}>{icon}</li>
                    ))}
                  </ul>
                  <div className='button flex'>
                    <button>
                      <i ><FaEnvelope/></i>
                      Message
                    </button>
                    <button className='btn4'>
                      <i><FaPhoneAlt/></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Team