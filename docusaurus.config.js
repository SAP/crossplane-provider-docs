// @ts-check
// remark-directive is ESM-only; require() returns the module namespace object
const remarkDirective = (() => {
  const m = require('remark-directive');
  return m.default ?? m;
})();
const remarkImageLight = require('./src/plugins/remark-image-light');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Crossplane Provider Docs',
  tagline: 'Documentation for SAP Crossplane Providers',
  favicon: 'img/co_axolotl.png',

  url: 'https://sap.github.io',
  baseUrl: '/crossplane-provider-docs/',

  organizationName: 'SAP',
  projectName: 'crossplane-provider-docs',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [remarkDirective, remarkImageLight],
          exclude: [
            // Exclude everything in a submodule except its docs/ subfolder.
            // Add two lines per new submodule, e.g. for crossplane-provider-hana:
            //   'crossplane-provider-hana/!(docs)/**',
            //   'crossplane-provider-hana/!(docs)',
            'crossplane-provider-btp/!(docs)/**',
            'crossplane-provider-btp/!(docs)',
            'crossplane-provider-hana/!(docs)/**',
            'crossplane-provider-hana/!(docs)',
          ],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Crossplane Provider Docs',
        logo: {
          alt: 'Crossplane Axolotl Logo',
          src: 'img/co_axolotl.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/SAP/crossplane-provider-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Contribution',
                to: '/docs/contribution/understand-providers',
              },
              {
                label: 'crossplane-provider-btp',
                to: '/docs/crossplane-provider-btp/docs/end-user-guides/import-landscape/external-name',
              },
              {
                label: 'crossplane-provider-hana',
                to: '/docs/crossplane-provider-hana/docs/contribution-notes/20250822-hana-x509-authentication',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/SAP/crossplane-provider-docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} SAP SE or an SAP affiliate company. All rights reserved.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
    }),

  // Each submodule's docs/ directory is added so that images in docs/img/ are served at /img/...
  // To add a new submodule, append its docs path, e.g. 'docs/crossplane-provider-xyz/docs'
  staticDirectories: ['static', 'docs/crossplane-provider-btp/docs', 'docs/crossplane-provider-hana/docs'],
};

module.exports = config;
