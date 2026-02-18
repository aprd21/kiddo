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
