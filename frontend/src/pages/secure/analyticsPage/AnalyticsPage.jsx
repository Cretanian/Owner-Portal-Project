import React, { useState } from "react";
import { getMetrics } from "../../../../api/analytics";
import { useEffect } from "react";
import styles from "./AnalyticsPage.module.css";

function AnalyticsPage() {
  const [metrics, setMetrics] = useState();

  const fetchMetrics = async () => {
    const metrics = await getMetrics({
      listingMapIds: ["454482", "454483"],
    });

    setMetrics(metrics);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (!metrics) return;

  return (
    <>
      Metrics
      <div className={styles.metrics}>
        {Object.keys(metrics).map((key) => (
          <div className={styles.numberChart}>
            <div className={styles.numberChartTitle}> {key} </div>
            <div className={styles.numberChartValue}> {metrics[key]} </div>
          </div>
        ))}
      </div>
      Analytics
    </>
  );
}

export default AnalyticsPage;
