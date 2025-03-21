//C: \Users\jomyj\SeleniumAutomation\MyConsoleAppfinal\MyConsoleApp\web>python -m http.server 8000
using System;
using System.IO;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Text.Json;

namespace MyConsoleApp
{
    public class ErrorHighlighter
    {
        private readonly string _logDirectory;

        public ErrorHighlighter(string logDirectory = "ErrorLogs")
        {
            _logDirectory = Path.Combine(Environment.CurrentDirectory, logDirectory);
            Directory.CreateDirectory(_logDirectory); // Ensure the directory exists

            // Clear the log file at the start of execution
            string logPath = Path.Combine(_logDirectory, "ErrorLog.txt");
            if (File.Exists(logPath))
            {
                File.WriteAllText(logPath, string.Empty); // Clear the log file
            }
        }

        public void ProcessScript(string sourceFile)
        {
            // Always clean up error markers before doing anything else
            CleanErrorMarks(sourceFile);
        }

        public void CaptureError(Exception ex, string context, string sourceFile)
        {
            string stackTrace = ex.StackTrace ?? "StackTrace not available.";
            string errorLine = ExtractErrorLine(stackTrace);
            int lineNumber = ExtractLineNumber(errorLine);

            // Log the error details to a file
            string logPath = Path.Combine(_logDirectory, "ErrorLog.txt");
            string errorDetails = $"Error: {ex.Message}\nContext: {context}\nSource: {sourceFile}\nLine: {errorLine}\nStackTrace:\n{stackTrace}";
            File.AppendAllText(logPath, errorDetails + Environment.NewLine);

            // Generate a tooltip with suggestions for the error
            string tooltip = GenerateTooltip(ex);

            // Write error metadata to a JSON file
            WriteErrorMetadata(ex, context, sourceFile, lineNumber, tooltip);

            // Highlight the error in the source file
            HighlightErrorInScript(sourceFile, errorLine, tooltip);

            // Display error in the console with red text
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"ERROR: {ex.Message}");
            Console.WriteLine($"Context: {context}");
            Console.WriteLine($"Source: {sourceFile}");
            Console.WriteLine($"Line: {errorLine}");
            Console.ResetColor(); // Reset to default console color
        }


        private string ExtractErrorLine(string stackTrace)
        {
            foreach (string line in stackTrace.Split('\n'))
            {
                if (line.Contains(".cs")) // Find the line referencing the .cs file
                {
                    return line.Trim();
                }
            }
            return "Line information not found.";
        }

        private void CleanErrorMarks(string sourceFile)
        {
            string filePath = Path.Combine(Environment.CurrentDirectory, sourceFile);

            if (!File.Exists(filePath))
            {
                Console.WriteLine($"Source file not found: {filePath}");
                return;
            }

            // Read all lines from the source file
            string[] lines = File.ReadAllLines(filePath);
            List<string> cleanedLines = new List<string>();

            // Regex patterns to identify error and suggestion markers
            string errorStartPattern = @"^\s*//\s*ERROR\s*START.*";
            string suggestionPattern = @"^\s*//\s*SUGGESTION:.*";

            foreach (string line in lines)
            {
                // Add lines that do not match the error or suggestion patterns
                if (!Regex.IsMatch(line, errorStartPattern) &&
                    !Regex.IsMatch(line, suggestionPattern))
                {
                    cleanedLines.Add(line);
                }
            }

            // Write the cleaned lines back to the source file
            File.WriteAllLines(filePath, cleanedLines);
        }

