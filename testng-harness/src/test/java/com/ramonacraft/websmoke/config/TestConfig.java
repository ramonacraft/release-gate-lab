package com.ramonacraft.websmoke.config;

/**
 * Runtime config for the web smoke harness.
 * Pass -DbaseUrl=... from Maven/CI so the same suite hits local or Vercel.
 */
public final class TestConfig {

  private TestConfig() {}

  public static String baseUrl() {
    String fromProp = System.getProperty("baseUrl");
    if (fromProp != null && !fromProp.isBlank()) {
      return stripTrailingSlash(fromProp.trim());
    }
    String fromEnv = System.getenv("BASE_URL");
    if (fromEnv != null && !fromEnv.isBlank()) {
      return stripTrailingSlash(fromEnv.trim());
    }
    return "http://127.0.0.1:4173";
  }

  private static String stripTrailingSlash(String url) {
    return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
  }
}
