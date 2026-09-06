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
   MULTILINGUAL UI
   English is kept as the default language. The language
   layer changes only displayed text; questionnaire values
   sent to the AI backend remain unchanged.
========================================================= */

const TRANSLATIONS = {
  en: {
    pageTitle: "NitiNexus – AI Scheme Assistant",
    verifiedData: "Verified Data",
    heroBadge: "AI-POWERED SCHEME DISCOVERY",
    heroTitle: 'Find the right <span>government scheme</span> for you.',
    heroDescription: "Tell NitiNexus about your needs in simple steps. Our AI analyses your requirements and identifies suitable NSFDC schemes using verified government scheme information.",
    startAIButton: "<span>Start AI Assistant</span><strong>→</strong>",
    exploreSchemes: "Explore Schemes",
    aiPowered: "AI-powered",
    verifiedSchemeData: "Verified scheme data",
    simpleQuestions: "Simple questions",
    recommendationEngine: "Recommendation Engine",
    online: "Online",
    howCanIHelp: "How can I help?",
    aiHelpText: "I'll ask a few questions to understand your requirement.",
    understandingRequirement: "Understanding requirement",
    analysingSchemes: "Analysing schemes",
    findingBestMatch: "Finding best match",
    education: "Education",
    business: "Business",
    verified: "Verified",
    quickStart: "QUICK START",
    whatLookingFor: "What are you looking for?",
    quickStartDesc: "Start with an area that matches your requirement.",
    startBusiness: "Start a Business",
    startBusinessDesc: "Find suitable finance options for income-generating activities.",
    educationDesc: "Explore education loan assistance for eligible courses.",
    dairyLivestock: "Dairy / Livestock",
    dairyLivestockDesc: "Explore finance options for agricultural and allied activities.",
    existingBusiness: "Existing Business",
    existingBusinessDesc: "Share your project requirements and discover suitable options.",
    howNitiNexusWorks: "HOW NITINEXUS WORKS",
    fromRequirementToScheme: "From your requirement to a suitable scheme",
    simpleJourney: "A simple AI-assisted journey designed for beneficiaries.",
    tellNeed: "Tell us your need",
    tellNeedDesc: "Answer simple questions about your purpose, income and requirement.",
    aiAnalyses: "AI analyses",
    aiAnalysesDesc: "NLP understands your answers and the ML model calculates scheme suitability.",
    getMatch: "Get your match",
    getMatchDesc: "See suitable schemes, reasons, eligibility information and next steps.",
    verifiedSchemeInfo: "Built using verified scheme information",
    verifiedSchemeInfoDesc: "NitiNexus uses verified NSFDC scheme information for this SIH prototype. Final eligibility, verification and sanction are subject to the authorized Channel Partner and applicable guidelines.",
    questionCount: "QUESTION",
    aiAssistant: "AI ASSISTANT",
    nitiNexusAI: "NitiNexus AI",
    personalisedDiscovery: "Personalised scheme discovery",
    active: "Active",
    privacyNote: "Your answers are used only to prepare your scheme recommendation request for this prototype.",
    analysisComplete: "AI ANALYSIS COMPLETE",
    yourSchemeMatches: "Your Scheme Matches",
    basedOnInfo: "Based on the information you provided.",
    verifiedInformation: "VERIFIED INFORMATION",
    schemeDetails: "Scheme Details",
    understandScheme: "Understand the scheme before you apply.",
    financialPlanning: "FINANCIAL PLANNING",
    emiCalculator: "EMI Calculator",
    estimateMonthlyRepayment: "Estimate your monthly repayment.",
    planRepayment: "Plan your repayment",
    enterLoanDetails: "Enter your loan details to estimate the EMI.",
    loanAmount: "Loan Amount (₹)",
    interestRate: "Interest Rate (% p.a.)",
    loanTenure: "Loan Tenure (years)",
    calculateEMIButton: "Calculate EMI <span>→</span>",
    emiDisclaimer: "* EMI calculation is approximate. Actual sanction amount, interest rate and repayment terms are subject to the applicable scheme and authorized Channel Partner.",
    applicationSupport: "APPLICATION SUPPORT",
    channelPartners: "Channel Partners",
    findAuthorizedPartner: "Find an authorized channel partner for assistance.",
    findSupport: "Find support near you",
    explorePartners: "Explore listed authorized channel partners and their available contact/location information.",
    documentsApplication: "Documents & Application",
    documentsSubtitle: "Know what you may need before approaching the authorized channel partner.",
    prepareBeforeApply: "Prepare before you apply",
    reviewDocuments: "Review the required documents and application guidance for your selected scheme.",
    home: "Home",
    schemes: "Schemes",
    calculator: "Calculator",
    help: "Help",
    aiSchemeAssistant: "AI Scheme Assistant",
    footerText: "SIH Prototype • Scheme information based on verified government sources.",

    // Questionnaire
    q_sc_title: "Do you belong to the Scheduled Caste (SC) category?",
    q_sc_help: "NSFDC schemes in this prototype are designed for eligible SC beneficiaries and students.",
    q_income_title: "What is your approximate annual family income?",
    q_income_help: "Enter the total annual family income. Example: ₹1.5 lakh.",
    q_purpose_title: "What do you need financial assistance for?",
    q_purpose_help: "Choose the purpose that best matches your requirement.",
    q_activity_title: "What activity or business are you planning?",
    q_activity_help: "Choose the closest activity.",
    q_activity_other_title: "Tell us the business activity.",
    q_activity_other_help: "Enter the activity in a few words.",
    q_project_business_title: "What is the estimated project cost?",
    q_project_business_help: "Example: ₹2 lakh.",
    q_loan_business_title: "How much loan do you need?",
    q_loan_business_help: "Enter the approximate amount you want to borrow.",
    q_location_business_title: "Where will the activity be located?",
    q_location_business_help: "Select whether the activity will be in an urban or rural area.",
    q_education_level_title: "What is your current education level?",
    q_education_level_help: "Choose your highest/current level.",
    q_course_title: "Which course do you want to pursue?",
    q_course_help: "Select the closest course category.",
    q_course_type_title: "What type of course is it?",
    q_course_type_help: "Select the category that best describes the course.",
    q_course_recognized_title: "Is the course/institution recognized as required?",
    q_course_recognized_help: "Choose Yes only if you have verified the course/institution recognition.",
    q_project_education_title: "What is the estimated total education cost?",
    q_project_education_help: "Include the expected study expenses. Example: ₹8 lakh.",
    q_loan_education_title: "How much education loan do you need?",
    q_loan_education_help: "Enter the approximate amount you want to borrow.",
    q_location_education_title: "Where are you currently based?",
    q_location_education_help: "Select the location category.",
    yes: "Yes", no: "No", continue: "Continue", question: "QUESTION",
    typeAnswer: "Type your answer", emiAmountPlaceholder: "Example: 500000", emiRatePlaceholder: "Example: 8", emiYearsPlaceholder: "Example: 3",

    // Results / details / utilities
    analysingProfile: "Analysing your profile...",
    sendingAnswers: "Sending your answers to the AI recommendation system.",
    couldNotConnect: "Could not connect to the AI backend",
    check: "Check:",
    flaskRunning: "Flask API is running on http://127.0.0.1:5000",
    modelExists: "The model file exists at models/scheme_recommender.pkl",
    frontendRunning: "Frontend is running from the frontend folder.",
    tryAgain: "Try Again",
    noRecommendation: "No recommendation available", recommendedByML: "Recommended by the ML model.",
    noEligible: "No eligible scheme was identified by the model.",
    reviewAnswers: "Review your answers",
    finalEligibility: "Review your answers or consult an authorized channel partner for final eligibility.",
    bestMatch: "BEST MATCH",
    aiConfidence: "AI confidence",
    profileConsidered: "Profile considered",
    sc: "SC",
    income: "Income",
    purpose: "Purpose",
    cost: "Cost",
    loan: "Loan",
    prototypeIndicators: "These are prototype profile indicators, not a final government eligibility decision.",
    schemeDetailsAction: "Scheme Details",
    rulesFinance: "Rules & finance",
    documents: "Documents",
    applicationGuidance: "Application guidance",
    channelPartnersAction: "Channel Partners",
    listedAgencies: "Listed agencies",
    emiCalculatorAction: "EMI Calculator",
    estimateRepayment: "Estimate repayment",
    topAIScores: "Top AI scores",
    fromMLModel: "From ML model",
    noSchemeSelected: "No scheme selected",
    runRecommendationFirst: "Run a recommendation first.",
    detailsUnavailable: "Scheme details unavailable",
    recommendationWas: "The recommendation was",
    dataCouldNotLoad: "but its scheme data could not be loaded.",
    makeSureData: "Please make sure data.js is loaded before app.js.",
    incomeLimit: "Income limit",
    maximumProjectCost: "Maximum project cost",
    maximumLoan: "Maximum loan",
    interestRateLabel: "Interest rate",
    repayment: "Repayment",
    moratorium: "Moratorium",
    channelApplication: "Channel & application",
    channelPartnersLabel: "Channel partners:",
    applicationMode: "Application mode:",
    educationRequirement: "Education requirement:",
    requiredDocuments: "Required documents",
    documentChecklist: "Document checklist",
    noDocumentData: "No document data available.",
    howToApply: "How to apply",
    reviewRecommended: "Review the recommended scheme and confirm that the purpose, cost and loan requirement match.",
    keepDocuments: "Keep the required documents ready according to the authorized channel partner.",
    useOfficialRoute: "Use the official application route shown for the scheme, where applicable.",
    confirmFinal: "Confirm final eligibility, sanction, interest and repayment terms with the authorized channel partner.",
    important: "Important",
    officialEligibility: "NSFDC eligibility and sanction are ultimately subject to official criteria and the authorized channelizing agency. This prototype is a scheme-discovery aid.",
    source: "Source:",
    sourceText: "NSFDC master database included in this repository. Always verify final eligibility and current terms with NSFDC or an authorized channel partner.",
    repositoryNotice: "The repository database currently contains listed channel partners. Confirm scheme support before applying.",
    directions: "Directions ↗",
    noPartners: "No channel partners loaded",
    partnerDataComing: "Partner data will be connected by the backend/partner module.",
    documentNotice: "Document uploading is not included in this prototype. This page provides guidance only.",
    selectedScheme: "Selected scheme",
    directApplication: "Direct individual application:",
    tracking: "Tracking:",
    applicationGuidanceAvailable: "Application guidance is available through the authorized channel partner.",
    monthlyEMI: "Monthly EMI",
    totalInterest: "Total Interest",
    totalPayment: "Total Payment",
    notSpecified: "Not specified", currentListedPartner: "CURRENT LISTED PARTNER", asApplicable: "AS APPLICABLE", stateChannelAgency: "State Channelizing Agency (SCA)", regionalRuralBank: "Regional Rural Bank (RRB)", publicSectorBank: "Public Sector Bank (PSB)", cooperativeBank: "Cooperative Bank", smallFinanceBank: "Small Finance Bank (SFB)",

    // Scheme names
    mfsName: "Micro Finance Scheme (MFS)",
    amyName: "Aajeevika Micro-Finance Yojana (AMY)",
    termLoanName: "Term Loan",
    unyName: "Udyam Nidhi Yojana (UNY)",
    elsName: "Educational Loan Scheme (ELS)"
  },

  hi: {
    pageTitle: "NitiNexus – AI योजना सहायक",
    verifiedData: "सत्यापित डेटा",
    heroBadge: "AI-संचालित योजना खोज",
    heroTitle: 'अपने लिए सही <span>सरकारी योजना</span> खोजें।',
    heroDescription: "अपनी जरूरतों के बारे में NitiNexus को सरल चरणों में बताएं। हमारा AI आपकी आवश्यकताओं का विश्लेषण करके सत्यापित सरकारी योजना जानकारी के आधार पर उपयुक्त NSFDC योजनाएं खोजता है।",
    startAIButton: "<span>AI सहायक शुरू करें</span><strong>→</strong>",
    exploreSchemes: "योजनाएं देखें",
    aiPowered: "AI-संचालित",
    verifiedSchemeData: "सत्यापित योजना डेटा",
    simpleQuestions: "सरल प्रश्न",
    recommendationEngine: "सिफारिश इंजन",
    online: "ऑनलाइन",
    howCanIHelp: "मैं आपकी कैसे मदद कर सकता हूँ?",
    aiHelpText: "आपकी आवश्यकता समझने के लिए मैं कुछ प्रश्न पूछूंगा।",
    understandingRequirement: "आवश्यकता समझी जा रही है",
    analysingSchemes: "योजनाओं का विश्लेषण",
    findingBestMatch: "सबसे अच्छा मिलान खोज रहे हैं",
    education: "शिक्षा",
    business: "व्यवसाय",
    verified: "सत्यापित",
    quickStart: "त्वरित शुरुआत",
    whatLookingFor: "आप क्या खोज रहे हैं?",
    quickStartDesc: "अपनी आवश्यकता से मेल खाने वाला क्षेत्र चुनें।",
    startBusiness: "व्यवसाय शुरू करें",
    startBusinessDesc: "आय अर्जित करने वाली गतिविधियों के लिए उपयुक्त वित्तीय विकल्प खोजें।",
    educationDesc: "पात्र पाठ्यक्रमों के लिए शिक्षा ऋण सहायता देखें।",
    dairyLivestock: "डेयरी / पशुधन",
    dairyLivestockDesc: "कृषि और संबद्ध गतिविधियों के लिए वित्तीय विकल्प देखें।",
    existingBusiness: "मौजूदा व्यवसाय",
    existingBusinessDesc: "अपनी परियोजना की आवश्यकताएं साझा करें और उपयुक्त विकल्प खोजें।",
    howNitiNexusWorks: "NITINEXUS कैसे काम करता है",
    fromRequirementToScheme: "आपकी आवश्यकता से उपयुक्त योजना तक",
    simpleJourney: "लाभार्थियों के लिए बनाया गया सरल AI-सहायित अनुभव।",
    tellNeed: "अपनी आवश्यकता बताएं",
    tellNeedDesc: "अपने उद्देश्य, आय और आवश्यकता के बारे में सरल प्रश्नों के उत्तर दें।",
    aiAnalyses: "AI विश्लेषण करता है",
    aiAnalysesDesc: "NLP आपके उत्तरों को समझता है और ML मॉडल योजना की उपयुक्तता की गणना करता है।",
    getMatch: "अपना मिलान पाएं",
    getMatchDesc: "उपयुक्त योजनाएं, कारण, पात्रता जानकारी और अगले चरण देखें।",
    verifiedSchemeInfo: "सत्यापित योजना जानकारी के साथ बनाया गया",
    verifiedSchemeInfoDesc: "NitiNexus इस SIH प्रोटोटाइप के लिए सत्यापित NSFDC योजना जानकारी का उपयोग करता है। अंतिम पात्रता, सत्यापन और स्वीकृति अधिकृत चैनल पार्टनर तथा लागू दिशानिर्देशों के अधीन हैं।",
    questionCount: "प्रश्न",
    aiAssistant: "AI सहायक",
    nitiNexusAI: "NitiNexus AI",
    personalisedDiscovery: "व्यक्तिगत योजना खोज",
    active: "सक्रिय",
    privacyNote: "आपके उत्तरों का उपयोग केवल इस प्रोटोटाइप के लिए योजना सिफारिश अनुरोध तैयार करने में किया जाता है।",
    analysisComplete: "AI विश्लेषण पूरा",
    yourSchemeMatches: "आपके लिए उपयुक्त योजनाएं",
    basedOnInfo: "आपके द्वारा दी गई जानकारी के आधार पर।",
    verifiedInformation: "सत्यापित जानकारी",
    schemeDetails: "योजना विवरण",
    understandScheme: "आवेदन करने से पहले योजना को समझें।",
    financialPlanning: "वित्तीय योजना",
    emiCalculator: "EMI कैलकुलेटर",
    estimateMonthlyRepayment: "अपनी मासिक किस्त का अनुमान लगाएं।",
    planRepayment: "अपनी पुनर्भुगतान योजना बनाएं",
    enterLoanDetails: "EMI का अनुमान लगाने के लिए ऋण विवरण दर्ज करें।",
    loanAmount: "ऋण राशि (₹)",
    interestRate: "ब्याज दर (% प्रति वर्ष)",
    loanTenure: "ऋण अवधि (वर्ष)",
    calculateEMIButton: "EMI की गणना करें <span>→</span>",
    emiDisclaimer: "* EMI की गणना अनुमानित है। वास्तविक स्वीकृत राशि, ब्याज दर और पुनर्भुगतान की शर्तें लागू योजना तथा अधिकृत चैनल पार्टनर के अधीन हैं।",
    applicationSupport: "आवेदन सहायता",
    channelPartners: "चैनल पार्टनर",
    findAuthorizedPartner: "सहायता के लिए अधिकृत चैनल पार्टनर खोजें।",
    findSupport: "अपने पास सहायता खोजें",
    explorePartners: "सूचीबद्ध अधिकृत चैनल पार्टनर और उनकी उपलब्ध संपर्क/स्थान जानकारी देखें।",
    documentsApplication: "दस्तावेज़ और आवेदन",
    documentsSubtitle: "अधिकृत चैनल पार्टनर से संपर्क करने से पहले आवश्यक दस्तावेज़ों के बारे में जानें।",
    prepareBeforeApply: "आवेदन से पहले तैयारी करें",
    reviewDocuments: "अपनी चयनित योजना के लिए आवश्यक दस्तावेज़ और आवेदन मार्गदर्शन देखें।",
    home: "होम", schemes: "योजनाएं", calculator: "कैलकुलेटर", help: "सहायता", aiSchemeAssistant: "AI योजना सहायक",
    footerText: "SIH प्रोटोटाइप • योजना जानकारी सत्यापित सरकारी स्रोतों पर आधारित है।",
    q_sc_title: "क्या आप अनुसूचित जाति (SC) श्रेणी से संबंधित हैं?",
    q_sc_help: "इस प्रोटोटाइप की NSFDC योजनाएं पात्र SC लाभार्थियों और छात्रों के लिए हैं।",
    q_income_title: "आपकी अनुमानित वार्षिक पारिवारिक आय कितनी है?",
    q_income_help: "कुल वार्षिक पारिवारिक आय दर्ज करें। उदाहरण: ₹1.5 लाख।",
    q_purpose_title: "आपको वित्तीय सहायता किस उद्देश्य के लिए चाहिए?",
    q_purpose_help: "अपनी आवश्यकता से सबसे अधिक मेल खाने वाला उद्देश्य चुनें।",
    q_activity_title: "आप कौन-सी गतिविधि या व्यवसाय शुरू करने की योजना बना रहे हैं?",
    q_activity_help: "सबसे उपयुक्त गतिविधि चुनें।",
    q_activity_other_title: "हमें व्यवसाय की गतिविधि बताएं।",
    q_activity_other_help: "गतिविधि कुछ शब्दों में दर्ज करें।",
    q_project_business_title: "अनुमानित परियोजना लागत कितनी है?",
    q_project_business_help: "उदाहरण: ₹2 लाख।",
    q_loan_business_title: "आपको कितने ऋण की आवश्यकता है?",
    q_loan_business_help: "उधार लेने वाली अनुमानित राशि दर्ज करें।",
    q_location_business_title: "गतिविधि कहाँ स्थित होगी?",
    q_location_business_help: "चुनें कि गतिविधि शहरी या ग्रामीण क्षेत्र में होगी।",
    q_education_level_title: "आपका वर्तमान शिक्षा स्तर क्या है?",
    q_education_level_help: "अपना उच्चतम/वर्तमान स्तर चुनें।",
    q_course_title: "आप कौन-सा पाठ्यक्रम करना चाहते हैं?",
    q_course_help: "सबसे उपयुक्त पाठ्यक्रम श्रेणी चुनें।",
    q_course_type_title: "यह किस प्रकार का पाठ्यक्रम है?",
    q_course_type_help: "पाठ्यक्रम का सबसे उपयुक्त प्रकार चुनें।",
    q_course_recognized_title: "क्या पाठ्यक्रम/संस्थान आवश्यकतानुसार मान्यता प्राप्त है?",
    q_course_recognized_help: "केवल तभी हाँ चुनें जब आपने पाठ्यक्रम/संस्थान की मान्यता सत्यापित कर ली हो।",
    q_project_education_title: "कुल अनुमानित शिक्षा लागत कितनी है?",
    q_project_education_help: "अपेक्षित अध्ययन खर्च शामिल करें। उदाहरण: ₹8 लाख।",
    q_loan_education_title: "आपको कितने शिक्षा ऋण की आवश्यकता है?",
    q_loan_education_help: "उधार लेने वाली अनुमानित राशि दर्ज करें।",
    q_location_education_title: "आप वर्तमान में कहाँ रहते हैं?",
    q_location_education_help: "स्थान श्रेणी चुनें।",
    yes: "हाँ", no: "नहीं", continue: "जारी रखें", question: "प्रश्न", typeAnswer: "अपना उत्तर दर्ज करें", emiAmountPlaceholder: "उदाहरण: 500000", emiRatePlaceholder: "उदाहरण: 8", emiYearsPlaceholder: "उदाहरण: 3",
    analysingProfile: "आपकी प्रोफ़ाइल का विश्लेषण किया जा रहा है...", sendingAnswers: "आपके उत्तर AI सिफारिश प्रणाली को भेजे जा रहे हैं।",
    couldNotConnect: "AI बैकएंड से कनेक्ट नहीं हो सका", check: "जाँचें:",
    flaskRunning: "Flask API http://127.0.0.1:5000 पर चल रहा है", modelExists: "मॉडल फ़ाइल models/scheme_recommender.pkl पर मौजूद है", frontendRunning: "फ्रंटएंड frontend फ़ोल्डर से चल रहा है।", tryAgain: "फिर प्रयास करें",
    noRecommendation: "कोई सिफारिश उपलब्ध नहीं है", recommendedByML: "ML मॉडल द्वारा अनुशंसित।", noEligible: "मॉडल द्वारा कोई पात्र योजना नहीं मिली।", reviewAnswers: "उत्तर देखें", finalEligibility: "अपने उत्तरों की समीक्षा करें या अंतिम पात्रता के लिए अधिकृत चैनल पार्टनर से संपर्क करें।",
    bestMatch: "सबसे अच्छा मिलान", aiConfidence: "AI विश्वास स्तर", profileConsidered: "प्रोफ़ाइल में शामिल जानकारी", sc: "SC", income: "आय", purpose: "उद्देश्य", cost: "लागत", loan: "ऋण",
    prototypeIndicators: "ये प्रोटोटाइप प्रोफ़ाइल संकेतक हैं, अंतिम सरकारी पात्रता निर्णय नहीं।", schemeDetailsAction: "योजना विवरण", rulesFinance: "नियम और वित्त", documents: "दस्तावेज़", applicationGuidance: "आवेदन मार्गदर्शन",
    channelPartnersAction: "चैनल पार्टनर", listedAgencies: "सूचीबद्ध एजेंसियां", emiCalculatorAction: "EMI कैलकुलेटर", estimateRepayment: "पुनर्भुगतान का अनुमान",
    topAIScores: "शीर्ष AI स्कोर", fromMLModel: "ML मॉडल से", noSchemeSelected: "कोई योजना चयनित नहीं", runRecommendationFirst: "पहले सिफारिश चलाएं।", detailsUnavailable: "योजना विवरण उपलब्ध नहीं है",
    recommendationWas: "सिफारिश थी", dataCouldNotLoad: "लेकिन इसकी योजना जानकारी लोड नहीं हो सकी।", makeSureData: "कृपया सुनिश्चित करें कि data.js, app.js से पहले लोड हो रहा है।",
    incomeLimit: "आय सीमा", maximumProjectCost: "अधिकतम परियोजना लागत", maximumLoan: "अधिकतम ऋण", interestRateLabel: "ब्याज दर", repayment: "पुनर्भुगतान", moratorium: "स्थगन अवधि",
    channelApplication: "चैनल और आवेदन", channelPartnersLabel: "चैनल पार्टनर:", applicationMode: "आवेदन का तरीका:", educationRequirement: "शिक्षा आवश्यकता:", requiredDocuments: "आवश्यक दस्तावेज़", documentChecklist: "दस्तावेज़ सूची", noDocumentData: "दस्तावेज़ की जानकारी उपलब्ध नहीं है।", howToApply: "आवेदन कैसे करें",
    reviewRecommended: "अनुशंसित योजना की समीक्षा करें और उद्देश्य, लागत तथा ऋण आवश्यकता का मिलान सुनिश्चित करें।", keepDocuments: "अधिकृत चैनल पार्टनर के अनुसार आवश्यक दस्तावेज़ तैयार रखें।", useOfficialRoute: "जहाँ लागू हो, योजना के लिए दिखाए गए आधिकारिक आवेदन मार्ग का उपयोग करें।", confirmFinal: "अधिकृत चैनल पार्टनर से अंतिम पात्रता, स्वीकृति, ब्याज और पुनर्भुगतान शर्तों की पुष्टि करें।",
    important: "महत्वपूर्ण", officialEligibility: "NSFDC पात्रता और स्वीकृति आधिकारिक मानदंड तथा अधिकृत चैनलाइजिंग एजेंसी के अधीन हैं। यह प्रोटोटाइप योजना खोजने में सहायता करता है।",
    source: "स्रोत:", sourceText: "इस रिपॉजिटरी में शामिल NSFDC मास्टर डेटाबेस। अंतिम पात्रता और वर्तमान शर्तों की पुष्टि हमेशा NSFDC या अधिकृत चैनल पार्टनर से करें।",
    repositoryNotice: "रिपॉजिटरी डेटाबेस में वर्तमान सूचीबद्ध चैनल पार्टनर शामिल हैं। आवेदन से पहले योजना समर्थन की पुष्टि करें।", directions: "दिशा-निर्देश ↗",
    noPartners: "कोई चैनल पार्टनर लोड नहीं हुआ", partnerDataComing: "पार्टनर डेटा बैकएंड/पार्टनर मॉड्यूल से जोड़ा जाएगा।", documentNotice: "इस प्रोटोटाइप में दस्तावेज़ अपलोड करना शामिल नहीं है। यह पृष्ठ केवल मार्गदर्शन देता है।",
    selectedScheme: "चयनित योजना", directApplication: "प्रत्यक्ष व्यक्तिगत आवेदन:", tracking: "ट्रैकिंग:", applicationGuidanceAvailable: "आवेदन मार्गदर्शन अधिकृत चैनल पार्टनर के माध्यम से उपलब्ध है।",
    monthlyEMI: "मासिक EMI", totalInterest: "कुल ब्याज", totalPayment: "कुल भुगतान", notSpecified: "निर्दिष्ट नहीं", currentListedPartner: "वर्तमान सूचीबद्ध पार्टनर", asApplicable: "जहाँ लागू हो", stateChannelAgency: "राज्य चैनलाइजिंग एजेंसी (SCA)", regionalRuralBank: "क्षेत्रीय ग्रामीण बैंक (RRB)", publicSectorBank: "सार्वजनिक क्षेत्र का बैंक (PSB)", cooperativeBank: "सहकारी बैंक", smallFinanceBank: "लघु वित्त बैंक (SFB)",
    mfsName: "माइक्रो फाइनेंस योजना (MFS)", amyName: "आजीविका माइक्रो-फाइनेंस योजना (AMY)", termLoanName: "टर्म लोन", unyName: "उद्यम निधि योजना (UNY)", elsName: "शैक्षिक ऋण योजना (ELS)"
  },

  mr: {
    pageTitle: "NitiNexus – AI योजना सहाय्यक",
    verifiedData: "सत्यापित डेटा",
    heroBadge: "AI-आधारित योजना शोध",
    heroTitle: 'तुमच्यासाठी योग्य <span>सरकारी योजना</span> शोधा.',
    heroDescription: "तुमच्या गरजा सोप्या टप्प्यांमध्ये NitiNexus ला सांगा. आमचा AI तुमच्या गरजांचे विश्लेषण करून सत्यापित सरकारी योजना माहितीच्या आधारे योग्य NSFDC योजना शोधतो.",
    startAIButton: "<span>AI सहाय्यक सुरू करा</span><strong>→</strong>",
    exploreSchemes: "योजना पहा",
    aiPowered: "AI-आधारित",
    verifiedSchemeData: "सत्यापित योजना डेटा",
    simpleQuestions: "सोपे प्रश्न",
    recommendationEngine: "शिफारस प्रणाली",
    online: "ऑनलाइन",
    howCanIHelp: "मी तुमची कशी मदत करू?",
    aiHelpText: "तुमची गरज समजून घेण्यासाठी मी काही प्रश्न विचारेन.",
    understandingRequirement: "गरज समजून घेतली जात आहे",
    analysingSchemes: "योजनांचे विश्लेषण",
    findingBestMatch: "सर्वोत्तम जुळणी शोधत आहे",
    education: "शिक्षण",
    business: "व्यवसाय",
    verified: "सत्यापित",
    quickStart: "जलद सुरुवात",
    whatLookingFor: "तुम्ही काय शोधत आहात?",
    quickStartDesc: "तुमच्या गरजेशी जुळणारे क्षेत्र निवडा.",
    startBusiness: "व्यवसाय सुरू करा",
    startBusinessDesc: "उत्पन्न निर्माण करणाऱ्या उपक्रमांसाठी योग्य आर्थिक पर्याय शोधा.",
    educationDesc: "पात्र अभ्यासक्रमांसाठी शैक्षणिक कर्ज सहाय्य पहा.",
    dairyLivestock: "दुग्धव्यवसाय / पशुधन",
    dairyLivestockDesc: "कृषी आणि संबंधित उपक्रमांसाठी आर्थिक पर्याय पहा.",
    existingBusiness: "विद्यमान व्यवसाय",
    existingBusinessDesc: "तुमच्या प्रकल्पाच्या गरजा सांगा आणि योग्य पर्याय शोधा.",
    howNitiNexusWorks: "NITINEXUS कसे कार्य करते",
    fromRequirementToScheme: "तुमच्या गरजेपासून योग्य योजनेपर्यंत",
    simpleJourney: "लाभार्थ्यांसाठी तयार केलेला सोपा AI-सहाय्यित अनुभव.",
    tellNeed: "तुमची गरज सांगा",
    tellNeedDesc: "तुमचा उद्देश, उत्पन्न आणि गरज याबद्दल सोप्या प्रश्नांची उत्तरे द्या.",
    aiAnalyses: "AI विश्लेषण करते",
    aiAnalysesDesc: "NLP तुमची उत्तरे समजून घेते आणि ML मॉडेल योजनेची उपयुक्तता मोजते.",
    getMatch: "तुमची जुळणी मिळवा",
    getMatchDesc: "योग्य योजना, कारणे, पात्रता माहिती आणि पुढील टप्पे पहा.",
    verifiedSchemeInfo: "सत्यापित योजना माहितीवर आधारित",
    verifiedSchemeInfoDesc: "NitiNexus या SIH प्रोटोटाइपसाठी सत्यापित NSFDC योजना माहिती वापरते. अंतिम पात्रता, पडताळणी आणि मंजुरी अधिकृत Channel Partner व लागू मार्गदर्शक तत्त्वांनुसार ठरते.",
    questionCount: "प्रश्न", aiAssistant: "AI सहाय्यक", nitiNexusAI: "NitiNexus AI", personalisedDiscovery: "वैयक्तिक योजना शोध", active: "सक्रिय",
    privacyNote: "या प्रोटोटाइपसाठी तुमची योजना शिफारस विनंती तयार करण्यासाठीच तुमच्या उत्तरांचा वापर केला जातो.",
    analysisComplete: "AI विश्लेषण पूर्ण", yourSchemeMatches: "तुमच्यासाठी योग्य योजना", basedOnInfo: "तुम्ही दिलेल्या माहितीच्या आधारे.",
    verifiedInformation: "सत्यापित माहिती", schemeDetails: "योजना तपशील", understandScheme: "अर्ज करण्यापूर्वी योजना समजून घ्या.",
    financialPlanning: "आर्थिक नियोजन", emiCalculator: "EMI कॅल्क्युलेटर", estimateMonthlyRepayment: "तुमच्या मासिक परतफेडीचा अंदाज घ्या.",
    planRepayment: "परतफेडीचे नियोजन करा", enterLoanDetails: "EMI चा अंदाज घेण्यासाठी कर्जाचा तपशील भरा.", loanAmount: "कर्जाची रक्कम (₹)", interestRate: "व्याजदर (% वार्षिक)", loanTenure: "कर्जाचा कालावधी (वर्षे)", calculateEMIButton: "EMI मोजा <span>→</span>",
    emiDisclaimer: "* EMI ची गणना अंदाजे आहे. प्रत्यक्ष मंजूर रक्कम, व्याजदर आणि परतफेडीच्या अटी लागू योजना व अधिकृत Channel Partner यांच्या अधीन आहेत.",
    applicationSupport: "अर्ज सहाय्य", channelPartners: "Channel Partners", findAuthorizedPartner: "मदतीसाठी अधिकृत Channel Partner शोधा.", findSupport: "तुमच्या जवळील मदत शोधा", explorePartners: "सूचीबद्ध अधिकृत Channel Partners आणि त्यांची उपलब्ध संपर्क/स्थान माहिती पहा.",
    documentsApplication: "कागदपत्रे आणि अर्ज", documentsSubtitle: "अधिकृत Channel Partner शी संपर्क करण्यापूर्वी आवश्यक कागदपत्रांबद्दल जाणून घ्या.", prepareBeforeApply: "अर्ज करण्यापूर्वी तयारी करा", reviewDocuments: "तुमच्या निवडलेल्या योजनेसाठी आवश्यक कागदपत्रे आणि अर्ज मार्गदर्शन पहा.",
    home: "मुख्यपृष्ठ", schemes: "योजना", calculator: "कॅल्क्युलेटर", help: "मदत", aiSchemeAssistant: "AI योजना सहाय्यक", footerText: "SIH प्रोटोटाइप • योजना माहिती सत्यापित सरकारी स्रोतांवर आधारित आहे.",
    q_sc_title: "तुम्ही अनुसूचित जाती (SC) प्रवर्गातील आहात का?", q_sc_help: "या प्रोटोटाइपमधील NSFDC योजना पात्र SC लाभार्थी आणि विद्यार्थ्यांसाठी आहेत.",
    q_income_title: "तुमचे अंदाजे वार्षिक कौटुंबिक उत्पन्न किती आहे?", q_income_help: "एकूण वार्षिक कौटुंबिक उत्पन्न भरा. उदाहरण: ₹1.5 लाख.",
    q_purpose_title: "तुम्हाला आर्थिक सहाय्य कोणत्या कारणासाठी हवे आहे?", q_purpose_help: "तुमच्या गरजेशी सर्वाधिक जुळणारा उद्देश निवडा.",
    q_activity_title: "तुम्ही कोणता उपक्रम किंवा व्यवसाय सुरू करण्याचा विचार करत आहात?", q_activity_help: "सर्वात जवळचा उपक्रम निवडा.",
    q_activity_other_title: "व्यवसायाचा उपक्रम सांगा.", q_activity_other_help: "उपक्रम काही शब्दांत लिहा.",
    q_project_business_title: "अंदाजे प्रकल्प खर्च किती आहे?", q_project_business_help: "उदाहरण: ₹2 लाख.", q_loan_business_title: "तुम्हाला किती कर्ज हवे आहे?", q_loan_business_help: "तुम्हाला घ्यायची अंदाजे कर्जरक्कम भरा.",
    q_location_business_title: "उपक्रम कुठे असेल?", q_location_business_help: "उपक्रम शहरी की ग्रामीण भागात असेल ते निवडा.",
    q_education_level_title: "तुमची सध्याची शैक्षणिक पातळी काय आहे?", q_education_level_help: "तुमची सर्वोच्च/सध्याची पातळी निवडा.",
    q_course_title: "तुम्हाला कोणता अभ्यासक्रम करायचा आहे?", q_course_help: "सर्वात योग्य अभ्यासक्रम श्रेणी निवडा.", q_course_type_title: "हा कोणत्या प्रकारचा अभ्यासक्रम आहे?", q_course_type_help: "अभ्यासक्रमाचे सर्वात योग्य स्वरूप निवडा.",
    q_course_recognized_title: "अभ्यासक्रम/संस्थेला आवश्यक मान्यता आहे का?", q_course_recognized_help: "अभ्यासक्रम/संस्थेची मान्यता तपासली असल्यासच होय निवडा.",
    q_project_education_title: "एकूण अंदाजे शिक्षण खर्च किती आहे?", q_project_education_help: "अपेक्षित शिक्षण खर्च समाविष्ट करा. उदाहरण: ₹8 लाख.", q_loan_education_title: "तुम्हाला किती शैक्षणिक कर्ज हवे आहे?", q_loan_education_help: "तुम्हाला घ्यायची अंदाजे कर्जरक्कम भरा.",
    q_location_education_title: "तुम्ही सध्या कुठे आहात?", q_location_education_help: "स्थान श्रेणी निवडा.",
    yes: "होय", no: "नाही", continue: "पुढे जा", emiAmountPlaceholder: "उदाहरण: 500000", emiRatePlaceholder: "उदाहरण: 8", emiYearsPlaceholder: "उदाहरण: 3", question: "प्रश्न", typeAnswer: "तुमचे उत्तर लिहा",
    analysingProfile: "तुमच्या प्रोफाइलचे विश्लेषण केले जात आहे...", sendingAnswers: "तुमची उत्तरे AI शिफारस प्रणालीकडे पाठवली जात आहेत.", couldNotConnect: "AI बॅकएंडशी कनेक्ट होऊ शकले नाही", check: "तपासा:", flaskRunning: "Flask API http://127.0.0.1:5000 वर चालू आहे", modelExists: "मॉडेल फाइल models/scheme_recommender.pkl येथे उपलब्ध आहे", frontendRunning: "फ्रंटएंड frontend फोल्डरमधून चालू आहे.", tryAgain: "पुन्हा प्रयत्न करा",
    noRecommendation: "शिफारस उपलब्ध नाही", recommendedByML: "ML मॉडेलद्वारे शिफारस केलेली.", noEligible: "मॉडेलने कोणतीही पात्र योजना ओळखली नाही.", reviewAnswers: "उत्तरे तपासा", finalEligibility: "तुमच्या उत्तरांचे पुनरावलोकन करा किंवा अंतिम पात्रतेसाठी अधिकृत Channel Partner शी संपर्क साधा.",
    bestMatch: "सर्वोत्तम जुळणी", aiConfidence: "AI विश्वास पातळी", profileConsidered: "विचारात घेतलेली प्रोफाइल माहिती", sc: "SC", income: "उत्पन्न", purpose: "उद्देश", cost: "खर्च", loan: "कर्ज",
    prototypeIndicators: "हे प्रोटोटाइप प्रोफाइल निर्देशक आहेत; अंतिम सरकारी पात्रता निर्णय नाही.", schemeDetailsAction: "योजना तपशील", rulesFinance: "नियम आणि वित्त", documents: "कागदपत्रे", applicationGuidance: "अर्ज मार्गदर्शन", channelPartnersAction: "Channel Partners", listedAgencies: "सूचीबद्ध संस्था", emiCalculatorAction: "EMI कॅल्क्युलेटर", estimateRepayment: "परतफेडीचा अंदाज",
    topAIScores: "AI चे सर्वोच्च स्कोअर", fromMLModel: "ML मॉडेलमधून", noSchemeSelected: "कोणतीही योजना निवडलेली नाही", runRecommendationFirst: "प्रथम शिफारस चालवा.", detailsUnavailable: "योजना तपशील उपलब्ध नाही", recommendationWas: "शिफारस होती", dataCouldNotLoad: "परंतु तिचा योजना डेटा लोड होऊ शकला नाही.", makeSureData: "कृपया data.js हे app.js च्या आधी लोड होत आहे याची खात्री करा.",
    incomeLimit: "उत्पन्न मर्यादा", maximumProjectCost: "कमाल प्रकल्प खर्च", maximumLoan: "कमाल कर्ज", interestRateLabel: "व्याजदर", repayment: "परतफेड", moratorium: "स्थगिती कालावधी", channelApplication: "Channel आणि अर्ज", channelPartnersLabel: "Channel Partners:", applicationMode: "अर्ज पद्धत:", educationRequirement: "शैक्षणिक आवश्यकता:", requiredDocuments: "आवश्यक कागदपत्रे", documentChecklist: "कागदपत्रांची यादी", noDocumentData: "कागदपत्रांचा डेटा उपलब्ध नाही.", howToApply: "अर्ज कसा करावा",
    reviewRecommended: "शिफारस केलेल्या योजनेचे पुनरावलोकन करा आणि उद्देश, खर्च व कर्जाची गरज जुळते याची खात्री करा.", keepDocuments: "अधिकृत Channel Partner नुसार आवश्यक कागदपत्रे तयार ठेवा.", useOfficialRoute: "लागू असल्यास योजनेसाठी दाखवलेला अधिकृत अर्ज मार्ग वापरा.", confirmFinal: "अधिकृत Channel Partner कडून अंतिम पात्रता, मंजुरी, व्याज आणि परतफेडीच्या अटींची खात्री करा.",
    important: "महत्त्वाचे", officialEligibility: "NSFDC पात्रता आणि मंजुरी अधिकृत निकष व अधिकृत Channelizing Agency यांच्या अधीन आहेत. हा प्रोटोटाइप योजना शोधण्यासाठी सहाय्यक आहे.",
    source: "स्रोत:", sourceText: "या रिपॉजिटरीमध्ये समाविष्ट NSFDC मास्टर डेटाबेस. अंतिम पात्रता आणि सध्याच्या अटींची नेहमी NSFDC किंवा अधिकृत Channel Partner कडून खात्री करा.", repositoryNotice: "रिपॉजिटरी डेटाबेसमध्ये सूचीबद्ध Channel Partners आहेत. अर्ज करण्यापूर्वी योजनेची उपलब्धता तपासा.", directions: "दिशा ↗",
    noPartners: "कोणतेही Channel Partners लोड झाले नाहीत", partnerDataComing: "पार्टनर डेटा बॅकएंड/पार्टनर मॉड्यूलद्वारे जोडला जाईल.", documentNotice: "या प्रोटोटाइपमध्ये कागदपत्रे अपलोड करण्याची सुविधा नाही. हे पृष्ठ फक्त मार्गदर्शनासाठी आहे.", selectedScheme: "निवडलेली योजना", directApplication: "थेट वैयक्तिक अर्ज:", tracking: "ट्रॅकिंग:", applicationGuidanceAvailable: "अधिकृत Channel Partner मार्फत अर्ज मार्गदर्शन उपलब्ध आहे.",
    monthlyEMI: "मासिक EMI", totalInterest: "एकूण व्याज", totalPayment: "एकूण देयक", notSpecified: "निर्दिष्ट नाही", currentListedPartner: "सध्याचे सूचीबद्ध पार्टनर", asApplicable: "लागू असल्यास", stateChannelAgency: "राज्य चॅनेलायझिंग एजन्सी (SCA)", regionalRuralBank: "प्रादेशिक ग्रामीण बँक (RRB)", publicSectorBank: "सार्वजनिक क्षेत्रातील बँक (PSB)", cooperativeBank: "सहकारी बँक", smallFinanceBank: "लघु वित्त बँक (SFB)",
    mfsName: "मायक्रो फायनान्स योजना (MFS)", amyName: "आजीविका मायक्रो-फायनान्स योजना (AMY)", termLoanName: "टर्म लोन", unyName: "उद्यम निधी योजना (UNY)", elsName: "शैक्षणिक कर्ज योजना (ELS)"
  }
};

