/**
 * EnglishSheet.tsx
 * 
 * Component responsible for rendering the printable English worksheet.
 * Displays words with missing letters or full words for reading practice.
 * Supports different difficulty levels and modes (Spelling vs Reading).
 */

import React, { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { generateEnglishProblems, type EnglishProblem } from '../utils/englishGenerator';
import styles from './EnglishSheet.module.css';

// Default Color Map for letters
// Coloring helps with visual tracking and engagement
// Palette: Red, Green, Blue, Orange, Black
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FF991C', '#000000'];
const letterColors: Record<string, string> = {};
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
alphabet.split('').forEach((char, index) => {
    letterColors[char] = colors[index % colors.length];
});

const ColorLetter: React.FC<{ value: string }> = ({ value }) => {
    return <span style={{ color: letterColors[value.toUpperCase()] || 'inherit' }}>{value}</span>;
}

export const EnglishSheet: React.FC = () => {
    // Access settings context
    const { englishLevel, englishMode, layout, advanced, generationTrigger } = useSettings();
    const [problems, setProblems] = useState<EnglishProblem[]>([]);

    // Regenerate problems when relevant settings change
    useEffect(() => {
        const totalCount = layout.rows * layout.cols * layout.pages;
        setProblems(generateEnglishProblems(englishLevel, totalCount));
    }, [generationTrigger, englishLevel, layout.rows, layout.cols, layout.pages]);

    const { colorKey, applyColorToPuzzle } = advanced;
    const itemsPerPage = layout.rows * layout.cols;
    const pages = [];

    // Calculate dynamic font size based on column count
    // Base 2.5rem, decreases as columns increase
    const baseFontSize = 2.5;
    const dynamicFontSize = Math.max(1, baseFontSize - (layout.cols - 2) * 0.4);

    for (let p = 0; p < layout.pages; p++) {
        const pageProblems = problems.slice(p * itemsPerPage, (p + 1) * itemsPerPage);

        pages.push(
            <div key={p} className={`${styles.page} ${p > 0 ? styles.pageBreak : ''}`}>
                {colorKey && (
                    <div className={styles.legend}>
                        <strong>Color Key: </strong>
                        <div className={styles.legendItems}>
                            {Object.entries(letterColors).slice(0, 13).map(([l, c]) => ( // Show first half to save space? Or just commonly used?
                                <span key={l} style={{ color: c, fontWeight: 'bold', margin: '0 5px' }}>{l}</span>
                            ))}
                            ...
                        </div>
                    </div>
                )}

                <div
                    className={styles.grid}
                    style={{
                        gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                        gridTemplateRows: `repeat(${layout.rows}, 1fr)`
                    }}
                >
                    {pageProblems.map((problem) => (
                        <div key={problem.id} className={styles.problemContainer}>
                            <div className={styles.wordBox} style={{ fontSize: `${dynamicFontSize}rem` }}>
                                {englishMode === 'reading' ? (
                                    // Reading Mode: Show full word
                                    <span className={styles.word}>
                                        {problem.word.split('').map((char, i) => (
                                            applyColorToPuzzle && colorKey ? <ColorLetter key={i} value={char} /> : char
                                        ))}
                                    </span>
                                ) : (
                                    // Spelling Mode: Show masked word
                                    <span className={styles.word}>
                                        {problem.maskedWord.split(' ').map((char, i) => {
                                            if (char === '_') return <span key={i} className={styles.blank}>_</span>;
                                            return applyColorToPuzzle && colorKey ? <ColorLetter key={i} value={char} /> : char;
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return <>{pages}</>;
};
