import Hero from '@/components/hero/Hero';
import Community from '@/components/community/Community';
import FeaturedSection from '@/components/feature-section/FeaturedSection';
import Trending from '@/components/home-trending/home-trending';
import { useState } from 'react';

const LandingPage = () => {
  const [isAuthenticate, authenticate] = useState(false);
  return (
    <div className="pt-10 sm:pt-8 lg:pt-10">
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
