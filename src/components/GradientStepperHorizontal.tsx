import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { SvgIconComponent } from "@mui/icons-material";
import SvgIcon from '@mui/material/SvgIcon';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
    opacity: 0.75,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient(-45deg, #FFA63D, #FF3D77);',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient(-45deg, #FFA63DBF, #FF3D77BF);',
  }),
}));


interface IStep {
  label: string
  description: string
  IconElement: SvgIconComponent
}

interface IGradientStepperHorizontal {
  steps: IStep[],
  activeStep: number,
}

function ColorlibStepIcon(props: StepIconProps & IStep) {
  const { active, completed, className, IconElement } = props;

  // let iconClass;
  // if(active) {
  //   iconClass = 'gradient-block';
  // }
  

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={[className].join(' ')}>
      <div className={['stepper-icon-container-dark-mode', 'stepper-icon-container-inner'].join(' ')}>
        <IconElement style={{opacity: active ? 1 : 0.75}}/>
      </div>
    </ColorlibStepIconRoot>
  );
}

// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function GradientStepperHorizontal(props: IGradientStepperHorizontal) {
  const { steps, activeStep } = props;
  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map(({label, IconElement}) => (
          <Step key={label}>
            <StepLabel StepIconComponent={(props) => ColorlibStepIcon({...props, IconElement})}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}