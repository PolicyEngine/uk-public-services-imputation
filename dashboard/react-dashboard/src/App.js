import React from 'react';
import './App.css';
import ChartTab from './components/ChartTab';
import UKMapTab from './components/UKMapTab';

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
        {/* Introduction */}
        <section className="analysis-section intro-section">
          <div className="section-header">
            <h2>Introduction</h2>
            <p className="intro-text">
              This dashboard presents an analysis of UK public services spending across different demographic groups and regions for the 2022-23 fiscal year. By integrating both machine learning techniques and administrative data, this analysis incorporates the value of public services including NHS healthcare, education, rail subsidies, and bus subsidies. The methodology uses the government's Effects of Taxes and Benefits (ETB) 2021 dataset combined with PolicyEngine's Enhanced Family Resources Survey (FRS) 2022-23 data to provide household-level estimates. For a full methodology report and technical documentation, visit <a href="https://policyengine.github.io/uk-public-services-imputation/" target="_blank" rel="noopener noreferrer">PolicyEngine's UK Public Services Imputation documentation</a> and the <a href="https://github.com/PolicyEngine/uk-public-services-imputation" target="_blank" rel="noopener noreferrer">GitHub repository</a>. Below we present the distributional analysis of public services spending by demographic characteristics and household composition.
            </p>
          </div>
        </section>

        {/* Analysis Sections */}
        <section className="analysis-section no-bottom-space">
          <div className="section-header">
            <h2>Spending by demographic characteristics</h2>
            <p>How public services spending varies across different population groups, including analysis by income decile and geographic region</p>
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

        <section className="analysis-section no-top-space">
          <div className="section-header">
            <h2>Spending by household composition</h2>
            <p>Distribution of public services across different household types and age groups, showing how spending patterns vary by family structure and lifecycle stage</p>
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
      </div>
    </div>
  );
}

export default App;
