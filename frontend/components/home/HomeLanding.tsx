import type { Blog, Career } from '@/lib/types';
import { HeroSection } from './HeroSection';
import {
  FAQSection,
  FeaturedCareersSection,
  FinalCTA,
  HowItWorksSection,
  LatestArticlesSection,
} from './HomeSections';

type FAQ = { question: string; answer: string };

export function HomeLanding({
  blogs,
  careers,
  faqs,
}: {
  blogs: Blog[];
  careers: Career[];
  faqs: FAQ[];
}) {
  return (
    <main className="premium-shell">
      <HeroSection />
      <FeaturedCareersSection careers={careers} />
      <HowItWorksSection />
      <LatestArticlesSection blogs={blogs} />
      <FAQSection faqs={faqs} />
      <FinalCTA />
    </main>
  );
}
