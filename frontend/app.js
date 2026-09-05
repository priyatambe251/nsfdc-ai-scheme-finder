/*
  NITINEXUS
  NSFDC AI Scheme Recommendation System

  MEMBER 2 VERSION
  -----------------
  English-only frontend.

  Translation is intentionally NOT included.
  Multilingual support will be added by the next member.

  Backend:
  POST http://127.0.0.1:5000/api/recommend

  Request:
  {
    text: "..."
  }
*/

const API_BASE = "http://127.0.0.1:5000";

/* =========================================================
   SCHEME CODE MAPPING
========================================================= */

const SCHEME_CODE_MAP = {
  MFS: "S001",
  AMY: "S002",
  TERM_LOAN: "S003",
  UNY: "S004",
  ELS: "S005",

  S001: "S001",
  S002: "S002",
  S003: "S003",
  S004: "S004",
  S005: "S005",

  NO_ELIGIBLE_SCHEME: null
};


/* =========================================================
   APPLICATION STATE
========================================================= */

const state = {
  answers: {},
  questions: [],
  current: 0,
  result: null,
  selectedSchemeCode: null,
  lastUtilityPage: "recommendation"
};


/* =========================================================
   QUESTION DATA
========================================================= */

const baseQuestions = [

  {
    key: "sc_status",
    type: "choice",
    title: "Do you belong to the Scheduled Caste (SC) category?",
    help:
      "NSFDC schemes in this prototype are designed for eligible SC beneficiaries and students.",
    options: ["Yes", "No"]
  },

  {
    key: "income",
    type: "money",
    title: "What is your approximate annual family income?",
    help:
      "Enter the total annual family income. Example: ₹1.5 lakh."
  },

  {
    key: "purpose",
    type: "choice",
    title: "What do you need financial assistance for?",
    help:
      "Choose the purpose that best matches your requirement.",
    options: ["Business", "Education"]
  }

];


const businessQuestions = [

  {
    key: "activity",
    type: "choice",
    title: "What activity or business are you planning?",
    help:
      "Choose the closest activity.",
    options: [
      "Tailoring",
      "Grocery Shop",
      "Poultry",
      "Fisheries",
      "Repair Shop",
      "Computer Centre",
      "Transport",
      "Food Business",
      "Small Manufacturing",
      "Service Business",
      "Other"
    ]
  },

  {
    key: "activity_other",
    type: "text",
    title: "Tell us the business activity.",
    help:
      "Enter the activity in a few words.",
    condition: a => a.activity === "Other"
  },

  {
    key: "project_cost",
    type: "money",
    title: "What is the estimated project cost?",
    help:
      "Example: ₹2 lakh."
  },

  {
    key: "loan_required",
    type: "money",
    title: "How much loan do you need?",
    help:
      "Enter the approximate amount you want to borrow."
  },

  {
    key: "location",
    type: "choice",
    title: "Where will the activity be located?",
    help:
      "Select whether the activity will be in an urban or rural area.",
    options: ["Urban", "Rural"]
  }

];


const educationQuestions = [

  {
    key: "education_level",
    type: "choice",
    title: "What is your current education level?",
    help:
      "Choose your highest/current level.",
    options: [
      "12th",
      "Graduate",
      "Postgraduate"
    ]
  },

  {
    key: "course",
    type: "choice",
    title: "Which course do you want to pursue?",
    help:
      "Select the closest course category.",
    options: [
      "BTech",
      "BCA",
      "MCA",
      "MBA",
      "Engineering",
      "Pharmacy",
      "Nursing",
      "Medical",
      "Law"
    ]
  },

  {
    key: "course_type",
    type: "choice",
    title: "What type of course is it?",
    help:
      "Select the category that best describes the course.",
    options: [
      "Technical",
      "Professional",
      "Management",
      "Medical"
    ]
  },

  {
    key: "course_recognized",
    type: "choice",
    title: "Is the course/institution recognized as required?",
    help:
      "Choose Yes only if you have verified the course/institution recognition.",
    options: ["Yes", "No"]
  },

  {
    key: "project_cost",
    type: "money",
    title: "What is the estimated total education cost?",
    help:
      "Include the expected study expenses. Example: ₹8 lakh."
  },

  {
    key: "loan_required",
    type: "money",
    title: "How much education loan do you need?",
    help:
      "Enter the approximate amount you want to borrow."
  },

  {
    key: "location",
    type: "choice",
    title: "Where are you currently based?",
    help:
      "Select the location category.",
    options: ["Urban", "Rural"]
  }

];


/* =========================================================
   GENERAL HELPERS
========================================================= */

