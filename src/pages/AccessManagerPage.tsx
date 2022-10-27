import React, { useEffect, useState, useRef } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PinIcon from '@mui/icons-material/Pin';
import Fab from '@mui/material/Fab';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import ReplayIcon from '@mui/icons-material/Replay';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Paper from '@mui/material/Paper';

import AnimatedNumber from '../components/AnimatedNumber';
import GradientStepperHorizontal from '../components/GradientStepperHorizontal';
import QRModal from '../components/QRModal';
import SignedMessageEvaluationReport from '../components/SignedMessageEvaluationReport';

import { useOTP, useMobileView } from '../hooks';
import { getHostEventURL } from '../utils';

interface IAccessManagerPage {
  hostSlug: string
  darkMode: boolean
}

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
      marginBottom: theme.spacing(12),
      backgroundColor: 'black',
      backgroundImage: 'none',
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

const AccessManagerPage = (props: IAccessManagerPage) => {

    const classes = useStyles()

    const { hostSlug, darkMode } = props;

    const [activeStep, setActiveStep] = useState(0);
    const [showModalQR, setShowModalQR] = useState(false);
    const [latestScanResult, setLatestScanResult] = useState('');

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
      if(activeStep === 3) {
        setLatestScanResult('');
      }
    }, [activeStep])
    
    return (
        <Container maxWidth="md">
            <Typography className={classes.title} variant={"h2"}>
              Access Manager
            </Typography>
            <Typography className={classes.subtitle} variant={"h5"}>
              Authenticate attendees who wish to use their NFTs as tickets.
            </Typography>
            {((activeStep === 0) || (activeStep === 1) || (activeStep === 2) || (activeStep === 3)) &&
              <Grid container className={classes.otpRow} spacing={2}>
                {otp.split('').map((number, index) => {
                  return (
                    <Grid key={`otp-${index}`} item xs={4} sm={4} md={2} lg={2}>
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
                  Please guide the attendee to <span className="matrix-text">{getHostEventURL(hostSlug)}</span>
                </Typography>
              }
              {activeStep === 1 &&
                <Typography className={classes.instructionText} variant={"h5"}>
                  Please provide the OTP (<span className="matrix-text">{otp}</span>) to the attendee.
                </Typography>
              }
              {activeStep === 2 &&
                <Typography className={classes.instructionText} variant={"h5"}>
                  After the attendee has entered the above number into their device, their signature will be requested. Once the attendee signs, please move onto the next step.
                </Typography>
              }
              {activeStep === 3 &&
                <div className="flex-center-col">
                  {(!latestScanResult || latestScanResult?.length === 0) && 
                    <>
                      <Typography className={classes.instructionText} variant={"h5"}>
                        Please scan the QR code generated by the attendee's signature.
                      </Typography>
                      <Button size="large" className={[classes.scanButton, classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => setShowModalQR(true)}>Scan QR Code</Button>
                    </>
                  }
                  {/* {(evaluatingSignedMessage || evaluationFailedReason) &&  */}
                    <>
                      <SignedMessageEvaluationReport setShowModalQR={setShowModalQR} otp={otp} latestScanResult={latestScanResult} />
                    </>
                  {/* } */}
                </div>
              }
            </Paper>
            <QRModal onScan={(arg0: string) => setLatestScanResult(arg0)} open={showModalQR} setShowModalQR={setShowModalQR}/>
            {/* {`latestScanResult ${latestScanResult}`}
            {`showModalQR ${showModalQR}`} */}
            {/* <pre>{JSON.stringify(host, null, 4)}</pre> */}
        </Container>
    )
};

export default AccessManagerPage;