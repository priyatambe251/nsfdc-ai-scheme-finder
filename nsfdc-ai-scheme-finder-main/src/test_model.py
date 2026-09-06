import pandas as pd
import joblib


# ============================================================
# 1. LOAD TRAINED MODEL
# ============================================================

MODEL_FILE = "models/scheme_recommender.pkl"

print("\n==========================================")
print("LOADING TRAINED NSFDC AI MODEL")
print("==========================================")

model = joblib.load(MODEL_FILE)

print("Model loaded successfully!")


# ============================================================
# 2. CREATE NEW BENEFICIARY CASE
# ============================================================

beneficiary = pd.DataFrame([{

    "sc_status": "Yes",

    "income": 250000,

    "purpose": "Business",

    "activity": "Tailoring",

    "project_cost": 120000,

    "loan_required": 100000,

    "education_level": "NA",

    "course": "NA",

    "course_type": "NA",

    "course_recognized": "NA",

    "location": "Urban"

}])


# ============================================================
# 3. DISPLAY INPUT
# ============================================================

print("\n==========================================")
print("BENEFICIARY INPUT")
print("==========================================")

print(
    beneficiary.to_string(index=False)
)


# ============================================================
# 4. PREDICT BEST SCHEME
# ============================================================

prediction = model.predict(
    beneficiary
)[0]


print("\n==========================================")
print("AI RECOMMENDATION")
print("==========================================")

print(
    "Recommended Scheme:",
    prediction
)


# ============================================================
# 5. GET PROBABILITIES
# ============================================================

probabilities = model.predict_proba(
    beneficiary
)[0]

classes = model.classes_


# ============================================================
# 6. DISPLAY ALL SCHEME SCORES
# ============================================================

results = []

for scheme, probability in zip(
    classes,
    probabilities
):

    results.append({

        "scheme": scheme,

        "suitability_score":
            round(probability * 100, 2)

    })


results_df = pd.DataFrame(results)

results_df = results_df.sort_values(
    "suitability_score",
    ascending=False
)


print("\n==========================================")
print("SCHEME SUITABILITY SCORES")
print("==========================================")

print(
    results_df.to_string(index=False)
)


# ============================================================
# 7. TOP 3 RECOMMENDATIONS
# ============================================================

print("\n==========================================")
print("TOP RECOMMENDATIONS")
print("==========================================")

top_3 = results_df.head(3)

for index, row in top_3.iterrows():

    print(
        f"{row['scheme']} : "
        f"{row['suitability_score']}%"
    )


# ============================================================
# 8. FINAL MESSAGE
# ============================================================

print("\n==========================================")
print("STEP 10 COMPLETED")
print("==========================================")

print(
    "\nThe trained AI successfully processed"
    " a new beneficiary case."
)

print(
    "The model generated scheme suitability scores."
)