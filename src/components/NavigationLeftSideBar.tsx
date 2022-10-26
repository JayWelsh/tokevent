import React, {useState, useEffect, Fragment} from 'react';
import { withRouter, RouteComponentProps } from "react-router";

import makeStyles from '@mui/styles/makeStyles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ExampleIcon from '@mui/icons-material/Favorite';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { PropsFromRedux } from '../containers/NavigationLeftSideBarContainer';

const navigationMenu = [
  {
    text: 'Home',
    path: '/',
    icon: <HomeIcon />
  },
  {
    text: 'Example',
    path: '/example',
    icon: <ExampleIcon />
  },
  {
    text: 'With Children',
    icon: <AccountTreeIcon />,
    children: [
      {
        text: 'Example',
        path: '/example',
        icon: <ExampleIcon />
      },
      {
        text: 'Home',
        path: '/',
        icon: <HomeIcon />
      },
    ]
  },
];

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

type PropsWithRouter = RouteComponentProps & PropsFromRedux;

function NavigationLeftSideBar(props: PropsWithRouter) {
  const classes = useStyles();

  const [openCollapseSections, setOpenCollapseSections] = useState<Number[]>([]);

  const [localShowLeftMenu, setLocalShowLeftMenu] = useState(false)

  useEffect(() => {
    setLocalShowLeftMenu(props.showLeftMenu)
  }, [props.showLeftMenu])

  const toggleDrawer = (setOpen: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    props.setShowLeftMenu(setOpen)
  };

  const toggleOpenCollapseState = (navigationMenuIndex: number) => {
    // Check if the navigationMenuIndex is currently in openCollapseSections
    let indexInCurrentState = openCollapseSections.indexOf(navigationMenuIndex)
    if(indexInCurrentState === -1) {
      // Currently not open
      // We add this index to the list of open collapsable areas to open it
      let newOpenCollapseSections = [...openCollapseSections, navigationMenuIndex];
      setOpenCollapseSections(newOpenCollapseSections);
    } else {
      // Currently open
      // We remove this index from the list of open collapsable areas to close it
      let newOpenCollapseSections = [...openCollapseSections].filter(item => item !== navigationMenuIndex);
      setOpenCollapseSections(newOpenCollapseSections);
    }
  }

  return (
    <div>
        <React.Fragment key={'left'}>
            <Drawer anchor={'left'} open={localShowLeftMenu} onClose={toggleDrawer(false)}>
                <div
                    className={classes.list}
                    role="presentation"
                >
                  <List>
                      {navigationMenu.map((item, index) => 
                          <Fragment key={`parent-${index}`}>
                            <ListItem 
                              onClick={() => {
                                if(item.path) {
                                  props.history.push(item.path)
                                  props.setShowLeftMenu(false)
                                } else if (item.children) {
                                  toggleOpenCollapseState(index)
                                }
                              }}
                              button
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {item.children &&
                                  <>
                                    {openCollapseSections.indexOf(index) > -1 ? <ExpandLess /> : <ExpandMore />}
                                  </>
                                }
                            </ListItem>
                            {item.children &&
                              <Collapse in={openCollapseSections.indexOf(index) > -1} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                  {item.children.map((child, childIndex) => 
                                      <ListItemButton
                                        onClick={() => {
                                          if(child.path.length > 0) {
                                            props.history.push(child.path)
                                            props.setShowLeftMenu(false)
                                          }
                                        }}
                                        key={`child-${index}-${childIndex}`}
                                        sx={{ pl: 4 }}
                                      >
                                        <ListItemIcon>{child.icon}</ListItemIcon>
                                        <ListItemText primary={child.text} />
                                      </ListItemButton>
                                  )}
                                </List>
                              </Collapse>
                            }
                          </Fragment>
                      )}
                  </List>
                </div>
            </Drawer>
        </React.Fragment>
    </div>
  );
}

export default withRouter(NavigationLeftSideBar)