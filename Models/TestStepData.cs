#nullable enable
using System;

namespace SeleniumAutomationLibrary.Models
{
    public class TestStepData
    {
        public string StepName { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public double Duration { get; set; }
        public string ScreenshotPath { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ErrorMessage { get; set; }
    }
}
