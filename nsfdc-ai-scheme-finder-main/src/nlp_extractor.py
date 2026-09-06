import re


# ============================================================
# MONEY EXTRACTION
# ============================================================

def extract_all_money(text):
    """
    Extract monetary values from natural language.

    Examples:
        3 lakh
        3.5 lakh
        ₹300000
        Rs. 3,00,000
        300000 rupees
    """

    text = text.lower()

    values = []

    # --------------------------------------------------------
    # Lakh values
    # --------------------------------------------------------

    lakh_matches = re.findall(
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text
    )

    for value in lakh_matches:
        values.append(
            int(float(value) * 100000)
        )

    # --------------------------------------------------------
    # Rupee values
    # --------------------------------------------------------

    rupee_matches = re.findall(
        r'(?:rs\.?|₹|rupees?)\s*([\d,]+)',
        text
    )

    for value in rupee_matches:
        values.append(
            int(value.replace(",", ""))
        )

    return values


# ============================================================
# SC STATUS
# ============================================================

def extract_sc_status(text):

    text = text.lower()

    # --------------------------------------------------------
    # NEGATIVE PATTERNS FIRST
    # --------------------------------------------------------
    # This is important.
    #
    # "I am not from the SC category"
    # must NOT become Yes just because "SC category"
    # appears in the sentence.
    # --------------------------------------------------------

    negative_patterns = [
        "not sc",
        "not from sc",
        "not from the sc",
        "not in sc",
        "do not belong to sc",
        "don't belong to sc",
        "does not belong to sc",
        "doesn't belong to sc",
        "not a sc",
        "not an sc",
        "non sc",
        "non-sc",
        "not scheduled caste",
        "not from scheduled caste",
        "do not belong to scheduled caste",
        "don't belong to scheduled caste"
    ]

    for pattern in negative_patterns:

        if pattern in text:
            return "No"

    # --------------------------------------------------------
    # POSITIVE PATTERNS
    # --------------------------------------------------------

    positive_patterns = [
        "sc beneficiary",
        "sc student",
        "sc category",
        "scheduled caste",
        "belong to sc",
        "belongs to sc",
        "from sc",
        "i am sc",
        "i'm sc",
        "i belong to sc"
    ]

    for pattern in positive_patterns:

        if pattern in text:
            return "Yes"

    return "Unknown"


# ============================================================
# PURPOSE
# ============================================================

def extract_purpose(text):

    text = text.lower()

    education_words = [
        "education",
        "study",
        "student",
        "course",
        "college",
        "university",
        "degree",
        "btech",
        "b.tech",
        "bca",
        "mca",
        "mba",
        "engineering",
        "pharmacy",
        "nursing",
        "medical",
        "medicine",
        "law"
    ]

    business_words = [
        "business",
        "shop",
        "start a business",
        "start my business",
        "tailoring",
        "poultry",
        "fisheries",
        "fishing",
        "transport",
        "grocery",
        "repair",
        "manufacturing",
        "computer centre",
        "computer center",
        "service business"
    ]

    # Education first because words like "course" and
    # "student" are strong indicators.

    for word in education_words:

        if word in text:
            return "Education"

    for word in business_words:

        if word in text:
            return "Business"

    return "Unknown"


# ============================================================
# ACTIVITY
# ============================================================

def extract_activity(text):

    text = text.lower()

    activities = {

        "tailoring": "Tailoring",

        "grocery": "Grocery Shop",

        "poultry": "Poultry",

        "fisheries": "Fisheries",

        "fishing": "Fisheries",

        "repair": "Repair Shop",

        "computer centre": "Computer Centre",

        "computer center": "Computer Centre",

        "transport": "Transport",

        "food": "Food Business",

        "manufacturing": "Small Manufacturing",

        "service": "Service Business"
    }

    for keyword, activity in activities.items():

        if keyword in text:
            return activity

    return "NA"


# ============================================================
# COURSE
# ============================================================

def extract_course(text):

    text = text.lower()

    courses = {

        "b.tech": "BTech",

        "btech": "BTech",

        "bca": "BCA",

        "mca": "MCA",

        "mba": "MBA",

        "engineering": "Engineering",

        "pharmacy": "Pharmacy",

        "nursing": "Nursing",

        "medical": "Medical",

        "medicine": "Medical",

        "law": "Law"
    }

    # Check longer/more specific terms first.

    for keyword in sorted(
        courses.keys(),
        key=len,
        reverse=True
    ):

        if keyword in text:

            return courses[keyword]

    return "NA"


