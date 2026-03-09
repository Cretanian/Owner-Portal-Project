import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import Heading from "../../../components/heading/Heading";
import LoaderContainer from "../../../components/loaderContainer/LoaderContainer";
import Popover from "../../../components/popover/Popover";
import InfoTooltip from "../../../components/infoTooltip/InfoTooltip";
import TextInput from "../../../components/formFields/TextInput";
import SelectInput from "../../../components/formFields/SelectInput";
import MultiSelectInput from "../../../components/formFields/MultiSelectInput";

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

  return (
    <>
      {!listings && <Heading level={1}>Analytics</Heading>}
      <LoaderContainer isLoading={!listings} minHeight="35vh">
        {listings?.length === 0 ? (
          "No listings"
        ) : (
          <AnalyticsPage_ listings={listings} />
        )}
      </LoaderContainer>
    </>
  );
}

function AnalyticsPage_({ listings = [] }) {
  const [metrics, setMetrics] = useState();
  const [monthlyAnalytics, setMonthlyAnalytics] = useState();
  const [perChannelAnalytics, setPerChannelAnalytics] = useState();
  const isAnalyticsLoading =
    !metrics || !monthlyAnalytics || !perChannelAnalytics;

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

  const handleApplyFilters = async (nextFilters = filters) => {
    setFilters(nextFilters);

    await fetchMetrics(nextFilters);
    await fetchMonthlyAnalytics(nextFilters);
    await fetchPerChannelAnalytics(nextFilters);
  };

  useEffect(() => {
    fetchMetrics(filters);
    fetchMonthlyAnalytics(filters);
    fetchPerChannelAnalytics(filters);
  }, []);

  return (
    <>
      <Heading
        level={1}
        right={
          !isAnalyticsLoading ? (
            <Popover triggerLabel="Open Filters" title="Analytics Filters">
              {({ close }) => (
                <AnalyticsFilters
                  filters={filters}
                  onApply={async (nextFilters) => {
                    close();

                    await handleApplyFilters(nextFilters);
                  }}
                  allListings={listings}
                />
              )}
            </Popover>
          ) : null
        }
      >
        Analytics
      </Heading>
      <LoaderContainer isLoading={isAnalyticsLoading} minHeight="35vh">
        <>
          <div className={styles.metrics}>
            {Object.keys(metrics ?? {}).map((key) => (
              <div className={styles.numberChart}>
                <div className={styles.numberChartHeader}>
                  <div className={styles.numberChartTitle}>{key}</div>
                  <InfoTooltip content={getMetricTooltip(key)} />
                </div>
                <div className={styles.numberChartValue}> {metrics[key]} </div>
              </div>
            ))}
          </div>
          <div className={styles.chartsGrid}>
            <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
              <Heading
                level={4}
                right={
                  <InfoTooltip content="Compares monthly revenue per listing and the overall revenue trend for the selected period." />
                }
              >
                Revenue Over Time
              </Heading>
              <RevenueOverTimeChart data={monthlyAnalytics} />
            </div>
            <div className={styles.chartCard}>
              <Heading
                level={4}
                right={
                  <InfoTooltip content="Shows how total revenue is distributed across channels such as AirBnb, Booking, and CHS." />
                }
              >
                Revenue By Channel
              </Heading>
              <RevenueByChannelPie data={perChannelAnalytics} />
            </div>

            <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
              <Heading
                level={4}
                right={
                  <InfoTooltip content="Shows how many nights each listing contributes per month, highlighting seasonality and occupancy patterns." />
                }
              >
                Nights Over Time
              </Heading>
              <NightsOverTimeChart data={monthlyAnalytics} />
            </div>
            <div className={styles.chartCard}>
              <Heading
                level={4}
                right={
                  <InfoTooltip content="Compares total booked nights by channel within the selected date range." />
                }
              >
                Nights By Channel
              </Heading>
              <NightsByChannelBar data={perChannelAnalytics} />
            </div>
          </div>
        </>
      </LoaderContainer>
    </>
  );
}

