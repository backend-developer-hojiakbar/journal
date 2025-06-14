import React from 'react';
import Hero from '../components/Hero';
import ScheduleSection from '../components/ScheduleSection'; // Yo'lni tekshirish
import LatestArticles from '../components/LatestArticles';

const Home = () => {
  return (
    <div>
      <Hero />
      <ScheduleSection />
      <LatestArticles />
    </div>
  );
};

export default Home;