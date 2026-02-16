import React from "react";
import styles from "./LoaderContainer.module.css";

function hasRenderableContent(node) {
  if (node === null || node === undefined || typeof node === "boolean") {
    return false;
  }

  if (Array.isArray(node)) {
    return node.some((child) => hasRenderableContent(child));
  }

  if (typeof node === "string") {
    return node.trim().length > 0;
  }

  return true;
}

function LoaderContainer({
  children,
  isLoading,
  minHeight = "320px",
  className = "",
}) {
  const shouldShowLoader =
    typeof isLoading === "boolean"
      ? isLoading
      : !hasRenderableContent(children);

  if (shouldShowLoader) {
    return (
      <div
        className={[styles.container, styles.loading, className]
          .filter(Boolean)
          .join(" ")}
        style={{
          "--loader-min-height": minHeight,
        }}
      >
        <div className={styles.loadingSurface} aria-live="polite">
          <div className={styles.loadingHeader} />
          <div className={styles.loadingRows} />
          <div className={styles.loadingCharts}>
            <div className={styles.loadingChartBlock} />
            <div className={styles.loadingChartBlock} />
            <div className={styles.loadingChartBlock} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={[styles.container, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export default LoaderContainer;
