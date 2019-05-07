import React, { Component } from 'react';
import PropTypes from 'prop-types';
import htmlToText from 'html-to-text';
import { connect } from 'react-redux';
import {
  Card,
  CardMedia,
  CardTitle,
  CardText,
  CardActions,
} from 'material-ui/Card';
import dateFormat from 'dateformat';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { ShareButtons, generateShareIcon } from 'react-share';
import renderHTML from 'react-render-html';
import Loading from 'react-loading-animation';
import Footer from '../Footer/Footer.react';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import { getBlogReponse } from '../../apis';
import './Blog.css';
import 'font-awesome/css/font-awesome.min.css';
import Next from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import Previous from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import susi from '../../images/susi-logo.svg';
import ToTopButton from '../Button/ToTopButton.react';
const { FacebookShareButton, TwitterShareButton } = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

const loadingStyle = {
  marginTop: '20px',
  position: 'relative',
};
const allCategories = [
  'FOSSASIA',
  'GSoC',
  'SUSI.AI',
  'Tutorial',
  'Android',
  'API',
  'App generator',
  'CodeHeat',
  'Community',
  'Event',
  'Event Management',
  'loklak',
  'Meilix',
  'Open Event',
  'Phimpme',
  'Pocket Science Lab',
  'yaydoc',
];

const arrDiff = (a1, a2) => {
  let a = [],
    diff = [];
  for (let f = 0; f < a1.length; f++) {
    a[a1[f]] = true;
  }
  for (let z = 0; z < a2.length; z++) {
    if (a[a2[z]]) {
      delete a[a2[z]];
    } else {
      a[a2[z]] = true;
    }
  }
  for (let k in a) {
    diff.push(k);
  }
  return diff;
};

