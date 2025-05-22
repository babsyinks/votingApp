import React from "react";
import ContestantFrame from "./ContestantFrame";
import ContestantManifestoInfo from "./info/ContestantManifestoInfo";
import ContestantButtonManifesto from "./buttons/ContestantButtonManifesto";

/**
 * This component renders the manifesto of the contestant. Given that the manifesto could be a
 * long text, it is separated from the component showing the other details about the contestant.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.manifesto] - The manifesto text of the contestant.
 * @param {Object} [props.manifestoControl] - Object having manifesto state and function to set it.
 * @returns {JSX.Element} The rendered ContestantManifestoView component.
 */
const ContestantManifestoView = ({ manifesto, manifestoControl }) => {
  return (
    <ContestantFrame>
      <ContestantManifestoInfo manifesto={manifesto} />
      <ContestantButtonManifesto manifestoControl={manifestoControl} />
    </ContestantFrame>
  );
};
export default ContestantManifestoView;
