# UK Public Services Spending Dashboard

A static, interactive dashboard showing public services spending by income decile, styled to match PolicyEngine's design system.

## Quick Start

1. Open `index.html` in your web browser to view the dashboard
2. The dashboard currently shows placeholder data extracted from the chart image

## Updating with Real Data

To update the dashboard with actual data from your analysis:

### Option 1: From Jupyter Notebook

Add this code cell to the end of `docs/analysis.ipynb`:

```python
# Export the aggregated data for the dashboard
aggregated = data_h[list(imputations.values())].groupby(
    data_h.equiv_hbai_household_net_income.decile_rank()
).mean()

# Reset index to make income_decile a column
aggregated = aggregated.reset_index()
aggregated = aggregated.rename(columns={"equiv_hbai_household_net_income": "income_decile"})

# Save to CSV
aggregated.to_csv("../dashboard/dashboard_data.csv", index=False)
print("Dashboard data saved!")
```

Then run:
```bash
cd dashboard
python update_data.py
```

### Option 2: Manual CSV Creation

Create a CSV file named `dashboard_data.csv` in the `dashboard/` folder with this structure:

```csv
income_decile,NHS,Education,Rail subsidy,Bus subsidy
1,8000,10000,400,300
2,8300,7800,500,350
...
```

Then run the update script:
```bash
cd dashboard
python update_data.py
```

## Files

- `index.html` - Main dashboard HTML file
- `data.js` - Chart data in JavaScript format
- `update_data.py` - Script to convert CSV to JavaScript data
- `dashboard_data.csv` - CSV data file (created by you)

## Features

- **Interactive Chart**: Hover over bars to see detailed spending values
- **PolicyEngine Styling**: Matches the official PolicyEngine design system
- **Responsive Design**: Works on desktop and mobile devices
- **Download**: Export chart as high-resolution PNG
- **No Backend Required**: Completely static, can be hosted anywhere

## Styling Details

The dashboard uses:
- **Font**: Roboto Serif (matches PolicyEngine)
- **Colors**:
  - Primary blue: `#2C6496`
  - Background: `#F4F4F4` (Fog Gray)
  - Chart colors: Plotly T10 palette
- **Layout**: Clean, card-based design with clear information hierarchy

## Deployment

To deploy the dashboard:

1. **GitHub Pages**: Push the `dashboard/` folder and enable Pages
2. **Netlify/Vercel**: Drag and drop the folder
3. **Any web server**: Just upload the files

No build process or server required!
