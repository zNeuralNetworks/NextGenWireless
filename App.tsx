import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store';
import { Navigation } from './components/Navigation';
import { Background } from './components/ui/Background';
import { ArchitectureSandbox } from './components/sandbox/SandboxWorkspace';
import { LandingPage } from './components/landing/LandingPage';

function App() {
  const { toastMessage, setMode, activeView } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const persona = params.get('persona');
    if (persona === 'architect' || persona === 'executive') {
      setMode(persona);
    }
  }, [setMode]);

  return (
    <div className="bg-arista-bg text-slate-200 min-h-screen selection:bg-arista-blue/30 selection:text-white relative overflow-x-hidden">
      {activeView === 'landing' && <Background />}
      {activeView === 'landing' && <Navigation />}
      
      <main className={activeView === 'landing' ? "relative z-10 lg:pl-24 pb-20 lg:pb-0" : "relative z-10 min-h-screen"}>
        {activeView === 'landing' ? <LandingPage /> : <ArchitectureSandbox />}
      </main>

      {/* Global Toast */}
      <AnimatePresence mode="wait">
        {toastMessage && (
          <motion.div
            key={toastMessage}
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 md:left-[calc(50%+3rem)] bg-arista-card border border-arista-border text-white px-4 py-2 rounded-lg shadow-2xl z-50 text-sm font-medium backdrop-blur-md flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-arista-green rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
