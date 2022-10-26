import React from 'react';
import styled from 'styled-components'
import Typography from '@mui/material/Typography';

const VersionNumberContainer = styled.div`
    font-family: monospace;
    font-size: 12px;
    position: fixed;
    top: calc(100% - 10px);
    right: calc(100% - 10px);
    transform: translate(100%, -100%);
    display: flex;
    align-items: center;
    :hover{
        cursor: pointer
        span {
            opacity: 1 !important
        }
    }
`

interface IVersionNumberIndicatorProps {
  version: string;
}

const VersionNumberIndicator = (props: IVersionNumberIndicatorProps) => {

    const { version } = props;

    return (version ?
      <VersionNumberContainer>
        <span style={{opacity: '0.6'}}><Typography variant="overline" style={{fontFamily: 'monospace', lineHeight: 0, textTransform: 'lowercase'}}>v{version}</Typography></span>
      </VersionNumberContainer> : null
    )
}

export default VersionNumberIndicator;