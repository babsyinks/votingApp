import React, { useState } from "react";
import PropTypes from "prop-types";
import defaultStyle from "Tab.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * This component renders a tab, which when clicked, changes its style and performs an action
 *
 * @param {Object} props - Component props.
 * @param {Array} props.labels - The list of labels of the tabs to be rendered.
 * @param {String} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @returns {JSX.Element} The rendered tab component.
 */
export default function Tab({
  labels,
  className = "",
  style = {},
}) {
  const [action, setAction] = useState(labels[0]);
  const width = `${Math.floor(100 / labels.length) - 1}%`;
  return (
    <>
      {labels.map((label) => {
        return (
          <span
            id={action === label ? "currentSelected" : ""}
            className={getCompClasses(defaultStyle.tb, className)}
            onClick={() => setAction(label)}
            style={{ ...style, width }}
          >
            {label}
          </span>
        );
      })}
    </>
  );
}

Tab.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};
