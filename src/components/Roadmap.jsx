import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from './Roadmap.module.css';

// Renders backtick spans as <code> elements, matching GitHub title rendering.
function renderTitle(title) {
  return title.split(/(`[^`]+`)/g).map((p, i) =>
    p.startsWith('`') && p.endsWith('`')
      ? <code key={i}>{p.slice(1, -1)}</code>
      : <React.Fragment key={i}>{p}</React.Fragment>,
  );
}

function cmpVersion(a, b) {
  return a.localeCompare(b, undefined, { numeric: true });
}

function searchUrl(repo, labelPrefix, version) {
  const q = `label:"${labelPrefix}${version}"`;
  return `https://github.com/${repo}/issues?q=${encodeURIComponent(q)}`;
}

function VersionBlock({ v, repo, labelPrefix }) {
  return (
    <section className={styles.versionBlock}>
      <div className={styles.versionHead}>
        <span className={styles.versionTag}>{v.version}</span>
        <a href={searchUrl(repo, labelPrefix, v.version)} target="_blank" rel="noreferrer"
           className={styles.searchLink} title="Search these issues on GitHub">
          issues on GitHub ↗
        </a>
      </div>
      <ul className={styles.issues}>
        {v.issues.map((i) => (
          <li key={i.number} className={styles.issue}>
            <a href={i.url} target="_blank" rel="noreferrer" className={styles.issueNo}>#{i.number}</a>
            <span className={styles.issueTitle}>{renderTitle(i.title)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Roadmap({ provider }) {
  const global = usePluginData('roadmap-plugin');
  const data = global?.byProvider?.[provider];
  if (!data) return <p>No roadmap data for {provider}.</p>;

  const upcoming = data.versions
    .filter((v) => !v.released)
    .sort((a, b) => cmpVersion(a.version, b.version));

  return (
    <div className={styles.sketch}>
      <p className={styles.subtitle}>Generated from GitHub issues · updated daily</p>
      {upcoming.length === 0 && <p>Nothing planned right now.</p>}
      {upcoming.map((v) => <VersionBlock key={v.version} v={v} repo={data.repo} labelPrefix={data.labelPrefix} />)}
    </div>
  );
}
