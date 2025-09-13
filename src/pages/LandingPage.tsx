import Hero from '@/components/hero/Hero';
import Community from '@/components/community/Community';
import FeaturedSection from '@/components/feature-section/FeaturedSection';
import Trending from '@/components/home-trending/home-trending';
import { useState } from 'react';

const LandingPage = () => {
  const [isAuthenticate, authenticate] = useState(false);
  return (
    <div className="pt-16 sm:pt-18 lg:pt-20">
      <Hero />
      {isAuthenticate ? (
        <>
          <Community />
          <FeaturedSection />
        </>
      ) : (
        <>
        <Trending/>
        </>
      )}
    </div>
  );
};

export default LandingPage;