let currentLanguage =
  localStorage.getItem("nitiNexusLanguage") || "en";

if (!TRANSLATIONS[currentLanguage]) {
  currentLanguage = "en";
}

function t(key, fallback = key) {
  return TRANSLATIONS[currentLanguage]?.[key] ??
         TRANSLATIONS.en?.[key] ??
         fallback;
}

function translateQuestion(q) {
  const key = q.key;
  const titleKey =
    key === "project_cost"
      ? (state.answers.purpose === "Education" ? "q_project_education_title" : "q_project_business_title")
      : key === "loan_required"
        ? (state.answers.purpose === "Education" ? "q_loan_education_title" : "q_loan_business_title")
        : `q_${key}_title`;

  const helpKey =
    key === "project_cost"
      ? (state.answers.purpose === "Education" ? "q_project_education_help" : "q_project_business_help")
      : key === "loan_required"
        ? (state.answers.purpose === "Education" ? "q_loan_education_help" : "q_loan_business_help")
        : `q_${key}_help`;

  return {
    title: t(titleKey, q.title),
    help: t(helpKey, q.help)
  };
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.title = t("pageTitle");
  const htmlKeys = new Set(["heroTitle", "startAIButton", "calculateEMIButton"]);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (htmlKeys.has(key)) {
      el.innerHTML = t(key, el.innerHTML);
    } else {
      el.textContent = t(key, el.textContent.trim());
    }
  });

  const placeholderKeys = {
    "emi-amount": "emiAmountPlaceholder",
    "emi-rate": "emiRatePlaceholder",
    "emi-years": "emiYearsPlaceholder"
  };

  Object.entries(placeholderKeys).forEach(([id, key]) => {
    const input = $(id);
    if (input) input.placeholder = t(key, input.placeholder);
  });

  const selector = $("language-selector");
  if (selector) selector.value = currentLanguage;
}

