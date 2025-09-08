import React from 'react';
import Hero from '../components/Hero';
import JournalInfo from '../components/JournalInfo';
import RecentIssues from '../components/RecentIssues';
import NewsSection from '../components/NewsSection';

const Home = () => {
  return (
    <div>
      <Hero />
      <JournalInfo />
      <RecentIssues />
      <NewsSection />
    </div>
  );
};

export default Home;