package com.ramonacraft.websmoke.tests.smoke;

import com.ramonacraft.websmoke.drivers.DriverFactory;
import com.ramonacraft.websmoke.pages.HomePage;
import com.ramonacraft.websmoke.pages.PlayerPage;
import com.ramonacraft.websmoke.pages.TitlePage;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

/**
 * Smoke group: short path home → title → Play.
 * Intended as a lean gate on a candidate build URL.
 */
public class PlaybackSmokeTest {

  private WebDriver driver;

  @BeforeMethod(alwaysRun = true)
  public void setUp() {
    driver = DriverFactory.createChrome();
  }

  @AfterMethod(alwaysRun = true)
  public void tearDown() {
    if (driver != null) {
      driver.quit();
    }
  }

  @Test(groups = {"smoke"}, description = "Home loads Stream Practice brand")
  public void homeShowsBrand() {
    HomePage home = new HomePage(driver).open();
    Assert.assertTrue(home.brandText().contains("Stream Practice"), "Expected Stream Practice brand on home");
  }

  @Test(groups = {"smoke"}, description = "Home → content → Play reaches Playing state")
  public void homeToPlayStartsPlayback() {
    HomePage home = new HomePage(driver).open();
    TitlePage title = home.openTitle("aurora");
    Assert.assertEquals(title.titleName(), "Aurora Night");

    PlayerPage player = title.play();
    Assert.assertEquals(player.playbackStatus(), "Playing");
    Assert.assertEquals(player.playerTitle(), "Aurora Night");
  }
}
