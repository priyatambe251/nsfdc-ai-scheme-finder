# NSFDC AI Scheme Recommendation System — Frontend

## What was added

This frontend is a zero-build HTML/CSS/JavaScript application designed around the existing Flask API.

### New files

- `frontend/index.html` — all prototype screens and page containers.
- `frontend/style.css` — responsive UI matching the supplied NSFDC AI Assistant reference.
- `frontend/app.js` — dynamic question-by-question questionnaire, API integration, recommendations, scheme details, EMI calculator, partner list and document/application guidance.
- `frontend/data.js` — browser-readable snapshot generated from `data/NSFDC_Master_Database.xlsx` for scheme/partner/document/application display.

### Existing backend left unchanged

- `src/api.py`
- `src/ai_pipeline.py`
- `src/nlp_extractor.py`
- `models/scheme_recommender.pkl`

The frontend uses only the existing recommendation endpoint:

`POST http://127.0.0.1:5000/api/recommend`

Request body:

```json
{
  "text": "natural language beneficiary description"
}
```

No new API endpoint was added.

## Run

### Terminal 1 — backend

From the repository root:

```powershell
python -m pip install -r requirements.txt
python src/api.py
```

The API should be available at:

```text
http://127.0.0.1:5000
```

### Terminal 2 — frontend

From the repository root:

```powershell
python -m http.server 5500 --directory frontend
```

Open:

```text
http://127.0.0.1:5500
```

Do not open `index.html` directly with `file://`; use the local HTTP server.

## Questionnaire flow

The questionnaire is intentionally dynamic:

1. SC status
2. Annual family income
3. Purpose
4. If Business:
   - Activity
   - Other activity (only when "Other" is selected)
   - Project cost
   - Loan required
   - Rural/Urban location
5. If Education:
   - Education level
   - Course
   - Course type
   - Course recognition
   - Total education cost
   - Loan required
   - Rural/Urban location

The answers are converted into the natural-language `text` field expected by the existing `/api/recommend` endpoint.

## Important existing-backend limitation

The current `src/nlp_extractor.py` does not extract `education_level` or `location` from natural language, even though the trained model contains those feature columns. The frontend therefore collects these values and includes them in the submitted text, but it does not alter the existing extractor or ML logic.

This was intentional because the requirement was to keep the existing AI/model logic intact. If full use of those two fields is required later, the safe approach is to extend the existing extractor/API adapter without retraining or changing the trained model.

## Testing checklist

- Backend health:
  - Open `http://127.0.0.1:5000`
  - Confirm `"status": "success"`.
- Business flow:
  - SC = Yes
  - Income = 150000
  - Purpose = Business
  - Activity = Tailoring
  - Project cost = 200000
  - Loan = 150000
  - Location = Urban
  - Confirm recommendation appears.
- Education flow:
  - SC = Yes
  - Income = 150000
  - Purpose = Education
  - Level = Graduate
  - Course = BTech
  - Type = Technical
  - Recognition = Yes
  - Cost = 800000
  - Loan = 600000
  - Location = Urban
  - Confirm recommendation appears.
- Click:
  - Scheme Details
  - Documents
  - Channel Partners
  - EMI Calculator
- Verify no document-upload control exists.
- Stop the Flask server and test the questionnaire again; the UI should show a clear API connection error rather than silently failing.
