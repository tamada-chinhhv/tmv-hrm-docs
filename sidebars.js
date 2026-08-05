/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'sidebar.category.intro',
      collapsed: false,
      items: ['intro', 'quick-start', 'requirements'],
    },
    {
      type: 'category',
      label: 'sidebar.category.userGuide',
      items: [
        'accounts',
        'employee-management',
        'calendar',
        'roles-permissions',
        {
          type: 'category',
          label: 'sidebar.category.moduleGuides',
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
      label: 'sidebar.category.adminOps',
      items: ['operations', 'handover-checklist'],
    },
    {
      type: 'category',
      label: 'sidebar.category.support',
      items: ['faq'],
    },
  ],
};

module.exports = sidebars;