function setLanguage(language) {
  if (!TRANSLATIONS[language] || language === currentLanguage) return;

  currentLanguage = language;
  localStorage.setItem("nitiNexusLanguage", language);

  applyTranslations();

  // Re-render only the current UI. State.answers/current/result are untouched.
  const activePage = document.querySelector(".page.active")?.id?.replace("-page", "");
  if (activePage === "questionnaire") renderQuestion();
  if (activePage === "recommendation" && state.result) renderRecommendation();
  if (activePage === "details") renderDetails();
  if (activePage === "emi") {
    renderEMILabels();

    const metricLabels = [
      "monthlyEMI",
      "totalInterest",
      "totalPayment"
    ];

    document
      .querySelectorAll("#emi-result .metric span")
      .forEach((el, index) => {
        if (metricLabels[index]) {
          el.textContent = t(metricLabels[index]);
        }
      });
  }
  if (activePage === "partners") renderPartners();
  if (activePage === "documents") renderDocuments();
}


const OPTION_TRANSLATIONS = {
  en: {
    urban:"Urban", rural:"Rural", tailoring:"Tailoring", groceryShop:"Grocery Shop", poultry:"Poultry",
    fisheries:"Fisheries", repairShop:"Repair Shop", computerCentre:"Computer Centre", transport:"Transport",
    foodBusiness:"Food Business", smallManufacturing:"Small Manufacturing", serviceBusiness:"Service Business",
    other:"Other", twelfth:"12th", graduate:"Graduate", postgraduate:"Postgraduate", btech:"BTech",
    bca:"BCA", mca:"MCA", mba:"MBA", engineering:"Engineering", pharmacy:"Pharmacy", nursing:"Nursing",
    medical:"Medical", law:"Law", technical:"Technical", professional:"Professional", management:"Management"
  },
  hi: {
    urban:"शहरी", rural:"ग्रामीण", tailoring:"सिलाई", groceryShop:"किराना दुकान", poultry:"पोल्ट्री", fisheries:"मत्स्य पालन",
    repairShop:"मरम्मत की दुकान", computerCentre:"कंप्यूटर सेंटर", transport:"परिवहन", foodBusiness:"खाद्य व्यवसाय",
    smallManufacturing:"लघु विनिर्माण", serviceBusiness:"सेवा व्यवसाय", other:"अन्य", twelfth:"12वीं", graduate:"स्नातक",
    postgraduate:"स्नातकोत्तर", btech:"BTech", bca:"BCA", mca:"MCA", mba:"MBA", engineering:"इंजीनियरिंग",
    pharmacy:"फार्मेसी", nursing:"नर्सिंग", medical:"चिकित्सा", law:"कानून", technical:"तकनीकी", professional:"पेशेवर", management:"प्रबंधन"
  },
  mr: {
    urban:"शहरी", rural:"ग्रामीण", tailoring:"शिवणकाम", groceryShop:"किराणा दुकान", poultry:"कुक्कुटपालन", fisheries:"मत्स्यव्यवसाय",
    repairShop:"दुरुस्तीचे दुकान", computerCentre:"कॉम्प्युटर सेंटर", transport:"वाहतूक", foodBusiness:"खाद्य व्यवसाय",
    smallManufacturing:"लघु उत्पादन", serviceBusiness:"सेवा व्यवसाय", other:"इतर", twelfth:"१२वी", graduate:"पदवीधर",
    postgraduate:"पदव्युत्तर", btech:"BTech", bca:"BCA", mca:"MCA", mba:"MBA", engineering:"अभियांत्रिकी",
    pharmacy:"फार्मसी", nursing:"नर्सिंग", medical:"वैद्यकीय", law:"कायदा", technical:"तांत्रिक", professional:"व्यावसायिक", management:"व्यवस्थापन"
  }
};


