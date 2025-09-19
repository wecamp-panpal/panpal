import Hero from '@/components/hero/Hero';
import Community from '@/components/community/Community';
import FeaturedSection from '@/components/feature-section/FeaturedSection';
import Trending from '@/components/home-trending/home-trending';
import TrendingPublic from '@/components/trending-public/TrendingPublic';
import { useAppSelector } from '@/hooks/use-app-selector';

const LandingPage = () => {
  const {isAuthenticated} = useAppSelector((state) => state.user);

  
  return (
    <div className="pt-10 sm:pt-8 lg:pt-10">
      <Hero isAuthenticated={isAuthenticated} />
      {isAuthenticated ? (
        <>
          <Trending/>
        </>
      ) : (
        <>
          <Community />
          <TrendingPublic />
          <FeaturedSection />
          
        </>
      )}
    </div>
  );
};

export default LandingPage;
