import React, {useEffect, useState, useRef} from 'react';
import styled, { keyframes } from 'styled-components'
import Typography from '@mui/material/Typography';
import { useBlockNumber, useEthers } from '@usedapp/core'

import { getEtherscanLink } from '../utils';

import { ExternalLink } from './ExternalLink';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid lime;
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;

  left: -3px;
  top: -3px;
`

interface IStyledPollingDot {
  blockSyncStatus: string;
}

const StyledPollingDot = styled.div<IStyledPollingDot>`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-right: 5px;
  border-radius: 50%;
  position: relative;
  background-color: ${
    (props) => {
      if(props.blockSyncStatus === 'fresh') {
        return 'lime';
      } else if (props.blockSyncStatus === 'delayed') {
        return 'orange';
      } else if (props.blockSyncStatus === 'disconnected') {
        return 'red';
      } else if (props.blockSyncStatus === 'connecting') {
        return 'grey';
      }
    }
  };
`

const BlockNumberContainer = styled.div`
    font-family: monospace;
    font-size: 12px;
    position: fixed;
    top: calc(100% - 10px);
    left: calc(100% - 10px);
    transform: translate(-100%, -100%);
    display: flex;
    align-items: center;
    :hover{
        cursor: pointer
        span {
            opacity: 1 !important
        }
    }
`

const BlockNumberIndicator = () => {
    const blockNumber = useBlockNumber()
    const { chainId } = useEthers()
    const [showSpinner, setShowSpinner] = useState(false)
    const [blockSyncStatus, setBlockSyncStatus] = useState('connecting');

    let timer1 = useRef(setTimeout(() => {}, 1))
    let timer2 = useRef(setTimeout(() => {}, 1))
    let timer3 = useRef(setTimeout(() => {}, 1))

    useEffect(() => {
        if(timer1.current) {
          clearTimeout(timer1.current)
        }
        timer1.current = setTimeout(() => setShowSpinner(false), 1000)
        if(timer2.current) {
          clearTimeout(timer2.current)
        }
        timer2.current = setTimeout(() => setBlockSyncStatus('delayed'), 45000)
        if(timer3.current) {
          clearTimeout(timer3.current)
        }
        timer3.current = setTimeout(() => setBlockSyncStatus('disconnected'), 90000)

        setShowSpinner(true);
        setBlockSyncStatus('fresh');

        // this will clear Timeout when component unmount like in willComponentUnmount
        return () => {
            setShowSpinner(false)
            clearTimeout(timer1.current)
            clearTimeout(timer2.current)
            clearTimeout(timer3.current)
        }
    }, [blockNumber])
    return (blockNumber ?
        <ExternalLink href={chainId && blockNumber ? getEtherscanLink(chainId, blockNumber.toString(), 'block') : ''}>
            <BlockNumberContainer>
                <StyledPollingDot blockSyncStatus={blockSyncStatus}>{showSpinner && <Spinner/>}</StyledPollingDot><span style={{opacity: !showSpinner ? '0.6' : '0.8'}}><Typography variant="overline" style={{fontFamily: 'monospace', lineHeight: 0}}>{blockNumber}</Typography></span>
            </BlockNumberContainer>
        </ExternalLink> : null
    )
}

export default BlockNumberIndicator