import React from 'react';
import styles from './CameraOverlay.module.css';

const CameraOverlay = () => (
  <div className={styles.overlay}>
    <div className={styles.scanLine}></div>
  </div>
);

export default CameraOverlay;
