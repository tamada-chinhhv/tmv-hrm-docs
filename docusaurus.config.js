/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TMV HRM Docs',
  tagline: 'Tài liệu hệ thống Quản lý Nhân sự TMV',
  favicon: 'img/favicon.ico',

  url: 'https://hrm.tamada.vn',
  baseUrl: '/',

  organizationName: 'tamada-chinhhv',
  projectName: 'tmv-hrm-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en', 'ja'],
    localeConfigs: {
      vi: { label: 'Tiếng Việt', direction: 'ltr' },
      en: { label: 'English', direction: 'ltr' },
      ja: { label: '日本語', direction: 'ltr' },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/tamada-chinhhv/tmv-hrm-docs/edit/main/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      navbar: {
        title: 'HRM Docs',
        logo: {
          alt: 'TMV HRM',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'navbar.docs',
          },
          {
            href: 'https://hrm.tamada.vn',
            label: 'navbar.hrmApp',
            position: 'left',
          },
          {
            href: 'https://github.com/tamada-chinhhv/tmv-hrm-docs',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'footer.docs',
            items: [
              {
                label: 'footer.intro',
                to: '/docs/intro',
              },
              {
                label: 'footer.quickStart',
                to: '/docs/quick-start',
              },
            ],
          },
          {
            title: 'footer.links',
            items: [
              {
                label: 'footer.hrmProduction',
                href: 'https://hrm.tamada.vn',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/tamada-chinhhv/tmv-hrm-docs',
              },
              {
                label: 'footer.reportIssue',
                href: 'https://github.com/tamada-chinhhv/tmv-hrm-docs/issues/new',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} TMV. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
    }),
};

module.exports = config;