function translateSchemeName(name) {
  const map = {
    "Micro Finance Scheme": "mfsName",
    "Micro Finance Scheme (MFS)": "mfsName",
    "Aajeevika Micro-Finance Yojana": "amyName",
    "Aajeevika Micro-Finance Yojana (AMY)": "amyName",
    "Term Loan": "termLoanName",
    "Udyam Nidhi Yojana": "unyName",
    "Udyam Nidhi Yojana (UNY)": "unyName",
    "Educational Loan Scheme": "elsName",
    "Educational Loan Scheme (ELS)": "elsName"
  };
  return map[name] ? t(map[name], name) : name;
}

function translateDisplayValue(value) {
  const map = {
    VERIFIED: "verified",
    "CURRENT LISTED PARTNER": "currentListedPartner",
    "AS APPLICABLE": "asApplicable",
    "STATE CHANNELIZING AGENCY (SCA)": "stateChannelAgency",
    "REGIONAL RURAL BANK (RRB)": "regionalRuralBank",
    "PUBLIC SECTOR BANK (PSB)": "publicSectorBank",
    "COOPERATIVE BANK": "cooperativeBank",
    "SMALL FINANCE BANK (SFB)": "smallFinanceBank"
  };
  const key = map[String(value ?? "").trim().toUpperCase()];
  return key ? t(key, value) : value;
}

