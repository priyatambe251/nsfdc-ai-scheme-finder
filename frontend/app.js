/*
  NSFDC AI Scheme Recommendation System - Frontend
  Backend contract used: POST /api/recommend with { text: "..." }.
  No new backend endpoints are required.
*/

const API_BASE = "http://127.0.0.1:5000";

const SCHEME_CODE_MAP = {
  MFS: "S001",
  AMY: "S002",
  TERM_LOAN: "S003",
  UNY: "S004",
  ELS: "S005",
  NO_ELIGIBLE_SCHEME: null
};

const state = {
  answers: {},
  questions: [],
  current: 0,
  result: null,
  lastUtilityPage: "recommendation"
};

const baseQuestions = [
  {
    key: "sc_status",
    title: "Do you belong to the Scheduled Caste (SC) category?",
    help: "NSFDC schemes in this prototype are designed for eligible SC beneficiaries/students.",
    type: "choice",
    options: ["Yes", "No"]
  },
  {
    key: "income",
    title: "What is your approximate annual family income?",
    help: "Enter the total annual family income. Example: ₹1.5 lakh.",
    type: "money"
  },
  {
    key: "purpose",
    title: "What do you need financial assistance for?",
    help: "Choose the purpose that best matches your requirement.",
    type: "choice",
    options: ["Business", "Education"]
  }
];

const businessQuestions = [
  {
    key: "activity",
    title: "What activity or business are you planning?",
    help: "Choose the closest activity. You can also enter another activity.",
    type: "choice",
    options: ["Tailoring", "Grocery Shop", "Poultry", "Fisheries", "Repair Shop", "Computer Centre", "Transport", "Food Business", "Small Manufacturing", "Service Business", "Other"]
  },
  {
    key: "activity_other",
    title: "Tell us the business activity.",
    help: "Enter the activity in a few words.",
    type: "text",
    condition: a => a.activity === "Other"
  },
  {
    key: "project_cost",
    title: "What is the estimated project cost?",
    help: "Example: ₹2 lakh.",
    type: "money"
  },
  {
    key: "loan_required",
    title: "How much loan do you need?",
    help: "Enter the approximate amount you want to borrow.",
    type: "money"
  },
  {
    key: "location",
    title: "Where will the activity be located?",
    help: "This matches the Rural/Urban location field used by the existing ML model.",
    type: "choice",
    options: ["Urban", "Rural"]
  }
];

const educationQuestions = [
  {
    key: "education_level",
    title: "What is your current education level?",
    help: "Choose your highest/current level.",
    type: "choice",
    options: ["12th", "Graduate", "Postgraduate"]
  },
  {
    key: "course",
    title: "Which course do you want to pursue?",
    help: "Select the closest course category.",
    type: "choice",
    options: ["BTech", "BCA", "MCA", "MBA", "Engineering", "Pharmacy", "Nursing", "Medical", "Law"]
  },
  {
    key: "course_type",
    title: "What type of course is it?",
    help: "Select the category that best describes the course.",
    type: "choice",
    options: ["Technical", "Professional", "Management", "Medical"]
  },
  {
    key: "course_recognized",
    title: "Is the course/institution recognized as required?",
    help: "Choose Yes only if you have verified the course/institution recognition.",
    type: "choice",
    options: ["Yes", "No"]
  },
  {
    key: "project_cost",
    title: "What is the estimated total education cost?",
    help: "Include the expected study expenses for the loan requirement. Example: ₹8 lakh.",
    type: "money"
  },
  {
    key: "loan_required",
    title: "How much education loan do you need?",
    help: "Enter the approximate amount you want to borrow.",
    type: "money"
  },
  {
    key: "location",
    title: "Where are you currently based?",
    help: "Select the location category used by the existing model.",
    type: "choice",
    options: ["Urban", "Rural"]
  }
];

function $(id) {
  return document.getElementById(id);
}

