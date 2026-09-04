import pandas as pd
import json
import os

# ==========================================
# 1. File location
# ==========================================

excel_path = "data/NSFDC_Master_Database.xlsx"

# ==========================================
# 2. Read the canonical Scheme_Master sheet
# ==========================================

df = pd.read_excel(
    excel_path,
    sheet_name="Scheme_Master"
)

print("\n========================================")
print("NSFDC SCHEME CRITERIA")
print("========================================")

print("\nTotal schemes found:", len(df))

# ==========================================
# 3. Display important information
# ==========================================

important_columns = [
    "scheme_id",
    "scheme_name",
    "purpose",
    "beneficiary_category",
    "income_limit",
    "project_cost_min",
    "project_cost_max",
    "maximum_loan",
    "financing_percentage",
    "beneficiary_interest_rate",
    "repayment_period",
    "education_requirement",
    "verification_status"
]

print("\nScheme information:\n")

for _, row in df.iterrows():

    print("----------------------------------------")

    print("Scheme ID:", row["scheme_id"])
    print("Scheme Name:", row["scheme_name"])
    print("Purpose:", row["purpose"])
    print("Income Limit:", row["income_limit"])
    print("Minimum Project Cost:", row["project_cost_min"])
    print("Maximum Project Cost:", row["project_cost_max"])
    print("Maximum Loan:", row["maximum_loan"])
    print("Financing:", row["financing_percentage"])
    print("Interest Rate:", row["beneficiary_interest_rate"])
    print("Repayment:", row["repayment_period"])
    print("Education Requirement:", row["education_requirement"])
    print("Verification Status:", row["verification_status"])

# ==========================================
# 4. Create clean criteria dataset
# ==========================================

criteria_columns = [
    "scheme_id",
    "scheme_name",
    "scheme_type",
    "purpose",
    "beneficiary_category",
    "income_limit",
    "project_cost_min",
    "project_cost_max",
    "maximum_loan",
    "financing_percentage",
    "beneficiary_interest_rate",
    "repayment_period",
    "repayment_frequency",
    "moratorium",
    "channel_partner_types",
    "education_requirement",
    "required_documents",
    "verification_authority",
    "verification_status",
    "source_url",
    "last_verified",
    "notes"
]

criteria_df = df[criteria_columns].copy()

# ==========================================
# 5. Create results folder
# ==========================================

os.makedirs("results", exist_ok=True)

# ==========================================
# 6. Save clean criteria CSV
# ==========================================

output_csv = "results/clean_scheme_criteria.csv"

criteria_df.to_csv(
    output_csv,
    index=False,
    encoding="utf-8-sig"
)

# ==========================================
# 7. Save JSON version
# ==========================================

output_json = "results/clean_scheme_criteria.json"

records = criteria_df.to_dict(orient="records")

with open(
    output_json,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        records,
        file,
        indent=4,
        ensure_ascii=False,
        default=str
    )

# ==========================================
# 8. Final verification
# ==========================================

print("\n========================================")
print("SUCCESS")
print("========================================")

print("\nSchemes extracted:", len(criteria_df))

print("\nSchemes:")

for name in criteria_df["scheme_name"]:
    print("-", name)

print("\nCreated files:")

print("-", output_csv)
print("-", output_json)

print("\nNext step: Generate synthetic beneficiary training data.")