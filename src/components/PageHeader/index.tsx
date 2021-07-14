import { FC } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { experimentalStyled } from '@material-ui/core/styles';
import { Typography, Box, Divider } from '@material-ui/core';

interface PageHeaderProps {
  heading: string;
  subheading: string;
}

const RootWrapper = experimentalStyled(Box)(
  ({ theme }) => `
        margin-top: ${theme.spacing(5)};
`
);

const PageHeader: FC<PageHeaderProps> = ({ heading, subheading, ...rest }) => {
  const { t }: { t: any } = useTranslation();

  return (
    <RootWrapper {...rest}>
      {heading && <Typography variant="h1">{t(heading)}</Typography>}
      {subheading && (
        <Typography variant="subtitle2">{t(subheading)}</Typography>
      )}
      <Divider sx={{ mt: 5 }} />
    </RootWrapper>
  );
};

PageHeader.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string
};

export default PageHeader;
