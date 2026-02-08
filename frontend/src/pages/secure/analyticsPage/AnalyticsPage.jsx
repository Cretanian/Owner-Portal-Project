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
import { getListings } from "../../../../api/listings";

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
  const [listings, setListings] = useState();

  const fetchListings = async () => {
    const listings = await getListings();

    setListings(listings);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (!listings) return;

  if (listings.length === 0) return "No listings";

  return <AnalyticsPage_ listings={listings} />;
}

function AnalyticsPage_({ listings = [] }) {
  const [metrics, setMetrics] = useState();
  const [monthlyAnalytics, setMonthlyAnalytics] = useState();
  const [perChannelAnalytics, setPerChannelAnalytics] = useState();

  const [filters, setFilters] = useState({
    listingMapIds: listings.map((listing) => `${listing.id}`),
    fromDate: "2025-01-01",
    toDate: "2026-01-01",
    statuses: ["new", "modified"],
  });

  const fetchMetrics = async (filters) => {
    const metrics = await getMetrics({
      ...filters,
      dateType: "arrivalDate",
    });

    setMetrics(metrics);
  };

  const fetchMonthlyAnalytics = async (filters) => {
    const monthlyAnalytics = await getMonthlyAnalytics({
      ...filters,
      dateType: "arrivalDate",
    });

    setMonthlyAnalytics(monthlyAnalytics);
  };

  const fetchPerChannelAnalytics = async (filters) => {
    const monthlyAnalytics = await getPerChannelAnalytics({
      ...filters,
      dateType: "arrivalDate",
    });

    setPerChannelAnalytics(monthlyAnalytics);
  };

  const handleApplyFilters = async () => {
    await fetchMetrics(filters);
    await fetchMonthlyAnalytics(filters);
    await fetchPerChannelAnalytics(filters);
  };

  useEffect(() => {
    fetchMetrics(filters);
    fetchMonthlyAnalytics(filters);
    fetchPerChannelAnalytics(filters);
  }, []);

  if (!metrics || !monthlyAnalytics || !perChannelAnalytics) return;

  return (
    <>
      Filters
      <AnalyticsFilters
        filters={filters}
        onChange={setFilters}
        onApply={handleApplyFilters}
        allListings={listings}
      />
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

function AnalyticsFilters({ filters, allListings, onChange, onApply }) {
  const listingOptions = allListings.map((listing) => listing.id);
  const statusOptions = ["new", "modified"];

  const handleMultiSelectChange = (event, key) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    onChange((prev) => ({
      ...prev,
      [key]: selected,
    }));
  };

  return (
    <form
      className={styles.filtersForm}
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      <label className={styles.filtersField}>
        Listing Map IDs
        <select
          multiple
          value={filters.listingMapIds}
          onChange={(event) => handleMultiSelectChange(event, "listingMapIds")}
        >
          {listingOptions.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.filtersField}>
        From Date
        <input
          type="date"
          value={filters.fromDate}
          onChange={(event) =>
            onChange((prev) => ({
              ...prev,
              fromDate: event.target.value,
            }))
          }
        />
      </label>

      <label className={styles.filtersField}>
        To Date
        <input
          type="date"
          value={filters.toDate}
          onChange={(event) =>
            onChange((prev) => ({
              ...prev,
              toDate: event.target.value,
            }))
          }
        />
      </label>

      <label className={styles.filtersField}>
        Statuses
        <select
          multiple
          value={filters.statuses}
          onChange={(event) => handleMultiSelectChange(event, "statuses")}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className={styles.filtersButton}>
        Apply Filters
      </button>
    </form>
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