function formatMoney(value) {
  const n = Number(value || 0);
  return "₹" + n.toLocaleString("en-IN");
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = $(page + "-page");
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const map = { home: 0, questionnaire: 1, recommendation: 1, details: 2, emi: 3, partners: 4, documents: 4 };
  const index = map[page];
  if (index !== undefined && document.querySelectorAll(".nav-item")[index]) {
    document.querySelectorAll(".nav-item")[index].classList.add("active");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (page === "details") renderDetails();
  if (page === "emi") prefillEMI();
  if (page === "partners") renderPartners();
  if (page === "documents") renderDocuments();
}

function startRecommendation(prefillPurpose) {
  state.answers = {};
  state.current = 0;
  state.result = null;
  state.questions = [...baseQuestions];
  if (prefillPurpose) state.answers.purpose = prefillPurpose;
  renderQuestion();
  showPage("questionnaire");
}

function rebuildQuestions() {
  const purpose = state.answers.purpose;
  const branch = purpose === "Education" ? educationQuestions : businessQuestions;
  state.questions = [...baseQuestions, ...branch];
}

function renderQuestion() {
  rebuildQuestions();

  // Remove questions that are currently hidden by a condition.
  const visibleQuestions = state.questions.filter(q => !q.condition || q.condition(state.answers));
  if (state.current >= visibleQuestions.length) {
    submitRecommendation();
    return;
  }

  const q = visibleQuestions[state.current];
  const total = visibleQuestions.length;
  $("question-count").textContent = `Question ${state.current + 1} of ${total}`;
  $("progress-bar").style.width = `${((state.current + 1) / total) * 100}%`;

  const saved = state.answers[q.key];
  let control = "";

  if (q.type === "choice") {
    control = `<div class="choice-grid">${q.options.map(option =>
      `<button class="choice ${saved === option ? "selected" : ""}" onclick="selectChoice('${escapeAttr(q.key)}','${escapeAttr(option)}')">
        <span>${choiceIcon(option)}</span><b>${escapeHtml(option)}</b><i>${saved === option ? "✓" : "›"}</i>
      </button>`
    ).join("")}</div>`;
  } else if (q.type === "money") {
    control = `<div class="input-row money-input"><span>₹</span><input id="answer-input" type="number" min="0" step="1000" placeholder="e.g. 150000" value="${saved ?? ""}" autofocus></div>`;
  } else {
    control = `<div class="text-input"><input id="answer-input" type="text" placeholder="Type your answer" value="${escapeAttr(saved || "")}" autofocus></div>`;
  }

  const button = q.type === "choice"
    ? ""
    : `<button class="primary-btn next-btn" onclick="saveInputAnswer()">Continue <span>→</span></button>`;

  $("question-content").innerHTML = `
    <div class="question-block">
      <span class="question-label">QUESTION ${state.current + 1}</span>
      <h2>${escapeHtml(q.title)}</h2>
      <p>${escapeHtml(q.help)}</p>
      ${control}
      ${button}
    </div>
  `;

  const input = $("answer-input");
  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") saveInputAnswer();
    });
    input.focus();
  }
}

function selectChoice(key, value) {
  state.answers[key] = value;

  // If purpose changes, discard branch answers so stale values aren't sent.
  if (key === "purpose") {
    Object.keys(state.answers).forEach(k => {
      if (!["sc_status", "income", "purpose"].includes(k)) delete state.answers[k];
    });
    state.current = 2;
  }

  const visibleQuestions = state.questions.filter(q => !q.condition || q.condition(state.answers));
  if (state.current < visibleQuestions.length - 1) {
    state.current++;
    renderQuestion();
  } else {
    submitRecommendation();
  }
}

function saveInputAnswer() {
  const visibleQuestions = state.questions.filter(q => !q.condition || q.condition(state.answers));
  const q = visibleQuestions[state.current];
  const input = $("answer-input");
  if (!input) return;

  const value = input.value.trim();
  if (!value) {
    input.classList.add("invalid");
    input.focus();
    return;
  }

  if (q.type === "money") {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) {
      input.classList.add("invalid");
      input.focus();
      return;
    }
    state.answers[q.key] = Math.round(number);
  } else {
    state.answers[q.key] = value;
  }

  if (state.current < visibleQuestions.length - 1) {
    state.current++;
    renderQuestion();
  } else {
    submitRecommendation();
  }
}

function previousQuestion() {
  if (state.current <= 0) {
    showPage("home");
    return;
  }
  state.current--;
  renderQuestion();
}

