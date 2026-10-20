import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BrandMarquee from "@/components/BrandMarquee";
import Stats from "@/components/Stats";
import Portfolio from "@/components/Portfolio";
import CaseStudies from "@/components/CaseStudies";
import About from "@/components/About";
import Services from "@/components/Services";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { ClipModalProvider } from "@/components/ClipModal";

export default function Home() {
  return (
    <ClipModalProvider>
      <Nav />
      <main>
        <Hero />
        <BrandMarquee />
        <Stats />
        <Portfolio />
        <CaseStudies />
        <About />
        <Services />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </ClipModalProvider>
  );
}
