import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { MLE } from "@/components/sections/MLE";
import { Consultor } from "@/components/sections/Consultor";
import { Comercializadora } from "@/components/sections/Comercializadora";
import { ConsumidorFinal } from "@/components/sections/ConsumidorFinal";
import { SplashScreen } from "@/components/ui/SplashScreen";

export default function Home() {
  return (
    <>
      <SplashScreen storageKey="pulso:splash:landing" />
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
