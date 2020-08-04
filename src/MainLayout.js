import React from 'react';

// Note to self: CLSX is a dynmaic conditional class joining framework.
import clsx from 'clsx';

import {Drawer as MUIDrawer, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import DrawerContent from './DrawerContent';
// import {pink} from '@material-ui/core/colors';

//React.Fragment --> similar to div but for when you cannot have items within a div as they'll lose their functionality! 
// Use Fragment simialar to d3.group??

// Make sure to change the drawer width based on the size of the final drawer.
// Note the number is not a string or in pixels. The shifting won't work strings. The browser automatically translates this into pixels. (why?)
const drawerWidth = 400;
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        padding: '10px',
    },
// With this below, the size will be set to the drawerWidth. Without it, it will fit the content.
    drawerPaper: {
        width: drawerWidth,
        padding: '10px',
        // backgroundColor: "#f4f8ff",
      },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        backgroundColor: "#f4f8ff",
        height: "100vp"

    },

    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }
}));

export default function MainLayout() {
    const classes = useStyles();

    const drawerOpen = () => {setOpen(true)};
    const drawerClose = () => {setOpen(false)};
    const drawerToggle = () => {setOpen(!open)};

    const [open, setOpen] = React.useState(true);
    return (
        <div className={classes.root}>
            <MUIDrawer variant="persistent" open={open} anchor="left" className={classes.drawer} classes={{paper: classes.drawerPaper,}}>
                {/* <Typography variant="h2" color="initial"> This is a test!</Typography>
                <Button variant="contained" color="secondary" onClick={drawerClose}>
                    close drawer
                </Button> */}
                <DrawerContent />
            </MUIDrawer>
            <main className={clsx(classes.content, {[classes.contentShift]: open,})}>
                <Button variant="contained" color="primary" onClick={drawerToggle} fullWidth>
                    Toggle the Drawer
                </Button>
            </main>
        </div>
    )
}