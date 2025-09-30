import { ImgHTMLAttributes, CSSProperties, JSX } from "react";
import defaultStyle from "./Img.module.css";
import getCompClasses from "../../util/getCompClasses";

export interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * A standardized `<img>` component with support for fallback images and base styling.
 *
 */
export default function Img({
  src,
  alt,
  className = "",
  style = {},
  ...rest
}: ImgProps): JSX.Element {
  return (
    <img
      src={src}
      alt={alt}
      className={`${defaultStyle.img} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      {...rest}
    />
  );
}
