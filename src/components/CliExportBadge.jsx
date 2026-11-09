import React from 'react';
import styles from './CliExportBadge.module.css';

export default function CliExportBadge() {
  return (
    <span
      className={`badge badge--success ${styles.badge}`}
      role="img"
      aria-label="CLI export supported"
      title="CLI export supported"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}
