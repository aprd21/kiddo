import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type PuzzleType = 'math' | 'english';

export interface LayoutConfig {
    rows: number;
    cols: number;
    pages: number;
}

export interface AdvancedSettings {
    mixedDifficulty: boolean;
    theme: 'standard' | 'space' | 'animals' | 'underwater';
    colorKey: boolean;
    applyColorToPuzzle: boolean;
}

interface SettingsContextType {
    puzzleType: PuzzleType;
    setPuzzleType: (type: PuzzleType) => void;
    mathLevel: number;
    setMathLevel: (level: number) => void;
    englishLevel: number;
    setEnglishLevel: (level: number) => void;
    englishMode: 'reading' | 'spelling';
    setEnglishMode: (mode: 'reading' | 'spelling') => void;
    layout: LayoutConfig;
    setLayout: (layout: LayoutConfig) => void;
    advanced: AdvancedSettings;
    setAdvanced: (settings: AdvancedSettings) => void;
    generationTrigger: number;
    generatePuzzles: () => void;
}

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
        theme: 'standard',
        colorKey: false,
        applyColorToPuzzle: false,
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
        theme: 'standard',
        colorKey: false,
        applyColorToPuzzle: false,
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
