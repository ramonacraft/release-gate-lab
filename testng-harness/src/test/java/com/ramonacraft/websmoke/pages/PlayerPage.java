package com.ramonacraft.websmoke.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/** Playback state — UI assert that Play started (demo, not a real stream). */
public class PlayerPage {

  private final WebDriverWait wait;

  private final By root = By.cssSelector("[data-testid='watch-player']");
  private final By status = By.cssSelector("[data-testid='playback-status']");
  private final By playerTitle = By.cssSelector("[data-testid='player-title']");

  public PlayerPage(WebDriver driver) {
    this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(ExpectedConditions.visibilityOfElementLocated(root));
  }

  public String playbackStatus() {
    return wait.until(ExpectedConditions.visibilityOfElementLocated(status)).getText();
  }

  public String playerTitle() {
    return wait.until(ExpectedConditions.visibilityOfElementLocated(playerTitle)).getText();
  }
}
