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
const letterColors: Record<string, string> = {
    'A': '#e74c3c', 'B': '#3498db', 'C': '#2ecc71', 'D': '#9b59b6',
    'E': '#f1c40f', 'F': '#1abc9c', 'G': '#e67e22', 'H': '#34495e',
    'I': '#16a085', 'J': '#27ae60', 'K': '#2980b9', 'L': '#8e44ad',
    'M': '#2c3e50', 'N': '#f39c12', 'O': '#d35400', 'P': '#c0392b',
    'Q': '#bdc3c7', 'R': '#7f8c8d', 'S': '#2c3e50', 'T': '#8e44ad',
    'U': '#2980b9', 'V': '#27ae60', 'W': '#16a085', 'X': '#f39c12',
    'Y': '#d35400', 'Z': '#c0392b'
};

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
                            <div className={styles.wordBox}>
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
