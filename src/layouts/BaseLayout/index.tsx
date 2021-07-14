import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
