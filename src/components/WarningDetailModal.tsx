import React, { useEffect, useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface CustomDialogProps extends DialogProps {
  detected?: boolean;
}

export interface IReportWarning {
  warningTitle: string,
  warningDescription: string,
  warningSeverity: 'low' | 'medium' | 'high'
}

export interface WarningDetailModalProps {
  open: boolean;
  selectedWarning?: IReportWarning
  setShowWarningDetailModal: (arg0: boolean) => void;
}

const CustomDialog = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== 'detected',
})<CustomDialogProps>(({ theme, detected }, ) => ({
  '& .MuiDialog-paper': {
    // border: detected ? '5px solid green' : '5px solid white'
  },
}));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    warningDetailTextContainer: {
      padding: theme.spacing(4),
      textAlign: 'center'
    },
    warningTitle: {
      marginBottom: theme.spacing(2),
    }
  }),
);

const WarningDetailModal = (props: WarningDetailModalProps) => {

  const classes = useStyles()

  const [currentlySelectedWarning, setCurrentlySelectedWarning] = useState<IReportWarning>();

  const { selectedWarning, open, setShowWarningDetailModal } = props;

  const handleClose = () => {
    setShowWarningDetailModal(false);
  };

  useEffect(() => {
    if(JSON.stringify(selectedWarning) !== JSON.stringify(currentlySelectedWarning)) {
      setCurrentlySelectedWarning(selectedWarning)
    }
  }, [open, selectedWarning, currentlySelectedWarning])

  return (
    <CustomDialog onClose={handleClose} open={open}>
      <Box className={classes.warningDetailTextContainer} sx={{ width: '100%' }}>
        {selectedWarning &&
          <>
            <Typography className={classes.warningTitle} variant={"h5"}>
              {selectedWarning.warningTitle}
            </Typography>
            <Typography variant={"subtitle1"}>
              {selectedWarning.warningDescription}
            </Typography>
          </>
        }
      </Box>
    </CustomDialog>
  );
}

export default WarningDetailModal;