# Kiddo Codebase Overview

This document provides a high-level overview of the Kiddo Puzzle Generator codebase, explaining the project structure, key components, and how the generation logic works.

## Project Structure

The project is a **React** application built with **Vite** and **TypeScript**. It maps to a standard React directory structure:

- **src/**
  - **components/**: UI components for the configuration panel and puzzle sheets.
  - **context/**: Global state management.
  - **data/**: Static data like word lists.
  - **layouts/**: Layout wrappers, specifically for printing.
  - **utils/**: Core logic helping functions and generators.

## Key Files & Modules

### 1. Global State (`src/context/SettingsContext.tsx`)
- **Purpose**: Manages the application state (e.g., current puzzle type, difficulty level, layout settings).
- **Mechanism**: React Context API.
- **Exports**: `SettingsProvider` (wrapper) and `useSettings` (hook).
- **Key Data**: `puzzleType` ('math' | 'english'), `layout` (rows/cols/pages), `mathLevel`, `englishLevel`.

### 2. Configuration (`src/components/ConfigurationPanel.tsx`)
- **Purpose**: The sidebar UI where users select their preferences.
- **Features**:
  - Updates `SettingsContext`.
  - Hides automatically when printing via CSS classes (`.no-print`).
  - Contains the "Generate New Puzzles" and "Print" buttons.

### 3. Layout Handling (`src/layouts/PrintLayout.tsx`)
- **Purpose**: A wrapper component to ensure puzzle sheets conform to A4 dimensions on screen and print correctly.
- **Behavior**: Uses `PrintLayout.module.css` to define strict width/margins that are overridden by `@media print` styles for the actual print job.

### 4. Math Puzzles
- **Logic**: `src/utils/mathGenerator.ts`
  - Generates addition problems based on 6 difficulty levels.
  - Handles constraints (e.g., "sums to 18", "no carry", "3-digit").
  - Implements "Mixed Difficulty" logic (20% chance of easier problems).
- **UI**: `src/components/MathSheet.tsx`
  - Renders the grid of problems.
  - Handles the visual "double answer line" rendering.
  - Supports color-coded numbers if enabled.

### 5. English Puzzles
- **Logic**: `src/utils/englishGenerator.ts`
  - Selects words from `src/data/wordList.ts`.
  - Creates "problems" by masking specific letters (e.g., `C _ T`).
  - Levels determine which letters are hidden (first/last, middle, random).
- **UI**: `src/components/EnglishSheet.tsx`
  - Renders words in large, clear type.
  - Supports "Spelling Mode" (blanks) and "Reading Mode" (full words).

## Styling Strategy

- **CSS Modules**: Used for component-specific styles (e.g., `MathSheet.module.css`) to prevent class name collisions.
- **Global CSS**: `src/index.css` handles:
  - Global font definitions ('Fredoka One', 'Comic Neue').
  - Print-specific overhead (hiding the sidebar, resetting margins).

## How Generation Works

1. User changes settings (e.g., updates `mathLevel`).
2. `useSettings` hook updates the Context state.
3. `MathSheet` or `EnglishSheet` (depending on `puzzleType`) listens to these changes.
4. A `useEffect` hook triggers the generator utility (`generateMathProblems`).
5. The generator creates a new array of problem objects.
6. The component renders these objects into the DOM grid.
7. If "Generate New Puzzles" is clicked, a `generationTrigger` counter increments, re-firing the effect without changing other settings.
