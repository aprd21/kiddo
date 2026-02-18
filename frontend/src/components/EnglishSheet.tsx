import React, { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { generateEnglishProblems, type EnglishProblem } from '../utils/englishGenerator';
import styles from './EnglishSheet.module.css';

// Default Color Map for letters (A-Z)
const letterColors: Record<string, string> = {
    A: '#e74c3c', B: '#3498db', C: '#2ecc71', D: '#9b59b6', E: '#f1c40f',
    F: '#e67e22', G: '#1abc9c', H: '#34495e', I: '#d35400', J: '#7f8c8d',
    K: '#c0392b', L: '#2980b9', M: '#8e44ad', N: '#27ae60', O: '#16a085',
    P: '#f39c12', Q: '#8e44ad', R: '#2c3e50', S: '#e84393', T: '#d35400',
    U: '#2ecc71', V: '#3498db', W: '#e74c3c', X: '#9b59b6', Y: '#f1c40f',
    Z: '#1abc9c'
};

const ColorLetter: React.FC<{ char: string }> = ({ char }) => {
    const upper = char.toUpperCase();
    const color = letterColors[upper] || 'inherit';
    return <span style={{ color }}>{char}</span>;
};

export const EnglishSheet: React.FC = () => {
    const { englishLevel, englishMode, layout, advanced } = useSettings();
    const [problems, setProblems] = useState<EnglishProblem[]>([]);

    useEffect(() => {
        const totalCount = layout.rows * layout.cols * layout.pages;
        setProblems(generateEnglishProblems(englishLevel, totalCount));
    }, [englishLevel, layout.rows, layout.cols, layout.pages]);

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
                                            applyColorToPuzzle && colorKey ? <ColorLetter key={i} char={char} /> : char
                                        ))}
                                    </span>
                                ) : (
                                    // Spelling Mode: Show masked word
                                    <span className={styles.word}>
                                        {problem.maskedWord.split(' ').map((char, i) => {
                                            if (char === '_') return <span key={i} className={styles.blank}>_</span>;
                                            return applyColorToPuzzle && colorKey ? <ColorLetter key={i} char={char} /> : char;
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
