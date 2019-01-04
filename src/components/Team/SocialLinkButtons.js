import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { CardActions } from 'material-ui/Card';

const styles = {
  contentStyle: {
    minWidth: '23%',
    fontSize: '25px',
    color: '#fff',
    padding: '0% 2%',
    marginRight: '5px',
    marginLeft: '5px',
  },
  emptyStyle: {
    minWidth: '10%',
    fontSize: '25px',
    color: '#fff',
    padding: '0%',
    display: 'none',
  },
};

const SocialLinkButtons = props => {
  const { github = '#', twitter = '#', linkedin = '#', blog = '#' } =
    props.member || {};
  const { contentStyle, emptyStyle } = styles;
  return (
    <div>
      {props.member ? (
        <CardActions>
          <IconButton
            style={github === '#' ? emptyStyle : contentStyle}
            href={github}
            target="_blank"
          >
            <i className="fa fa-github" />
          </IconButton>
          <IconButton
            style={twitter === '#' ? emptyStyle : contentStyle}
            href={twitter}
            target="_blank"
          >
            <i className="fa fa-twitter" />
          </IconButton>
          <IconButton
            style={linkedin === '#' ? emptyStyle : contentStyle}
            href={linkedin}
            target="_blank"
          >
            <i className="fa fa-linkedin-square" />
          </IconButton>
          <IconButton
            style={blog === '#' ? emptyStyle : contentStyle}
            href={blog}
            target="_blank"
          >
            <i className="fa fa-globe" />
          </IconButton>
        </CardActions>
      ) : null}
    </div>
  );
};

SocialLinkButtons.propTypes = {
  member: PropTypes.object,
};
export default SocialLinkButtons;
