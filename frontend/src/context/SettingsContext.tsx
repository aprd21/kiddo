/**
 * SettingsContext.tsx
 * 
 * This file handles the global state management for the application.
 * It uses React Context to provide settings like puzzle type, difficulty levels,
 * layout configuration, and advanced options to all components in the app.
 */

import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Defines the two main types of puzzles available
export type PuzzleType = 'math' | 'english';

// Configuration for the printable grid layout
export interface LayoutConfig {
    rows: number; // Number of rows per page
    cols: number; // Number of columns per page
    pages: number; // Total number of pages to generate
}

// Advanced options for customization
export interface AdvancedSettings {
    mixedDifficulty: boolean; // If true, mixes in problems from lower levels
    mixedDifficultyRatio: number; // Percentage (0-100) of lower level problems to include
    theme: 'standard' | 'space' | 'animals' | 'underwater'; // Visual theme (currently standard is implemented)
    colorKey: boolean; // Toggle for the color legend
    applyColorToPuzzle: boolean; // Whether the puzzle text itself should be colored
    showImages: boolean; // Whether to show images/icons for words
}

// ... (omitted for brevity)





// The shape of our Context data
interface SettingsContextType {
    puzzleType: PuzzleType;
    setPuzzleType: (type: PuzzleType) => void;

    // Math specific settings
    mathLevel: number;
    setMathLevel: (level: number) => void;

    // English specific settings
    englishLevel: number;
    setEnglishLevel: (level: number) => void;
    englishMode: 'reading' | 'spelling';
    setEnglishMode: (mode: 'reading' | 'spelling') => void;

    // Global layout settings
    layout: LayoutConfig;
    setLayout: (layout: LayoutConfig) => void;

    // Advanced settings
    advanced: AdvancedSettings;
    setAdvanced: (settings: AdvancedSettings) => void;

    // Trigger to force regeneration of puzzles without changing settings
    generationTrigger: number;
    generatePuzzles: () => void;
}

// Default values for the context to prevent null checks everywhere
const defaultSettings: SettingsContextType = {
    puzzleType: 'math',
    setPuzzleType: () => { },
    mathLevel: 1,
    setMathLevel: () => { },
    englishLevel: 1,
    setEnglishLevel: () => { },
    englishMode: 'spelling',
    setEnglishMode: () => { },
    layout: { rows: 5, cols: 3, pages: 1 },
    setLayout: () => { },
    advanced: {
        mixedDifficulty: false,
        mixedDifficultyRatio: 20,
        theme: 'standard',
        colorKey: false,
        applyColorToPuzzle: false,
        showImages: false,
    },
    setAdvanced: () => { },
    generationTrigger: 0,
    generatePuzzles: () => { },
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [puzzleType, setPuzzleType] = useState<PuzzleType>('math');
    const [mathLevel, setMathLevel] = useState(1);
    const [englishLevel, setEnglishLevel] = useState(1);
    const [englishMode, setEnglishMode] = useState<'reading' | 'spelling'>('spelling');
    const [layout, setLayout] = useState<LayoutConfig>({ rows: 5, cols: 3, pages: 1 });
    const [generationTrigger, setGenerationTrigger] = useState(0);
    const [advanced, setAdvanced] = useState<AdvancedSettings>({
        mixedDifficulty: false,
        mixedDifficultyRatio: 20,
        theme: 'standard',
        colorKey: false,
        applyColorToPuzzle: false,
        showImages: false,
    });


    const generatePuzzles = () => setGenerationTrigger(prev => prev + 1);

    return (
        <SettingsContext.Provider
            value={{
                puzzleType,
                setPuzzleType,
                mathLevel,
                setMathLevel,
                englishLevel,
                setEnglishLevel,
                englishMode,
                setEnglishMode,
                layout,
                setLayout,
                advanced,
                setAdvanced,
                generationTrigger,
                generatePuzzles,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
