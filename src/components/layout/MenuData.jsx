import {
  Contact,
  LayoutDashboard,
  CheckCheck,
  ArrowLeftRight,
  ListTodo,
  Flame,
  LayoutList,
} from 'lucide-react';
export const LeftSideMenuData = [
  {
    name: 'Dashboard',
    link: '/',
    icons: <LayoutDashboard size={16} />,
    type: ['ADMIN', 'MANAGER'],
  },

  {
    name: 'Users',
    link: '/users',
    icons: <Contact size={16} />,
    type: ['ADMIN', 'MANAGER'],
  },
  {
    name: 'Categories',
    link: '/categories',
    icons: <Flame size={16} />,
    type: ['ADMIN', 'MANAGER'],
  },
  {
    name: 'Crime Insights',
    link: '/crimes-insights',
    icons: <LayoutList size={16} />,
    type: ['ADMIN', 'MANAGER'],
  },
  {
    name: 'Crimes',
    link: '/crimes',
    icons: <ArrowLeftRight size={16} />,
    type: ['ADMIN', 'MANAGER'],
  },
  {
    name: 'analytics',
    link: '/analytics',
    icons: <CheckCheck size={16} />,
    type: ['ADMIN', 'MANAGER'],
  },
  {
    name: 'Reports',
    link: '/reports',
    icons: <ListTodo size={16} />,
    type: ['ADMIN', 'MANAGER'],
  },
  {
    name: 'Notifications',
    link: '/notifications',
    icons: <CheckCheck size={16} />,
    type: ['ADMIN', 'MANAGER'],
  },
];
