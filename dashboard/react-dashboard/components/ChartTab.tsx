"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// react-plotly.js / plotly.js touch `window` at import time, so they cannot be
// imported on the server. Dynamic-import with ssr:false defers loading to the
// browser. The chart card placeholder above renders the same "Loading data…"
// message used by the in-flight fetch state, so users see a consistent state.
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div className="loading">Loading chart…</div>,
});

const LIGHT_BG = "#FFFFFF";
const DARK_TEXT = "#1D4044";

interface Series {
  name: string;
  data: number[];
}

interface ChartData {
  categories: string[];
  series: Series[];
}

interface ChartTabProps {
  title: string;
  description?: string;
  dataFile: string;
  xAxisTitle: string;
  yAxisTitle: string;
  colors: string[];
  compact?: boolean;
  horizontal?: boolean;
  leftMargin?: number | null;
}

function basePathPrefix(): string {
  // Next exposes the configured basePath at runtime via NEXT_PUBLIC_BASE_PATH.
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

export default function ChartTab({
  title,
  description,
  dataFile,
  xAxisTitle,
  yAxisTitle,
  colors,
  compact = false,
  horizontal = false,
  leftMargin = null,
}: ChartTabProps) {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${basePathPrefix()}/data/${dataFile}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }
        return response.json();
      })
      .then((jsonData: ChartData) => {
        if (horizontal) {
          // Sort categories by stacked total so the longest bar sits at the
          // top of the chart (Plotly's `orientation: 'h'` plots index 0 at the
          // bottom, so we sort ascending and let Plotly draw bottom-up).
          const totals = jsonData.categories.map((cat, idx) => ({
            category: cat,
            total: jsonData.series.reduce(
              (sum, series) => sum + series.data[idx],
              0,
            ),
            index: idx,
          }));
          totals.sort((a, b) => a.total - b.total);

          const sortedIndices = totals.map((t) => t.index);
          setData({
            categories: totals.map((t) => t.category),
            series: jsonData.series.map((series) => ({
              name: series.name,
              data: sortedIndices.map((idx) => series.data[idx]),
            })),
          });
        } else {
          setData(jsonData);
        }
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [dataFile, horizontal]);

  if (loading) {
    return (
      <div className="card">
        <h2 className="card-title">{title}</h2>
        <div className="loading">Loading data…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="card-title">{title}</h2>
        <div className="error">Error loading data: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  const plotData = data.series.map((series, index) => ({
    name: series.name,
    ...(horizontal
      ? { x: series.data, y: data.categories, orientation: "h" as const }
      : { x: data.categories, y: series.data }),
    type: "bar" as const,
    marker: { color: colors[index % colors.length] },
    hovertemplate: horizontal
      ? `<b>${series.name}</b><br>%{y}<br>£%{x:,.0f}<extra></extra>`
      : `<b>${series.name}</b><br>%{x}<br>£%{y:,.0f}<extra></extra>`,
  }));

  const valueAxis = {
    title: compact ? undefined : horizontal ? yAxisTitle : yAxisTitle,
    gridcolor: "#E5E5E5",
    gridwidth: 1,
    griddash: "dash",
    showgrid: true,
    zerolinecolor: "#E5E5E5",
    zerolinewidth: 1,
    tickformat: ",.0f",
    tickprefix: "£",
    tickfont: { size: compact ? 9 : 11 },
  };
  const categoryAxis = horizontal
    ? {
        title: compact ? undefined : xAxisTitle,
        gridcolor: "#E5E5E5",
        gridwidth: 1,
        griddash: "dash",
        showgrid: true,
        zerolinecolor: "#E5E5E5",
        zerolinewidth: 1,
        tickfont: { size: compact ? 9 : 11 },
      }
    : {
        title: compact ? undefined : xAxisTitle,
        gridcolor: "#E5E5E5",
        gridwidth: 1,
        griddash: "dash",
        showgrid: true,
        zerolinecolor: "#E5E5E5",
        zerolinewidth: 1,
        tickfont: { size: compact ? 9 : 11 },
        tickmode: "linear",
        dtick: 1,
      };

  const compactMargin = horizontal
    ? { t: 20, b: 60, l: leftMargin ?? 150, r: 20 }
    : { t: 20, b: 60, l: 60, r: 20 };
  const fullMargin = horizontal
    ? { t: 100, b: 100, l: leftMargin ?? 180, r: 100 }
    : { t: 100, b: 100, l: 100, r: 100 };

  const layout = {
    title: compact
      ? undefined
      : {
          text: title,
          font: { family: "Roboto", size: 20, color: DARK_TEXT },
        },
    font: { family: "Roboto", color: DARK_TEXT, size: compact ? 10 : 12 },
    barmode: "stack" as const,
    template: "plotly_white",
    height: compact ? 400 : 600,
    plot_bgcolor: LIGHT_BG,
    paper_bgcolor: LIGHT_BG,
    xaxis: horizontal ? valueAxis : categoryAxis,
    yaxis: horizontal ? categoryAxis : valueAxis,
    margin: compact ? compactMargin : fullMargin,
    showlegend: true,
    legend: {
      x: 0.5,
      xanchor: "center" as const,
      y: -0.25,
      yanchor: "top" as const,
      orientation: "h" as const,
      bgcolor: "rgba(0,0,0,0)",
      bordercolor: "rgba(0,0,0,0)",
      borderwidth: 0,
      font: { size: compact ? 9 : 11 },
      tracegroupgap: 0,
    },
    images: compact
      ? []
      : [
          {
            source:
              "https://raw.githubusercontent.com/PolicyEngine/policyengine-app/master/src/images/logos/policyengine/blue.png",
            xref: "paper" as const,
            yref: "paper" as const,
            x: 1.05,
            y: -0.15,
            sizex: 0.15,
            sizey: 0.15,
            xanchor: "right" as const,
            yanchor: "bottom" as const,
          },
        ],
    annotations: compact
      ? []
      : [
          {
            text: "Source: PolicyEngine UK tax-benefit microsimulation model, NHS Digital, ONS",
            xref: "paper" as const,
            yref: "paper" as const,
            x: 0,
            y: -0.15,
            showarrow: false,
            xanchor: "left" as const,
            yanchor: "bottom" as const,
            font: { size: 11, color: "#666" },
          },
        ],
  };

  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      {description && <p className="card-description">{description}</p>}
      <div className="chart-container">
        <Plot
          data={plotData}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          layout={layout as any}
          config={{
            responsive: true,
            displayModeBar: false,
            displaylogo: false,
          }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler
        />
      </div>
    </div>
  );
}
