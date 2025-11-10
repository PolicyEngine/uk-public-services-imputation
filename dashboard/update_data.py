"""
Script to update the dashboard data.js file from dashboard_data.csv
Run this after generating dashboard_data.csv from your analysis notebook
"""
import pandas as pd
import json

# Read the CSV data
df = pd.read_csv('dashboard_data.csv')

# Ensure income_decile is integer
df['income_decile'] = df['income_decile'].astype(int)

# Sort by decile
df = df.sort_values('income_decile')

# Teal color scheme
TEAL_COLORS = [
    '#319795',  # NHS - Core teal
    '#2C7A7B',  # Education - Dark teal
    '#81E6D9',  # Rail subsidy - Light teal
    '#4FD1C5'   # Bus subsidy - Medium teal
]

# Column mapping
columns = ['NHS', 'Education', 'Rail subsidy', 'Bus subsidy']

# Generate JavaScript code
js_code = """// Public services spending data by income decile
// Auto-generated from dashboard_data.csv

// Teal color scheme
const TEAL_COLORS = [
    '#319795',  // NHS - Core teal
    '#2C7A7B',  // Education - Dark teal
    '#81E6D9',  // Rail subsidy - Light teal
    '#4FD1C5'   // Bus subsidy - Medium teal
];

const incomeDeciles = {deciles};

const chartData = [
""".format(deciles=json.dumps(df['income_decile'].tolist()))

# Add each series
for i, col in enumerate(columns):
    values = df[col].round(2).tolist()
    js_code += f"""    {{
        name: '{col}',
        x: incomeDeciles,
        y: {json.dumps(values)},
        type: 'bar',
        marker: {{ color: TEAL_COLORS[{i}] }},
        hovertemplate: '<b>{col}</b><br>Decile: %{{x}}<br>Spending: £%{{y:,.0f}}<extra></extra>'
    }}"""
    if i < len(columns) - 1:
        js_code += ","
    js_code += "\n"

js_code += "];\n"

# Write to data.js
with open('data.js', 'w') as f:
    f.write(js_code)

print("✓ Dashboard data updated successfully!")
print(f"✓ Loaded {len(df)} income deciles")
print(f"✓ Updated {len(columns)} spending categories")
