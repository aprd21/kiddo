import {
    twoLetterWords, threeLetterWords, fourLetterWords, fiveLetterWords,
    sixLetterWords, sevenLetterWords, eightLetterWords, nineLetterWords, tenLetterWords,
    themeWords
} from '../data/wordList';
import { availableIcons } from '../data/wordIcons';

export interface EnglishProblem {
    word: string; // The full word (e.g., "CAT")
    maskedWord: string; // The word with missing letters (e.g., "C _ T")
    missingIndices: number[]; // Indices of letters that were removed
    id: string; // Unique ID
}

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomWord = (list: string[], theme: string = 'standard', preferImages: boolean = false) => {
    let candidateList = list;

    // Filter by theme if applicable
    if (theme !== 'standard' && themeWords[theme]) {
        const themeSet = new Set(themeWords[theme]);
        const validThemeWords = list.filter(w => themeSet.has(w));

        if (validThemeWords.length > 0) {
            // 80% chance to pick a theme word if available
            if (Math.random() < 0.8) {
                candidateList = validThemeWords;
            }
        }
    }

    // Filter by image availability if requested
    if (preferImages) {
        const wordsWithImages = candidateList.filter(w => availableIcons.has(w));
        // If we have words with images, use them 100% of the time to maximize visual coverage
        if (wordsWithImages.length > 0) {
            candidateList = wordsWithImages;
        }
    }

    return candidateList[getRandomInt(0, candidateList.length - 1)];
};

export const generateEnglishProblems = (
    level: number,
    count: number,
    mode: 'reading' | 'spelling' = 'spelling',
    mixed: boolean = false,
    mixRatio: number = 20,
    theme: string = 'standard',
    preferImages: boolean = false
): EnglishProblem[] => {

    const problems: EnglishProblem[] = [];

    for (let i = 0; i < count; i++) {
        const id = Math.random().toString(36).substr(2, 9);

        // Determine effective level
        let effectiveLevel = level;
        if (mixed && level > 1) {
            // Convert percentage to probability (0-100 -> 0.0-1.0)
            if (Math.random() < (mixRatio / 100)) {
                effectiveLevel = getRandomInt(1, level - 1);
            }
        }

        let word = '';
        let maskedWord = '';
        let missingIndices: number[] = [];

        if (mode === 'reading') {
            // Reading Mode: Levels based on word length
            // Level 1: 2-3 letters
            // Level 2: 4 letters
            // ...
            // Level 8: 10 letters
            let list: string[] = [];
            switch (effectiveLevel) {
                case 1:
                    list = Math.random() < 0.5 ? twoLetterWords : threeLetterWords;
                    break;
                case 2: list = fourLetterWords; break;
                case 3: list = fiveLetterWords; break;
                case 4: list = sixLetterWords; break;
                case 5: list = sevenLetterWords; break;
                case 6: list = eightLetterWords; break;
                case 7: list = nineLetterWords; break;
                case 8: list = tenLetterWords; break;
                default: list = threeLetterWords; break;
            }
            word = getRandomWord(list, theme, preferImages);
            maskedWord = word.split('').join(' '); // No masking in reading mode
            missingIndices = []; // No missing indices
        } else {
            // Spelling Mode: Existing logic (Levels 1-4)
            // Note: If mixed difficulty selects a level > 4 (unlikely if max is 4), clamp it?
            // Existing logic only handles cases 1-4.
            const spellingLevel = Math.min(effectiveLevel, 4);

            switch (spellingLevel) {
                case 1:
                    // 3-letter, First or Last missing
                    word = getRandomWord(threeLetterWords, theme, preferImages);
                    const missingFirst = Math.random() < 0.5;
                    if (missingFirst) {
                        missingIndices = [0];
                        maskedWord = `_ ${word[1]} ${word[2]}`;
                    } else {
                        missingIndices = [2];
                        maskedWord = `${word[0]} ${word[1]} _`;
                    }
                    break;

                case 2:
                    // 3-letter, Middle missing
                    word = getRandomWord(threeLetterWords, theme, preferImages);
                    missingIndices = [1];
                    maskedWord = `${word[0]} _ ${word[2]}`;
                    break;

                case 3:
                    // 4-letter, First or Last missing
                    word = getRandomWord(fourLetterWords, theme, preferImages);
                    const missingFirst4 = Math.random() < 0.5;
                    if (missingFirst4) {
                        missingIndices = [0];
                        maskedWord = `_ ${word[1]} ${word[2]} ${word[3]}`;
                    } else {
                        missingIndices = [3];
                        maskedWord = `${word[0]} ${word[1]} ${word[2]} _`;
                    }
                    break;

                case 4:
                    // 4-letter, Random single letter missing
                    word = getRandomWord(fourLetterWords, theme, preferImages);
                    const idx = getRandomInt(0, 3);
                    missingIndices = [idx];
                    const chars = word.split('');
                    chars[idx] = '_';
                    maskedWord = chars.join(' ');
                    break;

                default:
                    word = 'CAT';
                    maskedWord = 'C _ T';
                    missingIndices = [1];
            }
        }

        problems.push({ word, maskedWord, missingIndices, id });
    }

    return problems;
};
