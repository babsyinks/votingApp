import React from "react";
import PropTypes from "prop-types";
import Block from "components/ui/Block";
import Img from "components/ui/Img";
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
    <Block className={style["contestant-picture-wrapper"]}>
      <Img
        className={`${style["contestant-picture"]} ${showFullPicture ? style["contestant-picture-full"] : ""}`}
        src={picture}
        alt="contestant"
      />
    </Block>
  );
};

ContestantPicture.propTypes = {
  picture: PropTypes.string.isRequired,
  showFullPicture: PropTypes.bool,
};
export default ContestantPicture;
