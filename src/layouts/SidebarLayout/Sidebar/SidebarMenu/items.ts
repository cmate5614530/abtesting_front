import { ReactNode } from 'react';

import AnalyticsTwoToneIcon from '@material-ui/icons/AnalyticsTwoTone';
import HealthAndSafetyTwoToneIcon from '@material-ui/icons/HealthAndSafetyTwoTone';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: 'Menu Heading',
    items: [
      {
        name: 'Example Page',
        icon: AnalyticsTwoToneIcon,
        link: '/preview/dashboards/analytics'
      },
      {
        name: 'With Sub-Menu',
        icon: HealthAndSafetyTwoToneIcon,
        link: '/submenu',
        items: [
          {
            name: 'Sub-menu Item 1',
            badge: 'Hot',
            link: ''
          },
          {
            name: 'Sub-menu Item 2',
            link: ''
          }
        ]
      }
    ]
  }
];

export default menuItems;
