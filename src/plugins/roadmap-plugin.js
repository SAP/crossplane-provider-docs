// @ts-nocheck
/*
 * Roadmap plugin — builds a per-provider roadmap page at build time from GitHub issues.
 * Static output: the fetch runs during `npm run build`, no client-side API calls.
 * Renderer: ../components/Roadmap.jsx (+ .module.css).
 *
 * Opt in (from a provider's own repo, arrives via the daily submodule bump):
 *   1. docs/roadmap.config.json — { repo, roadMapLabelPrefix, title, navbarLabel }
 *   2. docs/roadmap.mdx — imports @site/src/components/Roadmap and renders
 *      <Roadmap provider="<provider-dir>" />
 * discoverConfigs scans docs/*(/docs)/roadmap.config.json, so adding a provider needs
 * no change here.
 *
 * What shows: an issue carries a `<roadMapLabelPrefix><version>` label (e.g.
 * roadmap-item/v2.1.0); it lists under each such version. A version drops off once its
 * GitHub release/tag exists (shipped releases live on the releases page).
 *
 * Trust: applying the label needs repo triage/write, so outsiders can't self-add.
 * Community-authored issues are hidden if the title was renamed after labeling
 * (see isTrusted); team-authored issues are trusted. React-escaped titles, no HTML injection.
 *
 * Refresh: register in docusaurus.config.js. Pass GITHUB_TOKEN (5000/hr vs 60/hr).
 * A daily `schedule:` rebuild of main re-runs the fetch; no commit, no submodule bump.
 * Local: GITHUB_TOKEN=$(gh auth token) npm run build
 */
const fs = require('fs');
const path = require('path');

const MAX_PAGES = 10; // 1000 items at per_page=100; warns if a list exceeds this

