using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using SeleniumAutomationLibrary.Models;

namespace SeleniumAutomationLibrary.Core
{
    public static class ResultLogger
    {
        /// <summary>
        /// Saves the test results for each step with detailed metrics.
        /// </summary>
        /// <param name="directory">Directory to save the results.</param>
        /// <param name="testName">Name of the test.</param>
        /// <param name="steps">List of test steps with metrics.</param>
        public static void SaveTestResults(string directory, string testName, List<TestStepData> steps)
        {
            try
            {
                // Ensure the directory exists
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                string resultsFile = Path.Combine(directory, $"{testName}_results.json");

                // Create a structured object for test results
                var testResults = new
                {
                    TestName = testName,
                    StartTime = steps.Min(s => s.Timestamp), // Earliest step timestamp
                    EndTime = steps.Max(s => s.Timestamp), // Latest step timestamp
                    TotalDuration = steps.Sum(s => s.Duration), // Total time for all steps
                    OverallStatus = steps.All(s => s.Status == "Success") ? "Success" : "Failed",
                    Steps = steps.Select(s => new
                    {
                        s.StepName,
                        s.Timestamp,
                        s.Duration,
                        s.ScreenshotPath,
                        s.Status,
                        s.ErrorMessage,
                        TransactionTime = $"{s.Duration:0.000} seconds" // Transaction time for each step
                    })
                };

                // Serialize the results to JSON and write to a file
                File.WriteAllText(resultsFile, JsonSerializer.Serialize(testResults, new JsonSerializerOptions
                {
                    WriteIndented = true // Pretty print JSON for better readability
                }));

                Console.WriteLine($"Test results saved to: {resultsFile}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving test results: {ex.Message}");
                throw;
            }
        }
    }
}
