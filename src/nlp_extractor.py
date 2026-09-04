import re


# ============================================================
# NLP EXTRACTOR
# ============================================================

def extract_money(text):

    text = text.lower()

    # Examples:
    # 3 lakh
    # 3 lakhs
    # 3.5 lakh
    # 300000
    # 3,00,000

    lakh_match = re.search(
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text
    )

    if lakh_match:
        value = float(lakh_match.group(1))
        return int(value * 100000)

    rupee_match = re.search(
        r'(?:rs\.?|₹|rupees?)\s*([\d,]+)',
        text
    )

    if rupee_match:
        return int(
            rupee_match.group(1).replace(",", "")
        )

    return None


def extract_all_money(text):

    text = text.lower()

    values = []

    # Find lakh values
    lakh_matches = re.findall(
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text
    )

    for value in lakh_matches:
        values.append(
            int(float(value) * 100000)
        )

    # Find rupee values
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

    negative_patterns = [
        "not sc",
        "non sc",
        "do not belong to sc",
        "don't belong to sc",
        "not from scheduled caste"
    ]

    for pattern in negative_patterns:
        if pattern in text:
            return "No"

    positive_patterns = [
        "sc beneficiary",
        "sc student",
        "sc category",
        "scheduled caste",
        "belong to sc",
        "from sc"
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
        "bca",
        "mca",
        "mba",
        "engineering",
        "pharmacy",
        "nursing",
        "medical",
        "law"
    ]

    business_words = [
        "business",
        "shop",
        "start",
        "tailoring",
        "poultry",
        "fisheries",
        "transport",
        "grocery",
        "repair",
        "manufacturing",
        "computer centre",
        "service"
    ]

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
        "computer": "Computer Centre",
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
        "btech": "BTech",
        "b.tech": "BTech",
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

    for keyword, course in courses.items():

        if keyword in text:
            return course

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
# MAIN EXTRACTION FUNCTION
# ============================================================

def extract_information(text):

    purpose = extract_purpose(text)

    money_values = extract_all_money(text)

    income = None
    loan_required = None
    project_cost = None

    # --------------------------------------------------------
    # Income
    # --------------------------------------------------------

    income_patterns = [
        r'income.*?(?:rs\.?|₹|rupees?)?\s*([\d,.]+)\s*(?:lakh|lakhs)?',
        r'earn.*?(?:rs\.?|₹|rupees?)?\s*([\d,.]+)\s*(?:lakh|lakhs)?',
        r'family.*?(?:rs\.?|₹|rupees?)?\s*([\d,.]+)\s*(?:lakh|lakhs)?'
    ]

    # First use explicit lakh patterns
    income_lakh = re.search(
        r'(?:income|earns?|earning|family).*?'
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text.lower()
    )

    if income_lakh:

        income = int(
            float(income_lakh.group(1))
            * 100000
        )

    # --------------------------------------------------------
    # Loan
    # --------------------------------------------------------

    loan_match = re.search(
        r'(?:loan|need|require|borrow).*?'
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text.lower()
    )

    if loan_match:

        loan_required = int(
            float(loan_match.group(1))
            * 100000
        )

    # Rupee loan
    if loan_required is None:

        loan_rupee = re.search(
            r'(?:loan|need|require|borrow).*?'
            r'(?:rs\.?|₹|rupees?)\s*([\d,]+)',
            text.lower()
        )

        if loan_rupee:

            loan_required = int(
                loan_rupee.group(1).replace(",", "")
            )

    # --------------------------------------------------------
    # If income/loan wasn't found explicitly
    # --------------------------------------------------------

    if income is None and purpose == "Business":

        if len(money_values) >= 1:
            income = money_values[0]

    if loan_required is None:

        if len(money_values) >= 2:
            loan_required = money_values[-1]

    # --------------------------------------------------------
    # Project cost
    # --------------------------------------------------------

    project_match = re.search(
        r'(?:project cost|project will cost|total cost).*?'
        r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)',
        text.lower()
    )

    if project_match:

        project_cost = int(
            float(project_match.group(1))
            * 100000
        )

    if project_cost is None:

        project_cost = loan_required

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
            else "NA"
    }

    return result


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    test_sentence = (
        "I am an SC student. My family income is "
        "3 lakh. I want to study BTech and my "
        "course fee is 8 lakh. I need a loan of 6 lakh."
    )

    print("\n==========================================")
    print("NLP TEST")
    print("==========================================")

    print("\nInput:")
    print(test_sentence)

    result = extract_information(
        test_sentence
    )

    print("\nExtracted Information:")

    for key, value in result.items():

        print(
            f"{key}: {value}"
        )