module.exports = function roadmapPlugin(context) {
  const configs = discoverConfigs(context.siteDir);

  return {
    name: 'roadmap-plugin',

    async loadContent() {
      const token = process.env.GITHUB_TOKEN; // optional; 5000/hr vs 60/hr unauth
      const headers = {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const out = [];
      for (const cfg of configs) {
        out.push(await buildProviderRoadmap(cfg, headers));
      }
      return out;
    },

    async contentLoaded({ content, actions }) {
      const byProvider = {};
      for (const prov of content) byProvider[prov.provider] = prov;
      actions.setGlobalData({ byProvider });
    },
  };
};

// Fetch a provider's roadmap issues, group them by version label, and mark which
// versions have already been released. Returns the data one Roadmap page renders.
async function buildProviderRoadmap(cfg, headers) {
  const prefix = cfg.roadMapLabelPrefix;

  // (1) discover roadmap-item/* labels (GitHub has no label-prefix filter)
  const labels = await fetchAllPages(`https://api.github.com/repos/${cfg.repo}/labels`, headers, 'labels', cfg.repo);
  const versionLabels = labels.map((l) => l.name).filter((n) => n && n.startsWith(prefix));
  if (versionLabels.length === 0) {
    return { provider: cfg.provider, title: cfg.title, repo: cfg.repo, labelPrefix: prefix, versions: [] };
  }

  // (2) one GET /issues?labels=<label> per version label. /issues?labels= is AND, so a
  // single label per call is how you OR across versions. Dedupe issues by number so an
  // issue under multiple version labels is trust-checked once and grouped under each.
  const byVersion = {};
  const seen = new Set();
  for (const versionLabel of versionLabels) {
    const url = `https://api.github.com/repos/${cfg.repo}/issues?labels=${encodeURIComponent(versionLabel)}&state=all`;
    const issues = await fetchAllPages(url, headers, 'issues', cfg.repo);
    for (const it of issues) {
      if (seen.has(it.number)) continue;
      seen.add(it.number);
      await groupIssue(cfg, it, prefix, headers, byVersion);
    }
  }

  // (3) fetch release tags → a version drops off the roadmap once its tag exists
  const releases = await fetchAllPages(`https://api.github.com/repos/${cfg.repo}/releases`, headers, 'releases', cfg.repo);
  const releaseTags = new Set(releases.filter((r) => !r.draft && r.tag_name).map((r) => r.tag_name));

  const versions = Object.keys(byVersion).map((v) => ({
    version: v,
    issues: byVersion[v],
    released: releaseTags.has(v) || releaseTags.has(`v${v}`),
  }));
  return { provider: cfg.provider, title: cfg.title, repo: cfg.repo, labelPrefix: prefix, versions };
}

// Scan docs/*/docs/roadmap.config.json for opt-in providers.
function discoverConfigs(siteDir) {
  const docsDir = path.join(siteDir, 'docs');
  let entries = [];
  try {
    entries = fs.readdirSync(docsDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const configs = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const cfgPath = path.join(docsDir, e.name, 'docs', 'roadmap.config.json');
    if (!fs.existsSync(cfgPath)) continue;
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    cfg.provider = e.name;
    configs.push(cfg);
  }
  return configs;
}

// Fetch every page of a paginated GitHub list endpoint, concatenated. `what` labels errors.
async function fetchAllPages(baseUrl, headers, what, repo) {
  const all = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const sep = baseUrl.includes('?') ? '&' : '?';
    const res = await fetch(`${baseUrl}${sep}per_page=100&page=${page}`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status} (${what}) for ${repo}: ${await res.text()}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    if (page === MAX_PAGES) console.warn(`roadmap-plugin: ${what} for ${repo} exceeded ${MAX_PAGES} pages; results truncated`);
  }
  return all;
}

// Add an issue to byVersion under each of its roadmap-item/* labels. Skips PRs and
// (for community authors) issues that fail the rename-after-label trust check.
async function groupIssue(cfg, it, prefix, headers, byVersion) {
  if (it.pull_request) return;
  const vLabels = (it.labels || [])
    .map((l) => (typeof l === 'string' ? l : l.name))
    .filter((n) => n && n.startsWith(prefix));
  if (vLabels.length === 0) return;
  if (!(await isTrusted(cfg, it, prefix, headers))) return;
  for (const label of vLabels) {
    const v = label.slice(prefix.length);
    (byVersion[v] ??= []).push({ number: it.number, title: it.title, url: it.html_url });
  }
}

// Community-authored issues: drop if the title was renamed after the roadmap label was
// applied. A maintainer reviews the title when labeling; a later rename is unreviewed.
// Fail-closed: missing timeline data returns false.
const TEAM_ASSOC = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

async function isTrusted(cfg, issue, prefix, headers) {
  if (TEAM_ASSOC.has(issue.author_association)) return true;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${cfg.repo}/issues/${issue.number}/timeline?per_page=100`,
      { headers: { ...headers, Accept: 'application/vnd.github+json' } });
    if (!res.ok) return false; // fail-closed
    return titleTrustedFromTimeline(await res.json(), prefix);
  } catch {
    return false; // fail-closed
  }
}

// Trusted if the roadmap label was not applied before the last title rename, i.e. the
// current title is the one a maintainer saw when labeling. Pure; takes timeline events.
// Fail-closed: no roadmap-label event → false.
function titleTrustedFromTimeline(events, prefix) {
  if (!Array.isArray(events)) return false;
  let lastLabeledAt = 0;
  let lastRenamedAt = 0;
  for (const e of events) {
    const t = e.created_at ? new Date(e.created_at).getTime() : 0;
    if (e.event === 'labeled' && e.label && e.label.name && e.label.name.startsWith(prefix)) {
      if (t > lastLabeledAt) lastLabeledAt = t;
    } else if (e.event === 'renamed') {
      if (t > lastRenamedAt) lastRenamedAt = t;
    }
  }
  if (lastLabeledAt === 0) return false;
  return lastRenamedAt <= lastLabeledAt;
}
