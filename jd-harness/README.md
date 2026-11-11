# JD Harness — TestNG + Selenium practice

Java **Maven + TestNG + Selenium** smoke against the **Stream Practice** demo at `/watch` in this repo.

## Honest model (say this in interview)

| Piece | Where it lives |
| --- | --- |
| **App under test** | Vite/React on **Vercel** (or `npm run preview` locally) at `/watch` |
| **Test harness** | This folder — runs on your laptop or Jenkins, **not** on Vercel |
| **Conviva / Mux** | Separate QoE dashboards; `/api/qoe` is only a demo JSON stand-in |
| **Appium / CTV** | Stubbed in `DriverFactory` — no real devices in this lab |
| **TestRail** | Not wired; you would map case IDs to `@Test` methods / Jenkins publish |
| **Jenkins** | Would call `mvn test -DsuiteXmlFile=testng-smoke.xml -DbaseUrl=…` |

Vercel hosts the client. TestNG drives a browser (Selenium) against that URL.

## Prerequisites

- Java 17+ (`java -version`)
- Maven 3.8+ (`mvn -version`)
- Google Chrome (Selenium Manager fetches a matching ChromeDriver)

## Run against local preview

From the **repo root** (separate terminal):

```bash
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Then from **`jd-harness/`**:

```bash
mvn test -DsuiteXmlFile=testng-smoke.xml -DbaseUrl=http://127.0.0.1:4173
```

Regression sample:

```bash
mvn test -DsuiteXmlFile=testng-regression.xml -DbaseUrl=http://127.0.0.1:4173
```

Or by TestNG group (Surefire still needs a suite XML that includes the class; prefer the XML files above for interview clarity).

## Run against deployed Vercel

After `/watch` is live on the project URL:

```bash
mvn test -DsuiteXmlFile=testng-smoke.xml -DbaseUrl=https://release-gate-lab.vercel.app
```

## Layout (page objects)

```text
jd-harness/
  pom.xml
  testng-smoke.xml
  testng-regression.xml
  src/test/java/.../
    config/TestConfig.java      # -DbaseUrl / BASE_URL
    drivers/DriverFactory.java  # Chrome + Appium stub notes
    pages/                      # HomePage, TitlePage, PlayerPage
    tests/smoke/
    tests/regression/
```

## JD vocabulary map

| JD term | In this lab |
| --- | --- |
| TestNG groups | `@Test(groups = "smoke")` / `"regression"` + suite XML |
| Selenium WebDriver | `DriverFactory.createChrome()` |
| Page-object framework | `pages/*` |
| Maven Surefire | `mvn test` |
| Jenkins + Git | CI would checkout + run the same `mvn` command |
| TestRail | Process/tooling beside the suite (not automated here) |
| Appium | Documented stub — plug in when you have a device lab |
| Conviva/Mux | Talk track + `/api/qoe` sample JSON, not UI pass/fail |
