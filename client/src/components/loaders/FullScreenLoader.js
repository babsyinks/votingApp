import React from "react";
import styles from "./FullScreenLoader.module.css";

const FullScreenLoader = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderSpinner} />
      <p className={styles.loaderText}>Loading your experience...</p>
    </div>
  );
};

export default FullScreenLoader;
