import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import { slugToHost, IHost } from '../hosts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(2),
      textAlign: 'center',
    },
    subtitle: {
      marginBottom: theme.spacing(6),
      textAlign: 'center',
    },
    eventContainer: {
      marginBottom: theme.spacing(6),
      display: 'flex',
      justifyContent: 'center'
    },
    eventPaper: {
      padding: theme.spacing(2),
    },
    eventTitle: {
      marginBottom: theme.spacing(2),
    }
  }),
);

interface IEntrantPage {
    hostSlug: string
    darkMode: boolean
}

const EntrantPage = (props: IEntrantPage) => {

    const { hostSlug, darkMode } = props;

    const [host, setHost] = useState<IHost>();

    const classes = useStyles()

    useEffect(() => {
        if(slugToHost[hostSlug]) {
            setHost(slugToHost[hostSlug])
        }
    }, [hostSlug])
    
    return (
        <Container maxWidth="lg">
            {host &&
              <>
                <Typography className={classes.title} variant={"h2"}>
                  {host.name}
                </Typography>
                <Typography className={classes.subtitle} variant={"h5"}>
                  Please select the event that you are attending
                </Typography>
                {/* <pre>{JSON.stringify(host, null, 4)}</pre> */}
                <Grid container className={classes.eventContainer} spacing={2}>
                  {host.events.map((event, index) =>
                    <Grid key={`event-item-${index}`} item xs={12} sm={12} md={6} lg={4}>
                      <CardActionArea>
                        <Link to={`${hostSlug}/${event.slug}`} className="no-decorate">
                          <Card className={classes.eventPaper}>
                            <Typography className={classes.eventTitle} variant={"h5"}>
                              {event.name}
                            </Typography>
                            <Typography variant={"h6"}>
                              {event.description}
                            </Typography>
                          </Card>
                        </Link>
                      </CardActionArea>
                    </Grid>
                  )}
                </Grid>
              </>
            }
        </Container>
    )
};

export default EntrantPage;