import React from 'react';

import Button from '@mui/material/Button';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import { Web3ModalButton } from './Web3ModalButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    
  }),
);

interface IConnectWalletButton {
  connectButtonClass?: string,
  isMobile?: boolean
}

const ConnectWalletButton = (props: IConnectWalletButton) => {

  const { connectButtonClass, isMobile } = props;

  return (
    <Web3ModalButton>
      <Button 
        sx={{ 
          // borderRadius: '35px',
          // fontSize: 24,
          // fontWeight: 'bold',
          // textTransform: 'lowercase',
          // minWidth: '50%',
          color: 'white',
          // width: '100%',
        }} 
        variant="contained"
        color="secondary"
        aria-label="connect wallet"
        className={connectButtonClass ? connectButtonClass : ''}
      >
        {isMobile ? `connect` : `connect wallet`}
      </Button>
    </Web3ModalButton>
  );
}

export default ConnectWalletButton;