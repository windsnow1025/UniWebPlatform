export const StorageKeys = {
  Token: "token",
  APIBaseURLs: "apiBaseURLs",
  APIBaseURLsOptions: "apiBaseURLsOptions",
  SecretKey: "secretKey",
  DeveloperMode: "developerMode",
}

export const AuthorEmail = "windsnow1025@windsnow1025.com";

let baseUrl = "";
if (process.env.NODE_ENV === "production") {
  if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL environment variable is not set");
  }
  baseUrl = process.env.FRONTEND_URL;
} else {
  baseUrl = "http://localhost:3000";
}

export const BaseUrl = baseUrl;
