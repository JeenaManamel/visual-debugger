//dotnet add package Selenium.WebDriver
// dotnet add package Selenium.WebDriver.ChromeDriver
//dotnet run
//PS C:\Users\jeena\SeleniumSetup\MyConsoleApp> dotnet run
using System;
using System.IO;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System.IO.Compression;
using MyConsoleApp;

class Program
{
    static void Main()
    {
        IWebDriver driver = new ChromeDriver();
        //initialyzing
        var errorHighlighter = new ErrorHighlighter("ErrorLogs");

        // Clear any existing error markings at the start of execution
        errorHighlighter.ProcessScript("Program.cs");
   
        try
        {
            driver.Navigate().GoToUrl("http://localhost:3000/login");
            driver.Manage().Window.Maximize();

            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

            try
            {
                IWebElement emailField = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("input[type='email']")));
                emailField.SendKeys("jane@example.com");

                IWebElement passwordField = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("input[type='password']")));
                passwordField.SendKeys("password456");

                IWebElement loginButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.CssSelector("button[type='submit']")));
                loginButton.Click();

                Console.WriteLine("Login successful!");

                IWebElement addToCart = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("(//button[contains(@class, 'button mt-2')])[2]")));
                addToCart.Click();

                IWebElement cartButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//a[contains(@class, 'relative') and @href='/cart']")));
                cartButton.Click();
   
                IWebElement proceedCheckout = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//button[contains(text(), 'Proceed to Checkout')]")));
                proceedCheckout.Click();

                driver.SwitchTo().Frame("nonExistentFrame");

                IWebElement firstName = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='firstName']")));  
                firstName.SendKeys("Jane");

                IWebElement lastName = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='lastName']")));
                lastName.SendKeys("Smith");

                

                IWebElement email = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='email']")));
                email.SendKeys("jane@example.com");

                IWebElement company = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='company']")));
                company.SendKeys("Not Applicable");

                IWebElement address = wait.Until(ExpectedConditions.ElementIsVisible(By.XPath("//input[@name='address']"))); 
                address.SendKeys("Michelsberg, Bamberg, 96049");

                IWebElement deliveryOption = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//select[@name='deliveryOption']")));
                deliveryOption.Click();

                IWebElement storePickup = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//option[@value='Pickup']")));
                storePickup.Click();

                IWebElement paymentMethod = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//select[@name='paymentMethod']")));
                paymentMethod.Click();

                IWebElement cashOnDelivery = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//option[@value='CashOnDelivery']")));
                cashOnDelivery.Click();

                IWebElement placeOrder = wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath("//button[text()='Place Order']")));
                placeOrder.Click();

                Console.WriteLine("Order placed successfully!");
            }


            catch (Exception ex)
            {
              
                errorHighlighter.CaptureError(ex, "Error in Checkout Process", "Program.cs");

                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("ERROR: Invalid action encountered. Check the log file for more details.");
                Console.ResetColor(); 
            }



        }
        finally
        {
            driver.Quit();
        }
    }
}
   
