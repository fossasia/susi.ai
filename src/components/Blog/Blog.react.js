import React, { Component } from 'react';
import './Blog.css';
import PropTypes from 'prop-types';
import htmlToText from 'html-to-text';
import $ from 'jquery';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import susi from '../../images/susi-logo.svg';
import dateFormat from 'dateformat';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Next from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import Previous from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import Loading from 'react-loading-animation';
import Footer from '../Footer/Footer.react';

class Blog extends Component {

    constructor(props){
        super(props);

        this.state = {
            posts: [],
            postRendered: false,
            startPage: 0,
            nextDisplay: 'visible',
            prevDisplay: 'hidden',
        }
    }

    componentDidMount() {

        document.title = 'Blog Posts about Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots - SUSI.AI';

        $('html, body').animate({ scrollTop: 0 }, 'fast');

        $.ajax({
        url: 'https://api.rss2json.com/v1/api.json',
        method: 'GET',
        dataType: 'json',
        data: {
            'rss_url': 'http://blog.fossasia.org/tag/susi-ai/feed/',
            'api_key': 'qsmzjtyycc49whsfvf5ikzottxrbditq3burojhd', // put your api key here
            'count': 50
        }
        }).done(function (response) {
            if(response.status !== 'ok'){ throw response.message; }
            this.setState({ posts: response.items, postRendered: true});
        }.bind(this));
    }

  scrollStep() {
    if (window.pageYOffset === 0) {
        clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - 1000);
  }

  scrollToTop() {
    let intervalId = setInterval(this.scrollStep.bind(this), 16.66);
    this.setState({ intervalId: intervalId });
  }

    previousPage = () => {
        let current = this.state.startPage;
        if(current-10 === 0) {
            this.setState({startPage: current-10, prevDisplay: 'hidden', nextDisplay: 'visible'})
        }
        else {
            this.setState({startPage: current-10, prevDisplay: 'visible', nextDisplay: 'visible'})
        }
        this.scrollToTop();
    }

    nextPage = () => {
        let current = this.state.startPage;
        let size = this.state.posts.length;
        console.log(size)
        if(current+10 === size-10 ) {
            this.setState({startPage: current+10, nextDisplay: 'hidden', prevDisplay: 'visible'})
        }
        else {
            this.setState({startPage: current+10, prevDisplay: 'visible', nextDisplay: 'visible'})
        }
        this.scrollToTop();
    }


    render() {

      const nextStyle = {
          visibility: this.state.nextDisplay,
          marginLeft: '10px'
      }

      const prevStyle = {
          visibility: this.state.prevDisplay
      }

      const loadingStyle = {
        marginTop : '20px',
        position : 'relative',
      }


          return (
              <div>
                  <StaticAppBar {...this.props}
                      location={this.props.location} />
                      <div className='head_section'>
                          <div className='container'>
                              <div className="heading">
                                  <h1>Blog</h1>
                                  <p>Latest Blog Posts on SUSI.AI</p>
                              </div>
                          </div>
                      </div>
                      <Loading
                        style={loadingStyle}
                        isLoading={!this.state.postRendered}/>
                      {!this.state.postRendered &&
                        (<div><center>Fetching Blogs..</center></div>)}
                      {this.state.postRendered && (<div>
                      <div>
                          {
                              this.state.posts
                              .slice(this.state.startPage,this.state.startPage+10)
                              .map((posts , i) => {
                                  let description = htmlToText.fromString(posts.description).split('…');
                                  let text = description[0].split(']');
                                  let image = susi
                                  let regExp = /\[(.*?)\]/;
                                  let imageUrl = regExp.exec(description[0]);
                                  if(imageUrl) {
                                    image = imageUrl[1]
                                  }
                                  let date = posts.pubDate.split(' ');
                                  let d = new Date(date[0]);
                                      return (
                                          <div key={i} className="section_blog">
                                              <Card>
                                                  <CardMedia
                                                      overlay={
                                                          <CardTitle
                                                              subtitle={'Published on '+ dateFormat(d, 'dddd, mmmm dS, yyyy')} />
                                                      }
                                                  >
                                                      <img className="featured_image"
                                                          src={image}
                                                          alt={posts.title}
                                                      />
                                                  </CardMedia>
                                                  <CardTitle title={posts.title} subtitle={'by '+ posts.author} />
                                                  <CardText>{text[1]+'...'} </CardText>
                                                  <CardActions>
                                                      <FlatButton href={posts.link} label="Read More" />
                                                  </CardActions>
                                              </Card>
                                          </div>
                                      )
                              })
                          }
                      </div>
                        <div className="blog_navigation">
                          <FloatingActionButton
                              style={prevStyle}
                              backgroundColor={'#4285f4'}
                              onTouchTap={this.previousPage}>
                              <Previous />
                          </FloatingActionButton>
                          <FloatingActionButton
                              style={nextStyle}
                              backgroundColor={'#4285f4'}
                              onTouchTap={this.nextPage}>
                              <Next />
                          </FloatingActionButton>
                        </div>
                      <div className="post_bottom"></div>
                          <Footer />
                    </div>)}
              </div>
          );
    }
}
Blog.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object

}

export default Blog;
