import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Current from './pages/Current';
import Archive from './pages/Archive';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Login from './pages/Login';
import ArticleDetail from './pages/ArticleDetail';
import JournalDetail from './pages/JournalDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageNews from './pages/admin/ManageNews';
import ManageIssues from './pages/admin/ManageIssues';
import ManageArticles from './pages/admin/ManageArticles';
import ManageBoard from './pages/admin/ManageBoard';
// import ManageAuthors from './pages/admin/ManageAuthors'; // Integrated into article management
// import ManageKeywords from './pages/admin/ManageKeywords'; // Integrated into article management
import ManageJournals from './pages/admin/ManageJournals';
import ManageMessages from './pages/admin/ManageMessages';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/current/:journalType" element={<Current />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/journal/:journalType" element={<JournalDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} >
              <Route index element={<div className="p-8 text-center text-xl text-gray-700"><h2>Admin Panelga Xush Kelibsiz!</h2><p className="text-base mt-2">Boshqarish uchun chapdagi bo'limlardan birini tanlang.</p></div>} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="news" element={<ManageNews />} />
              <Route path="journals" element={<ManageJournals />} />
              <Route path="issues" element={<ManageIssues />} />
              <Route path="articles" element={<ManageArticles />} />
              {/* <Route path="authors" element={<ManageAuthors />} /> */} {/* Integrated into article management */}
              {/* <Route path="keywords" element={<ManageKeywords />} /> */} {/* Integrated into article management */}
              <Route path="board" element={<ManageBoard />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;