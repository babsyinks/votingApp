import React from "react";

export interface ManifestoControl {
  /** Controls which manifesto button is shown */
  showManifesto: boolean;
  /** Function to update the manifesto visibility state */
  setShowManifesto: React.Dispatch<React.SetStateAction<boolean>>;
}