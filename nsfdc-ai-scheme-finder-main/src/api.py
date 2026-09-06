from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import math

# Allow imports from src folder
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from nlp_extractor import extract_information
import joblib
import pandas as pd


app = Flask(__name__)
CORS(app)


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "models",
    "scheme_recommender.pkl"
)

print("Loading AI model...")

model = joblib.load(MODEL_PATH)

print("AI model loaded successfully.")


# ============================================================
# MODEL FEATURES
# ============================================================

MODEL_FEATURES = [
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
# SAFE VALUE FUNCTION
# ============================================================

def safe_value(value, default="NA"):

    # None
    if value is None:
        return default

    # Pandas missing values
    try:
        if pd.isna(value):
            return default
    except Exception:
        pass

    # Float NaN / Infinity
    if isinstance(value, float):

        if math.isnan(value) or math.isinf(value):
            return default

    # Empty string
    if isinstance(value, str):

        value = value.strip()

        if value == "":
            return default

    return value


# ============================================================
# SAFE NUMERIC FUNCTION
# ============================================================

def safe_number(value, default=0):

    if value is None:
        return default

    try:

        if pd.isna(value):
            return default

    except Exception:
        pass

    try:

        value = float(value)

        if math.isnan(value) or math.isinf(value):
            return default

        return value

    except (ValueError, TypeError):

        return default


# ============================================================
# HOME / HEALTH CHECK
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "status": "success",
        "message": "NSFDC AI Recommendation API is running",
        "model": "Random Forest",
        "nlp": "Enabled"
    })


# ============================================================
# AI RECOMMENDATION API
# ============================================================

@app.route("/api/recommend", methods=["POST"])
def recommend():

    try:

        # ----------------------------------------------------
        # GET USER INPUT
        # ----------------------------------------------------

        data = request.get_json()

        if not data:

            return jsonify({
                "status": "error",
                "message": "No input data received"
            }), 400

        user_text = data.get("text", "")

        if not isinstance(user_text, str):

            return jsonify({
                "status": "error",
                "message": "Input text must be a string"
            }), 400

        if not user_text.strip():

            return jsonify({
                "status": "error",
                "message": "Please provide beneficiary information"
            }), 400


        # ----------------------------------------------------
        # NLP PROCESSING
        # ----------------------------------------------------

        print("\n------------------------------------------")
        print("USER INPUT")
        print("------------------------------------------")
        print(user_text)

        extracted = extract_information(user_text)

        print("\nNLP EXTRACTED DATA:")
        print(extracted)


        # ----------------------------------------------------
        # LOCATION
        # ----------------------------------------------------

        location = extracted.get("location")

        if location is None:
            location = "Urban"

        location = safe_value(location, "Urban")


        # ----------------------------------------------------
        # CREATE MODEL INPUT
        # ----------------------------------------------------

        input_data = pd.DataFrame([{

            "sc_status":
                safe_value(
                    extracted.get("sc_status"),
                    "Unknown"
                ),

            "income":
                safe_number(
                    extracted.get("income"),
                    0
                ),

            "purpose":
                safe_value(
                    extracted.get("purpose"),
                    "Unknown"
                ),

            "activity":
                safe_value(
                    extracted.get("activity"),
                    "NA"
                ),

            "project_cost":
                safe_number(
                    extracted.get("project_cost"),
                    0
                ),

            "loan_required":
                safe_number(
                    extracted.get("loan_required"),
                    0
                ),

            "education_level":
                safe_value(
                    extracted.get("education_level"),
                    "NA"
                ),

            "course":
                safe_value(
                    extracted.get("course"),
                    "NA"
                ),

            "course_type":
                safe_value(
                    extracted.get("course_type"),
                    "NA"
                ),

            "course_recognized":
                safe_value(
                    extracted.get("course_recognized"),
                    "NA"
                ),

            "location":
                location

        }])


        # ----------------------------------------------------
        # FORCE CORRECT COLUMN ORDER
        # ----------------------------------------------------

        input_data = input_data[MODEL_FEATURES]


        # ----------------------------------------------------
        # FINAL NaN CHECK
        # ----------------------------------------------------

        if input_data.isnull().any().any():

            print("\nWARNING: NaN detected before prediction.")

            print(input_data.isnull().sum())

            # Final safety replacement
            input_data = input_data.fillna("NA")


        # ----------------------------------------------------
        # DEBUG MODEL INPUT
        # ----------------------------------------------------

        print("\nMODEL INPUT:")
        print(input_data)

        print("\nMODEL INPUT DATA TYPES:")
        print(input_data.dtypes)


        # ----------------------------------------------------
        # ML PREDICTION
        # ----------------------------------------------------

        prediction = model.predict(input_data)[0]

        probabilities = model.predict_proba(input_data)[0]

        classes = model.classes_


        # ----------------------------------------------------
        # CREATE SUITABILITY SCORES
        # ----------------------------------------------------

        scores = []

        for scheme, probability in zip(
            classes,
            probabilities
        ):

            scores.append({

                "scheme":
                    str(scheme),

                "suitability_score":
                    round(
                        float(probability) * 100,
                        2
                    )

            })


        # ----------------------------------------------------
        # SORT SCORES
        # ----------------------------------------------------

        scores = sorted(
            scores,
            key=lambda x:
                x["suitability_score"],
            reverse=True
        )


        # ----------------------------------------------------
        # TOP 3 RECOMMENDATIONS
        # ----------------------------------------------------

        top_recommendations = scores[:3]


        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return jsonify({

            "status": "success",

            "input": extracted,

            "recommendation":
                str(prediction),

            "confidence":
                round(
                    float(max(probabilities)) * 100,
                    2
                ),

            "recommendations":
                top_recommendations,

            "message":
                "Recommendation generated successfully."

        })


    except Exception as e:

        print("\n==========================================")
        print("AI API ERROR")
        print("==========================================")

        print(str(e))

        return jsonify({

            "status": "error",

            "message": str(e)

        }), 500


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    print("\n==========================================")
    print("NSFDC AI RECOMMENDATION API")
    print("==========================================")

    print("Server running at:")
    print("http://127.0.0.1:5000")

    print("==========================================\n")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )