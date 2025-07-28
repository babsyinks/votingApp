import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Grid.module.css";
import getCompClasses from "util/getCompClasses";
/**
 * A Grid component that lists items in a grid, auto-filling the screen with the items based on
 * available screen space.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the Grid. E.g Grid or flex-vert.
 * @param {String} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @param {React.ReactNode} props.children - Child elements to render inside the Grid.
 * @returns {JSX.Element} The rendered Grid component.
 */
export default function Grid({
  className = "",
  style = {},
  children,
}) {
  return (
    <div
      className={`${defaultStyle.grid} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </div>
  );
}

Grid.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};
