/**
 * ConfigurationPanel.tsx
 * 
 * The sidebar interface that allows users to configure the puzzle settings.
 * Updates the global SettingsContext.
 * Automatically hidden when printing.
 */

import React from 'react';
import { useSettings } from '../context/SettingsContext';
import styles from './ConfigurationPanel.module.css';

export const ConfigurationPanel: React.FC = () => {
    // Destructure all setters and values from context
    const {
        puzzleType, setPuzzleType,
        mathLevel, setMathLevel,
        englishLevel, setEnglishLevel,
        englishMode, setEnglishMode,
        layout, setLayout,
        advanced, setAdvanced,
        generatePuzzles
    } = useSettings();

    // Handler for numeric layout inputs (rows/cols/pages)
    const handleLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLayout({ ...layout, [name]: parseInt(value) || 0 });
    };

    // Generic toggle for boolean advanced settings
    const toggleAdvanced = (field: keyof typeof advanced) => {
        setAdvanced({ ...advanced, [field]: !advanced[field] });
    };

    return (
        <div className={`${styles.panel} no-print`}>
            <h2>Configuration</h2>

            <div className={styles.section}>
                <h3>Puzzle Type</h3>
                <div className={styles.row}>
                    <label>
                        <input
                            type="radio"
                            checked={puzzleType === 'math'}
                            onChange={() => setPuzzleType('math')}
                        /> Math
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={puzzleType === 'english'}
                            onChange={() => setPuzzleType('english')}
                        /> English
                    </label>
                </div>
            </div>

            <div className={styles.section}>
                <h3>Difficulty</h3>
                {puzzleType === 'math' ? (
                    <div className={styles.row}>
                        <label>Level (1-6):</label>
                        <select value={mathLevel} onChange={(e) => setMathLevel(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5, 6].map(l => (
                                <option key={l} value={l}>Level {l}</option>
                            ))}
                        </select>
                        <div className={styles.description}>
                            {mathLevel === 1 && "Simple Addition (Sum <= 18)"}
                            {mathLevel === 2 && "2-digit + 2-digit (No carry)"}
                            {mathLevel === 3 && "2-digit + 2-digit (With carry)"}
                            {mathLevel === 4 && "3-digit + 3-digit (No carry)"}
                            {mathLevel === 5 && "3-digit + 3-digit (With carry)"}
                            {mathLevel === 6 && "Add 3 numbers"}
                        </div>
                    </div>
                ) : (
                    <div className={styles.row}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                            <div className={styles.row}>
                                <label>Mode:</label>
                                <select
                                    value={englishMode}
                                    onChange={(e) => setEnglishMode(e.target.value as 'reading' | 'spelling')}
                                >
                                    <option value="spelling">Missing Letters</option>
                                    <option value="reading">Reading Practice</option>
                                </select>
                            </div>

                            {englishMode === 'spelling' && (
                                <>
                                    <div className={styles.row}>
                                        <label>Level (1-4):</label>
                                        <select value={englishLevel} onChange={(e) => setEnglishLevel(Number(e.target.value))}>
                                            {[1, 2, 3, 4].map(l => (
                                                <option key={l} value={l}>Level {l}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.description}>
                                        {englishLevel === 1 && "3-letter words (First/Last missing)"}
                                        {englishLevel === 2 && "3-letter words (Middle missing)"}
                                        {englishLevel === 3 && "4-letter words (First/Last missing)"}
                                        {englishLevel === 4 && "4-letter words (Random missing)"}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <h3>Layout</h3>
                <div className={styles.gridParams}>
                    <label>
                        Rows:
                        <input
                            type="number"
                            name="rows"
                            value={layout.rows}
                            onChange={handleLayoutChange}
                            className={styles.inputSmall}
                        />
                    </label>
                    <label>
                        Cols:
                        <input
                            type="number"
                            name="cols"
                            value={layout.cols}
                            onChange={handleLayoutChange}
                            className={styles.inputSmall}
                        />
                    </label>
                    <label>
                        Pages:
                        <input
                            type="number"
                            name="pages"
                            value={layout.pages}
                            onChange={handleLayoutChange}
                            className={styles.inputSmall}
                        />
                    </label>
                </div>
            </div>

            <div className={styles.section}>
                <h3>Advanced</h3>
                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={advanced.mixedDifficulty}
                        onChange={() => toggleAdvanced('mixedDifficulty')}
                    /> Mixed Difficulty
                </label>

                {advanced.mixedDifficulty && (
                    <div className={styles.indent} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                        <div className={styles.row}>
                            <label style={{ fontSize: '0.9em' }}>Ratio (%):</label>
                            <input
                                type="number"
                                className={styles.inputSmall}
                                min="0"
                                max="100"
                                value={advanced.mixedDifficultyRatio}
                                onChange={(e) => setAdvanced({ ...advanced, mixedDifficultyRatio: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                            />
                        </div>
                        <div className={styles.description}>Percentage of easier problems</div>
                    </div>
                )}

                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={advanced.colorKey}
                        onChange={() => toggleAdvanced('colorKey')}
                    /> Enable Color Key
                </label>

                {advanced.colorKey && (
                    <label className={`${styles.checkbox} ${styles.indent}`}>
                        <input
                            type="checkbox"
                            checked={advanced.applyColorToPuzzle}
                            onChange={() => toggleAdvanced('applyColorToPuzzle')}
                        /> Apply to Puzzle
                    </label>
                )}

                <div className={styles.row}>
                    <label>Theme:</label>
                    <select
                        value={advanced.theme}
                        onChange={(e) => setAdvanced({ ...advanced, theme: e.target.value as any })}
                    >
                        <option value="standard">Standard</option>
                        <option value="space">Space</option>
                        <option value="animals">Animals</option>
                        <option value="underwater">Underwater</option>
                    </select>
                </div>

                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={advanced.showImages}
                        onChange={() => toggleAdvanced('showImages')}
                    /> Show Images
                </label>
            </div>


            <div className={styles.printSection}>
                <button onClick={generatePuzzles} className={`${styles.printButton} ${styles.generateButton}`}>Generate New Puzzles</button>
                <div style={{ height: '10px' }}></div>
                <button onClick={() => window.print()} className={styles.printButton}>Print Puzzles</button>
            </div>
        </div>
    );
};
