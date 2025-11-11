import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const LIGHT_BG = '#FFFFFF';
const DARK_TEXT = '#1D4044';

// Region coordinates (approximate centers) and display names
const REGION_INFO = {
  'EAST_MIDLANDS': { lat: 52.8, lon: -1.0, name: 'East Midlands' },
  'EAST_OF_ENGLAND': { lat: 52.2, lon: 0.5, name: 'East of England' },
  'LONDON': { lat: 51.5, lon: -0.1, name: 'London' },
  'NORTHERN_IRELAND': { lat: 54.6, lon: -6.5, name: 'Northern Ireland' },
  'NORTH_EAST': { lat: 55.0, lon: -1.6, name: 'North East' },
  'NORTH_WEST': { lat: 53.7, lon: -2.7, name: 'North West' },
  'SCOTLAND': { lat: 56.5, lon: -4.0, name: 'Scotland' },
  'SOUTH_EAST': { lat: 51.3, lon: 0.0, name: 'South East' },
  'SOUTH_WEST': { lat: 50.8, lon: -3.5, name: 'South West' },
  'WALES': { lat: 52.3, lon: -3.7, name: 'Wales' },
  'WEST_MIDLANDS': { lat: 52.5, lon: -2.0, name: 'West Midlands' },
  'YORKSHIRE': { lat: 53.8, lon: -1.3, name: 'Yorkshire' }
};

function UKMapTab({ title, description, compact = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('/data/by_region.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }
        return response.json();
      })
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

  // Calculate total spending per region
  const regionTotals = data.categories.map((region, index) => {
    const total = data.series.reduce((sum, series) => sum + series.data[index], 0);
    return {
      region,
      displayName: REGION_INFO[region]?.name || region,
      total,
      lat: REGION_INFO[region]?.lat || 52,
      lon: REGION_INFO[region]?.lon || 0,
      breakdown: {
        NHS: data.series.find(s => s.name === 'NHS')?.data[index] || 0,
        Education: data.series.find(s => s.name === 'Education')?.data[index] || 0,
        'Rail subsidy': data.series.find(s => s.name === 'Rail subsidy')?.data[index] || 0,
        'Bus subsidy': data.series.find(s => s.name === 'Bus subsidy')?.data[index] || 0
      }
    };
  });

  // Create scattergeo data for markers
  const plotData = [{
    type: 'scattergeo',
    mode: 'markers',
    lon: regionTotals.map(r => r.lon),
    lat: regionTotals.map(r => r.lat),
    text: regionTotals.map(r => r.displayName),
    marker: {
      size: regionTotals.map(r => r.total / 100), // Scale marker size
      color: regionTotals.map(r => r.total),
      colorscale: [
        [0, '#E8F4F8'],
        [0.5, '#4BACC6'],
        [1, '#1D4044']
      ],
      cmin: Math.min(...regionTotals.map(r => r.total)),
      cmax: Math.max(...regionTotals.map(r => r.total)),
      colorbar: {
        title: {
          text: 'Total Spending (£)',
          side: 'right',
          font: {
            family: 'Roboto',
            size: 11,
            color: DARK_TEXT
          }
        },
        thickness: 15,
        len: 0.6,
        tickfont: {
          family: 'Roboto',
          size: 10,
          color: DARK_TEXT
        },
        tickformat: ',.0f',
        tickprefix: '£'
      },
      line: {
        color: '#FFFFFF',
        width: 2
      }
    },
    hovertemplate:
      '<b>%{text}</b><br>' +
      'Total: £%{marker.color:,.0f}<br>' +
      '<extra></extra>',
    customdata: regionTotals.map(r => [
      r.breakdown.NHS,
      r.breakdown.Education,
      r.breakdown['Rail subsidy'],
      r.breakdown['Bus subsidy']
    ])
  }];

  // Plotly layout for UK-focused map
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
    geo: {
      scope: 'europe',
      resolution: 50,
      center: {
        lon: -2.5,
        lat: 54.0
      },
      projection: {
        type: 'mercator',
        scale: 3.5
      },
      showland: true,
      landcolor: '#F0F0F0',
      showocean: true,
      oceancolor: '#E3F2FD',
      showcountries: true,
      countrycolor: '#CCCCCC',
      countrywidth: 0.5,
      showlakes: true,
      lakecolor: '#E3F2FD',
      bgcolor: LIGHT_BG,
      lonaxis: {
        range: [-11, 3]
      },
      lataxis: {
        range: [49.5, 61]
      }
    },
    height: compact ? 500 : 700,
    plot_bgcolor: LIGHT_BG,
    paper_bgcolor: LIGHT_BG,
    margin: compact ? {
      t: 40,
      b: 20,
      l: 0,
      r: 0
    } : {
      t: 80,
      b: 40,
      l: 0,
      r: 0
    },
    images: compact ? [] : [{
      source: 'https://raw.githubusercontent.com/PolicyEngine/policyengine-app/master/src/images/logos/policyengine/blue.png',
      xref: 'paper',
      yref: 'paper',
      x: 1.0,
      y: 0,
      sizex: 0.15,
      sizey: 0.15,
      xanchor: 'right',
      yanchor: 'bottom'
    }]
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['select2d', 'lasso2d'],
    scrollZoom: false
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
          onClick={(event) => {
            if (event.points && event.points[0]) {
              const pointIndex = event.points[0].pointIndex;
              setSelectedRegion(regionTotals[pointIndex]);
            }
          }}
        />
      </div>
      {selectedRegion && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#E8F4F8',
          borderRadius: '4px',
          color: DARK_TEXT,
          fontFamily: 'Roboto'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
            {selectedRegion.displayName}
          </h3>
          <div style={{ fontSize: '0.95rem' }}>
            <strong>Total Spending:</strong> £{selectedRegion.total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <div style={{ marginTop: '0.5rem' }}>
              <div>NHS: £{selectedRegion.breakdown.NHS.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div>Education: £{selectedRegion.breakdown.Education.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div>Rail subsidy: £{selectedRegion.breakdown['Rail subsidy'].toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div>Bus subsidy: £{selectedRegion.breakdown['Bus subsidy'].toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UKMapTab;
