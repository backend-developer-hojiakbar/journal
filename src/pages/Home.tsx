import React from 'react';
import Hero from '../components/Hero';
import JournalInfo from '../components/JournalInfo';
import NewsSection from '../components/NewsSection';

const Home = () => {
  return (
    <div>
      <Hero />
      <JournalInfo />
      <NewsSection />
    </div>
  );
};

export default Home;