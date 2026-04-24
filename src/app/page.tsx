import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { MLE } from "@/components/sections/MLE";
import { Consultor } from "@/components/sections/Consultor";
import { Comercializadora } from "@/components/sections/Comercializadora";
import { ConsumidorFinal } from "@/components/sections/ConsumidorFinal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MLE />
        <Consultor />
        <Comercializadora />
        <ConsumidorFinal />
      </main>
      <Footer />
    </>
  );
}
