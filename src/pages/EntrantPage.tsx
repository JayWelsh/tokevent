import React, { useEffect, useState, useRef } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import PinIcon from '@mui/icons-material/Pin';
import SignMessageIcon from '@mui/icons-material/MailLock';
import QrCodeIcon from '@mui/icons-material/QrCode2';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import GradientStepperHorizontal from '../components/GradientStepperHorizontal';

import { slugToHost, IHost, IEvent } from '../hosts';

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
      marginBottom: theme.spacing(8),
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
    }
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

    const classes = useStyles()

    const { hostSlug, darkMode, eventSlug } = props;

    const [host, setHost] = useState<IHost>();
    const [event, setEvent] = useState<IEvent>();
    const [activeStep, setActiveStep] = useState(0);
    const [otpArray, setOtpArray] = useState<string[]>(Array.from({length: 6}));
    const [otp, setOtp] = useState(0);
    const [validOtp, setValidOtp] = useState(false);

    const inputRefDigit1 = useRef(null);
    const inputRefDigit2 = useRef(null);
    const inputRefDigit3 = useRef(null);
    const inputRefDigit4 = useRef(null);
    const inputRefDigit5 = useRef(null);
    const inputRefDigit6 = useRef(null);

    const isMobileView = useMobileView();

    useEffect(() => {
        let otpString = otpArray?.reduce((acc, item)=> item && (item?.length === 1) && (item.indexOf('e') === -1) && (item.indexOf('.') === -1) && (item.indexOf(',') === -1) ? acc + item : acc)?.toString();
        setOtp(Number(otpString));
        if(otpString && otpString.length === 6 && ((Number(otpString) % 1) === 0)) {
            setValidOtp(true);
        } else {
            setValidOtp(false);
        }
    }, [otpArray])

    useEffect(() => {
        if(slugToHost[hostSlug]) {
            setHost(slugToHost[hostSlug])
            let event = slugToHost[hostSlug]?.events?.find((item) => item.slug === eventSlug);
            if(event) {
                setEvent(event);
            }
        }
    }, [hostSlug, eventSlug])

    const handleInputChange = (event:  React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, inputIndex: number) => {
        let newOtpArray = [...otpArray];
        //@ts-ignore
        newOtpArray[inputIndex] = event.nativeEvent.data ? event.nativeEvent.data : null;
        setOtpArray(newOtpArray);
        if(inputIndex === 0 && inputRefDigit2.current) {
            //@ts-ignore
            // inputRefDigit2.current.focus();
            if(event.nativeEvent.data && inputRefDigit2.current) {
                //@ts-ignore
                inputRefDigit2.current.select();
                //@ts-ignore
                inputRefDigit1.current.value = event.nativeEvent.data
            }
        }
        if(inputIndex === 1) {
            //@ts-ignore
            if(event.nativeEvent.data && inputRefDigit3.current) {
                //@ts-ignore
                inputRefDigit3.current.select();
                //@ts-ignore
                inputRefDigit2.current.value = event.nativeEvent.data
            } else if(inputRefDigit1.current) {
                //@ts-ignore
                inputRefDigit1.current.select();
            }
        }
        if(inputIndex === 2) {
            //@ts-ignore
            if(event.nativeEvent.data && inputRefDigit4.current) {
                //@ts-ignore
                inputRefDigit4.current.select();
                //@ts-ignore
                inputRefDigit3.current.value = event.nativeEvent.data
            } else if(inputRefDigit2.current) {
                //@ts-ignore
                inputRefDigit2.current.select();
            }
        }
        if(inputIndex === 3) {
            //@ts-ignore
            if(event.nativeEvent.data && inputRefDigit5.current) {
                //@ts-ignore
                inputRefDigit5.current.select();
                //@ts-ignore
                inputRefDigit4.current.value = event.nativeEvent.data
            } else if(inputRefDigit3.current) {
                //@ts-ignore
                inputRefDigit3.current.select();
            }
        }
        if(inputIndex === 4) {
            //@ts-ignore
            if(event.nativeEvent.data && inputRefDigit6.current) {
                //@ts-ignore
                inputRefDigit6.current.select();
                //@ts-ignore
                inputRefDigit5.current.value = event.nativeEvent.data
            } else if(inputRefDigit4.current) {
                //@ts-ignore
                inputRefDigit4.current.select();
            }
        }
        if(inputIndex === 5 && inputRefDigit5.current) {
            //@ts-ignore
            if(!event.nativeEvent.data) {
                //@ts-ignore
                inputRefDigit5.current.select();
            } else {
                //@ts-ignore
                inputRefDigit6.current.value = event.nativeEvent.data
            }
        }
        console.log({event, inputIndex});
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>, inputIndex: number) => {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            if(inputIndex === 0) {
                //do nothing
            } else if (inputIndex === 1) {
                //@ts-ignore
                let currentValue = inputRefDigit2?.current?.value;
                if(!currentValue) {
                    //@ts-ignore
                    inputRefDigit1?.current?.focus();
                }
            } else if (inputIndex === 2) {
                //@ts-ignore
                let currentValue = inputRefDigit3?.current?.value;
                if(!currentValue) {
                    //@ts-ignore
                    inputRefDigit2?.current?.select();
                }
            } else if (inputIndex === 3) {
                //@ts-ignore
                let currentValue = inputRefDigit4?.current?.value;
                if(!currentValue) {
                    //@ts-ignore
                    inputRefDigit3?.current?.select();
                }
            } else if (inputIndex === 4) {
                //@ts-ignore
                let currentValue = inputRefDigit5?.current?.value;
                if(!currentValue) {
                    //@ts-ignore
                    inputRefDigit4?.current?.select();
                }
            } else if (inputIndex === 5) {
                //@ts-ignore
                let currentValue = inputRefDigit6?.current?.value;
                if(!currentValue) {
                    //@ts-ignore
                    inputRefDigit5?.current?.select();
                }
            }
        }
    };
    
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
                    <Grid container className={[classes.otpRow, 'disable-number-spinners'].join(' ')} spacing={2}>
                        <Grid key={`otp-digit-1`} item xs={4} sm={4} md={2} lg={2}>
                            <div className={[classes.numberContainer, darkMode ? classes.numberContainerDarkMode : classes.numberContainerLightMode].join(' ')}>
                                <div className={'gradient-block-inner'}/>
                                <div className={classes.innerShadow}/>
                                <div className={classes.numberInnerContainer}>
                                    <InputBase
                                        sx={{ 
                                            fontSize: isMobileView ? '5rem' : '10rem', 
                                            zIndex: 10,
                                            fontWeight: 300, 
                                            "& input": {
                                                textAlign: "center"
                                            }
                                        }}
                                        type="number"
                                        autoFocus={true}
                                        inputRef={inputRefDigit1}
                                        onChange={(event) => handleInputChange(event, 0)}
                                        // onKeyDown={(event) => handleKeyDown(event, 0)}
                                        onClick={() => {
                                            //@ts-ignore
                                            if(inputRefDigit1?.current) { inputRefDigit1.current.select() }
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid key={`otp-digit-2`} item xs={4} sm={4} md={2} lg={2}>
                            <div className={[classes.numberContainer, darkMode ? classes.numberContainerDarkMode : classes.numberContainerLightMode].join(' ')}>
                                <div className={'gradient-block-inner'}/>
                                <div className={classes.innerShadow}/>
                                <div className={classes.numberInnerContainer}>
                                    <InputBase
                                        sx={{ 
                                            fontSize: isMobileView ? '5rem' : '10rem', 
                                            zIndex: 10,
                                            fontWeight: 300, 
                                            "& input": {
                                                textAlign: "center"
                                            }
                                        }}
                                        type="number"
                                        inputRef={inputRefDigit2}
                                        onChange={(event) => handleInputChange(event, 1)}
                                        // onKeyDown={(event) => handleKeyDown(event, 1)}
                                        onClick={() => {
                                            //@ts-ignore
                                            if(inputRefDigit2?.current) { inputRefDigit2.current.select() }
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid key={`otp-digit-3`} item xs={4} sm={4} md={2} lg={2}>
                            <div className={[classes.numberContainer, darkMode ? classes.numberContainerDarkMode : classes.numberContainerLightMode].join(' ')}>
                                <div className={'gradient-block-inner'}/>
                                <div className={classes.innerShadow}/>
                                <div className={classes.numberInnerContainer}>
                                    <InputBase
                                        sx={{ 
                                            fontSize: isMobileView ? '5rem' : '10rem', 
                                            zIndex: 10,
                                            fontWeight: 300, 
                                            "& input": {
                                                textAlign: "center"
                                            }
                                        }}
                                        type="number"
                                        inputRef={inputRefDigit3}
                                        onChange={(event) => handleInputChange(event, 2)}
                                        // onKeyDown={(event) => handleKeyDown(event, 2)}
                                        onClick={() => {
                                            //@ts-ignore
                                            if(inputRefDigit3?.current) { inputRefDigit3.current.select() }
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid key={`otp-digit-4`} item xs={4} sm={4} md={2} lg={2}>
                            <div className={[classes.numberContainer, darkMode ? classes.numberContainerDarkMode : classes.numberContainerLightMode].join(' ')}>
                                <div className={'gradient-block-inner'}/>
                                <div className={classes.innerShadow}/>
                                <div className={classes.numberInnerContainer}>
                                    <InputBase
                                        sx={{ 
                                            fontSize: isMobileView ? '5rem' : '10rem', 
                                            zIndex: 10,
                                            fontWeight: 300, 
                                            "& input": {
                                                textAlign: "center"
                                            }
                                        }}
                                        type="number"
                                        inputRef={inputRefDigit4}
                                        onChange={(event) => handleInputChange(event, 3)}
                                        // onKeyDown={(event) => handleKeyDown(event, 3)}
                                        onClick={() => {
                                            //@ts-ignore
                                            if(inputRefDigit4?.current) { inputRefDigit4.current.select() }
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid key={`otp-digit-5`} item xs={4} sm={4} md={2} lg={2}>
                            <div className={[classes.numberContainer, darkMode ? classes.numberContainerDarkMode : classes.numberContainerLightMode].join(' ')}>
                                <div className={'gradient-block-inner'}/>
                                <div className={classes.innerShadow}/>
                                <div className={classes.numberInnerContainer}>
                                    <InputBase
                                        sx={{ 
                                            fontSize: isMobileView ? '5rem' : '10rem', 
                                            zIndex: 10,
                                            fontWeight: 300, 
                                            "& input": {
                                                textAlign: "center"
                                            }
                                        }}
                                        type="number"
                                        inputRef={inputRefDigit5}
                                        onChange={(event) => handleInputChange(event, 4)}
                                        // onKeyDown={(event) => handleKeyDown(event, 4)}
                                        onClick={() => {
                                            //@ts-ignore
                                            if(inputRefDigit5?.current) { inputRefDigit5.current.select() }
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid key={`otp-digit-6`} item xs={4} sm={4} md={2} lg={2}>
                            <div className={[classes.numberContainer, darkMode ? classes.numberContainerDarkMode : classes.numberContainerLightMode].join(' ')}>
                                <div className={'gradient-block-inner'}/>
                                <div className={classes.innerShadow}/>
                                <div className={classes.numberInnerContainer}>
                                    <InputBase
                                        sx={{ 
                                            fontSize: isMobileView ? '5rem' : '10rem', 
                                            zIndex: 10,
                                            fontWeight: 300, 
                                            "& input": {
                                                textAlign: "center"
                                            }
                                        }}
                                        type="number"
                                        inputRef={inputRefDigit6}
                                        onChange={(event) => handleInputChange(event, 5)}
                                        // onKeyDown={(event) => handleKeyDown(event, 5)}
                                        onClick={() => {
                                            //@ts-ignore
                                            if(inputRefDigit6?.current) { inputRefDigit6.current.select() }
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <div className="flex-center-col">
                        <Button size="large" disabled={!validOtp || !otp} className={[classes.scanButton, classes.navigationButton, validOtp && 'simple-gradient-block'].join(' ')} variant={validOtp ? 'text' : 'outlined'} onClick={() => setActiveStep(1)}>Next Step</Button>
                    </div>
                </>
            }
            <pre>{JSON.stringify(otpArray, null, 4)}</pre>
            <pre>{otp}</pre>
            {/* <pre>{JSON.stringify(host, null, 4)}</pre>
            <pre>{JSON.stringify(event, null, 4)}</pre> */}
        </Container>
    )
};

export default EntrantPage;