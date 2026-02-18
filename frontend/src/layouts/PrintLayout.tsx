/**
 * PrintLayout.tsx
 * 
 * A wrapper component that enforces the A4/Letter size layout constraints.
 * It ensures the content inside (the puzzle sheet) is centered and scaled correctly.
 * It interacts with CSS to handle the translation between screen view and print view.
 */

import React, { type ReactNode } from 'react';
import styles from './PrintLayout.module.css';

interface PrintLayoutProps {
    children: ReactNode;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    );
};