        private void HighlightErrorInScript(string sourceFile, string errorLine, string tooltip)
        {
            // First, clean existing error marks
            CleanErrorMarks(sourceFile);

            int lineNumber = AlignLineNumberToStatement(ExtractLineNumber(errorLine), sourceFile);
            string filePath = Path.Combine(Environment.CurrentDirectory, sourceFile);

            if (!File.Exists(filePath))
            {
                Console.WriteLine($"Source file not found: {filePath}");
                return;
            }

            string[] lines = File.ReadAllLines(filePath);

            // Insert separate comments for error start and suggestion
            if (lineNumber > 0 && lineNumber <= lines.Length)
            {
                List<string> updatedLines = new List<string>(lines);

                // Add error markers
                string errorStartComment = $"// ERROR START: {errorLine}";
                string suggestionComment = $"// SUGGESTION: {tooltip}";

                updatedLines.Insert(lineNumber, errorStartComment); // Add error start comment
                updatedLines.Insert(lineNumber + 1, suggestionComment); // Add suggestion comment

                File.WriteAllLines(filePath, updatedLines.ToArray()); // Write updated lines back to the file
            }
        }

        private int ExtractLineNumber(string errorLine)
        {
            // Extract the line number from the stack trace entry
            string[] parts = errorLine.Split(':');
            foreach (string part in parts)
            {
                if (part.Trim().StartsWith("line"))
                {
                    if (int.TryParse(part.Trim().Replace("line", "").Trim(), out int lineNumber))
                    {
                        return lineNumber;
                    }
                }
            }
            return -1; // Default if no line number is found
        }

        private int AlignLineNumberToStatement(int errorLineNumber, string sourceFile)
        {
            string filePath = Path.Combine(Environment.CurrentDirectory, sourceFile);
            if (!File.Exists(filePath)) return errorLineNumber;

            string[] lines = File.ReadAllLines(filePath);

            // Traverse backwards to find the start of the statement
            for (int i = errorLineNumber - 1; i >= 0; i--)
            {
                if (lines[i].Trim().EndsWith(";") || lines[i].Trim().EndsWith("{") || lines[i].Trim().EndsWith("}"))
                {
                    return i + 1; // Return the start of the statement
                }
            }

            return errorLineNumber; // Fallback to original line number
        }

        private string GenerateTooltip(Exception ex)
        {
            // Dynamically generate tooltips based on exception message
            string message = ex.Message.ToLower();
            if (message.Contains("no frame element"))
            {
                return "No such frame found. Verify the frame ID or name exists in the DOM.";
            }
            else if (message.Contains("invalid selector") || message.Contains("failed to execute 'evaluate'") || message.Contains("not a valid xpath") || message.Contains("invalid xpath"))
            {
                return "Invalid XPath or CSS selector. Check syntax and ensure it matches the DOM structure.";
            }
            else if (message.Contains("stale element"))
            {
                return "The element is no longer attached to the DOM. Refresh the element reference.";
            }
            else if (message.Contains("not interactable"))
            {
                return "The element is not interactable. Ensure it is visible and enabled.";
            }
            else if (message.Contains("timeout"))
            {
                return "Operation timed out. Ensure the element appears within the specified wait time.";
            }

            // Fallback for unknown exceptions
            return "An unexpected error occurred. Check logs for more details.";
        }



        private void WriteErrorMetadata(Exception ex, string context, string sourceFile, int lineNumber, string tooltip)
        {
            // Define the web directory path
            string webDirectory = Path.Combine(Environment.CurrentDirectory, "web");

            // Ensure the web directory exists
            Directory.CreateDirectory(webDirectory);

            // Set the path for the ErrorMetadata.json file inside the web directory
            string metadataPath = Path.Combine(webDirectory, "ErrorMetadata.json");

         
            // Clear the file if it already exists
            if (File.Exists(metadataPath))
            {
                File.WriteAllText(metadataPath, string.Empty); // Clear the file by writing an empty string
            }

            List<object> errorMetadataList = new List<object>();
            // Add the new error metadata
            var errorMetadata = new
            {
                Message = ex.Message,
                Context = context,
                SourceFile = sourceFile,
                LineNumber = lineNumber,
                Tooltip = tooltip
            };

            errorMetadataList.Add(errorMetadata);

            // Write the updated list to the file
            string metadataJson = JsonSerializer.Serialize(errorMetadataList, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(metadataPath, metadataJson);
        }



    }
}