import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const LIGHT_BG = '#FFFFFF';
const DARK_TEXT = '#1D4044';

function ChartTab({ title, description, dataFile, xAxisTitle, yAxisTitle, colors, compact = false, horizontal = false, leftMargin = null }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/data/${dataFile}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }
        return response.json();
      })
      .then(jsonData => {
        // If horizontal, sort categories by total value (biggest to smallest)
        if (horizontal) {
          const totals = jsonData.categories.map((cat, idx) => {
            const total = jsonData.series.reduce((sum, series) => sum + series.data[idx], 0);
            return { category: cat, total, index: idx };
          });

          // Sort by total descending, then reverse so biggest is at top
          totals.sort((a, b) => a.total - b.total);

          const sortedCategories = totals.map(t => t.category);
          const sortedIndices = totals.map(t => t.index);

          const sortedData = {
            categories: sortedCategories,
            series: jsonData.series.map(series => ({
              name: series.name,
              data: sortedIndices.map(idx => series.data[idx])
            }))
          };

          setData(sortedData);
        } else {
          setData(jsonData);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [dataFile, horizontal]);

  if (loading) {
    return (
      <div className="card">
        <h2 className="card-title">{title}</h2>
        <div className="loading">Loading data...</div>
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

  if (!data) {
    return null;
  }

  // Prepare Plotly data
  const plotData = data.series.map((series, index) => ({
    name: series.name,
    ...(horizontal ? {
      x: series.data,
      y: data.categories,
      orientation: 'h'
    } : {
      x: data.categories,
      y: series.data
    }),
    type: 'bar',
    marker: {
      color: colors[index % colors.length]
    },
    hovertemplate: horizontal
      ? `<b>${series.name}</b><br>%{y}<br>£%{x:,.0f}<extra></extra>`
      : `<b>${series.name}</b><br>%{x}<br>£%{y:,.0f}<extra></extra>`
  }));

  // Plotly layout with teal color scheme
  const layout = {
    title: compact ? undefined : {
      text: title,
      font: {
        family: 'Roboto',
        size: 20,
        color: DARK_TEXT
      }
    },
    font: {
      family: 'Roboto',
      color: DARK_TEXT,
      size: compact ? 10 : 12
    },
    barmode: 'stack',
    template: 'plotly_white',
    height: compact ? 400 : 600,
    plot_bgcolor: LIGHT_BG,
    paper_bgcolor: LIGHT_BG,
    xaxis: horizontal ? {
      title: compact ? undefined : yAxisTitle,
      gridcolor: '#E5E5E5',
      gridwidth: 1,
      griddash: 'dash',
      showgrid: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 1,
      tickformat: ',.0f',
      tickprefix: '£',
      tickfont: { size: compact ? 9 : 11 }
    } : {
      title: compact ? undefined : xAxisTitle,
      gridcolor: '#E5E5E5',
      gridwidth: 1,
      griddash: 'dash',
      showgrid: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 1,
      tickfont: { size: compact ? 9 : 11 },
      tickmode: 'linear',
      dtick: 1
    },
    yaxis: horizontal ? {
      title: compact ? undefined : xAxisTitle,
      gridcolor: '#E5E5E5',
      gridwidth: 1,
      griddash: 'dash',
      showgrid: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 1,
      tickfont: { size: compact ? 9 : 11 }
    } : {
      title: compact ? undefined : yAxisTitle,
      gridcolor: '#E5E5E5',
      gridwidth: 1,
      griddash: 'dash',
      showgrid: true,
      zerolinecolor: '#E5E5E5',
      zerolinewidth: 1,
      tickformat: ',.0f',
      tickprefix: '£',
      tickfont: { size: compact ? 9 : 11 }
    },
    margin: compact ? (horizontal ? {
      t: 20,
      b: 60,
      l: leftMargin !== null ? leftMargin : 150,
      r: 20
    } : {
      t: 20,
      b: 60,
      l: 60,
      r: 20
    }) : (horizontal ? {
      t: 100,
      b: 100,
      l: leftMargin !== null ? leftMargin : 180,
      r: 100
    } : {
      t: 100,
      b: 100,
      l: 100,
      r: 100
    }),
    showlegend: true,
    legend: {
      x: 0.5,
      xanchor: 'center',
      y: -0.25,
      yanchor: 'top',
      orientation: 'h',
      bgcolor: 'rgba(0,0,0,0)',
      bordercolor: 'rgba(0,0,0,0)',
      borderwidth: 0,
      font: { size: compact ? 9 : 11 },
      tracegroupgap: 0
    },
    images: compact ? [] : [{
      source: 'https://raw.githubusercontent.com/PolicyEngine/policyengine-app/master/src/images/logos/policyengine/blue.png',
      xref: 'paper',
      yref: 'paper',
      x: 1.05,
      y: -0.15,
      sizex: 0.15,
      sizey: 0.15,
      xanchor: 'right',
      yanchor: 'bottom'
    }],
    annotations: compact ? [] : [{
      text: 'Source: PolicyEngine UK tax-benefit microsimulation model, NHS Digital, ONS',
      xref: 'paper',
      yref: 'paper',
      x: 0,
      y: -0.15,
      showarrow: false,
      xanchor: 'left',
      yanchor: 'bottom',
      font: {
        size: 11,
        color: '#666'
      }
    }]
  };

  const config = {
    responsive: true,
    displayModeBar: false,
    displaylogo: false
  };

  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      {description && <p className="card-description">{description}</p>}
      <div className="chart-container">
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>
    </div>
  );
}

export default ChartTab;
