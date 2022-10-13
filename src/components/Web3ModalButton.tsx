import React, { useEffect, useState, useRef } from 'react'
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core'
import styled from 'styled-components'
import Web3Modal from 'web3modal'

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useSnackbar } from 'notistack';

import WalletConnectProvider from '@walletconnect/web3-provider'

interface IWeb3ModalButtonProps {
  children?: React.ReactNode;
  isConsideredMobile?: boolean;
}

export const Web3ModalButton = (props: IWeb3ModalButtonProps) => {
  const { children, isConsideredMobile } = props;
  const { account, activate, deactivate, chainId } = useEthers()
  const ens = useLookupAddress()
  const { error } = useEthers()
  const { enqueueSnackbar } = useSnackbar();
  
  const [activateError, setActivateError] = useState('')
  const [showNetworkSwitchModal, setShowNetworkSwitchModal] = useState(false);
  // const [switchNetworkFunction, setSwitchNetworkFunction] = useState(() => {});
  // const switchNetworkFunction = useRef(() => {});
  const [provider, setProvider] = useState();

  useEffect(() => {
    if (error) {
      // Temp workaround to avoid network changed error message until useDapp handles this internally
      if(
        error?.message?.indexOf('underlying network changed') === -1
        && error?.message?.indexOf('code=CALL_EXCEPTION') === -1
      ) {
        setActivateError(error.message)
      } else if (error?.message?.indexOf('code=CALL_EXCEPTION') > -1) {
        setActivateError('Please refresh')
      }
    }
  }, [error])

  // useEffect(() => {
  //   if(Number(chainId) !== supportedNetworkId) {
  //     setShowNetworkSwitchModal(true);
  //   } else if (Number(chainId) === supportedNetworkId) {
  //     setShowNetworkSwitchModal(false);
  //   }
  // }, [chainId])

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
          rpc: {
            1: "https://eth-mainnet.g.alchemy.com/v2/fCyft9OQ_hnOaKwCk8JiubkHMoBbnL5q",
          },
          // infuraId: '0cdca40ec1c4459d8f1ecafd88c795d1',
        },
      },
    }

    const web3Modal = new Web3Modal({
      providerOptions,
    })
    
    try {
      const useProvider = await web3Modal.connect()
      setProvider(useProvider);
      if(useProvider?.chainId) {
        await activate(useProvider)
      } else {
        enqueueSnackbar("Unsupported network, please switch your wallet provider to mainnet and reconnect.", { variant: 'error'})
      }
      setActivateError('')
    } catch(error: any) {
      setActivateError(error?.message)
    }
  }

  if(!children) {
    return (
      <>
        <Account>
          {/* <ErrorWrapper>{activateError}</ErrorWrapper> */}
          {account ? (
            // <>
            //   <Tooltip
            //     title={<Typography fontSize={15}><b>Disconnect</b></Typography>}
            //     arrow
            //   >
            //     <Button
            //       color="primary"
            //       variant="contained"
            //       onClick={() => deactivate()}
            //       sx={{
            //         borderRadius: '20px',
            //         fontWeight: 'bold',
            //         fontSize: '1.1rem',
            //         paddingLeft: '8px',
            //       }}
            //     >
            //       <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#289b00', marginRight: '8px', marginLeft: ''}}>
            //         <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#42ff00', marginLeft: '5px', marginTop: '5px'}}>

            //         </div>
            //       </div>
            //       {/* {ens ?? shortenAddress(account)} */}
            //       {shortenAddress(account)}
            //     </Button>
            //   </Tooltip>
            // </>
            <>
              <AccountChip label={ens ?? shortenAddress(account)}/>
              <Button color="inherit" onClick={() => deactivate()}>Disconnect</Button>
            </>
          ) : (
            <Button color="inherit" onClick={activateProvider}>Connect</Button>
          )}
        </Account>
      </>
    )
  } else {
    return (
      account 
      ?
        <CustomButton onClick={() => deactivate()}>
          {children}
        </CustomButton>
      : 
        <CustomButton onClick={activateProvider}>
          {children}
        </CustomButton>
    )
  }
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

const CustomButton = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`