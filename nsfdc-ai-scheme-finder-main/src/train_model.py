import matplotlib
matplotlib.use("Agg")

import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

import matplotlib.pyplot as plt


# ============================================================
# 1. FILE PATHS
# ============================================================

DATA_FILE = "data/synthetic_training_data.csv"

MODEL_FILE = "models/scheme_recommender.pkl"

REPORT_FILE = "results/classification_report.txt"

CONFUSION_FILE = "results/confusion_matrix.png"

IMPORTANCE_FILE = "results/feature_importance.csv"


# ============================================================
# 2. CREATE REQUIRED FOLDERS
# ============================================================

os.makedirs("models", exist_ok=True)
os.makedirs("results", exist_ok=True)


# ============================================================
# 3. LOAD DATASET
# ============================================================

print("\n==========================================")
print("LOADING TRAINING DATA")
print("==========================================")

df = pd.read_csv(DATA_FILE)

print("Dataset shape:", df.shape)


# ============================================================
# 4. REMOVE EMPTY TARGET ROWS
# ============================================================

df = df.dropna(
    subset=["recommended_scheme"]
).reset_index(drop=True)


# ============================================================
# 5. DEFINE INPUT FEATURES
# ============================================================

features = [
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
# 6. DEFINE TARGET
# ============================================================

target = "recommended_scheme"

X = df[features]

y = df[target]


print("\nNumber of input features:", len(features))

print("\nTarget classes:")
print(y.value_counts())


# ============================================================
# 7. NUMERICAL FEATURES
# ============================================================

numeric_features = [
    "income",
    "project_cost",
    "loan_required"
]


# ============================================================
# 8. CATEGORICAL FEATURES
# ============================================================

categorical_features = [
    "sc_status",
    "purpose",
    "activity",
    "education_level",
    "course",
    "course_type",
    "course_recognized",
    "location"
]


# ============================================================
# 9. PREPROCESSING
# ============================================================

print("\n==========================================")
print("CREATING PREPROCESSING PIPELINE")
print("==========================================")

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)


# ============================================================
# 10. RANDOM FOREST MODEL
# ============================================================

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1
)


# ============================================================
# 11. COMPLETE ML PIPELINE
# ============================================================

pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),
        (
            "classifier",
            model
        )
    ]
)


# ============================================================
# 12. TRAIN / TEST SPLIT
# ============================================================

print("\n==========================================")
print("CREATING TRAIN / TEST DATA")
print("==========================================")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training rows:", len(X_train))
print("Testing rows:", len(X_test))


# ============================================================
# 13. TRAIN MODEL
# ============================================================

print("\n==========================================")
print("TRAINING RANDOM FOREST")
print("==========================================")

pipeline.fit(
    X_train,
    y_train
)

print("Training completed successfully!")


# ============================================================
# 14. PREDICTIONS
# ============================================================

print("\n==========================================")
print("TESTING MODEL")
print("==========================================")

y_pred = pipeline.predict(
    X_test
)


# ============================================================
# 15. ACCURACY
# ============================================================

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("\nModel Accuracy:")
print(
    f"{accuracy * 100:.2f}%"
)


# ============================================================
# 16. CLASSIFICATION REPORT
# ============================================================

report = classification_report(
    y_test,
    y_pred,
    zero_division=0
)

print("\n==========================================")
print("CLASSIFICATION REPORT")
print("==========================================")

print(report)


# ============================================================
# 17. SAVE CLASSIFICATION REPORT
# ============================================================

with open(
    REPORT_FILE,
    "w",
    encoding="utf-8"
) as file:

    file.write(
        "NSFDC SCHEME RECOMMENDER\n"
    )

    file.write(
        "Random Forest Classification Report\n\n"
    )

    file.write(
        f"Accuracy: {accuracy * 100:.2f}%\n\n"
    )

    file.write(report)


# ============================================================
# 18. CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_test,
    y_pred
)

classes = sorted(
    y.unique()
)

plt.figure(
    figsize=(10, 8)
)

plt.imshow(cm)

plt.title(
    "NSFDC Scheme Recommendation - Confusion Matrix"
)

plt.xlabel(
    "Predicted Scheme"
)

plt.ylabel(
    "Actual Scheme"
)

plt.xticks(
    range(len(classes)),
    classes,
    rotation=45,
    ha="right"
)

plt.yticks(
    range(len(classes)),
    classes
)

plt.colorbar()

for i in range(len(classes)):

    for j in range(len(classes)):

        plt.text(
            j,
            i,
            cm[i, j],
            ha="center",
            va="center"
        )

plt.tight_layout()

plt.savefig(
    CONFUSION_FILE,
    dpi=200
)

plt.close()


# ============================================================
# 19. SAVE TRAINED MODEL
# ============================================================

print("\n==========================================")
print("SAVING MODEL")
print("==========================================")

joblib.dump(
    pipeline,
    MODEL_FILE
)

print(
    "Model saved to:",
    MODEL_FILE
)


# ============================================================
# 20. SAMPLE PREDICTIONS
# ============================================================

print("\n==========================================")
print("SAMPLE PREDICTIONS")
print("==========================================")

sample_X = X_test.head(5)

sample_y = y_test.head(5)

sample_predictions = pipeline.predict(
    sample_X
)

sample_probabilities = pipeline.predict_proba(
    sample_X
)

for i in range(len(sample_X)):

    print("\nExample", i + 1)

    print(
        "Actual:",
        sample_y.iloc[i]
    )

    print(
        "Predicted:",
        sample_predictions[i]
    )

    print(
        "Confidence:",
        f"{max(sample_probabilities[i]) * 100:.2f}%"
    )


# ============================================================
# 21. FEATURE IMPORTANCE
# ============================================================

print("\n==========================================")
print("FEATURE IMPORTANCE")
print("==========================================")

classifier = pipeline.named_steps[
    "classifier"
]

preprocessor_fitted = pipeline.named_steps[
    "preprocessor"
]

feature_names = (
    preprocessor_fitted
    .get_feature_names_out()
)

importance = classifier.feature_importances_

importance_df = pd.DataFrame({
    "feature": feature_names,
    "importance": importance
})

importance_df = importance_df.sort_values(
    "importance",
    ascending=False
)

print(
    importance_df.head(20).to_string(
        index=False
    )
)


# ============================================================
# 22. SAVE FEATURE IMPORTANCE
# ============================================================

importance_df.to_csv(
    IMPORTANCE_FILE,
    index=False
)


# ============================================================
# 23. FINAL RESULT
# ============================================================

print("\n==========================================")
print("STEP 9 COMPLETED SUCCESSFULLY")
print("==========================================")

print(
    "\nTrained model:"
)

print(
    MODEL_FILE
)

print(
    "\nClassification report:"
)

print(
    REPORT_FILE
)

print(
    "\nConfusion matrix:"
)

print(
    CONFUSION_FILE
)

print(
    "\nFeature importance:"
)

print(
    IMPORTANCE_FILE
)

print("\nYour Random Forest model is ready!")