function AnalyticsFilters({ filters, allListings, onApply }) {
  const listingOptions = allListings.map((listing) => ({
    value: `${listing.id}`,
    label: `${listing.name ?? "Listing"} (${listing.id})`,
  }));
  const statusOptions = ["new", "modified"];
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: filters,
  });

  useEffect(() => {
    reset(filters);
  }, [filters, reset]);

  return (
    <form className={styles.filtersForm} onSubmit={handleSubmit(onApply)}>
      <Controller
        name="listingMapIds"
        control={control}
        render={({ field }) => (
          <MultiSelectInput
            label="Listing Map IDs"
            options={listingOptions}
            values={field.value ?? []}
            onChange={field.onChange}
            placeholder="Select listings..."
            error={errors.listingMapIds?.message}
            menuPortalTarget={document.body}
            maxValueContainerHeight="88px"
          />
        )}
      />

      <TextInput
        label="From Date"
        type="date"
        error={errors.fromDate?.message}
        {...register("fromDate", {
          required: "From date is required.",
        })}
      />

      <TextInput
        label="To Date"
        type="date"
        error={errors.toDate?.message}
        {...register("toDate", {
          required: "To date is required.",
        })}
      />

      <Controller
        name="statuses"
        control={control}
        render={({ field }) => (
          <MultiSelectInput
            label="Statuses"
            options={statusOptions.map((status) => ({
              value: status,
              label: status,
            }))}
            values={field.value ?? []}
            onChange={field.onChange}
            placeholder="Select statuses..."
            error={errors.statuses?.message}
            menuPortalTarget={document.body}
          />
        )}
      />

      <Controller
        name="dateType"
        control={control}
        defaultValue="arrivalDate"
        render={({ field }) => (
          <SelectInput
            label="Date Type"
            options={[{ value: "arrivalDate", label: "Arrival Date" }]}
            value={field.value}
            onChange={field.onChange}
            error={errors.dateType?.message}
            menuPortalTarget={document.body}
          />
        )}
      />

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

const METRIC_TOOLTIPS = {
  reservations: "Total reservations matching the active filters.",
  nights: "Total booked nights across all selected listings and channels.",
  revenue: "Total revenue for the selected date range and filters.",
  averageNightlyRate:
    "Average revenue per booked night (total revenue divided by total nights).",
  occupancyRate:
    "Percentage of available nights that were booked in the selected period.",
  cancellationRate:
    "Percentage of reservations that were cancelled within the filtered data.",
};

function getMetricTooltip(metricKey) {
  const normalizedKey = String(metricKey ?? "").trim();
  return (
    METRIC_TOOLTIPS[normalizedKey] ??
    `Summary value for "${normalizedKey}" based on the current filters.`
  );
}

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

const legendSpacingPlugin = {
  id: "legendSpacingPlugin",
  beforeInit(chart, _args, options) {
    if (!chart.legend) return;

    const originalFit = chart.legend.fit;
    chart.legend.fit = function fitWithExtraSpacing() {
      originalFit.bind(this)();
      this.height += options?.padding ?? 14;
    };
  },
};

// ---- charts ----

export function NightsOverTimeChart({ data }) {
  const chartData = buildTimeSeries(data, "nights");

  return (
    <div className={styles.chartViewport}>
      <Line
        plugins={[legendSpacingPlugin]}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { top: 10, right: 12, bottom: 8, left: 8 },
          },
          plugins: {
            legendSpacingPlugin: { padding: 18 },
            title: { display: false, text: "Nights over time per listing" },
            legend: {
              position: "top",
              align: "center",
              labels: {
                padding: 14,
              },
            },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            y: {
              title: { display: true, text: "Nights", padding: 10 },
              ticks: { padding: 12 },
            },
            x: {
              title: { display: true, text: "Month", padding: 10 },
              ticks: { padding: 12 },
            },
          },
        }}
      />
    </div>
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
    <div className={styles.chartViewport}>
      <Line
        plugins={[legendSpacingPlugin]}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { top: 10, right: 12, bottom: 8, left: 8 },
          },
          plugins: {
            legendSpacingPlugin: { padding: 18 },
            title: { display: false, text: "Revenue over time per listing" },
            legend: {
              position: "top",
              align: "center",
              labels: {
                padding: 14,
              },
            },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: {
              stacked: false,
              title: { display: true, text: "Month", padding: 10 },
              ticks: { padding: 12 },
            },
            y: {
              stacked: false,
              title: { display: true, text: "Revenue", padding: 10 },
              ticks: { padding: 12 },
            },
          },
        }}
      />
    </div>
  );
}

export function RevenueByChannelPie({ data }) {
  const labels = data.map((d) => d.channel);
  const values = data.map((d) => Number(d.revenue));
  const colors = labels.map(stringToColor);

  return (
    <div className={styles.chartViewport}>
      <Pie
        plugins={[legendSpacingPlugin]}
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { top: 10, right: 12, bottom: 8, left: 8 },
          },
          plugins: {
            legendSpacingPlugin: { padding: 18 },
            title: { display: false, text: "Total revenue by channel" },
            legend: {
              position: "top",
              align: "center",
              labels: {
                padding: 14,
              },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: €${ctx.parsed.toLocaleString()}`,
              },
            },
          },
        }}
      />
    </div>
  );
}

export function NightsByChannelBar({ data }) {
  const labels = data.map((d) => d.channel);
  const values = data.map((d) => Number(d.nights));
  const colors = labels.map(stringToColor);

  return (
    <div className={styles.chartViewport}>
      <Bar
        plugins={[legendSpacingPlugin]}
        data={{
          labels,
          datasets: [
            {
              label: "Nights",
              data: values,
              backgroundColor: colors,
              borderRadius: 8,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { top: 10, right: 12, bottom: 8, left: 8 },
          },
          plugins: {
            legendSpacingPlugin: { padding: 18 },
            title: { display: false, text: "Nights per channel" },
            legend: {
              position: "top",
              align: "center",
              labels: {
                padding: 14,
                generateLabels: (chart) => {
                  const labels = chart.data.labels ?? [];
                  const dataset = chart.data.datasets?.[0];
                  const backgroundColors = Array.isArray(
                    dataset?.backgroundColor,
                  )
                    ? dataset.backgroundColor
                    : [];

                  return labels.map((label, index) => ({
                    text: String(label),
                    fillStyle: backgroundColors[index] ?? "#98a2b3",
                    strokeStyle: backgroundColors[index] ?? "#98a2b3",
                    lineWidth: 0,
                    hidden: false,
                    datasetIndex: 0,
                  }));
                },
              },
              onClick: () => null,
            },
          },
          scales: {
            y: {
              title: { display: true, text: "Nights", padding: 10 },
              ticks: { padding: 12 },
            },
            x: {
              ticks: { padding: 18 },
            },
          },
        }}
      />
    </div>
  );
}

export default AnalyticsPage;
