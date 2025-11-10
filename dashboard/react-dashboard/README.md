# UK Public Services Spending Dashboard

An interactive React dashboard for analyzing UK public services spending across multiple dimensions.

## Features

### Multiple Analysis Tabs

1. **Income Decile** - Distribution across household income levels
2. **Region** - Geographic breakdown of spending
3. **Age Group** - Spending patterns by age demographics
4. **Household Type** - Analysis by household composition
5. **NHS Services** - Detailed NHS service breakdown

### Key Features

- 📊 Interactive Plotly charts with zoom, pan, and export
- 🎨 PolicyEngine design system styling
- 📱 Fully responsive (desktop and mobile)
- 🔄 Real data from PolicyEngine microsimulation
- ⚡ Fast, static React app (no backend required)

## Quick Start

### Prerequisites

- Node.js 14+ and npm

### Installation

```bash
cd react-dashboard
npm install
```

### Development

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Project Structure

```
react-dashboard/
├── public/
│   ├── index.html
│   └── data/              # JSON data files
│       ├── by_income_decile.json
│       ├── by_region.json
│       ├── by_age_group.json
│       ├── by_household_type.json
│       └── nhs_services_by_decile.json
├── src/
│   ├── App.js             # Main app with tab navigation
│   ├── App.css            # PolicyEngine styling
│   ├── index.js           # React entry point
│   └── components/
│       └── ChartTab.js    # Reusable chart component
└── package.json
```

## Data Update Process

To update the dashboard with new data:

1. **Generate fresh imputed data** (if needed):
   ```bash
   cd ..
   python generate_chart.py
   ```

2. **Generate all analysis JSON files**:
   ```bash
   cd ..
   python generate_all_analyses.py
   ```

3. **Copy to React public folder** (if needed):
   ```bash
   cp -r ../data public/
   ```

4. **Restart dev server** (React will auto-reload)

## Deployment Options

### Option 1: Static Hosting

Build and deploy to any static host:

```bash
npm run build
# Upload build/ folder to:
# - GitHub Pages
# - Netlify
# - Vercel
# - AWS S3
# - Any web server
```

### Option 2: Netlify (Recommended)

1. Connect your GitHub repo
2. Build command: `npm run build`
3. Publish directory: `build`
4. Deploy!

### Option 3: GitHub Pages

```bash
npm run build
# Follow GitHub Pages setup for React apps
```

## Customization

### Colors

Edit `src/App.js`:

```javascript
const COLORS = ['#4C78A8', '#F58518', '#E45756', '#72B7B2'];
```

### Add New Tab

1. Add tab definition in `src/App.js`:
```javascript
{
  id: 'new-analysis',
  label: 'New Analysis',
  dataFile: 'new_analysis.json',
  title: 'New Analysis Title',
  description: 'Description...',
  xAxisTitle: 'X Axis',
  yAxisTitle: 'Y Axis'
}
```

2. Generate corresponding JSON data file
3. Place in `public/data/`

### Styling

All styling in `src/App.css` following PolicyEngine design system:
- Primary color: `#2C6496`
- Background: `#F4F4F4`
- Font: Roboto Serif

## Technical Details

- **React**: ^18.2.0
- **Plotly.js**: ^2.27.0
- **react-plotly.js**: ^2.6.0

No database or backend required - all data loaded from JSON files.

## License

© 2024 PolicyEngine
