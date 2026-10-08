import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
/* Fonts are served from this site (not Google Fonts), so the first paint
   does not wait for another server. They are "variable" fonts: one file
   holds every weight, so a page downloads one small file per script
   (Latin, Bengali, …) instead of one per weight, and only when it uses
   those letters. */
import "@fontsource-variable/bricolage-grotesque/wght.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/noto-sans-bengali/wght.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
