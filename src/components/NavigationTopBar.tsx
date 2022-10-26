import React, { useState, useEffect } from 'react';

import { withRouter, RouteComponentProps } from "react-router";

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/NightsStay';
import LightModeIcon from '@mui/icons-material/WbSunny';

import LogoDarkMode from '../assets/svg/logo.svg'
import LogoLightMode from '../assets/svg/logo.svg'

import { Web3ModalButton } from './Web3ModalButton';
import { PropsFromRedux } from '../containers/NavigationTopBarContainer';

import { useMobileView } from '../hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      cursor: 'pointer',
      marginTop: 2,
    },
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

const NavigationTopBar = (props: PropsFromRedux & RouteComponentProps) => {
  const classes = useStyles()

  const isMobileView = useMobileView();

  const [localShowLeftMenu, setLocalShowLeftMenu] = useState(props.showLeftMenu)
  const [localDarkMode, setLocalDarkMode] = useState(props.darkMode)

  useEffect(() => {
    setLocalShowLeftMenu(props.showLeftMenu)
  }, [props.showLeftMenu])

  useEffect(() => {
    setLocalDarkMode(props.darkMode)
  }, [props.darkMode])
  

  return (
    <div className={classes.root}>
      <AppBar style={{background: 'linear-gradient(-90deg, #272727, #000000)'}} position="static">
        <Toolbar>
          {!isMobileView &&
            <IconButton
              onClick={() => props.setShowLeftMenu(!localShowLeftMenu)}
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              size="large">
              <MenuIcon />
            </IconButton>
          }
          <img onClick={() => props.history.push('/')} height={'46px'} style={{marginRight: '10px', cursor: 'pointer'}} src={localDarkMode ? LogoDarkMode : LogoLightMode} alt="logo" />
          {!isMobileView &&
            <Typography onClick={() => props.history.push('/')} variant="h6" className={classes.title}>
              tokevent.org
            </Typography>
          }
          {isMobileView &&
            <div className={classes.title}/>
          }
          <Web3ModalButton/>
          {!isMobileView &&
            <IconButton
              color="inherit"
              onClick={() => props.setDarkMode(!localDarkMode)}
              aria-label="delete"
              className={classes.margin}
              size="large">
              {localDarkMode ? <LightModeIcon/> : <DarkModeIcon />}
            </IconButton>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(NavigationTopBar)