//dotnet add package Selenium.WebDriver
// dotnet add package Selenium.WebDriver.ChromeDriver
//dotnet run
//PS C:\Users\jeena\SeleniumSetup\MyConsoleApp> dotnet run
using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using SeleniumAutomationLibrary.Core;

class Program
{
    static void Main()
    {
        // Define directories for storing results
        string resultsDir = "Results";
        string historicalResultsDir = "HistoricalResults";

        ChromeOptions options = new ChromeOptions();

        // Force Selenium to use the correct ChromeDriver version
        string driverPath = @"C:\Users\jomyj\.nuget\packages\selenium.webdriver.chromedriver\133.0.6943.12600\driver\win32\";

        ChromeDriverService service = ChromeDriverService.CreateDefaultService(driverPath);
        IWebDriver driver = new ChromeDriver(service, options);
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

        try
        {
            // Initialize the results and historical results folder
            AutomationHelper.InitializeResultsFolder(resultsDir);
            AutomationHelper.InitializeResultsFolder(historicalResultsDir);

            // Execute test steps
            AutomationHelper.ExecuteStep(driver, "Navigate to Login Page", () =>
            {
                driver.Navigate().GoToUrl("http://localhost:3000/login");
                driver.Manage().Window.Maximize();
                wait.Until(ExpectedConditions.UrlContains("login"));
            });

            AutomationHelper.ExecuteStep(driver, "Enter Email", () =>
            {
                var emailField = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("input[placeholder='Email']")));
                emailField.SendKeys("jane@example.com");
            });

            AutomationHelper.ExecuteStep(driver, "Enter Password", () =>
            {
                var passwordField = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("input[type='password']")));
                passwordField.SendKeys("password456");
            });

            AutomationHelper.ExecuteStep(driver, "Click Login Button", () =>
            {
                var loginButton = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("button[type='submit']")));
                wait.Until(ExpectedConditions.ElementToBeClickable(loginButton)).Click();
            });

            AutomationHelper.ExecuteStep(driver, "Add to Cart", () =>
            {
                var addToCart = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("(//button[contains(@class, 'button mt-2')])[2]")));
                addToCart.Click();
            });

            AutomationHelper.ExecuteStep(driver, "Navigate to Cart", () =>
            {
                var cartButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//a[contains(@class, 'relative') and @href='/cart']")));
                cartButton.Click();
            });

            AutomationHelper.ExecuteStep(driver, "Proceed to Checkout", () =>
            {
                var proceedCheckout = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//button[contains(text(), 'Proceed to Checkout')]")));
                proceedCheckout.Click();
            });

            AutomationHelper.ExecuteStep(driver, "Enter First Name", () =>
            {
                var firstName = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='firstName']")));
                firstName.SendKeys("Jane");
            });

            AutomationHelper.ExecuteStep(driver, "Enter Last Name", () =>
            {
                var lastName = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='lastName']")));
                lastName.SendKeys("Smith");
            });

            /* AutomationHelper.ExecuteStep(driver, "Enter details", () =>
             {
                 var button = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("button#refresh-me")));
             driver.Navigate().Refresh();
             button.Click(); // This will fail because the reference is stale

             });
             AutomationHelper.ExecuteStep(driver, "switch to iframe", () =>
            {
            var hiddenIframe = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//iframe[@style[contains(., 'visibility: hidden')]]")));
            driver.SwitchTo().Frame(hiddenIframe);

            });*/

            AutomationHelper.ExecuteStep(driver, "Enter Email", () =>
            {
                var email = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='email']")));
                email.SendKeys("jane@example.com");
            });

            AutomationHelper.ExecuteStep(driver, "Enter Company Name", () =>
            {
                var company = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='company']")));
                company.SendKeys("Not Applicable");
            });

            AutomationHelper.ExecuteStep(driver, "Enter Address", () =>
            {
                var address = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='address']")));
                address.SendKeys("Michelsberg, Bamberg, 96049");
            });

            AutomationHelper.ExecuteStep(driver, "Select Delivery Option", () =>
            {
                var deliveryOption = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//select[@name='deliveryOption']")));
                deliveryOption.Click();
            });

            AutomationHelper.ExecuteStep(driver, "Choose Store Pickup", () =>
            {
                var storePickup = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//option[@value='Pickup']")));
                storePickup.Click();
            });

            AutomationHelper.ExecuteStep(driver, "Select Payment Method", () =>
            {
                var paymentMethod = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//select[@name='paymentMethod']")));
                paymentMethod.Click();
            });

            AutomationHelper.ExecuteStep(driver, "Choose Cash on Delivery", () =>
            {
                var cashOnDelivery = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//option[@value='CashOnDelivery']")));
                cashOnDelivery.Click();
            });

            AutomationHelper.ExecuteStep(driver, "Click Place Order", () =>
            {
                var placeOrder = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//button[text()='PlaceOrder']")));
                placeOrder.Click();

                // Handle alerts if they appear
                try
                {
                    wait.Until(ExpectedConditions.AlertIsPresent());
                    IAlert alert = driver.SwitchTo().Alert();
                    Console.WriteLine("Alert detected: " + alert.Text);
                    alert.Accept();
                    Console.WriteLine("Alert accepted.");
                }
                catch (WebDriverTimeoutException)
                {
                    Console.WriteLine("No alert appeared.");
                }
            });

            // Save test results & store historical execution
            AutomationHelper.SaveTestResults(resultsDir, "OrderPlacementTest");
        }
        catch (Exception ex)
        {
            // Save results & error details if test fails
            AutomationHelper.SaveTestResults(resultsDir, "OrderPlacementTest", ex);
            Console.WriteLine($"Test execution failed: {ex.Message}");
        }
        finally
        {
            // Quit the WebDriver
            driver.Quit();
        }
    }
}
