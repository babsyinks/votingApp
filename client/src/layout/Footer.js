import React from "react";

export default function Footer({ textColor = "white" }) {
  return (
    <footer style={{ color: textColor }}>
      &copy; Corestack Tech {new Date().getFullYear()}
    </footer>
  );
}
