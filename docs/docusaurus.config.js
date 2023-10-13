// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const coreFolders = ['components', 'constants', 'hooks', 'stores', 'utils'];

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: '{{APP_NAME}}',
    tagline: '',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://your-docusaurus-test-site.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'facebook', // Usually your GitHub org/user name.
    projectName: 'docusaurus', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    plugins: [
        ...coreFolders.map((folder) => [
            'docusaurus-plugin-typedoc',
            {
                id: folder,
                entryPoints: [`../app/src/core/${folder}`],
                entryPointStrategy: 'expand',
                exclude: ['**/*+(stories).ts', '**/*+(stories).tsx', '**/*+(test).ts', '**/*+(test).tsx'],
                parametersFormat: 'table',
                propertiesFormat: 'table',
                enumMembersFormat: 'table',
                typeDeclarationFormat: 'table',
                skipErrorChecking: true,
                sourceLinkTemplate: '/{path}?#L{line}',
                useCodeBlocks: true,
                plugin: ['typedoc-plugin-rename-defaults'],
                expandObjects: true,
                tsconfig: '../app/tsconfig.json',
                out: `docs/api/core/${folder}`,
                sidebar: {
                    autoConfiguration: true,
                    filteredIds: [`api/core/${folder}/index`],
                },
            },
        ]),
    ],

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: '{{APP_NAME}}',
                logo: {
                    alt: 'My Site Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'projectDetailsSidebar',
                        position: 'left',
                        label: 'Project Details',
                    },
                    {
                        type: 'docSidebar',
                        sidebarId: 'apiSidebar',
                        position: 'left',
                        label: 'API',
                    },
                    {
                        type: 'docsVersionDropdown',
                        position: 'right',
                    },
                    {
                        href: '#',
                        label: 'Repo',
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
                                label: 'API',
                                to: '/docs/core/components/modules',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'Repo',
                                href: '#',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} {{APP_NAME}}. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
