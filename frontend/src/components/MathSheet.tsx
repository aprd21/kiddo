import React, { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { generateMathProblems, type MathProblem } from '../utils/mathGenerator';
import styles from './MathSheet.module.css';

// Default Color Map
const digitColors: Record<string, string> = {
    '0': '#7f8c8d', // Gray
    '1': '#2980b9', // Blue
    '2': '#c0392b', // Red
    '3': '#27ae60', // Green
    '4': '#d35400', // Orange
    '5': '#8e44ad', // Purple
    '6': '#16a085', // Teal
    '7': '#e84393', // Pink
    '8': '#8d6e63', // Brown
    '9': '#82ccdd', // Lime-Blueish
};

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
    const { mathLevel, layout, advanced, generationTrigger } = useSettings();
    const [problems, setProblems] = useState<MathProblem[]>([]);

    useEffect(() => {
        const totalCount = layout.rows * layout.cols * layout.pages;
        setProblems(generateMathProblems(mathLevel, totalCount, advanced.mixedDifficulty));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generationTrigger, mathLevel, layout.rows, layout.cols, layout.pages, advanced.mixedDifficulty]);

    const { colorKey, applyColorToPuzzle } = advanced;

    const renderNumber = (num: number) => {
        if (colorKey && applyColorToPuzzle) {
            return <ColorDigit value={num} />;
        }
        return num;
    };

    const pages = [];
    const itemsPerPage = layout.rows * layout.cols;

    for (let p = 0; p < layout.pages; p++) {
        const pageProblems = problems.slice(p * itemsPerPage, (p + 1) * itemsPerPage);

        pages.push(
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
                            <div className={styles.problemBox}>
                                <div className={styles.row}>
                                    {/* Spacing for carry if needed later, or cleaner alignment */}
                                    <span className={styles.number}>{renderNumber(problem.top)}</span>
                                </div>
                                {problem.third !== undefined && (
                                    <div className={styles.row}>
                                        <span className={styles.number}>{renderNumber(problem.bottom)}</span>
                                    </div>
                                )}
                                <div className={`${styles.row} ${styles.bottomRow}`}>
                                    <span className={styles.operator}>+</span>
                                    <span className={styles.number}>
                                        {renderNumber(problem.third !== undefined ? problem.third : problem.bottom)}
                                    </span>
                                </div>
                                <div className={styles.line}></div>
                                <div className={styles.answerBox}></div>
                                <div className={styles.line}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return <>{pages}</>;
};