# ============================================================
# COURSE TYPE
# ============================================================

def extract_course_type(text):

    text = text.lower()

    if any(
        word in text
        for word in [
            "technical",
            "btech",
            "b.tech",
            "engineering",
            "bca",
            "mca"
        ]
    ):
        return "Technical"

    if any(
        word in text
        for word in [
            "professional",
            "pharmacy",
            "nursing",
            "law",
            "medical"
        ]
    ):
        return "Professional"

    if any(
        word in text
        for word in [
            "management",
            "mba"
        ]
    ):
        return "Management"

    return "NA"


# ============================================================
# INCOME EXTRACTION
# ============================================================

def extract_income(text):

    text_lower = text.lower()

    # Explicit income + lakh
    match = re.search(
        r'(?:income|earns?|earning|family income|family earns?)'
        r'.{0,60}?'
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text_lower
    )

    if match:

        return int(
            float(match.group(1)) * 100000
        )

    # Explicit income + rupees
    match = re.search(
        r'(?:income|earns?|earning|family income|family earns?)'
        r'.{0,60}?'
        r'(?:rs\.?|₹|rupees?)\s*([\d,]+)',
        text_lower
    )

    if match:

        return int(
            match.group(1).replace(",", "")
        )

    # Example:
    # "My family earns 300000"
    match = re.search(
        r'(?:income|earns?|earning|family income|family earns?)'
        r'.{0,40}?'
        r'(\d[\d,]*)',
        text_lower
    )

    if match:

        value = int(
            match.group(1).replace(",", "")
        )

        # Avoid treating very small numbers as income.
        if value >= 10000:

            return value

    return None


# ============================================================
# LOAN EXTRACTION
# ============================================================

def extract_loan(text):

    text_lower = text.lower()

    # --------------------------------------------------------
    # Loan + lakh
    # --------------------------------------------------------

    match = re.search(
        r'(?:loan|borrow|borrowing|loan amount|loan of)'
        r'.{0,50}?'
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text_lower
    )

    if match:

        return int(
            float(match.group(1)) * 100000
        )

    # --------------------------------------------------------
    # Need/require + loan amount
    # --------------------------------------------------------

    match = re.search(
        r'(?:need|require|required|want)'
        r'.{0,40}?'
        r'(?:loan)'
        r'.{0,30}?'
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text_lower
    )

    if match:

        return int(
            float(match.group(1)) * 100000
        )

    # --------------------------------------------------------
    # Loan + rupees
    # --------------------------------------------------------

    match = re.search(
        r'(?:loan|borrow|borrowing|loan amount|loan of)'
        r'.{0,50}?'
        r'(?:rs\.?|₹|rupees?)\s*([\d,]+)',
        text_lower
    )

    if match:

        return int(
            match.group(1).replace(",", "")
        )

    return None


# ============================================================
# PROJECT COST
# ============================================================

def extract_project_cost(text):

    text_lower = text.lower()

    # Business/project cost only.
    #
    # IMPORTANT:
    # We do NOT treat an education course fee as project cost.

    match = re.search(
        r'(?:project cost|project will cost|total project cost|'
        r'business cost|business will cost)'
        r'.{0,40}?'
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text_lower
    )

    if match:

        return int(
            float(match.group(1)) * 100000
        )

    match = re.search(
        r'(?:project cost|project will cost|total project cost|'
        r'business cost|business will cost)'
        r'.{0,40}?'
        r'(?:rs\.?|₹|rupees?)\s*([\d,]+)',
        text_lower
    )

    if match:

        return int(
            match.group(1).replace(",", "")
        )

    return None


# ============================================================
# COURSE FEE
# ============================================================

def extract_course_fee(text):

    text_lower = text.lower()

    match = re.search(
        r'(?:course fee|course fees|tuition fee|tuition fees|'
        r'education fee|college fee|college fees)'
        r'.{0,30}?'
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text_lower
    )

    if match:

        return int(
            float(match.group(1)) * 100000
        )

    match = re.search(
        r'(?:course fee|course fees|tuition fee|tuition fees|'
        r'education fee|college fee|college fees)'
        r'.{0,30}?'
        r'(?:rs\.?|₹|rupees?)\s*([\d,]+)',
        text_lower
    )

    if match:

        return int(
            match.group(1).replace(",", "")
        )

    return None


