import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FilterList } from '@material-ui/icons';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

const Button = styled(Fab)`
  position: fixed;
  bottom: 16.5px;
  float: left;
  margin: 0.5rem 1rem;
  border-radius: 50%;
  background-color: #4285f4;
  z-index: 89;
`;

export default function SideDrawer(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (side, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = (props) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer('left', false)}
      onKeyDown={toggleDrawer('left', false)}
    >
      <>{props}</>
    </div>
  );

  return (
    <div>
      <Button
        color="primary"
        onClick={toggleDrawer('left', true)}
        disable={false}
      >
        <FilterList />
      </Button>
      <SwipeableDrawer
        open={state.left}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
      >
        {sideList(props.children)}
      </SwipeableDrawer>
    </div>
  );
}

SideDrawer.propTypes = {
  children: PropTypes.any,
};
