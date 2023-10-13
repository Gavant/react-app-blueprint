/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

const coreFolders = ['components', 'constants', 'hooks', 'stores', 'utils'];

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    projectDetailsSidebar: [
        {
            type: 'doc',
            id: 'intro',
            label: 'Project Details',
        },
    ],
    apiSidebar: [
        {
            type: 'doc',
            id: 'api/intro',
            label: 'Intro',
        },
        {
            type: 'category',
            label: 'Core',
            // @ts-ignore
            items: [
                ...coreFolders.map((folder) => ({
                    type: 'category',
                    label: folder,
                    items: require(`./docs/api/core/${folder}/typedoc-sidebar.cjs`),
                })),
            ],
        },
    ],
};

module.exports = sidebars;
