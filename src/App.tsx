import Header from "./components/Header";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import Docs from "./components/Docs";
import About from "./components/About";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white antialiased noise">
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Docs />
        <About />
      </main>
      <Footer />
    </div>
  );
}
