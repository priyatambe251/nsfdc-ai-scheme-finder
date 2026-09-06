import pandas as pd
import random
import os

random.seed(42)

OUTPUT_FILE = "data/nlp_training_data.csv"

# ============================================================
# DATA VALUES
# ============================================================

activities = [
    "tailoring",
    "grocery shop",
    "poultry",
    "fisheries",
    "repair shop",
    "computer centre",
    "transport",
    "food business",
    "small manufacturing",
    "service business"
]

courses = [
    "BTech",
    "BCA",
    "MCA",
    "MBA",
    "engineering",
    "pharmacy",
    "nursing",
    "law",
    "medical"
]

course_types = [
    "technical",
    "professional",
    "management",
    "medical"
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def income_text(amount):
    lakh = amount / 100000

    if amount >= 100000:
        return random.choice([
            f"{lakh:.1f} lakh",
            f"{lakh:.1f} lakhs",
            f"Rs {amount}",
            f"₹{amount}",
            f"{amount} rupees"
        ])

    return random.choice([
        f"Rs {amount}",
        f"₹{amount}",
        f"{amount} rupees"
    ])


def amount_text(amount):

    lakh = amount / 100000

    if amount >= 100000:
        return random.choice([
            f"{lakh:.1f} lakh",
            f"{lakh:.1f} lakhs",
            f"Rs {amount}",
            f"₹{amount}",
            f"{amount} rupees"
        ])

    return random.choice([
        f"Rs {amount}",
        f"₹{amount}",
        f"{amount} rupees"
    ])


# ============================================================
# BUSINESS SENTENCES
# ============================================================

def create_business_example():

    activity = random.choice(activities)

    income = random.randint(80000, 500000)

    loan = random.randint(50000, 450000)

    project_cost = loan + random.randint(
        10000,
        100000
    )

    templates = [

        f"I am an SC beneficiary. My family income is {income_text(income)}. I want to start a {activity} business and need a loan of {amount_text(loan)}.",

        f"My family earns around {income_text(income)} per year. I belong to the SC community and want to start a {activity}. I need around {amount_text(loan)}.",

        f"I am from SC category and want financial help for my {activity}. The total project cost is {amount_text(project_cost)} and I need {amount_text(loan)} as loan. My annual income is {income_text(income)}.",

        f"I want to open a {activity}. I am an SC beneficiary and my yearly family income is {income_text(income)}. I require about {amount_text(loan)}.",

        f"I belong to Scheduled Caste and want to start a small {activity}. My income is {income_text(income)} and the project will cost about {amount_text(project_cost)}."
    ]

    text = random.choice(templates)

    return {
        "text": text,
        "sc_status": "Yes",
        "income": income,
        "purpose": "Business",
        "activity": activity,
        "project_cost": project_cost,
        "loan_required": loan,
        "education_level": "NA",
        "course": "NA",
        "course_type": "NA",
        "course_recognized": "NA"
    }


# ============================================================
# EDUCATION SENTENCES
# ============================================================

def create_education_example():

    course = random.choice(courses)

    course_type = random.choice(course_types)

    income = random.randint(80000, 500000)

    fee = random.randint(
        100000,
        4000000
    )

    loan = min(
        fee,
        random.randint(50000, 4000000)
    )

    templates = [

        f"I am an SC student and my family income is {income_text(income)}. I want to study {course}. My course fee is {amount_text(fee)} and I need a loan of {amount_text(loan)}.",

        f"I belong to the SC category. I want an education loan for {course}. My annual family income is {income_text(income)} and I need around {amount_text(loan)}.",

        f"My family earns {income_text(income)} per year. I am an SC beneficiary and want to pursue {course}, which is a {course_type} course. The fee is {amount_text(fee)}.",

        f"I am from Scheduled Caste and want financial assistance for my {course} course. My family income is {income_text(income)} and I require {amount_text(loan)}.",

        f"I need a loan to study {course}. I am an SC student, my income is {income_text(income)}, and the course fee is {amount_text(fee)}."
    ]

    text = random.choice(templates)

    return {
        "text": text,
        "sc_status": "Yes",
        "income": income,
        "purpose": "Education",
        "activity": "NA",
        "project_cost": fee,
        "loan_required": loan,
        "education_level": random.choice([
            "12th",
            "Graduate",
            "Postgraduate"
        ]),
        "course": course,
        "course_type": course_type,
        "course_recognized": "Yes"
    }


# ============================================================
# SC STATUS EXAMPLES
# ============================================================

def create_non_sc_example():

    income = random.randint(
        80000,
        500000
    )

    activity = random.choice(
        activities
    )

    loan = random.randint(
        50000,
        400000
    )

    templates = [

        f"I am not an SC beneficiary. I want to start a {activity} and need {amount_text(loan)}.",

        f"I do not belong to the SC category. My family income is {income_text(income)} and I need a loan for a {activity}.",

        f"I am not from Scheduled Caste and want financial assistance for my {activity}.",

        f"My category is not SC. I want to start a {activity} business."
    ]

    text = random.choice(
        templates
    )

    return {
        "text": text,
        "sc_status": "No",
        "income": income,
        "purpose": "Business",
        "activity": activity,
        "project_cost": loan + 50000,
        "loan_required": loan,
        "education_level": "NA",
        "course": "NA",
        "course_type": "NA",
        "course_recognized": "NA"
    }


# ============================================================
# GENERATE DATASET
# ============================================================

rows = []

print("\n==========================================")
print("GENERATING NLP TRAINING DATA")
print("==========================================")

# Business examples
for _ in range(4000):
    rows.append(
        create_business_example()
    )

# Education examples
for _ in range(4000):
    rows.append(
        create_education_example()
    )

# Non-SC examples
for _ in range(2000):
    rows.append(
        create_non_sc_example()
    )


# ============================================================
# CREATE DATAFRAME
# ============================================================

df = pd.DataFrame(rows)


# ============================================================
# SHUFFLE
# ============================================================

df = df.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)


# ============================================================
# REMOVE DUPLICATES
# ============================================================

df = df.drop_duplicates(
    subset=["text"]
).reset_index(drop=True)


# ============================================================
# SAVE
# ============================================================

os.makedirs(
    "data",
    exist_ok=True
)

df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)


# ============================================================
# REPORT
# ============================================================

print("\n==========================================")
print("NLP DATASET CREATED")
print("==========================================")

print(
    "Total examples:",
    len(df)
)

print(
    "\nColumns:"
)

for column in df.columns:
    print(
        "-",
        column
    )

print(
    "\nPurpose distribution:"
)

print(
    df["purpose"].value_counts()
)

print(
    "\nSC status distribution:"
)

print(
    df["sc_status"].value_counts()
)

print(
    "\nSample examples:"
)

print(
    df[
        [
            "text",
            "sc_status",
            "income",
            "purpose",
            "activity",
            "course"
        ]
    ].head(10).to_string(
        index=False
    )
)

print("\n==========================================")
print("FILE CREATED")
print("==========================================")

print(
    OUTPUT_FILE
)