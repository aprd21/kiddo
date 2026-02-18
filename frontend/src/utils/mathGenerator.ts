export interface MathProblem {
    id: string; // Unique ID for React keys
    top: number; // Top operand
    bottom: number; // Bottom operand
    operator: '+'; // Currently only addition is supported
    third?: number; // Optional third operand for Level 6
}

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates an array of math problems.
 * @param mixed If true, introduces a chance for problems to be one level easier
 * @param mixRatio The percentage (0-100) of problems that should be from the lower level
 */
export const generateMathProblems = (level: number, count: number, mixed: boolean = false, mixRatio: number = 20): MathProblem[] => {
    const problems: MathProblem[] = [];

    for (let i = 0; i < count; i++) {
        // Determine effective level for this problem
        let effectiveLevel = level;
        if (mixed && level > 1) {
            // Convert percentage to decimal probability
            if (Math.random() < (mixRatio / 100)) {
                // Chance to pick a lower level (level - 1)
                effectiveLevel = getRandomInt(1, level - 1);
            }
        }

        problems.push(generateSingleProblem(effectiveLevel));
    }

    return problems;
};

/**
 * Generates a single math problem based on the specified difficulty level.
 * @param level The difficulty level (1-6)
 * @returns A MathProblem object
 */
const generateSingleProblem = (level: number): MathProblem => {
    const id = Math.random().toString(36).substr(2, 9);

    switch (level) {
        case 1:
            // Level 1: Sums <= 18 (Single digits)
            // Generates two random single-digit numbers (1-9).
            return {
                top: getRandomInt(1, 9),
                bottom: getRandomInt(1, 9),
                operator: '+',
                id
            };

        case 2:
            // 2-digit + 2-digit (No carry)
            // Unit sum <= 9, Ten sum <= 9
            const topUnit2 = getRandomInt(1, 8);
            const bottomUnit2 = getRandomInt(1, 9 - topUnit2);
            const topTen2 = getRandomInt(1, 8);
            const bottomTen2 = getRandomInt(1, 9 - topTen2);
            return {
                top: topTen2 * 10 + topUnit2,
                bottom: bottomTen2 * 10 + bottomUnit2,
                operator: '+',
                id
            };

        case 3:
            // 2-digit + 2-digit (With carry)
            // Ensure unit sum >= 10 OR ten sum >= 10 (usually unit carry is what we mean)
            // We want at least one carry, but random numbers often have it. 
            // To strictly ensure carry: make unit sum > 9.
            const tU3 = getRandomInt(1, 9);
            const bU3 = getRandomInt(10 - tU3, 9);
            const tT3 = getRandomInt(1, 8);
            const bT3 = getRandomInt(1, 8); // Keep sums reasonable

            return {
                top: tT3 * 10 + tU3,
                bottom: bT3 * 10 + bU3,
                operator: '+',
                id
            };

        case 4:
            // 3-digit + 3-digit (No carry)
            const tH4 = getRandomInt(1, 8); const bH4 = getRandomInt(1, 9 - tH4);
            const tT4 = getRandomInt(0, 8); const bT4 = getRandomInt(0, 9 - tT4);
            const tU4 = getRandomInt(0, 8); const bU4 = getRandomInt(0, 9 - tU4);
            return {
                top: tH4 * 100 + tT4 * 10 + tU4,
                bottom: bH4 * 100 + bT4 * 10 + bU4,
                operator: '+',
                id
            };

        case 5:
            // 3-digit + 3-digit (With carry)
            return {
                top: getRandomInt(100, 899),
                bottom: getRandomInt(100, 899),
                operator: '+',
                id
            };

        case 6:
            // 3 numbers addition (Single or Double digit? Let's assume 2-digit for now given progression)
            // Or 1-digit 3 numbers. The prompt said "adding 3 numbers". 
            // Let's do 2-digit 3 numbers for difficulty.
            return {
                top: getRandomInt(10, 99),
                bottom: getRandomInt(10, 99),
                third: getRandomInt(10, 99),
                operator: '+',
                id
            };

        default:
            return { top: 1, bottom: 1, operator: '+', id };
    }
};
