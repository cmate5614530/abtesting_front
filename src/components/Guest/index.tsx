import { FC, ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';

interface GuestProps {
  children?: ReactNode;
}

const Guest: FC<GuestProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect to="/preview/dashboards/analytics" />;
  }

  return <>{children}</>;
};

Guest.propTypes = {
  children: PropTypes.node
};

export default Guest;
