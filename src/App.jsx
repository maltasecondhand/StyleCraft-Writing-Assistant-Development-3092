import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import WritingSteps from './pages/WritingSteps';
import Output from './pages/Output';
import CharacterList from './pages/CharacterList';
import CharacterEditor from './pages/CharacterEditor';
import Header from './components/Header';
import PersonaModal from './components/personas/PersonaModal';

import { StepsProvider } from './context/StepsContext';
import { TemplateProvider } from './context/TemplateContext';
import { PromptsProvider } from './context/PromptsContext';
import { PersonaProvider } from './context/PersonaContext';
import './App.css';

function App() {
  return (
    <StepsProvider>
      <TemplateProvider>
        <PromptsProvider>
          <PersonaProvider>
            <Router>
              <div className="app-container relative">
                <Header />
                <div className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/steps" element={<WritingSteps />} />
                    <Route path="/output" element={<Output />} />
                    <Route path="/characters" element={<CharacterList />} />
                    <Route path="/characters/new" element={<CharacterEditor />} />
                    <Route path="/characters/edit/:id" element={<CharacterEditor />} />
                  </Routes>
                </div>

                {/* Global Persona Modal */}
                <PersonaModal />
              </div>
            </Router>
          </PersonaProvider>
        </PromptsProvider>
      </TemplateProvider>
    </StepsProvider>
  );
}

export default App;