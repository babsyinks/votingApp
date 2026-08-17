import { FC } from "react";

import styles from "./FullScreenLoader.module.css";

/**
 * A fullscreen loading spinner overlay shown during async operations.
 *
 * Accessibility: Uses `role="status"` and `aria-live="polite"` to notify screen readers.
 */
const FullScreenLoader: FC = () => {
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
