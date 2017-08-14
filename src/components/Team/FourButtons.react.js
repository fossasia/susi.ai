
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { CardActions } from 'material-ui/Card';

class FourButtons extends Component {

    render() {

        const flatButtonStyle = {
            minWidth: '23%',
            fontSize: '25px',
            color: '#fff',
            padding: '0% 2%',
           marginRight:'5px',
           marginLeft:'5px'
        };
        const flatButtonStyleNone = {
            minWidth: '10%',
            fontSize: '25px',
            color: '#fff',
            padding: '0%',
            display: 'none'
        };
        let member= this.props.member;
        return (
            <div>
          <CardActions>
            <IconButton
              style={member.github==='#'?flatButtonStyleNone:flatButtonStyle}
              href={member.github}
              target="_blank"
            >
              <i className="fa fa-github"></i>
            </IconButton>
            <IconButton
              style={member.twitter==='#'?flatButtonStyleNone:flatButtonStyle}
              href={member.twitter}
              target="_blank"
            >
              <i className="fa fa-twitter"></i>
            </IconButton>
            <IconButton
              style={member.linkedin==='#'?flatButtonStyleNone:flatButtonStyle}
              href={member.linkedin}
              target="_blank"
            >
              <i className="fa fa-linkedin-square"></i>
            </IconButton>
            <IconButton
              style={member.blog==='#'?flatButtonStyleNone:flatButtonStyle}
              href={member.blog}
              target="_blank"
            >
              <i className="fa fa-globe"></i>
            </IconButton>
          </CardActions>
            </div>
        )
    }
}
FourButtons.propTypes = {
    member: PropTypes.object
}
export default FourButtons;
