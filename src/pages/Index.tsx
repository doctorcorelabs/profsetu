import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProfileSection } from "@/components/ProfileSection";
import { ProgramSection } from "@/components/ProgramSection";
import { NewsSection } from "@/components/NewsSection";
import { RSSNewsSection } from "@/components/RSSNewsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <NewsSection />
        <ProfileSection />
        <ProgramSection />
        <RSSNewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
