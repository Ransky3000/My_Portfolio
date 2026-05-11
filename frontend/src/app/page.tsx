import Hero from '@/components/Hero';
import About from '@/components/About';
import Competencies from '@/components/Competencies';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Competencies />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
