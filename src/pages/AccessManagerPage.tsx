import React, { useEffect, useState, useRef } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PinIcon from '@mui/icons-material/Pin';
import Fab from '@mui/material/Fab';
import PasswordIcon from '@mui/icons-material/Password';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NavigationIcon from '@mui/icons-material/Navigation';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import TokenIcon from '@mui/icons-material/Token';
import ReplayIcon from '@mui/icons-material/Replay';
import PendingIcon from '@mui/icons-material/Pending';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

import { useEthers } from '@usedapp/core'

import AnimatedNumber from '../components/AnimatedNumber';
import GradientStepperHorizontal from '../components/GradientStepperHorizontal';
import QRModal from '../components/QRModal';
import SignedMessageEvaluationReport from '../components/SignedMessageEvaluationReport';

import { slugToHost, IHost } from '../hosts';
import { useOTP, useMobileView } from '../hooks';
import { getHostEventURL, verifySignedMessage, extractRelevantEvent, checkTokenBalances, extractMessageReport, IEvaluationReport } from '../utils';

interface IAccessManagerPage {
  hostSlug: string
  darkMode: boolean
}

const evaluationSteps = [
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

const steps = [
  {
    label: 'Guide attendee to URL',
    description: '',
    IconElement: EmojiPeopleIcon
  },
  {
    label: 'Provide OTP to attendee',
    description: '',
    IconElement: PinIcon
  },
  {
    label: 'Await signed message',
    description: '',
    IconElement: ScheduleIcon
  },
  {
    label: 'Verify signed message',
    description: '',
    IconElement: LockPersonIcon
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    numberContainer: {
      borderRadius: 30,
      position: 'relative',
    },
    numberContainerDarkMode: {
      backgroundColor: '#000000b5'
    },
    numberContainerLightMode: {
      backgroundColor: '#ffffffb5'
    },
    numberInnerContainer: {
      overflow: 'hidden',
      borderRadius: 30,
    },
    innerShadow: {
      boxShadow: 'inset 0 0 10px #000000',
      width: '100%',
      height: '100%',
      position: 'absolute',
      borderRadius: 30,
      overflow: 'hidden',
      zIndex: 1
    },
    navigationButton: {
      color: 'white',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    title: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(2),
      textAlign: 'center',
    },
    subtitle: {
      marginBottom: theme.spacing(6),
      textAlign: 'center',
    },
    stepperContainer: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(6),
    },
    navigationContainer: {
      marginBottom: theme.spacing(4),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    otpRow: {
      marginBottom: theme.spacing(6)
    },
    scanButton: {
      marginTop: theme.spacing(2),
      fontSize: '1.25rem',
      paddingLeft: '20px',
      paddingRight: '20px'
    },
    instructionPaper: {
      padding: theme.spacing(3),
      marginBottom: '50vh',
    },
    instructionText: {
      textAlign: 'center',
    },
    evaluationStepText: {
      marginTop: theme.spacing(2),
      textAlign: 'center',
    },
    evaluationStepIcon: {
      marginRight: theme.spacing(2),
    },
    evaluationTitleIcon: {
      marginBottom: theme.spacing(2),
    },
    evaluationPendingStep: {
      opacity: 0.5,
    },
    verificationErrorMessage: {
      color: 'red',
      marginTop: theme.spacing(2)
    }
  }),
);

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const AccessManagerPage = (props: IAccessManagerPage) => {

    const classes = useStyles()

    const { library } = useEthers();

    const { hostSlug, darkMode } = props;

    const [host, setHost] = useState<IHost>();
    const [activeStep, setActiveStep] = useState(0);
    const [showModalQR, setShowModalQR] = useState(false);
    const [latestScanResult, setLatestScanResult] = useState('');
    
    const [evaluatingSignedMessage, setEvaluatingSignedMessage] = useState(false);
    const [showEvaluationReportModal, setShowEvaluationReportModal] = useState(false);
    const [evaluationStepIndex, setEvaluationStepIndex] = useState(0);
    const [evaluationFailedReason, setEvaluationFailedReason] = useState<string | boolean>(false);
    const [evaluationReport, setEvaluationReport] = useState<IEvaluationReport | boolean>(false);

    const mounted = useRef(false);

    const { otp, newOTP } = useOTP();

    const isMobileView = useMobileView();

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
      if(slugToHost[hostSlug]) {
        setHost(slugToHost[hostSlug])
      }
    }, [hostSlug])

    useEffect(() => {
      if(activeStep === 3) {
        setLatestScanResult('');
      }
    }, [activeStep])

    useEffect(() => {
      const evaluateSignedMessage = async () => {
        setEvaluationStepIndex(0);
        setEvaluationFailedReason(false);
        setShowEvaluationReportModal(false);
        console.log({latestScanResult})
        if(latestScanResult?.length > 0) {
          setEvaluatingSignedMessage(true);
          await sleep(500);
          let validSigner = await verifySignedMessage(latestScanResult, setEvaluationFailedReason);
          if(!validSigner) {
            setEvaluatingSignedMessage(false);
            return;
          }
          setEvaluationStepIndex(1);
          // extract event info
          let event = await extractRelevantEvent(latestScanResult);
          if(!event) {
            setEvaluationFailedReason('Signature contains invalid event, please provide entrant with a new OTP and try again');
            setEvaluatingSignedMessage(false);
            return;
          }
          await sleep(500);
          setEvaluationStepIndex(2);
          if(!library) {
            setEvaluationFailedReason('Ethers library not available, please refresh page and retry message verification');
            setEvaluatingSignedMessage(false);
            return;
          }
          let tokenBalanceResults = await checkTokenBalances(library, event.tokens, validSigner);
          if(!tokenBalanceResults) {
            setEvaluationFailedReason('Unable to scan token balances, please refresh page and retry message verification');
            setEvaluatingSignedMessage(false);
            return;
          }
          setEvaluationStepIndex(3);
          let report = await extractMessageReport(latestScanResult, tokenBalanceResults, otp);
          setEvaluationReport(report);
          setShowEvaluationReportModal(true);
        } else {
          setEvaluatingSignedMessage(false);
        }
      }
      evaluateSignedMessage();
    }, [latestScanResult, library])
    
    return (
        <Container maxWidth="md">
            <Typography className={classes.title} variant={"h2"}>
              Access Management
            </Typography>
            <Typography className={classes.subtitle} variant={"h5"}>
              Authenticate attendees who wish to use their NFTs as tickets.
            </Typography>
            {((activeStep === 0) || (activeStep === 1) || (activeStep === 2) || (activeStep === 3)) &&
              <Grid container className={classes.otpRow} spacing={2}>
                {otp.split('').map((number, index) => {
                  return (
                    <Grid key={`otp-${index}`} item xs={2} sm={2} md={2} lg={2}>
                      <div className={[classes.numberContainer, darkMode ? classes.numberContainerDarkMode : classes.numberContainerLightMode].join(' ')}>
                        {/* use h2 when mobile */}
                        <div className={'gradient-block-inner'}/>
                        <div className={classes.innerShadow}/>
                        <div className={classes.numberInnerContainer}>
                          <Typography style={{textAlign: 'center', fontSize: isMobileView ? '5rem' : '10rem'}} variant={"h1"}>
                            <AnimatedNumber fontSize={isMobileView ? '5rem' : '10rem'} number={number}/>
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  )
                })}
              </Grid>
            }
            <Box className={classes.stepperContainer} sx={{ width: '100%' }}>
              <GradientStepperHorizontal steps={steps} activeStep={activeStep} />
            </Box>
            <Box className={classes.navigationContainer} sx={{ width: '100%' }}>
              {/* {activeStep < 2 && <Button onClick={() => setActiveStep((activeStep - 1 >= 0) ? activeStep - 1 : activeStep)}>Previous Step</Button>} */}
              {/* <Button className={classes.navigationButton} disabled={activeStep === 0} onClick={() => setActiveStep(0)}>Restart</Button>
              <Button className={classes.navigationButton} disabled={activeStep === 3} onClick={() => setActiveStep((activeStep + 1 < steps.length) ? activeStep + 1 : activeStep)}>Next Step</Button> */}
              <Fab className={[classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => {if(activeStep === 0) { newOTP() } else { newOTP();setActiveStep(0) }}}>
                <ReplayIcon style={{height: '2rem', width: '2rem'}} />
                {/* Restart */}
              </Fab>
              <Fab disabled={activeStep === 3} className={[classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => setActiveStep(activeStep + 1)}>
                <NavigateNextIcon style={{height: '2.5rem', width: '2.5rem'}} />
                {/* Next Step */}
              </Fab>
              {/* {activeStep > 2 && <Button onClick={() => setActiveStep(0)}>Next Attendee</Button>} */}
            </Box>
            <Paper className={classes.instructionPaper}>
              {activeStep === 0 &&
                <Typography className={classes.instructionText} variant={"h5"}>
                  Please guide the attendee to {getHostEventURL(hostSlug)}
                </Typography>
              }
              {activeStep === 1 &&
                <Typography className={classes.instructionText} variant={"h5"}>
                  Please provide the number above to the attendee.
                </Typography>
              }
              {activeStep === 2 &&
                <Typography className={classes.instructionText} variant={"h5"}>
                  After the attendee has entered the above number into their device, their signature will be requested. Once the attendee signs, please move onto the next step.
                </Typography>
              }
              {activeStep === 3 &&
                <div className="flex-center-col">
                  {(!evaluatingSignedMessage && !evaluationFailedReason) && 
                    <>
                      <Typography className={classes.instructionText} variant={"h5"}>
                        Please scan the QR code generated by the attendee's signature.
                      </Typography>
                      <Button size="large" className={[classes.scanButton, classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => setShowModalQR(true)}>Scan QR Code</Button>
                    </>
                  }
                  {(evaluatingSignedMessage || evaluationFailedReason) && 
                    <>
                      <TroubleshootIcon fontSize="large" className={classes.evaluationTitleIcon} />
                      <Typography className={[classes.instructionText, 'flex-center-all'].join(' ')} variant={"h5"}>
                        Signed Message Evaluation
                      </Typography>
                      {evaluationSteps.map((item, index) => {
                        return (
                          <div className={[classes.evaluationStepText, 'flex-center-all', 'transition-opacity', index > evaluationStepIndex && classes.evaluationPendingStep].join(' ')}>
                            <div className={[classes.evaluationStepIcon, 'flex-center-all'].join(' ')}>
                              {index > evaluationStepIndex && <PendingIcon/>}
                              {index < evaluationStepIndex && <TaskAltIcon style={{color: '#32cd32'}}/>}
                              {!evaluationFailedReason && index === evaluationStepIndex && <CircularProgress size={24} color="secondary" />}
                              {evaluationFailedReason && index === evaluationStepIndex && <WarningAmberIcon style={{color: 'red'}} />}
                            </div>
                            <Typography variant={"h6"}>
                              {item.label}
                            </Typography>
                          </div>
                        )
                      })}
                      {evaluationFailedReason &&
                        <>
                          <Typography variant={"subtitle1"} className={classes.verificationErrorMessage}>
                            {evaluationFailedReason}
                          </Typography>
                          <Button size="large" className={[classes.scanButton, classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => setShowModalQR(true)}>Rescan QR Code</Button>
                        </>
                      }
                      {showEvaluationReportModal && <SignedMessageEvaluationReport evaluationReport={evaluationReport} />}
                      {/* {evaluationStepIndex === 3 && <Button size="large" className={[classes.scanButton, classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => setShowEvaluationReportModal(true)}>Show Report</Button>} */}
                      {evaluationStepIndex === 3 && <Button size="large" className={[classes.scanButton, classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => setShowModalQR(true)}>Rescan QR Code</Button>}
                    </>
                  }
                </div>
              }
            </Paper>
            <QRModal onScan={(arg0: string) => setLatestScanResult(arg0)} open={showModalQR} setShowModalQR={setShowModalQR}/>
            {`latestScanResult ${latestScanResult}`}
            {`showModalQR ${showModalQR}`}
            {/* <pre>{JSON.stringify(host, null, 4)}</pre> */}
        </Container>
    )
};

export default AccessManagerPage;