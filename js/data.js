/*
  Single source of truth for Projects, Written Works, and Contact.

  Add new portfolio entries here when you are ready to publish them.
  Set pinned: true to feature an entry on the homepage and in the archive's
  "Pinned favorites" section.
*/

const CONTACT = {
  email: 'SavannahNSoto@Outlook.com',
  github: 'https://github.com/savannahsoto',
  linkedin: 'https://www.linkedin.com/in/savannah-soto-238306283'
};

const PROJECTS = [
  {
    id: 'ev-battery-sim',
    pinned: true,
    icon: 'battery',
    image: null,
    title: 'EV Battery Degradation Simulator',
    blurb: "A smart little tool that shows how an electric vehicle battery's health changes over time.",
    tags: ['Python', 'Streamlit'],
    links: [
      { label: 'GitHub', url: 'https://github.com/savannahsoto/ev-battery-sim' },
      { label: 'Live Demo', url: 'https://ev-battery-sim-savannah.streamlit.app/' }
    ],
    back: {
      challenge: 'Turning complex battery degradation factors, like temperature and usage, into a simple Python model that still felt realistic and easy to understand.'
    }
  }
];

const WRITINGS = [];
