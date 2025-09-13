
import Hero from "@/components/hero/Hero";
import Community from "@/components/community/Community";
import FeaturedSection from "@/components/feature-section/FeaturedSection";


const LandingPage = () => {
  return (
   
      <div className="pt-10 sm:pt-8 lg:pt-10">
        <Hero />
        <Community />
        <FeaturedSection />
      </div>
   
   
  );
};

export default LandingPage;
