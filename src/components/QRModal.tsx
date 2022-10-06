import React, { useEffect, useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import CameraOffIcon from '@mui/icons-material/NoPhotography';
import Fab from '@mui/material/Fab';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { styled } from '@mui/material/styles';

import { QrReader } from 'fork-react-qr-reader';

interface CustomDialogProps extends DialogProps {
  detected?: boolean;
}

export interface QRModalProps {
  open: boolean;
  onScan?: (arg0: string) => void;
  setShowModalQR: (arg0: boolean) => void;
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
    exitButton: {
      position: 'absolute',
      zIndex: '1',
      right: theme.spacing(2),
      top: theme.spacing(2),
    },
  }),
);

const QRModal = (props: QRModalProps) => {

  const classes = useStyles()

  const [dataQR, setDataQR] = useState('');

  const { onScan, open, setShowModalQR } = props;

  const handleClose = () => {
    setShowModalQR(false);
  };

  useEffect(() => {
    if((dataQR !== '') && onScan && setShowModalQR && open) {
      onScan(dataQR);
      setShowModalQR(false);
    } else {
      setDataQR('');
    }
  }, [dataQR, setShowModalQR, onScan, open])

  return (
    <CustomDialog detected={dataQR !== ''} onClose={handleClose} open={open}>
      <Fab className={classes.exitButton} onClick={() => handleClose()}>
        <CameraOffIcon style={{height: '2rem', width: '2rem'}} />
      </Fab>
      <QrReader
        className="qr-code-scanner-video"
        onResult={(result, error) => {
          if (!!result) {
            setDataQR(result?.getText());
          }

          if (!!error) {
            console.info(error);
          }
        }}
        //@ts-ignore
        style={{ width: '100vh' }}
      />
    </CustomDialog>
  );
}

export default QRModal;