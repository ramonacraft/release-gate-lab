package com.ramonacraft.jdharness.drivers;

import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

/**
 * Driver factory for the practice harness.
 *
 * <p>Today: Selenium Chrome for the Vercel/local web demo (Web / WebCTV-shaped path).
 *
 * <p>Appium plug-in point (not implemented here — no real CTV devices in this lab):
 * create an Appium {@code AndroidDriver}/{@code IOSDriver} session with desired capabilities
 * for Fire TV / smart TV, then return that as the {@link WebDriver}. Same page-object tests
 * can call remote-key helpers instead of click() once you add a device layer.
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
   * Stub documentation only — do not call in this lab.
   *
   * <pre>
   // DesiredCapabilities / Options for Appium server (example shape):
   // platformName = Android
   // automationName = UiAutomator2
   // deviceName = FireTV
   // appPackage / appActivity or browserName for WebCTV
   // return new AndroidDriver(new URL(appiumServerUrl), options);
   * </pre>
   */
  public static WebDriver createAppiumStub() {
    throw new UnsupportedOperationException(
        "Appium CTV sessions are stubbed for interview talk only. "
            + "Wire DriverFactory.createAppiumStub() to a real Appium server + device lab when you have one.");
  }
}
