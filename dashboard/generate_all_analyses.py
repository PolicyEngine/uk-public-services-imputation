"""
Generate comprehensive analyses for the dashboard.
Creates multiple JSON files with different breakdowns of public services spending.
"""
import pandas as pd
import numpy as np
from pathlib import Path
from microdf import MicroDataFrame
import json

# Get the data folder path
folder = Path("/Users/janansadeqian/uk-public-services-imputation/src/uk_public_services_imputation/data")
data_csv_path = folder / "data.csv"

print("Loading data...")
if not data_csv_path.exists():
    print(f"Error: {data_csv_path} not found!")
    exit(1)

data = pd.read_csv(data_csv_path)
print(f"Loaded {len(data)} rows")

# Create MicroDataFrame with weights
data = MicroDataFrame(data, weights="household_weight")
data["people"] = 1

# Spending columns mapping
spending_cols = {
    "nhs_spending": "NHS",
    "dfe_education_spending": "Education",
    "rail_subsidy_spending": "Rail subsidy",
    "bus_subsidy_spending": "Bus subsidy",
}

# NHS service columns
nhs_service_cols = {
    "nhs_a_and_e_spending": "A&E",
    "nhs_admitted_patient_spending": "Admitted Patient",
    "nhs_outpatient_spending": "Outpatient",
}

# Output directory
output_dir = Path("/Users/janansadeqian/uk-public-services-imputation/dashboard/data")
output_dir.mkdir(exist_ok=True)

print("\n" + "="*60)
print("ANALYSIS 1: Spending by Income Decile")
print("="*60)

# Group by household for income analysis
data_h = data.groupby("household_id")[
    list(spending_cols.keys()) + [
        "equiv_hbai_household_net_income",
        "people",
        "household_weight",
    ]
].sum()

data_h.equiv_hbai_household_net_income /= data_h.people.values
data_h.household_weight /= data_h.people.values

data_h = MicroDataFrame(data_h.rename(columns=spending_cols), weights="household_weight")

# Calculate by income decile
by_decile = data_h[list(spending_cols.values())].groupby(
    data_h.equiv_hbai_household_net_income.decile_rank()
).mean()

by_decile_data = {
    "categories": list(range(1, 11)),
    "series": []
}

for col in spending_cols.values():
    by_decile_data["series"].append({
        "name": col,
        "data": by_decile[col].round(2).tolist()
    })

with open(output_dir / "by_income_decile.json", "w") as f:
    json.dump(by_decile_data, f, indent=2)

print(f"✓ Generated: by_income_decile.json")

print("\n" + "="*60)
print("ANALYSIS 2: Spending by Region")
print("="*60)

# Group by household for regional analysis
data_h_region = data.groupby("household_id")[
    list(spending_cols.keys()) + ["region", "household_weight"]
].sum()

# Get the most common region per household (mode)
region_mode = data.groupby("household_id")["region"].agg(lambda x: x.mode()[0] if len(x.mode()) > 0 else x.iloc[0])
data_h_region["region"] = region_mode

data_h_region = MicroDataFrame(data_h_region.rename(columns=spending_cols), weights="household_weight")

# Calculate by region
by_region = data_h_region.groupby("region")[list(spending_cols.values())].mean()

by_region_data = {
    "categories": by_region.index.tolist(),
    "series": []
}

for col in spending_cols.values():
    by_region_data["series"].append({
        "name": col,
        "data": by_region[col].round(2).tolist()
    })

with open(output_dir / "by_region.json", "w") as f:
    json.dump(by_region_data, f, indent=2)

print(f"✓ Generated: by_region.json")

print("\n" + "="*60)
print("ANALYSIS 3: Spending by Age Group")
print("="*60)

# Create age groups
def get_age_group(age):
    if age < 5:
        return "0-4"
    elif age < 18:
        return "5-17"
    elif age < 25:
        return "18-24"
    elif age < 35:
        return "25-34"
    elif age < 45:
        return "35-44"
    elif age < 55:
        return "45-54"
    elif age < 65:
        return "55-64"
    elif age < 75:
        return "65-74"
    else:
        return "75+"

data["age_group"] = data["age"].apply(get_age_group)

