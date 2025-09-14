import Hero from '@/components/hero/Hero';
import Community from '@/components/community/Community';
import FeaturedSection from '@/components/feature-section/FeaturedSection';
import Trending from '@/components/home-trending/home-trending';
import TrendingPublic from '@/components/trending-public/TrendingPublic';
import { useState } from 'react';

const LandingPage = () => {
  const [isAuthenticate] = useState(false);
  
  return (
    <div className="pt-10 sm:pt-8 lg:pt-10">
      <Hero isAuthenticated={isAuthenticate} />
      {isAuthenticate ? (
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
