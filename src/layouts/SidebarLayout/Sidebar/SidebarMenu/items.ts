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
    heading: '',
    items: [
      {
        name: 'Overview',
        icon: AnalyticsTwoToneIcon,
        link: '/submenu',
        items:[
          {
            name:'Overview1',
            link:'/'
          },
          {
            name:'Overview2',
            link:'/'
          }
        ]
      },
      {
        name: 'Testing',
        icon: HealthAndSafetyTwoToneIcon,
        link: '/submenu',
        items: [
          
          {
            name: 'All Previous Test',
            badge: '',
            link: '/dashboard/analytics'
          },
          
        ]
      }
    ]
  },
  {
    heading:'APPLICATIONS',
    items:[
      {
        name: 'Account',
        icon: AnalyticsTwoToneIcon,
        link: '/submenu',
        items:[
          {
            name:'Overview1',
            link:'/'
          },
          {
            name:'Overview2',
            link:'/'
          }
        ]
      },
      {
        name: 'Dashboards',
        icon: AnalyticsTwoToneIcon,
        link: '/submenu',
        items:[
          {
            name:'Overview1',
            link:'/'
          },
          {
            name:'Overview2',
            link:'/'
          }
        ]
      },
      {
        name:'Integration',
        icon: AnalyticsTwoToneIcon,
        link:'/document'
      }
    ]
  }
];

export default menuItems;
