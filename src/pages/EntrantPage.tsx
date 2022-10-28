import React, { useEffect, useState, useRef } from 'react';

import { useEthers } from '@usedapp/core'
import { utils } from 'ethers';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import ReplayIcon from '@mui/icons-material/Replay';

import PinIcon from '@mui/icons-material/Pin';
import SignMessageIcon from '@mui/icons-material/MailLock';
import QrCodeIcon from '@mui/icons-material/QrCode2';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import OtpInput from '../components/OtpInput';

import QRCode from "react-qr-code";

import { useSnackbar } from 'notistack';

import GradientStepperHorizontal from '../components/GradientStepperHorizontal';
import EthereumInteractionZone from '../components/EthereumInteractionZone';

import { useMobileView } from '../hooks';

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
      maxHeight: 187,
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
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(2),
      textAlign: 'center',
    },
    subtitle: {
      marginBottom: theme.spacing(4),
      textAlign: 'center',
    },
    stepperContainer: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
    navigationContainer: {
        marginTop: theme.spacing(2),  
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing(15),
    },
    otpRow: {
      marginBottom: theme.spacing(6)
    },
    scanButton: {
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
    messageDisplay: {
        backgroundColor: '#030303',
        padding: theme.spacing(3),
        borderRadius: 4,
        marginBottom: theme.spacing(4),
        maxWidth: '100%',
        overflow: 'scroll',
    },
    messageDisplayPreElement: {
        margin: 0,
    },
  }),
);

const steps = [
    {
      label: 'Enter Provided OTP',
      description: '',
      IconElement: PinIcon
    },
    {
      label: 'Sign Event Message',
      description: '',
      IconElement: SignMessageIcon
    },
    {
      label: 'Present QR Code',
      description: '',
      IconElement: QrCodeIcon
    },
  ];

interface IEntrantPage {
    hostSlug: string
    eventSlug: string
    darkMode: boolean
}

