import React from "react";
import Block from "components/ui/Block";
import Img from "components/ui/Img";
import style from "./ContestantPicture.module.css";

export interface ContestantPictureProps {
  /** The link to the picture to be rendered in this component */
  picture: string;
  /** Indicates if the full picture size should be displayed */
  showFullPicture?: boolean;
}

/**
 * Holds a contestant's picture formatting and content.
 */
const ContestantPicture: React.FC<ContestantPictureProps> = ({
  picture,
  showFullPicture = false,
}) => {
  return (
    <Block className={style["contestant-picture-wrapper"]}>
      <Img
        className={`${style["contestant-picture"]} ${
          showFullPicture ? style["contestant-picture-full"] : ""
        }`}
        src={picture}
        alt="contestant"
      />
    </Block>
  );
};

export default ContestantPicture;
