
import Hero from "@/components/hero/Hero";
import Community from "@/components/community/Community";
import FeaturedSection from "@/components/feature-section/FeaturedSection";


const LandingPage = () => {
  return (
   
      <div className="pt-16 sm:pt-18 lg:pt-20">
        <Hero />
        <Community />
        <FeaturedSection />
      </div>
   
   
  );
};

export default LandingPage;
