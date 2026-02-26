import { HeroSection } from '@/components/home/HeroSection';
import { GoalsSection } from '@/components/home/GoalsSection';
import { StatsSection } from '@/components/home/StatsSection';
import { ProductsSection } from '@/components/home/ProductsSection';
import { QuizCTA } from '@/components/home/QuizCTA';
import { TrustSection } from '@/components/home/TrustSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <GoalsSection />
      <StatsSection />
      <ProductsSection />
      <QuizCTA />
      <TrustSection />
    </>
  );
}
