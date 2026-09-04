import pandas as pd
import random
import os

# ============================================================
# SETTINGS
# ============================================================

TOTAL_ROWS = 12000

random.seed(42)

MASTER_FILE = "data/NSFDC_Master_Database.xlsx"
OUTPUT_FILE = "data/synthetic_training_data.csv"


# ============================================================
# LOAD VERIFIED SCHEME DATA
# ============================================================

scheme_df = pd.read_excel(
    MASTER_FILE,
    sheet_name="Scheme_Master"
)

print("\n==========================================")
print("LOADING VERIFIED NSFDC SCHEME DATA")
print("==========================================")

print("Schemes found:", len(scheme_df))

for _, row in scheme_df.iterrows():
    print("-", row["scheme_id"], row["scheme_name"])


# ============================================================
# SCHEME LIMITS
# ============================================================

SCHEME_LIMITS = {
    "MFS": {
        "project_max": 140000,
        "loan_max": 125000
    },

    "AMY": {
        "project_max": 140000,
        "loan_max": 125000
    },

    "TERM_LOAN": {
        "project_min": 140001,
        "project_max": 5000000,
        "loan_max": 4500000
    },

    "UNY": {
        "project_max": 500000,
        "loan_max": 450000
    },

    "ELS": {
        "loan_max": 4000000
    }
}


# ============================================================
# ACTIVITIES
# ============================================================

activities = [
    "Tailoring",
    "Grocery Shop",
    "Poultry",
    "Fisheries",
    "Repair Shop",
    "Computer Centre",
    "Transport",
    "Food Business",
    "Small Manufacturing",
    "Service Business"
]


# ============================================================
# EDUCATION DATA
# ============================================================

courses = [
    "BTech",
    "Engineering",
    "BCA",
    "MCA",
    "MBA",
    "Pharmacy",
    "Nursing",
    "Law",
    "Medical"
]

course_types = [
    "Technical",
    "Professional",
    "Management",
    "Medical"
]

education_levels = [
    "12th",
    "Graduate",
    "Postgraduate"
]

