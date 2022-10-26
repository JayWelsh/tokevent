import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import CircularProgress from '@mui/material/CircularProgress';
import PendingIcon from '@mui/icons-material/Pending';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TokenIcon from '@mui/icons-material/Token';
import GavelIcon from '@mui/icons-material/Gavel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { useEthers } from '@usedapp/core';

import WarningDetailModal, { IReportWarning } from './WarningDetailModal';

import { IEvaluationReport, IEvaluationSteps, sleep, verifySignedMessage, extractRelevantEvent, checkTokenBalances, extractMessageReport } from '../utils';

const evaluationSteps: IEvaluationSteps[] = [
  {
    label: 'Signature Verification',
    IconElement: LockPersonIcon,
  },
  {
    label: 'Extract Event Requirements',
    IconElement: EventNoteIcon,
  },
  {
    label: 'Scan Token Balances',
    IconElement: TokenIcon,
  }
]

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
      textAlign: 'center',
      maxWidth: '100%'
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
    },
    reportIcon: {
      marginRight: theme.spacing(1),
    },
    evaluationIcon: {
      marginLeft: theme.spacing(1),
    },
    reportWarningText: {
      color: '#ff6600',
    },
    criticalErrorText: {
      color: 'red'
    },
    evaluationStepText: {
      marginTop: theme.spacing(2),
      textAlign: 'center',
    },
    evaluationStepIcon: {
      marginRight: theme.spacing(2),
    },
    evaluationPendingStep: {
      opacity: 0.5,
    },
    verificationErrorMessage: {
      color: 'red',
      marginTop: theme.spacing(2)
    },
    scanButton: {
      marginTop: theme.spacing(2),
      fontSize: '1.25rem',
      paddingLeft: '20px',
      paddingRight: '20px'
    },
    navigationButton: {
      color: 'white',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    evaluationTitleIcon: {
      marginBottom: theme.spacing(2),
    },
    instructionText: {
      textAlign: 'center',
    },
  }),
);

export interface SignedMessageEvaluationReportProps {
  latestScanResult: string
  otp: string
  setShowModalQR: (arg0: boolean) => void
}

