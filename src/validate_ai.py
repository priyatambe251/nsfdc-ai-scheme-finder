import pandas as pd
import joblib

from nlp_extractor import extract_information


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

MODEL_FILE = "models/scheme_recommender.pkl"

model = joblib.load(MODEL_FILE)


# ============================================================
# TEST CASES
# ============================================================

test_cases = [

    "I am an SC student. My family income is 2 lakh. I want to study BTech and need a loan of 5 lakh.",

    "I belong to the SC community. My family income is 1 lakh. I want to start a small tailoring business. I need 1 lakh loan.",

    "I am an SC beneficiary. My annual income is 4 lakh. I want to start a transport business and need a loan of 10 lakh.",

    "I am an SC student. My family income is 3 lakh. I want to study pharmacy and need an education loan of 8 lakh.",

    "I am not from the SC category. My income is 2 lakh and I want a business loan."
]


# ============================================================
# REQUIRED COLUMNS
# ============================================================

required_columns = [
    "sc_status",
    "income",
    "purpose",
    "activity",
    "project_cost",
    "loan_required",
    "education_level",
    "course",
    "course_type",
    "course_recognized",
    "location"
]


# ============================================================
# NUMERIC COLUMNS
# ============================================================

numeric_columns = [
    "income",
    "project_cost",
    "loan_required"
]


# ============================================================
# VALIDATION
# ============================================================

print("\n==========================================")
print("NSFDC AI VALIDATION")
print("==========================================")


for number, text in enumerate(test_cases, 1):

    print("\n------------------------------------------")
    print(f"TEST CASE {number}")
    print("------------------------------------------")

    print("\nInput:")
    print(text)


    # --------------------------------------------------------
    # NLP
    # --------------------------------------------------------

    extracted = extract_information(text)


    # --------------------------------------------------------
    # DEFAULT LOCATION
    # --------------------------------------------------------

    if extracted.get("location") is None:
        extracted["location"] = "Urban"


    # --------------------------------------------------------
    # ADD MISSING COLUMNS
    # --------------------------------------------------------

    for column in required_columns:

        if column not in extracted:
            extracted[column] = None


    # --------------------------------------------------------
    # NUMERIC VALUES
    # --------------------------------------------------------

    for column in numeric_columns:

        value = extracted[column]

        if value is None:
            extracted[column] = 0

        elif isinstance(value, str):

            if value.upper() == "NA":
                extracted[column] = 0

            else:

                try:
                    extracted[column] = float(value)

                except ValueError:
                    extracted[column] = 0


    # --------------------------------------------------------
    # CATEGORICAL VALUES
    # --------------------------------------------------------

    categorical_columns = [
        "sc_status",
        "purpose",
        "activity",
        "education_level",
        "course",
        "course_type",
        "course_recognized",
        "location"
    ]


    for column in categorical_columns:

        if extracted[column] is None:
            extracted[column] = "NA"

        elif str(extracted[column]).upper() == "NONE":
            extracted[column] = "NA"


    # --------------------------------------------------------
    # CREATE DATAFRAME
    # --------------------------------------------------------

    input_data = pd.DataFrame(
        [extracted]
    )


    input_data = input_data[required_columns]


    # --------------------------------------------------------
    # CONVERT NUMERIC COLUMNS
    # --------------------------------------------------------

    for column in numeric_columns:

        input_data[column] = pd.to_numeric(
            input_data[column],
            errors="coerce"
        )

        input_data[column] = input_data[column].fillna(0)


    # --------------------------------------------------------
    # DISPLAY EXTRACTED INFORMATION
    # --------------------------------------------------------

    print("\nExtracted Information:")

    for column in required_columns:

        print(
            f"{column}: {input_data.iloc[0][column]}"
        )


    # --------------------------------------------------------
    # ML PREDICTION
    # --------------------------------------------------------

    try:

        prediction = model.predict(
            input_data
        )[0]

        print("\nAI Recommendation:")
        print(prediction)


        # ----------------------------------------------------
        # PROBABILITIES
        # ----------------------------------------------------

        if hasattr(model, "predict_proba"):

            probabilities = model.predict_proba(
                input_data
            )[0]

            classes = model.classes_


            scores = sorted(
                zip(classes, probabilities),
                key=lambda x: x[1],
                reverse=True
            )


            print("\nTop Scheme Scores:")


            for scheme, probability in scores[:3]:

                print(
                    f"{scheme}: "
                    f"{probability * 100:.2f}%"
                )


    except Exception as error:

        print("\nPrediction Error:")
        print(error)


# ============================================================
# COMPLETION
# ============================================================

print("\n==========================================")
print("VALIDATION COMPLETED")
print("==========================================")

print(
    "The AI pipeline was tested on multiple "
    "beneficiary scenarios."
)