# TestNG web smoke harness

Java **Maven + TestNG + Selenium** smoke against the **Stream Practice** demo at `/watch` in this repo.

## Where things run

| Piece | Where it lives |
| --- | --- |
| **App under test** | Vite/React on **Vercel** (or `npm run preview` locally) at `/watch` |
| **Test harness** | This folder — runs on your machine or CI, **not** on Vercel |
| **Stream-health sample** | `/api/qoe` demo JSON (optional talk track; not required for UI pass/fail) |
| **Device drivers** | Stubbed in `DriverFactory` — no real device coverage in this lab |
| **CI** | Would call `mvn test -DsuiteXmlFile=testng-smoke.xml -DbaseUrl=…` |

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

Then from **`testng-harness/`**:

```bash
mvn test -DsuiteXmlFile=testng-smoke.xml -DbaseUrl=http://127.0.0.1:4173
```

Regression sample:

```bash
mvn test -DsuiteXmlFile=testng-regression.xml -DbaseUrl=http://127.0.0.1:4173
```

## Run against deployed Vercel

After `/watch` is live on the project URL:

```bash
mvn test -DsuiteXmlFile=testng-smoke.xml -DbaseUrl=https://release-gate-lab.vercel.app
```

## Layout (page objects)

```text
testng-harness/
  pom.xml
  testng-smoke.xml
  testng-regression.xml
  src/test/java/.../
    config/TestConfig.java      # -DbaseUrl / BASE_URL
    drivers/DriverFactory.java  # Chrome + device-driver stub notes
    pages/                      # HomePage, TitlePage, PlayerPage
    tests/smoke/
    tests/regression/
```

## Stack map

| Tool | In this lab |
| --- | --- |
| TestNG groups | `@Test(groups = "smoke")` / `"regression"` + suite XML |
| Selenium WebDriver | `DriverFactory.createChrome()` |
| Page objects | `pages/*` |
| Maven Surefire | `mvn test` |
| Case management / sign-off | Process outside this suite (not automated here) |
| Device automation | Documented stub only |
| Stream-health dashboards | Separate from UI asserts; `/api/qoe` is demo JSON |
