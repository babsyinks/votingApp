import React from "react";
import styles from "./FullScreenLoader.module.css";

/**
 * A fullscreen loading spinner overlay shown during async operations.
 *
 * Accessibility: Uses `role="status"` and `aria-live="polite"` to notify screen readers.
 *
 * @returns {JSX.Element} The rendered full screen loader component.
 */
const FullScreenLoader = () => {
  return (
    <div
      className={styles.loaderOverlay}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.loaderSpinner} />
      <p className={styles.loaderText}>Loading your experience...</p>
    </div>
  );
};

export default FullScreenLoader;
