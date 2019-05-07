import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';

const styles = {
  contentStyle: {
    fontSize: '25px',
    color: '#fff',
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
            onClick={() =>
              window.open(
                'http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fchat.susi.ai&title=Let%27s%20chat%20with%20SUSI,%20the%20Open%20Source%20personal%20assistant!%0Ahttps%3A%2F%2Fsusi.ai.%20It%27s%20awesome%20%23susiai!%0A@susiai&source=chat.susi.ai',
                '_blank',
              )
            }
          >
            <i className="fa fa-github" />
          </IconButton>
          <IconButton
            style={twitter === '#' ? emptyStyle : contentStyle}
            onClick={() =>
              window.open(
                'http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fchat.susi.ai&title=Let%27s%20chat%20with%20SUSI,%20the%20Open%20Source%20personal%20assistant!%0Ahttps%3A%2F%2Fsusi.ai.%20It%27s%20awesome%20%23susiai!%0A@susiai&source=chat.susi.ai',
                '_blank',
              )
            }
          >
            <i className="fa fa-twitter" />
          </IconButton>
          <IconButton
            style={linkedin === '#' ? emptyStyle : contentStyle}
            onClick={() =>
              window.open(
                'http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fchat.susi.ai&title=Let%27s%20chat%20with%20SUSI,%20the%20Open%20Source%20personal%20assistant!%0Ahttps%3A%2F%2Fsusi.ai.%20It%27s%20awesome%20%23susiai!%0A@susiai&source=chat.susi.ai',
                '_blank',
              )
            }
          >
            <i className="fa fa-linkedin-square" />
          </IconButton>
          <IconButton
            style={blog === '#' ? emptyStyle : contentStyle}
            onClick={() =>
              window.open(
                'http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fchat.susi.ai&title=Let%27s%20chat%20with%20SUSI,%20the%20Open%20Source%20personal%20assistant!%0Ahttps%3A%2F%2Fsusi.ai.%20It%27s%20awesome%20%23susiai!%0A@susiai&source=chat.susi.ai',
                '_blank',
              )
            }
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