const SignedMessageEvaluationReport = (props: SignedMessageEvaluationReportProps) => {

  const classes = useStyles()

  const { library } = useEthers();

  const { latestScanResult, otp, setShowModalQR } = props;

  const [signer, setSigner] = useState<boolean | string>(false);
  const [readableDate, setReadableDate] = useState<boolean | string>();
  const [signDateWarningSeverity, setSignDateWarningSeverity] = useState<boolean | 'low' | 'medium' | 'high'>(false);
  const [ticketEntitlement, setTicketEntitlement] = useState<boolean | number>(false);
  const [tokenHolderLinks, setTokenHolderLinks] = useState<string[]>();
  const [signedOtp, setSignedOtp] = useState<boolean | string>(false);
  const [currentOtp, setCurrentOtp] = useState<boolean | string>(false);
  const [warnings, setWarnings] = useState<IReportWarning[]>([]);
  const [selectedWarning, setSelectedWarning] = useState<IReportWarning>();
  const [showWarningDetailModal, setShowWarningDetailModal] = useState<boolean>(false);

  const [evaluatingSignedMessage, setEvaluatingSignedMessage] = useState(false);
  const [showEvaluationReportModal, setShowEvaluationReportModal] = useState(false);
  const [evaluationStepIndex, setEvaluationStepIndex] = useState(0);
  const [evaluationFailedReason, setEvaluationFailedReason] = useState<string | boolean>(false);
  const [evaluationReport, setEvaluationReport] = useState<IEvaluationReport | boolean>(false);
  const [hasCriticalError, setHasCriticalError] = useState<boolean>(false);

  useEffect(() => {
    let newWarnings : IReportWarning[] = [];
    if(typeof evaluationReport === 'object') {
      if(evaluationReport.hasOwnProperty('signer')) {
        setSigner(evaluationReport.signer);
      }
      if(evaluationReport.hasOwnProperty('timestamp')) {
        let date = new Date(Number(evaluationReport.timestamp) * 1000).toString();
        let readableDate = date.substring(0, date.indexOf(' ('));
        setReadableDate(readableDate);
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
      if(evaluationReport.hasOwnProperty('tokenBalanceResults')) {
        let newTokenHolderLinks = evaluationReport.tokenBalanceResults.reduce<string[]>((acc, item) => {
          if(Number(item.balance) >= Number(item.tokensPerTicket)) {
            acc.push(item.linkToRelevantHoldings)
            return acc;
          }
          return acc;
        }, []);
        console.log({newTokenHolderLinks})
        setTokenHolderLinks(newTokenHolderLinks)
      }
      if(evaluationReport.signedOtp !== evaluationReport.currentOtp) {
        newWarnings.push({
          warningTitle: 'OTP Mismatch',
          warningDescription: `The OTP signed in the message (${evaluationReport.signedOtp}) does not match the current OTP on your device (${evaluationReport.currentOtp}). This might be the case if you have refreshed your OTP after providing the signer with their OTP, for example if you have been dealing with multiple people or if the signer signed their message in advance before arriving at the event. An OTP match may not be required for entry, but a match does provide a higher degree of certainty that the signer is the same person you are communicating with.`,
          warningSeverity: 'medium'
        })
      }
      if(!evaluationReport.onlyAddressVerification && (evaluationReport.ticketEntitlement) < 1) {
        setHasCriticalError(true);
        newWarnings.push({
          warningTitle: 'No Ticket Entitlement',
          warningDescription: 'Based off the signer\'s holdings, entry is not permitted.',
          warningSeverity: 'high'
        })
        setEvaluationFailedReason('No Ticket Entitlement (Insufficient Token Balance)')
      }
      let currentTimestamp = Math.floor(new Date().getTime() / 1000);
      let timestampDelta = currentTimestamp - evaluationReport.timestamp;
      if(timestampDelta < 0) {
        newWarnings.push({
          warningTitle: 'Suspicious Signature Timestamp',
          warningDescription: 'The signer attempted to claim that their message was signed in the future, there should be no good reason for this to happen and may be a sign of malicious activity or foul-play.',
          warningSeverity: 'high'
        })
        setSignDateWarningSeverity('high');
      } else if((timestampDelta) > (60*60) && (timestampDelta) < 60*60*24*7) { // between 1 hour to 7 days
        let hoursSince = Math.floor(timestampDelta / 60 / 60);
        newWarnings.push({
          warningTitle: 'Aged Signature Timestamp',
          warningDescription: `The message timestamp indicates that it was signed ${hoursSince === 1 ? `${hoursSince} hour` : `${hoursSince} hours`} ago, this could be due to valid reasons, but it is worth keeping in mind that this leads to lower confidence that you are speaking to the message signer. Generally, the closer the message timestamp is to the current time, the more confident you can be that you are communicating directly with the message signer (ideally, we would like this to be a matter of minutes instead of hours/days).`,
          warningSeverity: 'medium'
        })
        setSignDateWarningSeverity('medium');
      } else if((timestampDelta) > (60*60*24*7)) { // older than 7 days
        newWarnings.push({
          warningTitle: 'Expired Signature Timestamp',
          warningDescription: 'The message timestamp indicates that it was signed over 7 days ago, it is recommended to treat this as an invalid signature and to request that the signer restarts the process with you.',
          warningSeverity: 'high'
        })
        setSignDateWarningSeverity('high');
      }
    }
    setWarnings(newWarnings);
  }, [evaluationReport])

  useEffect(() => {
    const evaluateSignedMessage = async () => {
      setEvaluationStepIndex(0);
      setEvaluationFailedReason(false);
      setShowEvaluationReportModal(false);
      setHasCriticalError(false);
      setSigner(false);
      setReadableDate(false);
      setSignDateWarningSeverity(false);
      setTicketEntitlement(0);
      setTokenHolderLinks([]);
      setSignedOtp(false);
      setWarnings([]);
      if(latestScanResult?.length > 0) {
        setEvaluatingSignedMessage(true);
        await sleep(500);
        let validSigner = await verifySignedMessage(latestScanResult, setEvaluationFailedReason, setHasCriticalError);
        if(!validSigner) {
          setHasCriticalError(true);
          setEvaluatingSignedMessage(false);
          return;
        }
        setEvaluationStepIndex(1);
        // extract event info
        let event = await extractRelevantEvent(latestScanResult);
        if(!event) {
          setEvaluationFailedReason('Invalid event signature, please re-auth');
          setHasCriticalError(true);
          setEvaluatingSignedMessage(false);
          return;
        }
        await sleep(500);
        setEvaluationStepIndex(2);
        if(!library) {
          setEvaluationFailedReason('Something went wrong, please refresh page');
          setHasCriticalError(true);
          setEvaluatingSignedMessage(false);
          return;
        }
        let tokenBalanceResults = await checkTokenBalances(library, event?.tokens, validSigner);
        if(!tokenBalanceResults) {
          setEvaluationFailedReason('Balance scan error, please refresh page & retry');
          setHasCriticalError(true);
          setEvaluatingSignedMessage(false);
          return;
        }
        setEvaluationStepIndex(3);
        let report = await extractMessageReport(latestScanResult, tokenBalanceResults, otp, event.onlyAddressVerification);
        setEvaluationReport(report);
        setShowEvaluationReportModal(true);
      } else {
        setEvaluatingSignedMessage(false);
      }
    }
    evaluateSignedMessage();
  }, [latestScanResult, library, otp])

  return (
    // <CustomDialog fullWidth={true} onClose={handleClose} open={open}>
    <>
      {(evaluatingSignedMessage || evaluationFailedReason) && latestScanResult && 
          <div className={classes.reportContainer}>
            <div className={classes.reportDisplay}>
                <pre className={[classes.reportDisplayPreElement, 'matrix-text'].join(' ')}>
                    <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                      <div className="flex-center-vertical"><TroubleshootIcon className={classes.reportIcon}/><span style={{color: 'white'}}>Evaluation Steps</span></div>
                    <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                    {evaluationSteps.map((item, index) => {
                      return (
                        <div key={`evaluation-step-${index}-${item.label}`} className={['flex-left-align-center', 'transition-opacity', index > evaluationStepIndex && classes.evaluationPendingStep].join(' ')}>
                          <span style={{color: 'white'}}>{item.label}:</span>
                          <div className={[classes.evaluationStepIcon, 'flex-center-all'].join(' ')}>
                            {index > evaluationStepIndex && <PendingIcon className={[classes.evaluationIcon].join(' ')} style={{color: 'white'}}/>}
                            {/* {index < evaluationStepIndex && ` complete`} */}
                            {index < evaluationStepIndex && <TaskAltIcon className={[classes.evaluationIcon].join(' ')} style={{color: '#32cd32'}}/>}
                            {!evaluationFailedReason && index === evaluationStepIndex && <CircularProgress className={[classes.evaluationIcon].join(' ')} size={24} color="secondary" />}
                            {evaluationFailedReason && index === evaluationStepIndex && <CrisisAlertIcon className={[classes.criticalErrorText, classes.evaluationIcon].join(' ')} />}
                          </div>
                          <br/>
                        </div>
                      )
                    })}
                    <span style={{color: '#ffffff69'}}>--------------------------------------------------</span>
                    {showEvaluationReportModal && 
                      <>
                        <br/><br/>
                        <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                        <div className="flex-center-vertical"><PrivacyTipOutlinedIcon className={classes.reportIcon}/><span style={{color: 'white'}}>Details</span></div>
                        <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                        {typeof evaluationReport === 'object' && !evaluationReport?.onlyAddressVerification && <><span style={{color: 'white'}}>Ticket Entitlement:</span> <span className={Number(ticketEntitlement) === 0 ? classes.verificationErrorMessage : ''}>{`${ticketEntitlement} ${ticketEntitlement === 1 ? 'ticket' : 'tickets'}`}</span><br/></>}
                        <span style={{color: 'white'}}>Signer:</span> {signer}<br/>
                        <span style={{color: 'white'}}>Signed Time:</span> <span style={{...(signDateWarningSeverity === 'medium' && {color: '#ff6600'}), ...(signDateWarningSeverity === 'high' && {color: 'red'})}}>{readableDate}</span><br/>
                        <span style={{color: 'white'}}>Signed OTP:</span> <span style={{...(signedOtp !== currentOtp && {color: '#ff6600'})}}>{signedOtp}</span><br/>
                        <span style={{color: 'white'}}>Current OTP:</span> <span style={{...(signedOtp !== currentOtp && {color: '#ff6600'})}}>{currentOtp}</span><br/>
                        <span style={{color: '#ffffff69'}}>--------------------------------------------------</span>
                        {warnings && (warnings.length > 0) && !evaluationFailedReason &&
                          <>
                            <br/><br/>
                            <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                            <div className="flex-center-vertical"><WarningAmberIcon className={[classes.reportIcon, classes.reportWarningText].join(' ')}/><span style={{color: 'white'}}>Warnings</span></div>
                            <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                            {warnings.map((item, index) => {
                              return (
                                <span key={`warning-${index}-${item.warningTitle}-${item.warningSeverity}`} className='flex-center-vertical'>
                                  <span style={{color: 'white'}}>{`${index + 1}. `}</span><span className='flex-center-vertical' style={{color: item.warningSeverity === 'high' ? 'red' : '#ff6600'}}>{item.warningTitle}<HelpOutlineIcon style={{color: 'white'}} onClick={() => {setSelectedWarning(item);setShowWarningDetailModal(true)}} className={[classes.evaluationIcon, 'opacity-button'].join(' ')}/></span><br/>
                                </span>
                              )
                            })}
                            <span style={{color: '#ffffff69'}}>--------------------------------------------------</span>
                          </>
                        }
                      </>
                    }
                    {evaluationFailedReason &&
                      <>
                        <br/><br/>
                        <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                          <div className="flex-center-vertical"><CrisisAlertIcon className={[classes.reportIcon, classes.criticalErrorText].join(' ')}/><span style={{color: 'white'}}>Critical Error</span></div>
                        <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                        <span className={classes.verificationErrorMessage}>{evaluationFailedReason}</span><br/>
                        <span style={{color: '#ffffff69'}}>--------------------------------------------------</span>
                      </>
                    }
                    {(evaluationFailedReason || showEvaluationReportModal) &&
                      <>
                        <br/><br/>
                        <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                        <div className="flex-center-vertical"><GavelIcon className={[classes.reportIcon, hasCriticalError && classes.criticalErrorText, (warnings.length > 0 && !hasCriticalError) && classes.reportWarningText].join(' ')}/><span style={{color: 'white'}}>Conclusion</span></div>
                        <span style={{color: '#ffffff69'}}>--------------------------------------------------</span><br/>
                        {hasCriticalError && <><span className={classes.verificationErrorMessage}>Access is not allowed, retry or contact support</span><br/></>}
                        {!hasCriticalError && (warnings?.length > 0) && <><span className={classes.reportWarningText}>Consider warnings before granting access</span><br/></>}
                        {!hasCriticalError && (warnings?.length === 0) && <><span>No issues detected, grant access at own discretion</span><br/></>}
                        {!hasCriticalError && typeof evaluationReport === 'object' && !evaluationReport?.onlyAddressVerification && <><span style={{color: 'white'}}>Ticket Entitlement:</span> <span className={Number(ticketEntitlement) === 0 ? classes.verificationErrorMessage : ''}>{`${ticketEntitlement} ${ticketEntitlement === 1 ? 'ticket' : 'tickets'}`}</span><br/></>}
                        {!hasCriticalError && typeof evaluationReport === 'object' && !evaluationReport?.onlyAddressVerification && <><span style={{color: 'white'}}>Record which token ID(s) are used for entry</span><br/></>}
                        <span style={{color: '#ffffff69'}}>--------------------------------------------------</span>
                      </>
                    }
                </pre>
            </div>
            {(evaluationStepIndex === 3) && tokenHolderLinks && tokenHolderLinks?.length > 0 &&
              <>
                {tokenHolderLinks.map((item, index) => <a href={item} className="no-decorate" rel="noopener noreferrer" target="_blank"><Button key={`token-holder-link-${index}-${item}`} size="large" className={[classes.scanButton, classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => {}}>View Token{tokenHolderLinks?.length > 1 ? ` ${index + 1} `: ` `}Holdings</Button></a>)}
              </>
            }
            {(evaluationStepIndex === 3 || evaluationFailedReason) && <Button size="large" className={[classes.scanButton, classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => setShowModalQR(true)}>Rescan QR Code</Button>}
          </div>
        }
        <WarningDetailModal open={showWarningDetailModal} selectedWarning={selectedWarning} setShowWarningDetailModal={setShowWarningDetailModal}/>
      </>
    // </CustomDialog>
  );
}

export default SignedMessageEvaluationReport;