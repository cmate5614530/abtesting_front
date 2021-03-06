import { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Guest from 'src/components/Guest';
import Authenticated from 'src/components/Authenticated';

import DomainDetailsPage from 'src/content/pages/DomainDetails';
import DocumentPage from 'src/content/pages/Document';
import NewTest from 'src/content/pages/NewTest';
import ReportPage from 'src/content/pages/report';
import ProfilePage from 'src/content/pages/profile';
type Routes = {
  exact?: boolean;
  path?: string | string[];
  guard?: any;
  layout?: any;
  component?: any;
  routes?: Routes;
}[];

export const renderRoutes = (routes: Routes = []): JSX.Element => (
  <Suspense fallback={<SuspenseLoader />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes: Routes = [
  {
    path: '/dashboard',
    guard: Authenticated,
    layout: SidebarLayout,
    routes: [
      {
        exact: true,
        path: '/dashboard/analytics',
        component: lazy(() => import('src/content/dashboards/Analytics'))
      },
      {
        component: () => <Redirect to="/status/404" />
      }
    ]
  },
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/dashboard/analytics" />
  },
  {
    exact: true,
    path:'/profile',
    guard: Authenticated,
    layout: SidebarLayout,
    component: ProfilePage
  },
  {
    exact:true,
    path:'/document',
    guard:Authenticated,
    layout:SidebarLayout,
    component: DocumentPage
  },
  {
    exact: true,
    guard: Authenticated,
    layout: SidebarLayout,
    path: '/domain/details/:id',
    component: DomainDetailsPage
  },
  {
    exact: true,
    guard: Authenticated,
    layout: SidebarLayout,
    path: '/domain/details/:id/new',
    component: NewTest
  },
  {
    exact: true,
    guard: Authenticated,
    layout: SidebarLayout,
    path: '/domain/details/:id/:expid',
    component: ReportPage
  },
  {
    exact: true,
    guard: Guest,
    path: '/login',
    component: lazy(() => import('src/content/pages/Auth/Login/Basic'))
  },
  {
    exact: true,
    guard: Guest,
    path: '/register',
    component: lazy(() => import('src/content/pages/Auth/Register/Basic'))
  },
  {
    exact: true,
    path: '/recover-password',
    component: lazy(() => import('src/content/pages/Auth/RecoverPassword'))
  },
  {
    exact: true,
    path: '/status/404',
    component: lazy(() => import('src/content/pages/Status/Status404'))
  },
  // {
  //   path: '*',
  //   layout: BaseLayout,
  //   routes: [
  //     {
  //       component: () => <Redirect to="/" />
  //     }
  //   ]
  // }
];

export default routes;
