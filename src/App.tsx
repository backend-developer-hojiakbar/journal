import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Articles from './pages/Articles';
import About from './pages/About';
import Current from './pages/Current';
import Archive from './pages/Archive';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ArticleDetail from './pages/ArticleDetail'; // Yangi komponentni import qilamiz

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/about" element={<About />} />
            <Route path="/current" element={<Current />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/article/:id" element={<ArticleDetail />} /> {/* Yangi route qo‘shildi */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;