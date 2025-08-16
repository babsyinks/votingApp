import React from "react";
import "./MainHeader.css";
import logo from "assets/images/votenow-logo.png";
import useBreakpoint from "hooks/useBreakpoint";

const MainHeader = () => {
  const device = useBreakpoint();
  const isDesktop = device === "desktop";
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="VoteNow Logo" className="logo" />
        <div className="contact-info">
          <a href="mailto:multac@proton.me" className="contact-item">
            <i className="fas fa-envelope icon"></i>
            {isDesktop && "multac@proton.me"}
          </a>
          <a href="tel:+2348051750010" className="contact-item">
            <i className="fas fa-phone icon"></i>
            {isDesktop && "+234 (805) 175-0010"}
          </a>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
