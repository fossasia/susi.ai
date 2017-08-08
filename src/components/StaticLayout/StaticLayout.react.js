import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
class StaticLayout extends Component {

    closeVideo = () => this.setState({
        video: false
    })
    render() {
        return (
            <div>
                <Link to="/overview"> Overview</Link>
                <Link to="/team"> Team</Link>

                {this.props.children}
            </div>
        );
    }
}

StaticLayout.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    children: PropTypes.object,

}
export default StaticLayout;
