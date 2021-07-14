import { IconButton, Popover, Tooltip } from '@material-ui/core';
import { useRef, useState } from 'react';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';

import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';

function HeaderSettings() {
  const { t }: { t: any } = useTranslation();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title={t('Settings')}>
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <SettingsTwoToneIcon />
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <LanguageToggle />
      </Popover>
    </>
  );
};

export default HeaderSettings;
