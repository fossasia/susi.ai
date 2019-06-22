import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';

const styles = {
  contentStyle: {
    fontSize: '1.563rem',
    color: '#fff',
    marginRight: '0.313rem',
    marginLeft: '0.313rem',
  },
  emptyStyle: {
    minWidth: '10%',
    fontSize: '1.563rem',
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
            onClick={() => window.open(github, '_blank')}
          >
            <i className="fa fa-github" />
          </IconButton>
          <IconButton
            style={twitter === '#' ? emptyStyle : contentStyle}
            onClick={() => window.open(twitter, '_blank')}
          >
            <i className="fa fa-twitter" />
          </IconButton>
          <IconButton
            style={linkedin === '#' ? emptyStyle : contentStyle}
            onClick={() => window.open(linkedin, '_blank')}
          >
            <i className="fa fa-linkedin-square" />
          </IconButton>
          <IconButton
            style={blog === '#' ? emptyStyle : contentStyle}
            onClick={() => window.open(blog, '_blank')}
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
