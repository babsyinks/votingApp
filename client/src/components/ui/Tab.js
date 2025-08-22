import React, { useState } from "react";
import PropTypes from "prop-types";
import defaultStyle from "Tab.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * Accessible tab component following WAI-ARIA best practices.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.labels - The list of labels of the tabs to be rendered.
 * @param {string} [props.className] - Additional class names.
 * @param {Object} [props.style] - Inline styles.
 * @returns {JSX.Element}
 */
export default function Tab({ labels, className = "", style = {} }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const width = `${Math.floor(100 / labels.length) - 1}%`;

  return (
    <div role="tablist" aria-label="Tab list">
      {labels.map((label, index) => {
        const isSelected = selectedIndex === index;

        return (
          <button
            key={label}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`panel-${index}`}
            id={`tab-${index}`}
            tabIndex={isSelected ? 0 : -1}
            className={`${defaultStyle.tb} ${getCompClasses(defaultStyle, className)}`}
            onClick={() => setSelectedIndex(index)}
            style={{ ...style, width }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

Tab.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};
