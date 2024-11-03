import React from "react"
import { FaCheck } from "react-icons/fa"
import { FaX } from "react-icons/fa6"

const PriceCard = () => {
   const price = [
    {
      plan: "Basic",
      price: "29",
      ptext: "per user, per month",
      list: [
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "99.5% Uptime Guarantee",
        },
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "120GB CDN Bandwidth",
        },
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "5GB Cloud Storage",
        },
        { change: "color", icon: <i class='fa-solid fa-x'><FaX/></i>, text: "Personal Help Support" },
        { change: "color", icon: <i class='fa-solid fa-x'><FaX/></i>, text: "Enterprise SLA" },
      ],
    },
    {
      best: "Best Value",
      plan: "Standard",
      price: "49",
      ptext: "per user, per month",
      list: [
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "99.5% Uptime Guarantee",
        },
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "150GB CDN Bandwidth",
        },
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "10GB Cloud Storage",
        },
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "Personal Help Support",
        },
        {
          change: "color",
          icon: <i class='fa-solid fa-x'><FaX/></i>,
          text: "Enterprise SLA",
        },
      ],
    },
    {
      plan: "Platinum",
      price: "79",
      ptext: "2 user, per month",
      list: [
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "100% Uptime Guarantee",
        },
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "200GB CDN Bandwidth",
        },
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "20GB Cloud Storage",
        },
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "Personal Help Support",
        },
        {
          icon: <i class='fa-solid fa-check'><FaCheck/></i>,
          text: "Enterprise SLA",
        },
      ],
    },
  ]
  return (
    <>
      <div className='content flex mtop'>
        {price.map((item, index) => (
          <div className='box shadow' key={index}>
            <div className='topbtn'>
              <button className='btn3'>{item.best}</button>
            </div>
            <h3>{item.plan}</h3>
            <h1>
              <span>$</span>
              {item.price}
            </h1>
            <p>{item.ptext}</p>

            <ul>
              {item.list.map((val, index) => {
                const { icon, text, change } = val
                return (
                  <li key={index}>
                    <label
                      style={{
                        background: change === "color" ? "#dc35451f" : "#27ae601f",
                        color: change === "color" ? "#dc3848" : "#27ae60",
                      }}
                    >
                      {icon}
                    </label>
                    <p>{text}</p>
                  </li>
                )
              })}
            </ul>
            <button
              className='btn5'
              style={{
                background: item.plan === "Standard" ? "#27ae60" : "#fff",
                color: item.plan === "Standard" ? "#fff" : "#27ae60",
              }}
            >
              Start {item.plan}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default PriceCard