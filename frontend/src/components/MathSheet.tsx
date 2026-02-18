/**
 * MathSheet.tsx
 * 
 * Component responsible for rendering the printable Math worksheet.
 * Fetches generated problems and displays them in a grid.
 * Handles pagination and layout based on SettingsContext.
 */

import React, { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { generateMathProblems, type MathProblem } from '../utils/mathGenerator';
import styles from './MathSheet.module.css';

// Map digits to specific colors for the "Color Key" feature
// Visual aid to help kids recognize patterns
// Map digits to specific colors for the "Color Key" feature
// Visual aid to help kids recognize patterns
// Restricted palette: Red, Green, Blue, Orange, Black, Yellow
const digitColors: Record<string, string> = {
    '0': '#FF0000', // Red
    '1': '#00FF00', // Green
    '2': '#0000FF', // Blue
    '3': '#FF991C', // Orange
    '4': '#000000', // Black
    '5': '#FFFF00', // Yellow
    '6': '#FF0000', // Red
    '7': '#00FF00', // Green
    '8': '#0000FF', // Blue
    '9': '#FF991C', // Orange
};

/**
 * Helper component to render a number where each digit is colored
 * according to the digitColors map.
 */
const ColorDigit: React.FC<{ value: string | number }> = ({ value }) => {
    const str = String(value);
    return (
        <span>
            {str.split('').map((char, index) => (
                <span key={index} style={{ color: digitColors[char] || 'inherit' }}>
                    {char}
                </span>
            ))}
        </span>
    );
};

export const MathSheet: React.FC = () => {
    // Access global settings
    const { mathLevel, layout, advanced, generationTrigger } = useSettings();
    const [problems, setProblems] = useState<MathProblem[]>([]);

    // Effect to regenerate problems when settings or the trigger change
    useEffect(() => {
        const totalCount = layout.rows * layout.cols * layout.pages;
        setProblems(generateMathProblems(mathLevel, totalCount, advanced.mixedDifficulty));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generationTrigger, mathLevel, layout.rows, layout.cols, layout.pages, advanced.mixedDifficulty]);

    const { colorKey, applyColorToPuzzle } = advanced;
    const itemsPerPage = layout.rows * layout.cols;

    // Calculate font size based on number of columns to prevent overflow
    const baseFontSize = 2.5;
    const dynamicFontSize = Math.max(1, baseFontSize - (layout.cols - 3) * 0.3);

    const renderNumber = (num: number) => {
        if (num === undefined) return null;
        if (colorKey && applyColorToPuzzle) {
            return <ColorDigit value={num} />;
        }
        return num;
    };

    return (
        <>
            {Array.from({ length: layout.pages }).map((_, p) => {
                const pageProblems = problems.slice(p * itemsPerPage, (p + 1) * itemsPerPage);

                return (
                    <div key={p} className={`${styles.page} ${p > 0 ? styles.pageBreak : ''}`}>
                        {colorKey && (
                            <div className={styles.legend}>
                                <strong>Color Key: </strong>
                                {Object.entries(digitColors).map(([digit, color]) => (
                                    <span key={digit} style={{ marginRight: '10px' }}>
                                        <span style={{ color, fontWeight: 'bold' }}>{digit}</span>
                                    </span>
                                ))}
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
                                    <div
                                        className={styles.problemBox}
                                        style={{ fontSize: `${dynamicFontSize}rem` }}
                                    >
                                        <div className={styles.row}>
                                            <span className={styles.number}>{renderNumber(problem.top)}</span>
                                        </div>
                                        <div className={`${styles.row} ${styles.bottomRow}`}>
                                            <span className={styles.operator}>{problem.operator}</span>
                                            <span className={styles.number}>{renderNumber(problem.bottom)}</span>
                                        </div>
                                        {problem.third !== undefined && (
                                            <div className={styles.row} style={{ marginTop: '-0.2em' }}>
                                                <span className={styles.number}>{renderNumber(problem.third)}</span>
                                            </div>
                                        )}
                                        <div className={styles.line}></div>
                                        <div className={styles.answerBox}></div>
                                        <div className={styles.line}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    );
};
