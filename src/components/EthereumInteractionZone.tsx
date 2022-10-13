import React, { useState, useEffect } from 'react';

import BigNumber from 'bignumber.js';

import Button from '@mui/material/Button';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import { useEthers } from '@usedapp/core'

import ConnectWalletButton from './ConnectWalletButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    
  }),
);

interface IMediaDisplay {
  children: React.ReactNode,
  connectButtonClass?: string,
}

const EthereumInteractionZone = (props: IMediaDisplay) => {

  const { children, connectButtonClass } = props;

  const { account } = useEthers();

  const classes = useStyles();

  return (
    <>
      {account && children}
      {!account && <ConnectWalletButton connectButtonClass={connectButtonClass}/>}
    </>
  );
}

export default EthereumInteractionZone;