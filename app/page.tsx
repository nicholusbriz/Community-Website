// app/page.tsx
'use client';

import Hero from '@/components/HomePage/Hero';
import PartnerNetwork from '@/components/HomePage/PartnerNetwork';
import EcosystemSection from '@/components/HomePage/EcosystemSection';
import LearningJourney from '@/components/HomePage/LearningJourney';
import CommunityFeed from '@/components/HomePage/CommunityFeed';
import FeaturedProjects from '@/components/HomePage/FeaturedProjects';
import EventsTimeline from '@/components/HomePage/EventsTimeline';
import SuccessStories from '@/components/HomePage/SuccessStories';
import FAQ from '@/components/HomePage/FAQ';
import FooterCTA from '@/components/HomePage/FooterCTA';

export default function HomePage() {
  return (
    <div className="relative w-full overflow-x-hidden bg-[#0A0B0E]">
      {/* All sections scroll normally - no sticky or overlapping */}
      <Hero />
      <PartnerNetwork />
      <EcosystemSection />
      <LearningJourney />
      <CommunityFeed />
      <FeaturedProjects />
      <EventsTimeline />
      <SuccessStories />
      <FAQ />
      <FooterCTA />
    </div>
  );
}