import React, { useEffect, useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { styled } from '@mui/material/styles';

import { IEvaluationReport } from '../utils';

export interface SignedMessageEvaluationReportProps {
  evaluationReport: IEvaluationReport | boolean
}

const CustomDialog = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== 'detected',
})(({ theme }, ) => ({
  '& .MuiDialog-paper': {
    // border: detected ? '5px solid green' : '5px solid white'
  },
}));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeReportButton: {
      marginTop: theme.spacing(1),
      fontSize: '1.25rem',
      paddingLeft: '20px',
      paddingRight: '20px',
      color: 'white',
    },
    reportContainer: {
      padding: theme.spacing(2),
      textAlign: 'center'
    },
    reportDisplay: {
      backgroundColor: '#030303',
      padding: theme.spacing(3),
      borderRadius: 4,
      marginTop: theme.spacing(2),
      maxWidth: '100%',
      overflow: 'scroll',
    },
    reportDisplayPreElement: {
      margin: 0,
      textAlign: 'left'
    },
    simpleReport: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  }),
);

const SignedMessageEvaluationReport = (props: SignedMessageEvaluationReportProps) => {

  const classes = useStyles()

  const { evaluationReport } = props;

  const [signer, setSigner] = useState<boolean | string>(false);
  const [timestamp, setTimestamp] = useState<boolean | number>(false);
  const [ticketEntitlement, setTicketEntitlement] = useState<boolean | number>(false);
  const [signedOtp, setSignedOtp] = useState<boolean | string>(false);
  const [currentOtp, setCurrentOtp] = useState<boolean | string>(false);

  useEffect(() => {
    if(typeof evaluationReport === 'object') {
      if(evaluationReport.hasOwnProperty('signer')) {
        setSigner(evaluationReport.signer);
      }
      if(evaluationReport.hasOwnProperty('timestamp')) {
        setTimestamp(evaluationReport.timestamp);
      }
      if(evaluationReport.hasOwnProperty('ticketEntitlement')) {
        setTicketEntitlement(evaluationReport.ticketEntitlement);
      }
      if(evaluationReport.hasOwnProperty('signedOtp')) {
        setSignedOtp(evaluationReport.signedOtp)
      }
      if(evaluationReport.hasOwnProperty('currentOtp')) {
        setCurrentOtp(evaluationReport.currentOtp)
      }
    }
  }, [evaluationReport])

  return (
    // <CustomDialog fullWidth={true} onClose={handleClose} open={open}>
      <div className={classes.reportContainer}>
        <div className={classes.reportDisplay}>
            <pre className={[classes.reportDisplayPreElement, 'matrix-text'].join(' ')}>
                <span style={{color: 'white'}}>Ticket Entitlement:</span> {`${ticketEntitlement} ${ticketEntitlement === 1 ? 'ticket' : 'tickets'}`}<br/>
                <span style={{color: 'white'}}>Signer:</span> {signer}<br/>
                <span style={{color: 'white'}}>Timestamp:</span> {timestamp}<br/>
                <span style={{color: 'white'}}>Signed OTP:</span> {signedOtp}<br/>
                <span style={{color: 'white'}}>Current OTP:</span> {currentOtp}<br/>
            </pre>
        </div>
        {/* <Button size="large" className={['simple-gradient-block', classes.closeReportButton].join(' ')} onClick={() => handleClose()}>Close Report</Button> */}
      </div>
    // </CustomDialog>
  );
}

export default SignedMessageEvaluationReport;