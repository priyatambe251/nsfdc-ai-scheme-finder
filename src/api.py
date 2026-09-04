from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

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

        if not user_text.strip():

            return jsonify({
                "status": "error",
                "message": "Please provide beneficiary information"
            }), 400


        # ----------------------------------------------------
        # NLP PROCESSING
        # ----------------------------------------------------

        extracted = extract_information(user_text)


        # ----------------------------------------------------
        # CREATE MODEL INPUT
        # ----------------------------------------------------

        input_data = pd.DataFrame([{
            "sc_status": extracted.get("sc_status", "NA"),
            "income": extracted.get("income", 0),
            "purpose": extracted.get("purpose", "NA"),
            "activity": extracted.get("activity", "NA"),
            "project_cost": extracted.get("project_cost", 0),
            "loan_required": extracted.get("loan_required", 0),
            "education_level": extracted.get("education_level", "NA"),
            "course": extracted.get("course", "NA"),
            "course_type": extracted.get("course_type", "NA"),
            "course_recognized": extracted.get(
                "course_recognized",
                "NA"
            ),
            "location": extracted.get("location", "NA")
        }])


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

        for scheme, probability in zip(classes, probabilities):

            scores.append({
                "scheme": str(scheme),
                "suitability_score": round(
                    float(probability) * 100,
                    2
                )
            })


        # Sort highest score first
        scores = sorted(
            scores,
            key=lambda x: x["suitability_score"],
            reverse=True
        )


        # ----------------------------------------------------
        # TOP RECOMMENDATIONS
        # ----------------------------------------------------

        top_recommendations = scores[:3]


        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return jsonify({

            "status": "success",

            "input": extracted,

            "recommendation": str(prediction),

            "confidence": round(
                float(max(probabilities)) * 100,
                2
            ),

            "recommendations": top_recommendations,

            "message":
                "Recommendation generated successfully."

        })


    except Exception as e:

        print("ERROR:", str(e))

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