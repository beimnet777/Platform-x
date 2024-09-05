type FAQItem = {
  question: string;
  answer: string;
};

export const desktopHeaderPhrase = ['Frequently asked', 'questions'];
export const mobileHeaderPhrase = ['Frequently', 'asked', 'questions'];
export const animate = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  open: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 1, delay: 0.1 * i, ease: [0.33, 1, 0.68, 1] },
  }),
};

export const faqData: FAQItem[] = [
  {
    question: 'What is Platform X, and who is it for?',
    answer:
      'Platform X is a centralized tool for managing data collection, task assignments, and user roles, designed for corporate entities, data analysts, finance managers, and data collection agents.',
  },
  {
    question: 'How do I onboard a new corporate entity?',
    answer:
      'To onboard a new corporate entity, the Kifiya Super Admin initiates the process by creating a Corporate Super Admin, setting up corporate agreements, and activating the account upon payment confirmation.',
  },
  {
    question: 'What types of tasks can be managed in Platform X?',
    answer:
      'Platform X supports various task types, including text, audio, video, image data collection, and annotation tasks, which can be assigned to data collection agents and monitored in real time.',
  },
  {
    question: 'How does data validation work in Platform X?',
    answer:
      'Data collected by agents undergoes automated and manual validation to ensure accuracy, completeness, and adherence to quality standards, with feedback provided if corrections are needed.',
  },
  {
    question: 'What subscription plans are available for Platform X?',
    answer:
      'Platform X offers multiple subscription tiers such as Basic, Premium, and Enterprise, with features tailored to different corporate needs, including user management, task automation, and data monitoring.',
  },
  {
    question: 'How is security handled in Platform X?',
    answer:
      'Platform X uses secure authentication methods, including OAuth and SSO, alongside encryption and role-based access control, to ensure the security of all user data and transactions.',
  },
];
