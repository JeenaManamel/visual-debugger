import os
import json
import pandas as pd

# Paths to historical and latest results
HISTORICAL_RESULTS_PATH = os.getenv("HISTORICAL_RESULTS_PATH", "HistoricalResults/aggregated_results.json")
LATEST_RESULTS_PATH = os.getenv("LATEST_RESULTS_PATH", "Results/OrderPlacementTest_results.json")


def load_historical_results():
    """
    Loads historical test results from JSON into summary and steps DataFrames.
    """
    if not os.path.exists(HISTORICAL_RESULTS_PATH):
        print(f"⚠️ No historical data found at {HISTORICAL_RESULTS_PATH}")
        return pd.DataFrame(), pd.DataFrame()

    try:
        with open(HISTORICAL_RESULTS_PATH, "r") as file:
            historical_data = json.load(file)

        if not historical_data:
            print("⚠️ No historical data found.")
            return pd.DataFrame(), pd.DataFrame()

        # Flatten historical data into summary and steps
        historical_steps = []
        for test in historical_data:
            for step in test["Steps"]:
                historical_steps.append({
                    "TestName": test["TestName"],
                    "StartTime": test["StartTime"],
                    "TotalDuration": test["TotalDuration"],
                    "OverallStatus": test["OverallStatus"],
                    "StepName": step["StepName"],
                    "Timestamp": step["Timestamp"],
                    "Duration": step["Duration"],
                    "ScreenshotPath": step["ScreenshotPath"],
                    "Status": step["Status"],
                    "ErrorMessage": step["ErrorMessage"],
                    "ConsoleErrors": "\n".join(step["ConsoleErrors"]) if isinstance(step["ConsoleErrors"], list) else step["ConsoleErrors"]
                })

        historical_steps_df = pd.DataFrame(historical_steps)

        historical_summary = historical_steps_df.groupby(["TestName", "StartTime", "OverallStatus"]).agg(
            TotalDuration=pd.NamedAgg(column="TotalDuration", aggfunc="first"),
            TotalSteps=pd.NamedAgg(column="StepName", aggfunc="count"),
            SuccessfulSteps=pd.NamedAgg(column="Status", aggfunc=lambda x: (x == "Success").sum()),
            FailedSteps=pd.NamedAgg(column="Status", aggfunc=lambda x: (x == "Failed").sum())
        ).reset_index()

        return historical_summary, historical_steps_df

    except json.JSONDecodeError:
        print(f"⚠️ Error: Corrupt historical results file at {HISTORICAL_RESULTS_PATH}.")
        return pd.DataFrame(), pd.DataFrame()


def load_latest_test():
    """
    Loads the latest test result from JSON into summary and steps DataFrames.
    """
    if not os.path.exists(LATEST_RESULTS_PATH):
        print(f"⚠️ No latest test results found at {LATEST_RESULTS_PATH}")
        return pd.DataFrame(), pd.DataFrame()

    try:
        with open(LATEST_RESULTS_PATH, "r") as file:
            latest_data = json.load(file)

        # Summary of the latest test
        latest_summary = pd.DataFrame([{
            "TestName": latest_data["TestName"],
            "StartTime": latest_data["StartTime"],
            "TotalDuration": latest_data["TotalDuration"],
            "TotalSteps": len(latest_data["Steps"]),
            "SuccessfulSteps": sum(1 for step in latest_data["Steps"] if step["Status"] == "Success"),
            "FailedSteps": sum(1 for step in latest_data["Steps"] if step["Status"] == "Failed"),
            "OverallStatus": latest_data["OverallStatus"]
        }])

        # Steps of the latest test
        latest_steps = pd.DataFrame(latest_data["Steps"])
        latest_steps["ConsoleErrors"] = latest_steps["ConsoleErrors"].apply(
            lambda x: "\n".join(x) if isinstance(x, list) else x
        )

        return latest_summary, latest_steps

    except json.JSONDecodeError:
        print(f"⚠️ Error: Corrupt latest test results file at {LATEST_RESULTS_PATH}.")
        return pd.DataFrame(), pd.DataFrame()


# Example usage:
if __name__ == "__main__":
    # Load the latest test data
    latest_summary, latest_steps = load_latest_test()
    if not latest_summary.empty:
        print("✅ Latest test summary loaded successfully.")
        print(latest_summary)
    else:
        print("⚠️ No latest test summary available.")

    if not latest_steps.empty:
        print("✅ Latest test steps loaded successfully.")
        print(latest_steps)
    else:
        print("⚠️ No latest test steps available.")

    # Load the historical data
    historical_summary, historical_steps = load_historical_results()
    if not historical_summary.empty:
        print("✅ Historical summary loaded successfully.")
        print(historical_summary)
    else:
        print("⚠️ No historical summary available.")

    if not historical_steps.empty:
        print("✅ Historical steps loaded successfully.")
        print(historical_steps)
    else:
        print("⚠️ No historical steps available.")
