import { Route, Routes } from "react-router-dom";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Gallery from "./pages/Gallery";
import GetInvolved from "./pages/GetInvolved";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import OurWork from "./pages/OurWork";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        {/* Adding a page? Also list its path in public/_redirects, which tells
            Netlify which URLs are real pages (200) and which are not (404). */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
