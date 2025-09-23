import Hero from '@/components/home-page/hero';
import Community from '@/components/home-page/community';
import FeaturedSection from '@/components/home-page/feature-section';
import Trending from '@/components/home-page/home-trending';
import TrendingPublic from '@/components/home-page/trending-public';
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
