import React, { Component } from 'react';
import './Blog.css';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import susi from '../../images/susi-logo.svg';
import dateFormat from 'dateformat';
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
        if(this.state.postRendered) {
            console.log('Hi');
        }
        console.log(this.state.posts);
        if(this.state.postRendered) {
            return (
                <div>
                    <StaticAppBar {...this.props}
                        location={this.props.location} />
                        <div className='head_section'>
                            <div className='container'>
                                <div className="heading">
                                    <h1>Blogs</h1>
                                    <p>Latest Blogs on SUSI.AI</p>
                                </div>
                            </div>
                        </div>
                        <div className="top-card">
                            {
                                this.state.posts.map((posts , i) => {
                                    let text = posts.description.split('…');
                                    let date = posts.pubDate.split(' ');
                                    let d = new Date(date[0]);
                                        return (
                                            <div key={i} className="section_copy">
                                                <Card  className='blog-card'>
                                                    <CardMedia
                                                        overlay={
                                                            <CardTitle
                                                                subtitle={'Published on '+ dateFormat(d, 'dddd, mmmm dS, yyyy')} />
                                                        }
                                                    >
                                                        <img
                                                            src={susi}
                                                             alt={posts.title}
                                                        />
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
                        </div>
                        <div className='footer'>
                            <a className='susi-logo-anchor' href='/overview'>
                                <img src={susi} alt='SUSI' className='susi-logo' />
                            </a>
                            <div className="footer_content">
                                <div className='footer-container'>
                                    <ul className='alignLeft'>
                                        <li><a href='/overview'>Overview</a></li>
                                        <li><a href='/blog'>Blog</a></li>
                                        <li><a href='https://github.com/fossasia?utf8=%E2%9C%93&q=susi'>Code</a></li>
                                    </ul>
                                    <ul className='alignRight'>
                                        <li><a href='/settings'>Settings</a></li>
                                        <li><a href='/terms'>Terms</a></li>
                                        <li><a href='/contact'>Contact</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                </div>
            );
        }
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
