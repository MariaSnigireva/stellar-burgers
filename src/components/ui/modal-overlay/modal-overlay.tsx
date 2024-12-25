import styles from './modal-overlay.module.css';
import React from 'react';
export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div
    className={styles.overlay}
    onClick={onClick}
    data-testid='modal-overlay'
  />
);
