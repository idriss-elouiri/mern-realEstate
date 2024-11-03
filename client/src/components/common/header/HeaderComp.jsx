import React, { useState } from "react";
import "./Header.css";
import { nav } from "../../data/Data";
import { Link } from "react-router-dom";
import { FaTimes, FaBars, FaSignOutAlt  } from "react-icons/fa";
import { useSelector } from 'react-redux';
import heroImg from "../../images/logo.png"

const HeaderComp = () => {
  const [navList, setNavList] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <header>
        <div className="container flex">
          <div className="logo">
            <img src={heroImg} alt="" />
          </div>
          <div className="nav">
            <ul className={navList ? "small" : "flex"}>
              {nav.map((list, index) => (
                <li key={index}>
                  <Link to={list.path}>{list.text}</Link>
                </li>
              ))}
            </ul>
          </div>
            <Link to='/profile'>
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt='profile'
                className="profile-img"
              />
            ) : (
              <button className="btn-hd">
             Sign In
            </button>
            )}
          </Link>

          <div className="toggle">
            <button onClick={() => setNavList(!navList)}>
              {navList ? (
                <i><FaTimes/></i>
              ) : (
                <i><FaBars/></i>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderComp;
