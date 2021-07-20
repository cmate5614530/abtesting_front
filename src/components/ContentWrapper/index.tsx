import { forwardRef } from 'react';
import { HTMLProps, ReactNode } from 'react';
// import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

interface ContentWrapperProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  title?: string;
}

const ContentWrapper = forwardRef<HTMLDivElement, ContentWrapperProps>(
  ({ children, title = '', ...rest }, ref) => {
    return (
      <>
        {/* <Helmet ref={ref as any} {...rest}>
          <title>{title}</title>
        </Helmet> */}
        {children}
      </>
    );
  }
);

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default ContentWrapper;
