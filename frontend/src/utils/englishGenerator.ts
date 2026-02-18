import { threeLetterWords, fourLetterWords } from '../data/wordList';

export interface EnglishProblem {
    word: string;
    maskedWord: string; // e.g., "C _ T"
    missingIndices: number[];
    id: string;
}

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomWord = (list: string[]) => {
    return list[getRandomInt(0, list.length - 1)];
};

export const generateEnglishProblems = (level: number, count: number): EnglishProblem[] => {
    const problems: EnglishProblem[] = [];

    for (let i = 0; i < count; i++) {
        const id = Math.random().toString(36).substr(2, 9);
        let word = '';
        let maskedWord = '';
        let missingIndices: number[] = [];

        switch (level) {
            case 1:
                // 3-letter, First or Last missing
                word = getRandomWord(threeLetterWords);
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
                word = getRandomWord(threeLetterWords);
                missingIndices = [1];
                maskedWord = `${word[0]} _ ${word[2]}`;
                break;

            case 3:
                // 4-letter, First or Last missing
                word = getRandomWord(fourLetterWords);
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
                word = getRandomWord(fourLetterWords);
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

        problems.push({ word, maskedWord, missingIndices, id });
    }

    return problems;
};
