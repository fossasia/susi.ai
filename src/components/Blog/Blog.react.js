import React, { Component } from 'react';
import './Blog.css';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import StaticAppBar from '../StaticAppBar/StaticAppBar.react';

class Blog extends Component {

    constructor(props){
        super(props);

        this.state = {
            posts: [],
            postRendered: false,
        }
    }

    componentDidMount() {

        $.ajax({
        url: 'https://api.rss2json.com/v1/api.json',
        method: 'GET',
        dataType: 'json',
        data: {
            'rss_url': 'http://blog.fossasia.org/tag/susi-ai/feed/'
        }
        }).done(function (response) {
            if(response.status !== 'ok'){ throw response.message; }
            // console.log('====== ' + response.feed.title + ' ======');
            // for(var i in response.items){
            //     var item = response.items[i];
            //     console.log(item.title);
            // }
            this.setState({ posts: response.items, postRendered: true });
        }.bind(this));
    }


    render() {
        let post;
        if(this.state.postRendered) {
            console.log('Hi');
            post = this.state.posts.map((posts , i) => {
                let text = posts.description.split('…');
                    return (
                        <div key={i} className="section">
                            <Card  className='blog-card'>
                                <CardMedia >
                                </CardMedia>
                                <CardTitle title={posts.title} subtitle={'by '+ posts.author} />
                                <CardText>{text[0]+'...'} </CardText>
                                <CardActions>
                                    <FlatButton href={posts.link} label="Read More" />
                                </CardActions>
                            </Card>
                        </div>
                    )
            })
        }
        console.log(this.state.posts);
        return (
            <div>
                <StaticAppBar {...this.props}
                    location={this.props.location} />
                    <div className="top-card">
                        {post}
                    </div>
            </div>
        );
    }
}
Blog.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object

}

export default Blog;
