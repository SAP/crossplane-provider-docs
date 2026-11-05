import React, { useState } from 'react';
import styles from './Checklist.module.css';

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function Checklist({ items = [] }) {
  const [checked, setChecked] = useState(() => items.map(() => false));

  const total = items.length;
  const done = checked.filter(Boolean).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  const toggle = (i) =>
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  const onKeyDown = (e, i) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(i);
    }
  };

  return (
    <div className={`${styles.checklist} ${allDone ? styles.allDone : ''}`}>
      <div className={styles.header}>
        <span className={styles.label}>
          {allDone ? 'All checks complete' : `${done} of ${total} complete`}
        </span>
        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ul className={styles.list}>
        {items.map((item, i) => (
          <li
            key={i}
            className={`${styles.item} ${checked[i] ? styles.checked : ''}`}
            role="checkbox"
            aria-checked={checked[i]}
            tabIndex={0}
            onClick={() => toggle(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className={styles.box}>{checked[i] && <CheckIcon />}</span>
            <span className={styles.content}>
              <strong className={styles.title}>{item.title}</strong>
              {item.text && <span className={styles.text}>{item.text}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
