import React from 'react';
import './App.css';
import ChartTab from './components/ChartTab';

// Color scheme - matching series order: NHS, Education, Rail subsidy, Bus subsidy
const COLORS = ['#4472C4', '#ED7D31', '#E06666', '#4BACC6'];

function App() {
  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            {/* Empty space for symmetry */}
          </div>
          <h1>UK Public Services Spending Analysis</h1>
          <div className="header-right">
            <img
              src="https://raw.githubusercontent.com/PolicyEngine/policyengine-app/master/src/images/logos/policyengine/white.png"
              alt="PolicyEngine"
              className="header-logo"
            />
          </div>
        </div>
      </header>

      <div className="content">
        {/* Analysis Sections */}
        <section className="analysis-section">
          <div className="section-header">
            <h2>Spending by demographic characteristics</h2>
            <p>How public services spending varies across different population groups</p>
          </div>
          <div className="section-charts">
            <ChartTab
              title="Spending by Income Decile"
              description="Annual public services spending per household across income deciles, from the poorest 10% (1st) to the richest 10% (10th) of households."
              dataFile="by_income_decile.json"
              xAxisTitle="Income Decile"
              yAxisTitle="Per-year spending per household (£)"
              colors={COLORS}
              compact={true}
            />
            <ChartTab
              title="Spending by Region"
              description="Regional distribution of public services spending per household across the UK."
              dataFile="by_region.json"
              xAxisTitle="Region"
              yAxisTitle="Per-year spending per household (£)"
              colors={COLORS}
              compact={true}
            />
          </div>
        </section>

        <section className="analysis-section">
          <div className="section-header">
            <h2>Spending by household composition</h2>
            <p>Distribution of public services across different household types and age groups</p>
          </div>
          <div className="section-charts">
            <ChartTab
              title="Spending by Age Group"
              description="Per-person public services spending across different age groups, showing how spending varies throughout the lifecycle."
              dataFile="by_age_group.json"
              xAxisTitle="Age Group"
              yAxisTitle="Per-year spending per person (£)"
              colors={COLORS}
              compact={true}
            />
            <ChartTab
              title="Spending by Household Type"
              description="Distribution of public services spending across different household compositions and family structures."
              dataFile="by_household_type.json"
              xAxisTitle="Household Type"
              yAxisTitle="Per-year spending per household (£)"
              colors={COLORS}
              compact={true}
            />
          </div>
        </section>

        <section className="analysis-section">
          <div className="section-header">
            <h2>NHS service breakdown</h2>
            <p>Detailed analysis of NHS spending by service type across income deciles</p>
          </div>
          <div className="section-charts single">
            <ChartTab
              title="NHS Service Breakdown by Income Decile"
              description="Breakdown of NHS spending by service type (hospital, GP, prescriptions, etc.) across income deciles, showing how different services are utilized by different income groups."
              dataFile="nhs_services_by_decile.json"
              xAxisTitle="Income Decile"
              yAxisTitle="Per-year NHS spending per household (£)"
              colors={COLORS}
              compact={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
