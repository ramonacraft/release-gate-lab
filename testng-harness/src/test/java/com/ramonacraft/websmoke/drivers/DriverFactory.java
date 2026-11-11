package com.ramonacraft.websmoke.drivers;

import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

/**
 * Driver factory for the practice harness.
 *
 * <p>Today: Selenium Chrome against the Vercel/local web demo.
 *
 * <p>Native device sessions (for example Appium) are not implemented here. A future
 * factory method would return an Appium driver session instead of ChromeDriver;
 * page objects would then use remote-key helpers where clicks do not apply.
 */
public final class DriverFactory {

  private DriverFactory() {}

  public static WebDriver createChrome() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless=new", "--window-size=1280,800", "--disable-gpu", "--no-sandbox");
    WebDriver driver = new ChromeDriver(options);
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    return driver;
  }

  /**
   * Placeholder only — do not call in this lab.
   */
  public static WebDriver createDeviceDriverStub() {
    throw new UnsupportedOperationException(
        "Device-driver sessions are not wired in this lab. "
            + "Add an Appium (or lab) session here when a device rack or farm is available.");
  }
}
