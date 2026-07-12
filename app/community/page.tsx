import { Users2, Sparkles, MessageCircleHeart, Compass, HandHeart } from 'lucide-react';
import PublicLayout from '../public-layout';
import { PlaceholderPage } from '../../components/placeholders/placeholder-page';

export default function CommunityPage() {
  return (
    <PublicLayout>
      <PlaceholderPage
        eyebrow="Community-first"
        title="A collaborative space for builders, learners, and leaders"
        description="Our community brings together young professionals, students, mentors, and volunteers who want to solve local and global problems through technology."
        stats={[
          { label: 'Member circles', value: '8' },
          { label: 'Peer sessions', value: '40+' },
          { label: 'Community impact', value: 'Growing' },
        ]}
        cards={[
          { title: 'Peer Support', description: 'Find accountability partners, teammates, and friends who share your technical goals.', badge: 'Support', href: '/join', icon: Users2 },
          { title: 'Showcase Nights', description: 'Share progress, pitch ideas, and discover what others are building.', href: '/events', icon: Sparkles },
          { title: 'Discussion Spaces', description: 'Ask questions, exchange resources, and learn from communities of practice.', href: '/blog', icon: MessageCircleHeart },
          { title: 'Mentorship Network', description: 'Connect with experienced guides who want to help you grow faster and smarter.', href: '/mentors', icon: HandHeart },
          { title: 'Local Impact', description: 'Work on initiatives that matter to schools, startups, nonprofits, and emerging regions.', href: '/projects', icon: Compass },
        ]}
        cta={{ label: 'Become a member', href: '/join', secondaryLabel: 'Explore mentors', secondaryHref: '/mentors' }}
      />
    </PublicLayout>
  );
}
