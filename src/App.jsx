import { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";

/* Every page except Home is its own small file, downloaded only when it
   is needed, so the first visit loads less. Once the page is idle, the
   others are fetched quietly in the background, so moving between pages
   still feels instant. */
const pages = {
  About: () => import("./pages/About"),
  PastWorks: () => import("./pages/PastWorks"),
  Gallery: () => import("./pages/Gallery"),
  GetInvolved: () => import("./pages/GetInvolved"),
  RequestHelp: () => import("./pages/RequestHelp"),
  Donate: () => import("./pages/Donate"),
  Contact: () => import("./pages/Contact"),
  NotFound: () => import("./pages/NotFound"),
};
const About = lazy(pages.About);
const PastWorks = lazy(pages.PastWorks);
const Gallery = lazy(pages.Gallery);
const GetInvolved = lazy(pages.GetInvolved);
const RequestHelp = lazy(pages.RequestHelp);
const Donate = lazy(pages.Donate);
const Contact = lazy(pages.Contact);
const NotFound = lazy(pages.NotFound);

function usePrefetchPages() {
  useEffect(() => {
    const load = () => Object.values(pages).forEach((p) => p().catch(() => {}));
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(load, 2500);
    return () => clearTimeout(id);
  }, []);
}

export default function App() {
  usePrefetchPages();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      {/* The footer waits with the page: shown before a page has loaded,
          it would be pushed down the screen when the page arrives. */}
      <Suspense fallback={<main id="main" className="min-h-screen" />}>
        <main id="main">
          {/* Adding a page? Also list its path in public/_redirects, which tells
              Netlify which URLs are real pages (200) and which are not (404). */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/past-works" element={<PastWorks />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/request-help" element={<RequestHelp />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Suspense>
      <BackToTop />
    </>
  );
}
