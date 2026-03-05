// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Crossplane Provider Docs',
  tagline: 'Documentation for SAP Crossplane Providers',
  favicon: 'img/co_axolotl.png',

  url: 'https://sap.github.io',
  baseUrl: '/crossplane-provider-docs/',

  organizationName: 'SAP',
  projectName: 'crossplane-provider-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

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
          exclude: [
            // exclude everything in the btp submodule except the docs/ subfolder
            'crossplane-provider-btp/!(docs)/**',
            'crossplane-provider-btp/!(docs)',
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
                to: '/docs/crossplane-provider-btp/docs/user/external-name',
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

  // static/ contains all images for this repo (img/ subfolder)
  // Each submodule's docs/ directory is added so that images in docs/img/ are served at /img/...
  // To add a new submodule, append its docs path, e.g. 'docs/crossplane-provider-xyz/docs'
  staticDirectories: ['static', 'docs/crossplane-provider-btp/docs'],
};

module.exports = config;
