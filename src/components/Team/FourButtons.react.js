import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { CardActions } from 'material-ui/Card';

const flatButtonStyle = {
  minWidth: '23%',
  fontSize: '25px',
  color: '#fff',
  padding: '0% 2%',
  marginRight: '5px',
  marginLeft: '5px',
};

const flatButtonStyleNone = {
  minWidth: '10%',
  fontSize: '25px',
  color: '#fff',
  padding: '0%',
  display: 'none',
};

const FourButtons = props => {
  const member = props.member;
  return (
    <div>
      {member ? (
        <CardActions>
          <IconButton
            style={
              member.github === '#' ? flatButtonStyleNone : flatButtonStyle
            }
            href={member.github}
            target="_blank"
          >
            <i className="fa fa-github" />
          </IconButton>
          <IconButton
            style={
              member.twitter === '#' ? flatButtonStyleNone : flatButtonStyle
            }
            href={member.twitter}
            target="_blank"
          >
            <i className="fa fa-twitter" />
          </IconButton>
          <IconButton
            style={
              member.linkedin === '#' ? flatButtonStyleNone : flatButtonStyle
            }
            href={member.linkedin}
            target="_blank"
          >
            <i className="fa fa-linkedin-square" />
          </IconButton>
          <IconButton
            style={member.blog === '#' ? flatButtonStyleNone : flatButtonStyle}
            href={member.blog}
            target="_blank"
          >
            <i className="fa fa-globe" />
          </IconButton>
        </CardActions>
      ) : null}
    </div>
  );
};

FourButtons.propTypes = {
  member: PropTypes.object,
};
export default FourButtons;