async function submitRecommendation() {
  showPage("recommendation");
  $("recommendation-content").innerHTML = `
    <div class="loading-card">
      <div class="spinner"></div>
      <h2>Analysing your profile…</h2>
      <p>Sending your answers to the existing NSFDC AI recommendation API.</p>
    </div>
  `;

  const text = buildBeneficiaryText(state.answers);

  try {
    const response = await fetch(`${API_BASE}/api/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      throw new Error(data.message || `API returned HTTP ${response.status}`);
    }

    state.result = data;
    renderRecommendation();
  } catch (error) {
    $("recommendation-content").innerHTML = `
      <div class="error-card">
        <div class="error-icon">!</div>
        <h2>Could not connect to the AI backend</h2>
        <p>${escapeHtml(error.message)}</p>
        <div class="error-help">
          <b>Check:</b>
          <ol>
            <li>Flask API is running on <code>http://127.0.0.1:5000</code>.</li>
            <li>The model file exists at <code>models/scheme_recommender.pkl</code>.</li>
            <li>You started the frontend from the <code>frontend</code> folder or via a local HTTP server.</li>
          </ol>
        </div>
        <button class="primary-btn" onclick="submitRecommendation()">Try Again</button>
      </div>
    `;
  }
}

function buildBeneficiaryText(a) {
  const parts = [];
  parts.push(`I am ${a.sc_status === "Yes" ? "an SC beneficiary" : "not an SC beneficiary"}.`);
  parts.push(`My annual family income is ${formatMoney(a.income)}.`);

  if (a.purpose === "Business") {
    const activity = a.activity === "Other" ? a.activity_other : a.activity;
    parts.push(`I want to start a ${activity || "business"} business.`);
    parts.push(`My activity is ${activity || "business"}.`);
    parts.push(`My project cost is ${formatMoney(a.project_cost)}.`);
    parts.push(`I need a loan of ${formatMoney(a.loan_required)}.`);
  } else {
    parts.push(`I want financial assistance for education.`);
    parts.push(`I am a ${a.education_level} student.`);
    parts.push(`I want to study ${a.course}.`);
    parts.push(`This is a ${a.course_type} course.`);
    parts.push(`My course is recognized: ${a.course_recognized}.`);
    parts.push(`My education cost is ${formatMoney(a.project_cost)}.`);
    parts.push(`I need an education loan of ${formatMoney(a.loan_required)}.`);
  }

  // Kept in the natural-language request even though the current extractor
  // does not yet parse location/education_level. This preserves the answer
  // and makes the request ready if the existing extractor is enhanced later.
  parts.push(`My location category is ${a.location}.`);

  return parts.join(" ");
}

function renderRecommendation() {
  const data = state.result;
  const recs = data.recommendations || [];
  const best = data.recommendation;
  const bestScheme = getSchemeByCode(best);

  if (best === "NO_ELIGIBLE_SCHEME") {
    $("recommendation-content").innerHTML = `
      <div class="empty-result">
        <div class="result-icon">i</div>
        <h2>No eligible scheme was identified by the model.</h2>
        <p>Review your answers or consult an authorized channel partner for final eligibility.</p>
        <button class="secondary-btn" onclick="startRecommendation()">Review Answers</button>
      </div>
      ${renderAlternativeScores(recs)}
    `;
    return;
  }

  $("recommendation-content").innerHTML = `
    <div class="best-card">
      <div class="best-top">
        <div>
          <span class="match-pill">BEST MATCH</span>
          <h2>${escapeHtml(bestScheme?.scheme_name || best)}</h2>
          <p>${escapeHtml(bestScheme?.purpose || "Recommended by the existing ML model.")}</p>
        </div>
        <div class="confidence"><b>${Number(data.confidence || 0).toFixed(1)}%</b><span>AI confidence</span></div>
      </div>

      <div class="why-box">
        <h3>Profile considered</h3>
        <div class="tag-list">
          <span>✓ SC: ${escapeHtml(state.answers.sc_status)}</span>
          <span>✓ Income: ${formatMoney(state.answers.income)}</span>
          <span>✓ Purpose: ${escapeHtml(state.answers.purpose)}</span>
          ${state.answers.project_cost ? `<span>✓ Cost: ${formatMoney(state.answers.project_cost)}</span>` : ""}
          ${state.answers.loan_required ? `<span>✓ Loan: ${formatMoney(state.answers.loan_required)}</span>` : ""}
        </div>
        <small>These are prototype profile indicators, not a final government eligibility decision.</small>
      </div>

      <div class="action-grid">
        <button onclick="showDetailsFor('${escapeAttr(best)}')">📄<b>Scheme Details</b><small>Rules & finance</small></button>
        <button onclick="openUtility('documents')">▣<b>Documents</b><small>Application guidance</small></button>
        <button onclick="openUtility('partners')">⌖<b>Channel Partners</b><small>Listed agencies</small></button>
        <button onclick="openUtility('emi')">▦<b>EMI Calculator</b><small>Estimate repayment</small></button>
      </div>
    </div>

    ${renderAlternativeScores(recs)}
  `;
}

function renderAlternativeScores(recs) {
  if (!recs.length) return "";
  return `
    <div class="scores-card">
      <div class="card-title"><h3>Top AI scores</h3><span>From existing model</span></div>
      ${recs.map((r, i) => `
        <button class="score-row" onclick="showDetailsFor('${escapeAttr(r.scheme)}')">
          <span class="rank">${i + 1}</span>
          <span class="score-name"><b>${escapeHtml(getSchemeByCode(r.scheme)?.scheme_name || r.scheme)}</b><small>${escapeHtml(r.scheme)}</small></span>
          <span class="score-track"><i style="width:${Math.min(Number(r.suitability_score || 0),100)}%"></i></span>
          <strong>${Number(r.suitability_score || 0).toFixed(1)}%</strong>
        </button>
      `).join("")}
    </div>
  `;
}

function getSchemeByCode(code) {
  const sid = SCHEME_CODE_MAP[code] || code;
  return (window.NSFDC_DATA.schemes || []).find(s => s.scheme_id === sid);
}

function showDetailsFor(code) {
  state.selectedSchemeCode = code;
  showPage("details");
}

function renderDetails() {
  const code = state.selectedSchemeCode || state.result?.recommendation;
  const scheme = getSchemeByCode(code);

  if (!scheme) {
    $("details-content").innerHTML = `<div class="empty-result"><h2>No scheme selected</h2><p>Run a recommendation first.</p></div>`;
    return;
  }

  const docs = window.NSFDC_DATA.documents[scheme.scheme_id] || [];
  const apps = window.NSFDC_DATA.applications[scheme.scheme_id] || [];

  $("details-content").innerHTML = `
    <div class="detail-hero">
      <span class="scheme-code">${escapeHtml(scheme.scheme_id)}</span>
      <h2>${escapeHtml(scheme.scheme_name)}</h2>
      <p>${escapeHtml(scheme.purpose)}</p>
      <span class="verified">✓ ${escapeHtml(scheme.verification_status || "Verified")} • ${escapeHtml(scheme.last_verified || "")}</span>
    </div>

    <div class="info-grid">
      <div><span>Income limit</span><b>${escapeHtml(scheme.income_limit || "Not specified")}</b></div>
      <div><span>Maximum project cost</span><b>${scheme.project_cost_max ? formatMoney(scheme.project_cost_max) : "Not specified"}</b></div>
      <div><span>Maximum loan</span><b>${scheme.maximum_loan ? formatMoney(scheme.maximum_loan) : "Not specified"}</b></div>
      <div><span>Interest rate</span><b>${formatRate(scheme.beneficiary_interest_rate)}</b></div>
      <div><span>Repayment</span><b>${escapeHtml(scheme.repayment_period || "Not specified")}</b></div>
      <div><span>Moratorium</span><b>${escapeHtml(scheme.moratorium || "Not specified")}</b></div>
    </div>

    <div class="white-card">
      <h3>Channel & application</h3>
      <p><b>Channel partners:</b> ${escapeHtml(scheme.channel_partner_types || "Not specified")}</p>
      <p><b>Application mode:</b> ${escapeHtml(scheme.application_mode || "Not specified")}</p>
      <p><b>Education requirement:</b> ${escapeHtml(scheme.education_requirement || "Not specified")}</p>
    </div>

    <div class="white-card">
      <h3>Required documents</h3>
      <ul class="check-list">${docs.map(d => `<li><span>✓</span><div><b>${escapeHtml(d.document_name)}</b><small>${escapeHtml(d.description || "")}</small></div></li>`).join("")}</ul>
    </div>

    <div class="white-card">
      <h3>Application guidance</h3>
      ${apps.map(a => `
        <div class="application-method">
          <span class="mode">${escapeHtml(a.application_mode)}</span>
          <b>${escapeHtml(a.application_channel)}</b>
          <p>${escapeHtml(a.steps)}</p>
          <small>Direct individual application: ${escapeHtml(a.direct_application || "Not specified")} • Tracking: ${escapeHtml(a.tracking || "Not specified")}</small>
        </div>
      `).join("")}
    </div>

    <p class="source-note">Source: NSFDC master database included in this repository. Always verify final eligibility and current terms with NSFDC/authorized channel partner.</p>
  `;
}

function formatRate(rate) {
  if (rate === null || rate === undefined || rate === "") return "Not specified";
  const s = String(rate);
  if (s.includes("%")) return s;
  const n = Number(rate);
  return Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : s;
}

function openUtility(page) {
  state.lastUtilityPage = "recommendation";
  showPage(page);
}

function goBackFromUtility() {
  showPage(state.lastUtilityPage || "recommendation");
}

function prefillEMI() {
  const scheme = getSchemeByCode(state.selectedSchemeCode || state.result?.recommendation);
  if (!$("emi-amount")) return;
  if (!$("emi-amount").value) {
    $("emi-amount").value = state.answers.loan_required || scheme?.maximum_loan || 200000;
  }
  if (!$("emi-rate").value) {
    const rate = scheme?.beneficiary_interest_rate;
    $("emi-rate").value = rate && !String(rate).includes("%") ? Number(rate) * 100 : 10.5;
  }
  if (!$("emi-years").value) $("emi-years").value = 3;
}

function calculateEMI() {
  const P = Number($("emi-amount").value);
  const annualRate = Number($("emi-rate").value);
  const years = Number($("emi-years").value);
  if (!(P > 0) || !(annualRate >= 0) || !(years > 0)) return;

  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - P;

  $("emi-result").innerHTML = `
    <div class="metric"><span>Monthly EMI</span><b>${formatMoney(Math.round(emi))}</b></div>
    <div class="metric"><span>Total Interest</span><b>${formatMoney(Math.round(interest))}</b></div>
    <div class="metric"><span>Total Payment</span><b>${formatMoney(Math.round(total))}</b></div>
  `;
}

function renderPartners() {
  const partners = window.NSFDC_DATA.partners || [];
  $("partners-content").innerHTML = `
    <div class="notice">The repository database currently contains listed channel partners, mainly in Maharashtra. Individual scheme mapping may be unspecified, so confirm scheme support before applying.</div>
    <div class="partner-list">
      ${partners.map(p => `
        <div class="partner-card">
          <div class="partner-icon">⌖</div>
          <div class="partner-main">
            <h3>${escapeHtml(p.partner_name)}</h3>
            <span>${escapeHtml(p.partner_type)} • ${escapeHtml(p.district)}, ${escapeHtml(p.state)}</span>
            <p>${escapeHtml(p.address)}</p>
            <small>${escapeHtml(p.status || "")}</small>
          </div>
          <a class="map-link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}">Directions ↗</a>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDocuments() {
  const code = state.selectedSchemeCode || state.result?.recommendation;
  const scheme = getSchemeByCode(code);
  const docs = scheme ? (window.NSFDC_DATA.documents[scheme.scheme_id] || []) : [];

  $("documents-content").innerHTML = `
    <div class="notice">Document uploading is intentionally not included in this prototype. This page only provides guidance.</div>
    ${scheme ? `<div class="selected-scheme"><span>Selected scheme</span><b>${escapeHtml(scheme.scheme_name)}</b></div>` : ""}
    <div class="white-card">
      <h3>Document checklist</h3>
      <ul class="check-list">${docs.length ? docs.map(d => `<li><span>✓</span><div><b>${escapeHtml(d.document_name)}</b><small>${escapeHtml(d.description || "")}</small></div></li>`).join("") : "<li>No scheme selected. Run a recommendation first.</li>"}</ul>
    </div>
    <div class="white-card">
      <h3>How to apply</h3>
      <ol class="steps-list">
        <li>Review the recommended scheme and confirm that the purpose, cost and loan requirement match.</li>
        <li>Keep the required documents ready according to the authorized channel partner's checklist.</li>
        <li>Use the official application route shown for the scheme (where applicable).</li>
        <li>Confirm the final eligibility, sanction, interest and repayment terms with the authorized channel partner.</li>
      </ol>
    </div>
    <div class="official-box">
      <b>Important</b>
      <p>NSFDC eligibility and sanction are ultimately subject to official criteria and the authorized channelizing agency. This prototype is a scheme-discovery aid.</p>
    </div>
  `;
}

function choiceIcon(value) {
  const icons = { Yes:"✓", No:"×", Business:"💼", Education:"🎓", Urban:"🏙", Rural:"🌾", Tailoring:"🧵", "Grocery Shop":"🛒", Poultry:"🐔", Fisheries:"🐟", "Repair Shop":"🔧", "Computer Centre":"💻", Transport:"🚚", "Food Business":"🍱", "Small Manufacturing":"🏭", "Service Business":"🛠", Other:"＋", "12th":"📚", Graduate:"🎓", Postgraduate:"🎓", BTech:"💻", BCA:"💻", MCA:"💻", MBA:"📈", Engineering:"⚙", Pharmacy:"💊", Nursing:"🩺", Medical:"🏥", Law:"⚖", Technical:"⚙", Professional:"🎓", Management:"📊" };
  return icons[value] || "•";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}
function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

// Initial state
showPage("home");
