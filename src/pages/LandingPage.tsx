import React from 'react';
import { LandingHeader } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Pricing } from '../components/landing/Pricing';
import { Footer } from '../components/landing/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

