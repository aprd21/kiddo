import React from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { PrintLayout } from './layouts/PrintLayout';
import { MathSheet } from './components/MathSheet';
import { EnglishSheet } from './components/EnglishSheet';

const AppContent: React.FC = () => {
  const { puzzleType } = useSettings();

  return (
    <div style={{ display: 'flex' }}>
      <ConfigurationPanel />
      <div style={{ marginLeft: '300px', width: '100%', padding: '20px', minHeight: '100vh', backgroundColor: '#eee' }}>
        <PrintLayout>
          {puzzleType === 'math' ? (
            <MathSheet />
          ) : (
            <EnglishSheet />
          )}
        </PrintLayout>
      </div>
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;

