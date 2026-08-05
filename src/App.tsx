import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import PhoneScene from "./sections/PhoneScene";
import Vision from "./sections/Vision";
import Founders from "./sections/Founders";
import Footer from "./sections/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PhoneScene />
        <Vision />
        <Founders />
      </main>
      <Footer />
    </>
  );
}
