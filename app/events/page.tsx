import { CalendarDays, Mic2, Laptop2, Sparkles, Users2 } from 'lucide-react';
import PublicLayout from '../public-layout';
import { PlaceholderPage } from '../../components/placeholders/placeholder-page';

export default function EventsPage() {
  return (
    <PublicLayout>
      <PlaceholderPage
        eyebrow="Upcoming experiences"
        title="Events designed to spark learning and connection"
        description="From industry talks to build sprints, our events give members a chance to learn, network, and grow in public."
        stats={[
          { label: 'Monthly events', value: '6' },
          { label: 'Workshop seats', value: '300+' },
          { label: 'Partner communities', value: '12' },
        ]}
        cards={[
          { title: 'Tech Talk Series', description: 'Live conversations with founders, engineers, and product leaders on current tech trends.', badge: 'Live', href: '/contact', icon: Mic2 },
          { title: 'Build Labs', description: 'Hands-on coding and prototyping sessions that turn ideas into working products.', href: '/programs', icon: Laptop2 },
          { title: 'Community Hackathons', description: 'Collaborative problem-solving challenges focused on real-world community needs.', href: '/join', icon: Sparkles },
          { title: 'Networking Nights', description: 'Meet peers and mentors in relaxed, welcoming spaces built for meaningful conversation.', href: '/community', icon: Users2 },
        ]}
        cta={{ label: 'Reserve your place', href: '/join', secondaryLabel: 'Ask about partnerships', secondaryHref: '/contact' }}
      />
    </PublicLayout>
  );
}
