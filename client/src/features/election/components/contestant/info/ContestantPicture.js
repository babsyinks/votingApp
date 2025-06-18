import React from "react";
import PropTypes from "prop-types";
import style from "./ContestantPicture.module.css";
/**
 * Holds a contestant's picture formating and content.
 *
 * @param {Object} props Component props
 * @param {string} [props.picture] The link to the picture to be rendered in this component.
 * @param {boolean} [props.showFullPicture] Indicates if the full picture size should be displayed
 * @returns {JSX.Element} The rendered ContestantPicture component.
 */
const ContestantPicture = ({ picture, showFullPicture }) => {
  return (
    <div className={style["contestant-picture-wrapper"]}>
      <img
        className={`${style["contestant-picture"]} ${showFullPicture ? style["contestant-picture-full"] : ""}`}
        src={picture}
        alt="contestant"
      />
    </div>
  );
};

ContestantPicture.propTypes = {
  picture: PropTypes.string.isRequired,
  showFullPicture: PropTypes.bool,
};
export default ContestantPicture;