# ============================================================
# LOCATION
# ============================================================

def extract_location(text):

    text_lower = text.lower()

    rural_words = [
        "rural",
        "village",
        "villager",
        "rural area",
        "village area"
    ]

    urban_words = [
        "urban",
        "city",
        "town",
        "urban area"
    ]

    for word in rural_words:

        if word in text_lower:
            return "Rural"

    for word in urban_words:

        if word in text_lower:
            return "Urban"

    # Default used by the current prototype.
    return "Urban"


# ============================================================
# MAIN INFORMATION EXTRACTION
# ============================================================

def extract_information(text):

    if not isinstance(text, str):

        text = str(text)

    purpose = extract_purpose(text)

    income = extract_income(text)

    loan_required = extract_loan(text)

    project_cost = extract_project_cost(text)

    course_fee = extract_course_fee(text)

    # --------------------------------------------------------
    # Business fallback
    # --------------------------------------------------------

    if purpose == "Business":

        if project_cost is None:

            # If the user gives only one money amount in a
            # business sentence, it can reasonably represent
            # the project/loan requirement.
            #
            # But we do NOT automatically use income here.

            money_values = extract_all_money(text)

            if len(money_values) == 1:

                project_cost = money_values[0]

                loan_required = money_values[0]

    # --------------------------------------------------------
    # Education
    # --------------------------------------------------------

    if purpose == "Education":

        # Course fee is separate from loan required.
        #
        # If user says:
        # course fee = 8 lakh
        # loan = 6 lakh
        #
        # then:
        # course_fee = 800000
        # loan_required = 600000
        #
        # project_cost is not the course fee.

        if loan_required is None:

            money_values = extract_all_money(text)

            # Try to use the last amount only when there is
            # no explicit loan amount.
            if len(money_values) >= 1:

                loan_required = money_values[-1]

        # For education, project_cost is not applicable.
        project_cost = 0

    # --------------------------------------------------------
    # Unknown purpose
    # --------------------------------------------------------

    if purpose == "Unknown":

        if project_cost is None:

            project_cost = 0

    # --------------------------------------------------------
    # Missing numeric values
    # --------------------------------------------------------

    if income is None:

        income = 0

    if loan_required is None:

        loan_required = 0

    if project_cost is None:

        project_cost = 0

    # --------------------------------------------------------
    # Build result
    # --------------------------------------------------------

    result = {

        "sc_status":
            extract_sc_status(text),

        "income":
            income,

        "purpose":
            purpose,

        "activity":
            extract_activity(text)
            if purpose == "Business"
            else "NA",

        "project_cost":
            project_cost,

        "loan_required":
            loan_required,

        "education_level":
            "NA",

        "course":
            extract_course(text)
            if purpose == "Education"
            else "NA",

        "course_type":
            extract_course_type(text)
            if purpose == "Education"
            else "NA",

        "course_recognized":
            "Yes"
            if purpose == "Education"
            else "NA",

        "location":
            extract_location(text)
    }

    return result


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    test_sentences = [

        (
            "I am an SC student. My family income is 3 lakh. "
            "I want to study BTech and my course fee is 8 lakh. "
            "I need a loan of 6 lakh."
        ),

        (
            "I am not from the SC category. "
            "My income is 2 lakh and I want a business loan."
        ),

        (
            "I belong to SC. My family earns 1.5 lakh. "
            "I want to start a tailoring business costing 1 lakh."
        ),

        (
            "I am an SC student. My BTech course fee is 8 lakh "
            "and I need a loan of 6 lakh."
        ),

        (
            "I belong to SC and want to open a grocery shop. "
            "My family income is 4 lakh."
        )
    ]

    print("\n==========================================")
    print("NSFDC NLP TEST")
    print("==========================================")

    for index, sentence in enumerate(
        test_sentences,
        start=1
    ):

        print("\n------------------------------------------")
        print(f"TEST CASE {index}")
        print("------------------------------------------")

        print("\nInput:")
        print(sentence)

        result = extract_information(sentence)

        print("\nExtracted Information:")

        for key, value in result.items():

            print(
                f"{key}: {value}"
            )