const EntrantPage = (props: IEntrantPage) => {

    const classes = useStyles();

    const { account, library } = useEthers();

    const { enqueueSnackbar } = useSnackbar();

    const { hostSlug, darkMode, eventSlug } = props;

    const [activeStep, setActiveStep] = useState(0);
    const [otp, setOtp] = useState('');
    const [validOtp, setValidOtp] = useState(false);
    const [message, setMessage] = useState('');
    const [signedMessage, setSignedMessage] = useState('');
    const [signedMessageOriginal, setSignedMessageOriginal] = useState('');

    const handleChange = (otp: number) => {
        let otpString = otp.toString();
        setOtp(otpString);
        if(otpString && otpString.length === 6 && ((Number(otpString) % 1) === 0)) {
            setValidOtp(true);
        } else {
            setValidOtp(false);
        }
    };

    const isMobileView = useMobileView();

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        if(account && otp && validOtp && hostSlug && eventSlug) {
            let newMessage = {hostId: hostSlug, eventId: eventSlug, otp: otp, timestamp: Math.floor(Date.now() / 1000), account: utils.getAddress(account)};
            let stringified = JSON.stringify(newMessage, null, 4);
            setMessage(stringified);
        } else {
            setMessage('')
        }
    }, [otp, validOtp, account, hostSlug, eventSlug]);

    const signMessage = async () => {
        if(library) {
            setSignedMessage('');
            setSignedMessageOriginal('');
            const signer = library.getSigner();
            let signedMessageOriginal = `${message}`;
            setSignedMessageOriginal(signedMessageOriginal);
            await signer.signMessage(signedMessageOriginal)
            .then((signedMessage) => {
                if(mounted.current && signedMessage) {
                    setActiveStep(2);
                    setSignedMessage(signedMessage.toString());
                    // setSignedMessageOriginal(signedMessageOriginal);
                }
            })
            .catch((e) => enqueueSnackbar(e?.message ? e?.message : 'error signing message', { variant: 'error'}));
        }
    }
    
    return (
        <Container maxWidth="md">
            <Typography className={classes.title} variant={"h2"}>
              Auth
            </Typography>
            <Typography className={classes.subtitle} variant={"h5"}>
              Prove token ownership to event organizers
            </Typography>
            <Box className={classes.stepperContainer} sx={{ width: '100%' }}>
              <GradientStepperHorizontal steps={steps} activeStep={activeStep} />
            </Box>
            {activeStep === 0 &&
                <>
                    <div className={classes.otpRow}>
                        <OtpInput
                            value={otp}
                            onChange={handleChange}
                            numInputs={6}
                            isMobileView={isMobileView}
                            darkMode={darkMode}
                            shouldAutoFocus={true}
                        />
                    </div>
                    <Box className={classes.navigationContainer} sx={{ width: '100%' }}>
                        <Button size="large" disabled={!validOtp || !otp} className={[classes.scanButton, classes.navigationButton, validOtp && 'simple-gradient-block'].join(' ')} variant={validOtp ? 'text' : 'outlined'} onClick={() => setActiveStep(1)}>Next Step</Button>
                    </Box>
                </>
            }
            {activeStep === 1 &&
                <>
                    <div className="flex-center-col">
                        <Typography className={classes.subtitle} variant={"h5"}>
                            {account ? `Message Signing` : `Connect your wallet to complete this step`}
                        </Typography>
                        {message &&
                            <>
                                <Typography className={classes.subtitle} style={{maxWidth: 620}} variant={"subtitle1"}>
                                    Signing this message will create a signature which can be used to reveal your wallet address & the event you are attending, signing this message will not put any funds at risk and will not enable any on-chain transactions.
                                </Typography>
                                {/* once you sign this message, you will be presented with a QR code and other options for sharing your signed message, do not share the signed message publicly, if you are unable to show event managers the QR code directly, use a private communication channel to share it with event management. */}
                                <div className={classes.messageDisplay}>
                                    <pre className={[classes.messageDisplayPreElement, 'matrix-text'].join(' ')}>
                                        {JSON.stringify(JSON.parse(message), null, 4)}
                                    </pre>
                                </div>
                            </>
                        }
                        <Box className={classes.navigationContainer} sx={{ width: '100%' }}>
                            <EthereumInteractionZone connectButtonClass={[classes.scanButton, classes.navigationButton, 'simple-gradient-block'].join(' ')}>
                                <Fab className={[classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => {setActiveStep(0)}}>
                                    <ReplayIcon style={{height: '2rem', width: '2rem'}} />
                                    {/* Restart */}
                                </Fab>
                                <Button size="large" disabled={!validOtp || !otp} className={[classes.scanButton, classes.navigationButton, validOtp && 'simple-gradient-block'].join(' ')} variant={validOtp ? 'text' : 'outlined'} onClick={() => signMessage()}>Sign Message</Button>
                            </EthereumInteractionZone>
                        </Box>
                    </div>
                </>
            }
            {activeStep === 2 &&
                <div className="flex-center-col">
                    <Typography className={classes.subtitle} variant={"h5"}>
                        {`Signed Message`}
                    </Typography>
                    <Typography className={classes.subtitle} style={{maxWidth: 620}} variant={"subtitle1"}>
                    {/* a malicious party could try to use your signed message to impersonate you and gain access to the event. */}
                        <span style={{color: 'red'}}>IMPORTANT</span><br/><b>Do not share your QR code with anyone other than official event entry staff</b>
                    </Typography>
                    <div style={{ height: "auto", background: 'white', margin: "0 auto", maxWidth: 600, padding: 8, width: "100%", marginBottom: 20 }}>
                        <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%", verticalAlign: "top"}}
                        value={JSON.stringify({
                            message: signedMessageOriginal,
                            signedMessage
                        })}
                        viewBox={`0 0 256 256`}
                        />
                    </div>
                    <Box className={classes.navigationContainer} sx={{ width: '100%' }}>
                        <Fab className={[classes.navigationButton, 'simple-gradient-block'].join(' ')} onClick={() => {setActiveStep(0)}}>
                            <ReplayIcon style={{height: '2rem', width: '2rem'}} />
                            {/* Restart */}
                        </Fab>
                    </Box>
                </div>
            }
        </Container>
    )
};

export default EntrantPage;