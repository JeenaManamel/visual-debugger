import openai
import json
import os
import re

# Define paths
ERROR_LOG_PATH = "C:/Users/jeena/SeleniumSetup/AutomationScript _final/AutomationScript/Results/OrderPlacementTest_results.json"
CODE_FILE_PATH = "C:/Users/jeena/SeleniumSetup/AutomationScript _final/AutomationScript/Program.cs"


client = openai.OpenAI(api_key="") 

def extract_errors():
    """
    Extract failed test step error messages and console logs from the JSON log file.
    """
    if not os.path.exists(ERROR_LOG_PATH):
        return "No error logs found."

    try:
        with open(ERROR_LOG_PATH, "r", encoding="utf-8") as file:
            data = json.load(file)
    except json.JSONDecodeError:
        return "Error: Failed to decode JSON from the error log file."

    if not data or "Steps" not in data:
        return "No failed steps found."

    # Extract errors from failed steps
    failed_steps = [
        f" **Step:** {step['StepName']}\n **Error:** {step['ErrorMessage']}\n **Console Logs:** {', '.join(step.get('ConsoleErrors', [])) if step.get('ConsoleErrors') else 'No logs'}\n"
        for step in data["Steps"] if step["Status"] == "Failed"
    ]

    return "\n".join(failed_steps) if failed_steps else "No failed steps found."


def extract_relevant_code(errors):
    """
    Extract relevant code snippets from Program.cs based on error messages.
    """
    if not os.path.exists(CODE_FILE_PATH):
        return "Test script not found."

    try:
        with open(CODE_FILE_PATH, "r", encoding="utf-8") as file:
            code_lines = file.readlines()
    except Exception as e:
        return f"Error reading code file: {e}"

    relevant_snippets = []
    
    for error in errors.split("\n"):
        match = re.search(r'Line: (\d+)', error)  # Extract line number from error message
        if match:
            line_number = int(match.group(1))
            snippet = "\n".join(code_lines[max(0, line_number-3): min(len(code_lines), line_number+3)])
            relevant_snippets.append(f"**Error:** {error}\n **Code Snippet:**\n```csharp\n{snippet}\n```\n---")
    
    return "\n".join(relevant_snippets) if relevant_snippets else "No relevant code snippets found."


def analyze_errors_with_chatgpt(errors, code_snippets):
    """
    Use ChatGPT to analyze the test automation script and error logs, and provide debugging insights.
    """
    if not errors or not code_snippets:
        return "No errors or code snippets available for analysis."

    prompt = f"""
    You are a **Senior Selenium Test Automation Engineer**. Your task is to analyze the following **Selenium automation errors** 
    and provide debugging insights.

     **Errors Encountered in Test Execution:**
    {errors}

     **Relevant Code Snippets from Program.cs:**
    {code_snippets}

     **Provide the following in your response:**
     **Root Cause Analysis** - Identify the probable reasons behind the errors.
     **Fix Recommendations** - Suggest how to modify the code to prevent these failures.
     **Best Practices** - Any improvements in wait strategies, error handling, and locators.
     **Repeated Issues** - Highlight recurring failures across multiple steps (if applicable).

    Ensure the response is structured, concise, and actionable.
    """

    try:
        response = client.chat.completions.create(
           model="//gpt-4o-mini-2024-07-18",
            messages=[
                {"role": "system", "content": "You are a Senior Selenium Tester analyzing test automation errors."},
                {"role": "user", "content": prompt}
            ] #Defines the AI's role and behavior.
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Error querying ChatGPT: {e}"


if __name__ == "__main__":
    # Step 1: Extract error logs
    extracted_errors = extract_errors()

    # Step 2: Extract relevant code snippets
    relevant_code = extract_relevant_code(extracted_errors)

    # Step 3: Analyze with ChatGPT
    analysis_result = analyze_errors_with_chatgpt(extracted_errors, relevant_code)

    # Print insights
    print("\n===== ChatGPT Selenium Test Insights =====\n")
    print(analysis_result)
