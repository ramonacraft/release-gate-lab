package com.ramonacraft.websmoke.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/** Content detail — metadata + Play CTA. */
public class TitlePage {

  private final WebDriver driver;
  private final WebDriverWait wait;

  private final By root = By.cssSelector("[data-testid='watch-title']");
  private final By name = By.cssSelector("[data-testid='title-name']");
  private final By synopsis = By.cssSelector("[data-testid='title-synopsis']");
  private final By playButton = By.cssSelector("[data-testid='play-button']");

  public TitlePage(WebDriver driver) {
    this.driver = driver;
    this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(ExpectedConditions.visibilityOfElementLocated(root));
  }

  public String titleName() {
    return wait.until(ExpectedConditions.visibilityOfElementLocated(name)).getText();
  }

  public String synopsis() {
    return wait.until(ExpectedConditions.visibilityOfElementLocated(synopsis)).getText();
  }

  public PlayerPage play() {
    wait.until(ExpectedConditions.elementToBeClickable(playButton)).click();
    return new PlayerPage(driver);
  }
}
