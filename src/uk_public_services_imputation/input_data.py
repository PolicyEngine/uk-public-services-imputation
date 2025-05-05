from policyengine import Simulation
import pandas as pd
from policyengine_core.data import Dataset
from pathlib import Path

folder = Path(__file__).parents[2] / "data"


def create_efrs_input_dataset():
    simulation = Simulation(
        country="uk",
        scope="macro",
        # data="hf://policyengine/policyengine-uk-data-private/enhanced_frs_2022_23.h5",
        data="hf://policyengine/policyengine-uk-data-private/frs_2022_23.h5",
    )

    variables = [
        "age",
        "gender",
        "household_weight",
        "region",
        "household_id",
        "is_adult",
        "is_child",
        "is_SP_age",
        "dla",
        "pip",
        "household_count_people",
        "hbai_household_net_income",
        "equiv_hbai_household_net_income",
    ]
    sim = simulation.baseline_simulation
    education = sim.calculate("current_education")

    df = sim.calculate_dataframe(variables)

    df["count_primary_education"] = education == "PRIMARY"
    df["count_secondary_education"] = education == "LOWER_SECONDARY"
    df["count_further_education"] = education.isin(["UPPER_SECONDARY", "TERTIARY"])
    df.to_csv("TEST.csv", index=False)
    df["hbai_household_net_income"] = (
        df["hbai_household_net_income"] / df["household_count_people"]
    )
    df.to_csv("TEST2.csv", index=False)
    df["equiv_hbai_household_net_income"] = (
        df["equiv_hbai_household_net_income"] / df["household_count_people"]
    )

    data = pd.DataFrame(df)
    data.to_csv(folder / "data.csv", index=False)
    return data
