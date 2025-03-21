using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using OpenQA.Selenium;
using NLog;
using SeleniumAutomationLibrary.Models;

namespace SeleniumAutomationLibrary.Core
{
	public static class AutomationHelper
	{
		private static readonly Logger logger = LogManager.GetCurrentClassLogger();
		private static List<TestStepData> testSteps = new List<TestStepData>();
		private static Stopwatch overallTimer = new Stopwatch();

		/// <summary>
		/// Initializes the results folder by clearing its contents.
		/// </summary>
		public static void InitializeResultsFolder(string resultsDir)
		{
			try
			{
				if (Directory.Exists(resultsDir))
				{
					Directory.Delete(resultsDir, true); // Deletes the folder and all its contents
				}
				Directory.CreateDirectory(resultsDir); // Recreates the folder
				logger.Info($"Results directory initialized: {resultsDir}");
			}
			catch (Exception ex)
			{
				logger.Error(ex, "Failed to initialize results folder.");
				throw new InvalidOperationException("Unable to initialize the results folder.", ex);
			}
		}

		/// <summary>
		/// Executes a test step with logging, validation, and screenshot capture.
		/// </summary>
		public static void ExecuteStep(IWebDriver driver, string stepName, Action stepAction, Func<IWebDriver, bool> postValidation = null, string resultsDir = "Results")
		{
			var stepTimer = Stopwatch.StartNew();
			try
			{
				logger.Info($"Executing step: {stepName}");
				stepAction.Invoke();
				stepTimer.Stop();

				bool isValid = postValidation == null || postValidation(driver);
				var screenshotPath = ScreenshotHelper.CaptureFullScrollScreenshot(driver, $"{stepName.Replace(" ", "_")}.png", resultsDir);

				testSteps.Add(new TestStepData
				{
					StepName = stepName,
					Timestamp = DateTime.Now,
					Duration = stepTimer.Elapsed.TotalSeconds,
					ScreenshotPath = screenshotPath,
					Status = isValid ? "Success" : "Failed",
					ErrorMessage = isValid ? null : "Validation failed"
				});

				if (!isValid)
				{
					throw new Exception($"Validation failed for step: {stepName}");
				}
			}
			catch (Exception ex)
			{
				stepTimer.Stop();

				var lineNumber = new StackTrace(ex, true).GetFrame(0)?.GetFileLineNumber() ?? -1;
				var screenshotPath = ScreenshotHelper.CaptureFullScrollScreenshot(driver, $"{stepName.Replace(" ", "_")}_Error.png", resultsDir);

				testSteps.Add(new TestStepData
				{
					StepName = stepName,
					Timestamp = DateTime.Now,
					Duration = stepTimer.Elapsed.TotalSeconds,
					ScreenshotPath = screenshotPath,
					Status = "Failed",
					ErrorMessage = $"{ex.Message} (Line: {lineNumber})"
				});

				logger.Error(ex, $"Error in step '{stepName}' at line {lineNumber}: {ex.Message}");
				throw new Exception($"Error executing step: {stepName} (Line: {lineNumber})", ex);
			}
		}

		/// <summary>
		/// Saves test results to a JSON file, ensuring results are saved even on failure.
		/// </summary>
		public static void SaveTestResults(string resultsDir, string testName, Exception exception = null)
		{
			try
			{
				// Ensure overall timer is stopped before saving results
				if (overallTimer.IsRunning)
				{
					overallTimer.Stop();
				}

				string resultsFile = Path.Combine(resultsDir, $"{testName}_results.json");
				var testResults = new
				{
					TestName = testName,
					StartTime = DateTime.Now.Subtract(overallTimer.Elapsed), // Approximate test start time
					EndTime = DateTime.Now,
					TotalDuration = overallTimer.Elapsed.TotalSeconds,
					Steps = testSteps,
					OverallStatus = exception == null ? "Success" : "Failed",
					ErrorMessage = exception?.Message
				};

				File.WriteAllText(resultsFile, System.Text.Json.JsonSerializer.Serialize(testResults, new System.Text.Json.JsonSerializerOptions
				{
					WriteIndented = true
				}));

				logger.Info($"Test results saved to: {resultsFile}");
			}
			catch (Exception ex)
			{
				logger.Error(ex, "Failed to save test results.");
				throw new InvalidOperationException("Unable to save test results.", ex);
			}
		}
	}
}
