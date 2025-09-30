import React from "react";
import "./MainHeader.css";
import logo from "assets/images/votenow-logo.png";

/**
 * A reusable <header> component for displaying site-wide header content.
 *
 * @returns The rendered <header> element.
 */
const MainHeader: React.FC = (): JSX.Element => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="VoteNow Logo" className="logo" />
        <div className="contact-info">
          <a href="mailto:multac@proton.me" className="contact-item">
            <i className="fas fa-envelope icon" aria-hidden="true"></i>
            <span className="contact-text">multac@proton.me</span>
          </a>
          <a href="tel:+2348051750010" className="contact-item">
            <i className="fas fa-phone icon" aria-hidden="true"></i>
            <span className="contact-text">+234 (805) 175-0010</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
