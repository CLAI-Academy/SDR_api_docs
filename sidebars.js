// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  apiSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Contacts',
      items: [
        'contacts/create-contact',
        'contacts/bulk-upload',
        'contacts/list-contacts',
        'contacts/manage-contacts',
      ],
    },
    {
      type: 'category',
      label: 'Imports',
      items: [
        'imports/create-import',
      ],
    },
    {
      type: 'category',
      label: 'Campaigns',
      items: [
        'campaigns/manage-campaigns',
      ],
    },
    {
      type: 'category',
      label: 'Campaign Imports',
      items: [
        'campaign-imports/link-imports',
      ],
    },
    {
      type: 'category',
      label: 'Campaign Leads',
      items: [
        'campaign-leads/manage-campaign-leads',
      ],
    },
  ],
};

export default sidebars;
