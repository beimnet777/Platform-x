// src/app/page.tsx
"use client";

import { FAQ, Featured, FinancialFuture, HeroSection, JoinSection, OffersSection } from '@/components';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    
    <Layout>
    <main>
      <HeroSection />
      <Featured />
      <OffersSection />
      <FinancialFuture />
      <JoinSection />
      <FAQ />
    </main>
  </Layout>
    
  );
}
