import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
/* Fonts are served from this site (not Google Fonts), so the first paint
   does not wait for another server. Both are Indian designs that cover
   Latin and Bengali, so English and বাংলা match. A page downloads one
   small file per script (Latin, Bengali, …) only when it uses those letters.
   - Baloo Da 2 (headings): a "variable" font, one file holds every weight.
   - Hind Siliguri (body): one file per weight, so import only those used. */
import "@fontsource-variable/baloo-da-2/wght.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";
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
