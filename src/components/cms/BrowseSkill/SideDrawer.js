import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

const Button = styled.button`
  float: right;
  margin: 0.5rem 1rem;
  border-radius: 5px;
  background-color: #4285f4;
`;

const Icon = styled.i`
  padding: 0.4rem 0.4rem;
  color: #fff;
`;

export default function SideDrawer(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = props => (
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
      <Button onClick={toggleDrawer('left', true)} disable={false}>
        <Icon className="material-icons">filter_list</Icon>
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
