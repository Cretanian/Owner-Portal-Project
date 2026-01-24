import React, { useState } from "react";
import {
  getMonthlyAnalytics,
  getMetrics,
  getPerChannelAnalytics,
} from "../../../../api/analytics";
import { useEffect } from "react";
import styles from "./AnalyticsPage.module.css";

import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

function AnalyticsPage() {
  const [metrics, setMetrics] = useState();
  const [monthlyAnalytics, setMonthlyAnalytics] = useState();
  const [perChannelAnalytics, setPerChannelAnalytics] = useState();

  const fetchMetrics = async () => {
    const metrics = await getMetrics({
      listingMapIds: ["454482", "454483"],
    });

    setMetrics(metrics);
  };

  const fetchMonthlyAnalytics = async () => {
    const monthlyAnalytics = await getMonthlyAnalytics({
      listingMapIds: ["454482", "454483"],
      fromDate: "2025-01-01",
      toDate: "2026-01-01",
      dateType: "arrivalDate",
      statuses: ["new", "modified"],
    });

    setMonthlyAnalytics(monthlyAnalytics);
  };

  const fetchPerChannelAnalytics = async () => {
    const monthlyAnalytics = await getPerChannelAnalytics({
      listingMapIds: ["454482", "454483"],
      fromDate: "2025-01-01",
      toDate: "2026-01-01",
      dateType: "arrivalDate",
      statuses: ["new", "modified"],
    });

    setPerChannelAnalytics(monthlyAnalytics);
  };

  useEffect(() => {
    fetchMetrics();
    fetchMonthlyAnalytics();
    fetchPerChannelAnalytics();
  }, []);

  if (!metrics || !monthlyAnalytics || !perChannelAnalytics) return;

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
      <div className={styles.grid}>
        <div className={styles.chartWrapper}>
          <RevenueOverTimeChart data={monthlyAnalytics} />
        </div>
        <div className={styles.chartWrapper}>
          <RevenueByChannelPie data={perChannelAnalytics} />
        </div>

        <div className={styles.chartWrapper}>
          <NightsOverTimeChart data={monthlyAnalytics} />
        </div>
        <div className={styles.chartWrapper}>
          <NightsByChannelBar data={perChannelAnalytics} />
        </div>
      </div>
    </>
  );
}

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatPrettyLabel(label) {
  const [year, month] = label.split("-");
  return `${monthLabels[Number(month) - 1]} ${year}`;
}

function stringToColor(str) {
  let hash = 2166136261; // FNV-1a base
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  const hue = Math.abs(hash) % 360;
  const lightness = 45 + (Math.abs(hash >> 8) % 20); // 45–65%

  return `hsl(${hue}, 65%, ${lightness}%)`;
}

function buildTimeSeries(data, valueKey) {
  const rawLabels = [];
  const datasets = [];

  // collect all year-month labels globally so all listings align
  Object.values(data).forEach((listing) => {
    Object.entries(listing).forEach(([year, months]) => {
      Object.keys(months).forEach((month) => {
        const label = `${year}-${String(Number(month) + 1).padStart(2, "0")}`;
        if (!rawLabels.includes(label)) rawLabels.push(label);
      });
    });
  });

  rawLabels.sort(); // chronological order

  const prettyLabels = rawLabels.map(formatPrettyLabel);

  Object.entries(data).forEach(([listingId, listing]) => {
    const color = stringToColor(listingId);

    const values = rawLabels.map((label) => {
      const [year, month] = label.split("-");
      const monthIndex = String(Number(month) - 1);
      return listing?.[year]?.[monthIndex]?.[valueKey] ?? 0;
    });

    datasets.push({
      label: `Listing ${listingId}`,
      data: values,
      borderColor: color,
      backgroundColor: color,
      tension: 0.3,
    });
  });

  return { labels: prettyLabels, datasets };
}

// ---- charts ----

export function NightsOverTimeChart({ data }) {
  const chartData = buildTimeSeries(data, "nights");

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          title: { display: true, text: "Nights over time per listing" },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          y: { title: { display: true, text: "Nights" } },
          x: { title: { display: true, text: "Month" } },
        },
      }}
    />
  );
}

export function RevenueOverTimeChart({ data }) {
  const base = buildTimeSeries(data, "revenue");

  const totals = base.labels.map((_, i) =>
    base.datasets.reduce((sum, ds) => sum + (ds.data[i] || 0), 0),
  );

  const chartData = {
    labels: base.labels,
    datasets: [
      ...base.datasets.map((ds) => ({
        ...ds,
        type: "bar",
      })),
      {
        label: "Total revenue",
        data: totals,
        type: "bar",
        backgroundColor: "rgba(0,0,0,0.6)",
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          title: { display: true, text: "Revenue over time per listing" },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: { stacked: false, title: { display: true, text: "Month" } },
          y: { stacked: false, title: { display: true, text: "Revenue" } },
        },
      }}
    />
  );
}

export function RevenueByChannelPie({ data }) {
  const labels = data.map((d) => d.channel);
  const values = data.map((d) => Number(d.revenue));
  const colors = labels.map(stringToColor);

  return (
    <Pie
      data={{
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          title: { display: true, text: "Total revenue by channel" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: €${ctx.parsed.toLocaleString()}`,
            },
          },
        },
      }}
    />
  );
}

export function NightsByChannelBar({ data }) {
  const labels = data.map((d) => d.channel);
  const values = data.map((d) => Number(d.nights));
  const colors = labels.map(stringToColor);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Nights",
            data: values,
            backgroundColor: colors,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          title: { display: true, text: "Nights per channel" },
        },
        scales: {
          y: { title: { display: true, text: "Nights" } },
        },
      }}
    />
  );
}

export default AnalyticsPage;
