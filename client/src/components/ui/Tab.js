import React, { useState } from "react";
import PropTypes from "prop-types";
import defaultStyle from "Tab.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * This component renders a tab, which when clicked, changes its style and performs an action
 *
 * @param {Object} props - Component props.
 * @param {Array} props.labels - The list of labels of the tabs to be rendered.
 * @param {Object} props.custom - Optional object to customize this component's style.
 * @returns {JSX.Element} The rendered tab component.
 */
export default function Tab({
  labels,
  custom = { custClass: "", custStyle: {} },
}) {
  const [action, setAction] = useState(labels[0]);
  const { custClass = "", custStyle = {} } = custom;
  const width = `${Math.floor(100 / labels.length) - 1}%`;
  return (
    <>
      {labels.map((label) => {
        return (
          <span
            id={action === label ? "currentSelected" : ""}
            className={getCompClasses(defaultStyle.tb, custClass)}
            onClick={() => setAction(label)}
            style={{ ...custStyle, width }}
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
  custom: PropTypes.shape({
    custClass: PropTypes.string,
    custStyle: PropTypes.object,
  }),
};
