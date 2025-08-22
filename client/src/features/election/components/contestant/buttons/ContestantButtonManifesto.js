import React from "react";
import ContestantButtonManifestoTemplate from "./ContestantButtonManifestoTemplate";

/**
 * This component represents the button that can show or hide the manifesto of a single contestant
 * when clicked.
 *
 * @param {Object} props - Component props.
 * @param {Object} [props.manifestoControl] - Object having manifesto state and function to set it.
 * @param {Boolean} [props.manifestoControl.showManifesto] - This prop controls which manifesto control
 * button is shown. When true, it means the manifesto is being shown, so the button rendered shows
 * "Close Manifesto". When false, it means the manifesto is hidden, so the button rendered shows "Read Manifesto".
 * @param {Function} [props.manifestoControl.setShowManifesto] - This is used for setting the value of showManifesto
 * in the parent component holding the manifesto state.
 * @returns {JSX.Element} The rendered button component.
 */
const ContestantButtonManifesto = ({ manifestoControl }) => {
  const { showManifesto, setShowManifesto } = manifestoControl;
  if (!showManifesto) {
    return (
      <ContestantButtonManifestoTemplate
        handler={() => setShowManifesto(true)}
        className="swp-col-blv"
      >
        Read Manifesto
      </ContestantButtonManifestoTemplate>
    );
  } else {
    return (
      <ContestantButtonManifestoTemplate
        handler={() => setShowManifesto(false)}
        className="swp-col-crm"
        style={{ marginTop: "5px" }}
      >
        Close Manifesto
      </ContestantButtonManifestoTemplate>
    );
  }
};
export default ContestantButtonManifesto;
