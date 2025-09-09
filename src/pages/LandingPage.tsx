import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Community from "@/components/Community";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="pt-16 sm:pt-18 lg:pt-20">
        <Hero />
        <Community />
        <FeaturedSection />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
