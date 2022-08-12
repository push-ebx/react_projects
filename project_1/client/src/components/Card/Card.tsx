import React from 'react';
import styles from "./index.module.scss";

const Card = ({customClass, children}:{customClass?: string, children: React.ReactNode}) => {
  return (
    <div className={`${styles.card} ${customClass}`}>
      {children}
    </div>
  );
};

export {Card};