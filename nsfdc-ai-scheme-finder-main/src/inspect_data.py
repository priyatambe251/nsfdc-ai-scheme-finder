import pandas as pd

file_path = "data/NSFDC_Master_Database.xlsx"

excel_file = pd.ExcelFile(file_path)

print("\n==============================")
print("NSFDC MASTER DATABASE")
print("==============================")

print("\nSheets available:")

for sheet in excel_file.sheet_names:
    print("-", sheet)

print("\n==============================")
print("SHEET DETAILS")
print("==============================")

for sheet in excel_file.sheet_names:

    df = pd.read_excel(file_path, sheet_name=sheet)

    print("\n--------------------------------")
    print("SHEET:", sheet)
    print("Rows:", len(df))
    print("Columns:", len(df.columns))

    print("\nColumn names:")
    print(list(df.columns))

    print("\nFirst 3 rows:")
    print(df.head(3).to_string(index=False))
    