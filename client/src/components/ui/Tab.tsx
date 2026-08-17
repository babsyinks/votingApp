import React, { useState } from "react";
import defaultStyle from "Tab.module.css";

import getCompClasses from "../../util/getCompClasses";

export interface TabProps {
  /** The list of labels of the tabs to be rendered. */
  labels: string[];
  /** Additional class names. */
  className?: string;
  /** Inline styles. */
  style?: React.CSSProperties;
}

/**
 * Accessible tab component following WAI-ARIA best practices.
 *
 * @returns The rendered Tab component.
 */
export default function Tab({
  labels,
  className = "",
  style = {},
}: TabProps): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
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
            className={`${defaultStyle.tb} ${getCompClasses(
              defaultStyle,
              className,
            )}`}
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
