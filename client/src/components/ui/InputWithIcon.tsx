import React from "react";

import { BaseInputProps } from "./BaseInput";
import Block from "./Block";
import I from "./I";
import Input from "./Input";
import defaultStyle from "./InputWithIcon.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface InputWithIconProps extends BaseInputProps {
  /** Optional class name for the left icon (font-awesome class name, etc.) */
  iconClass?: string;
  /** Optional React node to render as a right-hand icon or element */
  rightIcon?: React.ReactNode;
}

/**
 * A component that renders an input field with optional left and/or right icons.
 *
 * @returns The rendered input-with-icon component.
 */
export default function InputWithIcon({
  iconClass,
  rightIcon,
  ...inputProps
}: InputWithIconProps): JSX.Element {
  const { className = "" } = inputProps;

  return (
    <Block className={defaultStyle["input-icon-wrapper"]}>
      {iconClass && (
        <I className={`fas ${iconClass} ${defaultStyle["input-icon"]}`} />
      )}
      <Input
        {...inputProps}
        className={`${defaultStyle["input-with-icon"]} ${getCompClasses(
          defaultStyle,
          className,
        )}`}
      />
      {rightIcon && (
        <Block className={defaultStyle["input-icon-right"]}>{rightIcon}</Block>
      )}
    </Block>
  );
}