# Use individual-level data with weights
data_weighted = MicroDataFrame(data, weights="household_weight")

by_age = data_weighted.groupby("age_group")[list(spending_cols.keys())].mean()

# Sort by age group
age_order = ["0-4", "5-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65-74", "75+"]
by_age = by_age.reindex(age_order)

by_age_data = {
    "categories": age_order,
    "series": []
}

for orig_col, new_col in spending_cols.items():
    by_age_data["series"].append({
        "name": new_col,
        "data": by_age[orig_col].round(2).tolist()
    })

with open(output_dir / "by_age_group.json", "w") as f:
    json.dump(by_age_data, f, indent=2)

print(f"✓ Generated: by_age_group.json")

print("\n" + "="*60)
print("ANALYSIS 4: NHS Service Breakdown by Income Decile")
print("="*60)

# Group by household for NHS analysis
data_h_nhs = data.groupby("household_id")[
    list(nhs_service_cols.keys()) + [
        "equiv_hbai_household_net_income",
        "people",
        "household_weight",
    ]
].sum()

data_h_nhs.equiv_hbai_household_net_income /= data_h_nhs.people.values
data_h_nhs.household_weight /= data_h_nhs.people.values

data_h_nhs = MicroDataFrame(data_h_nhs.rename(columns=nhs_service_cols), weights="household_weight")

by_decile_nhs = data_h_nhs[list(nhs_service_cols.values())].groupby(
    data_h_nhs.equiv_hbai_household_net_income.decile_rank()
).mean()

by_decile_nhs_data = {
    "categories": list(range(1, 11)),
    "series": []
}

for col in nhs_service_cols.values():
    by_decile_nhs_data["series"].append({
        "name": col,
        "data": by_decile_nhs[col].round(2).tolist()
    })

with open(output_dir / "nhs_services_by_decile.json", "w") as f:
    json.dump(by_decile_nhs_data, f, indent=2)

print(f"✓ Generated: nhs_services_by_decile.json")

print("\n" + "="*60)
print("ANALYSIS 5: Spending by Household Composition")
print("="*60)

# Create household composition categories
data_h_comp = data.groupby("household_id")[
    list(spending_cols.keys()) + [
        "is_adult", "is_child", "household_weight"
    ]
].sum()

def get_household_type(row):
    adults = int(row["is_adult"])
    children = int(row["is_child"])

    if adults == 1 and children == 0:
        return "Single adult"
    elif adults == 2 and children == 0:
        return "Couple, no children"
    elif adults == 1 and children == 1:
        return "Single parent, 1 child"
    elif adults == 1 and children >= 2:
        return "Single parent, 2+ children"
    elif adults == 2 and children == 1:
        return "Couple, 1 child"
    elif adults == 2 and children >= 2:
        return "Couple, 2+ children"
    elif adults >= 3 and children == 0:
        return "Multi-adult household"
    else:
        return "Other"

data_h_comp["household_type"] = data_h_comp.apply(get_household_type, axis=1)

data_h_comp = MicroDataFrame(data_h_comp.rename(columns=spending_cols), weights="household_weight")

by_household = data_h_comp.groupby("household_type")[list(spending_cols.values())].mean()

# Sort by a logical order
household_order = [
    "Single adult",
    "Couple, no children",
    "Single parent, 1 child",
    "Single parent, 2+ children",
    "Couple, 1 child",
    "Couple, 2+ children",
    "Multi-adult household",
    "Other"
]
by_household = by_household.reindex([h for h in household_order if h in by_household.index])

by_household_data = {
    "categories": by_household.index.tolist(),
    "series": []
}

for col in spending_cols.values():
    by_household_data["series"].append({
        "name": col,
        "data": by_household[col].round(2).tolist()
    })

with open(output_dir / "by_household_type.json", "w") as f:
    json.dump(by_household_data, f, indent=2)

print(f"✓ Generated: by_household_type.json")

# Removed unused analyses: Education Breakdown and Summary Statistics

print("\n" + "="*60)
print("✓ All analyses complete!")
print("="*60)
print(f"\nGenerated {len(list(output_dir.glob('*.json')))} JSON files in {output_dir}")
