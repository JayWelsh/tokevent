import React from 'react';

import { useEthers } from '@usedapp/core'

import ConnectWalletButton from './ConnectWalletButton';

interface IMediaDisplay {
  children: React.ReactNode,
  connectButtonClass?: string,
}

const EthereumInteractionZone = (props: IMediaDisplay) => {

  const { children, connectButtonClass } = props;

  const { account } = useEthers();

  return (
    <>
      {account && children}
      {!account && <ConnectWalletButton connectButtonClass={connectButtonClass}/>}
    </>
  );
}

export default EthereumInteractionZone;