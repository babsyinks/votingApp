import React from "react";
import PropTypes from "prop-types";
import ContestantTextInfoWrapper from "./ContestantTextInfoWrapper";
import style from "./ContestantBasicInfo.module.css";
/**
 * Holds a contestant's basic information, and formats it. E.g the name, age, etc.
 *
 * @param {Object} props Component props
 * @param {String} [props.type] The basic info type, e.g "Name".
 * @returns {JSX.Element} The rendered ContestantBasicInfo component.
 */
const ContestantBasicInfo = ({ type, value }) => {
  return (
    <ContestantTextInfoWrapper>
      {type}: <span className={style["basic-info"]}>{value}</span>
    </ContestantTextInfoWrapper>
  );
};
ContestantBasicInfo.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
export default ContestantBasicInfo;
