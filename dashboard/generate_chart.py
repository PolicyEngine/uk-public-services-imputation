"""
Generate the public services spending by income decile chart.
This script loads the imputed data and creates a Plotly visualization.
"""
import pandas as pd
from pathlib import Path
from microdf import MicroDataFrame
import plotly.express as px
from policyengine.utils.charts import add_fonts

# Get the data folder path directly
folder = Path("/Users/janansadeqian/uk-public-services-imputation/src/uk_public_services_imputation/data")

# Check if data.csv exists
data_csv_path = folder / "data.csv"
print(f"Checking for data.csv at: {data_csv_path}")
print(f"File exists: {data_csv_path.exists()}")

if data_csv_path.exists():
    data = pd.read_csv(data_csv_path)
    print(f"Loaded data with {len(data)} rows")
else:
    print("data.csv not found - need to generate it first")
    exit(1)

# Process data
print("Processing data...")
data = MicroDataFrame(data, weights="household_weight")
data["people"] = 1
data_h = data.groupby("household_id")[
    [
        "nhs_spending",
        "dfe_education_spending",
        "rail_subsidy_spending",
        "bus_subsidy_spending",
        "equiv_hbai_household_net_income",
        "people",
        "household_weight",
    ]
].sum()
data_h.equiv_hbai_household_net_income /= data_h.people.values
data_h.household_weight /= data_h.people.values

imputations = {
    "nhs_spending": "NHS",
    "dfe_education_spending": "Education",
    "rail_subsidy_spending": "Rail subsidy",
    "bus_subsidy_spending": "Bus subsidy",
}

data_h = MicroDataFrame(data_h.rename(columns=imputations), weights="household_weight")
add_fonts()

# Create chart
print("Creating chart...")
fig = px.bar(
    data_h[imputations.values()]
    .groupby(data_h.equiv_hbai_household_net_income.decile_rank())
    .mean(),
    color_discrete_sequence=px.colors.qualitative.T10,
)


def format_fig(fig):
    fig.update_layout(
        font=dict(
            family="Roboto Serif",
            color="black",
        )
    )
    FOG_GRAY = "#F4F4F4"

    # set template
    fig.update_layout(
        title="Public services spending by income decile",
        template="plotly_white",
        height=600,
        width=800,
        plot_bgcolor=FOG_GRAY,  # set background color to light gray
        paper_bgcolor=FOG_GRAY,  # set paper background color to white
        # No white grid marks
        xaxis=dict(gridcolor=FOG_GRAY, zerolinecolor=FOG_GRAY),
        yaxis=dict(
            gridcolor=FOG_GRAY,
            zerolinecolor=FOG_GRAY,
        ),
    )

    fig.add_layout_image(
        dict(
            source="https://raw.githubusercontent.com/PolicyEngine/policyengine-app/master/src/images/logos/policyengine/blue.png",
            xref="paper",
            yref="paper",
            x=1.1,
            y=-0.2,
            sizex=0.15,
            sizey=0.15,
            xanchor="right",
            yanchor="bottom",
        )
    )

    # Add bottom left chart description opposite logo
    fig.add_annotation(
        text="Source: PolicyEngine UK tax-benefit microsimulation model, NHS Digital, ONS",
        xref="paper",
        yref="paper",
        x=0,
        y=-0.2,
        showarrow=False,
        xanchor="left",
        yanchor="bottom",
    )
    # don't show modebar
    fig.update_layout(
        modebar=dict(
            bgcolor=FOG_GRAY,
            color=FOG_GRAY,
            activecolor=FOG_GRAY,
        ),
        margin_t=120,
        margin_b=120,
        margin_l=120,
        margin_r=120,
        uniformtext=dict(
            mode="hide",
            minsize=12,
        ),
    )

    fig.update_layout(
        yaxis_title="Per-year spending per household",
        yaxis_tickformat=",.0f",
        yaxis_tickprefix="£",
        xaxis_title="Income decile",
        xaxis_tickvals=list(range(1, 11)),
    )
    return fig


fig = format_fig(fig)

# Show the chart
print("Displaying chart...")
fig.show()

print("✓ Chart generation complete!")