locations = [
    "Rural",
    "Urban"
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def income_value():

    # Mostly generate values within the general income ceiling,
    # but include some boundary and invalid cases.

    choice = random.random()

    if choice < 0.90:
        return random.randint(50000, 500000)

    elif choice < 0.95:
        return random.randint(495000, 500000)

    else:
        return random.randint(500001, 800000)


def small_project_cost():

    return random.randint(30000, 140000)


def uny_project_cost():

    return random.randint(140001, 500000)


def term_project_cost():

    return random.randint(140001, 5000000)


def small_loan(project_cost):

    maximum = min(project_cost, 125000)

    return random.randint(
        10000,
        maximum
    )


def uny_loan(project_cost):

    maximum = min(project_cost, 450000)

    return random.randint(
        25000,
        maximum
    )


def term_loan(project_cost):

    maximum = min(project_cost, 4500000)

    return random.randint(
        50000,
        maximum
    )


def education_loan():

    return random.randint(
        50000,
        4000000
    )


# ============================================================
# CREATE MFS CASE
# ============================================================

def create_mfs():

    project_cost = small_project_cost()

    loan = small_loan(project_cost)

    return {
        "sc_status": "Yes",
        "income": random.randint(50000, 500000),
        "purpose": "Business",
        "activity": random.choice(activities),
        "project_cost": project_cost,
        "loan_required": loan,
        "education_level": "NA",
        "course": "NA",
        "course_type": "NA",
        "course_recognized": "NA",
        "location": random.choice(locations),
        "recommended_scheme": "MFS"
    }


# ============================================================
# CREATE AMY CASE
# ============================================================

def create_amy():

    project_cost = small_project_cost()

    loan = small_loan(project_cost)

    return {
        "sc_status": "Yes",
        "income": random.randint(50000, 500000),
        "purpose": "Business",
        "activity": random.choice(activities),
        "project_cost": project_cost,
        "loan_required": loan,
        "education_level": "NA",
        "course": "NA",
        "course_type": "NA",
        "course_recognized": "NA",
        "location": random.choice(locations),
        "recommended_scheme": "AMY"
    }


# ============================================================
# CREATE UNY CASE
# ============================================================

def create_uny():

    project_cost = uny_project_cost()

    loan = uny_loan(project_cost)

    return {
        "sc_status": "Yes",
        "income": random.randint(50000, 500000),
        "purpose": "Business",
        "activity": random.choice(activities),
        "project_cost": project_cost,
        "loan_required": loan,
        "education_level": "NA",
        "course": "NA",
        "course_type": "NA",
        "course_recognized": "NA",
        "location": random.choice(locations),
        "recommended_scheme": "UNY"
    }


# ============================================================
# CREATE TERM LOAN CASE
# ============================================================

def create_term_loan():

    project_cost = term_project_cost()

    loan = term_loan(project_cost)

    return {
        "sc_status": "Yes",
        "income": random.randint(50000, 500000),
        "purpose": "Business",
        "activity": random.choice(activities),
        "project_cost": project_cost,
        "loan_required": loan,
        "education_level": "NA",
        "course": "NA",
        "course_type": "NA",
        "course_recognized": "NA",
        "location": random.choice(locations),
        "recommended_scheme": "TERM_LOAN"
    }


# ============================================================
# CREATE EDUCATIONAL LOAN CASE
# ============================================================

def create_els():

    course = random.choice(courses)

    course_type = random.choice(course_types)

    project_cost = random.randint(
        100000,
        4500000
    )

    loan = min(
        education_loan(),
        project_cost
    )

    return {
        "sc_status": "Yes",
        "income": random.randint(50000, 500000),
        "purpose": "Education",
        "activity": "NA",
        "project_cost": project_cost,
        "loan_required": loan,
        "education_level": random.choice(education_levels),
        "course": course,
        "course_type": course_type,
        "course_recognized": "Yes",
        "location": random.choice(locations),
        "recommended_scheme": "ELS"
    }


# ============================================================
# CREATE INVALID / NO ELIGIBLE CASE
# ============================================================

def create_invalid():

    case_type = random.choice([
        "non_sc",
        "high_income",
        "unrecognized_course",
        "loan_too_high",
        "invalid_project"
    ])

    # --------------------------------------------------------
    # NON-SC
    # --------------------------------------------------------

    if case_type == "non_sc":

        return {
            "sc_status": "No",
            "income": random.randint(50000, 500000),
            "purpose": "Business",
            "activity": random.choice(activities),
            "project_cost": random.randint(50000, 500000),
            "loan_required": random.randint(20000, 400000),
            "education_level": "NA",
            "course": "NA",
            "course_type": "NA",
            "course_recognized": "NA",
            "location": random.choice(locations),
            "recommended_scheme": "NO_ELIGIBLE_SCHEME"
        }

    # --------------------------------------------------------
    # HIGH INCOME
    # --------------------------------------------------------

    if case_type == "high_income":

        return {
            "sc_status": "Yes",
            "income": random.randint(500001, 800000),
            "purpose": "Business",
            "activity": random.choice(activities),
            "project_cost": random.randint(50000, 500000),
            "loan_required": random.randint(20000, 400000),
            "education_level": "NA",
            "course": "NA",
            "course_type": "NA",
            "course_recognized": "NA",
            "location": random.choice(locations),
            "recommended_scheme": "NO_ELIGIBLE_SCHEME"
        }

    # --------------------------------------------------------
    # UNRECOGNIZED EDUCATION
    # --------------------------------------------------------

    if case_type == "unrecognized_course":

        return {
            "sc_status": "Yes",
            "income": random.randint(50000, 500000),
            "purpose": "Education",
            "activity": "NA",
            "project_cost": random.randint(100000, 4000000),
            "loan_required": random.randint(50000, 4000000),
            "education_level": random.choice(education_levels),
            "course": random.choice(courses),
            "course_type": random.choice(course_types),
            "course_recognized": "No",
            "location": random.choice(locations),
            "recommended_scheme": "NO_ELIGIBLE_SCHEME"
        }

    # --------------------------------------------------------
    # LOAN TOO HIGH
    # --------------------------------------------------------

    if case_type == "loan_too_high":

        return {
            "sc_status": "Yes",
            "income": random.randint(50000, 500000),
            "purpose": "Business",
            "activity": random.choice(activities),
            "project_cost": 5000000,
            "loan_required": 5000000,
            "education_level": "NA",
            "course": "NA",
            "course_type": "NA",
            "course_recognized": "NA",
            "location": random.choice(locations),
            "recommended_scheme": "NO_ELIGIBLE_SCHEME"
        }

    # --------------------------------------------------------
    # INVALID PROJECT
    # --------------------------------------------------------

    return {
        "sc_status": "Yes",
        "income": random.randint(50000, 500000),
        "purpose": "Business",
        "activity": random.choice(activities),
        "project_cost": random.randint(6000000, 8000000),
        "loan_required": random.randint(5000000, 7000000),
        "education_level": "NA",
        "course": "NA",
        "course_type": "NA",
        "course_recognized": "NA",
        "location": random.choice(locations),
        "recommended_scheme": "NO_ELIGIBLE_SCHEME"
    }


# ============================================================
# GENERATE BALANCED DATA
# ============================================================

rows = []

# Six classes
classes = [
    "MFS",
    "AMY",
    "UNY",
    "TERM_LOAN",
    "ELS",
    "NO_ELIGIBLE_SCHEME"
]

rows_per_class = TOTAL_ROWS // len(classes)

print("\n==========================================")
print("GENERATING BALANCED DATA")
print("==========================================")

print("Rows per class:", rows_per_class)


# ============================================================
# GENERATE EACH CLASS
# ============================================================

for _ in range(rows_per_class):
    rows.append(create_mfs())

for _ in range(rows_per_class):
    rows.append(create_amy())

for _ in range(rows_per_class):
    rows.append(create_uny())

for _ in range(rows_per_class):
    rows.append(create_term_loan())

for _ in range(rows_per_class):
    rows.append(create_els())

for _ in range(rows_per_class):
    rows.append(create_invalid())


# ============================================================
# ADD REMAINING ROWS
# ============================================================

while len(rows) < TOTAL_ROWS:

    rows.append(
        random.choice([
            create_mfs,
            create_amy,
            create_uny,
            create_term_loan,
            create_els,
            create_invalid
        ])()
    )


# ============================================================
# CREATE DATAFRAME
# ============================================================

df = pd.DataFrame(rows)


# ============================================================
# SHUFFLE DATA
# ============================================================

df = df.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)


