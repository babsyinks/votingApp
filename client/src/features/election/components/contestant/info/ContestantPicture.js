import React from "react";
import PropTypes from "prop-types";
import style from "./ContestantPicture.module.css";
/**
 * Holds a contestant's picture formating and content.
 *
 * @param {Object} props Component props
 * @param {String} [props.picture] The link to the picture to be rendered in this component.
 * @returns {JSX.Element} The rendered ContestantPicture component.
 */
const ContestantPicture = ({ picture }) => {
  return (
    <div className={style["contestant-picture-wrapper"]}>
      <img
        className={style["contestant-picture"]}
        src={picture}
        alt="contestant"
      />
    </div>
  );
};

ContestantPicture.propTypes = {
  picture: PropTypes.string.isRequired,
};
export default ContestantPicture;
