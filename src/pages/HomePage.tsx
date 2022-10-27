import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { CardActionArea } from '@mui/material';

import { Link } from 'react-router-dom';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';

import { slugToHost } from '../hosts';
import { extractIpfsLink } from '../utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        root: {
            minWidth: 275,
            marginBottom: 15
        },
        title: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(2),
            textAlign: 'center',
        },
        subtitle: {
            marginBottom: theme.spacing(6),
            textAlign: 'center',
        },
        hostContainer: {
            marginBottom: theme.spacing(6),
            display: 'flex',
            justifyContent: 'center'
        },
        hostCoverImageContainer: {
            width: '100%',
            height: 250,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        hostInfo: {
            padding: theme.spacing(2),
        },
        hostTitle: {
            marginBottom: theme.spacing(2),
        }
    })
);

interface IHomePage {
    darkMode: boolean
}

const HomePage = (props: IHomePage) => {
    const classes = useStyles();

    return (
        <Container maxWidth="lg">
            <Typography className={classes.title} variant={"h2"}>
                Host Selection
            </Typography>
            <Typography className={classes.subtitle} variant={"h5"}>
                Who is hosting your event?
            </Typography>
            <Grid container className={classes.hostContainer} spacing={3}>
                {Object.entries(slugToHost).map((slugAndHost, index) =>
                    <Grid key={`host-item-${index}-${slugAndHost[0]}`} item xs={12} sm={12} md={6} lg={6}>
                        <CardActionArea>
                            <Link to={`/${slugAndHost[0]}`} className="no-decorate">
                                <Card>
                                    <div className={classes.hostCoverImageContainer} style={{backgroundImage: `url(${extractIpfsLink(slugAndHost[1].image)})`}} />
                                    <div className={classes.hostInfo}>
                                        <Typography className={classes.hostTitle} variant={"h5"}>
                                            {slugAndHost[1].name}
                                        </Typography>
                                        <Typography variant={"h6"}>
                                            {slugAndHost[1]?.description ? slugAndHost[1].description : 'tokevent.org event host'}
                                        </Typography>
                                    </div>
                                </Card>
                            </Link>
                        </CardActionArea>
                    </Grid>
                )}
            </Grid>
        </Container>
    )
};

export default HomePage;