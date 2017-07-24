import React, { Component } from 'react';
import './Blog.css';
import PropTypes from 'prop-types';


import StaticAppBar from '../StaticAppBar/StaticAppBar.react';

class Blog extends Component {
    render() {
        return (
            <div>
                <StaticAppBar {...this.props}
                    location={this.props.location} />
            </div>
        );
    }
}
Blog.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object

}

export default Blog;
