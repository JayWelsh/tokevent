import React from 'react';
import {Route, withRouter, Switch, RouteComponentProps} from 'react-router-dom';

import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import { PropsFromRedux } from '../containers/PageContainerContainer';

import Navigation from './Navigation';
import HomePage from '../pages/HomePage';
import HostPage from '../pages/HostPage';
import EntrantPage from '../pages/EntrantPage';
import AccessManagerPage from '../pages/AccessManagerPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  }),
);

const PageContainer = (reduxProps: PropsFromRedux & RouteComponentProps) => {

    const classes = useStyles();

    return (
        <Navigation>
            <div className={classes.root}>
                <Switch>
                    <Route path="/" exact render={(props) => homeRoute(props, reduxProps.darkMode)} />
                    <Route path="/:hostSlug/access" exact render={(props) => accessManagerRoute(props, reduxProps.darkMode)} />
                    <Route path="/:hostSlug" exact render={(props) => hostRoute(props, reduxProps.darkMode)} />
                    <Route path="/:hostSlug/:eventSlug" exact render={(props) => entrantRoute(props, reduxProps.darkMode)} />
                </Switch>
            </div>
        </Navigation>
    )
}

const homeRoute = (props: RouteComponentProps, darkMode: boolean) => {
    return (
        <HomePage darkMode={darkMode}/>
    )
}

const accessManagerRoute = (props: RouteComponentProps<{ hostSlug: string }>, darkMode: boolean) => {
    const {
        match: {
            params: { hostSlug }
        }
    } = props
    return (
        <AccessManagerPage darkMode={darkMode} hostSlug={hostSlug}/>
    )
}

const entrantRoute = (props: RouteComponentProps<{ hostSlug: string, eventSlug: string }>, darkMode: boolean) => {
    const {
        match: {
            params: { hostSlug, eventSlug }
        }
    } = props
    return (
        <EntrantPage darkMode={darkMode} hostSlug={hostSlug} eventSlug={eventSlug}/>
    )
}

const hostRoute = (props: RouteComponentProps<{ hostSlug: string }>, darkMode: boolean) => {
    const {
        match: {
            params: { hostSlug }
        }
    } = props
    return (
        <HostPage darkMode={darkMode} hostSlug={hostSlug}/>
    )
}

export default withRouter(PageContainer);