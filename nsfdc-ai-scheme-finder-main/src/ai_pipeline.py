import pandas as pd
import joblib

from nlp_extractor import extract_information


# ============================================================
# FILE PATH
# ============================================================

MODEL_FILE = "models/scheme_recommender.pkl"


# ============================================================
# LOAD MODEL
# ============================================================

print("\n==========================================")
print("NSFDC AI RECOMMENDATION PIPELINE")
print("==========================================")

print("\nLoading trained ML model...")

model = joblib.load(MODEL_FILE)

print("ML model loaded successfully.")


# ============================================================
# USER INPUT
# ============================================================

print("\n==========================================")
print("BENEFICIARY INPUT")
print("==========================================")

user_text = input(
    "\nDescribe your requirement: "
)


# ============================================================
# NLP PROCESSING
# ============================================================

print("\n==========================================")
print("NLP PROCESSING")
print("==========================================")

print("Understanding beneficiary's answer...")

extracted = extract_information(user_text)


# ============================================================
# FIX MISSING LOCATION
# ============================================================

if extracted.get("location") is None:
    extracted["location"] = "Urban"


# ============================================================
# FIX MISSING VALUES
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

for column in required_columns:

    if column not in extracted:
        extracted[column] = "NA"

    elif extracted[column] is None:
        extracted[column] = "NA"


# ============================================================
# DISPLAY NLP RESULT
# ============================================================

print("\nExtracted Information:")

for column in required_columns:

    print(
        f"{column}: {extracted[column]}"
    )


# ============================================================
# CREATE DATAFRAME
# ============================================================

input_data = pd.DataFrame(
    [extracted]
)

# Make sure columns are in the same order
# used by the training dataset.

input_data = input_data[required_columns]


# ============================================================
# ML PREDICTION
# ============================================================

print("\n==========================================")
print("ML PREDICTION")
print("==========================================")

prediction = model.predict(
    input_data
)[0]

print(
    f"\nRecommended Scheme: {prediction}"
)


# ============================================================
# SUITABILITY SCORES
# ============================================================

if hasattr(model, "predict_proba"):

    probabilities = model.predict_proba(
        input_data
    )[0]

    classes = model.classes_

    results = []

    for scheme, probability in zip(
        classes,
        probabilities
    ):

        results.append(
            {
                "scheme": scheme,
                "suitability_score":
                    round(
                        probability * 100,
                        2
                    )
            }
        )

    results_df = pd.DataFrame(results)

    results_df = results_df.sort_values(
        "suitability_score",
        ascending=False
    )

    print(
        "\n=========================================="
    )

    print(
        "SCHEME SUITABILITY SCORES"
    )

    print(
        "=========================================="
    )

    for _, row in results_df.iterrows():

        print(
            f"{row['scheme']}: "
            f"{row['suitability_score']}%"
        )


# ============================================================
# FINAL RESULT
# ============================================================

print("\n==========================================")
print("AI PIPELINE COMPLETED")
print("==========================================")

print(
    "\nNLP successfully understood the "
    "beneficiary's natural-language input."
)

print(
    "The extracted information was passed "
    "to the Random Forest model."
)

print(
    f"\nFinal AI Recommendation: {prediction}"
)

print(
    "\nNote: Final government eligibility must "
    "be verified using the official NSFDC criteria."
)