function translateOption(value) {
  const keyMap = {
    Yes: "yes", No: "no", Business: "business", Education: "education",
    Urban: "urban", Rural: "rural", Tailoring: "tailoring", "Grocery Shop": "groceryShop",
    Poultry: "poultry", Fisheries: "fisheries", "Repair Shop": "repairShop",
    "Computer Centre": "computerCentre", Transport: "transport", "Food Business": "foodBusiness",
    "Small Manufacturing": "smallManufacturing", "Service Business": "serviceBusiness", Other: "other",
    "12th": "twelfth", Graduate: "graduate", Postgraduate: "postgraduate",
    BTech: "btech", BCA: "bca", MCA: "mca", MBA: "mba", Engineering: "engineering",
    Pharmacy: "pharmacy", Nursing: "nursing", Medical: "medical", Law: "law",
    Technical: "technical", Professional: "professional", Management: "management"
  };
  const k = keyMap[value];
  return k ? (OPTION_TRANSLATIONS[currentLanguage]?.[k] || OPTION_TRANSLATIONS.en[k] || value) : value;
}


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
    `${t("question")} ${state.current + 1} / ${total}`;

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
                ${escapeHtml(translateOption(option))}
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
          placeholder="${escapeAttr(t("typeAnswer"))}"
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
          ${escapeHtml(t("continue"))}
          <span>→</span>
        </button>
      `;


  $("question-content").innerHTML = `

    <div class="question-block">

      <span class="question-label">
        QUESTION ${state.current + 1}
      </span>

      <h2>
        ${escapeHtml(translateQuestion(q).title)}
      </h2>

      <p>
        ${escapeHtml(translateQuestion(q).help)}
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
        ${escapeHtml(t("analysingProfile"))}
      </h2>

      <p>
        ${escapeHtml(t("sendingAnswers"))}
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
          ${escapeHtml(t("couldNotConnect"))}
        </h2>

        <p>
          ${escapeHtml(
            error.message
          )}
        </p>

        <div class="error-help">

          <b>${escapeHtml(t("check"))}</b>

          <ol>

            <li>${escapeHtml(t("flaskRunning"))}</li>

            <li>${escapeHtml(t("modelExists"))}</li>

            <li>${escapeHtml(t("frontendRunning"))}</li>

          </ol>

        </div>

        <button
          class="primary-btn"
          onclick="submitRecommendation()"
        >
          ${escapeHtml(t("tryAgain"))}
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
        <h2>${escapeHtml(t("noRecommendation"))}</h2>
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
          ${escapeHtml(t("noEligible"))}
        </h2>

        <p>
          ${escapeHtml(t("finalEligibility"))}
        </p>

        <button
          class="secondary-btn"
          onclick="startRecommendation()"
        >
          ${escapeHtml(t("reviewAnswers"))}
        </button>

      </div>

      ${renderAlternativeScores(recs)}

    `;

    return;
  }


  const bestScheme =
    getSchemeByCode(best);


  const schemeName =
    translateSchemeName(
      bestScheme?.scheme_name ||
      getReadableSchemeName(best) ||
      best
    );


  const purpose =
    bestScheme?.purpose ||
    t("recommendedByML");


  $("recommendation-content").innerHTML = `

    <div class="best-card">

      <div class="best-top">

        <div>

          <span class="match-pill">
            ${escapeHtml(t("bestMatch"))}
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
            ${escapeHtml(t("aiConfidence"))}
          </span>

        </div>

      </div>


      <div class="why-box">

        <h3>
          ${escapeHtml(t("profileConsidered"))}
        </h3>

        <div class="tag-list">

          <span>
            ✓ ${escapeHtml(t("sc"))}:
            ${escapeHtml(
              translateOption(state.answers.sc_status || "")
            )}
          </span>

          <span>
            ✓ ${escapeHtml(t("income"))}:
            ${formatMoney(
              state.answers.income
            )}
          </span>

          <span>
            ✓ ${escapeHtml(t("purpose"))}:
            ${escapeHtml(
              translateOption(state.answers.purpose || "")
            )}
          </span>

          ${
            state.answers.project_cost
              ? `
                <span>
                  ✓ ${escapeHtml(t("cost"))}:
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
                  ✓ ${escapeHtml(t("loan"))}:
                  ${formatMoney(
                    state.answers.loan_required
                  )}
                </span>
              `
              : ""
          }

        </div>

        <small>
          ${escapeHtml(t("prototypeIndicators"))}
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
            ${escapeHtml(t("schemeDetailsAction"))}
          </b>

          <small>
            ${escapeHtml(t("rulesFinance"))}
          </small>

        </button>


        <button
          onclick="openUtility('documents')"
        >

          ▣

          <b>
            ${escapeHtml(t("documents"))}
          </b>

          <small>
            ${escapeHtml(t("applicationGuidance"))}
          </small>

        </button>


        <button
          onclick="openUtility('partners')"
        >

          ⌖

          <b>
            ${escapeHtml(t("channelPartnersAction"))}
          </b>

          <small>
            ${escapeHtml(t("listedAgencies"))}
          </small>

        </button>


        <button
          onclick="openUtility('emi')"
        >

          ▦

          <b>
            ${escapeHtml(t("emiCalculatorAction"))}
          </b>

          <small>
            ${escapeHtml(t("estimateRepayment"))}
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
          ${escapeHtml(t("topAIScores"))}
        </h3>

        <span>
          ${escapeHtml(t("fromMLModel"))}
        </span>

      </div>


      ${recs.map(
        (r, i) => {

          const scheme =
            getSchemeByCode(
              r.scheme
            );


          const name =
            translateSchemeName(
              scheme?.scheme_name ||
              getReadableSchemeName(r.scheme) ||
              r.scheme
            );


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
          ${escapeHtml(t("noSchemeSelected"))}
        </h2>

        <p>
          ${escapeHtml(t("runRecommendationFirst"))}
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
          ${escapeHtml(t("detailsUnavailable"))}
        </h2>

        <p>
          ${escapeHtml(t("recommendationWas"))}
          <b>${escapeHtml(code)}</b>,
          ${escapeHtml(t("dataCouldNotLoad"))}
        </p>

        <p>
          ${escapeHtml(t("makeSureData"))}
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
          translateSchemeName(
            scheme.scheme_name ||
            getReadableSchemeName(code) ||
            code
          )
        )}

      </h2>


      <p>

        ${escapeHtml(
          scheme.purpose ||
          t("schemeDetails")
        )}

      </p>


      <span class="verified">

        ✓

        ${escapeHtml(
          scheme.verification_status ||
          t("verified")
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
          ${escapeHtml(t("incomeLimit"))}
        </span>

        <b>
          ${escapeHtml(
            scheme.income_limit ||
            t("notSpecified")
          )}
        </b>

      </div>


      <div>

        <span>
          ${escapeHtml(t("maximumProjectCost"))}
        </span>

        <b>

          ${
            scheme.project_cost_max
              ? formatMoney(
                  scheme.project_cost_max
                )
              : t("notSpecified")
          }

        </b>

      </div>


      <div>

        <span>
          ${escapeHtml(t("maximumLoan"))}
        </span>

        <b>

          ${
            scheme.maximum_loan
              ? formatMoney(
                  scheme.maximum_loan
                )
              : t("notSpecified")
          }

        </b>

      </div>


      <div>

        <span>
          ${escapeHtml(t("interestRateLabel"))}
        </span>

        <b>

          ${formatRate(
            scheme.beneficiary_interest_rate
          )}

        </b>

      </div>


      <div>

        <span>
          ${escapeHtml(t("repayment"))}
        </span>

        <b>

          ${escapeHtml(
            scheme.repayment_period ||
            t("notSpecified")
          )}

        </b>

      </div>


      <div>

        <span>
          ${escapeHtml(t("moratorium"))}
        </span>

        <b>

          ${escapeHtml(
            scheme.moratorium ||
            t("notSpecified")
          )}

        </b>

      </div>

    </div>


    <div class="white-card">

      <h3>
        ${escapeHtml(t("channelApplication"))}
      </h3>


      <p>

        <b>
          ${escapeHtml(t("channelPartnersLabel"))}
        </b>

        ${escapeHtml(
          scheme.channel_partner_types ||
          t("notSpecified")
        )}

      </p>


      <p>

        <b>
          ${escapeHtml(t("applicationMode"))}
        </b>

        ${escapeHtml(
          scheme.application_mode ||
          t("notSpecified")
        )}

      </p>


      <p>

        <b>
          ${escapeHtml(t("educationRequirement"))}
        </b>

        ${escapeHtml(
          scheme.education_requirement ||
          t("notSpecified")
        )}

      </p>

    </div>


    <div class="white-card">

      <h3>
        ${escapeHtml(t("requiredDocuments"))}
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
                ${escapeHtml(t("noDocumentData"))}
              </li>
            `
        }

      </ul>

    </div>


    <div class="white-card">

      <h3>
        ${escapeHtml(t("applicationGuidance"))}
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

                ${escapeHtml(t("directApplication"))}
                ${escapeHtml(
                  a.direct_application ||
                  t("notSpecified")
                )}

                • ${escapeHtml(t("tracking"))}
                ${escapeHtml(
                  a.tracking ||
                  t("notSpecified")
                )}

              </small>

            </div>

          `).join("")
          : `
            <p>
              ${escapeHtml(t("applicationGuidanceAvailable"))}
            </p>
          `
      }

    </div>


    <p class="source-note">

      ${escapeHtml(t("source"))}
      ${escapeHtml(t("sourceText"))}

    </p>

  `;
}


/* =========================================================
   EMI
========================================================= */

function renderEMILabels() {

  if ($("emi-amount-label")) {

    $("emi-amount-label").textContent =
      t("loanAmount");
  }


  if ($("emi-rate-label")) {

    $("emi-rate-label").textContent =
      t("interestRate");
  }


  if ($("emi-years-label")) {

    $("emi-years-label").textContent =
      t("loanTenure");
  }


  if ($("calculate-emi-btn")) {

    $("calculate-emi-btn").innerHTML =
      t("calculateEMIButton");
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
        ${escapeHtml(t("monthlyEMI"))}
      </span>

      <b>
        ${formatMoney(
          Math.round(emi)
        )}
      </b>

    </div>


    <div class="metric">

      <span>
        ${escapeHtml(t("totalInterest"))}
      </span>

      <b>
        ${formatMoney(
          Math.round(interest)
        )}
      </b>

    </div>


    <div class="metric">

      <span>
        ${escapeHtml(t("totalPayment"))}
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

      ${escapeHtml(t("repositoryNotice"))}

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
                    translateDisplayValue(p.partner_type || "")
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
                    translateDisplayValue(p.status || "")
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

                ${escapeHtml(t("directions"))}

              </a>

            </div>

          `).join("")

          : `

            <div class="empty-result">

              <h2>
                ${escapeHtml(t("noPartners"))}
              </h2>

              <p>
                ${escapeHtml(t("partnerDataComing"))}
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

      ${escapeHtml(t("documentNotice"))}

    </div>


    ${
      scheme
        ? `

          <div class="selected-scheme">

            <span>
              ${escapeHtml(t("selectedScheme"))}
            </span>

            <b>

              ${escapeHtml(
                translateSchemeName(scheme.scheme_name)
              )}

            </b>

          </div>

        `
        : ""
    }


    <div class="white-card">

      <h3>
        ${escapeHtml(t("documentChecklist"))}
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
                ${escapeHtml(t("noDocumentData"))}
              </li>

            `
        }

      </ul>

    </div>


    <div class="white-card">

      <h3>
        ${escapeHtml(t("howToApply"))}
      </h3>


      <ol class="steps-list">

        <li>
          ${escapeHtml(t("reviewRecommended"))}
        </li>

        <li>
          ${escapeHtml(t("keepDocuments"))}
        </li>

        <li>
          ${escapeHtml(t("useOfficialRoute"))}
        </li>

        <li>
          ${escapeHtml(t("confirmFinal"))}
        </li>

      </ol>

    </div>


    <div class="official-box">

      <b>
        ${escapeHtml(t("important"))}
      </b>

      <p>

        ${escapeHtml(t("officialEligibility"))}

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


    applyTranslations();

    const languageSelector =
      $("language-selector");

    if (languageSelector) {
      languageSelector.addEventListener(
        "change",
        event => setLanguage(event.target.value)
      );
    }

    showPage("home");

  }
);