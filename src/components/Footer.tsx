import React from 'react';

import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import DiscordLogo from '../assets/svg/discord.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(1),
    },
    footerContainer: {
      width: '100%',
      marginBottom: theme.spacing(1),
    },
    footerSocialImage: {
      maxWidth: 38,
      width: '100%',
      maxHeight: 38,
      height: '100%',
      color: 'white',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    }
  }),
);

const Footer = () => {
    const classes = useStyles()
    return (
        <div className={["flex-center-all", classes.footerContainer].join(' ')}>
          <div className="flex-center-col">
            <Typography style={{opacity: 0.8}} variant="subtitle1" className={classes.title}>
              <i>assistance & support</i>
            </Typography>
            <div className="flex-center-all">
              <a href={'https://discord.gg/HCtbFsKDvE'} target="_blank" rel="noopener noreferrer">
                <div className={'opacity-button'}>
                  <img className={classes.footerSocialImage} alt="discord logo" src={DiscordLogo}/>
                </div>
              </a>
              <a href={'https://t.me/tokevent'} target="_blank" rel="noopener noreferrer">
                <div className={'opacity-button'}>
                  <TelegramIcon className={classes.footerSocialImage}/>
                </div>
              </a>
              <a href={'https://github.com/JayWelsh/tokevent'} target="_blank" rel="noopener noreferrer">
                <div className={'opacity-button'}>
                  <GitHubIcon className={classes.footerSocialImage}/>
                </div>
              </a>
            </div>
          </div>
        </div>
    )
}

export default Footer;