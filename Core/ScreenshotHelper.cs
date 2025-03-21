using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading;
using OpenQA.Selenium;
using SkiaSharp;

namespace SeleniumAutomationLibrary.Core
{
    public static class ScreenshotHelper
    {
        /// <summary>
        /// Captures a full-page scrollable screenshot of the current browser window.
        /// Screenshots are saved in a specified directory.
        /// </summary>
        /// <param name="driver">The WebDriver instance.</param>
        /// <param name="fileName">The file name for the saved screenshot.</param>
        /// <param name="screenshotDir">The directory where screenshots will be saved.</param>
        /// <returns>The full path of the saved screenshot file.</returns>
        public static string CaptureFullScrollScreenshot(IWebDriver driver, string fileName, string screenshotDir)
        {
            try
            {
                // Ensure the screenshot directory exists
                if (!Directory.Exists(screenshotDir))
                {
                    Directory.CreateDirectory(screenshotDir);
                }

                // Get the total scrollable height and viewport height
                var jsExecutor = (IJavaScriptExecutor)driver;
                long totalHeight = Convert.ToInt64(jsExecutor.ExecuteScript("return document.body.scrollHeight"));
                long viewportHeight = Convert.ToInt64(jsExecutor.ExecuteScript("return window.innerHeight"));
                int scrollCount = (int)Math.Ceiling((double)totalHeight / viewportHeight);

                if (scrollCount <= 0)
                {
                    throw new InvalidOperationException("Failed to calculate scrollable area dimensions.");
                }

                List<SKBitmap> bitmaps = new List<SKBitmap>();

                for (int i = 0; i < scrollCount; i++)
                {
                    // Scroll to the current position
                    jsExecutor.ExecuteScript($"window.scrollTo(0, {i * viewportHeight});");
                    Thread.Sleep(500); // Allow time for rendering

                    // Capture the screenshot for the current viewport
                    Screenshot screenshot = ((ITakesScreenshot)driver).GetScreenshot();
                    using (var stream = new MemoryStream(screenshot.AsByteArray))
                    {
                        SKBitmap bitmap = SKBitmap.Decode(stream);
                        if (bitmap == null)
                        {
                            throw new Exception("Failed to decode the screenshot into a bitmap.");
                        }
                        bitmaps.Add(bitmap);
                    }
                }

                // Calculate total combined image dimensions
                int width = bitmaps[0].Width;
                int totalCombinedHeight = bitmaps.Sum(b => b.Height);

                // Combine the bitmaps into a single image
                using (SKBitmap combinedBitmap = new SKBitmap(width, totalCombinedHeight))
                using (SKCanvas canvas = new SKCanvas(combinedBitmap))
                {
                    int yOffset = 0;
                    foreach (var bitmap in bitmaps)
                    {
                        canvas.DrawBitmap(bitmap, 0, yOffset);
                        yOffset += bitmap.Height;
                        bitmap.Dispose(); // Dispose individual bitmaps to free memory
                    }
                    canvas.Flush();

                    // Save the combined image
                    string filePath = Path.Combine(screenshotDir, fileName);
                    using (var fileStream = File.OpenWrite(filePath))
                    {
                        combinedBitmap.Encode(fileStream, SKEncodedImageFormat.Png, 100);
                    }

                    return filePath;
                }
            }
            catch (Exception e)
            {
                throw new Exception($"Failed to capture full-page scrollshot: {e.Message}", e);
            }
        }
    }
}
