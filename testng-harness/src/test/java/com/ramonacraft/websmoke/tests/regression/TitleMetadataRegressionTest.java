package com.ramonacraft.websmoke.tests.regression;

import com.ramonacraft.websmoke.drivers.DriverFactory;
import com.ramonacraft.websmoke.pages.HomePage;
import com.ramonacraft.websmoke.pages.TitlePage;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

/**
 * One regression example — broader than smoke (metadata check), still tiny for this lab.
 */
public class TitleMetadataRegressionTest {

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

  @Test(groups = {"regression"}, description = "Title detail shows synopsis text")
  public void titleDetailShowsSynopsis() {
    TitlePage title = new HomePage(driver).open().openTitle("harbor");
    Assert.assertEquals(title.titleName(), "Harbor Line");
    Assert.assertTrue(
        title.synopsis().toLowerCase().contains("breaking story"),
        "Expected synopsis to mention breaking story");
  }
}
