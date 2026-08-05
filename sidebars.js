/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: ['intro', 'quick-start'],
    },
    {
      type: 'category',
      label: 'For employees',
      items: [
        'for-employees/login-and-account',
        'for-employees/overview',
        'for-employees/check-in-out',
        'for-employees/leave',
        'for-employees/calendar',
        'for-employees/payslip',
      ],
    },
    {
      type: 'category',
      label: 'For managers',
      items: [
        'for-managers/team-attendance',
        'for-managers/approve-leave',
        'for-managers/create-overtime-batch',
        'for-managers/approve-overtime',
      ],
    },
    {
      type: 'category',
      label: 'For HR / Admin',
      items: [
        'for-hr-admin/employees',
        'for-hr-admin/documents',
        'for-hr-admin/payroll',
        'for-hr-admin/system-settings',
        'for-hr-admin/overtime-setup',
        'for-hr-admin/hieu-hi',
        'for-hr-admin/permissions-overview',
        'for-hr-admin/month-end',
      ],
    },
    {
      type: 'category',
      label: 'Support',
      items: ['faq'],
    },
    {
      type: 'category',
      label: 'Appendix',
      collapsed: true,
      items: ['appendix/technical-reference'],
    },
  ],
};

module.exports = sidebars;
