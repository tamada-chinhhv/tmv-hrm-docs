/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: ['intro', 'quick-start', 'requirements'],
    },
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'accounts',
        'employee-management',
        'calendar',
        'roles-permissions',
        {
          type: 'category',
          label: 'Module Guides',
          items: [
            'module-guides/account',
            'module-guides/overview',
            'module-guides/departments',
            'module-guides/documents',
            'module-guides/payroll',
            'module-guides/system-config',
          ],
        },
        'attendance',
        'leave-requests',
        'reports',
      ],
    },
    {
      type: 'category',
      label: 'Admin & Operations',
      items: ['operations', 'handover-checklist'],
    },
    {
      type: 'category',
      label: 'Support',
      items: ['faq'],
    },
  ],
};

module.exports = sidebars;
