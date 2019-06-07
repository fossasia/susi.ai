import React, { Component } from 'react';
import PropTypes from 'prop-types';
import htmlToText from 'html-to-text';
import { connect } from 'react-redux';
import { Card, CardMedia } from '@material-ui/core';
import dateFormat from 'dateformat';
import Fab from '@material-ui/core/Fab';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderHTML from 'react-render-html';
import Loading from 'react-loading-animation';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import { getBlogReponse } from '../../apis';
import './Blog.css';
import 'font-awesome/css/font-awesome.min.css';
import Next from '@material-ui/icons/KeyboardArrowRight';
import Previous from '@material-ui/icons/KeyboardArrowLeft';
import susi from '../../images/susi-logo.svg';
import ToTopButton from '../Button/ToTopButton.react';
import { Header } from '../shared/About';

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

const styles = {
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  card: {
    position: 'relative',
  },
  overlay: {
    position: 'relative',
    left: '0px',
    background: 'rgba(0, 0, 0, 0.54)',
    width: '100%',
    padding: '1rem',
    marginTop: '-3.5rem',
  },
  link: {
    fontSize: '0.875rem',
    textDecoration: 'none',
  },
};

const FlexBox = styled.div`
  display: flex;
  align-items: baseline;
  color: rgba(51, 51, 51, 0.7);
  line-height: 25px;
  margin-right: 2rem;
`;

const BlogPostContainer = styled.div`
  padding: 1rem;
`;

const BlogFooter = styled.div`
  padding: 3rem;
  background: #f7f7f7;
  display: flex;
  flex-wrap: wrap;
`;

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
      showScrollToTop: false,
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
    /* Adding scroll event Listener to window,
    to display ToTopButton only when the user has scrolled 90px*/
    window.addEventListener('scroll', this.showScrollToTop);
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

  showScrollToTop = () => {
    this.setState({
      showScrollToTop: window.scrollY >= 90,
    });
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.showScrollToTop);
  }

  render() {
    const nextStyle = {
      visibility: this.state.nextDisplay,
      marginLeft: '10px',
    };

    const prevStyle = {
      visibility: this.state.prevDisplay,
    };

    const { showScrollToTop } = this.state;

    return (
      <div>
        <Header title="Blog" subtitle="Latest Blog Posts on SUSI.AI" />
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
                  const fCategory = category
                    .map(cat => (
                      <a
                        key={cat}
                        href={
                          'http://blog.fossasia.org/category/' +
                          cat.replace(/\s+/g, '-').toLowerCase()
                        }
                        rel="noopener noreferrer"
                      >
                        {cat}
                      </a>
                    ))
                    .reduce((prev, curr) => [prev, ', ', curr]);
                  const ftags = tags
                    .map(tag => (
                      <a
                        key={tag}
                        href={
                          'http://blog.fossasia.org/tag/' +
                          tag.replace(/\s+/g, '-').toLowerCase()
                        }
                        rel="noopener noreferrer"
                      >
                        {tag}
                      </a>
                    ))
                    .reduce((prev, curr) => [prev, ', ', curr]);
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
                      <Card style={styles.card}>
                        <CardMedia
                          image={image}
                          className="featured_image"
                          style={styles.media}
                        />
                        <div style={styles.overlay}>
                          <a
                            style={{
                              ...styles.link,
                              color: 'rgba(255, 255, 255, 0.54)',
                            }}
                            href={posts.link}
                          >{`Published on ${dateFormat(
                            d,
                            'dddd, mmmm dS, yyyy',
                          )}`}</a>
                        </div>
                        <BlogPostContainer>
                          <Typography variant="h4">{posts.title}</Typography>
                          <Typography
                            variant="subtitle1"
                            style={{
                              ...styles.link,
                              color: 'rgba(0, 0, 0, 0.54)',
                              marginBottom: '2rem',
                            }}
                          >
                            by
                            <a
                              style={{ paddingLeft: '0.3rem' }}
                              href={`http://blog.fossasia.org/author/${posts.author}`}
                            >
                              {posts.author}
                            </a>
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {htmlContent}
                          </Typography>
                        </BlogPostContainer>
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
                        <BlogFooter>
                          <FlexBox>
                            <i className="fa fa-calendar tagIcon" />
                            <a
                              style={{ whiteSpace: 'nowrap' }}
                              href={posts.link}
                            >
                              {dateFormat(d, 'mmmm dd, yyyy')}
                            </a>
                          </FlexBox>
                          <FlexBox>
                            <i className="fa fa-user tagIcon" />
                            <a
                              style={{ whiteSpace: 'nowrap' }}
                              rel="noopener noreferrer"
                              href={
                                'http://blog.fossasia.org/author/' +
                                posts.author
                              }
                            >
                              {posts.author}
                            </a>
                          </FlexBox>
                          <FlexBox>
                            <i className="fa fa-folder-open-o tagIcon" />
                            {fCategory}
                          </FlexBox>
                          <FlexBox>
                            <i className="fa fa-tags tagIcon" />
                            <div>{ftags}</div>
                          </FlexBox>
                        </BlogFooter>
                      </Card>
                    </div>
                  );
                })}
            </div>
            <div className="blog_navigation">
              <Fab
                style={prevStyle}
                onClick={this.previousPage}
                color="primary"
              >
                <Previous />
              </Fab>
              <Fab style={nextStyle} onClick={this.nextPage} color="primary">
                <Next />
              </Fab>
            </div>
            <div className="post_bottom" />
          </div>
        )}
        <div style={{ display: showScrollToTop ? 'inline-block' : 'none' }}>
          <ToTopButton />
        </div>
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
