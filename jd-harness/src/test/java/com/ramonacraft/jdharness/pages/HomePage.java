package com.ramonacraft.jdharness.pages;

import com.ramonacraft.jdharness.config.TestConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/** Home / catalog rail — first stop on the smoke path. */
public class HomePage {

  private final WebDriver driver;
  private final WebDriverWait wait;

  private final By homeRoot = By.cssSelector("[data-testid='watch-home']");
  private final By brand = By.cssSelector("[data-testid='watch-brand']");

  public HomePage(WebDriver driver) {
    this.driver = driver;
    this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  }

  public HomePage open() {
    driver.get(TestConfig.baseUrl() + "/watch");
    wait.until(ExpectedConditions.visibilityOfElementLocated(homeRoot));
    return this;
  }

  public String brandText() {
    return wait.until(ExpectedConditions.visibilityOfElementLocated(brand)).getText();
  }

  public TitlePage openTitle(String titleId) {
    By card = By.cssSelector("[data-testid='title-card-" + titleId + "']");
    wait.until(ExpectedConditions.elementToBeClickable(card)).click();
    return new TitlePage(driver);
  }
}
