import React from "react";
import PropTypes from "prop-types";
import "./DataToolTip.css";

export default function DataToolTip({ data, children }) {
  return <div data-tooltip={data}>{children}</div>;
}

DataToolTip.propTypes = {
  data: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
