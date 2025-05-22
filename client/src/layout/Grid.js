import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Grid.module.css";
import getCompClasses from "../util/getCompClasses";
/**
 * A Grid component that lists items in a grid, auto-filling the screen with the items based on
 * available screen space.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the Grid. E.g Grid or flex-vert.
 * @param {Object} [props.custom] - Additional style classes and objects to pass to the element.
 * @param {React.ReactNode} props.children - Child elements to render inside the Grid.
 * @returns {JSX.Element} The rendered Grid component.
 */
export default function Grid({
  custom = { custClass: "", custStyle: {} },
  children,
}) {
  const { custClass = "", custStyle = {} } = custom;
  return (
    <div
      className={`${defaultStyle.grid} ${getCompClasses(defaultStyle, custClass)}`}
      style={custStyle || {}}
    >
      {children}
    </div>
  );
}

Grid.propTypes = {
  custom: PropTypes.object,
  children: PropTypes.node,
};
