import React, { useMemo, useState } from 'react';
import styles from './SortableTable.module.css';

function textOf(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement(node)) return textOf(node.props.children);
  return '';
}

function findByType(node, type) {
  if (Array.isArray(node)) {
    for (const n of node) {
      const found = findByType(n, type);
      if (found) return found;
    }
    return null;
  }
  if (!React.isValidElement(node)) return null;
  if (node.type === type) return node;
  return findByType(node.props.children, type);
}

function collect(node, type, out = []) {
  if (Array.isArray(node)) {
    node.forEach((n) => collect(n, type, out));
    return out;
  }
  if (!React.isValidElement(node)) return out;
  if (node.type === type) {
    out.push(node);
    return out;
  }
  collect(node.props.children, type, out);
  return out;
}

export default function SortableTable({ children, searchPlaceholder = 'Search…' }) {
  const table = findByType(children, 'table');
  const thead = table && findByType(table, 'thead');
  const tbody = table && findByType(table, 'tbody');

  const headerCells = thead ? collect(collect(thead, 'tr')[0], 'th') : [];
  const bodyRows = tbody ? collect(tbody, 'tr') : [];

  const data = useMemo(
    () =>
      bodyRows.map((tr, i) => {
        const firstCell = collect(tr, 'td')[0];
        return {
          key: i,
          tr,
          name: textOf(firstCell).trim(),
          haystack: textOf(tr).toLowerCase(),
        };
      }),
    [bodyRows],
  );

  const [query, setQuery] = useState('');
  const [sortDir, setSortDir] = useState(null); // null | 'asc' | 'desc'

  const view = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q ? data.filter((r) => r.haystack.includes(q)) : data.slice();
    if (sortDir) {
      rows.sort((a, b) =>
        sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
    }
    return rows;
  }, [data, query, sortDir]);

  if (!table) return children;

  const toggleSort = () =>
    setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));

  const ariaSort =
    sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none';
  const arrow = sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : '↕';

  return (
    <div className={styles.wrap}>
      <input
        type="search"
        className={styles.search}
        placeholder={searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={searchPlaceholder}
      />
      <table>
        <thead>
          <tr>
            {headerCells.map((cell, i) =>
              i === 0
                ? React.cloneElement(cell, {
                    key: i,
                    'aria-sort': ariaSort,
                    children: (
                      <button
                        type="button"
                        className={styles.sortBtn}
                        onClick={toggleSort}
                      >
                        {cell.props.children}
                        <span className={styles.arrow} aria-hidden="true">
                          {arrow}
                        </span>
                      </button>
                    ),
                  })
                : React.cloneElement(cell, { key: i }),
            )}
          </tr>
        </thead>
        <tbody>
          {view.length === 0 ? (
            <tr>
              <td colSpan={headerCells.length} className={styles.empty}>
                No resources match “{query}”.
              </td>
            </tr>
          ) : (
            view.map((r) => React.cloneElement(r.tr, { key: r.key }))
          )}
        </tbody>
      </table>
    </div>
  );
}
