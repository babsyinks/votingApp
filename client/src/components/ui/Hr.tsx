import { CSSProperties, JSX } from "react";

import defaultStyle from "./Hr.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface HrProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * A horizontal rule component for separating parts of a page.
 *
 * @returns The rendered `<hr>` element.
 */
export default function Hr({
  className = "",
  style = {},
}: HrProps): JSX.Element {
  return (
    <hr
      className={`${defaultStyle["hr-line"]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    />
  );
}