class Blog extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    blogKey: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postRendered: false,
      startPage: 0,
      nextDisplay: 'visible',
      prevDisplay: 'hidden',
    };
  }

  componentDidMount() {
    const { blogKey } = this.props;
    document.title =
      'Blog Posts about Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots - SUSI.AI';
    scrollToTopAnimation();
    if (blogKey) {
      this.getPosts(blogKey);
    }
  }

  componentWillReceiveProps = props => {
    const { blogKey } = props;
    const { posts } = this.state;
    if (posts.length === 0 && blogKey) {
      this.getPosts(blogKey);
    }
  };

  getPosts = blogKey => {
    getBlogReponse(blogKey)
      .then(payload => {
        if (payload.status !== 'ok') {
          throw payload.message;
        }
        this.setState({ posts: payload.items, postRendered: true });
      })
      .catch(error => {
        console.log("Couldn't fetch blog response");
      });
  };

  scrollStep = () => {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - 1000);
  };
  //  Function to scroll to top of page
  scrollToTop() {
    const intervalId = setInterval(this.scrollStep, 16.66);
    this.setState({ intervalId: intervalId });
  }
  // Function to navigate to previous page
  previousPage = () => {
    const current = this.state.startPage;
    if (current - 10 === 0) {
      this.setState({
        startPage: current - 10,
        prevDisplay: 'hidden',
        nextDisplay: 'visible',
      });
    } else {
      this.setState({
        startPage: current - 10,
        prevDisplay: 'visible',
        nextDisplay: 'visible',
      });
    }
    this.scrollToTop();
  };
  // Function to navigate to next page
  nextPage = () => {
    const current = this.state.startPage;
    const size = this.state.posts.length;
    if (current + 10 === size - 10) {
      this.setState({
        startPage: current + 10,
        nextDisplay: 'hidden',
        prevDisplay: 'visible',
      });
    } else {
      this.setState({
        startPage: current + 10,
        prevDisplay: 'visible',
        nextDisplay: 'visible',
      });
    }
    this.scrollToTop();
  };

  render() {
    const nextStyle = {
      visibility: this.state.nextDisplay,
      marginLeft: '10px',
    };

    const prevStyle = {
      visibility: this.state.prevDisplay,
    };

    return (
      <div>
        <StaticAppBar {...this.props} location={this.props.location} />
        <div className="head_section">
          <div className="container">
            <div className="heading">
              <h1>Blog</h1>
              <p>Latest Blog Posts on SUSI.AI</p>
            </div>
          </div>
        </div>
        <Loading style={loadingStyle} isLoading={!this.state.postRendered} />
        {!this.state.postRendered && (
          <div>
            <center>Fetching Blogs..</center>
          </div>
        )}
        {this.state.postRendered && (
          <div>
            <div style={{ width: '100%' }}>
              {this.state.posts
                .slice(this.state.startPage, this.state.startPage + 10)
                .map((posts, i) => {
                  const description = htmlToText
                    .fromString(posts.description)
                    .split('…');
                  const content = posts.content;
                  let category = [];
                  posts.categories.forEach(cat => {
                    let k = 0;
                    for (k = 0; k < allCategories.length; k++) {
                      if (cat === allCategories[k]) {
                        category.push(cat);
                      }
                    }
                  });

                  const tags = arrDiff(category, posts.categories);
                  const fCategory = category.map(cat => (
                    <span key={cat}>
                      <a
                        className="tagname"
                        href={
                          'http://blog.fossasia.org/category/' +
                          cat.replace(/\s+/g, '-').toLowerCase()
                        }
                        rel="noopener noreferrer"
                      >
                        {cat}
                      </a>
                    </span>
                  ));
                  const ftags = tags.map(tag => (
                    <span key={tag}>
                      <a
                        className="tagname"
                        href={
                          'http://blog.fossasia.org/tag/' +
                          tag.replace(/\s+/g, '-').toLowerCase()
                        }
                        rel="noopener noreferrer"
                      >
                        {tag}
                      </a>
                    </span>
                  ));
                  let htmlContent = content.replace(/<img.*?>/, '');
                  htmlContent = renderHTML(htmlContent);
                  let image = susi;
                  const regExp = /\[(.*?)\]/;
                  const imageUrl = regExp.exec(description[0]);
                  if (imageUrl) {
                    image = imageUrl[1];
                  }
                  const date = posts.pubDate.split(' ');
                  const d = new Date(date[0]);
                  return (
                    <div key={i} className="section_blog">
                      <Card style={{ width: '100%', padding: '0' }}>
                        <CardMedia
                          overlay={
                            <CardTitle
                              className="noUnderline"
                              subtitle={renderHTML(
                                '<a href="' +
                                  posts.link +
                                  '" >Published on ' +
                                  dateFormat(d, 'dddd, mmmm dS, yyyy') +
                                  '</a>',
                              )}
                            />
                          }
                        >
                          <img
                            className="featured_image"
                            src={image}
                            alt={posts.title}
                          />
                        </CardMedia>
                        <CardTitle
                          className="noUnderline"
                          title={posts.title}
                          subtitle={renderHTML(
                            'by <a href="http://blog.fossasia.org/author/' +
                              posts.author +
                              '" >' +
                              posts.author +
                              '</a>',
                          )}
                        />
                        <CardText style={{ fontSize: '16px' }}>
                          {' '}
                          {htmlContent}
                        </CardText>
                        <div className="social-btns">
                          <TwitterShareButton
                            url={posts.guid}
                            title={posts.title}
                            via="asksusi"
                            hashtags={posts.categories.slice(0, 4)}
                          >
                            <TwitterIcon size={32} round={true} />
                          </TwitterShareButton>
                          <FacebookShareButton url={posts.link}>
                            <FacebookIcon size={32} round={true} />
                          </FacebookShareButton>
                        </div>
                        <CardActions className="cardActions">
                          <span className="calendarContainer">
                            <i className="fa fa-calendar tagIcon" />
                            {renderHTML(
                              '<a href="' +
                                posts.link +
                                '">' +
                                dateFormat(d, 'mmmm dd, yyyy') +
                                '</a>',
                            )}
                          </span>
                          <span className="authorsContainer">
                            <i className="fa fa-user tagIcon" />
                            <a
                              rel="noopener noreferrer"
                              href={
                                'http://blog.fossasia.org/author/' +
                                posts.author
                              }
                            >
                              {posts.author}
                            </a>
                          </span>
                          <span className="categoryContainer">
                            <i className="fa fa-folder-open-o tagIcon" />
                            {fCategory}
                          </span>
                          <span className="tagsContainer">
                            <i className="fa fa-tags tagIcon" />
                            {ftags}
                          </span>
                        </CardActions>
                      </Card>
                    </div>
                  );
                })}
            </div>
            <div className="blog_navigation">
              <FloatingActionButton
                style={prevStyle}
                backgroundColor={'#4285f4'}
                onClick={this.previousPage}
              >
                <Previous />
              </FloatingActionButton>
              <FloatingActionButton
                style={nextStyle}
                backgroundColor={'#4285f4'}
                onClick={this.nextPage}
              >
                <Next />
              </FloatingActionButton>
            </div>
            <div className="post_bottom" />
            <Footer />
          </div>
        )}
        <ToTopButton />
      </div>
    );
  }
}

function mapStateToProps(store) {
  const { blogKey } = store.app.apiKeys;
  return {
    blogKey,
  };
}

export default connect(
  mapStateToProps,
  null,
)(Blog);