function $(id) {
  return document.getElementById(id);
}


function formatMoney(value) {

  const n = Number(value || 0);

  return "₹" + n.toLocaleString("en-IN");
}


function formatRate(rate) {

  if (
    rate === null ||
    rate === undefined ||
    rate === ""
  ) {
    return "Not specified";
  }

  const s = String(rate);

  if (s.includes("%")) {
    return s;
  }

  const n = Number(rate);

  return Number.isFinite(n)
    ? `${(n * 100).toFixed(1)}%`
    : s;
}


function escapeHtml(value) {

  return String(value ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c])
  );
}


function escapeAttr(value) {

  return escapeHtml(value).replace(
    /`/g,
    "&#096;"
  );
}


/* =========================================================
   DATA ACCESS
========================================================= */

/*
  IMPORTANT FIX

  This function is intentionally defensive.

  It supports:

  MFS       -> S001
  AMY       -> S002
  TERM_LOAN -> S003
  UNY       -> S004
  ELS       -> S005

  It also accepts S001-S005 directly.
*/

function getSchemeByCode(code) {

  if (!code) {
    return null;
  }

  const normalizedCode =
    String(code)
      .trim()
      .toUpperCase();

  const sid =
    SCHEME_CODE_MAP[normalizedCode] ||
    normalizedCode;

  const data =
    window.NITINEXUS_DATA;

  if (!data) {
    console.warn(
      "NITINEXUS_DATA is not loaded."
    );

    return null;
  }

  let schemes = [];

  /*
    Normal expected structure:
    NITINEXUS_DATA.schemes
  */

  if (Array.isArray(data.schemes)) {
    schemes = data.schemes;
  }

  /*
    Extra compatibility:
    If schemes is stored under another common key.
  */

  else if (Array.isArray(data.schemeData)) {
    schemes = data.schemeData;
  }

  else if (Array.isArray(data.scheme_master)) {
    schemes = data.scheme_master;
  }

  /*
    Find by scheme_id.
  */

  let scheme = schemes.find(
    s =>
      String(s.scheme_id || "")
        .trim()
        .toUpperCase() === sid
  );

  if (scheme) {
    return scheme;
  }

  /*
    Also try scheme_code.
  */

  scheme = schemes.find(
    s =>
      String(s.scheme_code || "")
        .trim()
        .toUpperCase() === normalizedCode
  );

  if (scheme) {
    return scheme;
  }

  /*
    Also try direct scheme names/codes.
  */

  const nameMap = {
    MFS: "Micro Finance Scheme",
    AMY: "Aajeevika Micro-Finance Yojana",
    TERM_LOAN: "Term Loan",
    UNY: "Udyam Nidhi Yojana",
    ELS: "Educational Loan Scheme"
  };

  const expectedName =
    nameMap[normalizedCode];

  if (expectedName) {

    scheme = schemes.find(
      s =>
        String(s.scheme_name || "")
          .trim()
          .toLowerCase() ===
        expectedName.toLowerCase()
    );

    if (scheme) {
      return scheme;
    }
  }

  console.warn(
    "Scheme not found:",
    code,
    "Expected ID:",
    sid,
    "Available schemes:",
    schemes
  );

  return null;
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(page) {

  document
    .querySelectorAll(".page")
    .forEach(p =>
      p.classList.remove("active")
    );

  const target =
    $(page + "-page");

  if (target) {
    target.classList.add("active");
  }

  document
    .querySelectorAll(".nav-item")
    .forEach(n =>
      n.classList.remove("active")
    );

  const map = {
    home: 0,
    questionnaire: 1,
    recommendation: 1,
    details: 2,
    emi: 3,
    partners: 4,
    documents: 4
  };

  const index = map[page];

  const navItems =
    document.querySelectorAll(".nav-item");

  if (
    index !== undefined &&
    navItems[index]
  ) {
    navItems[index]
      .classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (page === "details") {
    renderDetails();
  }

  if (page === "emi") {
    renderEMILabels();
    prefillEMI();
  }

  if (page === "partners") {
    renderPartners();
  }

  if (page === "documents") {
    renderDocuments();
  }
}


/* =========================================================
   START RECOMMENDATION
========================================================= */

function startRecommendation(prefillPurpose) {

  state.answers = {};
  state.current = 0;
  state.result = null;
  state.selectedSchemeCode = null;

  state.questions = [
    ...baseQuestions
  ];

  if (prefillPurpose) {
    state.answers.purpose =
      prefillPurpose;
  }

  renderQuestion();

  showPage("questionnaire");
}


/* =========================================================
   DYNAMIC QUESTIONS
========================================================= */

function rebuildQuestions() {

  const purpose =
    state.answers.purpose;

  const branch =
    purpose === "Education"
      ? educationQuestions
      : businessQuestions;

  state.questions = [
    ...baseQuestions,
    ...branch
  ];
}


function getVisibleQuestions() {

  return state.questions.filter(
    q =>
      !q.condition ||
      q.condition(state.answers)
  );
}


/* =========================================================
   RENDER QUESTION
========================================================= */

function renderQuestion() {

  rebuildQuestions();

  const visibleQuestions =
    getVisibleQuestions();

  if (
    state.current >=
    visibleQuestions.length
  ) {
    submitRecommendation();
    return;
  }

  const q =
    visibleQuestions[state.current];

  const total =
    visibleQuestions.length;

  $("question-count").textContent =
    `QUESTION ${state.current + 1} of ${total}`;

  $("progress-bar").style.width =
    `${((state.current + 1) / total) * 100}%`;

  const saved =
    state.answers[q.key];

  let control = "";


  /* Choice question */

  if (q.type === "choice") {

    control = `
      <div class="choice-grid">

        ${q.options.map(option => {

          return `
            <button
              class="choice ${
                saved === option
                  ? "selected"
                  : ""
              }"
              onclick="selectChoice(
                '${escapeAttr(q.key)}',
                '${escapeAttr(option)}'
              )"
            >

              <span>
                ${choiceIcon(option)}
              </span>

              <b>
                ${escapeHtml(option)}
              </b>

              <i>
                ${
                  saved === option
                    ? "✓"
                    : "›"
                }
              </i>

            </button>
          `;

        }).join("")}

      </div>
    `;
  }


  /* Money question */

  else if (q.type === "money") {

    control = `
      <div class="input-row money-input">

        <span>₹</span>

        <input
          id="answer-input"
          type="number"
          min="0"
          step="1000"
          placeholder="150000"
          value="${saved ?? ""}"
          autofocus
        />

      </div>
    `;
  }


  /* Text question */

  else {

    control = `
      <div class="text-input">

        <input
          id="answer-input"
          type="text"
          placeholder="Type your answer"
          value="${escapeAttr(saved || "")}"
          autofocus
        />

      </div>
    `;
  }


  const button =
    q.type === "choice"
      ? ""
      : `
        <button
          class="primary-btn next-btn"
          onclick="saveInputAnswer()"
        >
          Continue
          <span>→</span>
        </button>
      `;


  $("question-content").innerHTML = `

    <div class="question-block">

      <span class="question-label">
        QUESTION ${state.current + 1}
      </span>

      <h2>
        ${escapeHtml(q.title)}
      </h2>

      <p>
        ${escapeHtml(q.help)}
      </p>

      ${control}

      ${button}

    </div>

  `;


  const input =
    $("answer-input");

  if (input) {

    input.addEventListener(
      "keydown",
      e => {

        if (e.key === "Enter") {
          saveInputAnswer();
        }

      }
    );

    input.focus();
  }
}


/* =========================================================
   CHOICE SELECTION
========================================================= */

function selectChoice(
  key,
  value
) {

  state.answers[key] =
    value;


  /*
    If purpose changes,
    remove old branch answers.
  */

  if (key === "purpose") {

    Object.keys(
      state.answers
    ).forEach(k => {

      if (
        ![
          "sc_status",
          "income",
          "purpose"
        ].includes(k)
      ) {

        delete state.answers[k];
      }

    });

    state.current = 2;
  }


  const visibleQuestions =
    getVisibleQuestions();


  if (
    state.current <
    visibleQuestions.length - 1
  ) {

    state.current++;

    renderQuestion();

  } else {

    submitRecommendation();
  }
}


/* =========================================================
   TEXT / MONEY ANSWER
========================================================= */

function saveInputAnswer() {

  const visibleQuestions =
    getVisibleQuestions();

  const q =
    visibleQuestions[
      state.current
    ];

  const input =
    $("answer-input");

  if (!input) {
    return;
  }

  const value =
    input.value.trim();


  if (!value) {

    input.classList.add(
      "invalid"
    );

    input.focus();

    return;
  }


  if (q.type === "money") {

    const number =
      Number(value);

    if (
      !Number.isFinite(number) ||
      number <= 0
    ) {

      input.classList.add(
        "invalid"
      );

      input.focus();

      return;
    }

    state.answers[q.key] =
      Math.round(number);

  } else {

    state.answers[q.key] =
      value;
  }


  if (
    state.current <
    visibleQuestions.length - 1
  ) {

    state.current++;

    renderQuestion();

  } else {

    submitRecommendation();
  }
}


/* =========================================================
   PREVIOUS QUESTION
========================================================= */

function previousQuestion() {

  if (state.current <= 0) {

    showPage("home");

    return;
  }

  state.current--;

  renderQuestion();
}


/* =========================================================
   BUILD AI REQUEST
========================================================= */

function buildBeneficiaryText(a) {

  const parts = [];


  parts.push(
    `I am ${
      a.sc_status === "Yes"
        ? "an SC beneficiary"
        : "not an SC beneficiary"
    }.`
  );


  parts.push(
    `My annual family income is ${
      formatMoney(a.income)
    }.`
  );


  if (
    a.purpose === "Business"
  ) {

    const activity =
      a.activity === "Other"
        ? a.activity_other
        : a.activity;


    parts.push(
      `I want to start a ${
        activity || "business"
      } business.`
    );


    parts.push(
      `My activity is ${
        activity || "business"
      }.`
    );


    parts.push(
      `My project cost is ${
        formatMoney(
          a.project_cost
        )
      }.`
    );


    parts.push(
      `I need a loan of ${
        formatMoney(
          a.loan_required
        )
      }.`
    );

  } else {

    parts.push(
      "I want financial assistance for education."
    );


    parts.push(
      `I am a ${
        a.education_level
      } student.`
    );


    parts.push(
      `I want to study ${
        a.course
      }.`
    );


    parts.push(
      `This is a ${
        a.course_type
      } course.`
    );


    parts.push(
      `My course is recognized: ${
        a.course_recognized
      }.`
    );


    parts.push(
      `My education cost is ${
        formatMoney(
          a.project_cost
        )
      }.`
    );


    parts.push(
      `I need an education loan of ${
        formatMoney(
          a.loan_required
        )
      }.`
    );
  }


  parts.push(
    `My location category is ${
      a.location
    }.`
  );


  return parts.join(" ");
}


/* =========================================================
   SUBMIT TO AI API
========================================================= */

async function submitRecommendation() {

  showPage(
    "recommendation"
  );


  $("recommendation-content").innerHTML = `

    <div class="loading-card">

      <div class="spinner"></div>

      <h2>
        Analysing your profile...
      </h2>

      <p>
        Sending your answers to the AI recommendation system.
      </p>

    </div>

  `;


  const text =
    buildBeneficiaryText(
      state.answers
    );


  console.log(
    "Sending to AI:",
    text
  );


  try {

    const response =
      await fetch(
        `${API_BASE}/api/recommend`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              text
            })
        }
      );


    const data =
      await response.json();


    console.log(
      "AI response:",
      data
    );


    if (
      !response.ok ||
      data.status !== "success"
    ) {

      throw new Error(
        data.message ||
        `API returned HTTP ${response.status}`
      );
    }


    state.result =
      data;


    renderRecommendation();


  } catch (error) {

    console.error(
      "AI API error:",
      error
    );


    $("recommendation-content").innerHTML = `

      <div class="error-card">

        <div class="error-icon">
          !
        </div>

        <h2>
          Could not connect to the AI backend
        </h2>

        <p>
          ${escapeHtml(
            error.message
          )}
        </p>

        <div class="error-help">

          <b>Check:</b>

          <ol>

            <li>
              Flask API is running on
              http://127.0.0.1:5000
            </li>

            <li>
              The model file exists at
              models/scheme_recommender.pkl
            </li>

            <li>
              Frontend is running from
              the frontend folder.
            </li>

          </ol>

        </div>

        <button
          class="primary-btn"
          onclick="submitRecommendation()"
        >
          Try Again
        </button>

      </div>

    `;
  }
}


/* =========================================================
   RECOMMENDATION
========================================================= */

function renderRecommendation() {

  const data =
    state.result;


  if (!data) {

    $("recommendation-content").innerHTML = `
      <div class="empty-result">
        <h2>No recommendation available</h2>
      </div>
    `;

    return;
  }


  const recs =
    data.recommendations || [];


  const best =
    data.recommendation;


  /*
    IMPORTANT:
    NO_ELIGIBLE_SCHEME must be
    handled before scheme lookup.
  */

  if (
    best ===
    "NO_ELIGIBLE_SCHEME"
  ) {

    $("recommendation-content").innerHTML = `

      <div class="empty-result">

        <div class="result-icon">
          i
        </div>

        <h2>
          No eligible scheme was identified by the model.
        </h2>

        <p>
          Review your answers or consult
          an authorized channel partner
          for final eligibility.
        </p>

        <button
          class="secondary-btn"
          onclick="startRecommendation()"
        >
          Review Answers
        </button>

      </div>

      ${renderAlternativeScores(recs)}

    `;

    return;
  }


  const bestScheme =
    getSchemeByCode(best);


  const schemeName =
    bestScheme?.scheme_name ||
    getReadableSchemeName(best) ||
    best;


  const purpose =
    bestScheme?.purpose ||
    "Recommended by the ML model.";


  $("recommendation-content").innerHTML = `

    <div class="best-card">

      <div class="best-top">

        <div>

          <span class="match-pill">
            BEST MATCH
          </span>

          <h2>
            ${escapeHtml(
              schemeName
            )}
          </h2>

          <p>
            ${escapeHtml(
              purpose
            )}
          </p>

        </div>


        <div class="confidence">

          <b>
            ${Number(
              data.confidence || 0
            ).toFixed(1)}%
          </b>

          <span>
            AI confidence
          </span>

        </div>

      </div>


      <div class="why-box">

        <h3>
          Profile considered
        </h3>

        <div class="tag-list">

          <span>
            ✓ SC:
            ${escapeHtml(
              state.answers.sc_status || ""
            )}
          </span>

          <span>
            ✓ Income:
            ${formatMoney(
              state.answers.income
            )}
          </span>

          <span>
            ✓ Purpose:
            ${escapeHtml(
              state.answers.purpose || ""
            )}
          </span>

          ${
            state.answers.project_cost
              ? `
                <span>
                  ✓ Cost:
                  ${formatMoney(
                    state.answers.project_cost
                  )}
                </span>
              `
              : ""
          }

          ${
            state.answers.loan_required
              ? `
                <span>
                  ✓ Loan:
                  ${formatMoney(
                    state.answers.loan_required
                  )}
                </span>
              `
              : ""
          }

        </div>

        <small>
          These are prototype profile indicators,
          not a final government eligibility decision.
        </small>

      </div>


      <div class="action-grid">

        <button
          onclick="showDetailsFor(
            '${escapeAttr(best)}'
          )"
        >

          📄

          <b>
            Scheme Details
          </b>

          <small>
            Rules & finance
          </small>

        </button>


        <button
          onclick="openUtility('documents')"
        >

          ▣

          <b>
            Documents
          </b>

          <small>
            Application guidance
          </small>

        </button>


        <button
          onclick="openUtility('partners')"
        >

          ⌖

          <b>
            Channel Partners
          </b>

          <small>
            Listed agencies
          </small>

        </button>


        <button
          onclick="openUtility('emi')"
        >

          ▦

          <b>
            EMI Calculator
          </b>

          <small>
            Estimate repayment
          </small>

        </button>

      </div>

    </div>


    ${renderAlternativeScores(recs)}

  `;
}


/* =========================================================
   READABLE SCHEME NAME
========================================================= */

function getReadableSchemeName(code) {

  const names = {

    MFS:
      "Micro Finance Scheme",

    AMY:
      "Aajeevika Micro-Finance Yojana",

    TERM_LOAN:
      "Term Loan",

    UNY:
      "Udyam Nidhi Yojana",

    ELS:
      "Educational Loan Scheme",

    S001:
      "Micro Finance Scheme",

    S002:
      "Aajeevika Micro-Finance Yojana",

    S003:
      "Term Loan",

    S004:
      "Udyam Nidhi Yojana",

    S005:
      "Educational Loan Scheme"

  };

  return names[code] || null;
}


/* =========================================================
   ALTERNATIVE SCORES
========================================================= */

function renderAlternativeScores(
  recs
) {

  if (!recs.length) {
    return "";
  }


  return `

    <div class="scores-card">

      <div class="card-title">

        <h3>
          Top AI scores
        </h3>

        <span>
          From ML model
        </span>

      </div>


      ${recs.map(
        (r, i) => {

          const scheme =
            getSchemeByCode(
              r.scheme
            );


          const name =
            scheme?.scheme_name ||
            getReadableSchemeName(
              r.scheme
            ) ||
            r.scheme;


          return `

            <button
              class="score-row"
              onclick="showDetailsFor(
                '${escapeAttr(r.scheme)}'
              )"
            >

              <span class="rank">
                ${i + 1}
              </span>


              <span class="score-name">

                <b>
                  ${escapeHtml(
                    name
                  )}
                </b>

                <small>
                  ${escapeHtml(
                    r.scheme
                  )}
                </small>

              </span>


              <span class="score-track">

                <i
                  style="
                    width:${Math.min(
                      Number(
                        r.suitability_score || 0
                      ),
                      100
                    )}%
                  "
                ></i>

              </span>


              <strong>
                ${Number(
                  r.suitability_score || 0
                ).toFixed(1)}%
              </strong>

            </button>

          `;

        }
      ).join("")}

    </div>

  `;
}


/* =========================================================
   SCHEME DETAILS
========================================================= */

function showDetailsFor(code) {

  state.selectedSchemeCode =
    code;

  showPage("details");
}


function renderDetails() {

  const code =
    state.selectedSchemeCode ||
    state.result?.recommendation;


  if (
    !code ||
    code === "NO_ELIGIBLE_SCHEME"
  ) {

    $("details-content").innerHTML = `

      <div class="empty-result">

        <h2>
          No scheme selected
        </h2>

        <p>
          Run a recommendation first.
        </p>

      </div>

    `;

    return;
  }


  const scheme =
    getSchemeByCode(code);


  if (!scheme) {

    /*
      IMPORTANT:
      Do NOT throw an error.
      This was the source of your
      previous console error.
    */

    $("details-content").innerHTML = `

      <div class="empty-result">

        <h2>
          Scheme details unavailable
        </h2>

        <p>
          The recommendation was
          <b>${escapeHtml(code)}</b>,
          but its scheme data could
          not be loaded.
        </p>

        <p>
          Please make sure data.js
          is loaded before app.js.
        </p>

      </div>

    `;

    return;
  }


  const docs =
    window.NITINEXUS_DATA
      ?.documents
      ?.[scheme.scheme_id] ||
    [];


  const apps =
    window.NITINEXUS_DATA
      ?.applications
      ?.[scheme.scheme_id] ||
    [];


  $("details-content").innerHTML = `

    <div class="detail-hero">

      <span class="scheme-code">

        ${escapeHtml(
          scheme.scheme_id ||
          code
        )}

      </span>


      <h2>

        ${escapeHtml(
          scheme.scheme_name ||
          getReadableSchemeName(code) ||
          code
        )}

      </h2>


      <p>

        ${escapeHtml(
          scheme.purpose ||
          "Scheme details"
        )}

      </p>


      <span class="verified">

        ✓

        ${escapeHtml(
          scheme.verification_status ||
          "Verified"
        )}

        •

        ${escapeHtml(
          scheme.last_verified ||
          ""
        )}

      </span>

    </div>


    <div class="info-grid">

      <div>

        <span>
          Income limit
        </span>

        <b>
          ${escapeHtml(
            scheme.income_limit ||
            "Not specified"
          )}
        </b>

      </div>


      <div>

        <span>
          Maximum project cost
        </span>

        <b>

          ${
            scheme.project_cost_max
              ? formatMoney(
                  scheme.project_cost_max
                )
              : "Not specified"
          }

        </b>

      </div>


      <div>

        <span>
          Maximum loan
        </span>

        <b>

          ${
            scheme.maximum_loan
              ? formatMoney(
                  scheme.maximum_loan
                )
              : "Not specified"
          }

        </b>

      </div>


      <div>

        <span>
          Interest rate
        </span>

        <b>

          ${formatRate(
            scheme.beneficiary_interest_rate
          )}

        </b>

      </div>


      <div>

        <span>
          Repayment
        </span>

        <b>

          ${escapeHtml(
            scheme.repayment_period ||
            "Not specified"
          )}

        </b>

      </div>


      <div>

        <span>
          Moratorium
        </span>

        <b>

          ${escapeHtml(
            scheme.moratorium ||
            "Not specified"
          )}

        </b>

      </div>

    </div>


    <div class="white-card">

      <h3>
        Channel & application
      </h3>


      <p>

        <b>
          Channel partners:
        </b>

        ${escapeHtml(
          scheme.channel_partner_types ||
          "Not specified"
        )}

      </p>


      <p>

        <b>
          Application mode:
        </b>

        ${escapeHtml(
          scheme.application_mode ||
          "Not specified"
        )}

      </p>


      <p>

        <b>
          Education requirement:
        </b>

        ${escapeHtml(
          scheme.education_requirement ||
          "Not specified"
        )}

      </p>

    </div>


    <div class="white-card">

      <h3>
        Required documents
      </h3>


      <ul class="check-list">

        ${
          docs.length
            ? docs.map(d => `

              <li>

                <span>
                  ✓
                </span>

                <div>

                  <b>
                    ${escapeHtml(
                      d.document_name
                    )}
                  </b>

                  <small>
                    ${escapeHtml(
                      d.description || ""
                    )}
                  </small>

                </div>

              </li>

            `).join("")
            : `
              <li>
                No document data available.
              </li>
            `
        }

      </ul>

    </div>


    <div class="white-card">

      <h3>
        Application guidance
      </h3>


      ${
        apps.length
          ? apps.map(a => `

            <div class="application-method">

              <span class="mode">
                ${escapeHtml(
                  a.application_mode ||
                  ""
                )}
              </span>

              <b>
                ${escapeHtml(
                  a.application_channel ||
                  ""
                )}
              </b>

              <p>
                ${escapeHtml(
                  a.steps ||
                  ""
                )}
              </p>

              <small>

                Direct individual application:
                ${escapeHtml(
                  a.direct_application ||
                  "Not specified"
                )}

                • Tracking:
                ${escapeHtml(
                  a.tracking ||
                  "Not specified"
                )}

              </small>

            </div>

          `).join("")
          : `
            <p>
              Application guidance is
              available through the
              authorized channel partner.
            </p>
          `
      }

    </div>


    <p class="source-note">

      Source:
      NSFDC master database included
      in this repository.

      Always verify final eligibility
      and current terms with NSFDC or
      an authorized channel partner.

    </p>

  `;
}


/* =========================================================
   EMI
========================================================= */

function renderEMILabels() {

  if ($("emi-amount-label")) {

    $("emi-amount-label").textContent =
      "Loan Amount";
  }


  if ($("emi-rate-label")) {

    $("emi-rate-label").textContent =
      "Annual Interest Rate (%)";
  }


  if ($("emi-years-label")) {

    $("emi-years-label").textContent =
      "Repayment Period (Years)";
  }


  if ($("calculate-emi-btn")) {

    $("calculate-emi-btn").textContent =
      "Calculate EMI";
  }
}


function prefillEMI() {

  const scheme =
    getSchemeByCode(
      state.selectedSchemeCode ||
      state.result?.recommendation
    );


  if (!$("emi-amount")) {
    return;
  }


  if (!$("emi-amount").value) {

    $("emi-amount").value =

      state.answers.loan_required ||

      scheme?.maximum_loan ||

      200000;
  }


  if (!$("emi-rate").value) {

    const rate =
      scheme?.beneficiary_interest_rate;


    if (
      rate !== undefined &&
      rate !== null &&
      rate !== ""
    ) {

      const numericRate =
        Number(rate);

      $("emi-rate").value =
        String(rate).includes("%")
          ? numericRate
          : numericRate * 100;

    } else {

      $("emi-rate").value =
        10.5;
    }
  }


  if (!$("emi-years").value) {

    $("emi-years").value =
      3;
  }
}


function calculateEMI() {

  const P =
    Number(
      $("emi-amount").value
    );


  const annualRate =
    Number(
      $("emi-rate").value
    );


  const years =
    Number(
      $("emi-years").value
    );


  if (
    !(P > 0) ||
    !(annualRate >= 0) ||
    !(years > 0)
  ) {

    return;
  }


  const r =
    annualRate / 12 / 100;


  const n =
    years * 12;


  const emi =
    r === 0
      ? P / n
      : P *
        r *
        Math.pow(
          1 + r,
          n
        ) /
        (
          Math.pow(
            1 + r,
            n
          ) - 1
        );


  const total =
    emi * n;


  const interest =
    total - P;


  $("emi-result").innerHTML = `

    <div class="metric">

      <span>
        Monthly EMI
      </span>

      <b>
        ${formatMoney(
          Math.round(emi)
        )}
      </b>

    </div>


    <div class="metric">

      <span>
        Total Interest
      </span>

      <b>
        ${formatMoney(
          Math.round(interest)
        )}
      </b>

    </div>


    <div class="metric">

      <span>
        Total Payment
      </span>

      <b>
        ${formatMoney(
          Math.round(total)
        )}
      </b>

    </div>

  `;
}


/* =========================================================
   UTILITY NAVIGATION
========================================================= */

function openUtility(page) {

  state.lastUtilityPage =
    "recommendation";

  showPage(page);
}


function goBackFromUtility() {

  showPage(
    state.lastUtilityPage ||
    "recommendation"
  );
}


/* =========================================================
   CHANNEL PARTNERS
========================================================= */

function renderPartners() {

  const partners =
    window.NITINEXUS_DATA?.partners ||
    [];


  $("partners-content").innerHTML = `

    <div class="notice">

      The repository database
      currently contains listed
      channel partners.

      Confirm scheme support
      before applying.

    </div>


    <div class="partner-list">

      ${
        partners.length

          ? partners.map(p => `

            <div class="partner-card">

              <div class="partner-icon">
                ⌖
              </div>


              <div class="partner-main">

                <h3>
                  ${escapeHtml(
                    p.partner_name
                  )}
                </h3>


                <span>

                  ${escapeHtml(
                    p.partner_type || ""
                  )}

                  •

                  ${escapeHtml(
                    p.district || ""
                  )},

                  ${escapeHtml(
                    p.state || ""
                  )}

                </span>


                <p>

                  ${escapeHtml(
                    p.address || ""
                  )}

                </p>


                <small>

                  ${escapeHtml(
                    p.status || ""
                  )}

                </small>

              </div>


              <a
                class="map-link"
                target="_blank"
                rel="noopener"
                href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  p.address || ""
                )}"
              >

                Directions ↗

              </a>

            </div>

          `).join("")

          : `

            <div class="empty-result">

              <h2>
                No channel partners loaded
              </h2>

              <p>
                Partner data will be
                connected by the backend/
                partner module.
              </p>

            </div>

          `
      }

    </div>

  `;
}


/* =========================================================
   DOCUMENT GUIDANCE
========================================================= */

function renderDocuments() {

  const code =
    state.selectedSchemeCode ||
    state.result?.recommendation;


  const scheme =
    getSchemeByCode(code);


  const docs =
    scheme
      ? (
          window.NITINEXUS_DATA
            ?.documents
            ?.[scheme.scheme_id] ||
          []
        )
      : [];


  $("documents-content").innerHTML = `

    <div class="notice">

      Document uploading is not
      included in this prototype.

      This page provides guidance only.

    </div>


    ${
      scheme
        ? `

          <div class="selected-scheme">

            <span>
              Selected scheme
            </span>

            <b>

              ${escapeHtml(
                scheme.scheme_name
              )}

            </b>

          </div>

        `
        : ""
    }


    <div class="white-card">

      <h3>
        Document checklist
      </h3>


      <ul class="check-list">

        ${
          docs.length

            ? docs.map(d => `

              <li>

                <span>
                  ✓
                </span>

                <div>

                  <b>
                    ${escapeHtml(
                      d.document_name
                    )}
                  </b>

                  <small>
                    ${escapeHtml(
                      d.description || ""
                    )}
                  </small>

                </div>

              </li>

            `).join("")

            : `

              <li>
                No document data available.
              </li>

            `
        }

      </ul>

    </div>


    <div class="white-card">

      <h3>
        How to apply
      </h3>


      <ol class="steps-list">

        <li>
          Review the recommended scheme
          and confirm that the purpose,
          cost and loan requirement match.
        </li>

        <li>
          Keep the required documents
          ready according to the
          authorized channel partner.
        </li>

        <li>
          Use the official application
          route shown for the scheme,
          where applicable.
        </li>

        <li>
          Confirm final eligibility,
          sanction, interest and
          repayment terms with the
          authorized channel partner.
        </li>

      </ol>

    </div>


    <div class="official-box">

      <b>
        Important
      </b>

      <p>

        NSFDC eligibility and sanction
        are ultimately subject to official
        criteria and the authorized
        channelizing agency.

        This prototype is a
        scheme-discovery aid.

      </p>

    </div>

  `;
}


/* =========================================================
   ICONS
========================================================= */

function choiceIcon(value) {

  const icons = {

    Yes: "✓",
    No: "×",

    Business: "💼",
    Education: "🎓",

    Urban: "🏙",
    Rural: "🌾",

    Tailoring: "🧵",
    "Grocery Shop": "🛒",
    Poultry: "🐔",
    Fisheries: "🐟",
    "Repair Shop": "🔧",
    "Computer Centre": "💻",
    Transport: "🚚",
    "Food Business": "🍱",
    "Small Manufacturing": "🏭",
    "Service Business": "🛠",

    Other: "＋",

    "12th": "📚",
    Graduate: "🎓",
    Postgraduate: "🎓",

    BTech: "💻",
    BCA: "💻",
    MCA: "💻",
    MBA: "📈",
    Engineering: "⚙",
    Pharmacy: "💊",
    Nursing: "🩺",
    Medical: "🏥",
    Law: "⚖",

    Technical: "⚙",
    Professional: "🎓",
    Management: "📊"

  };


  return (
    icons[value] ||
    "•"
  );
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "NitiNexus frontend loaded."
    );


    /*
      Check data.js
    */

    if (
      !window.NITINEXUS_DATA
    ) {

      console.warn(
        "NITINEXUS_DATA not found. Make sure data.js is loaded before app.js."
      );

    } else {

      console.log(
        "NITINEXUS_DATA loaded."
      );


      console.log(
        "Available schemes:",
        window.NITINEXUS_DATA.schemes
      );

    }


    showPage("home");

  }
);