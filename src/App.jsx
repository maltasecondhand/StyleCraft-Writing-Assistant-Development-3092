import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import WritingSteps from './pages/WritingSteps';
import DraftMode from './pages/DraftMode';
import Output from './pages/Output';
import { StepsProvider } from './context/StepsContext';
import './App.css';

function App() {
  return (
    <StepsProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Header />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/steps" element={<WritingSteps />} />
              <Route path="/draft" element={<DraftMode />} />
              <Route path="/output" element={<Output />} />
            </Routes>
          </motion.main>
        </div>
      </Router>
    </StepsProvider>
  );
}

export default App;