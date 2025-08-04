import React from "react";
import PropTypes from "prop-types";
import Span from "components/ui/Span";
import ContestantTextInfoWrapper from "./ContestantTextInfoWrapper";
import style from "./ContestantBasicInfo.module.css";
/**
 * Holds a contestant's basic information, and formats it. E.g the name.
 *
 * @param {Object} props Component props
 * @param {string} [props.type] The basic info type, e.g "Name".
 * @param {string} [props.value] The value of the type provided. E.g if type is name, the value could
 * be 'John'.
 * @returns {JSX.Element} The rendered ContestantBasicInfo component.
 */
const ContestantBasicInfo = ({ type, value }) => {
  return (
    <ContestantTextInfoWrapper>
      {type}: <Span className={style["basic-info"]}>{value}</Span>
    </ContestantTextInfoWrapper>
  );
};
ContestantBasicInfo.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
export default ContestantBasicInfo;
