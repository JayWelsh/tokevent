import React, { useEffect, useState } from 'react'
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core'
import styled from 'styled-components'
import Web3Modal from 'web3modal'

import { useSnackbar } from 'notistack';

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import WalletConnectProvider from '@walletconnect/web3-provider'

export const Web3ModalButton = () => {
  const { account, activate, deactivate, chainId } = useEthers()
  const { enqueueSnackbar } = useSnackbar();
  const ens = useLookupAddress()
  const [activateError, setActivateError] = useState('')
  const { error } = useEthers()
  useEffect(() => {
    if (error) {
      // Temp workaround to avoid network changed error message until useDapp handles this internally
      if(error?.message?.indexOf('underlying network changed') === -1) {
        setActivateError(error.message)
      }
    }
  }, [error])

  useEffect(() => {
    // Can handle switches to unsupported chainId(s) here
    console.log("Current chainId", chainId);
  }, [chainId])

  useEffect(() => {
    if(activateError && enqueueSnackbar) {
      enqueueSnackbar(activateError, { variant: 'error'})
    }
  }, [activateError, enqueueSnackbar])

  const activateProvider = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: 'Metamask',
          description: 'Connect with the provider in your Browser',
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          bridge: 'https://bridge.walletconnect.org',
          infuraId: '0cdca40ec1c4459d8f1ecafd88c795d1',
        },
      },
    }

    const web3Modal = new Web3Modal({
      providerOptions,
    })
    
    try {
      const provider = await web3Modal.connect()
      await activate(provider)
    } catch(error: any) {
      setActivateError(error?.message)
    }
  }

  return (
    <Account>
      {/* <ErrorWrapper>{activateError}</ErrorWrapper> */}
      {account ? (
        <>
          <AccountChip label={ens ?? shortenAddress(account)}/>
          <Button color="inherit" onClick={() => deactivate()}>Disconnect</Button>
        </>
      ) : (
        <Button color="inherit" onClick={activateProvider}>Connect</Button>
      )}
    </Account>
  )
}

const ErrorWrapper = styled.div`
  color: #ff3960;
  margin-right: 40px;
  margin-left: 40px;
  overflow: auto;
`

const Account = styled.div`
  display: flex;
  align-items: center;
`

const AccountChip = styled(Chip)`
  margin-right: 15px;
  color: white;
`