# ============================================================
# REMOVE DUPLICATES
# ============================================================

df = df.drop_duplicates().reset_index(drop=True)


# ============================================================
# IF DUPLICATES REDUCE ROW COUNT
# ============================================================

while len(df) < TOTAL_ROWS:

    new_row = random.choice([
        create_mfs,
        create_amy,
        create_uny,
        create_term_loan,
        create_els,
        create_invalid
    ])()

    new_df = pd.DataFrame([new_row])

    df = pd.concat(
        [df, new_df],
        ignore_index=True
    )

    df = df.drop_duplicates().reset_index(drop=True)


# Keep exactly requested number
df = df.head(TOTAL_ROWS)


# ============================================================
# SAVE
# ============================================================

os.makedirs("data", exist_ok=True)

df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)


# ============================================================
# FINAL REPORT
# ============================================================

print("\n==========================================")
print("DATASET CREATED SUCCESSFULLY")
print("==========================================")

print("\nTotal rows:", len(df))

print("\nTotal columns:", len(df.columns))

print("\nScheme distribution:")

print(
    df["recommended_scheme"].value_counts()
)

print("\nMissing values:")

print(
    df.isnull().sum()
)

print("\nDuplicate rows:")

print(
    df.duplicated().sum()
)

print("\nFirst 10 rows:")

print(
    df.head(10).to_string(index=False)
)

print("\n==========================================")
print("FILE:")
print(OUTPUT_FILE)
print("==========================================")