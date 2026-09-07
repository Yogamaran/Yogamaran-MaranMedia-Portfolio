import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MarqueeBanner from "./components/MarqueeBanner";
import Works from "./components/Works";
import About from "./components/About";
import KineticTypography from "./components/KineticTypography";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="bg-bg min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <MarqueeBanner />
        <Works />
        <About />
        <KineticTypography />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
