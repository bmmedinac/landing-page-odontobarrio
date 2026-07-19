import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Schedule } from './components/Schedule';
import { Pricing } from './components/Pricing';
import { HowToBook } from './components/HowToBook';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Services />
      <Schedule />
      <Pricing />
      <HowToBook />
      <Contact />
      <Footer />
    </div>
  );
}
